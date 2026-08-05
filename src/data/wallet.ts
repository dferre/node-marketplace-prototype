export type WalletTransactionType =
  | "send"
  | "receive"
  | "stake"
  | "buy"
  | "reward";

export type WalletTransaction = {
  id: string;
  type: WalletTransactionType;
  title: string;
  amountLabel: string;
  fiatLabel: string;
  at: string;
  status: "confirmed" | "pending" | "failed";
  counterpartyShort?: string;
};

export type WalletTokenStandard = "native" | "erc-20" | "bitcoin";

export type WalletToken = {
  id: string;
  symbol: string;
  name: string;
  standard: WalletTokenStandard;
  /** Simulated deposit/receive address for this asset */
  addressPlaceholder: string;
  addressShort: string;
  /** ERC-20 contract address placeholder when applicable */
  contractAddressPlaceholder?: string;
  amountLabel: string;
  fiatLabel: string;
  changeLabel: string;
  changeDirection: "up" | "down" | "flat";
  stakeSupported: boolean;
  transactions: WalletTransaction[];
};

export type WalletItem = {
  id: string;
  label: string;
  detail: string;
  valueLabel: string;
};

export type WalletFixture = {
  displayName: string;
  addressPlaceholder: string;
  addressShort: string;
  connected: boolean;
  balanceLabel: string;
  fiatEstimateLabel: string;
  networkLabel: string;
  tokens: WalletToken[];
  items: WalletItem[];
};

const DEFAULT_TOKEN_DEFS: Omit<
  WalletToken,
  "amountLabel" | "fiatLabel" | "changeLabel" | "changeDirection" | "transactions"
>[] = [
  {
    id: "opt",
    symbol: "OPT",
    name: "Optimism",
    standard: "erc-20",
    addressPlaceholder: "0x7A3c91e0b2d84f19c6e55a0d9F2E (placeholder)",
    addressShort: "0x7A3c…9F2E",
    contractAddressPlaceholder: "0xOPT000000000000000000000000000001 (placeholder)",
    stakeSupported: true,
  },
  {
    id: "btc",
    symbol: "BTC",
    name: "Bitcoin",
    standard: "bitcoin",
    addressPlaceholder: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh (placeholder)",
    addressShort: "bc1q…0wlh",
    stakeSupported: false,
  },
  {
    id: "eth",
    symbol: "ETH",
    name: "Ethereum",
    standard: "native",
    addressPlaceholder: "0x7A3c91e0b2d84f19c6e55a0d9F2E (placeholder)",
    addressShort: "0x7A3c…9F2E",
    stakeSupported: true,
  },
  {
    id: "usdt",
    symbol: "USDT",
    name: "Tether USD",
    standard: "erc-20",
    addressPlaceholder: "0x7A3c91e0b2d84f19c6e55a0d9F2E (placeholder)",
    addressShort: "0x7A3c…9F2E",
    contractAddressPlaceholder: "0xdAC17F958D2ee523a2206206994597C13D831ec7 (placeholder)",
    stakeSupported: false,
  },
  {
    id: "usdc",
    symbol: "USDC",
    name: "USD Coin",
    standard: "erc-20",
    addressPlaceholder: "0x7A3c91e0b2d84f19c6e55a0d9F2E (placeholder)",
    addressShort: "0x7A3c…9F2E",
    contractAddressPlaceholder: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 (placeholder)",
    stakeSupported: false,
  },
  {
    id: "wbtc",
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    standard: "erc-20",
    addressPlaceholder: "0x7A3c91e0b2d84f19c6e55a0d9F2E (placeholder)",
    addressShort: "0x7A3c…9F2E",
    contractAddressPlaceholder: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599 (placeholder)",
    stakeSupported: true,
  },
];

function tx(
  partial: Omit<WalletTransaction, "id"> & { id?: string },
): WalletTransaction {
  return {
    id: partial.id ?? `tx_${partial.type}_${partial.at}`,
    ...partial,
  };
}

function buildDefaultTokens(balances: Record<
  string,
  {
    amountLabel: string;
    fiatLabel: string;
    changeLabel: string;
    changeDirection: WalletToken["changeDirection"];
    transactions: WalletTransaction[];
  }
>): WalletToken[] {
  return DEFAULT_TOKEN_DEFS.map((def) => {
    const balance = balances[def.id] ?? {
      amountLabel: `0 ${def.symbol}`,
      fiatLabel: "$0.00",
      changeLabel: "0.0%",
      changeDirection: "flat" as const,
      transactions: [],
    };
    return {
      ...def,
      ...balance,
    };
  });
}

const operatorBalances = {
  opt: {
    amountLabel: "42.8 OPT",
    fiatLabel: "$128.40",
    changeLabel: "+2.4%",
    changeDirection: "up" as const,
    transactions: [
      tx({
        type: "reward",
        title: "Node reward accrued",
        amountLabel: "+1.4 OPT",
        fiatLabel: "$4.20",
        at: "2026-08-05 08:12",
        status: "confirmed",
        counterpartyShort: "Atlas Storage",
      }),
      tx({
        type: "receive",
        title: "Received OPT",
        amountLabel: "+12.0 OPT",
        fiatLabel: "$36.00",
        at: "2026-08-03 14:40",
        status: "confirmed",
        counterpartyShort: "0x91ab…c22e",
      }),
      tx({
        type: "stake",
        title: "Staked OPT",
        amountLabel: "-5.0 OPT",
        fiatLabel: "$15.00",
        at: "2026-08-01 09:05",
        status: "confirmed",
      }),
    ],
  },
  btc: {
    amountLabel: "0.0124 BTC",
    fiatLabel: "$812.00",
    changeLabel: "-0.8%",
    changeDirection: "down" as const,
    transactions: [
      tx({
        type: "receive",
        title: "Received BTC",
        amountLabel: "+0.0124 BTC",
        fiatLabel: "$812.00",
        at: "2026-07-28 11:22",
        status: "confirmed",
        counterpartyShort: "bc1q…k9m2",
      }),
    ],
  },
  eth: {
    amountLabel: "0.84 ETH",
    fiatLabel: "$2,520.00",
    changeLabel: "+1.1%",
    changeDirection: "up" as const,
    transactions: [
      tx({
        type: "buy",
        title: "Bought ETH",
        amountLabel: "+0.50 ETH",
        fiatLabel: "$1,500.00",
        at: "2026-08-02 16:18",
        status: "confirmed",
      }),
      tx({
        type: "send",
        title: "Sent ETH",
        amountLabel: "-0.10 ETH",
        fiatLabel: "$300.00",
        at: "2026-07-30 10:01",
        status: "confirmed",
        counterpartyShort: "0x44fe…91aa",
      }),
    ],
  },
  usdt: {
    amountLabel: "250.00 USDT",
    fiatLabel: "$250.00",
    changeLabel: "0.0%",
    changeDirection: "flat" as const,
    transactions: [
      tx({
        type: "receive",
        title: "Received USDT",
        amountLabel: "+250.00 USDT",
        fiatLabel: "$250.00",
        at: "2026-08-04 19:33",
        status: "confirmed",
        counterpartyShort: "0xbb12…0ef4",
      }),
    ],
  },
  usdc: {
    amountLabel: "180.00 USDC",
    fiatLabel: "$180.00",
    changeLabel: "0.0%",
    changeDirection: "flat" as const,
    transactions: [
      tx({
        type: "buy",
        title: "Bought USDC",
        amountLabel: "+180.00 USDC",
        fiatLabel: "$180.00",
        at: "2026-08-04 12:08",
        status: "confirmed",
      }),
    ],
  },
  wbtc: {
    amountLabel: "0.0041 WBTC",
    fiatLabel: "$268.00",
    changeLabel: "-0.8%",
    changeDirection: "down" as const,
    transactions: [
      tx({
        type: "receive",
        title: "Received WBTC",
        amountLabel: "+0.0041 WBTC",
        fiatLabel: "$268.00",
        at: "2026-07-29 07:55",
        status: "confirmed",
        counterpartyShort: "0x11cd…88a0",
      }),
    ],
  },
};

const developerBalances = {
  opt: {
    amountLabel: "1,240 OPT",
    fiatLabel: "$3,720.00",
    changeLabel: "+5.1%",
    changeDirection: "up" as const,
    transactions: [
      tx({
        type: "reward",
        title: "Publisher earnings payout",
        amountLabel: "+220 OPT",
        fiatLabel: "$660.00",
        at: "2026-08-05 07:40",
        status: "confirmed",
        counterpartyShort: "Marketplace",
      }),
      tx({
        type: "stake",
        title: "Staked OPT",
        amountLabel: "-100 OPT",
        fiatLabel: "$300.00",
        at: "2026-08-02 13:15",
        status: "confirmed",
      }),
      tx({
        type: "send",
        title: "Sent OPT",
        amountLabel: "-40 OPT",
        fiatLabel: "$120.00",
        at: "2026-07-31 18:02",
        status: "confirmed",
        counterpartyShort: "0x55aa…12cd",
      }),
    ],
  },
  btc: {
    amountLabel: "0.0020 BTC",
    fiatLabel: "$131.00",
    changeLabel: "-0.8%",
    changeDirection: "down" as const,
    transactions: [],
  },
  eth: {
    amountLabel: "2.10 ETH",
    fiatLabel: "$6,300.00",
    changeLabel: "+1.1%",
    changeDirection: "up" as const,
    transactions: [
      tx({
        type: "receive",
        title: "Received ETH",
        amountLabel: "+1.00 ETH",
        fiatLabel: "$3,000.00",
        at: "2026-08-01 08:44",
        status: "confirmed",
        counterpartyShort: "0x99ef…4410",
      }),
    ],
  },
  usdt: {
    amountLabel: "1,000.00 USDT",
    fiatLabel: "$1,000.00",
    changeLabel: "0.0%",
    changeDirection: "flat" as const,
    transactions: [
      tx({
        type: "buy",
        title: "Bought USDT",
        amountLabel: "+1,000.00 USDT",
        fiatLabel: "$1,000.00",
        at: "2026-07-27 15:20",
        status: "confirmed",
      }),
    ],
  },
  usdc: {
    amountLabel: "500.00 USDC",
    fiatLabel: "$500.00",
    changeLabel: "0.0%",
    changeDirection: "flat" as const,
    transactions: [],
  },
  wbtc: {
    amountLabel: "0.0010 WBTC",
    fiatLabel: "$65.50",
    changeLabel: "-0.8%",
    changeDirection: "down" as const,
    transactions: [],
  },
};

export const DEFAULT_WALLET_TOKEN_SYMBOLS = [
  "OPT",
  "BTC",
  "ETH",
  "USDT",
  "USDC",
  "WBTC",
] as const;

export const operatorWalletFixture: WalletFixture = {
  displayName: "Operator payout wallet",
  addressPlaceholder: "0x7A3c91e0b2d84f19c6e55a0d9F2E (placeholder)",
  addressShort: "0x7A3c…9F2E",
  connected: true,
  balanceLabel: "$4,158.40",
  fiatEstimateLabel: "Total across supported assets",
  networkLabel: "Multi-asset wallet (simulated)",
  tokens: buildDefaultTokens(operatorBalances),
  items: [
    {
      id: "atlas",
      label: "Atlas Storage eligibility",
      detail: "Active on 2 nodes",
      valueLabel: "Earning",
    },
    {
      id: "relay",
      label: "Relay Edge participation",
      detail: "Awaiting wallet sync",
      valueLabel: "Pending",
    },
  ],
};

export const developerWalletFixture: WalletFixture = {
  displayName: "Developer payout wallet",
  addressPlaceholder: "0xB41d82f7c0e19a55d3b8f04a71C6E (placeholder)",
  addressShort: "0xB41d…71C6",
  connected: true,
  balanceLabel: "$11,716.50",
  fiatEstimateLabel: "Total across supported assets",
  networkLabel: "Publisher multi-asset wallet (simulated)",
  tokens: buildDefaultTokens(developerBalances).map((token) =>
    token.id === "opt" || token.id === "eth" || token.id === "usdt"
      ? {
          ...token,
          addressPlaceholder:
            "0xB41d82f7c0e19a55d3b8f04a71C6E (placeholder)",
          addressShort: "0xB41d…71C6",
        }
      : token.id === "btc"
        ? {
            ...token,
            addressPlaceholder:
              "bc1qdevexample000000000000000000000xyz (placeholder)",
            addressShort: "bc1q…0xyz",
          }
        : {
            ...token,
            addressPlaceholder:
              "0xB41d82f7c0e19a55d3b8f04a71C6E (placeholder)",
            addressShort: "0xB41d…71C6",
          },
  ),
  items: [
    {
      id: "atlas-app",
      label: "Atlas Storage Developer Edition",
      detail: "Published marketplace app",
      valueLabel: "Live",
    },
  ],
};

export const disconnectedWalletFixture = (
  base: WalletFixture,
): WalletFixture => ({
  ...base,
  connected: false,
  balanceLabel: "$0.00",
  fiatEstimateLabel: "Connect wallet to estimate",
  tokens: base.tokens.map((token) => ({
    ...token,
    amountLabel: `0 ${token.symbol}`,
    fiatLabel: "$0.00",
    changeLabel: "0.0%",
    changeDirection: "flat",
    transactions: [],
  })),
  items: [],
});

export function createCustomErc20Token(args: {
  symbol: string;
  name: string;
  contractAddressPlaceholder: string;
  walletAddressPlaceholder: string;
  walletAddressShort: string;
}): WalletToken {
  const symbol = args.symbol.toUpperCase();
  return {
    id: `custom_${symbol.toLowerCase()}_${Date.now()}`,
    symbol,
    name: args.name || `${symbol} token`,
    standard: "erc-20",
    addressPlaceholder: args.walletAddressPlaceholder,
    addressShort: args.walletAddressShort,
    contractAddressPlaceholder: args.contractAddressPlaceholder,
    amountLabel: `0 ${symbol}`,
    fiatLabel: "$0.00",
    changeLabel: "0.0%",
    changeDirection: "flat",
    stakeSupported: false,
    transactions: [],
  };
}

/** Deterministic prototype recovery phrase (never a real mnemonic). */
export const PROTOTYPE_RECOVERY_PHRASE = [
  "orbit",
  "node",
  "signal",
  "vault",
  "relay",
  "ember",
  "lattice",
  "beacon",
  "copper",
  "harbor",
  "quartz",
  "summit",
] as const;

export type WalletSetupContext = "operator" | "developer";

function emptyBalances(): Record<
  string,
  {
    amountLabel: string;
    fiatLabel: string;
    changeLabel: string;
    changeDirection: WalletToken["changeDirection"];
    transactions: WalletTransaction[];
  }
> {
  return Object.fromEntries(
    DEFAULT_TOKEN_DEFS.map((def) => [
      def.id,
      {
        amountLabel: `0 ${def.symbol}`,
        fiatLabel: "$0.00",
        changeLabel: "0.0%",
        changeDirection: "flat" as const,
        transactions: [] as WalletTransaction[],
      },
    ]),
  );
}

function addressForContext(context: WalletSetupContext): {
  addressPlaceholder: string;
  addressShort: string;
  btcPlaceholder: string;
  btcShort: string;
} {
  if (context === "developer") {
    return {
      addressPlaceholder: "0xC8e2a91f0b3d74e19a55d0c9F1A (placeholder)",
      addressShort: "0xC8e2…9F1A",
      btcPlaceholder: "bc1qnewdev000000000000000000000xyz (placeholder)",
      btcShort: "bc1q…0xyz",
    };
  }
  return {
    addressPlaceholder: "0xD4f1b80e2c5a93f17b66e1d8E2B (placeholder)",
    addressShort: "0xD4f1…E2B",
    btcPlaceholder: "bc1qnewop000000000000000000000abc (placeholder)",
    btcShort: "bc1q…0abc",
  };
}

function applyAddresses(
  tokens: WalletToken[],
  context: WalletSetupContext,
): WalletToken[] {
  const addresses = addressForContext(context);
  return tokens.map((token) =>
    token.standard === "bitcoin"
      ? {
          ...token,
          addressPlaceholder: addresses.btcPlaceholder,
          addressShort: addresses.btcShort,
        }
      : {
          ...token,
          addressPlaceholder: addresses.addressPlaceholder,
          addressShort: addresses.addressShort,
        },
  );
}

/** Fresh zero-balance wallet after create flow. */
export function createFreshWalletFixture(
  context: WalletSetupContext,
): WalletFixture {
  const addresses = addressForContext(context);
  return {
    displayName:
      context === "developer"
        ? "New developer wallet"
        : "New operator wallet",
    addressPlaceholder: addresses.addressPlaceholder,
    addressShort: addresses.addressShort,
    connected: true,
    balanceLabel: "$0.00",
    fiatEstimateLabel: "New wallet — no funds yet",
    networkLabel: "Multi-asset wallet (simulated)",
    tokens: applyAddresses(buildDefaultTokens(emptyBalances()), context),
    items: [],
  };
}

/** Restored wallet after successful import (uses persona balances). */
export function createImportedWalletFixture(
  context: WalletSetupContext,
): WalletFixture {
  const base =
    context === "developer" ? developerWalletFixture : operatorWalletFixture;
  return {
    ...base,
    connected: true,
    displayName:
      context === "developer"
        ? "Imported developer wallet"
        : "Imported operator wallet",
    networkLabel: "Imported multi-asset wallet (simulated)",
  };
}

export function normalizeRecoveryPhrase(input: string): string[] {
  return input
    .trim()
    .toLowerCase()
    .split(/[\s,]+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

export function validateRecoveryPhrase(input: string): {
  ok: boolean;
  words: string[];
  message?: string;
} {
  const words = normalizeRecoveryPhrase(input);
  if (words.length !== 12 && words.length !== 24) {
    return {
      ok: false,
      words,
      message: "Enter a 12- or 24-word recovery phrase (prototype).",
    };
  }
  if (words.some((word) => !/^[a-z]+$/.test(word))) {
    return {
      ok: false,
      words,
      message: "Recovery words should be letters only (prototype).",
    };
  }
  return { ok: true, words };
}

export function validatePrivateKey(input: string): {
  ok: boolean;
  message?: string;
} {
  const value = input.trim();
  if (!value) {
    return { ok: false, message: "Private key is required." };
  }
  const normalized = value.startsWith("0x") ? value.slice(2) : value;
  if (!/^[a-fA-F0-9]{64}$/.test(normalized)) {
    return {
      ok: false,
      message: "Enter a 64-character hex private key (prototype).",
    };
  }
  return { ok: true };
}

export type RecoveryConfirmChallenge = {
  index: number;
  word: string;
  options: string[];
};

/** Build a simple “pick the Nth word” challenge for create confirmation. */
export function buildRecoveryConfirmChallenges(
  phrase: readonly string[],
  count = 3,
): RecoveryConfirmChallenge[] {
  const decoys = [
    "alpha",
    "bravo",
    "delta",
    "echo",
    "frost",
    "gamma",
    "helix",
    "ion",
    "jade",
    "kite",
  ];
  const indices = [2, 5, 10].slice(0, count);
  return indices.map((index) => {
    const word = phrase[index] ?? phrase[0]!;
    const wrong = decoys
      .filter((item) => item !== word)
      .slice(0, 2);
    const options = [word, ...wrong].sort((a, b) => a.localeCompare(b));
    return { index, word, options };
  });
}
