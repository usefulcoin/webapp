import * as React from "react";
import styled from "styled-components";
import Web3 from "web3";

import Web3Modal from "web3modal";
// @ts-ignore
import WalletConnectProvider from "@walletconnect/web3-provider";
// @ts-ignore
import Fortmatic from "fortmatic";
import Torus from "@toruslabs/torus-embed";
import Authereum from "authereum";
// import { Bitski } from "bitski";



import Column from "./components/Column";
import Wrapper from "./components/Wrapper";
import Modal from "./components/Modal";
import Header from "./components/Header";
import Loader from "./components/Loader";
import ModalResult from "./components/ModalResult";
import AccountAssets from "./components/AccountAssets";
import Footer from "./components/Footer";

import { apiGetAccountAssets } from "./helpers/api";
import {
  getChainData
} from "./helpers/utilities";
import { IAssetData } from "./helpers/types";
import {
  BET,
  EXERCISE_EXPIRE,
  STAKE,
  REWARDS,
  BUY_BIOP
} from "./constants";

// Pages
import Rewards from './pages/Rewards';
import Stake from './pages/Stake';
import Trade from './pages/Trade';
import Exercise from './pages/Exercise';
import Landing from './pages/Landing';
import ITCO from './pages/ITCO';

const SLayout = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;
  text-align: center;
`;

const SContent = styled(Wrapper)`
  width: 100%;
  height: 100%;
  padding: 0 16px;
`;

const SContainer = styled.div`
  height: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  word-break: break-word;
`;

const SLanding = styled(Column)`
  height: 600px;
`;

const SModalContainer = styled.div`
  width: 100%;
  position: relative;
  word-wrap: break-word;
`;

const SModalTitle = styled.div`
  margin: 1em 0;
  font-size: 20px;
  font-weight: 700;
`;

const SModalParagraph = styled.p`
  margin-top: 30px;
`;

// @ts-ignore
const SBalances = styled(SLanding)`
  height: 100%;
  width: 100%;
  & h3 {
    padding-top: 30px;
  }
`;



interface IAppState {
  fetching: boolean;
  address: string;
  web3: any;
  provider: any;
  connected: boolean;
  chainId: number;
  networkId: number;
  assets: IAssetData[];
  showModal: boolean;
  pendingRequest: boolean;
  result: any | null;
  page: string;
}



const INITIAL_STATE: IAppState = {
  fetching: false,
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null,
  page: BUY_BIOP
};

function initWeb3(provider: any) {
  const web3: any = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber
      }
    ]
  });

  return web3;
}

class App extends React.Component<any, any> {
  // @ts-ignore
  public web3Modal: Web3Modal;
  public state: IAppState;

  constructor(props: any) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };

    this.web3Modal = new Web3Modal({
      network: this.getNetwork(),
      cacheProvider: true,
      providerOptions: this.getProviderOptions()
    });
  }

  public componentDidMount() {
    if (this.web3Modal.cachedProvider) {
      this.onConnect();
    }
  }

  public setPage(page: string) {
    this.setState({
      page
    });
  }


  public onConnect = async () => {

    // tslint:disable-next-line:no-console
    console.log('connect cliekc');
    const provider = await this.web3Modal.connect();

    await this.subscribeProvider(provider);

    const web3: any = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const networkId = await web3.eth.net.getId();


    const chainId = await web3.eth.chainId();
    // tslint:disable-next-line:no-console
    console.log(`got chain id curve ${chainId} networkid ${networkId} address ${address}`);


    await this.setState({
      web3,
      provider,
      connected: true,
      address,
      chainId,
      networkId,
    });
    await this.getAccountAssets();
  };

  public subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => this.resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await this.setState({ address: accounts[0] });
      await this.getAccountAssets();
    });
    provider.on("chainChanged", async (chainId: number) => {
      const { web3 } = this.state;
      const networkId = await web3.eth.net.getId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });

    provider.on("networkChanged", async (networkId: number) => {
      const { web3 } = this.state;
      const chainId = await web3.eth.chainId();
      await this.setState({ chainId, networkId });
      await this.getAccountAssets();
    });
  };

  public getNetwork = () => getChainData(this.state.chainId).network;

  public getProviderOptions = () => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: "ec1bd267c03c4b3e824ab2f2ad57f9c0"// process.env.REACT_APP_INFURA_ID
        }
      },
      torus: {
        package: Torus
      },
      fortmatic: {
        package: Fortmatic,
        options: {
          key: "pk_live_A9BC4B1ACC54B79C"// process.env.REACT_APP_FORTMATIC_KEY
        }
      },
      authereum: {
        package: Authereum
      },
     /*  bitski: {
        package: Bitski,
        options: {
          clientId: process.env.REACT_APP_BITSKI_CLIENT_ID,
          callbackUrl: window.location.href + "bitski-callback.html"
        }
      } */
    };
    return providerOptions;
  };

  public getAccountAssets = async () => {
    const { address, chainId } = this.state;
    this.setState({ fetching: true });
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);
      await this.setState({ fetching: false, assets });
    } catch (error) {
      console.error(error); // tslint:disable-line
      await this.setState({ fetching: false });
    }
  };

  public toggleModal = () =>
    this.setState({ showModal: !this.state.showModal });






  public resetApp = async () => {
    const { web3 } = this.state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await this.web3Modal.clearCachedProvider();
    this.setState({ ...INITIAL_STATE });
  };

  public renderPage = () => {
    const {
      assets,
      chainId,
      page,
      web3,
      address
    } = this.state;
    switch (page) {
      case BUY_BIOP:
        return (<ITCO
          address={address}
          chainId={chainId}
          web3={web3}
        />);
      case BET:
        return (<Trade
          address={address}
          chainId={chainId}
          web3={web3}
          openExercise={() => {
            this.setState({ page: EXERCISE_EXPIRE })
          }}
        />);
      case EXERCISE_EXPIRE:
        return (<Exercise
          address={address}
          chainId={chainId}
          web3={web3}
        />);
      case STAKE:
        return (<Stake
          address={address}
          chainId={chainId}
          web3={web3}
        />);
        case REWARDS:
        return (<Rewards
          address={address}
          chainId={chainId}
          web3={web3}
        />);
      default:// home page
     
        return (<SBalances>
          
          <h3>Balance</h3>
          <AccountAssets chainId={chainId} assets={assets} />{" "}
        </SBalances>);

    }
  }

  public render = () => {
    const {
      assets,
      address,
      connected,
      chainId,
      fetching,
      showModal,
      pendingRequest,
      result,
      page
    } = this.state;
    return (
      <SLayout>
        <Header
            connected={connected}
            address={address}
            chainId={chainId}
            killSession={this.resetApp}
            setPage={(page: string) => {
              this.setState({ page })
            }}
            currentPage={page}
          />
        <Column spanHeight >
          
          <SContent>
            {fetching ? (
              <Column center spanHeight>
                <SContainer>
                  <Loader />
                </SContainer>
              </Column>
            ) : !!assets && !!assets.length ? (
              this.renderPage()
            ) : (
                  <Landing onConnect={() => this.onConnect()} />

                )}
          </SContent>
        </Column>
        <Footer/>
        <Modal show={showModal} toggleModal={this.toggleModal}>
          {pendingRequest ? (
            <SModalContainer>
              <SModalTitle>{"Pending Call Request"}</SModalTitle>
              <SContainer>
                <Loader />
                <SModalParagraph>
                  {"Approve or reject request using your wallet"}
                </SModalParagraph>
              </SContainer>
            </SModalContainer>
          ) : result ? (
            <SModalContainer>
              <SModalTitle>{"Call Request Approved"}</SModalTitle>
              <ModalResult>{result}</ModalResult>
            </SModalContainer>
          ) : (
                <SModalContainer>
                  <SModalTitle>{"Call Request Rejected"}</SModalTitle>
                </SModalContainer>
              )}
        </Modal>
      </SLayout>
    );
  };
}

export default App;
