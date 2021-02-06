import * as React from "react";
import styled from "styled-components";
import { initiateSwapIfAvailable, sendExercise, sendExpire, callPoolTotalSupply, getLatestPrice, callPoolStakedBalance, callPoolMaxAvailable, getRate, blockTimestamp, getOptionCreation, getOptionCloses, getTotalInterchange } from "../helpers/web3";


// import Right from "../assets/right.png";
import { makeBet } from "../helpers/web3";

import { enabledPricePairs } from "../constants";

import Column from 'src/components/Column';
import OptionTable from 'src/components/OptionTable';
import BetButton from 'src/components/BetButton';
import Loading from 'src/components/Loading';
import PriceChart from 'src/components/PriceChart';
import { colors } from 'src/styles';
import { convertAmountFromRawNumber, formatFixedDecimals, floorDivide, divide } from 'src/helpers/bignumber';

const SBet = styled.div`
    width:100%;
    height:100%;
`
const SHelper = styled.div`
    font-size: x-small;
`

const SBetter = styled.div`
    display: flex;
    flex-direction: row;
    height: 300px;
    width: 450px;
`
const SInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 0 auto;
    align-items: stretch;
`

const SInputBbContainer = styled.div`
    flex: 1;
    height: 75px;
    text-transform: uppercase;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    font-weight: bold;
    font-size: 1.05rem;
    margin-top: 10px;
    border-radius: 8px;
`
const SInputBb = styled.input`
    text-align: center;
    border: none;
    margin: 5px;
    margin-left: 0px;
    height: 30px;
    font-weight: bold;
    font-size: 1.3rem;
    width: 100%;
    display: block; 
    margin-bottom:1px;
`

const SInputBox = styled.div`
position: relative;
`

const SBetButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`;

const SSelect = styled.select`
    border-radius: 8px;
    height: 44px;
    width: 100%;
    user-select: none;
    flex: 1;
`;

const SInterface = styled.div`
    background-color: rgb(${colors.darkGrey});
    padding: 10px;
    border-radius: 8px;
`

const Times = {
    "1 HOUR": 60 * 60,/* 
    "30 MIN": 60*30,
    "15 MIN": 60*15, */
};




interface IBetProps {
    address: string
    chainId: number
    web3: any
    openExercise: any
}


interface IBetState {
    address: string;
    web3: any;
    chainId: number;
    pendingRequest: boolean;
    error: string;
    betAmount: number;
    amountToWin: any;
    maxBet: number;
    hasBet: boolean;
    pair: any;
    timeFrame: number;
    userOptions: any;
    currentPrice: number;
    priceInterval: any;
    optionsInterval: any;
    lastBetCall: boolean;
    totalInterchange: number;
}

const INITIAL_STATE: IBetState = {
    address: "",
    web3: null,
    chainId: 1,
    pendingRequest: false,
    error: "",
    betAmount: 0.1,
    maxBet: 1,
    amountToWin: 0,
    hasBet: false,
    pair: enabledPricePairs[0],
    timeFrame: 60 * 60,
    userOptions: [],
    currentPrice: 0,
    priceInterval: null,
    optionsInterval: null,
    lastBetCall: false,
    totalInterchange: 0
};
class Bet extends React.Component<any, any> {
    // @ts-ignore
    public state: IBetState;

    constructor(props: IBetProps) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
        this.state.web3 = props.web3;
        this.state.address = props.address;
        this.state.chainId = props.chainId;
    }

    public componentDidMount() {
        const { address, chainId, web3 } = this.state;
        initiateSwapIfAvailable(address, chainId, web3);
        this.getStaked();
        this.handleBetAmountUpdate({ target: { value: "0.1" } });
        this.loadUserOptions();
        this.getTI();

        this.loadCurrentPrice();

        this.setState({
            priceInterval: setInterval(() => {
                this.loadCurrentPrice()
            }, 10000)
        });
        this.setState({
            optionInterval: setInterval(() => {
                this.loadUserOptions()
            }, 30000)
        });
    }

    public async getTI() {

        const { chainId, web3 } = this.state;
        const ti = await getTotalInterchange(web3, chainId);

        // tslint:disable-next-line:no-console
        console.log(`interschange is ${ti}`);
        this.setState({ totalInterchange: ti });
    }

    public async loadCurrentPrice() {
        const { chainId, web3 } = this.state;
        const latestPrice = await getLatestPrice(chainId, web3);

        // tslint:disable-next-line:no-console
        console.log(`latestRound is ${latestPrice}`);
        this.setState({ currentPrice: latestPrice });
    }

    public async loadUserOptions() {
        const { chainId, web3, address } = this.state;

        const options: any = await getOptionCreation(chainId, web3);
        const massagedOptions = {};
        for (let i = 0; i < options.length; i++) {
            const timestamp: any = await blockTimestamp(options[i].blockNumber, web3);
            // tslint:disable-next-line:no-console
            console.log(`loaded event ${options[i].returnValues.account} ${timestamp} ${address}`);
            // tslint:disable-next-line:no-console
            console.log(options[i]);

            if (options[i].returnValues) {
                if (options[i].returnValues.account === address) {
                    massagedOptions[options[i].returnValues.id] = {
                        blockNumber: options[i].blockNumber,
                        timestamp,
                        id: options[i].returnValues.id,
                        creator: options[i].returnValues.account,
                        strikePrice: options[i].returnValues.sP,
                        lockedValue: options[i].returnValues.lV,
                        type: options[i].returnValues.dir,
                        complete: false
                    }
                }
            }

        }

        // load exercise/expire events
        const completeEvents: any = await getOptionCloses(chainId, web3);
        for (let i = 0; i < completeEvents.length; i++) {
            // tslint:disable-next-line:no-console
            console.log(`found option #1 ${completeEvents[i].returnValues}`);
            // tslint:disable-next-line:no-console
            console.log(completeEvents[i]);


            if (completeEvents[i].returnValues) {
                if (massagedOptions[completeEvents[i].returnValues.id] !== undefined) {
                    massagedOptions[completeEvents[i].returnValues.id].complete = true;
                    if (completeEvents[i].event === "Expire") {
                        massagedOptions[completeEvents[i].returnValues.id].expired = true;
                    }
                    if (completeEvents[i].event === "Exercise") {
                        massagedOptions[completeEvents[i].returnValues.id].exercised = true;
                    }
                }
            }
        }

        const sorted = Object.keys(massagedOptions).sort((a: any, b: any) => b - a);

        // tslint:disable-next-line:no-console
        console.log(`sorted $`);
        // tslint:disable-next-line:no-console
        console.log(sorted);
        const sortedOptions: any = [];
        sorted.forEach((id: any) => {
            if (massagedOptions[id].timestamp) {
                sortedOptions.push(massagedOptions[id]);
            }
        });

        // tslint:disable-next-line:no-console
        this.setState({ userOptions: sortedOptions });
    }

    public async getStaked() {
        const { chainId, web3, address } = this.state;

        const staked = await callPoolStakedBalance(address, chainId, web3);
        const totalStaked = await callPoolTotalSupply(chainId, web3);
        let maxBet: string = await callPoolMaxAvailable(chainId, web3);
        maxBet = divide(maxBet, 5);
        // tslint:disable-next-line:no-console
        console.log(`type ${maxBet} maxBet`);

        // tslint:disable-next-line:no-console
        console.log("presend");
        this.setState({ totalStaked, staked, maxBet });
    }

    public async handleBetAmountUpdate(e: any) {
        const { chainId, web3, maxBet } = this.state;
        const newBet = e.target.value.split(" ");
        this.setState({ betAmount: newBet })
        const amountToWin = await getRate(web3.utils.toWei(`${newBet}`, "ether"), chainId, web3);
        // tslint:disable-next-line:no-console
        console.log(`new amountToWin ${amountToWin}`);
        if (newBet > maxBet) {
            // tslint:disable-next-line:no-console
            console.log(`bet to big`);
            this.setState({ amountToWin: "BET TO BIG" });
        } else {
            this.setState({ amountToWin: formatFixedDecimals(`${web3.utils.fromWei(`${amountToWin}`, "ether")}`, 5) });
        }
    }


    public async handleMakeBet(direction: boolean) {
        const { betAmount, web3, chainId, address, timeFrame, pair } = this.state;
        // tslint:disable-next-line:no-console
        console.log(`makeBet 1`);
        this.setState({ pendingRequest: true, lastBetCall: direction });
        try {
            await makeBet(address, web3.utils.toWei(`${betAmount}`, "ether"), direction, timeFrame, pair.address, chainId, web3, (param1: any, param2: any) => {
                // tslint:disable-next-line:no-console
                console.log(`makeBet ${param1} maxBet`);
                // tslint:disable-next-line:no-console
                console.log(param1, param2);
                this.getStaked();
                this.setState({ error: "", pendingRequest: false, hasBet: true });
            });

        } catch (e) {

            // tslint:disable-next-line:no-console
            console.log(e);
            this.setState({ error: "Betting Failed", pendingRequest: false });
        }
    }

    public async handleExpire(optionId: any) {
        this.setState({ pendingRequest: true });
        const { address, chainId, web3 } = this.state
        try {
            await sendExpire(address, optionId, chainId, web3, (p1: any, p2: any) => {

                // tslint:disable-next-line:no-console
                console.log(p1, p2);
                this.loadUserOptions();
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
                this.loadUserOptions();
                this.setState({ error: "", pendingRequest: false });

            });
        } catch (e) {
            this.setState({ error: "Exercise Failed", pendingRequest: false });
        }
    }


    public renderMaxBet() {
        const { maxBet } = this.state;
        if (maxBet === 0) {
            return <SHelper style={{ paddingTop: "0px", marginTop: "0px" }}>Pool Maxed Out</SHelper>
        } else {
            return <SHelper style={{ paddingTop: "0px", marginTop: "0px" }}>Max Bet Size: {divide(convertAmountFromRawNumber(maxBet, 18), 5)} ETH</SHelper>
        }
    }

    public renderTimeFrameSelect() {

        return (
            <SSelect onChange={(e: any) => {
                this.setState({ timeFrame: Times[e.target.value] });
            }}>
                {Object.keys(Times).map((key: any, i: number) => {
                    return (<option
                        key={i}
                        value={key}>
                        {key}</option>)
                })}
            </SSelect>
        )
    };

    public renderPairSelect() {
        const { pair } = this.state;
        return (
            <SSelect onChange={(e) => {

                // tslint:disable-next-line:no-console
                console.log(`type ${typeof (e.target.value)}`);
                this.setState({
                    pair: JSON.parse(e.target.value)
                })
            }}>
                {enabledPricePairs.map((nPair: any) => {
                    return <option
                        key={nPair.pair}
                        selected={pair === nPair}
                        value={JSON.stringify(nPair)}>
                        {nPair.pair}
                    </option>
                })}
                <option disabled value="MORE SOON">MORE SOON</option>
            </SSelect>
        )

    };



    public renderInput() {
        const { betAmount, amountToWin, currentPrice, web3 } = this.state;
        return (
            <Column>
                <SInputContainer>
                    <SInputBbContainer style={{ backgroundColor: `rgb(${colors.fadedRed})`, color: `rgb(${colors.white})` }}>
                        <span style={{ marginLeft: "0px" }}>PRICE</span><br />
                        <SInputBox>
                            <SInputBb style={{ backgroundColor: `rgb(${colors.fadedRed})`, color: `rgb(${colors.white})` }} value={betAmount} placeholder={`Amount To Bet`} onChange={(e) => this.handleBetAmountUpdate(e)} id="amountStake" />

                            {this.renderMaxBet()}
                        </SInputBox>
                    </SInputBbContainer>

                    <SInputBbContainer style={{ backgroundColor: `rgb(${colors.fadedBlue})`, color: `rgb(${colors.white})` }}>
                        <span style={{ marginLeft: "0px" }}>WIN</span><br />
                        <SInputBb style={{ backgroundColor: `rgb(${colors.fadedBlue})`, color: `rgb(${colors.white})` }}
                            value={amountToWin} placeholder={`You Can Win`} id="amountToWin" onChange={(e: any) => {
                                // tslint:disable-next-line:no-console
                                console.log(e);
                            }} />
                            <SHelper style={{ paddingTop: "0px", marginTop: "0px" }}>STRIKE PRICE: {formatFixedDecimals(web3.utils.fromWei(floorDivide(currentPrice, 100), "lovelace"), 8)} USD</SHelper>
                    </SInputBbContainer>


                </SInputContainer>
                <SInputContainer>
                    {this.renderPairSelect()}
                    {this.renderTimeFrameSelect()}
                </SInputContainer>
            </Column>
        )
    }



    public renderBetApprove() {
        const { web3, pair } = this.state;

                // tslint:disable-next-line:no-console
                console.log(`rerender chart with pair ${pair}`);
                // tslint:disable-next-line:no-console
                console.log(pair);
        return (
            <SBetter>
                <PriceChart web3={web3} pair={pair} />
                <SBetButtonContainer>
                    <BetButton up={true} onClick={() => { this.handleMakeBet(true) }} />
                    <BetButton up={false} onClick={() => { this.handleMakeBet(false) }} />
                </SBetButtonContainer>

            </SBetter>
        )


    }




    public render() {
        const { totalInterchange, web3, currentPrice, userOptions, pendingRequest, error, hasBet, lastBetCall } = this.state;
        // const { openExercise } = this.props;
        return (
            <SBet>

                <h1>Bet</h1>
                <p>Play the game anon. Just play the game.</p>
                <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>
                <SHelper>Enter a comfy bet size (in ETH) to begin</SHelper>

                {
                    pendingRequest ?
                        <Loading />
                        :
                        <SInterface>
                            {this.renderInput()}
                            <br />
                            {this.renderBetApprove()}
                        </SInterface>
                }
                <SHelper>Total Value Interchanged: {formatFixedDecimals(web3.utils.fromWei(`${totalInterchange}`, "ether"), 8)} ETH</SHelper>

                {
                    hasBet ?
                        <SHelper>Share your option with the world:
                        <a
                                href={`https://twitter.com/share?ref_src=twsrc%5Etfw&text=I%20bought%20a%20binary%20${lastBetCall ? "Call📈" : "Put📉"}%20option%20on%20%40biopset!%20%0A%0AThink%20you%20can%20pick%20the%20price%20direction%3F%0Abiopset.com%20%0A%0AWanna%20make%20money%3F%20%0AHit%20the%20exercise%20tab%20and%20score%20some%20risk%20free%20%23ETH%0A%0A%23binaryoptions%20%23defi%20%23ethereum%20`}
                                className="twitter-share-button" target="_" >
                                <b>TWEET it🐧!</b></a>
                        </SHelper>

                        : <>
                            <h4><u>Rules:</u></h4>
                            <ul><li>- A 0.2% fee is charged for each bet</li></ul>
                        </>
                }
                <br />
                <h4>Your Options:</h4>
                <br />
                <OptionTable
                    showFee={false}
                    web3={web3}
                    options={userOptions}
                    handleExpire={(optionId: any) => this.handleExpire(optionId)}
                    handleExercise={(optionId: any) => this.handleExercise(optionId)}
                    currentPrice={currentPrice}
                />

            </SBet>

        )
    }

}

export default Bet