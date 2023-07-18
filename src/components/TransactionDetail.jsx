import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import alchemy from "../alchemy";
import { Utils } from 'alchemy-sdk';
import convertTimestamp from '../convertTimestamp';
import { Link } from "react-router-dom";

function TransactionDetail() {
    const {hash} = useParams();
    const [blockNumber, setBlockNumber] = useState();
    const [confirmations, setConfirmations] = useState();
    const [timestamp, setTimestamp] = useState();
    const [to, setTo] = useState();
    const [from, setFrom] = useState();
    const [value, setValue] = useState();
    const [txnFee, setTxnFee] = useState();
    const [gasPrice, setGasPrice] = useState();
    const [ethValue, setEthValue] = useState();
    

    useEffect(() => {
        async function getTransactionDetails(hash) {
            const txn = await alchemy.core.getTransactionReceipt(hash);
            const txnDetails = await alchemy.transact.getTransaction(hash);
            const _txnFee = txn.gasUsed * txn.effectiveGasPrice;
            setBlockNumber(txn.blockNumber);
            setConfirmations(txn.confirmations);
            setTo(txn.to);
            setFrom(txn.from);
            setValue(Utils.formatEther(txnDetails.value));
            setTxnFee(_txnFee.toString());
            setGasPrice(txn.effectiveGasPrice);
            getTimestamp(txn.blockNumber);
            getEthValue(Utils.formatEther(_txnFee.toString()))
            
        }

        async function getTimestamp(blockNumber) {
            const block = await alchemy.core.getBlock(blockNumber);
            const _timestamp = block.timestamp;
            setTimestamp(_timestamp);
        }

        function getEthValue(balance) {
            const endpoint = 'https://api.etherscan.io/api?module=stats&action=ethprice&apikey='+process.env.REACT_APP_ETHERSCAN_API_KEY;

            fetch(endpoint,{
                method:'GET'
            }).then(response => response.json())
            .then(data => {
                const ethPrice = data.result.ethusd;
                setEthValue(balance*ethPrice);
            })
            .catch(error => {
                console.error(error);
            });
        }
        
        if (hash) {
            getTransactionDetails(hash);
        }
        
    
      
    }, [hash])

    return (
        <div>
            <div className='flex flex-col m-4 p-4 border rounded-lg mx-32 '>
                <div className='flex border-b-2 border-slate-300'>
                    <div className=' basis-2/12  p-2 font-bold text-xl'>
                        Transaction :
                    </div>
                    <div className='p-2 font-bold text-xl truncate'>{hash}</div>
                    
                </div>
                <div className='flex'>
                    <div className=' basis-2/12  p-2  '>
                        Block Number :
                    </div>
                    <div className='p-2 truncate'>
                        <Link to={`/block/${blockNumber}`} className='text-blue-800 hover:text-blue-500'>{blockNumber}</Link>
                    </div>
                </div>
                <div className='flex'>
                    <div className=' basis-2/12  p-2  '>
                        Confirmations :
                    </div>
                    <div className='p-2 truncate'>{confirmations}</div>
                </div>
                <div className='flex'>
                    <div className=' basis-2/12  p-2  '>
                        Timestamp :
                    </div>
                    <div className='p-2 truncate'>{convertTimestamp(timestamp)}</div>
                </div>
                
            </div>
            <div className='flex flex-col m-4 p-4 border rounded-lg mx-32 '>
                <div className='flex'>
                    <div className=' basis-2/12  p-2  '>
                        From :
                    </div>
                    <div className='p-2 truncate'>
                        <Link to={`/address/${from}`} className='text-blue-800 hover:text-blue-500'>{from}</Link>
                    </div>
                </div>
                <div className='flex'>
                    <div className=' basis-2/12  p-2  '>
                        To :
                    </div>
                    <div className='p-2 truncate'>
                        <Link to={`/address/${to}`} className='text-blue-800 hover:text-blue-500'>{to}</Link>
                    </div>
                </div>
            </div>
            <div className='flex flex-col m-4 p-4 border rounded-lg mx-32 '>
                <div className='flex'>
                    <div className=' basis-2/12  p-2  '>
                        Value :
                    </div>
                    <div className='p-2 truncate'>{value} ETH</div>
                </div>
                {
                    txnFee &&
                    <div className='flex'>
                        <div className=' basis-2/12  p-2  '>
                            Transaction Fee :
                        </div>
                        <div className='p-2 truncate'>{Utils.formatEther(txnFee)} ETH ($ {Math.round(ethValue * 100) / 100})</div>
                    </div>
                }
                {
                    gasPrice &&
                    <div className='flex'>
                        <div className=' basis-2/12  p-2  '>
                            Gas Price :
                        </div>
                        <div className='p-2 truncate'>{Utils.formatUnits(gasPrice,"gwei")} gwei</div>
                    </div>
                }
                
            </div>
            

        </div>
    )
}


export default TransactionDetail