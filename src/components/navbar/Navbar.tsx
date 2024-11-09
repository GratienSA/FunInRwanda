"use client";

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import UserMenu from "./UserMenu";
import { CurrentUserHookResult, useCurrentUser } from "../../hooks/useCurrentUser";

const Navbar = () => {
  const currentUser = useCurrentUser();

  return (
    <div className="fixed w-full bg-white z-10 shadow-sm">
      <div className="py-4 border-b-[1px]">
        <Container>
          <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
            <Logo />
            <Search />
            <UserMenu currentUser={currentUser as CurrentUserHookResult | null} />
          </div>
        </Container>
      </div>
    </div>
  );
}

export default Navbar;