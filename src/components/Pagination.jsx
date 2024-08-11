import React from "react";

const Pagination = ({ currentPage, totalPages, onPreviousPage, onNextPage, onPage }) => {
  return (
    <div className="pagination">
      <div
      >
        <p>
          Page {currentPage} of {totalPages}
        </p>
      </div>
      <div className="page-buttons">
        <button
          onClick= {onPreviousPage}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => onPage(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick= {onNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;