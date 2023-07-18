import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import alchemy from "../alchemy";
import { Utils } from 'alchemy-sdk';
import convertTimestamp from '../convertTimestamp';
import { Link } from "react-router-dom";



function BlockDetail() {

    const {blockNumber} = useParams();
    const [transactions, setTransactions] = useState();
    const [timeStamp, setTimeStamp] = useState();
    const [gasUsed, setGasUsed] = useState();
    const [gasLimit, setGasLimit] = useState();
    const [baseFeePerGas, setBaseFeePerGas] = useState();
    const [miner, setMiner] = useState();
    const [txnFees, setTxnFees] = useState();
    const [burntFees, setBurntFees] = useState();
    const [blockReward, setBlockReward] = useState();

    useEffect(() => {
      async function getBlockDetails() {
        const block = await alchemy.core.getBlockWithTransactions(parseInt(blockNumber));
      
        
        setTransactions(block.transactions);
        setTimeStamp(block.timestamp);
        setGasUsed(Utils.formatUnits(block.gasUsed, "wei"));
        setGasLimit(Utils.formatUnits(block.gasLimit, "wei"));
        setBaseFeePerGas(Utils.formatUnits(block.baseFeePerGas, "gwei"));
        setMiner(block.miner);
      

        const txnReceipts = await alchemy.core.getTransactionReceipts({blockHash:block.hash});
        let _txnFees = 0;
        for (let i = 0; i < txnReceipts.receipts.length; i++) {
          const receipt = txnReceipts.receipts[i];
          const effectiveGasPrice = parseInt(receipt.effectiveGasPrice);
          const _gasUsed = parseInt(receipt.gasUsed);
          const txnFee = effectiveGasPrice * _gasUsed;
          _txnFees+=txnFee;
        }
        setTxnFees(Utils.formatEther(_txnFees.toString()));

        const _burntFees = block.gasUsed * block.baseFeePerGas;
        setBurntFees(Utils.formatEther(_burntFees.toString()));

        const _blockReward = _txnFees - _burntFees;
        setBlockReward(Utils.formatEther(_blockReward.toString()));
      }
      
      if (blockNumber) {
        getBlockDetails();
      }
    }, [blockNumber])

    return (
        <div>
          <div className='flex flex-col m-4 p-4 border rounded-lg mx-32 '>

            <div className='flex border-b-2 border-slate-300'>
              
              <div className=' basis-2/12  p-2  font-bold text-xl'>
                Block height :
              </div>
              <div className='p-2 font-bold text-xl truncate '>{blockNumber}</div>
              
            </div>

            <div className='flex'>
              <div className=' basis-2/12  p-2  '>
                Transactions :
              </div>
              <div className=' p-2 truncate'>
                {transactions && 
                <Link to={`/transactionDetails/${blockNumber}`} className='text-blue-800 hover:text-blue-500 '>
                  {transactions.length + " "}
                </Link>
                }
                transactions
              </div>
            </div>

            <div className='flex'>
              <div className=' basis-2/12  p-2 '>
                Timestamp :
              </div>
              
              {timeStamp && <div className='truncate  p-2'>{convertTimestamp(timeStamp)}</div>}
            </div>
            
            
            
          </div>

          <div className='flex flex-col m-4 p-4 border rounded-lg mx-32 '>

            <div className='flex flex-wrap'>
              <div className=' basis-2/12  p-2  '>
                Fee recipient : 
              </div>
              <div className='p-2 truncate  '>
                <Link to={`/address/${miner}`} className='text-blue-800 hover:text-blue-500'> 
                  {miner}
                </Link>
              </div>
            </div>

            <div className='flex'>
              <div className=' basis-2/12  p-2  '>
                Block Reward : 
              </div>
              <div className='p-2 truncate  '>
                {blockReward} ETH (0 + {txnFees} ETH - {burntFees} ETH)
              </div>
            </div>
            
          </div>


          <div className='flex flex-col m-4 p-4 border rounded-lg mx-32 '> 
            <div className='flex'>
              <div className=' basis-2/12  p-2  '>
                Gas Used :  
              </div>
              {gasUsed && <div className='p-2 truncate'>{gasUsed} wei</div>}
            </div>

            <div className='flex'>
              <div className=' basis-2/12  p-2  '>
                Gas Limit :  
              </div>
              {gasLimit && <div className='p-2 truncate'>{gasLimit} wei</div>}
            </div>

            <div className='flex'>
              <div className=' basis-2/12  p-2  '>
                Base Fee Per Gas :  
              </div>
              {baseFeePerGas && <div className='p-2 truncate'>{baseFeePerGas} gwei</div>}
            </div>
            
            
          </div>
            
            
        </div>
    )
}

export default BlockDetail