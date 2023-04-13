import { BsFillCartFill } from 'react-icons/bs';
import Logo from '../Logo';
import { useRouter } from 'next/router';
import Image from 'next/image';
export default function Navbar() {
  const router = useRouter();
  const navbg =
    'https://media.discordapp.net/attachments/1093520927960092772/1095372185360666695/top_bar.png?width=1440&height=146';
  return (
    <nav className="w-full bg-slate-300 pb-10 relative">
      <Image src={navbg} fill alt="autosmart" className="absolute" />
      <div className="md:px-[10%] md:py-5   flex justify-between">
        <div>
          <Logo className="h-[50px] w-[140px] rounded border-2 border-blue-900" />
        </div>

        <div>
          <BsFillCartFill
            size={50}
            onClick={() =>
              router.replace({
                pathname: '/cart',
              })
            }
            className="cursor-pointer"
          />
        </div>
      </div>
    </nav>
  );
}
