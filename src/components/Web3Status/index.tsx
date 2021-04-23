import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { darken } from 'polished'
import React from 'react'
import { Activity } from 'react-feather'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import CoinbaseWalletIcon from '../../assets/images/coinbaseWalletIcon.svg'
import FortmaticIcon from '../../assets/images/fortmaticIcon.png'
import PortisIcon from '../../assets/images/portisIcon.png'
import WalletConnectIcon from '../../assets/images/walletConnectIcon.svg'
import { fortmatic, injected, portis, walletconnect, walletlink } from '../../connectors'
import { NetworkContextName } from '../../constants'
import { useWalletModalToggle } from '../../redux/application/hooks'

import Identicon from '../Identicon'
import WalletModal from '../WalletModal'
import { Button as RebassButton } from 'rebass/styled-components'
import { colors } from '../../styles'

const IconWrapper = styled.div<{ size?: number }>`
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  & > * {
    height: ${({ size }) => (size ? size + 'px' : '32px')};
    width: ${({ size }) => (size ? size + 'px' : '32px')};
  }
`

// const Web3StatusGeneric = styled(RebassButton)`
//   font-weight: 500;
//   text-align: center;
//   outline: none;
//   text-decoration: none;
//   display: flex;
//   justify-content: center;
//   flex-wrap: nowrap;
//   position: relative;
//   z-index: 1;
//   border: 1px solid '#F00';
//   color: '#F00';
//   background-color: transparent;
//   font-size: 16px;
//   border-radius: 12px;
//   padding: 10px;
//   width: 100%;
//   align-items: center;
//   padding: 0.5rem;
//   border-radius: 12px;
//   cursor: pointer;
//   user-select: none;
//   :focus {
//     outline: none;
//   }
//   &:focus {
//     box-shadow: 0 0 0 1pt '#F00';
//     border: 1px solid '#F00';
//   }
//   &:hover {
//     border: 1px solid '#F00';
//   }
//   &:active {
//     box-shadow: 0 0 0 1pt '#F00';
//     border: 1px solid '#F00';
//   }
//   &:disabled {
//     opacity: 50%;
//     cursor: auto;
//   }
//   a:hover {
//     text-decoration: none;
//   }
// `

const Web3StatusError = styled(RebassButton)`
  font-weight: 500;
  :hover,
  :focus {
    background-color: ${darken(0.1, colors.red1)};
  }
`

const Web3StatusConnect = styled(RebassButton)<{ faded?: boolean }>`

  font-weight: 500;

  :hover,
  :focus {
    border: 1px solid ${darken(0.05, colors.primary4)};
    color: ${colors.primaryText1};
  }

  ${({ faded }) =>
    faded &&
    css`
      background-color: ${colors.primary5};
      border: 1px solid ${colors.primary5};
      color: ${colors.primaryText1};

      :hover,
      :focus {
        border: 1px solid ${ darken(0.05, colors.primary4)};
        color: ${darken(0.05, colors.primaryText1)};
      }
    `}
`

const Web3StatusConnected = styled(RebassButton)<{ pending?: boolean }>`
  background-color: #2172E5;
  border: 1px solid #2172E5;
  color: #FFF;
  font-weight: 500;
  :hover,
  :focus {
    background-color: #2172E5;

    :focus {
      border: 1px solid #2172E5;
    }
  }
`

const Text = styled.p`
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0 0.5rem 0 0.25rem;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
`

const NetworkIcon = styled(Activity)`
  margin-left: 0.25rem;
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
`

// eslint-disable-next-line react/prop-types
function StatusIcon({ connector }: { connector: AbstractConnector }) {
  if (connector === injected) {
    return <Identicon />
  } else if (connector === walletconnect) {
    return (
      <IconWrapper size={16}>
        <img src={WalletConnectIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === walletlink) {
    return (
      <IconWrapper size={16}>
        <img src={CoinbaseWalletIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === fortmatic) {
    return (
      <IconWrapper size={16}>
        <img src={FortmaticIcon} alt={''} />
      </IconWrapper>
    )
  } else if (connector === portis) {
    return (
      <IconWrapper size={16}>
        <img src={PortisIcon} alt={''} />
      </IconWrapper>
    )
  }
  return null
}

function Web3StatusInner() {
  const { t } = useTranslation()
  const { account, connector, error } = useWeb3React()

  const toggleWalletModal = useWalletModalToggle()

  if (account) {
    return (
      <Web3StatusConnected id="web3-status-connected" onClick={toggleWalletModal} >
        {connector && <StatusIcon connector={connector} />}
      </Web3StatusConnected>
    )
  } else if (error) {
    return (
      <Web3StatusError onClick={toggleWalletModal}>
        <NetworkIcon />
        <Text>{error instanceof UnsupportedChainIdError ? 'Wrong Network' : 'Error'}</Text>
      </Web3StatusError>
    )
  } else {
    return (
      <Web3StatusConnect id="connect-wallet" onClick={toggleWalletModal} faded={!account}>
        <Text>{t('Connect to a wallet')}</Text>
      </Web3StatusConnect>
    )
  }
}

export default function Web3Status() {
  const { active } = useWeb3React()
  const contextNetwork = useWeb3React(NetworkContextName)

  if (!contextNetwork.active && !active) {
    return null
  }

  return (
    <>
      <Web3StatusInner />
      <WalletModal />
    </>
  )
}
