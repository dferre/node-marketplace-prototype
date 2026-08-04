import {
  Button,
  Checkbox,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@relume_io/relume-ui";
import type { FormEvent } from "react";
import { marketplaceIcons } from "../../icons/iconMap";
import {
  APP_CATEGORIES,
  type MarketplaceBrowseState,
  type MarketplaceSort,
} from "../../utils/marketplaceBrowse";

type MarketplaceToolbarProps = {
  value: MarketplaceBrowseState;
  resultCount: number;
  onChange: (next: MarketplaceBrowseState) => void;
  onSubmitSearch?: () => void;
};

export function MarketplaceToolbar({
  value,
  resultCount,
  onChange,
  onSubmitSearch,
}: MarketplaceToolbarProps) {
  const SearchIcon = marketplaceIcons.search;

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmitSearch?.();
  };

  return (
    <div className="flex flex-col gap-4 border border-border-primary bg-background-primary p-4">
      <form
        className="flex flex-col gap-3 md:flex-row md:items-end"
        onSubmit={handleSearchSubmit}
      >
        <div className="flex-1">
          <Label htmlFor="marketplace-search">Search apps</Label>
          <Input
            id="marketplace-search"
            value={value.q}
            onChange={(event) =>
              onChange({ ...value, q: event.target.value })
            }
            placeholder="Search by name, developer, category, or tag"
            icon={<SearchIcon pack="basic" size="sm" aria-hidden="true" />}
          />
        </div>
        <Button type="submit" variant="secondary" size="sm">
          Search
        </Button>
      </form>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div>
          <Label htmlFor="category-filter">Category</Label>
          <Select
            value={value.category}
            onValueChange={(category) =>
              onChange({
                ...value,
                category: category as MarketplaceBrowseState["category"],
              })
            }
          >
            <SelectTrigger id="category-filter">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {APP_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="intensity-filter">Resource use</Label>
          <Select
            value={value.intensity}
            onValueChange={(intensity) =>
              onChange({
                ...value,
                intensity: intensity as MarketplaceBrowseState["intensity"],
              })
            }
          >
            <SelectTrigger id="intensity-filter">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rewards-filter">Rewards</Label>
          <Select
            value={value.rewards}
            onValueChange={(rewards) =>
              onChange({
                ...value,
                rewards: rewards as MarketplaceBrowseState["rewards"],
              })
            }
          >
            <SelectTrigger id="rewards-filter">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="yes">Rewards available</SelectItem>
              <SelectItem value="no">No financial rewards</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="sort-filter">Sort by</Label>
          <Select
            value={value.sort}
            onValueChange={(sort) =>
              onChange({ ...value, sort: sort as MarketplaceSort })
            }
          >
            <SelectTrigger id="sort-filter">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="compatibility">Most compatible</SelectItem>
              <SelectItem value="resource">Resource use</SelectItem>
              <SelectItem value="rewards">Rewards</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-text-primary">
          <Checkbox
            checked={value.verifiedOnly}
            onCheckedChange={(checked) =>
              onChange({ ...value, verifiedOnly: checked === true })
            }
            aria-label="Verified apps only"
          />
          Verified apps only
        </label>
        <p className="text-sm text-text-secondary">
          {resultCount} app{resultCount === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
