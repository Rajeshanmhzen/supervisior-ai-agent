type PageItem = number | "ellipsis";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const buildPageItems = (currentPage: number, totalPages: number): PageItem[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 2) {
    return [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
};

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pageItems = buildPageItems(currentPage, totalPages);
  const canGoBack = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  if (totalPages <= 1) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <span className="text-xs text-slate-500">Page 1 of 1</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <span className="text-xs text-slate-500">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-8 w-8 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoBack}
          aria-label="Previous page"
        >
          <span className="material-symbols-outlined text-sm">chevron_left</span>
        </button>

        {pageItems.map((item, index) => {
          if (item === "ellipsis") {
            return (
              <span key={`ellipsis-${index}`} className="text-slate-400 text-xs">
                ...
              </span>
            );
          }

          const isActive = item === currentPage;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`h-8 w-8 rounded-full text-xs font-semibold ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          );
        })}

        <button
          type="button"
          className="h-8 w-8 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Next page"
        >
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
