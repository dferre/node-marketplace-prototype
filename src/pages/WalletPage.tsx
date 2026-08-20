import { StatePanel } from "../components/shared/StatePanel";

export function WalletPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-display-xs-semibold text-text-primary">Wallet</h1>
        <p className="max-w-3xl text-text-md-regular text-text-secondary">
          Payout wallet state for this prototype still lives on nodes and
          rewards. This screen exists so the sidebar destination matches the
          Webstack design.
        </p>
      </div>
      <StatePanel
        title="Wallet is not wired yet"
        description="Connect-wallet flows and balances are not part of this prototype. Use Rewards and My Nodes for wallet-related status."
        tone="info"
        actionLabel="View rewards"
        actionTo="/rewards"
      />
    </div>
  );
}
