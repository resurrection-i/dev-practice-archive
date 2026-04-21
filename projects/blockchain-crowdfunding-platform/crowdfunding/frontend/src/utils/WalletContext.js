import { createContext } from 'react';

// 创建钱包上下文
const WalletContext = createContext({
  account: null,
  balance: '0',
  provider: null,
  signer: null,
  networkName: '',
  connectWallet: () => {},
  disconnectWallet: () => {},
  loading: true,
  wrongNetwork: false,
  userInfo: null,
  setUserInfo: () => {}
});

export default WalletContext;