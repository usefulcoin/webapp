import * as React from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import Blockie from './Blockie'
import Banner from './Banner'
import { getChainData, ellipseAddress } from '../helpers/utilities'
import { transitions, colors } from '../styles'
import Nav from './Nav'
import i18n from "../i18n";

const SBanner = styled.div`
  top: 0;
  position: absolute
  height: 30px;
  width: 100%;
  background-color: black;
  color: white;
`

const SHeader = styled.div`
  margin-top: -1px;
  margin-bottom: 1px;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  opacity: 100%;
  background-color: rgb(${colors.white});
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0px 3px 6px #00000029;
`

const SActiveAccount = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
`

const SActiveChain = styled.div`
display: flex;
  align-items: center;
  position: relative;
  font-weight: 500;
  flex-direction: column;
  text-align: left;
  align-items: flex-start;
  & p {
    font-size: 0.8em;
    margin: 0;
    padding: 0;
  }
  & p:nth-child(2) {
    font-weight: bold;
  }
`



const SBlockie = styled(Blockie)`
  margin-right: 10px;
`

interface IHeaderStyle {
  connected: boolean
}



const SDisconnect = styled.div<IHeaderStyle>`
  transition: ${transitions.button};
  font-size: 12px;
  font-family: monospace;
  position: absolute;
  right: 0;
  top: 20px;
  opacity: 0.7;
  cursor: pointer;

  opacity: ${({ connected }) => (connected ? 1 : 0)};
  visibility: ${({ connected }) => (connected ? 'visible' : 'hidden')};
  pointer-events: ${({ connected }) => (connected ? 'auto' : 'none')};

  &:hover {
    transform: translateY(-1px);
    opacity: 0.5;
  }
`


interface IHeaderProps {
  killSession: () => void
  connected: boolean
  address: string
  chainId: number
  setPage: (page: string) => void,
  currentPage: string,
  locale: string
}

const Header = (props: IHeaderProps) => {
  const { connected, address, chainId, killSession, setPage, currentPage, locale } = props
  const chainData = chainId ? getChainData(chainId) : null;


  const width = window.innerWidth;
  const height = window.innerHeight;

  return (
    <>
    <SBanner>V4 {i18n[locale].TESTEDITION} </SBanner>
   
    <SHeader {...props}>
      {connected && chainData ? (
        <SActiveChain>
          <Banner />
         
        </SActiveChain>
      ) : (
        <></>
      )}
      {connected ? (
         <Nav setPage={setPage} currentPage={currentPage} locale={locale}/>
      ) : <></>}
      {address && (
        <SActiveAccount>
          <SBlockie address={address} />
          <SDisconnect connected={connected} onClick={killSession}>
          {width > height ? ellipseAddress(address) : ""}
          </SDisconnect>
        </SActiveAccount>
      )}
    </SHeader>
    </>
  )
  // <SBlockie address={address} />
  // const SAddress = styled.p<IHeaderStyle>`
  /* transition: ${transitions.base};
  font-weight: bold;
  margin: ${({ connected }) => (connected ? '-2px auto 0.7em' : '0')};
`<SAddress connected={connected}>{ellipseAddress(address)}</SAddress>
        */   
}

Header.propTypes = {
  killSession: PropTypes.func.isRequired,
  address: PropTypes.string
}

export default Header
