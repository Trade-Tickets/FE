
import { useEffect } from 'react';
import { Marketplace } from './pages/Marketplace';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { useAppStore } from './store';
import { ToastContainer } from './components/common/ToastContainer';
import { useCurrentAccount } from '@mysten/dapp-kit';

function WalletSync() {
  const account = useCurrentAccount();

  useEffect(() => {
    useAppStore.setState({
      isWalletConnected: !!account,
      walletAddress: account ? account.address : null,
    });

    if (account?.address) {
      useAppStore.getState().syncWalletDataFromBE();
    }
  }, [account]);

  return null;
}

export default function App() {
  const activePage = useAppStore(state => state.activePage);

  useEffect(() => {
    const interval = setInterval(() => {
      useAppStore.getState().checkExpiredOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <WalletSync />
      <ToastContainer />
      {activePage === 'landing' && <LandingPage />}
      {activePage === 'markets' && <Marketplace />}
      {activePage === 'dashboard' && <Marketplace />} 
      {activePage === 'profile' && <ProfilePage />}
    </>
  );
}
