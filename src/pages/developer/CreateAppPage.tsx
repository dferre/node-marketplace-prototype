import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@relume_io/relume-ui";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePrototypeStore } from "../../store/prototypeStore";
import type { AppCategory } from "../../types/prototype";

export function CreateAppPage() {
  const navigate = useNavigate();
  const createDeveloperApp = usePrototypeStore((state) => state.createDeveloperApp);
  const updateDeveloperApp = usePrototypeStore((state) => state.updateDeveloperApp);
  const developer = usePrototypeStore((state) =>
    state.developerPortal.developers.find(
      (item) => item.id === state.developerPortal.activeDeveloperId,
    ),
  );
  const [name, setName] = useState("Atlas Storage Developer Edition");
  const [slug, setSlug] = useState("atlas-storage-dev");
  const [category, setCategory] = useState<AppCategory>("storage");
  const [benefit, setBenefit] = useState(
    "Earn rewards by providing secure storage capacity.",
  );

  if (developer?.suspended || developer?.restricted) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-text-primary">Create app</h1>
        <p className="text-sm text-text-secondary">
          This developer persona cannot create apps.
        </p>
        <Button asChild size="sm" variant="secondary">
          <Link to="/developer">Back to overview</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Create app
        </h1>
        <p className="mt-2 max-w-3xl text-base text-text-secondary">
          Start a draft. You can save and exit at any time. Verification is
          required before submission, not before drafting.
        </p>
      </div>

      <form
        className="flex max-w-xl flex-col gap-4 border border-border-primary bg-background-primary p-4"
        onSubmit={(event) => {
          event.preventDefault();
          const id = createDeveloperApp();
          updateDeveloperApp(id, {
            basics: {
              name,
              slug,
              internalId: id,
              category,
              secondaryCategories: [],
              tags: [],
              shortDescription: benefit,
              fullDescription: benefit,
              primaryBenefit: benefit,
              targetOperator: "Fleet operators",
              setupComplexity: "medium",
              language: "en",
              supportStatus: "Supported",
              openSource: false,
              repositoryUrl: "",
              resourceIntensity: "high",
            },
            listing: {
              publicName: name,
              developerDisplayName: "Atlas Network",
              tagline: benefit,
              shortDescription: benefit,
              fullDescription: benefit,
              whatItDoes: benefit,
              whyInstall: benefit,
              howItWorks: "",
              keyBenefits: [benefit],
              setupExpectations: "",
              resourceUseExplanation: "",
              rewardSummary: "",
              faqs: [],
              documentationUrl: "",
              supportUrl: "",
              privacyPolicyUrl: "",
              termsUrl: "",
            },
          });
          navigate(`/developer/apps/${id}/edit`);
        }}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="app-name">App name</Label>
          <Input
            id="app-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="app-slug">Slug</Label>
          <Input
            id="app-slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="app-category">Primary category</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as AppCategory)}
          >
            <SelectTrigger id="app-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                [
                  "storage",
                  "compute",
                  "networking",
                  "ai",
                  "utility",
                ] as AppCategory[]
              ).map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="app-benefit">Primary benefit</Label>
          <Input
            id="app-benefit"
            value={benefit}
            onChange={(event) => setBenefit(event.target.value)}
            required
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" size="sm" variant="primary">
            Create draft
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link to="/developer/apps">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
