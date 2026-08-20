import { Badge, Input, Label } from "@relume_io/relume-ui";
import { Button } from "../ui/Button";
import { useMemo, useState } from "react";
import type { AppComment, AppReview } from "../../data/appSocialProof";
import { marketplaceIcons } from "../../icons/iconMap";

type AppReviewsSectionProps = {
  appName: string;
  averageRating: number;
  reviewCount: number;
  reviews: AppReview[];
  comments: AppComment[];
};

function Stars({ rating }: { rating: number }) {
  const StarIcon = marketplaceIcons.star;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon
          key={index}
          pack={index < rating ? "filled" : "basic"}
          size="xs"
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export function AppReviewsSection({
  appName,
  averageRating,
  reviewCount,
  reviews,
  comments: initialComments,
}: AppReviewsSectionProps) {
  const [filter, setFilter] = useState<"all" | "4+" | "discussion">("all");
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState("");
  const [helpful, setHelpful] = useState<Record<string, number>>(() =>
    Object.fromEntries(reviews.map((review) => [review.id, review.helpfulCount])),
  );

  const visibleReviews = useMemo(() => {
    if (filter === "4+") return reviews.filter((review) => review.rating >= 4);
    return reviews;
  }, [filter, reviews]);

  return (
    <section className="flex flex-col gap-4 border border-border-primary bg-background-primary p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Reviews & discussion
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Prototype sample notes for {appName} — not real customer testimonials.
          </p>
        </div>
        <div className="border border-border-primary bg-background-secondary px-3 py-2">
          <p className="text-sm text-text-secondary">Average (sample)</p>
          <p className="text-xl font-bold text-text-primary">
            {averageRating.toFixed(1)}
            <span className="ml-2 text-sm font-normal text-text-secondary">
              · {reviewCount} reviews
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Review filters">
        <Button
          type="button"
          size="sm"
          variant={filter === "all" ? "primary" : "secondary"}
          onClick={() => setFilter("all")}
        >
          Reviews
        </Button>
        <Button
          type="button"
          size="sm"
          variant={filter === "4+" ? "primary" : "secondary"}
          onClick={() => setFilter("4+")}
        >
          4 stars and up
        </Button>
        <Button
          type="button"
          size="sm"
          variant={filter === "discussion" ? "primary" : "secondary"}
          onClick={() => setFilter("discussion")}
        >
          Comments
        </Button>
      </div>

      {filter !== "discussion" ? (
        <ul className="flex flex-col gap-3">
          {visibleReviews.length === 0 ? (
            <li className="border border-border-primary bg-background-secondary p-4 text-sm text-text-secondary">
              No sample reviews match this filter.
            </li>
          ) : (
            visibleReviews.map((review) => (
              <li
                key={review.id}
                className="border border-border-primary bg-background-primary p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <Stars rating={review.rating} />
                  <h3 className="font-semibold text-text-primary">
                    {review.title}
                  </h3>
                  <Badge variant="secondary">{review.postedLabel}</Badge>
                </div>
                <p className="mt-1 text-sm text-text-secondary">
                  {review.authorLabel} · {review.nodeContext}
                </p>
                <p className="mt-2 text-sm text-text-primary">{review.body}</p>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="mt-3"
                  onClick={() =>
                    setHelpful((current) => ({
                      ...current,
                      [review.id]: (current[review.id] ?? 0) + 1,
                    }))
                  }
                >
                  Helpful ({helpful[review.id] ?? 0})
                </Button>
              </li>
            ))
          )}
        </ul>
      ) : null}

      {filter === "discussion" || filter === "all" ? (
        <div className="border-t border-border-primary pt-4">
          <h3 className="text-base font-semibold text-text-primary">Comments</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {comments.map((comment) => (
              <li
                key={comment.id}
                className="border border-border-primary px-3 py-2"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-text-primary">
                    {comment.authorLabel}
                  </p>
                  <span className="text-sm text-text-secondary">
                    {comment.postedLabel}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-primary">{comment.body}</p>
              </li>
            ))}
          </ul>

          <form
            className="mt-4 flex flex-col gap-2 border border-border-primary bg-background-secondary p-3"
            onSubmit={(event) => {
              event.preventDefault();
              const body = draft.trim();
              if (!body) return;
              setComments((current) => [
                {
                  id: `local-${Date.now()}`,
                  authorLabel: "You (prototype session)",
                  body,
                  postedLabel: "Just now",
                },
                ...current,
              ]);
              setDraft("");
              setFilter("discussion");
            }}
          >
            <Label htmlFor="app-comment-draft">Add a comment</Label>
            <Input
              id="app-comment-draft"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about install fit, rewards caveats, or fleet behavior…"
            />
            <div>
              <Button type="submit" size="sm" variant="primary" disabled={!draft.trim()}>
                Post comment
              </Button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
