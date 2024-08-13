import AAPLogo from '@/assets/images/AAP LOGO.webp';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface ILogoProps {
  className?: string;
}

export default function Logo({ className }: ILogoProps) {
  const router = useRouter();
  return (
    <div
      className={`top-[28%] left-[1%] relative border ${className} cursor-pointer`}
      onClick={() =>
        router.replace({
          pathname: '/',
        })
      }
    >
      <Image className='rounded-md object-contain' fill src={AAPLogo} alt="autosmart" />
      <div className=" rounded-md bg-white p-5"></div>
    </div>
  );
}
