import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'

import App from "./App";
import { Provider } from 'react-redux'
import store from './redux'
import UserUpdater from './redux/user/updater'
import { globalStyle } from "./styles";
import getLibrary from './utils/getLibrary'
import { NetworkContextName } from './constants'

const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName);

function Updaters() {
  return (
    <>
      <UserUpdater />
    </>
  )
}

ReactDOM.render(
  <Web3ReactProvider getLibrary={getLibrary}>
    <Web3ProviderNetwork getLibrary={getLibrary}>
      <Provider store={store}>
        <Updaters />
        <GlobalStyle />
        <App />
      </Provider>
    </Web3ProviderNetwork>
  </Web3ReactProvider>,
  document.getElementById("root")
);
