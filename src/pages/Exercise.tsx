import * as React from "react";
import styled from "styled-components";
import { getOptionsAndCloses, sendComplete, getLatestPrice, getOptionData, callCurrentRoundID } from "../helpers/web3";
import { add, floorDivide } from '../helpers/bignumber';

import OptionVis from 'src/components/OptionVis';
import OptionTable from 'src/components/OptionTable';
import Loading from 'src/components/Loading';
import { colors } from 'src/styles';
import { enabledPricePairs } from "../constants";

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
    currentRound: any;
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
    currentRound: 0,// current oracle round

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

        
        console.log(`latestRound is ${latestPrice}`);
        this.setState({ currentPrice: latestPrice });
    }

    public async loadOpenOptions() {
        const { chainId, web3 } = this.state;

        const options: any = await getOptionsAndCloses(chainId, web3);

        const cr: any = await callCurrentRoundID(chainId, web3, enabledPricePairs[0].address);


        
        console.log("options");
        
        console.log(options);
        const optionsObjects = {};
        for (let i = 0; i < options.length; i++) {
            
            console.log(`loaded event ${options[i]}`);
            
            console.log(options[i]);
            if (options[i].returnValues) {
                if (options[i].returnValues.id !== undefined) {// ensurese we skip other events
                    if (options[i].returnValues.sP === undefined) {
                        // modifier
                        if (optionsObjects[options[i].returnValues.id] !== undefined) {
                            optionsObjects[options[i].returnValues.id].complete = true;
                            if (options[i].event === "Expire") {
                                optionsObjects[options[i].returnValues.id].expired = true;
                            }
                            if (options[i].event === "Exercise") {
                                optionsObjects[options[i].returnValues.id].exercised = true;
                            }
                        }
                    } else {
                        const optionData: any = await getOptionData(options[i].returnValues.id, web3, chainId);
                        
                        console.log("loaded option data");
                        
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

        
        console.log(`sorted $`);
        
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

            
            console.log(`avgValue ${avgValue}`);
            avgValue = add(avgValue, optionsObjects[id].lockedValue);

            
            console.log(`avgValue after ${avgValue}. purchase value of option = ${optionsObjects[id].purchaseValue}`);
            sortedOptions.push(optionsObjects[id]);

        });

        
        console.log(`totalValue ${avgValue}`);
        avgValue = floorDivide(avgValue, sorted.length);
        
        console.log(`avgValue ${avgValue}`);

        
        console.log(sortedOptions);
        this.setState({ options: sortedOptions, calls, puts, exercised, expired, avgValue, currentRound: cr })
    }





    public async handleComplete(optionId: any) {
        this.setState({ pendingRequest: true });
        const { address, chainId, web3 } = this.state
        try {

            
            console.log(`sending exercise for opton ${optionId}`);
            await sendComplete(address, optionId, chainId, web3, (p1: any, p2: any) => {

                
                console.log(p1, p2);
                this.loadOpenOptions();
                this.setState({ error: "", pendingRequest: false });

            });
        } catch (e) {
            this.setState({ error: "Exercise Failed", pendingRequest: false });
        }
    }


    public render() {
        const { currentRound, avgValue, calls, puts, exercised, expired, pendingRequest, error, web3, options, currentPrice } = this.state;

        return (
            <SStake>

                <h1 style={{ color: `rgb(${colors.black})` }}>Settle Options</h1>
                <p style={{ color: `rgb(${colors.black})` }}>Earn a settlement fee for exercising in-the-money options or unlocking expired options.</p>
                <SHelper style={{ color: `rgb(${colors.black})` }}>Settlement fees shown do not include gas/transaction fees.</SHelper>
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
                                handleComplete={(optionId: any) => this.handleComplete(optionId)}
                                currentPrice={currentPrice}
                                currentRound={currentRound}
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
