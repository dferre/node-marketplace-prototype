import { SidebarTrigger } from "@relume_io/relume-ui";
import type { CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import coinsIcon from "../assets/header/coins.png";
import searchIcon from "../assets/header/search.svg";
import userIcon from "../assets/header/user.svg";
import { selectActiveUser } from "../store/selectors";
import { usePrototypeStore } from "../store/prototypeStore";
import { PROTOTYPE_WALLET_BALANCE, useWalletDrawer } from "./WalletDrawer";

function HeaderGlyph({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <span
      className={`app-header-glyph shrink-0 ${className ?? "size-5"}`}
      style={{ "--app-header-glyph": `url("${src}")` } as CSSProperties}
      aria-hidden="true"
    />
  );
}

export function AppHeader() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const activeUser = usePrototypeStore(selectActiveUser);
  const { open: walletOpen, setOpen: setWalletOpen } = useWalletDrawer();

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const nextQuery = query.trim();
    if (nextQuery) params.set("q", nextQuery);
    const search = params.toString();
    navigate(search ? `/marketplace/search?${search}` : "/marketplace/search");
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border-base bg-background-secondary-base px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger aria-label="Open or close navigation" />
        <form
          className="app-header-search text-text-tertiary"
          onSubmit={handleSearch}
          role="search"
        >
          <label className="sr-only" htmlFor="app-header-search">
            Search marketplace
          </label>
          <div className="flex h-12 items-center gap-2 overflow-hidden rounded-08 px-3 py-2">
            <HeaderGlyph src={searchIcon} />
            <input
              id="app-header-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-text-md-regular text-text-primary outline-none placeholder:text-text-tertiary"
            />
          </div>
        </form>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label="Open wallet"
          aria-expanded={walletOpen}
          aria-controls="app-wallet-drawer"
          className="flex appearance-none items-center gap-2 overflow-hidden rounded-04 border-0 bg-transparent px-3 py-2 hover:bg-background-primary-hover"
          onClick={() => setWalletOpen(true)}
        >
          <img
            src={coinsIcon}
            alt=""
            className="size-6 shrink-0"
            width={24}
            height={24}
          />
          <span className="text-text-sm-semibold text-text-secondary">
            {PROTOTYPE_WALLET_BALANCE}
          </span>
        </button>
        <Link
          to="/settings"
          aria-label={
            activeUser ? `Account, ${activeUser.name}` : "Account profile"
          }
          className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-elevated bg-background-secondary-base no-underline hover:bg-background-primary-hover"
        >
          <HeaderGlyph src={userIcon} className="size-5 text-text-secondary" />
        </Link>
      </div>
    </header>
  );
}
