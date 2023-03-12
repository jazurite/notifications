import '../styles/globals.css'
import type { AppProps } from 'next/app'

import AllProviders from './_provider'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AllProviders>
      <Component { ...pageProps } />
    </AllProviders>
  )
}
