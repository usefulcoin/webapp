import * as React from 'react'
import styled from 'styled-components'
import * as PropTypes from 'prop-types'
import Blockie from './Blockie'
import Banner from './Banner'
import { getChainData, ellipseAddress } from '../helpers/utilities'
import { transitions } from '../styles'
import Nav from './Nav'
import logo from "../assets/logo.png";

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
  justify-content: space-between;
  padding: 0 16px;
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

const SLogo = styled.div`
  width: 45px;
  height: 45px;
  background: url(${logo}) no-repeat;
  background-size: cover;
  background-position: center;
`;

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
  currentPage: string
}

const Header = (props: IHeaderProps) => {
  const { connected, address, chainId, killSession, setPage, currentPage } = props
  const chainData = chainId ? getChainData(chainId) : null
  return (
    <>
    <SBanner>BIOP V3 is now live!🚀 Looking for v2? <a href="https://biopset-v2.surge.sh" style={{border: "1px solid white"}}>click here</a></SBanner>
   
    <SHeader {...props}>
      {connected && chainData ? (
        <SActiveChain>
          <SLogo/>
         
        </SActiveChain>
      ) : (
        <Banner />
      )}
      {connected ? (
         <Nav setPage={setPage} currentPage={currentPage}/>
      ) : <></>}
      {address && (
        <SActiveAccount>
          <SBlockie address={address} />
          <SDisconnect connected={connected} onClick={killSession}>
          {ellipseAddress(address)}
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
