import 'global.css'
import { AppProps } from 'next/app'
import Head from 'next/head'

export default ({ Component, pageProps }: AppProps) => <>
  <Head>
    <title>Stacc Analytics</title>
    <link href='https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap' rel='stylesheet' />
    <script src='https://analytics.stacc.cc/api/script/t7byxkDUAQws'></script>
  </Head>

  <Component {...pageProps} />
</>