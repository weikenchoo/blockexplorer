import { useEffect, useState } from 'react';
import { BrowserRouter as Router,Route, Switch } from "react-router-dom";
import './App.css';
import  LatestBlocks from "./components/LatestBlocks";
import BlockDetail from './components/BlockDetail';
import LatestTransactions from './components/LatestTransactions';
import alchemy from './alchemy.js';
import TransactionDetail from './components/TransactionDetail';
import Address from './components/Address';
import BlockTransactions from './components/BlockTransactions';
import NavBar from './components/NavBar';
import NotFound from './components/NotFound';




function App() {
  const [latestBlock, setLatestBlock] = useState();

  useEffect(() => {

    let isMounted = true;

    const getLatestBlock = async () => {
      try {
        const latestBlockNumber = await alchemy.core.getBlockNumber();
        if (isMounted) {
          setLatestBlock(latestBlockNumber);
        }
      } catch (error) {
        console.error('Failed to fetch latest block:', error);
      }
    };

    const interval = setInterval(getLatestBlock, 5000); // Fetch latest block every 5 seconds

    getLatestBlock();

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  },[]);

  return (
  <div className=''>
    
    
    <Router>
      <NavBar latestBlock={latestBlock}/>
      <Switch>

        <Route exact path='/'>
          
          <div className='flex'>
            <div className='flex-1 text-center px-4 py-2 m-2'>
              <LatestBlocks latestBlock={latestBlock}/>
            </div>
            <div className='flex-1 text-center px-4 py-2 m-2'>
              <LatestTransactions latestBlock={latestBlock}/>
            </div>

          </div>
          
        </Route>

        <Route path='/block/:blockNumber'>
          <BlockDetail/>
        </Route>

        <Route path='/transaction/:hash'>
          <TransactionDetail/>
        </Route>

        <Route path='/address/:address'>
          <Address/>
        </Route>

        <Route path='/transactionDetails/:blockNumber'>
          <BlockTransactions/>
        </Route>

        <Route path='/404/:query'>
          <NotFound/>
        </Route>
        
      </Switch>
    </Router>
    
  </div>
  );
}

export default App;
