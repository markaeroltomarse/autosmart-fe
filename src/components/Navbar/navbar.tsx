import React from 'react'
import Logo from '../Logo'
import Searchbar from '../Searchbar/Searchbar'
import {BsFillCartCheckFill} from 'react-icons/bs'
import Link from 'next/link'

function Navbar() {
  return (
    <div className='py-3 bg-blue-950 '>
          
      <div className='flex justify-between md:px-[10%] items-center ' >
    
      <Logo className='w-[100px] h-[50px] border-2 border-blue-900 rounded-md'/> 

      <Searchbar/>
      
      
      <div className=' flex gap-5 p-3 bg-blue-950 items-center'>
    
      <div className='text-center font-bold'>
            <Link href={'/account/authentication'}>LOGIN / SIGN UP</Link>
            <br/>
            <Link href={'/customer'}>My Account</Link>
            </div>
        <BsFillCartCheckFill size={30} color='white'/>
        
      </div>
      </div>
    </div>
  )
}

export default Navbar
