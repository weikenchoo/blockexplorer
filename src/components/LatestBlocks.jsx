import React, { useEffect, useState } from 'react';
import alchemy from "../alchemy";
import shortConvertTimestamp from '../shortConvertTimestamp';
import { Link } from "react-router-dom";


function LatestBlocks(props) {
    const { latestBlock } = props;
    const [blockData, setBlockData] = useState([]);
    

    useEffect(() => {
        const _blockData = [];
        async function getBlockDetails(latestBlock) {
            for (let i = 0; i < 5; i++) {
                const block = await alchemy.core.getBlock(latestBlock - i);
                
                _blockData.push({
                    number:block.number,
                    miner: block.miner,
                    transactionCount:block.transactions.length,
                    timestamp:block.timestamp
                })
            }
            setBlockData(_blockData);
        }
        
        
        if (latestBlock) {
            getBlockDetails(latestBlock);
        }
    
    },[latestBlock])

    return (
        <div className=" m-2 p-2" >
            <div >
                <h1 className=' text-xl border-2 rounded-t-lg  p-4 flex items-center '>Latest Blocks</h1>
            </div>
            <div>
                {blockData.map((block, index)=>(
                    <div key={block.number} className='flex  p-4  border-x-2 border-b-2 last:rounded-b-lg'>
                        <div className='flex-1 '>
                            <div>
                                <Link to={`/block/${block.number}`} className='text-blue-800 hover:text-blue-500'>{block.number}</Link>
                            </div>
                            <div>
                                {shortConvertTimestamp(block.timestamp)}
                            </div>
                            
                        </div>
                        
                        <div className='flex-1'>
                            <div>
                                Fee Recipient:
                                <Link to={`/address/${block.miner}`} className='text-blue-800 hover:text-blue-500'>  {block.miner.slice(0,8)}...{block.miner.slice(-7)}</Link>
                            </div>
                            <div>
                                <Link to={`/transactionDetails/${block.number}`} className='text-blue-800 hover:text-blue-500'>{block.transactionCount} </Link>
                                txns
                            </div>
                            
                        </div>
                        
                    </div>
                ))}
            </div>
        </div>

    )
}

export default LatestBlocks