import { Badge } from "@relume_io/relume-ui";
import type { DeveloperApp } from "../../types/developer";

type VersionComparisonProps = {
  app: DeveloperApp;
};

type ComparisonRow = {
  label: string;
  previous: string;
  updated: string;
};

export function VersionComparison({ app }: VersionComparisonProps) {
  const previousVersion =
    app.submission?.timeline.find((event) => event.status === "submitted")
      ?.summary ?? "Version 1.0.0 submitted";
  const rows: ComparisonRow[] = [
    {
      label: "Listing benefit",
      previous: "Technical capacity language without clear operator value",
      updated: app.basics.primaryBenefit || "Updated primary benefit",
    },
    {
      label: "Privacy policy",
      previous: "Missing privacy-policy URL",
      updated: app.support.privacyPolicyUrl || "Still missing",
    },
    {
      label: "Build",
      previous: "1.0.0 · signature missing · uninstall test failed",
      updated: `${app.build.version} · ${app.build.status} · signature ${
        app.build.signaturePresent ? "present" : "missing"
      }`,
    },
    {
      label: "Rewards summary",
      previous: "Guaranteed earnings language without methodology",
      updated:
        app.listing.rewardSummary ||
        app.rewards.estimateLabel ||
        "Reward summary updated",
    },
    {
      label: "Media",
      previous: "Rewards screenshot rejected",
      updated: `${app.media.filter((item) => item.status === "ready").length} ready assets`,
    },
  ];

  return (
    <section className="border border-border-primary bg-background-primary p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-base font-semibold text-text-primary">
          Revision comparison
        </h2>
        <Badge variant="outline">Round {app.submission?.round ?? 1}</Badge>
      </div>
      <p className="mt-2 text-sm text-text-secondary">
        Previous: {previousVersion}. Updated draft reflects developer responses
        before resubmission.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border-primary">
              <th className="px-2 py-2 font-semibold text-text-primary">
                Section
              </th>
              <th className="px-2 py-2 font-semibold text-text-primary">
                Previous
              </th>
              <th className="px-2 py-2 font-semibold text-text-primary">
                Updated
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border-primary">
                <td className="px-2 py-2 font-semibold text-text-primary">
                  {row.label}
                </td>
                <td className="px-2 py-2 text-text-secondary">{row.previous}</td>
                <td className="px-2 py-2 text-text-primary">{row.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
