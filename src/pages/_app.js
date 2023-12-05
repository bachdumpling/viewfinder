import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <div className="font-inconsolata">
      <Head>
        <title>Viewfinder</title>
      </Head>
      <Component {...pageProps} />
    </div>
  );
}
