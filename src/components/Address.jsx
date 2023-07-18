import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import alchemy from "../alchemy";
import { Utils } from 'alchemy-sdk';
import convertTimestamp from '../convertTimestamp';
import ReactPaginate from 'react-paginate';
import { Link } from "react-router-dom";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";



function Address() {
    const {address} = useParams();
    const [ethBalance, setEthBalance] = useState();
    const [ethValue, setEthValue] = useState();
    const [transactions, setTransactions] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const transactionPerPage = 20;
    

    useEffect(() => {
        async function getBalance(address) {
            const balance = await alchemy.core.getBalance(address);
            setEthBalance(Utils.formatEther(balance));
            getEthValue(Utils.formatEther(balance))
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

        function getTransactions() {
            const txnEndpoint = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0
                &endblock=99999999
                &sort=desc
                &apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`.replace(/\n\s*/g, '');

            fetch(txnEndpoint)
            .then(response => response.json())
            .then(data => {
                const txns = data.result;
                setTransactions(txns);
            })
            .catch(error => {
            console.error(error);
            });
        }

        if (address) {
            getBalance(address);
            getTransactions();
        }

    }, [address])
    
  

    const endOffset = itemOffset + transactionPerPage;   
    const currentItems = transactions.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(transactions.length / transactionPerPage);
    const currentPage = Math.ceil(endOffset /  transactionPerPage);
    const showNextButton = currentPage !== pageCount - 1;
    const showPrevButton = currentPage !== 0;


    const handlePageClick = (event)=>{
        const newOffset = (event.selected * transactionPerPage);
        setItemOffset(newOffset);
    };
    

    return (
        <div>
            <div className='flex flex-col m-4 p-4 border rounded-lg mx-32 '>
                <div className='flex border-b-2 border-slate-300'>
                    <div className=' basis-2/12  p-2 font-bold text-xl'>
                        Address :
                    </div>
                    <div className='p-2 font-bold text-xl truncate'>{address}</div>
                </div>
                <div className='flex'>
                    <div className=' basis-2/12  p-2  '>
                        ETH Balance :
                    </div>
                    <div className='p-2 truncate'>{ethBalance} ETH</div>
                </div>
                <div className='flex'>
                    <div className=' basis-2/12  p-2  '>
                        ETH Value :
                    </div>
                    <div className='p-2 truncate'>$ {Math.round(ethValue * 100) / 100}</div>
                </div>
            </div>
            

            

            <div className='flex flex-col m-4 px-4 pt-2 border rounded-lg mx-32 '>
                <div className='flex text-center font-bold border-b-2 border-slate-300'>
                    <div className='flex-1 '>Transaction hash</div>
                    <div className='flex-1 '>Block Number</div>
                    <div className='flex-1 '>Timestamp</div>
                    <div className='flex-1 '>From</div>
                    <div className='flex-1 '>To</div>
                    <div className='flex-1 '>Value</div>
                </div>
                {
                    currentItems.map((txn)=>(
                        <div key={txn.hash} className='flex mb-2 p-2 text-center border-b-2 last:border-b-0'>
                            <div  className='flex-1 truncate'>
                                <Link to={`/transaction/${txn.hash}`} className='text-blue-800 hover:text-blue-500'>{txn.hash.slice(0,16)+"..."}</Link>
                            </div>
                            <div className='flex-1 truncate'>
                                <Link to={`/block/${txn.blockNumber}`} className='text-blue-800 hover:text-blue-500'>{txn.blockNumber}</Link>
                            </div>
                            <div className='flex-1  text-sm'>{convertTimestamp(txn.timeStamp)}</div>
                            <div className='flex-1 truncate'>
                                <Link to={`/address/${txn.from}`} className='text-blue-800 hover:text-blue-500'>{txn.from.slice(0,8)+"..."+txn.from.slice(-8)}</Link>
                            </div>
                            <div className='flex-1 truncate'>
                                <Link to={`/address/${txn.to}`} className='text-blue-800 hover:text-blue-500'>{txn.to.slice(0,8)+"..."+txn.to.slice(-8)}</Link>
                            </div>
                            <div className='flex-1  truncate'> {Math.round(Utils.formatEther(txn.value) * 1e4) / 1e4} ETH</div>
                        </div>
                        
                    ))
                }
            </div>
            
            <div>
                <ReactPaginate
                breakLabel={
                    <span className=" border border-solid border-lightGray hover:bg-lightGray w-10 h-10 flex items-center justify-center rounded-md mr-4">
                        ...
                    </span>
                }
                
                nextLabel={
                    showNextButton ? (
                      <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md">
                        <BsChevronRight />
                      </span>
                    ) : null
                }
                previousLabel={
                    showPrevButton ? (
                      <span className="w-10 h-10 flex items-center justify-center bg-lightGray rounded-md mr-4">
                        <BsChevronLeft />
                      </span>
                    ) : null
                  }
                onPageChange={handlePageClick}
                pageRangeDisplayed={3}
                pageCount={pageCount}
                containerClassName='flex items-center justify-center m-10'
                pageClassName="block border border-solid border-lightGray hover:bg-lightGray w-10 h-10 flex items-center justify-center rounded-md mr-4"
                activeClassName="bg-gray-500 text-white"
                />
            </div>
            
        </div>
    )
    
}


export default Address