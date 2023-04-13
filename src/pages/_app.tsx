import Layout from '@/components/layouts';
import store from '@/store';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

const storeInstance = store();
const persistor = persistStore(storeInstance);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={storeInstance}>
      <PersistGate loading={null} persistor={persistor}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </PersistGate>
    </Provider>
  );
}
