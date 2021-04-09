import * as React from "react";
import styled from "styled-components";
import { callPoolTotalSupply, callPoolStakedBalance, callPoolNextWithdraw, sendDeposit, sendWithdrawGuarded, getPoolLockedAmount, getETHBalance} from "../helpers/web3";
import {BO_CONTRACT} from "../constants/contracts";

import Input from 'src/components/Input';
import Switch from 'src/components/Switch';
import Button from 'src/components/Button';
import Loading from 'src/components/Loading';
import { colors } from 'src/styles';
import {  convertAmountFromRawNumber, convertToDecimals, formatFixedDecimals, subtract } from 'src/helpers/bignumber';

const SStake = styled.div`
    width:100%;
    height:100%;
`
const SHelper = styled.div`
    font-size: x-small;
`

interface IStakeProps {
    address: string
    chainId: number
    web3: any
}


interface IExchangeState {
    address: string;
    web3: any;
    chainId: number;
    pendingRequest: boolean;
    error: string;
    staked: number;
    totalStaked: number;
    changeAmount: any;// amount to stake or unstake
    staking: boolean;
    nextWithdraw: number;
    locktotalLocked: number;// amount of eth in the contract
    poolBalance: number; 
}

const INITIAL_STATE: IExchangeState = {
    address: "",
    web3: null,
    chainId: 1,
    pendingRequest: false,
    error: "",
    staked: 0,
    totalStaked: 0,
    changeAmount: 0,
    staking: true,
    nextWithdraw: 0,
    locktotalLocked: 0,
    poolBalance: 0
};
class Stake extends React.Component<any, any> {
    // @ts-ignore
    public state: IExchangeState;

    constructor(props: IStakeProps) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
        this.state.web3 = props.web3;
        this.state.address = props.address;
        this.state.chainId = props.chainId;
    }

    public componentDidMount() {
        this.getStaked();
    }

    public async getStaked() {
        const {chainId, web3, address} = this.state;

        const staked = await callPoolStakedBalance(address, chainId, web3);
        const nextWithdraw = await callPoolNextWithdraw(address, chainId, web3);
        const totalStaked = await callPoolTotalSupply(chainId, web3);
        const locktotalLocked = await getPoolLockedAmount(chainId, web3);
        const poolBalance = await getETHBalance(BO_CONTRACT[chainId].address, web3);


            // tslint:disable-next-line:no-console
            console.log("presend");
            // tslint:disable-next-line:no-console
            console.log(nextWithdraw);
        this.setState({totalStaked, staked, nextWithdraw, locktotalLocked, poolBalance})
    }



    public async handleWithdraw() {
        this.setState({pendingRequest: true});
        const {changeAmount, web3, address, chainId} = this.state;
        if (changeAmount > 0) {

        await sendWithdrawGuarded(address, web3.utils.toWei(changeAmount, "ether"), chainId, web3, (param1: any, param2: any) => {
            // tslint:disable-next-line:no-console
            console.log("confirmed");
            // tslint:disable-next-line:no-console
            console.log(param1);
            // tslint:disable-next-line:no-console
            console.log(param2);
            this.getStaked();
            this.setState({pendingRequest: false, error: "", changeAmount: 0});


        });

        } else {
            this.setState({pendingRequest: false, error: "Can't withdraw 0"});
        }

    }



    public async handleDeposit() {
        this.setState({pendingRequest: true});
        const {address, chainId, web3, changeAmount} = this.state;

            // tslint:disable-next-line
            alert("Your deposit amount will be (soft) locked for 14 days.");
            await sendDeposit(address, web3.utils.toWei(changeAmount, "ether"), chainId, web3, (param1: any, param2: any) => {
                // tslint:disable-next-line:no-console
                console.log("confirmed");
                // tslint:disable-next-line:no-console
                console.log(param1);
                // tslint:disable-next-line:no-console
                console.log(param2);
                this.getStaked();
                this.setState({pendingRequest: false, error: "", changeAmount: 0});


            });


    }

    public renderWithdrawAvailable() {
        const {nextWithdraw} = this.state;
        if (nextWithdraw !== 0) {
            const unlock = new Date(nextWithdraw*1000);// add 1 days
            const now = new Date();
            const lockInPlace = unlock.getTime() > now.getTime();
            // tslint:disable-next-line:no-console
            console.log(unlock.getTime());
            // tslint:disable-next-line:no-console
            console.log(now.getTime());
                return (
                    <div>
                        <SHelper style={{color: `rgb(${colors.red})`}}>
                            {lockInPlace ? `Early Withdraw incure a 1%  penalty. Next fee free withdraw is ${unlock.toLocaleString()}`: ""}
                           </SHelper>
                        <br/>
                        <Button onClick={() => this.handleWithdraw()}>Withdraw</Button>
                    </div>
                    )

        } else {
            return (<></>);
        }

    }

    public renderStakeWithdrawSwitch() {
        const { staking } = this.state;
        return (
            <Switch
                vertical={false}
                on={staking}
                onTap={() => { this.setState({ staking: true, changeAmount: "", error: "" })}}
                onLabel="Stake"
                offTap={() => { this.setState({ staking: false, changeAmount: "", error: "" }) }}
                offLabel="Withdraw"
                />

        )
    }

    public renderStake() {
        const { changeAmount} = this.state;
        if (changeAmount > 0) {
                return (
                    <div>

                        <Button onClick={() => this.handleDeposit()}>Stake</Button>
                    </div>
                )

        } else {
            return (<></>)
        }
    }


    public render() {
        const {web3, totalStaked, staked, changeAmount, staking, pendingRequest, error, poolBalance, locktotalLocked} = this.state;
        return(
            <SStake>

                <h1>Sell Options</h1>
                <p>Contribute to the liquidity pool and passively earn premiums.</p>
                <p>{convertToDecimals(`${formatFixedDecimals(`${web3.utils.fromWei(`${poolBalance}`, "ether")}`, 5)}`, 2)} ETH Total Staked ({formatFixedDecimals(`${web3.utils.fromWei(`${subtract(poolBalance, locktotalLocked)}`, "ether")}`, 5)} Available)</p>
                <p>Your contribution: <b>{ convertAmountFromRawNumber(staked, 18)} ETH</b></p>
                <p><b>{convertToDecimals(`${((staked/totalStaked))*100}`, 2)}%</b> of total staked.</p>
                <br/>
                {this.renderStakeWithdrawSwitch()}
                <SHelper style={{color: `rgb(${colors.red})`}}>{error}</SHelper>
                {
                    pendingRequest ?
                    <Loading/>
                    :
                    <>
                    <Input value={changeAmount} placeholder={`Amount To ${staking ? "Stake" : "Withdraw"}`} onChange={(e: any) => this.setState({ changeAmount: e.target.value })} id="amountStake" />
                    <SHelper>Amount In ETH</SHelper>

                    <br/>
                    {staking ?
                    this.renderStake()
                    :
                    this.renderWithdrawAvailable()
                    }
                    </>
                }


            </SStake>

        )
    }

}

export default Stake
