import ComplexTable from "../tables/components/ComplexTable";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { CampaignValidationSchema } from "../../../utils/ValidationSchemas";
import { Dialog } from "@headlessui/react";
import Paginator from "../../../components/paginator";
import SelectCategoryComponent from "../../../components/selectitem/SelectCategoryComponent";
import { CampaignService } from "../../../services/campaign/CampaignService";
import ReactDropdown from "react-dropdown";
import ReactSwitch from "react-switch";
import SelectProductComponent from "../../../components/selectitem/SelectProductComponent";
import {FaAnchor, FaBell, FaEdit, FaTrash} from "react-icons/fa";
import {OrderService} from "../../../services/order/OrderService";

const Order = () => {
  const [orderPage, setOrderPage] = useState();
  const service = new OrderService();
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 13;
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("code", {
      id: "code",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">SİPARİŞ KODU</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("billingAddress", {
      id: "billingAddress",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          FATURA ADRESİ
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white overflow-wrap break-words">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("deliveryAddress", {
      id: "deliveryAddress",
      header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            TESLİMAT ADRESİ
          </p>
      ),
      cell: (info) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white overflow-wrap break-words">
            {info.getValue()}
          </p>
      ),
    }),
    columnHelper.accessor("user", {
      id: "user",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          ALICI
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue().username}
        </p>
      ),
    }),
    columnHelper.accessor("amount", {
      id: "amount",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          ÜCRET
        </p>
      ),
      cell: (info) => {
        const price = info.getValue();
        const formattedPrice = new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
        }).format(price);

        return (
            <p className="text-sm font-bold text-navy-700 dark:text-white">
              {formattedPrice}
            </p>
        );
      },
    }),
    columnHelper.accessor("status", {
      id: "status",
      header: () => (
          <p className="text-sm font-bold text-gray-600 dark:text-white">
            SİPARİŞ DURUMU
          </p>
      ),
      cell: (info) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {statusOptions.find(option => option.value === info.getValue()).label}
          </p>
      ),
    }),
    columnHelper.accessor("actionBody", {
      id: "actionBody",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white" />
      ),
      cell: (info) => (
        <div className="flex space-x-2">
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
          <button
            className="flex cursor-pointer items-center justify-center rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
            onClick={() => handleDelete(info.row.original)}
            aria-label="Veriyi Sil"
          >
            <FaTrash size={24} /> {/* İkon Boyutu */}
          </button>
          <button
            className="flex cursor-pointer items-center justify-center rounded-lg bg-gray-200 p-2 text-white hover:bg-gray-300"
            onClick={() => handleDetail(info.row.original)}
            aria-label="Sipariş İçeriği"
          >
            <FaEdit size={24} /> {/* İkon Boyutu */}
          </button>
        </div>
      ),
    }),
  ];

  const statusOptions = [
    {
      label : "Sipariş Alındı",
      value : "SIPARIS_ALINDI"
    },
    {
      label : "Sipariş Hazırlanıyor",
      value : "HAZIRLANIYOR"
    },
    {
      label : "Sipariş Kargoya Verildi",
      value : "KARGOYA_VERILDI"
    },
    {
      label : "Teslim Edildi",
      value : "TESLIM_EDILDI"
    }
  ]

  useEffect(() => {
    getItems(currentPage - 1);
  }, [currentPage]);

  useEffect(() => {
    if (orderPage !== undefined) {
      setData(orderPage.content);
      setTotalPages(orderPage.totalPages);
    }
  }, [orderPage]);

  const getItems = (pageNum) => {
    service.getAll({ pageNum, pageSize }).then((response) => {
      if (response.statusCode !== 200) {
        toast.error(response.description, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        setOrderPage(response.data?.items);
      }
    });
  };

  const handleDelete = (campaign) => {
    console.log(campaign);
    service.delete(campaign.id).then((response) => {
      if (response.statusCode !== 200) {
        toast.error(response.description, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.success(response.description, {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    });
  };

  const handleDetail = (campaign) => {
    console.log(campaign);
  };

  return (
    <div>
      <ComplexTable
        columns={columns}
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
    </div>
  );
};
export default Order;
