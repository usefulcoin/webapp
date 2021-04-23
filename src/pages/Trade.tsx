
import * as React from "react";
import styled from "styled-components";

import { /*initiateSwapIfAvailable,*/ callCurrentRoundID, callBetFee, sendComplete, callPoolTotalSupply, getLatestPrice, callPoolStakedBalance, callPoolMaxAvailable, getDirectRate, getOptionCreation, getOptionCloses, getTotalInterchange, callOpenCalls, callOpenPuts, getBlockNumber } from "../helpers/web3";
import PriceChart from "../components/PriceChart"; //

import ReactTooltip from 'react-tooltip';
import { makeBet } from "../helpers/web3";

import { enabledPricePairs } from "../constants";

import Column from 'src/components/Column';
import OptionTable from 'src/components/OptionTable';
import BetButton from 'src/components/BetButton';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import { colors } from 'src/styles';
import { subtract, convertAmountFromRawNumber, formatFixedDecimals, divide, greaterThan, multiply, convertToDecimals } from 'src/helpers/bignumber';

const SBet = styled.div`
    width:100%;
    height:100%;
`
const SHelper = styled.div`
    font-size: x-small;
    color: rgb(${colors.black});
`

const SBetter = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

`
const SInputContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 0 auto;
    align-items: stretch;
    padding-bottom: 10px;
`

const SInputBbContainer = styled.div`
    flex: 1;
    height: 100px;
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
    margin-left: 10%;
    margin-right: 10%;
    height: 30px;
    font-weight: bold;
    font-size: 1.3rem;
    width: 80%;
    display: block;
    margin-bottom:1px;
`

const SInputBox = styled.div`
position: relative;
`

const SOutlined = styled.span`
-webkit-text-stroke-width: 0.5px;
-webkit-text-stroke-color: white;
`

const SBetButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const SRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const SColumn = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
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
  "1 Round": 1,
  "3 Rounds": 3,/*
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
  rounds: number;
  userOptions: any;
  currentPrice: number;
  priceInterval: any;
  optionsInterval: any;
  lastBetCall: boolean;
  totalInterchange: number;
  betDirection: boolean;
  openOptions: number;
  betFee: number;
  currentRound: number;
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
  rounds: 1,// 30 mins
  userOptions: [],
  currentPrice: 0,
  priceInterval: null,
  optionsInterval: null,
  lastBetCall: false,
  totalInterchange: 0,
  betDirection: true, // true means call
  openOptions: 2,
  betFee: 0,
  currentRound: 0// current oracle round
};
class Trade extends React.Component<any, any> {
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

  public async componentDidMount() {
    const { /*address, chainId, web3,*/ betDirection } = this.state;
    // initiateSwapIfAvailable(address, chainId, web3);
    await this.updateBetDirection(betDirection);
    await this.getStaked();
    this.updateRate();
    this.loadUserOptions();
    this.getTI();
    this.loadBetFee();

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

    
    console.log(`interschange is ${ti}`);
    this.setState({ totalInterchange: ti });
  }
  public async loadBetFee() {

    const { chainId, web3 } = this.state;
    const fee = await callBetFee(chainId, web3);

    
    console.log(`fee is ${fee}`);
    this.setState({ betFee: fee });
  }

  public async loadCurrentPrice() {
    const { chainId, web3 } = this.state;
    const latestPrice = await getLatestPrice(chainId, web3);

    
    console.log(`latestRound is ${latestPrice}`);
    this.setState({ currentPrice: latestPrice });
  }

  public async loadUserOptions() {
    const { chainId, web3, address } = this.state;
    let blockNum: any = await getBlockNumber(web3);
    blockNum = subtract(blockNum, 25000);

    const options: any = await getOptionCreation(chainId, web3, blockNum);
    // TODO replace with dynamic price provider
    const cr: any = await callCurrentRoundID(chainId, web3, enabledPricePairs[0].address);
    const massagedOptions = {};
    for (let i = 0; i < options.length; i++) {
      
      console.log(`loaded event ${options[i].returnValues.account} purchase round:${options[i].pR} ${address}`);
      
      console.log(options[i]);

      if (options[i].returnValues) {
        if (options[i].returnValues.account === address) {

          massagedOptions[options[i].returnValues.id] = {
            blockNumber: options[i].blockNumber,
            purchaseRound: options[i].returnValues.pR,
            exp: options[i].returnValues.exp,
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

    
    console.log("massaged options");
    
    console.log(massagedOptions);

    // load exercise/expire events
    const completeEvents: any = await getOptionCloses(chainId, web3, blockNum);
    for (let i = 0; i < completeEvents.length; i++) {
      
      console.log(`found option #1 ${completeEvents[i].returnValues}`);
      
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

    
    console.log(`sorted $`);
    
    console.log(sorted);
    const sortedOptions: any = [];
    sorted.forEach((id: any) => {
      if (massagedOptions[id].exp) {
        sortedOptions.push(massagedOptions[parseInt(id, 10)]);
      }
    });

    
    console.log(`sorted options`);
    
    console.log(sortedOptions);

    
    this.setState({ userOptions: sortedOptions, currentRound: cr });
  }

  public async getStaked() {
    const { chainId, web3, address, openOptions } = this.state;

    const staked = await callPoolStakedBalance(address, chainId, web3);
    const totalStaked = await callPoolTotalSupply(chainId, web3);
    let maxBet: string = await callPoolMaxAvailable(chainId, web3);
    maxBet = divide(maxBet, 10);
    maxBet = divide(maxBet, openOptions)
    
    console.log(`type ${maxBet} maxBet`);

    
    console.log("presend");
    this.setState({ totalStaked, staked, maxBet });
  }

  public async updateBetDirection(dir: boolean) {
    const { chainId, web3 } = this.state;
    let open: any;
    if (dir) {
      open = await callOpenCalls(chainId, web3);
    } else {
      open = await callOpenPuts(chainId, web3);
    }

    this.setState({ betDirection: dir, openOptions: open >= 2 ? open : 2 });
  }

  public async handleBetAmountUpdate(e: any) {
    const newBet = e.target.value.split(" ");
    await this.setState({ betAmount: newBet })
    await this.updateRate();
  }

  public async updateRate() {
    const { chainId, web3, maxBet, betDirection, openOptions, rounds, betAmount, currentPrice, pair } = this.state;
    
    console.log(`maxBet ${convertAmountFromRawNumber(maxBet, 18)}. bet size ${betAmount}`);
    if (greaterThan(betAmount, convertAmountFromRawNumber(maxBet, 18))) {
      
      console.log(`bet to big`);
      this.setState({ amountToWin: "invalid" });
    } else {

      const amountToWin = await getDirectRate(currentPrice, pair.address, betDirection, rounds, openOptions, web3.utils.toWei(`${betAmount}`, "ether"), chainId, web3);
      
      console.log(`new amountToWin ${amountToWin}.`);
      this.setState({ amountToWin: formatFixedDecimals(`${web3.utils.fromWei(`${amountToWin}`, "ether")}`, 5) });
      this.loadBetFee();
    }
  }


  public async handleMakeBet(direction: boolean) {
    const { betAmount, web3, chainId, address, rounds, pair } = this.state;
    
    console.log(`makeBet 1`);
    this.setState({ pendingRequest: true, lastBetCall: direction });
    try {
      await makeBet(address, web3.utils.toWei(`${betAmount}`, "ether"), direction, rounds, pair.address, chainId, web3, (param1: any, param2: any) => {
        
        console.log(`makeBet ${param1} maxBet`);
        
        console.log(param1, param2);
        this.getStaked();
        this.setState({ error: "", pendingRequest: false, hasBet: true });
      });

    } catch (e) {

      
      console.log(e);
      this.setState({ error: "Betting Failed", pendingRequest: false });
    }
  }



  public async handleComplete(optionId: any) {
    this.setState({ pendingRequest: true });
    const { address, chainId, web3 } = this.state
    try {

      
      console.log(`sending exercise for opton ${optionId}`);
      await sendComplete(address, optionId, chainId, web3, (p1: any, p2: any) => {

        
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
      return <SHelper style={{ paddingTop: "0px", marginTop: "0px" }}>Max Trade Size: {convertToDecimals(`${convertAmountFromRawNumber(maxBet, 18)}`, 6)} ETH</SHelper>
    }
  }

  public renderRoundsSelect() {

    return (
      <SSelect onChange={async (e: any) => {
        await this.setState({ rounds: Times[e.target.value] });
        await this.updateRate()
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

  public openBettingAlert() {
    alert("You are taking a risk!\nBy using BIOPset to make any trade you are risking 100% of the capital you deposit.\nThe rate shown in the win total is the maximum potential value you can win. It is also shown as a percentage in 'Potential Yield'. This is the amount you can win. If it's not enough for you, don't make the trade.");
  }



  public renderInput() {
    const { betAmount, amountToWin, /*currentPrice, web3,*/ betDirection, betFee } = this.state;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const wideGirl = width > height;

    // <SHelper style={{ paddingTop: "0px", marginTop: "0px" }}>STRIKE PRICE: {formatFixedDecimals(web3.utils.fromWei(floorDivide(currentPrice, 100), "lovelace"), 8)} USD</SHelper>
    return (
      <Column>
        <SInputContainer style={{ flexDirection: wideGirl ? "row" : "column" }}>
          <SInputBbContainer style={{ backgroundColor: `rgb(${colors.white})`, color: `rgb(${colors.black})` }}>
            <span style={{ marginLeft: "0px" }}>QUANTITY</span><br />
            <SInputBox>
              <SInputBb style={{ backgroundColor: `rgb(${colors.white})`, color: `rgb(${colors.black})` }} value={betAmount} placeholder={`Amount To Bet`} onChange={(e) => this.handleBetAmountUpdate(e)} id="amountStake" />

              {this.renderMaxBet()}
            </SInputBox>
          </SInputBbContainer>

          <SBetButtonContainer style={{ flexDirection: "column" }}>
            <BetButton up={true} onClick={() => { this.updateBetDirection(true) }} active={betDirection} />
            <BetButton up={false} onClick={() => { this.updateBetDirection(false) }} active={!betDirection} />
          </SBetButtonContainer>
          <ReactTooltip effect="solid" />{/* data-tip={MaxYieldToolTip} on the element to show it with */}
          <SInputBbContainer style={{ backgroundColor: `rgb(${colors.fadedBlue})`, color: `rgb(${colors.white})` }}>
            <SRow>
              <SColumn style={{ textAlign: "left" }}>
                <span style={{ marginLeft: "20px", color: `white` }}>Win Total <span style={{ cursor: "pointer" }} onClick={() => this.openBettingAlert()}>ⓘ</span>:</span>
                <span style={{ marginLeft: "20px", color: `white` }}>Trading Fee:</span>
                <span style={{ marginLeft: "20px", color: `white` }}>Maximium Yield:</span>
                <span style={{ marginLeft: "20px", color: `white` }}>Minimum Yield:</span>

              </SColumn>
              <SColumn style={{ textAlign: "right" }}>
                <span style={{ marginRight: "20px", color: `white` }} >{amountToWin}</span>
                <span style={{ marginRight: "20px", color: `white` }}>{divide(betFee, 1000)}%</span>
                {
                  greaterThan(divide(multiply(divide(amountToWin, betAmount), 100), 2), 5) ?
                    <span style={{ marginRight: "20px", color: `rgb(${colors.white})` }}>{greaterThan(multiply(divide(amountToWin, 2), 100), 0) ? divide(multiply(divide(amountToWin, betAmount), 100), 2) : "100"}%</span>
                    :
                    <SOutlined style={{ marginRight: "20px", color: greaterThan(divide(multiply(divide(amountToWin, betAmount), 100), 2), 5) ? `rgb(${colors.white})` : `rgb(${colors.red})` }}>{greaterThan(multiply(divide(amountToWin, 2), 100), 0) ? divide(multiply(divide(amountToWin, betAmount), 100), 2) : "100"}%</SOutlined>

                }
                <span style={{ marginRight: "20px", color: `white` }}>-100%</span>

              </SColumn>
            </SRow>

          </SInputBbContainer>
          <br />

        </SInputContainer>
        <SInputContainer>
          {this.renderPairSelect()}
          {/* {this.renderRoundsSelect()} */}
        </SInputContainer>
      </Column>
    )
  }


  public renderBetApprove() {
    const { pair, betDirection, currentPrice } = this.state;

    
    console.log(`rerender chart with pair ${pair} currentPrice ${currentPrice}`);
    
    console.log(pair);
    return (
      <SBetter>
        <PriceChart pair={pair.pair} currentPrice={currentPrice} />
        <Button color={betDirection ? `blue` : `red`} onClick={() => { this.handleMakeBet(betDirection) }}><span style={{ color: `white` }}>Buy {betDirection ? "Call📈 " : "Put📉 "}</span></Button>
      </SBetter>
    )


  }

  public render() {
    const { currentRound, totalInterchange, web3, currentPrice, userOptions, pendingRequest, error, hasBet, lastBetCall } = this.state;
    // const { openExercise } = this.props;
    
    console.log(`userOptions here ${userOptions}`);
    return (
      <SBet>

        <h1 style={{ color: `rgb(${colors.black})` }}>Buy Options</h1>
        <p style={{ color: `rgb(${colors.black})` }}>Dont risk more than you can afford to lose.</p>
        <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>

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
        <SHelper >Trading Volume: {formatFixedDecimals(web3.utils.fromWei(`${totalInterchange}`, "ether"), 8)} ETH</SHelper>

        {
          hasBet ?
            <SHelper>Share your price prediction with the world:
                        <a
                href={`https://twitter.com/share?ref_src=twsrc%5Etfw&text=I%20bought%20a%20binary%20${lastBetCall ? "Call📈" : "Put📉"}%20option%20on%20%40biopset!%20%0A%0AThink%20you%20can%20pick%20the%20price%20direction%3F%0Abiopset.com%20%0A%0AWanna%20make%20money%3F%20%0AHit%20the%20exercise%20tab%20and%20score%20some%20risk%20free%20%23ETH%0A%0A%23binaryoptions%20%23defi%20%23ethereum%20`}
                className="twitter-share-button" target="_" >
                <b>TWEET IT!</b></a>
            </SHelper>

            : <>
            </>
        }
        <br />
        {userOptions.length > 0 ?
          <>
            <h4 style={{ color: `rgb(${colors.black})` }}>Options Purchased</h4>
            <br />
            <OptionTable
              showFee={false}
              web3={web3}
              options={userOptions}
              handleComplete={(optionId: any) => this.handleComplete(optionId)}
              currentPrice={currentPrice}
              currentRound={currentRound}
            />

          </>
          :
          <></>
        }
      </SBet>

    )
  }

}

export default Trade
