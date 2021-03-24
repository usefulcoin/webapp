import * as React from "react";
import styled from "styled-components";
import { getOptionsAndCloses, sendExpire, sendExercise, getLatestPrice, getOptionData } from "../helpers/web3";
import {add, floorDivide} from '../helpers/bignumber';

import OptionVis from 'src/components/OptionVis';
import OptionTable from 'src/components/OptionTable';
import Loading from 'src/components/Loading';
import { colors } from 'src/styles';

const SStake = styled.div`
    width:100%;
    height:100%;
`
const SHelper = styled.div`
    font-size: x-small;
`

interface IExerciseProps {
    address: string
    chainId: number
    web3: any
}


interface IExerciseState {
    address: string;
    web3: any;
    chainId: number;
    pendingRequest: boolean;
    error: string;
    options: [];
    currentPrice: number;
    priceInterval: any;
    optionsInterval: any;
    calls: number;
    puts: number;
    exercised: number;
    expired: number;
    avgValue: number;
}

const INITIAL_STATE: IExerciseState = {
    address: "",
    web3: null,
    chainId: 1,
    pendingRequest: false,
    error: "",
    options: [],
    currentPrice: 0,
    priceInterval: null,
    optionsInterval: null,

    // used for snapshot visualization
    calls: 0,
    puts: 0,
    exercised: 0,
    expired: 0,
    avgValue: 0
};
class Exercise extends React.Component<any, any> {
    // @ts-ignore
    public state: IExerciseState;

    constructor(props: IExerciseProps) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
        this.state.web3 = props.web3;
        this.state.address = props.address;
        this.state.chainId = props.chainId;
    }

    public componentDidMount() {
        this.loadOpenOptions();
        this.loadCurrentPrice();

        this.setState({
            priceInterval: setInterval(() => {
                this.loadCurrentPrice()
            }, 10000)
        });
        this.setState({
            optionInterval: setInterval(() => {
                this.loadOpenOptions()
            }, 30000)
        });
    }


    public componentWillUnmount() {
        clearInterval(this.state.priceInterval);
        clearInterval(this.state.optionsInterval);
    }

    public async loadCurrentPrice() {
        const { chainId, web3 } = this.state;
        const latestPrice = await getLatestPrice(chainId, web3);

        // tslint:disable-next-line:no-console
        console.log(`latestRound is ${latestPrice}`);
        this.setState({ currentPrice: latestPrice });
    }

    public async loadOpenOptions() {
        const { chainId, web3 } = this.state;

        const options: any = await getOptionsAndCloses(chainId, web3);


        // tslint:disable-next-line:no-console
        console.log("options");
        // tslint:disable-next-line:no-console
        console.log(options);
        const optionsObjects = {};
        for (let i = 0; i < options.length; i++) {
            // tslint:disable-next-line:no-console
            console.log(`loaded event ${options[i]}`);
            // tslint:disable-next-line:no-console
            console.log(options[i]);
            if (options[i].returnValues) {
                if (options[i].returnValues.id !== undefined) {// ensurese we skip other events
                    if (options[i].returnValues.sP === undefined) {
                        // modifier
                        optionsObjects[options[i].returnValues.id].complete = true;
                        if (options[i].event === "Expire") {
                            optionsObjects[options[i].returnValues.id].expired = true;
                        }
                        if (options[i].event === "Exercise") {
                            optionsObjects[options[i].returnValues.id].exercised = true;
                        }
                    } else {
                        const optionData: any = await getOptionData(options[i].returnValues.id, web3, chainId);
                        // tslint:disable-next-line:no-console
            console.log("loaded option data");
           // tslint:disable-next-line:no-console
           console.log(optionData);
                        optionsObjects[options[i].returnValues.id] = {
                            blockNumber: options[i].blockNumber,
                            purchaseRound: options[i].returnValues.pR,
                            exp: options[i].returnValues.exp,
                            id: options[i].returnValues.id,
                            creator: options[i].returnValues.account,
                            strikePrice: options[i].returnValues.sP,
                            lockedValue: options[i].returnValues.lV,
                            purchaseValue: optionData.pV,
                            type: options[i].returnValues.dir,
                            complete: false
                        }
                    }
                }
            }


        }

        const sorted = Object.keys(optionsObjects).sort((a: any, b: any) => b - a);

        // tslint:disable-next-line:no-console
        console.log(`sorted $`);
        // tslint:disable-next-line:no-console
        console.log(sorted);
        let calls = 0;
        let puts = 0;
        let exercised = 0;
        let expired = 0;
        let avgValue: any = 0;
        const sortedOptions: any = [];
        sorted.forEach((id: any) => {
            if (optionsObjects[id].type === "1") {
                calls += 1;
            } else {
                puts += 1;
            }
            if (optionsObjects[id].exercised) {
                exercised += 1;
            } else if (optionsObjects[id].expired) {
                expired += 1;
            }

        // tslint:disable-next-line:no-console
        console.log(`avgValue ${avgValue}`);
            avgValue = add(avgValue, optionsObjects[id].lockedValue);

        // tslint:disable-next-line:no-console
        console.log(`avgValue after ${avgValue}. purchase value of option = ${optionsObjects[id].purchaseValue}`);
            sortedOptions.push(optionsObjects[id]);

        });

        // tslint:disable-next-line:no-console
        console.log(`totalValue ${avgValue}`);
        avgValue = floorDivide(avgValue, sorted.length);
        // tslint:disable-next-line:no-console
        console.log(`avgValue ${avgValue}`);

        // tslint:disable-next-line:no-console
        console.log(sortedOptions);
        this.setState({ options: sortedOptions, calls, puts, exercised, expired, avgValue })
    }



    public async handleExpire(optionId: any) {
        this.setState({ pendingRequest: true });
        const { address, chainId, web3 } = this.state
        try {
            await sendExpire(address, optionId, chainId, web3, (p1: any, p2: any) => {

                // tslint:disable-next-line:no-console
                console.log(p1, p2);
                this.loadOpenOptions();
                this.setState({ error: "", pendingRequest: false });

            });
        } catch (e) {
            this.setState({ error: "Expire Failed", pendingRequest: false });
        }
    }

    public async handleExercise(optionId: any) {
        this.setState({ pendingRequest: true });
        const { address, chainId, web3 } = this.state
        try {

            // tslint:disable-next-line:no-console
            console.log(`sending exercise for opton ${optionId}`);
            await sendExercise(address, optionId, chainId, web3, (p1: any, p2: any) => {

                // tslint:disable-next-line:no-console
                console.log(p1, p2);
                this.loadOpenOptions();
                this.setState({ error: "", pendingRequest: false });

            });
        } catch (e) {
            this.setState({ error: "Exercise Failed", pendingRequest: false });
        }
    }


    public render() {
        const { avgValue, calls, puts, exercised, expired, pendingRequest, error, web3, options, currentPrice } = this.state;

        return (
            <SStake>

                <h1>Settle</h1>
                <p>Earn a settlement fee for exercising in-the-money options or unlocking expired options.</p>
                <SHelper>Settlement fees shown do not include gas/transaction fees.</SHelper>
                <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>
                {
                    pendingRequest ?
                        <Loading />
                        :
                        <>
                        <OptionTable
                            showFee={true}
                            web3={web3}
                            options={options}
                            handleExpire={(optionId: any) => this.handleExpire(optionId)}
                            handleExercise={(optionId: any) => this.handleExercise(optionId)}
                            currentPrice={currentPrice}
                        />

                        </>
                }
                <OptionVis
                            calls={calls}
                            puts={puts}
                            exercised={exercised}
                            expired={expired}
                            avgValue={web3.utils.fromWei(`${avgValue}`, "ether")}
                        />


            </SStake>

        )
    }

}

export default Exercise
