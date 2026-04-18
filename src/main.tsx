import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';

import '@mysten/dapp-kit/dist/index.css';
import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient();

const appNetwork = (import.meta.env.VITE_SUI_NETWORK || 'testnet').toLowerCase();

const networks = {
  mainnet: { url: 'https://fullnode.mainnet.sui.io:443', network: 'mainnet' as const },
  testnet: { url: 'https://fullnode.testnet.sui.io:443', network: 'testnet' as const },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork={appNetwork === 'mainnet' ? 'mainnet' : 'testnet'}>
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>
);
