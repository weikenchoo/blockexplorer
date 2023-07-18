import React, { useState} from 'react';
import { useHistory,Link } from 'react-router-dom';
import HomeLogo from '../home-svgrepo-com.svg'
import  SearchLogo  from "../search-svgrepo-com.svg";



function NavBar(props) {
  const {latestBlock} = props;
  const history = useHistory();
  const [query, setQuery] = useState("")

  function handleChange(e) {
    setQuery(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (query.startsWith('0x') && query.length === 66) {
      history.push(`/transaction/${query}`);
      setQuery("")
    } else if (query.startsWith('0x') && query.length === 42) {
      history.push(`/address/${query}`);
      setQuery("")
    } else if (parseInt(query) > 0 && parseInt(query) <= latestBlock) {
      history.push(`/block/${query}`);
      setQuery("")
    } else {
      console.log(query);
      history.push(`/404/${query}`);
      setQuery("")
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  return (
    <nav className='w-full bg-gray-500'>
      <div className='flex justify-around space-x-32'>
        <div className='m-2  py-2 ' >
          <Link to={`/`}><img className=' w-12 h-12' src={HomeLogo} alt="Home Logo"/></Link>
        </div>

        <div className="w-1/3 m-2 py-2 relative ">
          <input
            className="w-full border border-gray-500 rounded-full p-2 "
            type="search"
            placeholder="Search by Block / Txn Hash / Address"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />
          <button
            className="absolute right-0 h-10  p-2 rounded-full "
            onClick={handleSubmit}
          >
            <img className='w-full h-full' src={SearchLogo} alt="Search Logo"  />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar