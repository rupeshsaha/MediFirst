import React, { useContext } from "react";
import { StoreContext } from "../store/StoreContext";

const Paginate = () => {
  const { currPage, setCurrPage, totalPages } = useContext(StoreContext);

  //Hide when total page is less than equal to 1
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(currPage - 2, 1);
      let end = Math.min(currPage + 2, totalPages);

      if (currPage <= 3) {
        start = 1;
        end = 5;
      }

      if (currPage >= totalPages - 2) {
        start = totalPages - 4;
        end = totalPages;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="md:w-full  items-center flex justify-center p-4  gap-2">
      {currPage > 1 && (
        <button
          onClick={() => setCurrPage(1)}
          className="px-4 py-2 rounded-md bg-gray-200 text-black"
        >
          First
        </button>
      )}

      {currPage > 1 && (
        <button
          onClick={() => setCurrPage(currPage - 1)}
          className="px-4 py-2 rounded-md bg-gray-200 text-black"
        >
          Prev
        </button>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => setCurrPage(page)}
          className={`px-4 py-2 rounded-md ${
            currPage === page
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          {page}
        </button>
      ))}

      {currPage < totalPages && (
        <button
          onClick={() => setCurrPage(currPage + 1)}
          className="px-4 py-2 rounded-md bg-gray-200 text-black"
        >
          Next
        </button>
      )}

      {currPage < totalPages && (
        <button
          onClick={() => setCurrPage(totalPages)}
          className="px-4 py-2 rounded-md bg-gray-200 text-black"
        >
          Last
        </button>
      )}
    </div>
  );
};

export default Paginate;
