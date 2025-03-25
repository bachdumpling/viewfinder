import Link from "next/link";
import React from "react";

export default function Footer({ textColor = "text-zinc-50" }) {
  return (
    <footer className="flex flex-col justify-center items-center my-10">
      <p className={`${textColor} text-xs md:text-sm font-medium`}>
        <Link
          className="underline decoration-wavy decoration-1 cursor-pointer"
          href="https://www.bachle.info/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Bach Le
        </Link>{" "}
        © 2024. All rights reserved.
      </p>
      <Link
        href="https://bachle.info/projects/tools/viewfinder"
        className={`${textColor} text-xs md:text-sm leading-relaxed tracking-wide underline decoration-wavy decoration-1`}
        target="_blank"
        rel="noopener noreferrer"
      >
        About The Project
      </Link>
    </footer>
  );
}
