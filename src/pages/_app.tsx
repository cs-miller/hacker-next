import type { AppProps } from "next/app";
import * as React from "react";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { getInitialPreloadedQuery, getRelayProps } from "relay-nextjs/app";
import "tailwindcss/tailwind.css";

import { getClientEnvironment } from "lib/clientEnvironment";

const clientEnv = getClientEnvironment();
const initialPreloadedQuery = getInitialPreloadedQuery({
  createClientEnvironment: () => getClientEnvironment()!,
});

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const relayProps = getRelayProps(pageProps, initialPreloadedQuery);
  const env = relayProps.preloadedQuery?.environment ?? clientEnv!;

  return (
    <>
      <RelayEnvironmentProvider environment={env}>
        <Component {...pageProps} {...relayProps} />
      </RelayEnvironmentProvider>
    </>
  );
};

export default App;
