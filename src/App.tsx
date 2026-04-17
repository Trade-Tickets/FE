/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Marketplace } from './pages/Marketplace';
import { LandingPage } from './pages/LandingPage';
import { useAppStore } from './store';

export default function App() {
  const activePage = useAppStore(state => state.activePage);

  if (activePage === 'landing') {
    return <LandingPage />;
  }

  return <Marketplace />;
}
