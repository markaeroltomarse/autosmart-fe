import AppLayout from '@/layouts/app-layout.component';
import store from '@/store';
import '@/styles/globals.css';
import { NextPageWithLayout } from '@/types/next-page-with-layout.types';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

const storeInstance = store();
const persistor = persistStore(storeInstance);

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <Provider store={storeInstance}>
      <PersistGate loading={null} persistor={persistor}>
        <AppLayout getLayout={getLayout}>
          <Component {...pageProps} />
        </AppLayout>
      </PersistGate>
    </Provider>
  );
}
