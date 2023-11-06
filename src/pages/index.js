import Image from "next/image";
import { Inter } from "next/font/google";
import Search from "./components/Search";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Search />
    </main>
  );
}
