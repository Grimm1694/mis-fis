// pages/_app.tsx
import { UserProvider } from "../app/context/usercontext"; // Adjust the import path as necessary
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  );
}

export default MyApp;

