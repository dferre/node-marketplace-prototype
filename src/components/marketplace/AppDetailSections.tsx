import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
} from "@relume_io/relume-ui";
import { marketplaceIcons } from "../../icons/iconMap";
import type { MarketplaceApp, PrototypeOverrides } from "../../types/prototype";

type AppDetailSectionsProps = {
  app: MarketplaceApp;
  overrides: PrototypeOverrides;
};

export function AppDetailSections({ app, overrides }: AppDetailSectionsProps) {
  const LockIcon = marketplaceIcons.lock;
  const SecurityIcon = marketplaceIcons.security;
  const InfoIcon = marketplaceIcons.info;

  const rewardEstimate =
    !app.rewards.available
      ? "No financial rewards"
      : app.rewards.estimateUnavailable || overrides.rewardsUnavailable
        ? "Currently unavailable"
        : (app.rewards.estimateLabel ?? "Available");

  return (
    <div className="flex flex-col gap-4">
      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-lg font-semibold text-text-primary">
          What this app does
        </h2>
        <p className="mt-2 text-sm text-text-primary">{app.fullDescription}</p>
        <div className="mt-4 border-t border-border-primary pt-3">
          <p className="text-sm text-text-secondary">Primary benefit</p>
          <p className="text-base font-semibold text-text-primary">
            {app.primaryBenefit}
          </p>
        </div>
      </section>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-lg font-semibold text-text-primary">Rewards</h2>
        <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <div>
            <dt className="text-text-secondary">Estimate</dt>
            <dd className="font-semibold text-text-primary">{rewardEstimate}</dd>
          </div>
          <div>
            <dt className="text-text-secondary">Guaranteed</dt>
            <dd className="text-text-primary">
              {app.rewards.guaranteed ? "Yes" : "No — estimates only"}
            </dd>
          </div>
          {app.rewards.token ? (
            <div>
              <dt className="text-text-secondary">Token</dt>
              <dd className="text-text-primary">{app.rewards.token}</dd>
            </div>
          ) : null}
          {app.rewards.paymentFrequency ? (
            <div>
              <dt className="text-text-secondary">Payment frequency</dt>
              <dd className="text-text-primary">{app.rewards.paymentFrequency}</dd>
            </div>
          ) : null}
        </dl>
        {app.rewards.assumptions && app.rewards.assumptions.length > 0 ? (
          <div className="mt-3 border-t border-border-primary pt-3">
            <p className="inline-flex items-center gap-2 text-sm font-semibold text-text-primary">
              <InfoIcon pack="basic" size="xs" aria-hidden="true" />
              Estimate assumptions
            </p>
            <ul className="mt-2 list-inside list-disc text-sm text-text-secondary">
              {app.rewards.assumptions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        {app.rewards.eligibilityNotes && app.rewards.eligibilityNotes.length > 0 ? (
          <div className="mt-3 border-t border-border-primary pt-3">
            <p className="text-sm font-semibold text-text-primary">Eligibility</p>
            <ul className="mt-2 list-inside list-disc text-sm text-text-secondary">
              {app.rewards.eligibilityNotes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="border border-border-primary bg-background-primary p-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Resource requirements
        </h2>
        <dl className="mt-3 grid gap-2 text-sm md:grid-cols-2">
          <div>
            <dt className="text-text-secondary">Node types</dt>
            <dd className="text-text-primary">
              {app.requirements.allowedNodeTypes.join(", ")}
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">CPU</dt>
            <dd className="text-text-primary">
              {app.requirements.minCpuCores} cores available
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">Memory</dt>
            <dd className="text-text-primary">
              {app.requirements.minMemoryGb} GB available
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">Storage</dt>
            <dd className="text-text-primary">
              {app.requirements.minStorageGb} GB
              {app.requirements.requiredStorageType
                ? ` ${app.requirements.requiredStorageType.toUpperCase()}`
                : ""}
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">Connection</dt>
            <dd className="text-text-primary">
              {app.requirements.minBandwidthMbps} Mbps
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">Node software</dt>
            <dd className="text-text-primary">
              {app.requirements.minSoftwareVersion}+
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">GPU</dt>
            <dd className="text-text-primary">
              {app.requirements.requiresGpu ? "Required" : "Not required"}
            </dd>
          </div>
          <div>
            <dt className="text-text-secondary">Public IP</dt>
            <dd className="text-text-primary">
              {app.requirements.requiresPublicIp ? "Required" : "Not required"}
            </dd>
          </div>
        </dl>
      </section>

      <Accordion type="multiple" className="border border-border-primary px-4">
        <AccordionItem value="permissions">
          <AccordionTrigger>Permissions</AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-2 text-sm text-text-primary">
              {app.permissions.map((permission) => (
                <li
                  key={permission.id}
                  className="flex items-start gap-2 border border-border-primary p-2"
                >
                  <LockIcon pack="basic" size="xs" aria-hidden="true" />
                  <span>{permission.label}</span>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security">
          <AccordionTrigger>Security and privacy</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 text-sm text-text-primary">
              <p className="inline-flex items-center gap-2">
                <SecurityIcon pack="basic" size="xs" aria-hidden="true" />
                Security review: {app.securityReviewStatus}
              </p>
              <p>Developer verification: {app.developerStatus}</p>
              <p>
                Package verification: Simulated as verified for prototype fixtures
                unless the app is suspended.
              </p>
              <p>
                Data access is limited to the permissions listed above. External
                connections are disclosed before installation.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="setup">
          <AccordionTrigger>Setup requirements</AccordionTrigger>
          <AccordionContent>
            {app.setupRequired ? (
              <div className="text-sm text-text-primary">
                <p>Configuration is required after installation.</p>
                {app.setupNotes && app.setupNotes.length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-text-secondary">
                    {app.setupNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-text-secondary">
                No required setup. Optional configuration may be available.
              </p>
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="release">
          <AccordionTrigger>Version and support</AccordionTrigger>
          <AccordionContent>
            <dl className="grid gap-2 text-sm md:grid-cols-2">
              <div>
                <dt className="text-text-secondary">Current version</dt>
                <dd className="text-text-primary">{app.version}</dd>
              </div>
              <div>
                <dt className="text-text-secondary">Category</dt>
                <dd className="capitalize text-text-primary">{app.category}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-text-secondary">Release notes</dt>
                <dd className="text-text-primary">
                  {app.releaseNotes ?? "No release notes provided."}
                </dd>
              </div>
              <div>
                <dt className="text-text-secondary">Documentation</dt>
                <dd>
                  {app.documentationUrl ? (
                    <a
                      className="underline"
                      href={app.documentationUrl}
                      onClick={(event) => event.preventDefault()}
                    >
                      View documentation
                    </a>
                  ) : (
                    "Not available"
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-text-secondary">Support</dt>
                <dd>
                  {app.supportUrl ? (
                    <a
                      className="underline"
                      href={app.supportUrl}
                      onClick={(event) => event.preventDefault()}
                    >
                      Contact support
                    </a>
                  ) : (
                    "Not available"
                  )}
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex flex-wrap gap-2">
              {app.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
