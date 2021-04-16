

import * as React from "react";
import styled from "styled-components";
import Column from 'src/components/Column';
import ConnectButton from "../components/ConnectButton";
// @ts-ignore
import { ScrollDownIndicator} from 'react-landing-page';
import { colors } from 'src/styles';
import logo from "../assets/logo.png";
import i18n from "../i18n";
import { DEFAULT_LANG } from "src/constants";

const SBrand = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
  & span {
    color: rgb(${colors.lightGrey});
    font-size: 10vh;
    
  }
`;

const SLogo = styled.div`
  width: 15vh;
  height: 15vh;
  background: url(${logo}) no-repeat;
  background-size: cover;
  background-position: center;
`;


const SLanding = styled(Column)`
  width:100%;
  height:100%;
  font-family: "octarine";
  padding: 6%;
`;
const SReasons = styled(Column)`
  width: 100%;
`;

interface IBetProps {
    onConnect: any
}


interface ILandingState {
  locale: string;
}

const INITIAL_STATE: ILandingState = {
  locale: DEFAULT_LANG
};

class Landing extends React.Component<any, any> {

    // @ts-ignore
    public state: ILandingState;

    constructor(props: IBetProps) {
        super(props);
        this.state = {
          ...INITIAL_STATE
      };
    }


    public async componentDidMount() {
      const locale = localStorage.getItem('locale');
      this.setState({locale: locale !== null ? locale : DEFAULT_LANG});
  }


    public render() {
      const { onConnect } = this.props;
      const { locale } = this.state;
        return (
            <SLanding >
                <SReasons >
                    <SBrand>
                        <SLogo/><span>biopset</span>
                    </SBrand>
                    <h3 style={{color: `rgb(${colors.black})`}}>{i18n[locale].LANDING1}</h3>
                    <p style={{fontSize: 'small', color: `rgb(${colors.lightGrey})`}}>{i18n[locale].LANDING2}</p>
                    <ConnectButton 
                    primary={true}
                    locale={locale}
                    onClick={() => {
                        // tslint:disable-next-line:no-console
                        console.log('connect clicked');

                        onConnect();
                        }} />

                    <ConnectButton 
                    primary={false}
                    locale={locale}
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
