import React, { useEffect, useState } from "react";
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

import Web3ReactManager from './components/Web3ReactManager'
import Column from "./components/Column";
import Wrapper from "./components/Wrapper";
import Modal from "./components/Modal";
import Header from "./components/Header";
import Loader from "./components/Loader";
import ModalResult from "./components/ModalResult";
import AccountAssets from "./components/AccountAssets";
import Footer from "./components/Footer";
import WalletModal from './components/WalletModal'
import { useWalletModalToggle } from './redux/application/hooks'
import { apiGetAccountAssets } from "./helpers/api";
import {
  getChainData
} from "./helpers/utilities";
import { IAssetData } from "./helpers/types";
import {
  TRADE,
  EXERCISE_EXPIRE,
  STAKE,
  GOVERNANCE,
  BUY_BIOP,
  DEFAULT_LANG
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

function App() {
  const [page, setPage] = useState<string>(BUY_BIOP);
  const [address, setAddress] = useState<string>("");
  const [locale, setLocale] = useState<string>(DEFAULT_LANG)
  const [showModal, setShowModal] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  const [chainId, setChainId] = useState<number>(1);
  const [web3, setWeb3] = useState<any>();
  // const [provider, setProvider] = useState<any>();
  const [assets, setAssets] = useState<IAssetData[]>([]);
  const [result, setResult] = useState<any | null>();

  // constructor(props: any) {
  //   super(props);
  //   this.state = {
  //     ...INITIAL_STATE
  //   };


  // }

  // const componentDidMount() {
  //   if (this.web3Modal.cachedProvider) {
  //     this.onConnect();
  //   }
  // }

  const onConnect = async () => {
    console.log('connect cliekc');
    const provider = await web3Modal.connect();

    await subscribeProvider(provider);

    const web3: any = initWeb3(provider);

    const accounts = await web3.eth.getAccounts();

    const address = accounts[0];

    const chainId = await web3.eth.chainId();

    setWeb3(web3);
    // setProvider(provider);
    setConnected(true);
    setAddress(address);
    setChainId(chainId);
    await getAccountAssets();
  };

  const subscribeProvider = async (provider: any) => {
    if (!provider.on) {
      return;
    }
    provider.on("close", () => resetApp());
    provider.on("accountsChanged", async (accounts: string[]) => {
      await setAddress(accounts[0]);
      await getAccountAssets();
    });
    provider.on("chainChanged", async (chainId: number) => {
      await setChainId(chainId);
      await getAccountAssets();
    });

    provider.on("networkChanged", async (networkId: number) => {
      await setChainId(chainId);
      await getAccountAssets();
    });
  };

  const getNetwork = () => getChainData(chainId).network;

  const getProviderOptions = () => {
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

  const getAccountAssets = async () => {
    setFetching(true)
    try {
      // get account balances
      setFetching(false);
      const assets1 = await apiGetAccountAssets(address, chainId);
      setAssets(assets1);
    } catch (error) {
      console.error(error); // tslint:disable-line
      setFetching(false)
    }
  };

  const toggleModal = () => {
    setShowModal(!showModal)
  }

  const resetApp = async () => {
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    // this.setState({ ...INITIAL_STATE });
  };

  const web3Modal = new Web3Modal({
    network: getNetwork(),
    cacheProvider: true,
    providerOptions: getProviderOptions()
  });

  const renderPage = () => {
    switch (page) {
      case BUY_BIOP:
        return (
          <ITCO
            address={address}
            chainId={chainId}
            web3={web3}
          />
        );
      case TRADE:
        return (
          <Trade
            address={address}
            chainId={chainId}
            web3={web3}
            openExercise={() => {
              setPage(EXERCISE_EXPIRE)
            }}
          />
        );
      case EXERCISE_EXPIRE:
        return (
          <Exercise
            address={address}
            chainId={chainId}
            web3={web3}
          />
        );
      case STAKE:
        return (
          <Stake
            address={address}
            chainId={chainId}
            web3={web3}
          />
        );
      case GOVERNANCE:
        return (
          <Rewards
            address={address}
            chainId={chainId}
            web3={web3}
          />
        );
      default:// home page
        return (
          <SBalances>
            <h3>Balance</h3>
            <AccountAssets chainId={chainId} assets={assets} />{" "}
          </SBalances>
        );
    }
  }

  const toggleWalletModal = useWalletModalToggle()

  useEffect(() => {
    setResult('AAA');
    setPendingRequest(false);
    const locale1 = localStorage.getItem('locale');
    setLocale(locale1 !== null ? locale : DEFAULT_LANG);
    toggleWalletModal();
  }, [])

  return (
    <Web3ReactManager>
      <SLayout>
        <Header
          locale={locale}
          connected={connected}
          address={address}
          chainId={chainId}
          killSession={resetApp}
          setPage={(page: string) => {
            setPage(page)
          }}
          currentPage={page}
        />

        <Column spanHeight >
          <SContent>
            {
              fetching ? (
                <Column center spanHeight>
                  <SContainer>
                    <Loader />
                  </SContainer>
                </Column>
              )
                :
                !!assets && !!assets.length ? (
                  renderPage()
                ) : (
                  <Landing onConnect={onConnect} />
                )
            }
          </SContent>

          <Modal show={showModal} toggleModal={toggleModal}>
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
        </Column>
        <WalletModal />
        <Footer
          locale={locale}
          connected={connected}
        />
      </SLayout>
    </Web3ReactManager>
  );
}

export default App;
