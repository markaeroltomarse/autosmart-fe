import Image from 'next/image';
import { useRouter } from 'next/router';

interface ILogoProps {
  className?: string;
}

export default function Logo({ className }: ILogoProps) {
  const router = useRouter();
  return (
    <div
      className={`w-[200px] relative border ${className} cursor-pointer`}
      onClick={() =>
        router.replace({
          pathname: '/',
        })
      }
    >
      <Image className='rounded-md' fill src={'/logo.png'} alt="autosmart" />
      <div className=" rounded-md bg-white p-5"></div>
    </div>
  );
}
