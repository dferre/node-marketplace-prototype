import { useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { Button } from "../../components/ui/Button";
import alertCircleIcon from "../../assets/wallet/alert-circle.svg";
import arrowLeftIcon from "../../assets/wallet/arrow-left.svg";
import chevronDownIcon from "../../assets/wallet/chevron-down.svg";
import chevronRightIcon from "../../assets/wallet/chevron-right.svg";
import eyeIcon from "../../assets/wallet/eye.svg";
import tokenBtcIcon from "../../assets/wallet/token-btc-icon.svg";
import tokenBtcInner from "../../assets/wallet/token-btc-inner.svg";
import tokenEthIcon from "../../assets/wallet/token-eth-icon.svg";
import tokenEthInner from "../../assets/wallet/token-eth-inner.svg";
import tokenTethInner from "../../assets/wallet/token-teth-inner.svg";
import tokenTsc from "../../assets/wallet/token-tsc.png";
import tokenUsdcIcon from "../../assets/wallet/token-usdc-icon.svg";
import tokenUsdcInner from "../../assets/wallet/token-usdc-inner.svg";
import tokenUsdt from "../../assets/wallet/token-usdt.png";
import tokenWbtc from "../../assets/wallet/token-wbtc.png";
import xCloseIcon from "../../assets/wallet/x-close.svg";

const WALLET_GLYPH_INSETS: [string, string][] = [
  ["chevron-down", "33.54% 26.22% 36.79% 26.22%"],
  ["chevron-right", "0"],
  ["arrow-left", "0"],
  ["x-close", "25%"],
  ["alert-circle", "8.33%"],
  ["info-circle", "8.33%"],
  ["unstake", "0"],
  ["stake", "5.21% 15.63%"],
  ["eye", "20.83% 8.11%"],
  ["copy", "8.33%"],
  ["time", "8.33%"],
  ["calendar", "8.33% 12.5%"],
  ["search", "8.33%"],
  ["loader", "8.33%"],
  ["check", "30.39% 17.89% 23.27% 22.05%"],
  ["up-arrow", "12.75%"],
];

function walletGlyphLeafInset(src: string) {
  const match = WALLET_GLYPH_INSETS.find(([file]) => src.includes(file));
  return match?.[1] ?? "0";
}

export function WalletGlyph({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <span
      className={`relative shrink-0 ${className ?? "size-5"}`}
      aria-hidden="true"
    >
      <span
        className="app-wallet-glyph absolute"
        style={
          {
            inset: walletGlyphLeafInset(src),
            "--app-wallet-glyph": `url("${src}")`,
          } as CSSProperties
        }
      />
    </span>
  );
}

export type TokenType = "TSC" | "BTC" | "ETH" | "USDT" | "WBTC" | "USDC";

export type WalletAsset = {
  type: TokenType;
  ticker: string;
  name: string;
  amount: string;
  usd: string;
  unit: string;
  available: number;
  network: string;
  address: string;
  canStake?: boolean;
};

export const PROTOTYPE_WALLET_BALANCE = "$245,321.21";
export const PROTOTYPE_WALLET_CHANGE = "$0.18 (0.04%)";
export const TSC_DETAIL_AMOUNT = "245,321.21";
export const TSC_DETAIL_USD = "$12,234.21";
export const TSC_STAKED_AMOUNT = "5,321.21";
export const TSC_STAKED_USD = "$12,234.21";
export const TSC_AVAILABLE_USD = "$12,394.21";
export const TSC_UNLOCK_DATE = "Sep 29, 2026";
export const TSC_VALIDATOR_NAME = "TSC Foundation";
export const TSC_VALIDATOR_ADDRESS = "tsc1qf…s7t8";

export const WALLET_ASSETS: WalletAsset[] = [
  {
    type: "TSC",
    ticker: "TSC",
    name: "Trusted Smart Chain",
    amount: "0.00 TSC",
    usd: "$0.00",
    unit: "TSC",
    available: 12412312.33132,
    network: "Trusted Smart Chain",
    address: "tsc1qf8k2m9x7p4w3n5r6s7t8",
    canStake: true,
  },
  {
    type: "BTC",
    ticker: "BTC",
    name: "Bitcoin",
    amount: "0.00 BTC",
    usd: "$0.00",
    unit: "BTC",
    available: 0,
    network: "Bitcoin",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  },
  {
    type: "ETH",
    ticker: "ETH",
    name: "Ethereum",
    amount: "0.00 ETH",
    usd: "$0.00",
    unit: "ETH",
    available: 0,
    network: "Ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
  {
    type: "USDT",
    ticker: "USDT (ERC-20)",
    name: "Tether",
    amount: "0.00 USDT",
    usd: "$0.00",
    unit: "USDT",
    available: 0,
    network: "Ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
  {
    type: "WBTC",
    ticker: "WBTC (ERC-20)",
    name: "Wrapped Bitcoin",
    amount: "0.00 WBTC",
    usd: "$0.00",
    unit: "WBTC",
    available: 0,
    network: "Ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
  {
    type: "USDC",
    ticker: "USDC (ERC-20)",
    name: "USDC",
    amount: "0.00 USDC",
    usd: "$0.00",
    unit: "USDC",
    available: 0,
    network: "Ethereum",
    address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  },
];

export function getWalletAsset(type: TokenType): WalletAsset {
  return WALLET_ASSETS.find((asset) => asset.type === type) ?? WALLET_ASSETS[0];
}

export function formatTokenAmount(value: number, unit: string) {
  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 5,
  })} ${unit}`;
}

export function TokenMark({
  type,
  className,
}: {
  type: TokenType;
  className?: string;
}) {
  const frame = `relative shrink-0 overflow-hidden rounded-full ${className ?? "size-8"}`;

  if (type === "TSC") {
    return (
      <span
        className={`flex items-center justify-center border border-border-base bg-primitives-white p-2 ${frame}`}
      >
        <img
          src={tokenTsc}
          alt=""
          className="size-full object-contain"
          width={16}
          height={16}
        />
      </span>
    );
  }

  if (type === "BTC") {
    return (
      <span className={frame}>
        <img
          src={tokenBtcInner}
          alt=""
          className="absolute inset-0 size-full"
          width={32}
          height={32}
        />
        <span className="absolute inset-2 flex items-center justify-center">
          <img
            src={tokenBtcIcon}
            alt=""
            className="max-h-full max-w-full object-contain"
            width={16}
            height={16}
          />
        </span>
      </span>
    );
  }

  if (type === "ETH") {
    return (
      <span className={frame}>
        <img
          src={tokenEthInner}
          alt=""
          className="absolute inset-0 size-full"
          width={32}
          height={32}
        />
        <span className="absolute inset-2 flex items-center justify-center">
          <img
            src={tokenEthIcon}
            alt=""
            className="max-h-full max-w-full object-contain"
            width={16}
            height={16}
          />
        </span>
      </span>
    );
  }

  if (type === "USDT") {
    return (
      <span className={`flex items-center justify-center ${frame}`}>
        <img
          src={tokenTethInner}
          alt=""
          className="absolute inset-0 size-full"
          width={32}
          height={32}
        />
        <img
          src={tokenUsdt}
          alt=""
          className="relative size-6 object-contain"
          width={24}
          height={24}
        />
      </span>
    );
  }

  if (type === "WBTC") {
    return (
      <span className={`flex items-center justify-center ${frame}`}>
        <img
          src={tokenTethInner}
          alt=""
          className="absolute inset-0 size-full"
          width={32}
          height={32}
        />
        <img
          src={tokenWbtc}
          alt=""
          className="relative size-6 object-contain"
          width={24}
          height={24}
        />
      </span>
    );
  }

  return (
    <span className={`flex items-center justify-center ${frame}`}>
      <img
        src={tokenUsdcInner}
        alt=""
        className="absolute inset-0 size-full"
        width={32}
        height={32}
      />
      <img
        src={tokenUsdcIcon}
        alt=""
        className="relative size-6 object-contain"
        width={24}
        height={24}
      />
    </span>
  );
}

export function WalletSubheader({
  title,
  onBack,
  onClose,
  closeRef,
}: {
  title: string;
  onBack: () => void;
  onClose: () => void;
  closeRef?: Ref<HTMLButtonElement>;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-2 px-6 pt-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          aria-label="Back"
          className="flex size-9 shrink-0 appearance-none items-center justify-center rounded-full border border-border-base bg-background-secondary-base text-text-primary hover:bg-background-primary-hover"
          onClick={onBack}
        >
          <WalletGlyph src={arrowLeftIcon} className="size-3" />
        </button>
        <h2
          id="app-wallet-drawer-title"
          className="truncate text-text-sm-regular text-text-secondary"
        >
          {title}
        </h2>
      </div>
      <button
        ref={closeRef}
        type="button"
        aria-label="Close wallet"
        className="flex size-10 shrink-0 appearance-none items-center justify-center rounded-08 border-0 bg-transparent p-0 text-text-tertiary hover:bg-background-primary-hover"
        onClick={onClose}
      >
        <WalletGlyph src={xCloseIcon} className="size-5" />
      </button>
    </div>
  );
}

export function WalletFieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="text-text-sm-medium text-text-primary">{children}</p>
  );
}

export function WalletTextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  trailing,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "password";
  trailing?: ReactNode;
}) {
  return (
    <label className="flex w-full flex-col gap-1.5">
      <WalletFieldLabel>{label}</WalletFieldLabel>
      <span className="flex items-center gap-2 overflow-hidden rounded-08 bg-background-tertiary-base p-3">
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-text-sm-regular text-text-primary outline-none placeholder:text-text-secondary"
        />
        {trailing}
      </span>
    </label>
  );
}

export function WalletPasscodeField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <WalletTextField
      label="Wallet Passcode:"
      value={value}
      onChange={onChange}
      type={show ? "text" : "password"}
      trailing={
        <button
          type="button"
          aria-label={show ? "Hide passcode" : "Show passcode"}
          className="flex appearance-none border-0 bg-transparent p-0 text-text-tertiary"
          onClick={() => setShow((current) => !current)}
        >
          <WalletGlyph src={eyeIcon} className="size-4" />
        </button>
      }
    />
  );
}

export function WalletCheckbox({
  checked,
  onChange,
  title,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 size-5 shrink-0 rounded-06 border border-border-base bg-background-tertiary-base"
      />
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-text-sm-medium text-text-primary">{title}</span>
        <span className="text-text-sm-regular text-text-tertiary">
          {description}
        </span>
      </span>
    </label>
  );
}

export function WalletNavRow({
  type,
  title,
  subtitle,
  usd,
  amount,
  onClick,
}: {
  type: TokenType;
  title: string;
  subtitle?: string;
  usd: string;
  amount: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="flex w-full appearance-none items-center gap-3 rounded-12 border-0 bg-transparent p-4 text-left hover:bg-background-tertiary-hover"
      onClick={onClick}
    >
      <TokenMark type={type} />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-text-sm-semibold text-text-primary">{title}</span>
        {subtitle ? (
          <span className="text-text-sm-regular text-text-tertiary">
            {subtitle}
          </span>
        ) : null}
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-text-sm-semibold text-text-primary">{usd}</span>
        <span className="text-text-sm-regular text-text-tertiary">{amount}</span>
      </span>
      <WalletGlyph
        src={chevronRightIcon}
        className="size-3 text-text-secondary"
      />
    </button>
  );
}

export function WalletPrimaryButton({
  children,
  onClick,
  icon,
}: {
  children: ReactNode;
  onClick: () => void;
  icon?: string;
}) {
  return (
    <Button variant="primary" size="lg" className="w-full" onClick={onClick}>
      {icon ? (
        <WalletGlyph src={icon} className="size-5 text-background-primary-base" />
      ) : null}
      {children}
    </Button>
  );
}

export function WalletReview({
  rows,
}: {
  rows: { label: string; value: string; total?: boolean }[];
}) {
  return (
    <div className="flex w-full flex-col gap-5 overflow-hidden rounded-08 bg-background-tertiary-base pt-5">
      {rows.map((row) => (
        <div
          key={row.label}
          className={`flex items-center gap-3 ${
            row.total ? "border-t border-border-base p-5" : "px-5"
          }`}
        >
          <p className="min-w-0 flex-1 text-text-sm-regular text-text-secondary">
            {row.label}
          </p>
          <p className="min-w-0 flex-1 text-right text-text-sm-regular text-text-primary">
            {row.value}
          </p>
        </div>
      ))}
    </div>
  );
}

export function WalletBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full items-start gap-3 overflow-hidden rounded-08 border border-primitives-blue-secondary bg-primitives-blue-secondary-tertiary p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-04 bg-background-tertiary-base">
        <WalletGlyph
          src={alertCircleIcon}
          className="size-4 text-text-primary"
        />
      </span>
      <p className="min-w-0 flex-1 text-text-xs-regular text-text-secondary">
        {children}
      </p>
    </div>
  );
}

export function WalletPercentRow({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (percent: number) => void;
}) {
  const percents = [5, 15, 25, 50, 75];
  return (
    <div className="flex w-full gap-3">
      {percents.map((percent) => (
        <button
          key={percent}
          type="button"
          aria-pressed={selected === percent}
          className={`flex min-w-0 flex-1 appearance-none items-center justify-center rounded-16 bg-background-tertiary-base px-3 py-1 text-text-sm-medium text-text-secondary hover:bg-background-primary-hover ${
            selected === percent ? "bg-background-primary-hover text-text-primary" : ""
          }`}
          onClick={() => onSelect(percent)}
        >
          {percent}%
        </button>
      ))}
    </div>
  );
}

export function WalletAssetSelect({
  asset,
  title,
  subtitle,
  open,
  onToggle,
  chevron,
}: {
  asset: WalletAsset;
  title?: string;
  subtitle: string;
  open?: boolean;
  onToggle?: () => void;
  chevron?: boolean;
}) {
  const interactive = Boolean(onToggle);
  const content = (
    <>
      <span className="flex min-w-0 flex-1 items-center gap-2">
        <TokenMark type={asset.type} className="size-7" />
        <span className="flex min-w-0 flex-col gap-1">
          <span className="text-text-sm-medium text-text-primary">
            {title ?? (asset.type === "TSC" ? "TSC" : asset.ticker)}
          </span>
          <span className="truncate text-text-xs-regular text-text-tertiary">
            {subtitle}
          </span>
        </span>
      </span>
      {interactive || chevron ? (
        <WalletGlyph
          src={chevronDownIcon}
          className="size-5 text-text-secondary"
        />
      ) : null}
    </>
  );

  if (!interactive) {
    return (
      <div className="flex w-full items-center rounded-08 bg-background-tertiary-base py-2 pl-2 pr-3">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      aria-expanded={open}
      className="flex w-full appearance-none items-center rounded-08 border-0 bg-background-tertiary-base py-2 pl-2 pr-3 text-left hover:bg-background-primary-hover"
      onClick={onToggle}
    >
      {content}
    </button>
  );
}

export function WalletAssetOptionList({
  assets,
  onSelect,
}: {
  assets: WalletAsset[];
  onSelect: (type: TokenType) => void;
}) {
  return (
    <ul className="flex flex-col overflow-hidden rounded-08 bg-background-tertiary-base">
      {assets.map((asset) => (
        <li key={asset.type}>
          <button
            type="button"
            className="flex w-full appearance-none items-center gap-2 border-0 bg-transparent px-2 py-2 text-left hover:bg-background-primary-hover"
            onClick={() => onSelect(asset.type)}
          >
            <TokenMark type={asset.type} className="size-7" />
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-text-sm-medium text-text-primary">
                {asset.type === "TSC" ? "TSC" : asset.ticker}
              </span>
              <span className="truncate text-text-xs-regular text-text-tertiary">
                {formatTokenAmount(asset.available, asset.unit)}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

export { chevronRightIcon, xCloseIcon };
