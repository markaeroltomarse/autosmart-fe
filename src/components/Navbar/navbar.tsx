import React from 'react';
import Logo from '../Logo';
import { BsFillCartCheckFill } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';
import { delete_cookie, read_cookie } from 'sfcookies';
import Searchbar from '../Searchbar/Searchbar';
function Navbar() {
  return (

<div className="py-12 bg-blue-950 relative ">

      <Image
        className="z-[0]"
        src={
          'https://media.discordapp.net/attachments/1087951220313956486/1100344085123969035/Top_blue.png?width=1440&height=191'
        }
        fill
        alt="asmartheader2"
      />
      

      <div className="flex justify-between md:px-[5%] items-center">
        <Logo className="z-[1] w-[100px] h-[65px] border-2 border-blue-900 rounded-md flex" />

        <Searchbar />

        <div className="z-[2] flex gap-5 p-3 items-center ">
          <div className="z-[3] text-center font-bold ">
            {read_cookie('token').length === 0 ||
            read_cookie('token') === undefined ? (
              <div className='hover:text-gray-300'>
                <Link href={'/account/authentication'}>LOGIN / SIGN UP</Link>
                <br />
              </div>
            ) : (
              <>
                <div className='hover:text-gray-300'>
                  <Link
                    href={'/api/auth/logout'}
                    onClick={() => delete_cookie('token')}
                  >
                    Logout
                  </Link>
                  <br />
                </div >
                
                <Link href={'/customer'}>My Account</Link>
              </>
            )}
          </div>
          <Link href="/cart ">
            <BsFillCartCheckFill size={30} color="black" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
