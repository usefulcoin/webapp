

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
                    <h3>{`TRADE OR SETTLE BINARY OPTIONS`}</h3>
                    <p style={{fontSize: 'small', color: `rgb(${colors.darkGrey})`}}>BIOPSET IS A NON-CUSTODIAL, CENSORSHIP-RESISTANT BINARY OPTIONS PROTOCOL.</p>
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

                            <h5>1. Settle Options</h5>
                            <p>Earn fees for exercising in-the-money options or settling expired options.</p>
                        </div>
                        <div >
                            <h5>2. Provide Liquidity</h5>
                            <p>Contribute funds to the pool that sells on-demand binary options to earn premiums.</p>
                        </div>
                        <div >
                            <h5>3. Buy Options</h5>
                            <p>Earn returns of up to 100% for correctly forecasting changes in price direction.</p>
                        </div>
                    </SReasons>

                </SLanding>
            </SLanding>

        )
    }

}

export default Landing
