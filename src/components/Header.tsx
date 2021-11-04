import * as React from "react";
import Link from "next/link";
import { NavLink } from "components/NavLink";

export const Header: React.FC = () => {
  return (
    <header className="bg-red-500">
      <strong>
        <Link href="/">
          <a>Hacker News</a>
        </Link>
      </strong>
      <span> </span>
      <NavLink href="/new">new</NavLink>
      <span> | </span>
      <NavLink href="/ask">ask</NavLink>
      <span> | </span>
      <NavLink href="/show">show</NavLink>
      <span> | </span>
      <NavLink href="/jobs">jobs</NavLink>
    </header>
  );
};
