import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number; // 0-indexed
  totalPages: number; // For rendering numbers
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    for (let i = 0; i < totalPages; i++) {
        pages.push(i);
    }
    return pages;
  };

  const pages = getPages();

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`w-10 h-10 flex items-center justify-center rounded-[10px] sm:rounded-xl font-black transition-all ${
          currentPage === 0
            ? 'border-[2px] border-gray-400 text-gray-400 bg-white cursor-not-allowed'
            : 'border-[2px] border-black text-black bg-white hover:bg-gray-50'
        }`}
      >
        <ChevronLeft size={20} strokeWidth={3} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 flex items-center justify-center rounded-[10px] sm:rounded-xl font-black text-sm sm:text-base transition-all ${
            currentPage === p
              ? 'border-[2px] border-black text-white bg-blue-500 shadow-[3px_3px_0px_#000] -translate-y-[1px] -translate-x-[1px]'
              : 'border-[2px] border-black text-black bg-white hover:bg-gray-50'
          }`}
        >
          {p + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className={`w-10 h-10 flex items-center justify-center rounded-[10px] sm:rounded-xl font-black transition-all ${
          currentPage >= totalPages - 1
            ? 'border-[2px] border-gray-400 text-gray-400 bg-white cursor-not-allowed'
            : 'border-[2px] border-black text-black bg-white hover:bg-gray-50'
        }`}
      >
        <ChevronRight size={20} strokeWidth={3} />
      </button>
    </div>
  );
}
