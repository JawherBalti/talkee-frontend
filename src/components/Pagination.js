import React from 'react';

function Pagination(props) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(props.totalItems / props.itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => {
    if (
      number < props.maxPageNumberLimit + 1 &&
      number > props.minPageNumberLimit
    ) {
      return (
        <div key={number} className=" page-number">
          <li
            className={props.currentPage === number ? 'active-page' : ''}
            onClick={() => props.paginate(number)}
          >
            {number}
          </li>
        </div>
      );
    } else {
      return null;
    }
  });

  return (
    <div>
      <ul className="pagination">
        <li>
          <button
            onClick={props.handlePrevbtn}
            disabled={props.currentPage === pageNumbers[0] ? true : false}
          >
            Prev
          </button>
        </li>
        {renderPageNumbers}
        <li>
          <button
            onClick={props.handleNextbtn}
            disabled={
              props.currentPage === pageNumbers[pageNumbers.length - 1]
                ? true
                : false
            }
          >
            Next
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Pagination;
