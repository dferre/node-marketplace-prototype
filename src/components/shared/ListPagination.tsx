import { Button } from "../ui/Button";

type ListPaginationProps = {
  page: number;
  totalPages: number;
  start: number;
  end: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
};

export function ListPagination({
  page,
  totalPages,
  start,
  end,
  total,
  onPageChange,
  label = "items",
}: ListPaginationProps) {
  if (total <= end && page === 1 && totalPages <= 1) {
    return total > 0 ? (
      <p className="text-sm text-text-secondary">
        Showing {total} {label}
      </p>
    ) : null;
  }

  return (
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-text-secondary">
        Showing {start}–{end} of {total} {label}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
