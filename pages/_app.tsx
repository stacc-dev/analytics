import 'global.css'
import { AppProps } from 'next/app'
import Head from 'next/head'

export default ({ Component, pageProps }: AppProps) => <>
  <Head>
    <title>Stacc Analytics</title>
    <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap' rel='stylesheet' />
    <script src='http://localhost:3000/api/script/47d8AP2gqvWy'></script>
  </Head>

  <Component {...pageProps} />
</>