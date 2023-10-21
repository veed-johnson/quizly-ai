import Image from "next/image";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="w-full py-3 px-5 grid place-items-center h-[7%]">
      <Link href={"/"}>
        <Image
          src="/logo-text.svg"
          alt="Quizly Ai"
          className="w-24 xl:w-28 2xl:w-32"
          width={0}
          height={0}
          priority
        />
      </Link>
    </header>
  );
};

export default Header;
