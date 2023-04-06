import Image from 'next/image';

interface ILogoProps {
  className?: string;
}

export default function Logo({ className }: ILogoProps) {
  return (
    <div className={`w-[200px] relative border ${className}`}>
      <Image fill src={'/logo.png'} alt="autosmart" />
    </div>
  );
}
