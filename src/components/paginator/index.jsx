import { AiOutlineRight, AiOutlineDoubleRight, AiOutlineLeft, AiOutlineDoubleLeft } from "react-icons/ai";

const Paginator = ({ totalPages = 20,currentPage, setCurrentPage }) => {

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <div className="flex justify-center items-center space-x-2">
            {/* First Page Button */}
            <button
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <AiOutlineDoubleLeft />
            </button>

            {/* Previous Page Button */}
            <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <AiOutlineLeft />
            </button>

            {/* Page Numbers */}
            {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                    <button
                        key={pageNumber}
                        onClick={() => handlePageClick(pageNumber)}
                        className={`px-3 py-1 text-sm font-medium rounded ${
                            pageNumber === currentPage
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                        }`}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            {/* Next Page Button */}
            <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <AiOutlineRight />
            </button>

            {/* Last Page Button */}
            <button
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-medium text-gray-800 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <AiOutlineDoubleRight />
            </button>
        </div>
    );
};

export default Paginator;
