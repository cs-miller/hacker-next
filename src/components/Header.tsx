import * as React from "react";
import Link from "next/link";

export const Header: React.FC = () => {
  return (
    <header className="bg-red-500">
      <strong>
        <Link href="/">
          <a>Hacker News</a>
        </Link>
      </strong>
      <span> </span>
      <Link href="/new">
        <a>new</a>
      </Link>
      <span> | </span>
      <Link href="/ask">
        <a>ask</a>
      </Link>
      <span> | </span>
      <Link href="/show">
        <a>show</a>
      </Link>
      <span> | </span>
      <Link href="/jobs">
        <a>jobs</a>
      </Link>
    </header>
  );
};
