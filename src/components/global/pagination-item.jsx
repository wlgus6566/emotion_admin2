const Pagination = ({ totalCount, currentPage, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / 10) // 전체 페이지 수
  const maxPage = 10 // 최대 노출 페이지 수

  const startPage = Math.max(currentPage - Math.floor(maxPage / 2), 1) // 시작 페이지
  const endPage = Math.min(startPage + maxPage - 1, totalPages) // 끝 페이지
  const pageNumbers = []
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex justify-center mt-6">
      <nav className="flex justify-center items-center space-x-2">
        <ul className="flex gap-2">
          <li
            className={`mr-2 inline-flex items-center gap-2 rounded-md${
              currentPage === 1
                ? " text-gray-400"
                : " text-gray-500 hover:text-gray-600"
            }`}
          >
            <button
              className="page-link"
              disabled={`${currentPage === 1 ? "disabled" : ""}`}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <span aria-hidden="true">«</span>
              <span className="sr-only">Previous</span>
            </button>
          </li>
          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`w-10 h-10 p-4 inline-flex items-center text-sm font-medium rounded-full${
                currentPage === page
                  ? " bg-primary text-white"
                  : "text-gray-500"
              }`}
            >
              <button className="w-10" onClick={() => onPageChange(page)}>
                {page}
              </button>
            </li>
          ))}
          <li
            className={`inline-flex items-center gap-2 rounded-md${
              currentPage === totalPages
                ? " text-gray-400"
                : " text-gray-500 hover:text-gray-600"
            }`}
          >
            <button
              disabled={`${currentPage === totalPages ? "disabled" : ""}`}
              onClick={() => onPageChange(currentPage + 1)}
            >
              <span className="sr-only">Next</span>
              <span aria-hidden="true">»</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Pagination
