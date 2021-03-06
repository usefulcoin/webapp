import * as React from "react";
import styled from "styled-components";
import { callBIOPPendingBalance, callBIOPBalance, claimRewards} from "../helpers/web3";

import Button from "../components/Button";
import Loading from "../components/Loading";
import ClaimETHRewards from "../components/governance/ClaimETHRewards";
import Delegate from "../components/governance/Delegate";
import StakeBIOP from "../components/governance/StakeBIOP";
import {  convertAmountFromRawNumber } from 'src/helpers/bignumber';

const SRewards = styled.div`
    width:100%;
    height:100%;
`
const SHelper = styled.div`
    font-size: x-small;
`

interface IRewardsProps {
    address: string
    chainId: number
    web3: any
}


interface IRewardsState {
    address: string;
    web3: any;
    chainId: number;
    pendingRequest: boolean;
    error: string;
    biopPendingBalance: number;
    biopBalance: number;
    loading: boolean;
}

const INITIAL_STATE: IRewardsState = {
    address: "",
    web3: null,
    chainId: 0,
    pendingRequest: false,
    error: "",
    biopPendingBalance: 0,
    biopBalance: 0,
    loading: false
};
class Stake extends React.Component<any, any> {
    // @ts-ignore
    public state: IRewardsState;

    constructor(props: IRewardsProps) {
        super(props);
        this.state = {
            ...INITIAL_STATE
        };
        this.state.web3 = props.web3;
        this.state.address = props.address;
        this.state.chainId = props.chainId;
    }

    public componentDidMount() {
        this.getAvailableClaims();
        this.getCurrentBalance();
    }


    public async getAvailableClaims() {
        const {chainId, web3, address} = this.state;
        
        const biopBalance = await callBIOPBalance(address, chainId, web3);


            // tslint:disable-next-line:no-console
            console.log("presend");
            // tslint:disable-next-line:no-console
            console.log(biopBalance);
        this.setState({biopBalance})
    }

    public async getCurrentBalance() {
        const {chainId, web3, address} = this.state;
        
        const biopPendingBalance = await callBIOPPendingBalance(address, chainId, web3);


            // tslint:disable-next-line:no-console
            console.log("presend");
            // tslint:disable-next-line:no-console
            console.log(biopPendingBalance);
        this.setState({biopPendingBalance})
    }

    public async handleClaimRewards() {
        this.setState({loading: true});
        const {address, web3, chainId} = this.state;
        claimRewards(address, chainId, web3, (res: any) => {

            this.getCurrentBalance();
            this.getAvailableClaims();
            this.setState({loading: false});
        })

    }

    

    public showClaimButton() {
        const {biopPendingBalance} = this.state;
        if (biopPendingBalance > 0) {
            return <Button onClick={()=>this.handleClaimRewards()}>Claim rewards</Button>
        } else {
            return <></>;
        }
    }


  
   


    public render() {
        const {biopPendingBalance, biopBalance, loading, web3, chainId, address} = this.state;
        return(
            <SRewards>

                <h1>Rewards</h1>
                <p>BIOP governance tokens you've earned for utilizing the protocol</p>
                {loading ?
                <Loading/>
                :
                <div>
                <p>Claims: <b>{convertAmountFromRawNumber(biopPendingBalance, 18)} BIOP</b></p>
                <p>Balance: <b>{convertAmountFromRawNumber(biopBalance, 18)} BIOP</b></p>
                {this.showClaimButton()}
                </div>
                }
                <br/>
                <SHelper>Governance will be available here soon</SHelper>

                <div style={{opacity: "0%"}}>
                <div style={{border: "1px solid black"}}>
                    
                    <StakeBIOP web3={web3} chainId={chainId} address={address}/>
                </div>

                <div style={{border: "1px solid black"}}>
                    
                    <ClaimETHRewards web3={web3} chainId={chainId} address={address}/>
                </div>

              
               <div style={{border: "1px solid black"}}>
                    <Delegate web3={web3} chainId={chainId} address={address}/>
               </div>

               <div style={{border: "1px solid black"}}>
                    <h3>Governance🏦</h3>
                    <SHelper>Governance actions will be available here soon.</SHelper>
                   
                    <h4>Tier 1: 50%</h4>
                    <Button disabled>Update Max Option Time</Button>
                    <Button disabled>Update Min Option Time</Button>
                    <h4>Tier 2: 66%</h4>
                    <Button disabled>Update Exercise/Expire Fee</Button>
                    <Button disabled>Update Trade Pairs and RateCalcs</Button>
                    <h4>Tier 3: 75%</h4>
                    <Button disabled>Update Bet Fee</Button>
                    <Button disabled>Update pool lock time</Button>
                    <Button disabled>Update staking rewards length epoch</Button>
                    <h4>Tier 4: 90%</h4>
                    <Button disabled>Change Governance Tier Levels</Button>
                    <Button disabled>Close Pool From New Deposits</Button>
               </div>
               </div>
               
            </SRewards>

        )
    }

}

export default Stake