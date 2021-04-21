import * as React from "react";
import * as ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";

import App from "./App";
import { Provider } from 'react-redux'
import store from './redux'
import UserUpdater from './redux/user/updater'
import { globalStyle } from "./styles";
const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;

// @ts-ignore
declare global {
  // tslint:disable-next-line
  interface Window {
    web3: any;
    ethereum: any;
    Web3Modal: any;
    Box: any;
    box: any;
    space: any;
  }
}

function Updaters() {
  return (
    <>
      <UserUpdater />
    </>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <Updaters />
    <GlobalStyle />
    <App />
  </Provider>,
  document.getElementById("root")
);
