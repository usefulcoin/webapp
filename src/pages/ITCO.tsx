import * as React from "react";
import styled from "styled-components";
import i18n from "../i18n";
import { /*initiateSwapIfAvailable,*/ getETHBalance, callITCOAmountSold, buyFromITCO, callBIOPBalance } from "../helpers/web3";
import ReactTooltip from 'react-tooltip';
// import Right from "../assets/right.png";
import { DEFAULT_LANG, enabledPricePairs } from "../constants";
import Column from 'src/components/Column';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import ITCOChart from 'src/components/ITCOChart';
import { colors, fonts } from 'src/styles';
import { /* convertAmountFromRawNumber, */ formatFixedDecimals, divide, /* greaterThan, multiply,  *//* convertToDecimals */ } from 'src/helpers/bignumber';

const SBet = styled.div`
  width:100%;
  height:100%;
`
const SHelper = styled.div`
  font-size: x-small;
`

const SInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
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
  border-radius: 40px;
  padding: 20px;
`

const SInput = styled.input`
  background-color: rgb(${colors.lightGrey});
  border: none;
  color: rgb(${colors.white});
  font-weight: bold;
`

const SRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const SInputRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 10px; 
    background-color: rgb(${colors.lightGrey});
    border-radius: 20px;
    padding: 10px;
`

const SSelect = styled.select`
    border-radius: 8px;
    height: 44px;
    width: 100%;
    user-select: none;
    flex: 1;
`;

const SInterface = styled.div`
    padding: 20px;
    border-radius: 40px;
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
  spendAmount: number;
  toReceive: any;
  price: number;
  tier: any;
  hasBet: boolean;
  pair: any;
  rounds: number;
  userOptions: any;
  currentPrice: number;
  priceInterval: any;
  optionsInterval: any;
  lastBetCall: boolean;
  balance: any;// in WEI
  biopBalance: any;
  betDirection: boolean;
  openOptions: number;
  betFee: number;
  currentRound: number;
  locale: string;
}

const INITIAL_STATE: IBetState = {
  address: "",
  web3: null,
  chainId: 1,
  pendingRequest: false,
  error: "",
  spendAmount: 0.0,
  price: 0,
  tier: 1,
  toReceive: 0,
  hasBet: false,
  pair: enabledPricePairs[0],
  rounds: 1,// 30 mins
  userOptions: [],
  currentPrice: 0,
  priceInterval: null,
  optionsInterval: null,
  lastBetCall: false,
  balance: 0,
  biopBalance: 0,
  betDirection: true, // true means call
  openOptions: 2,
  betFee: 0,
  currentRound: 0,// current oracle round
  locale: DEFAULT_LANG
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
    await this.getAmountSold();
    this.getBalance();

    const locale = localStorage.getItem('locale');
    this.setState({ locale: locale !== null ? locale : DEFAULT_LANG });


  }

  public async getBalance() {
    const { address, web3, chainId } = this.state;
    const ba = await getETHBalance(address, web3);
    const biba = await callBIOPBalance(address, chainId, web3);

    this.setState({ balance: ba, biopBalance: biba });
  }

  public async getAmountSold() {
    const { chainId, web3 } = this.state;
    const data: any = await callITCOAmountSold(chainId, web3);

    
    console.log(`sold ${data} curtier ${data}`);
    
    console.log(data);
    const tier = data[0];
    const price = data[1];
    this.setState({ price, tier });
  }

  public async handlespendAmountUpdate(e: any) {
    const newBet = e.target.value.split(" ");
    await this.setState({ spendAmount: newBet })
  }

  public async updateToReceive(spend: any) {
    const { price, web3 } = this.state
    try {
      
      console.log(`setting toReceive with spend ${spend} and price ${price}`);
      
      console.log(`toReceive becomes: ${divide(web3.utils.toWei(`${spend}`), price)}`);
      this.setState({ toReceive: divide(web3.utils.toWei(`${spend}`), price), error: "" });
    } catch (e) {
      this.setState({ error: "Invalid Input" });
    }
  }

  public renderRoundsSelect() {
    return (
      <SSelect onChange={async (e: any) => {
        await this.setState({ rounds: Times[e.target.value] });
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

  public renderInput() {
    const { locale, spendAmount, toReceive, /*currentPrice, */web3, balance, biopBalance, address, chainId, error } = this.state;
    return (
      <SInputContainer>
        <Column maxWidth={600}>
          <SInputBbContainer style={{ backgroundColor: `rgb(${colors.darkGrey})`, color: `rgb(${colors.black})`, height: "100%" }}>
            <SRow style={{ margin: "10px" }}>
              <span />
              <span style={{ fontSize: fonts.size.tiny, paddingTop: "5px", cursor: "pointer" }}
                onClick={() => {
                  this.setState({ spendAmount: web3.utils.fromWei(`${balance}`, "ether") })
                  this.updateToReceive(web3.utils.fromWei(`${balance}`, "ether"));
                }}
              >
                {i18n[locale].AVAILABLE}: {formatFixedDecimals(web3.utils.fromWei(`${balance}`, "ether"), 6)}
              </span>
            </SRow>
            <SInputRow >
              <SInput
                value={spendAmount}
                onChange={(e) => {
                  this.setState({ spendAmount: e.target.value })
                  this.updateToReceive(e.target.value);
                }}
              />
              <span style={{ color: `white` }}>|</span> <span style={{ color: `white` }}>ETH</span>
            </SInputRow>
            <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>

            <SRow style={{ margin: "10px" }}>
              <span>{i18n[locale].BUY}</span>
              <span style={{ fontSize: fonts.size.tiny, paddingTop: "5px", cursor: "pointer" }}>
                {i18n[locale].AVAILABLE}: {formatFixedDecimals(web3.utils.fromWei(`${biopBalance}`, "ether"), 6)}
              </span>
            </SRow>
            <SInputRow >
              <SInput
                value={toReceive}
              />
              <span style={{ color: `white` }}>|</span> <span style={{ color: `white` }}>BIOP</span>
            </SInputRow>
            <Button
              onClick={async () => {
                this.setState({ loading: true })
                await buyFromITCO(web3.utils.toWei(`${spendAmount}`), address, chainId, web3);
                this.setState({ loading: false })
                await this.getBalance();
              }}
            >
              <div style={{ color: `white` }}>
                {i18n[locale].BUY}
              </div>
            </Button>
          </SInputBbContainer>
          <ReactTooltip effect="solid" />
        </Column>
      </SInputContainer>

    )
  }

  public render() {
    const { pendingRequest, chainId, web3, tier } = this.state;
    const width = window.innerWidth;
    const height = window.innerHeight;

    return (
      <SBet>
        <SRow style={{ flexDirection: width > height ? "row" : "column" }}>
          <ITCOChart web3={web3} chainId={chainId} tier={tier} />
          {
            pendingRequest ?
              <Loading />
              :
              <SInterface>
                {this.renderInput()}
              </SInterface>
          }
        </SRow>
      </SBet>
    )
  }
}

export default Trade
