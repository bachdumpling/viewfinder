import Image from "next/image";
import { Inter } from "next/font/google";
import Search from "./components/Search";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  // async function getArtDetails() {
  //   const artPieceName = "The+Assumption+of+the+Virgin";
  //   const artist = "El+Greco";
  //   const year = "1577";

  //   const apiUrl = `https://api.artic.edu/api/v1/artworks/search?q=${artPieceName}&q=${artist}&q=${year}&fields=id,title,artist_display,date_display,image_id,artist_title,artist_id`;

  //   const response = await fetch(apiUrl);
  //   const data = await response.json();

  //   console.log(encodeURIComponent(data.data[0].title.split(' ').join('+')));
  // }

  // getArtDetails();

  return (
    <main
      className={`bg-neutral-100 flex min-h-screen flex-col items-center justify-between p-24 font-inconsolata`}
    >
      <Search />
    </main>
  );
}
