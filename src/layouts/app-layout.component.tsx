import Alert from "@/components/Alert";
import { useAppSelector } from "@/hooks/useAppSelector";
import AOS from "aos";
import "aos/dist/aos.css";
import localFont from 'next/font/local';
import { ReactElement, ReactNode, useEffect } from 'react';
const HKGrotesk = localFont({
  src: [
    {
      path: '../assets/fonts3/gothambold-webfont.woff',
      weight: '700',
    },
    {
      path: '../assets/fonts3/gothammedium-webfont.woff',
      weight: '400',
    },
  ],
  variable: '--font-HKGrotesk',
});

const PTMono = localFont({
  src: [
    {
      path: '../assets/fonts3/inter-regular-webfont.woff',
      weight: '400',
    },
  ],
  variable: '--font-PTMono',
});

const Thunder = localFont({
  src: [
    {
      path: '../assets/fonts3/thunder-boldlc-webfont.woff',
      weight: '700',
    },
    {
      path: '../assets/fonts3/thunder-mediumlc-webfont.woff',
      weight: '400',
    },
  ],
  variable: '--font-Thunder',
});

const Staatliches = localFont({
  src: [
    {
      path: '../assets/fonts3/staatliches-regular-webfont.woff',
      weight: '400',
    },
  ],
  variable: '--font-Staatliches',
});

const Moche = localFont({
  src: [
    {
      path: '../assets/fonts3/inter-regular-webfont.woff',
      weight: '700',
    },
  ],
  variable: '--font-Moche',
});

const Inter = localFont({
  src: [
    {
      path: '../assets/fonts3/inter-regular-webfont.woff',
      weight: '400',
    },
  ],
  variable: '--font-Inter',
});

const Roboto = localFont({
  src: [
    {
      path: '../assets/fonts3/roboto-regular-webfont.woff',
      weight: '400',
    },
  ],
  variable: '--font-Inter',
});

const Poppins = localFont({
  src: [
    {
      path: '../assets/fonts3/poppins-regular-webfont.woff',
      weight: '400',
    },
  ],
  variable: '--font-Inter',
});

const Jost = localFont({
  src: [
    {
      path: '../assets/fonts3/Jost-Regular.ttf',
      weight: '400',
    },
    {
      path: '../assets/fonts3/Jost-Bold.ttf',
      weight: '700',
    },
  ],
  variable: '--font-Jost',
});

export interface AppLayoutProps {
  children: React.ReactElement;
  getLayout: (_page: ReactElement) => ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = (props) => {
  const { children, getLayout } = props;

  const alert = useAppSelector(store => store.componentsReducers?.alert)

  useEffect(() => {
    AOS.init({
      easing: 'ease-in-cubic'
    });
  }, []);


  return (
    <>
      <div
        className={`${HKGrotesk.variable} ${Thunder.variable} ${PTMono.variable} ${Staatliches.variable} ${Moche.variable} ${Inter.variable} ${Roboto.variable} ${Poppins.variable} ${Jost.variable}`}
      >
        {alert && <Alert {...alert} />}
        {getLayout(children)}
      </div>
    </>
  );
};

export default AppLayout
