

import * as React from "react";
import styled from "styled-components";
import Column from 'src/components/Column';
import ConnectButton from "../components/ConnectButton";
// @ts-ignore
import { ScrollDownIndicator} from 'react-landing-page';
import { colors } from 'src/styles';


const SLanding = styled(Column)`
  width:100%;
  height:100%;
`;
const SReasons = styled(Column)`
  width: 100%;
`;

interface IBetProps {
    onConnect: any
}


class Landing extends React.Component<any, any> {
    // @ts-ignore
    public state: ILandingState;

    constructor(props: IBetProps) {
        super(props);
    }




    public render() {
        const { onConnect } = this.props;
        return (
            <SLanding >
                <SReasons >
                    <h3>{`Play BIOPset`}</h3>
                    <p style={{fontSize: 'small', color: `rgb(${colors.darkGrey})`}}>No KYC. No Token to use. Just Binary Options.</p>
                    <ConnectButton onClick={() => {
                        // tslint:disable-next-line:no-console
                        console.log('connect clicked');

                        onConnect();
                        }} />
                    <br/><br/><br/><br/>
                    <ScrollDownIndicator />
                </SReasons>
             
                <SLanding>
                    <SReasons>
                
                        <h4>3 Ways To Earn</h4>
                        <hr/>
                        <div >
                            
                            <h5>1. Exercise/Expire Options ✅</h5>
                            <p>Earn fees at zero risk to you.</p>
                        </div>
                        <div >
                            <h5>2. Liquidity Providers 🌏</h5>
                            <p>Hold the system on your shoulders and get paid to do it.</p>
                        </div>
                        <div >
                            <h5>3. Bet 📈📉</h5>
                            <p>Win 188% betting on 1 hour binary options on the price of ETH.</p>
                        </div>
                    </SReasons>

                </SLanding>
            </SLanding>

        )
    }

}

export default Landing