import React from 'react'
import Select from '../Select'
import {BiSearchAlt2} from 'react-icons/bi'

function Searchbar() {
  return (
    <div className='z-[1] flex bg-white w-[370px] items-center rounded-md'>
      
      <div className='px-3'>
        <input className='bg-transparent outline-none' type="text" name="" id="" />
        
      </div>
      <div>
        <Select className='gray bg-gray-200' options={["Headlight", "Tail Light", "Wiper Linkage", "Side Mirror", "Side Mirror Lens"]}/>

      </div>
      <div className='px-3'>
        <BiSearchAlt2 size={25}/>

      </div>
    </div>
    
  )
}

export default Searchbar
