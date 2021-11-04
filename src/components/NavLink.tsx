import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import cx from "classnames";

interface NavLinkProps {
  className?: string;
}

export const NavLink: React.FC<
  NavLinkProps & React.ComponentPropsWithoutRef<typeof Link>
> = ({ children, className, ...props }) => {
  const router = useRouter();
  const isActive = router.pathname === props.href;

  return (
    <Link {...props}>
      <a
        className={cx(className, {
          "text-white": isActive,
        })}
      >
        {children}
      </a>
    </Link>
  );
};
