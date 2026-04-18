/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { Marketplace } from './pages/Marketplace';
import { LandingPage } from './pages/LandingPage';
import { useAppStore } from './store';
import { ToastContainer } from './components/common/ToastContainer';

export default function App() {
  const activePage = useAppStore(state => state.activePage);

  // Cronjob to scan and expire overdue orders every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      useAppStore.getState().checkExpiredOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ToastContainer />
      {activePage === 'landing' ? <LandingPage /> : <Marketplace />}
    </>
  );
}
