import {
  Badge,
  Button,
  Input,
  Label,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@relume_io/relume-ui";
import { useState } from "react";
import {
  createCustomErc20Token,
  disconnectedWalletFixture,
  developerWalletFixture,
  operatorWalletFixture,
  type WalletFixture,
  type WalletToken,
  type WalletTransactionType,
} from "../../data/wallet";
import { walletIcons } from "../../icons/iconMap";
import { usePrototypeStore } from "../../store/prototypeStore";
import {
  WalletSetupFlow,
  type WalletSetupStep,
} from "./WalletSetupFlow";

type WalletMenuProps = {
  context: "operator" | "developer";
};

type WalletView = "home" | "asset" | "add-token" | "setup";

const ASSET_ACTIONS = [
  { id: "send", label: "Send", iconKey: "send" as const },
  { id: "receive", label: "Receive", iconKey: "receive" as const },
  { id: "stake", label: "Stake", iconKey: "stake" as const },
  { id: "buy", label: "Buy", iconKey: "buy" as const },
] as const;

function getInitialWallet(context: WalletMenuProps["context"]): WalletFixture {
  return context === "developer"
    ? developerWalletFixture
    : operatorWalletFixture;
}

function standardLabel(token: WalletToken): string {
  if (token.standard === "erc-20") return "ERC-20";
  if (token.standard === "bitcoin") return "Bitcoin";
  return "Native";
}

function transactionLabel(type: WalletTransactionType): string {
  if (type === "send") return "Send";
  if (type === "receive") return "Receive";
  if (type === "stake") return "Stake";
  if (type === "buy") return "Buy";
  return "Reward";
}

export function WalletMenu({ context }: WalletMenuProps) {
  const [open, setOpen] = useState(false);
  const [wallet, setWallet] = useState(() => getInitialWallet(context));
  const [view, setView] = useState<WalletView>("home");
  const [setupStep, setSetupStep] = useState<WalletSetupStep>("setup");
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenContract, setTokenContract] = useState("");
  const showToast = usePrototypeStore((state) => state.showToast);

  const WalletIcon = walletIcons.wallet;
  const AvatarIcon = walletIcons.avatar;
  const ChevronIcon = walletIcons.chevron;
  const BackIcon = walletIcons.back;
  const CopyIcon = walletIcons.copy;

  const selectedToken =
    wallet.tokens.find((token) => token.id === selectedTokenId) ?? null;

  const resetNavigation = () => {
    setView("home");
    setSetupStep("setup");
    setSelectedTokenId(null);
    setTokenSymbol("");
    setTokenName("");
    setTokenContract("");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) resetNavigation();
  };

  const openSetup = (step: WalletSetupStep = "setup") => {
    setSetupStep(step);
    setView("setup");
  };

  const runAssetAction = (label: string, token: WalletToken) => {
    if (!wallet.connected) {
      showToast("Connect a wallet first (prototype)");
      return;
    }
    if (label === "Stake" && !token.stakeSupported) {
      showToast(`${token.symbol} staking not available (prototype)`);
      return;
    }
    if (label === "Receive") {
      void navigator.clipboard.writeText(token.addressPlaceholder);
      showToast(`${token.symbol} receive address copied (placeholder)`);
      return;
    }
    showToast(`${label} ${token.symbol} simulated (prototype)`);
  };

  const disconnectWallet = () => {
    setWallet(disconnectedWalletFixture(getInitialWallet(context)));
    resetNavigation();
    showToast("Wallet disconnected (prototype)");
  };

  const copyWalletAddress = async () => {
    if (!wallet.connected) {
      openSetup("setup");
      return;
    }
    try {
      await navigator.clipboard.writeText(wallet.addressPlaceholder);
      showToast("Wallet address copied (placeholder)");
    } catch {
      showToast("Could not copy address");
    }
  };

  const completeSetup = (
    nextWallet: WalletFixture,
    kind: "created" | "imported",
  ) => {
    setWallet(nextWallet);
    resetNavigation();
    showToast(
      kind === "created"
        ? "Wallet created (prototype)"
        : "Wallet imported (prototype)",
    );
  };

  const openAsset = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setView("asset");
  };

  const addCustomToken = () => {
    const symbol = tokenSymbol.trim().toUpperCase();
    const contract = tokenContract.trim();
    if (!symbol || !contract) {
      showToast("Symbol and contract address are required");
      return;
    }
    if (wallet.tokens.some((token) => token.symbol === symbol)) {
      showToast(`${symbol} is already in this wallet`);
      return;
    }
    const nextToken = createCustomErc20Token({
      symbol,
      name: tokenName.trim() || `${symbol} token`,
      contractAddressPlaceholder: `${contract} (placeholder)`,
      walletAddressPlaceholder: wallet.addressPlaceholder,
      walletAddressShort: wallet.addressShort,
    });
    setWallet((current) => ({
      ...current,
      tokens: [...current.tokens, nextToken],
    }));
    showToast(`Added ${symbol} (simulated ERC-20)`);
    setView("home");
    setTokenSymbol("");
    setTokenName("");
    setTokenContract("");
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        size="sm"
        variant="secondary"
        className="touch-target gap-2"
        aria-expanded={open}
        aria-controls="wallet-sheet"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <WalletIcon pack="basic" size="sm" aria-hidden="true" />
        <span className="hidden sm:inline">
          {wallet.connected ? wallet.balanceLabel : "Wallet"}
        </span>
        <span className="sm:hidden">Wallet</span>
      </Button>

      <SheetContent
        id="wallet-sheet"
        side="right"
        className="z-[100] w-full max-w-md border-l border-border-primary bg-background-primary p-0 shadow-menu"
        overlayClassName="z-[90]"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Wallet</SheetTitle>
          <SheetDescription>
            Simulated multi-asset wallet for {wallet.displayName}
          </SheetDescription>
        </SheetHeader>

        <div className="flex h-full flex-col overflow-y-auto px-4 py-4 pb-10">
          {view === "setup" ? (
            <WalletSetupFlow
              context={context}
              step={setupStep}
              onStepChange={setSetupStep}
              onComplete={completeSetup}
              onCancel={() => setView("home")}
              showToast={showToast}
            />
          ) : null}

          {view === "home" ? (
            <>
              <button
                type="button"
                className="flex w-full items-center gap-3 text-left"
                onClick={copyWalletAddress}
                aria-label={
                  wallet.connected
                    ? `Wallet ${wallet.addressShort}. Copy address.`
                    : "Set up wallet"
                }
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-primary bg-background-secondary">
                  <AvatarIcon pack="basic" size="sm" aria-hidden="true" />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-border-primary bg-background-primary">
                    <WalletIcon pack="filled" size="xs" aria-hidden="true" />
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1">
                    <span className="truncate text-base font-semibold text-text-primary">
                      {wallet.connected ? wallet.addressShort : "Set up wallet"}
                    </span>
                    <ChevronIcon pack="basic" size="sm" aria-hidden="true" />
                  </span>
                  <span className="block truncate text-sm text-text-secondary">
                    {wallet.connected
                      ? wallet.networkLabel
                      : "Create or import a payout wallet"}
                  </span>
                </span>
              </button>

              <Tabs defaultValue="crypto" className="mt-5 flex flex-col gap-5">
                <TabsList className="h-auto w-full justify-start gap-4 rounded-none border-0 border-b border-border-primary bg-transparent p-0">
                  <TabsTrigger
                    value="crypto"
                    className="rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-2 pt-0 text-base data-[state=active]:border-border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Crypto
                  </TabsTrigger>
                  <TabsTrigger
                    value="items"
                    className="rounded-none border-0 border-b-2 border-transparent bg-transparent px-0 pb-2 pt-0 text-base data-[state=active]:border-border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    Items
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="crypto" className="mt-0 flex flex-col gap-5">
                  <section>
                    <p className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
                      {wallet.balanceLabel}
                    </p>
                    <p className="mt-1 text-base text-text-secondary">
                      {wallet.fiatEstimateLabel}
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">
                      Default addresses: OPT, BTC, ETH, USDT, USDC, WBTC. Any
                      ERC-20 can be added.
                    </p>
                  </section>

                  {wallet.connected ? (
                    <>
                      <ul className="flex flex-col">
                        {wallet.tokens.map((token) => (
                          <li key={token.id}>
                            <button
                              type="button"
                              className="flex w-full items-center gap-3 rounded-sm border-b border-border-primary py-3 text-left last:border-b-0 hover:bg-background-secondary"
                              onClick={() => openAsset(token.id)}
                            >
                              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-primary bg-background-secondary font-mono text-xs font-medium text-text-primary">
                                {token.symbol.slice(0, 1)}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-text-primary">
                                  {token.name}
                                </p>
                                <p className="truncate text-sm text-text-secondary">
                                  {token.amountLabel} · {standardLabel(token)}
                                </p>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-sm font-semibold text-text-primary">
                                  {token.fiatLabel}
                                </p>
                                <p className="text-sm text-text-secondary">
                                  {token.changeLabel}
                                </p>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => setView("add-token")}
                      >
                        Add ERC-20 token
                      </Button>
                    </>
                  ) : (
                    <div className="rounded-md border border-border-primary bg-background-secondary p-4">
                      <p className="text-sm font-semibold text-text-primary">
                        No wallet connected
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        Create a new wallet or import one to provision OPT, BTC,
                        ETH, USDT, USDC, and WBTC addresses.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="primary"
                          data-testid="wallet-create"
                          onClick={() => openSetup("create-reveal")}
                        >
                          Create wallet
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          data-testid="wallet-import"
                          onClick={() => openSetup("import")}
                        >
                          Import wallet
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="items" className="mt-0 flex flex-col gap-3">
                  {wallet.connected && wallet.items.length > 0 ? (
                    <ul className="flex flex-col">
                      {wallet.items.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start justify-between gap-3 border-b border-border-primary py-3 last:border-b-0"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-text-primary">
                              {item.label}
                            </p>
                            <p className="mt-1 text-sm text-text-secondary">
                              {item.detail}
                            </p>
                          </div>
                          <p className="shrink-0 text-sm text-text-secondary">
                            {item.valueLabel}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="rounded-md border border-border-primary bg-background-secondary p-4">
                      <p className="text-sm font-semibold text-text-primary">
                        No items
                      </p>
                      <p className="mt-1 text-sm text-text-secondary">
                        Reward programs and app participation show up here.
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {wallet.connected ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-6"
                  data-testid="wallet-disconnect"
                  onClick={disconnectWallet}
                >
                  Disconnect wallet
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-6"
                  data-testid="wallet-setup"
                  onClick={() => openSetup("setup")}
                >
                  Set up wallet
                </Button>
              )}
            </>
          ) : null}

          {view === "asset" && selectedToken ? (
            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="touch-target shrink-0"
                  onClick={() => {
                    setView("home");
                    setSelectedTokenId(null);
                  }}
                  aria-label="Back to wallet"
                >
                  <BackIcon pack="basic" size="sm" aria-hidden="true" />
                </Button>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-text-primary">
                      {selectedToken.name}
                    </h2>
                    <Badge variant="outline">{selectedToken.symbol}</Badge>
                    <Badge variant="secondary">
                      {standardLabel(selectedToken)}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    Receive address {selectedToken.addressShort}
                  </p>
                </div>
              </div>

              <section>
                <p className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">
                  {selectedToken.amountLabel}
                </p>
                <p className="mt-1 text-base text-text-secondary">
                  {selectedToken.fiatLabel} · {selectedToken.changeLabel}
                </p>
              </section>

              <section
                className="grid grid-cols-4 gap-2 rounded-md border border-border-primary p-2"
                aria-label={`${selectedToken.symbol} actions`}
              >
                {ASSET_ACTIONS.map((action) => {
                  const Icon = walletIcons[action.iconKey];
                  const disabled =
                    action.id === "stake" && !selectedToken.stakeSupported;
                  return (
                    <button
                      key={action.id}
                      type="button"
                      className="flex touch-target flex-col items-center justify-center gap-1 rounded-sm border border-border-primary bg-background-secondary px-1 py-3 text-text-primary hover:bg-background-primary disabled:opacity-40"
                      disabled={disabled}
                      title={
                        disabled
                          ? `${selectedToken.symbol} staking unavailable`
                          : undefined
                      }
                      onClick={() =>
                        runAssetAction(action.label, selectedToken)
                      }
                    >
                      <Icon pack="basic" size="sm" aria-hidden="true" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </button>
                  );
                })}
              </section>

              <section className="rounded-md border border-border-primary bg-background-secondary p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-text-primary">
                    Receive address
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    variant="link"
                    className="gap-1 px-0"
                    onClick={() =>
                      runAssetAction("Receive", selectedToken)
                    }
                  >
                    <CopyIcon pack="basic" size="sm" aria-hidden="true" />
                    Copy
                  </Button>
                </div>
                <p className="mt-2 break-all text-sm text-text-secondary">
                  {selectedToken.addressPlaceholder}
                </p>
                {selectedToken.contractAddressPlaceholder ? (
                  <p className="mt-2 break-all text-sm text-text-secondary">
                    Contract: {selectedToken.contractAddressPlaceholder}
                  </p>
                ) : null}
              </section>

              <section className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-text-primary">
                  Transactions
                </h3>
                {selectedToken.transactions.length > 0 ? (
                  <ul className="flex flex-col">
                    {selectedToken.transactions.map((entry) => (
                      <li
                        key={entry.id}
                        className="flex items-start justify-between gap-3 border-b border-border-primary py-3 last:border-b-0"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-text-primary">
                            {entry.title}
                          </p>
                          <p className="mt-1 text-sm text-text-secondary">
                            {transactionLabel(entry.type)} · {entry.at}
                            {entry.counterpartyShort
                              ? ` · ${entry.counterpartyShort}`
                              : ""}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {entry.status}
                          </Badge>
                        </div>
                        <div className="shrink-0 text-right">
                          <p className="text-sm font-semibold text-text-primary">
                            {entry.amountLabel}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {entry.fiatLabel}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="rounded-md border border-border-primary bg-background-secondary p-4">
                    <p className="text-sm font-semibold text-text-primary">
                      No transactions yet
                    </p>
                    <p className="mt-1 text-sm text-text-secondary">
                      Send, receive, stake, or buy {selectedToken.symbol} to
                      populate this list.
                    </p>
                  </div>
                )}
              </section>
            </div>
          ) : null}

          {view === "add-token" ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="touch-target shrink-0"
                  onClick={() => setView("home")}
                  aria-label="Back to wallet"
                >
                  <BackIcon pack="basic" size="sm" aria-hidden="true" />
                </Button>
                <div>
                  <h2 className="text-lg font-semibold text-text-primary">
                    Add ERC-20 token
                  </h2>
                  <p className="mt-1 text-sm text-text-secondary">
                    Simulated import only — no chain requests are made.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="token-symbol">Symbol</Label>
                <Input
                  id="token-symbol"
                  value={tokenSymbol}
                  onChange={(event) => setTokenSymbol(event.target.value)}
                  placeholder="e.g. LINK"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="token-name">Name</Label>
                <Input
                  id="token-name"
                  value={tokenName}
                  onChange={(event) => setTokenName(event.target.value)}
                  placeholder="e.g. Chainlink"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="token-contract">Contract address</Label>
                <Input
                  id="token-contract"
                  value={tokenContract}
                  onChange={(event) => setTokenContract(event.target.value)}
                  placeholder="0x… (placeholder)"
                />
              </div>
              <Button
                type="button"
                size="sm"
                variant="primary"
                onClick={addCustomToken}
              >
                Add token
              </Button>
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}
