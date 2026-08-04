import { Badge, Button } from "@relume_io/relume-ui";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { StatePanel } from "../components/shared/StatePanel";
import { SystemStatusBanners } from "../components/shared/SystemStatusBanners";
import { usePrototypeStore } from "../store/prototypeStore";
import { getRewardRows, summarizeRewards } from "../utils/rewardsBrowse";

export function RewardsPage() {
  const { apps, nodes, deployments, overrides } = usePrototypeStore(
    useShallow((state) => ({
      apps: state.apps,
      nodes: state.nodes,
      deployments: state.deployments,
      overrides: state.overrides,
    })),
  );

  const rows = useMemo(
    () => getRewardRows({ apps, nodes, deployments, overrides }),
    [apps, nodes, deployments, overrides],
  );
  const summary = summarizeRewards(rows);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Rewards
        </h1>
        <p className="max-w-3xl text-base text-text-secondary">
          Track estimated rewards across installed apps. Estimates are not
          guarantees and depend on eligibility, uptime, and app rules.
        </p>
      </div>

      <SystemStatusBanners overrides={overrides} context="management" />

      {overrides.rewardsUnavailable ? (
        <StatePanel
          tone="warning"
          title="Reward estimates unavailable"
          description="Reward estimates cannot be loaded right now. Clear the rewards unavailable override in the Prototype debugger to restore estimates."
        />
      ) : null}

      {rows.length === 0 ? (
        <StatePanel
          tone="empty"
          title="No reward activity yet"
          description="Install a rewards-enabled app on a compatible node to see estimates and eligibility here."
          actionLabel="Browse marketplace"
          actionTo="/marketplace"
        />
      ) : (
        <>
          <section className="grid gap-3 md:grid-cols-3">
            <div className="border border-border-primary bg-background-primary p-4">
              <p className="text-sm text-text-secondary">Installations</p>
              <p className="mt-1 text-2xl font-bold text-text-primary">
                {summary.total}
              </p>
            </div>
            <div className="border border-border-primary bg-background-primary p-4">
              <p className="text-sm text-text-secondary">Currently earning</p>
              <p className="mt-1 text-2xl font-bold text-text-primary">
                {summary.earning}
              </p>
            </div>
            <div className="border border-border-primary bg-background-primary p-4">
              <p className="text-sm text-text-secondary">Not earning</p>
              <p className="mt-1 text-2xl font-bold text-text-primary">
                {summary.notEarning}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-text-primary">
              By installation
            </h2>
            {rows.map((row) => (
              <article
                key={`${row.app.id}-${row.node.id}`}
                className="flex flex-wrap items-start justify-between gap-3 border border-border-primary bg-background-primary p-4"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-text-primary">
                      {row.app.name}
                    </h3>
                    <Badge variant={row.earning ? "outline" : "secondary"}>
                      {row.earning ? "Earning" : "Not earning"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-text-secondary">
                    {row.node.name} · {row.node.region}
                  </p>
                  <p className="mt-2 text-sm text-text-primary">
                    {row.statusLabel}
                  </p>
                  <p className="mt-1 text-sm text-text-secondary">
                    Estimate: {row.estimateLabel}
                    {row.app.rewards.paymentFrequency
                      ? ` · Paid ${row.app.rewards.paymentFrequency.toLowerCase()}`
                      : ""}
                  </p>
                </div>
                <Button asChild variant="secondary" size="sm">
                  <Link to={row.installationPath}>Open installation</Link>
                </Button>
              </article>
            ))}
          </section>
        </>
      )}

    </div>
  );
}
