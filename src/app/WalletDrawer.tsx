import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import calendarIcon from "../assets/wallet/calendar.svg";
import checkIcon from "../assets/wallet/check.svg";
import copyIcon from "../assets/wallet/copy.svg";
import extendIcon from "../assets/wallet/extend.svg";
import infoCircleIcon from "../assets/wallet/info-circle.svg";
import loaderIcon from "../assets/wallet/loader.svg";
import moveIcon from "../assets/wallet/move.svg";
import qrReceive from "../assets/wallet/qr-receive.png";
import receiveIcon from "../assets/wallet/receive.svg";
import searchIcon from "../assets/wallet/search.svg";
import sendIcon from "../assets/wallet/send.svg";
import stakeIcon from "../assets/wallet/stake.svg";
import timeIcon from "../assets/wallet/time.svg";
import unstakeIcon from "../assets/wallet/unstake.svg";
import upArrowIcon from "../assets/wallet/up-arrow.svg";
import walletIcon from "../assets/wallet/wallet.svg";
import { Button } from "../components/ui/Button";
import {
  chevronRightIcon,
  formatTokenAmount,
  getWalletAsset,
  PROTOTYPE_WALLET_BALANCE,
  PROTOTYPE_WALLET_CHANGE,
  TSC_AVAILABLE_USD,
  TSC_DETAIL_AMOUNT,
  TSC_DETAIL_USD,
  TSC_STAKED_AMOUNT,
  TSC_STAKED_USD,
  TSC_UNLOCK_DATE,
  TSC_VALIDATOR_ADDRESS,
  TSC_VALIDATOR_NAME,
  TokenMark,
  WALLET_ASSETS,
  WalletAssetOptionList,
  WalletAssetSelect,
  WalletBanner,
  WalletCheckbox,
  WalletFieldLabel,
  WalletGlyph,
  WalletNavRow,
  WalletPasscodeField,
  WalletPercentRow,
  WalletPrimaryButton,
  WalletReview,
  WalletSubheader,
  WalletTextField,
  type TokenType,
  xCloseIcon,
} from "./wallet/ui";

export { PROTOTYPE_WALLET_BALANCE };

type WalletDrawerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const WalletDrawerContext = createContext<WalletDrawerContextValue | null>(
  null,
);

export function useWalletDrawer() {
  const context = useContext(WalletDrawerContext);
  if (!context) {
    throw new Error("useWalletDrawer requires WalletDrawerProvider");
  }
  return context;
}

export function WalletDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <WalletDrawerContext.Provider value={value}>
      {children}
      <WalletDrawer />
    </WalletDrawerContext.Provider>
  );
}

type WalletView =
  | { name: "home" }
  | { name: "send"; asset: TokenType }
  | { name: "receive"; asset: TokenType }
  | { name: "stake" }
  | { name: "asset"; asset: TokenType }
  | { name: "discover" }
  | { name: "staked-locked" }
  | { name: "staked-detail" }
  | { name: "locked-detail" }
  | { name: "move" }
  | { name: "unstake" }
  | { name: "extend" }
  | { name: "loading"; title: string }
  | { name: "success"; title: string; message: string; usd: string };

type SuccessPayload = { title: string; message: string; usd: string };

const HOME: WalletView = { name: "home" };

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    // Prototype: clipboard may be unavailable.
  }
}

function WalletDrawer() {
  const { open, setOpen } = useWalletDrawer();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const pendingSuccess = useRef<SuccessPayload | null>(null);
  const [stack, setStack] = useState<WalletView[]>([HOME]);
  const view = stack[stack.length - 1] ?? HOME;

  const close = () => setOpen(false);
  const push = (next: WalletView) => setStack((current) => [...current, next]);
  const back = () =>
    setStack((current) => (current.length > 1 ? current.slice(0, -1) : current));
  const replace = (next: WalletView) =>
    setStack((current) => [...current.slice(0, -1), next]);

  useEffect(() => {
    if (!open) {
      setStack([HOME]);
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  const loadingTitle = view.name === "loading" ? view.title : null;

  useEffect(() => {
    if (!loadingTitle) return;
    const timer = window.setTimeout(() => {
      const pending = pendingSuccess.current;
      replace({
        name: "success",
        title: pending?.title ?? loadingTitle,
        message: pending?.message ?? "Transaction complete",
        usd: pending?.usd ?? "$0.00",
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [loadingTitle]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 cursor-default border-0 bg-overlays-modal-overlay p-0"
        aria-label="Close wallet"
        onClick={close}
      />
      <aside
        id="app-wallet-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="app-wallet-drawer-title"
        className="app-wallet-drawer absolute inset-y-0 right-0 flex flex-col bg-background-secondary-base shadow-xl"
      >
        {view.name === "home" ? (
          <HomeView
            closeRef={closeButtonRef}
            onClose={close}
            onSend={() => push({ name: "send", asset: "TSC" })}
            onReceive={() => push({ name: "receive", asset: "TSC" })}
            onStake={() => push({ name: "stake" })}
            onAsset={(asset) => push({ name: "asset", asset })}
            onDiscover={() => push({ name: "discover" })}
          />
        ) : null}
        {view.name === "send" ? (
          <SendView
            assetType={view.asset}
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onAssetChange={(asset) => replace({ name: "send", asset })}
            onConfirm={(payload) => {
              pendingSuccess.current = payload;
              push({ name: "loading", title: "Send Asset" });
            }}
          />
        ) : null}
        {view.name === "receive" ? (
          <ReceiveView
            assetType={view.asset}
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onAssetChange={(asset) => replace({ name: "receive", asset })}
          />
        ) : null}
        {view.name === "stake" ? (
          <StakeView
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onConfirm={(payload) => {
              pendingSuccess.current = payload;
              push({ name: "loading", title: "Stake TSC" });
            }}
          />
        ) : null}
        {view.name === "asset" ? (
          <AssetView
            assetType={view.asset}
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onSend={() => push({ name: "send", asset: view.asset })}
            onReceive={() => push({ name: "receive", asset: view.asset })}
            onStake={() => push({ name: "stake" })}
            onStakedLocked={() => push({ name: "staked-locked" })}
          />
        ) : null}
        {view.name === "staked-locked" ? (
          <StakedLockedView
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onStakeMore={() => push({ name: "stake" })}
            onUnstake={() => push({ name: "unstake" })}
            onStakeDetail={() => push({ name: "staked-detail" })}
            onLockDetail={() => push({ name: "locked-detail" })}
          />
        ) : null}
        {view.name === "staked-detail" ? (
          <StakedDetailView
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onStakeMore={() => push({ name: "stake" })}
            onUnstake={() => push({ name: "unstake" })}
            onMove={() => push({ name: "move" })}
          />
        ) : null}
        {view.name === "locked-detail" ? (
          <LockedDetailView
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onExtend={() => push({ name: "extend" })}
            onStakeMore={() => push({ name: "stake" })}
          />
        ) : null}
        {view.name === "move" ? (
          <MoveView
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onConfirm={(payload) => {
              pendingSuccess.current = payload;
              push({ name: "loading", title: "Move TSC Stake" });
            }}
          />
        ) : null}
        {view.name === "unstake" ? (
          <UnstakeView
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onConfirm={(payload) => {
              pendingSuccess.current = payload;
              push({ name: "loading", title: "Unstake TSC" });
            }}
          />
        ) : null}
        {view.name === "extend" ? (
          <ExtendView
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onConfirm={(payload) => {
              pendingSuccess.current = payload;
              push({ name: "loading", title: "Extend TSC Lock" });
            }}
          />
        ) : null}
        {view.name === "discover" ? (
          <DiscoverView
            closeRef={closeButtonRef}
            onBack={back}
            onClose={close}
            onAsset={(asset) => push({ name: "asset", asset })}
          />
        ) : null}
        {view.name === "loading" || view.name === "success" ? (
          <StatusView
            title={view.title}
            message={view.name === "success" ? view.message : undefined}
            usd={view.name === "success" ? view.usd : undefined}
            closeRef={closeButtonRef}
            onBack={view.name === "success" ? () => setStack([HOME]) : back}
            onClose={close}
            mode={view.name}
          />
        ) : null}
      </aside>
    </div>,
    document.body,
  );
}

function ActionRow({
  actions,
}: {
  actions: { id: string; label: string; icon: string; onClick: () => void }[];
}) {
  return (
    <div className="flex gap-3 px-4 pt-6">
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className="flex min-w-0 flex-1 appearance-none flex-col items-center justify-center gap-2 rounded-12 border border-border-elevated bg-transparent px-3 py-4 hover:bg-background-primary-hover"
          onClick={action.onClick}
        >
          <WalletGlyph src={action.icon} className="size-6 text-text-primary" />
          <span className="w-full text-center font-display text-text-xs-medium text-text-secondary">
            {action.label}
          </span>
        </button>
      ))}
    </div>
  );
}

function HomeView({
  closeRef,
  onClose,
  onSend,
  onReceive,
  onStake,
  onAsset,
  onDiscover,
}: {
  closeRef: Ref<HTMLButtonElement>;
  onClose: () => void;
  onSend: () => void;
  onReceive: () => void;
  onStake: () => void;
  onAsset: (asset: TokenType) => void;
  onDiscover: () => void;
}) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-2 px-6 pt-6">
        <div className="flex min-w-0 items-center gap-3">
          <WalletGlyph
            src={walletIcon}
            className="size-7 text-text-secondary"
          />
          <h2
            id="app-wallet-drawer-title"
            className="text-display-xs-semibold text-text-primary"
          >
            My Wallet
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

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pt-6">
        <div className="flex flex-col gap-4 px-6">
          <div className="flex flex-col gap-3">
            <p className="text-text-xs-regular text-text-secondary">
              Total Balance
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-display-md-semibold text-text-primary">
                {PROTOTYPE_WALLET_BALANCE}
              </p>
              <p className="flex items-center gap-1 text-text-xs-medium text-primitives-green">
                <WalletGlyph
                  src={upArrowIcon}
                  className="size-3 text-primitives-green"
                />
                {PROTOTYPE_WALLET_CHANGE}
              </p>
            </div>
          </div>
        </div>

        <ActionRow
          actions={[
            { id: "send", label: "Send", icon: sendIcon, onClick: onSend },
            {
              id: "receive",
              label: "Receive",
              icon: receiveIcon,
              onClick: onReceive,
            },
            { id: "stake", label: "Stake", icon: stakeIcon, onClick: onStake },
          ]}
        />

        <ul className="flex flex-col gap-2 px-4">
          {WALLET_ASSETS.map((asset) => (
            <li key={asset.type}>
              <button
                type="button"
                className="flex w-full appearance-none items-center gap-3 rounded-12 border-0 bg-transparent p-4 text-left hover:bg-background-tertiary-hover"
                onClick={() => onAsset(asset.type)}
              >
                <TokenMark type={asset.type} />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-text-sm-semibold text-text-primary">
                    {asset.ticker}
                  </span>
                  <span className="text-text-sm-regular text-text-tertiary">
                    {asset.name}
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-text-sm-semibold text-text-primary">
                    {asset.usd}
                  </span>
                  <span className="text-text-sm-regular text-text-tertiary">
                    {asset.amount}
                  </span>
                </span>
                <WalletGlyph
                  src={chevronRightIcon}
                  className="size-3 text-text-secondary"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="shrink-0 px-4 py-6">
        <Button variant="secondary" className="w-full" onClick={onDiscover}>
          <WalletGlyph src={searchIcon} className="size-5" />
          Discover Tokens
        </Button>
      </div>
    </>
  );
}

function useAmountState(available: number, unit: string) {
  const [amount, setAmount] = useState("");
  const [percent, setPercent] = useState<number | null>(null);
  const numeric = Number.parseFloat(amount) || 0;
  const amountLabel = formatTokenAmount(numeric, unit);

  const applyPercent = (next: number) => {
    setPercent(next);
    setAmount(((available * next) / 100).toFixed(5).replace(/\.?0+$/, ""));
  };

  const applyMax = () => {
    setPercent(100);
    setAmount(String(available));
  };

  const onAmountChange = (value: string) => {
    setPercent(null);
    setAmount(value.replace(/[^\d.]/g, ""));
  };

  return {
    amount,
    percent,
    numeric,
    amountLabel,
    applyPercent,
    applyMax,
    onAmountChange,
  };
}

function AmountField({
  label,
  unit,
  state,
}: {
  label: string;
  unit: string;
  state: ReturnType<typeof useAmountState>;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end gap-3">
        <label className="flex min-w-0 flex-1 flex-col gap-1.5">
          <WalletFieldLabel>{label}</WalletFieldLabel>
          <span className="flex items-center overflow-hidden rounded-08 bg-background-tertiary-base px-4 py-3">
            <input
              type="text"
              inputMode="decimal"
              value={state.amount}
              placeholder={`0.00 ${unit}`}
              onChange={(event) => state.onAmountChange(event.target.value)}
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-text-md-regular text-text-secondary outline-none placeholder:text-text-secondary"
            />
          </span>
        </label>
        <button
          type="button"
          className="flex h-11 shrink-0 appearance-none items-center justify-center rounded-08 bg-background-tertiary-base px-6 text-text-sm-medium text-text-secondary hover:bg-background-primary-hover"
          onClick={state.applyMax}
        >
          Max
        </button>
      </div>
      <WalletPercentRow selected={state.percent} onSelect={state.applyPercent} />
    </div>
  );
}

function BalanceHero({
  type,
  amount,
  unit,
  usd,
  change,
  caption,
}: {
  type: TokenType;
  amount: string;
  unit: string;
  usd: string;
  change?: string;
  caption?: string;
}) {
  return (
    <div className="flex flex-col gap-4 px-6">
      {caption ? (
        <p className="text-text-sm-regular text-text-tertiary">{caption}</p>
      ) : null}
      <div className="flex items-start gap-3">
        <TokenMark type={type} className="size-9" />
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="text-display-md-semibold text-text-primary">
            {amount} <span className="text-text-tertiary">{unit}</span>
          </p>
          <p className="flex items-center gap-1.5 text-text-xs-regular text-text-secondary">
            {usd}
            {change ? (
              <span className="text-text-xs-medium text-primitives-green">
                {change}
              </span>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityList({
  title,
  label,
  count,
}: {
  title: string;
  label: string;
  count: number;
}) {
  return (
    <div className="flex flex-col gap-3 p-6">
      <p className="text-text-sm-medium text-text-primary">{title}</p>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-2 py-3">
          <TokenMark type="TSC" />
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className="text-text-sm-semibold text-text-primary">
              {label}
            </span>
            <span className="text-text-sm-regular text-text-tertiary">
              Jan 28, 2021
            </span>
          </span>
          <span className="flex shrink-0 flex-col items-end gap-0.5">
            <span className="text-text-sm-semibold text-text-primary">
              $0.00
            </span>
            <span className="text-text-sm-regular text-text-tertiary">
              0.00 TSC
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

function SendView({
  assetType,
  closeRef,
  onBack,
  onClose,
  onAssetChange,
  onConfirm,
}: {
  assetType: TokenType;
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onAssetChange: (asset: TokenType) => void;
  onConfirm: (payload: { title: string; message: string; usd: string }) => void;
}) {
  const asset = getWalletAsset(assetType);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [passcode, setPasscode] = useState("wallet-passcode");
  const amountState = useAmountState(asset.available, asset.unit);

  return (
    <>
      <WalletSubheader
        title="Send Asset"
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-6">
          <div className="flex flex-col gap-1.5">
            <WalletFieldLabel>Choose Asset:</WalletFieldLabel>
            <WalletAssetSelect
              asset={asset}
              subtitle={formatTokenAmount(asset.available, asset.unit)}
              open={pickerOpen}
              onToggle={() => setPickerOpen((open) => !open)}
            />
            {pickerOpen ? (
              <WalletAssetOptionList
                assets={WALLET_ASSETS}
                onSelect={(type) => {
                  onAssetChange(type);
                  setPickerOpen(false);
                }}
              />
            ) : null}
          </div>

          <AmountField
            label="Amount:"
            unit={asset.unit}
            state={amountState}
          />

          <WalletTextField
            label="Recipient Address:"
            value={recipient}
            onChange={setRecipient}
            placeholder="Enter wallet address"
          />
        </div>

        <div className="mt-auto flex flex-col gap-4 p-6">
          <p className="text-text-sm-medium text-text-primary">Review:</p>
          <WalletReview
            rows={[
              { label: "Amount:", value: amountState.amountLabel },
              { label: "Gas:", value: formatTokenAmount(0, asset.unit) },
              { label: "Network:", value: asset.network },
              {
                label: "Total:",
                value: amountState.amountLabel,
                total: true,
              },
            ]}
          />
          <WalletPasscodeField value={passcode} onChange={setPasscode} />
          <WalletBanner>
            Review your transfer details before confirming. Verify the recipient
            address, amount, and network to ensure your funds are sent to the
            correct destination.
          </WalletBanner>
          <WalletPrimaryButton
            onClick={() =>
              onConfirm({
                title: "Send Asset",
                message: `You sent ${amountState.amountLabel}`,
                usd: "$0.00",
              })
            }
          >
            Send {amountState.amountLabel}
          </WalletPrimaryButton>
        </div>
      </div>
    </>
  );
}

function ReceiveView({
  assetType,
  closeRef,
  onBack,
  onClose,
  onAssetChange,
}: {
  assetType: TokenType;
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onAssetChange: (asset: TokenType) => void;
}) {
  const asset = getWalletAsset(assetType);
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <>
      <WalletSubheader
        title="Receive Asset"
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex gap-3 px-6">
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <WalletFieldLabel>Choose Asset:</WalletFieldLabel>
            <WalletAssetSelect
              asset={asset}
              subtitle={formatTokenAmount(asset.available, asset.unit)}
              open={pickerOpen}
              onToggle={() => setPickerOpen((open) => !open)}
            />
            {pickerOpen ? (
              <WalletAssetOptionList
                assets={WALLET_ASSETS}
                onSelect={(type) => {
                  onAssetChange(type);
                  setPickerOpen(false);
                }}
              />
            ) : null}
          </div>
          <button
            type="button"
            className="mt-7 flex h-11 shrink-0 appearance-none items-center justify-center rounded-08 bg-background-tertiary-base px-6 text-text-sm-medium text-text-secondary hover:bg-background-primary-hover"
            onClick={() => copyText(asset.address)}
          >
            Copy
          </button>
        </div>

        <div className="flex flex-col items-center gap-6 px-6 py-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-text-xl-semibold text-text-primary">
              Receive {asset.unit}
            </p>
            <p className="max-w-xs text-text-sm-regular text-text-secondary">
              Share your wallet address or QR code with the sender to receive
              crypto directly to your account.
            </p>
          </div>
          <img
            src={qrReceive}
            alt={`QR code for ${asset.unit} address`}
            className="app-wallet-qr rounded-08 border border-border-primary object-cover"
            width={248}
            height={248}
          />
          <div className="flex w-full flex-col gap-2">
            <p className="flex items-center justify-center gap-2 text-text-sm-regular text-text-tertiary">
              <WalletGlyph
                src={infoCircleIcon}
                className="size-5 text-text-tertiary"
              />
              Information warning goes here
            </p>
            <p className="flex items-center justify-center gap-2 text-text-sm-regular text-text-tertiary">
              <WalletGlyph
                src={timeIcon}
                className="size-5 text-text-tertiary"
              />
              Allow 5min for processing
            </p>
          </div>
        </div>
      </div>
      <div className="shrink-0 p-6">
        <WalletPrimaryButton
          icon={copyIcon}
          onClick={() => copyText(asset.address)}
        >
          Copy Address
        </WalletPrimaryButton>
      </div>
    </>
  );
}

function StakeView({
  closeRef,
  onBack,
  onClose,
  onConfirm,
}: {
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onConfirm: (payload: { title: string; message: string; usd: string }) => void;
}) {
  const asset = getWalletAsset("TSC");
  const [lockUp, setLockUp] = useState(false);
  const [passcode, setPasscode] = useState("wallet-passcode");
  const amountState = useAmountState(asset.available, asset.unit);

  return (
    <>
      <WalletSubheader
        title="Stake TSC"
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-6">
          <div className="flex flex-col gap-1.5">
            <WalletFieldLabel>Available Balance:</WalletFieldLabel>
            <WalletAssetSelect
              asset={asset}
              title={TSC_AVAILABLE_USD}
              subtitle={formatTokenAmount(asset.available, asset.unit)}
            />
          </div>

          <AmountField
            label="Amount:"
            unit={asset.unit}
            state={amountState}
          />

          <div className="flex flex-col gap-1.5">
            <WalletFieldLabel>Choose Validator:</WalletFieldLabel>
            <WalletAssetSelect
              asset={asset}
              title={TSC_VALIDATOR_NAME}
              subtitle={TSC_VALIDATOR_ADDRESS}
              chevron
            />
          </div>

          <WalletCheckbox
            checked={lockUp}
            onChange={setLockUp}
            title="Lock Up"
            description="Stake and lock your TSC to maximize your rewards."
          />
        </div>

        <div className="mt-auto flex flex-col gap-4 p-6">
          <WalletReview
            rows={[
              { label: "Stake Amount:", value: amountState.amountLabel },
              { label: "Gas:", value: formatTokenAmount(0, asset.unit) },
              { label: "Network:", value: asset.network },
              {
                label: "Total:",
                value: amountState.amountLabel,
                total: true,
              },
            ]}
          />
          <WalletPasscodeField value={passcode} onChange={setPasscode} />
          <WalletBanner>
            Review your staking transaction before confirming. Verify the stake
            amount, gas fee, and network to ensure your tokens are staked
            correctly.
          </WalletBanner>
          <WalletPrimaryButton
            onClick={() =>
              onConfirm({
                title: "Stake TSC",
                message: `You staked ${amountState.amountLabel}`,
                usd: "$0.00",
              })
            }
          >
            Stake {amountState.amountLabel}
          </WalletPrimaryButton>
        </div>
      </div>
    </>
  );
}

function AssetView({
  assetType,
  closeRef,
  onBack,
  onClose,
  onSend,
  onReceive,
  onStake,
  onStakedLocked,
}: {
  assetType: TokenType;
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onSend: () => void;
  onReceive: () => void;
  onStake: () => void;
  onStakedLocked: () => void;
}) {
  const asset = getWalletAsset(assetType);
  const isTsc = asset.type === "TSC";

  return (
    <>
      <WalletSubheader
        title={asset.name}
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div
          className={`pb-4 ${isTsc ? "border-b border-border-base pb-6" : ""}`}
        >
          <BalanceHero
            type={asset.type}
            amount={isTsc ? TSC_DETAIL_AMOUNT : "0.00"}
            unit={asset.unit}
            usd={isTsc ? TSC_DETAIL_USD : asset.usd}
            change={isTsc ? PROTOTYPE_WALLET_CHANGE : undefined}
          />
          <ActionRow
            actions={[
              { id: "send", label: "Send", icon: sendIcon, onClick: onSend },
              {
                id: "receive",
                label: "Receive",
                icon: receiveIcon,
                onClick: onReceive,
              },
              ...(isTsc
                ? [
                    {
                      id: "stake",
                      label: "Stake",
                      icon: stakeIcon,
                      onClick: onStake,
                    },
                  ]
                : []),
            ]}
          />
        </div>

        <div className="flex flex-col gap-2 px-2">
          {isTsc ? (
            <p className="px-3 py-4 text-text-sm-medium text-text-primary">
              Balance
            </p>
          ) : null}
          <WalletNavRow
            type={asset.type}
            title="Available Balance"
            usd={asset.usd}
            amount={asset.amount}
            onClick={onSend}
          />
          {isTsc ? (
            <WalletNavRow
              type="TSC"
              title="Staked & Locked"
              usd="$0.00"
              amount="0.00 TSC"
              onClick={onStakedLocked}
            />
          ) : null}
        </div>

        {isTsc ? (
          <div className="border-t border-border-light">
            <ActivityList
              title="Recent Activity"
              label="TSC Distribution"
              count={5}
            />
          </div>
        ) : null}
      </div>
      <div className="shrink-0 p-6">
        <WalletPrimaryButton
          icon={copyIcon}
          onClick={() => copyText(asset.address)}
        >
          Copy Address
        </WalletPrimaryButton>
      </div>
    </>
  );
}

function StakedLockedView({
  closeRef,
  onBack,
  onClose,
  onStakeMore,
  onUnstake,
  onStakeDetail,
  onLockDetail,
}: {
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onStakeMore: () => void;
  onUnstake: () => void;
  onStakeDetail: () => void;
  onLockDetail: () => void;
}) {
  return (
    <>
      <WalletSubheader
        title="Staked TSC"
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <BalanceHero
          type="TSC"
          amount={TSC_STAKED_AMOUNT}
          unit="TSC"
          usd={TSC_STAKED_USD}
        />
        <ActionRow
          actions={[
            {
              id: "stake-more",
              label: "Stake More",
              icon: stakeIcon,
              onClick: onStakeMore,
            },
            {
              id: "unstake",
              label: "Unstake",
              icon: unstakeIcon,
              onClick: onUnstake,
            },
          ]}
        />
        <div className="px-4 pt-6">
          <WalletBanner>
            Stake your TSC to help secure the network and earn rewards over
            time. The longer you stake, the more you earn, all while supporting
            a stronger, more decentralized ecosystem.
          </WalletBanner>
        </div>
        <div className="flex flex-col gap-2 px-3 py-6">
          <p className="px-3 pb-1.5 text-text-sm-medium text-text-primary">
            Your Stakes
          </p>
          <WalletNavRow
            type="TSC"
            title={TSC_VALIDATOR_NAME}
            subtitle={TSC_VALIDATOR_ADDRESS}
            usd="$0.00"
            amount="0.00 TSC"
            onClick={onStakeDetail}
          />
          <WalletNavRow
            type="TSC"
            title={TSC_VALIDATOR_NAME}
            subtitle={TSC_VALIDATOR_ADDRESS}
            usd="$0.00"
            amount="0.00 TSC"
            onClick={onStakeDetail}
          />
        </div>
        <div className="flex flex-col gap-2 px-3 py-6">
          <p className="px-3 pb-1.5 text-text-sm-medium text-text-primary">
            Your Locks
          </p>
          <WalletNavRow
            type="TSC"
            title="Active Lock"
            subtitle={`Unlock date: ${TSC_UNLOCK_DATE}`}
            usd="$0.00"
            amount="0.00 TSC"
            onClick={onLockDetail}
          />
          <WalletNavRow
            type="TSC"
            title="Active Lock"
            subtitle={`Unlock date: ${TSC_UNLOCK_DATE}`}
            usd="$0.00"
            amount="0.00 TSC"
            onClick={onLockDetail}
          />
        </div>
      </div>
    </>
  );
}

function StakedDetailView({
  closeRef,
  onBack,
  onClose,
  onStakeMore,
  onUnstake,
  onMove,
}: {
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onStakeMore: () => void;
  onUnstake: () => void;
  onMove: () => void;
}) {
  return (
    <>
      <WalletSubheader
        title={TSC_VALIDATOR_NAME}
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <BalanceHero
          type="TSC"
          amount={TSC_STAKED_AMOUNT}
          unit="TSC"
          usd={TSC_STAKED_USD}
        />
        <ActionRow
          actions={[
            {
              id: "stake-more",
              label: "Stake More",
              icon: stakeIcon,
              onClick: onStakeMore,
            },
            {
              id: "unstake",
              label: "Unstake",
              icon: unstakeIcon,
              onClick: onUnstake,
            },
            { id: "move", label: "Move", icon: moveIcon, onClick: onMove },
          ]}
        />
        <div className="px-4 pt-6">
          <WalletBanner>
            Review your delegation details before confirming. Verify the
            validator address, stake amount, and commission rate to ensure your
            delegation is correct.
          </WalletBanner>
        </div>
        <ActivityList title="Recent Activity" label="Stake" count={5} />
      </div>
    </>
  );
}

function LockedDetailView({
  closeRef,
  onBack,
  onClose,
  onExtend,
  onStakeMore,
}: {
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onExtend: () => void;
  onStakeMore: () => void;
}) {
  return (
    <>
      <WalletSubheader
        title="Active Lock"
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <BalanceHero
          type="TSC"
          amount={TSC_STAKED_AMOUNT}
          unit="TSC"
          usd={TSC_STAKED_USD}
          caption={`Unlock date: ${TSC_UNLOCK_DATE}`}
        />
        <ActionRow
          actions={[
            {
              id: "extend",
              label: "Extend Lock",
              icon: extendIcon,
              onClick: onExtend,
            },
            {
              id: "stake-more",
              label: "Stake More",
              icon: stakeIcon,
              onClick: onStakeMore,
            },
          ]}
        />
        <div className="px-4 pt-6">
          <WalletBanner>
            Review your lock details before confirming. Verify the lock amount,
            duration, and unlock date to ensure your tokens are secured as
            intended.
          </WalletBanner>
        </div>
        <ActivityList title="Recent Activity" label="Locked TSC" count={1} />
      </div>
    </>
  );
}

function MoveView({
  closeRef,
  onBack,
  onClose,
  onConfirm,
}: {
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onConfirm: (payload: SuccessPayload) => void;
}) {
  const asset = getWalletAsset("TSC");
  const [lockUp, setLockUp] = useState(false);
  const [passcode, setPasscode] = useState("wallet-passcode");
  const amountLabel = formatTokenAmount(0, asset.unit);

  return (
    <>
      <WalletSubheader
        title="Move TSC Stake"
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-6">
          <div className="flex flex-col gap-1.5">
            <WalletFieldLabel>Staked Balance:</WalletFieldLabel>
            <WalletAssetSelect
              asset={asset}
              title={TSC_AVAILABLE_USD}
              subtitle={formatTokenAmount(asset.available, asset.unit)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <WalletFieldLabel>Choose New Validator:</WalletFieldLabel>
            <WalletAssetSelect
              asset={asset}
              title={TSC_VALIDATOR_NAME}
              subtitle={TSC_VALIDATOR_ADDRESS}
              chevron
            />
          </div>
          <WalletCheckbox
            checked={lockUp}
            onChange={setLockUp}
            title="Lock Up"
            description="Stake and lock your TSC to maximize your rewards."
          />
        </div>
        <div className="mt-auto flex flex-col gap-4 p-6">
          <WalletReview
            rows={[
              { label: "Stake Amount:", value: amountLabel },
              { label: "Gas:", value: formatTokenAmount(0, asset.unit) },
              { label: "Network:", value: asset.network },
              { label: "Total:", value: amountLabel, total: true },
            ]}
          />
          <WalletPasscodeField value={passcode} onChange={setPasscode} />
          <WalletBanner>
            Review your staking transaction before confirming. Verify the
            validator, stake amount, and gas fee to ensure your tokens are
            delegated correctly.
          </WalletBanner>
          <WalletPrimaryButton
            onClick={() =>
              onConfirm({
                title: "Move TSC Stake",
                message: `You moved ${amountLabel}`,
                usd: "$0.00",
              })
            }
          >
            Move Stake {amountLabel}
          </WalletPrimaryButton>
        </div>
      </div>
    </>
  );
}

function UnstakeView({
  closeRef,
  onBack,
  onClose,
  onConfirm,
}: {
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onConfirm: (payload: SuccessPayload) => void;
}) {
  const asset = getWalletAsset("TSC");
  const [passcode, setPasscode] = useState("wallet-passcode");
  const amountState = useAmountState(asset.available, asset.unit);

  return (
    <>
      <WalletSubheader
        title="Unstake TSC"
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-6">
          <div className="flex flex-col gap-1.5">
            <WalletFieldLabel>Staked Balance:</WalletFieldLabel>
            <WalletAssetSelect
              asset={asset}
              title={TSC_AVAILABLE_USD}
              subtitle={formatTokenAmount(asset.available, asset.unit)}
            />
          </div>
          <AmountField
            label="Unstake Amount:"
            unit={asset.unit}
            state={amountState}
          />
        </div>
        <div className="mt-auto flex flex-col gap-4 p-6">
          <WalletReview
            rows={[
              { label: "Unstake Amount:", value: amountState.amountLabel },
              { label: "Gas:", value: formatTokenAmount(0, asset.unit) },
              { label: "Network:", value: asset.network },
              { label: "Destination:", value: "Available Balance" },
              {
                label: "Total:",
                value: amountState.amountLabel,
                total: true,
              },
            ]}
          />
          <WalletPasscodeField value={passcode} onChange={setPasscode} />
          <WalletBanner>
            Review your unstaking transaction before confirming. Verify the
            amount and destination to ensure your tokens are returned to the
            correct wallet.
          </WalletBanner>
          <WalletPrimaryButton
            onClick={() =>
              onConfirm({
                title: "Unstake TSC",
                message: `You unstaked ${amountState.amountLabel}`,
                usd: "$0.00",
              })
            }
          >
            Unstake {amountState.amountLabel}
          </WalletPrimaryButton>
        </div>
      </div>
    </>
  );
}

function ExtendView({
  closeRef,
  onBack,
  onClose,
  onConfirm,
}: {
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onConfirm: (payload: SuccessPayload) => void;
}) {
  const asset = getWalletAsset("TSC");
  const [passcode, setPasscode] = useState("wallet-passcode");
  const [days, setDays] = useState(90);
  const durationOptions = [30, 90, 180, 365, 730];
  const amountLabel = formatTokenAmount(0, asset.unit);

  return (
    <>
      <WalletSubheader
        title="Extend TSC Lock"
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="flex flex-col gap-6 px-6">
          <div className="flex flex-col gap-1.5">
            <WalletFieldLabel>Lock Balance:</WalletFieldLabel>
            <WalletAssetSelect
              asset={asset}
              title={TSC_AVAILABLE_USD}
              subtitle={formatTokenAmount(asset.available, asset.unit)}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex w-full flex-col gap-1.5">
              <WalletFieldLabel>Choose new unlock date:</WalletFieldLabel>
              <span className="flex items-center gap-2 overflow-hidden rounded-08 bg-background-tertiary-base px-4 py-3">
                <span className="min-w-0 flex-1 text-text-md-regular text-text-secondary">
                  {TSC_UNLOCK_DATE}
                </span>
                <WalletGlyph
                  src={calendarIcon}
                  className="size-4 text-text-tertiary"
                />
              </span>
            </label>
            <div className="flex w-full gap-3">
              {durationOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={days === option}
                  className={`flex min-w-0 flex-1 appearance-none items-center justify-center rounded-16 bg-background-tertiary-base px-3 py-1 text-text-sm-medium text-text-secondary hover:bg-background-primary-hover ${
                    days === option
                      ? "bg-background-primary-hover text-text-primary"
                      : ""
                  }`}
                  onClick={() => setDays(option)}
                >
                  {option}d
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-auto flex flex-col gap-4 p-6">
          <WalletReview
            rows={[
              { label: "Lock Amount:", value: amountLabel },
              { label: "Unlock date:", value: TSC_UNLOCK_DATE },
              { label: "Extend by:", value: `${days} days` },
              { label: "Network:", value: asset.network },
              { label: "Total:", value: amountLabel, total: true },
            ]}
          />
          <WalletPasscodeField value={passcode} onChange={setPasscode} />
          <WalletBanner>
            Review your lock extension before confirming. Verify the lock
            amount, extended duration, and new unlock date to ensure your tokens
            remain secured as intended.
          </WalletBanner>
          <WalletPrimaryButton
            onClick={() =>
              onConfirm({
                title: "Extend TSC Lock",
                message: `You extended your lock by ${days} days`,
                usd: "$0.00",
              })
            }
          >
            Extend Lock {amountLabel}
          </WalletPrimaryButton>
        </div>
      </div>
    </>
  );
}

function DiscoverView({
  closeRef,
  onBack,
  onClose,
  onAsset,
}: {
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  onAsset: (asset: TokenType) => void;
}) {
  const [query, setQuery] = useState("");
  const results = WALLET_ASSETS.filter((asset) => {
    const haystack = `${asset.ticker} ${asset.name} ${asset.unit}`.toLowerCase();
    return haystack.includes(query.trim().toLowerCase());
  });

  return (
    <>
      <WalletSubheader
        title="Discover Tokens"
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pt-6">
        <label className="flex items-center gap-2 overflow-hidden rounded-08 bg-background-tertiary-base px-3 py-3 text-text-tertiary">
          <WalletGlyph src={searchIcon} className="size-5" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            className="min-w-0 flex-1 border-0 bg-transparent p-0 text-text-sm-regular text-text-primary outline-none placeholder:text-text-tertiary"
          />
        </label>
        <ul className="mt-2 flex flex-col gap-2">
          {results.map((asset) => (
            <li key={asset.type}>
              <button
                type="button"
                className="flex w-full appearance-none items-center gap-3 rounded-12 border-0 bg-transparent p-4 text-left hover:bg-background-tertiary-hover"
                onClick={() => onAsset(asset.type)}
              >
                <TokenMark type={asset.type} />
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-text-sm-semibold text-text-primary">
                    {asset.ticker}
                  </span>
                  <span className="text-text-sm-regular text-text-tertiary">
                    {asset.name}
                  </span>
                </span>
                <WalletGlyph
                  src={chevronRightIcon}
                  className="size-3 text-text-secondary"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function StatusView({
  title,
  message,
  usd,
  closeRef,
  onBack,
  onClose,
  mode,
}: {
  title: string;
  message?: string;
  usd?: string;
  closeRef: Ref<HTMLButtonElement>;
  onBack: () => void;
  onClose: () => void;
  mode: "loading" | "success";
}) {
  return (
    <>
      <WalletSubheader
        title={title}
        onBack={onBack}
        onClose={onClose}
        closeRef={closeRef}
      />
      {mode === "loading" ? (
        <div className="flex flex-1 items-center justify-center">
          <WalletGlyph
            src={loaderIcon}
            className="size-11 animate-spin text-text-primary"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-8">
            <span className="app-wallet-success-mark flex items-center justify-center rounded-full bg-primitives-green">
              <WalletGlyph
                src={checkIcon}
                className="size-12 text-primitives-white"
              />
            </span>
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-text-md-regular text-text-secondary">
                {message}
              </p>
              <p className="text-text-xl-semibold text-text-primary">{usd}</p>
            </div>
          </div>
          <div className="shrink-0 p-6">
            <WalletPrimaryButton onClick={onBack}>Done</WalletPrimaryButton>
          </div>
        </>
      )}
    </>
  );
}
