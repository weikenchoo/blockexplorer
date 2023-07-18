import React, { useEffect, useState } from 'react';
import alchemy from "../alchemy";
import shortConvertTimestamp from '../shortConvertTimestamp';
import { Link } from "react-router-dom";
import { Utils } from 'alchemy-sdk';



function LatestTransactions(props) {
    const {latestBlock} = props;
    
    const [transactions, setTransactions] = useState([]);
    
    useEffect(() => {
        async function getTransactions(latestBlock) {
            const block = await alchemy.core.getBlockWithTransactions(latestBlock);
            
            const _transactions = block.transactions.slice(0,5);

            const transactionObject = _transactions.map((transaction)=>{
                
                let roundValue = Utils.formatEther(transaction.value);
                roundValue = Math.round(roundValue * 1e4) / 1e4;
                
                return {
                    hash:transaction.hash,
                    value:roundValue,
                    to:transaction.to,
                    from:transaction.from,
                    timestamp:block.timestamp
                }
            })
            setTransactions(transactionObject);
            
            
        }
        
      getTransactions(latestBlock);
    },[latestBlock])
    
    
    

    return (
        <div className=' m-2 p-2'>
            <h1 className=' text-xl border-2 rounded-t-lg  p-4 flex items-center'>Latest Transactions</h1>
            {transactions.map((transaction)=>(
                <div key={transaction.hash} className='flex  p-4 border-x-2 border-b-2 last:rounded-b-lg'>
                    <div className='flex-1 '>
                        <div className='text-blue-800 hover:text-blue-500'>
                            <Link to={`/transaction/${transaction.hash}`}>{transaction.hash.slice(0,15) + "..."}</Link>
                        </div>
                        <div>
                            {shortConvertTimestamp(transaction.timestamp)}
                        </div>
                        
                        
                    </div>
                    
                    <div className='flex-1 '>
                        <div className='' >
                            To:
                            <Link to={`/address/${transaction.to}`} className='text-blue-800 hover:text-blue-500'> {transaction.to.slice(0,8)}...{transaction.to.slice(-7)}</Link>
                        </div>
                        <div className=''>
                            From:  
                            <Link to={`/address/${transaction.from}`} className='text-blue-800 hover:text-blue-500'> {transaction.from.slice(0,8)}...{transaction.from.slice(-7)}</Link>
                        </div>
                        
                        
                    </div>
                    <div className='w-1/6 flex-none border rounded-full text-sm flex items-center justify-center '>
                        {transaction.value} ETH
                    </div>
                    
                </div>
            ))}
            
        </div>
    );
}


export default LatestTransactions