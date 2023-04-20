import React from 'react';
import Logo from '../Logo';
import Searchbar from '../Searchbar/Searchbar';
import { BsFillCartCheckFill } from 'react-icons/bs';
import Link from 'next/link';
import Image from 'next/image';
import { delete_cookie, read_cookie } from 'sfcookies';
function Navbar() {
  return (
    <div className="py-3 bg-blue-950 relative">
      <Image
        className="z-[0]"
        src={
          'https://media.discordapp.net/attachments/1093520927960092772/1095372185360666695/top_bar.png?width=1440&height=146'
        }
        fill
        alt="asmartheader2"
      />

      <div className="flex justify-between md:px-[10%] items-center ">
        <Logo className="z-[1] w-[100px] h-[70px] border-2 border-blue-900 rounded-md" />

        <Searchbar />

        <div className="z-[2] flex gap-5 p-3 items-center">
          <div className="z-[3] text-center font-bold">
            {read_cookie('token').length === 0 ||
            read_cookie('token') === undefined ? (
              <div>
                <Link href={'/account/authentication'}>LOGIN / SIGN UP</Link>
                <br />
              </div>
            ) : (
              <div>
                <Link
                  href={'/api/auth/logout'}
                  onClick={() => delete_cookie('token')}
                >
                  Logout
                </Link>
                <br />
              </div>
            )}

            <Link href={'/customer'}>My Account</Link>
          </div>
          <Link href="/cart">
            <BsFillCartCheckFill size={30} color="black" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
