import ComplexTable from "../../views/admin/tables/components/ComplexTable";
import React, { useEffect, useState } from "react";
import Paginator from "../paginator";
import { toast } from "react-toastify";
import { createColumnHelper } from "@tanstack/react-table";
import {ProductService} from "../../services/product/ProductService";

const SelectProductComponent = (props) => {
  const columnHelper = createColumnHelper();
  const service = new ProductService();
  const [page, setPage] = useState();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;
  const [totalPages, setTotalPages] = useState(1);

  const [selectedProducts, setSelectedCProducts] = useState([]);

  useEffect(() => {
    getItems(currentPage - 1);
  }, [currentPage]);

  useEffect(() => {
    if (page !== undefined) {
      setData(page.content);
      setTotalPages(page.totalPages);
    }
  }, [page]);

  const getItems = (pageNum) => {
    service.getAll({ pageNum, pageSize }).then((response) => {
      if (response.statusCode !== 200) {
        toast.error(response.description, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        setPage(response.data?.items);
      }
    });
  };

  const handleSelection = (value) => {
    if (selectedProducts?.includes(value)) {
      setSelectedCProducts(selectedProducts?.filter((id) => id !== value));
    } else {
      setSelectedCProducts([...selectedProducts, value]);
    }
  };

  const isSelected = (value) => {
    return selectedProducts?.includes(value);
  };

  return (
    <>
      {props.selectionMode === "multiple" && (
        <div className="mb-4 flex items-center justify-center">
          <button
            className="rounded bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
            onClick={() => props.handleSelect(selectedProducts)}
          >
            Ürünleri Ekle
          </button>
        </div>
      )}
      <ComplexTable
        columns={
          props.selectionMode === "multiple"
            ? [
                columnHelper.accessor("name", {
                  header: () => <p className="px-4">İsim</p>,
                  cell: (info) => (
                    <div className="flex items-center space-x-2 cursor-pointer text-gray-700 transition-transform hover:scale-100 hover:bg-gray-100"
                    onClick={()=>handleSelection(info.row.original.id)}>
                      <input
                        type="checkbox"
                        checked={isSelected(info.row.original.id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <p className="px-4 py-1">{info.getValue()}</p>
                    </div>
                  ),
                }),
              ]
            : props.selectionMode === "single"
            ? [
                columnHelper.accessor("name", {
                  header: () => <p className="px-4">İsim</p>,
                  cell: (info) => (
                    <p
                      className="transform cursor-pointer rounded px-4 py-1 text-gray-700 transition-transform hover:scale-100 hover:bg-gray-100"
                      onClick={() => props.handleSelect(info.row.original.id)}
                    >
                      {info.getValue()}
                    </p>
                  ),
                }),
              ]
            : []
        }
        tableData={data}
        endRow={pageSize}
      />
      <div className="mt-4">
        <Paginator
          totalPages={totalPages ? totalPages : 1}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};
export default SelectProductComponent;
