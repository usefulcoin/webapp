

import * as React from "react";
import styled from "styled-components";
import Column from 'src/components/Column';
import ConnectButton from "../components/ConnectButton";
// @ts-ignore
import { ScrollDownIndicator} from 'react-landing-page';
import { colors, fonts } from 'src/styles';
import logo from "../assets/logo.png";

const SBrand = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  & span {
    color: rgb(${colors.brandGrey});
    font-size: ${fonts.size.h0};
    
  }
`;

const SLogo = styled.div`
  width: 90px;
  height: 90px;
  background: url(${logo}) no-repeat;
  background-size: cover;
  background-position: center;
`;


const SLanding = styled(Column)`
  width:100%;
  height:100%;
  font-family: "octarine";
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
                    <SBrand>
                        <SLogo/><span>biopset</span>
                    </SBrand>
                    <h3 style={{color: `rgb(${colors.black})`}}>{`No KYC. No Token to use. Just Binary Options.`}</h3>
                    <p style={{fontSize: 'small', color: `rgb(${colors.darkGrey})`}}>On-demand, censorship-resistant, peer-to-pool decentralized binary options.</p>
                    <ConnectButton 
                    primary={true}
                    onClick={() => {
                        // tslint:disable-next-line:no-console
                        console.log('connect clicked');

                        onConnect();
                        }} />

                    <ConnectButton 
                    primary={false}
                    onClick={() => {
                        // tslint:disable-next-line:no-console
                        window.open('https://docs.biopset.com', '_blank');

                        }} />
                    <br/><br/><br/><br/>
                </SReasons>

            </SLanding>

        )
    }

}

export default Landing
