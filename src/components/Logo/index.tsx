import Image from 'next/image';

interface ILogoProps {
  className?: string;
}

export default function Logo({ className }: ILogoProps) {
  return (
    <div className={`w-[200px] relative border ${className}`}>
      <Image className='rounded-md' fill src={'/logo.png'} alt="autosmart" />
      <div className=" rounded-md bg-white p-5"></div>
    </div>
  );
}
