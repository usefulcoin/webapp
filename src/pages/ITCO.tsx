import React, { useState, useEffect } from "react";
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
import { useActiveWeb3React } from '../hooks'
import { /* convertAmountFromRawNumber, */ formatFixedDecimals, divide, /* greaterThan, multiply,  *//* convertToDecimals */ } from 'src/helpers/bignumber';
import { initWeb3 } from '../utils';

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

const Trade = () => {
  const { account, chainId } = useActiveWeb3React();

  const [address, setAddress] = useState<string>("")
  const [networkId, setNetworkId] = useState<number>(42);
  const [web3, setWeb3] = useState<any>();
  // @ts-ignore
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // @ts-ignore
  const [spendAmount, setSpendAmount] = useState<number>(0.0);
  const [price, setPrice] = useState<number>(0);
  // @ts-ignore
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  // @ts-ignore
  const [priceInterval, setPriceInterval] = useState<any>();
  const [balance, setBalance] = useState<number>(0);
  // @ts-ignore
  const [biopBalance, setBiopBalance] = useState<number>(0);
  // @ts-ignore
  const [betFee, setBetFee] = useState<number>(0);
  const [tier, setTier] = useState<any>(1);
  // @ts-ignore
  const [round, setRound] = useState<number>(1);
  // @ts-ignore
  const [openOptions, setOpenOptions] = useState<number>(2);
  // @ts-ignore
  const [currentRound, setCurrentRound] = useState<number>(0);

  // @ts-ignore
  const [loading, setLoading] = useState<boolean>(false);
  // @ts-ignore
  const [hasBet, setHasBet] = useState<boolean>(false);
  // @ts-ignore
  const [lastBetCall, setLastBetCall] = useState<boolean>(false);
  // @ts-ignore
  const [betDirection, setBetDirection] = useState<boolean>(true);

  const [toReceive, setToReceive] = useState<any>(0);
  // @ts-ignore
  const [userOptions, setUserOption] = useState<any>([]);
  // @ts-ignore
  const [optionsInterval, setOptionsInterval] = useState<any>();
  // @ts-ignore
  const [pair, setPair] = useState<any>(enabledPricePairs[0]);


  const locale = localStorage.getItem('locale') ? localStorage.getItem('locale') : DEFAULT_LANG;

  useEffect(() => {
    if (!!account) {
      setAddress(account);
    }
  }, [account]);

  useEffect(() => {
    if (!!chainId) {
      setNetworkId(chainId)
      setWeb3(initWeb3(chainId));
    }
  }, [chainId]);

  useEffect(() => {
    if (!!address && !!networkId) {
      getBalance();
      getAmountSold();
    }
  }, [address, web3]);

  const getBalance = async () => {
    const ba = await getETHBalance('0x9292F65c97cea374191Ee8650A098c7E2DF1dCB9', web3);
    const biba = await callBIOPBalance('0x9292F65c97cea374191Ee8650A098c7E2DF1dCB9', networkId, web3);
    console.log('====>', ba, biba)
    setBalance(Number(ba));
    setBiopBalance(Number(biba));
  }

  const getAmountSold = async () => {
    const data: any = await callITCOAmountSold(networkId, web3);
    setPrice(data[0]);
    setTier(data[1]);
  }

  // @ts-ignore
  const handlespendAmountUpdate = async (e: any) => {
    const newBet = e.target.value.split(" ");
    await setSpendAmount(newBet);
  }

  const updateToReceive = async (spend: any) => {
    try {
      setToReceive(divide(web3.utils.toWei(`${spend}`), price));
      setError("");
    } catch (e) {
      setError("Invalid Input");
    }
  }

  // @ts-ignore
  const renderRoundsSelect = () => {
    return (
      <SSelect onChange={async (e: any) => {
        // @ts-ignore
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

  const renderInput = () => {
    return (
      <SInputContainer>
        <Column maxWidth={600}>
          <SInputBbContainer style={{ backgroundColor: `rgb(${colors.darkGrey})`, color: `rgb(${colors.black})`, height: "100%" }}>
            <SRow style={{ margin: "10px" }}>
              <span />
              <span style={{ fontSize: fonts.size.tiny, paddingTop: "5px", cursor: "pointer" }}
                onClick={() => {
                  setSpendAmount(web3.utils.fromWei(`${balance}`, "ether"));
                  updateToReceive(web3.utils.fromWei(`${balance}`, "ether"));
                }}
              >
                {
                  // @ts-ignore
                  i18n[locale].AVAILABLE}: {formatFixedDecimals(web3.utils.fromWei(`${balance}`, "ether"), 6)
                }
              </span>
            </SRow>
            <SInputRow >
              <SInput
                value={spendAmount}
                onChange={(e) => {
                  setSpendAmount(Number(e.target.value));
                  updateToReceive(e.target.value);
                }}
              />
              <span style={{ color: `white` }}>|</span> <span style={{ color: `white` }}>ETH</span>
            </SInputRow>
            <SHelper style={{ color: `rgb(${colors.red})` }}>{error}</SHelper>

            <SRow style={{ margin: "10px" }}>
              <span>
                {
                  // @ts-ignore
                  i18n[locale].BUY
                }
              </span>
              <span style={{ fontSize: fonts.size.tiny, paddingTop: "5px", cursor: "pointer" }}>
                {
                  // @ts-ignore
                  i18n[locale].AVAILABLE}: {formatFixedDecimals(web3.utils.fromWei(`${biopBalance}`, "ether"), 6)
                }
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
                setLoading(true);
                await buyFromITCO(web3.utils.toWei(`${spendAmount}`), address, networkId, web3);
                setLoading(false);
                await getBalance();
              }}
            >
              <div style={{ color: `white` }}>
                {
                  // @ts-ignore
                  i18n[locale].BUY
                }
              </div>
            </Button>
          </SInputBbContainer>
          <ReactTooltip effect="solid" />
        </Column>
      </SInputContainer >
    )
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <SBet>
      <SRow style={{ flexDirection: width > height ? "row" : "column" }}>
        {!!web3 && !!address && < ITCOChart web3={web3} chainId={networkId} tier={tier} />}
        {
          pendingRequest || !web3 || !address ?
            <Loading />
            :
            <SInterface>
              {renderInput()}
            </SInterface>
        }
      </SRow>
    </SBet>
  )
}

export default Trade
