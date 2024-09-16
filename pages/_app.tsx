import type { AppProps } from 'next/app';
import { AuthProviderUser } from '../contexts/AuthContextUser';
import { AuthProviderAdmin } from '../contexts/AuthContextAdmin';
import HeaderUser from '../components/HeaderUser';
import HeaderAdmin from '../components/HeaderAdmin';
import HeaderMain from '../components/HeaderMain';
import '../styles/global.css';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  let Header = null;
  let AuthProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>;

  if (router.pathname.startsWith('/user')) {
    Header = HeaderUser;
    AuthProvider = AuthProviderUser;
  } else if (router.pathname.startsWith('/admin')) {
    Header = HeaderAdmin;
    AuthProvider = AuthProviderAdmin;
  } else {
    Header = HeaderMain;
  }

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet" />
      </Head>
      <AuthProvider>
        {Header && <Header />}
        <main>
          <div className='inner'>
            <Component {...pageProps} />
          </div>
        </main>
      </AuthProvider>
    </>
  );
}
