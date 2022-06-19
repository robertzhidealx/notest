import { SessionProvider } from 'next-auth/react';
import '../styles/globals.css';
import 'antd/dist/antd.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;
