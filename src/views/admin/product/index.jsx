import ComplexTable from "../tables/components/ComplexTable";
import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { ProductValidationSchema } from "../../../utils/ValidationSchemas";
import { Dialog } from "@headlessui/react";
import SingleFileUploadComponent from "../../../components/fileupload/SingleFileUploadComponent";
import Paginator from "../../../components/paginator";
import { ProductService } from "../../../services/product/ProductService";
import SelectCategoryComponent from "../../../components/selectitem/SelectCategoryComponent";
import {FaEdit, FaTrash} from "react-icons/fa";

const Product = () => {
  const [productPage, setProductPage] = useState();
  const service = new ProductService();
  const [submitted, setSubmitted] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [categoryDialogVisible,setCategoryDialogVisible] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 13;
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">İSİM</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("description", {
      id: "description",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          AÇIKLAMA
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("slug", {
      id: "slug",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">SLUG</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("code", {
      id: "code",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">KOD</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("originalPrice", {
      id: "originalPrice",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">FİYAT</p>
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
    columnHelper.accessor("quantity", {
      id: "quantity",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          STOK MİKTARI
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("mainCategory", {
      id: "mainCategory",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          ANA KATEGORİ
        </p>
      ),
      cell: (info) => {
        const category = info.getValue();
        return (
            <p
                className={`inline-block text-sm font-bold text-navy-700 dark:text-white ${
                    category ? 'bg-green-400' : ''
                } p-1 rounded`}
            >
              {category ? category.name : ""}
            </p>
        );
      },

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
            className="flex cursor-pointer items-center justify-center rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
            onClick={() => {
              handleUpdate(info.row.original);
              setDialogVisible(true);
            }}
            aria-label="Güncelle"
          >
            <FaEdit size={24} /> {/* İkon Boyutu */}
          </button>
          <button
            className="flex cursor-pointer items-center justify-center rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
            onClick={() => handleDelete(info.row.original)}
            aria-label="Veriyi Sil"
          >
            <FaTrash size={24} /> {/* İkon Boyutu */}
          </button>
        </div>
      ),
    }),
  ];

  useEffect(() => {
    getItems(currentPage - 1);
  }, [currentPage]);

  useEffect(() => {
    if (productPage !== undefined) {
      setData(productPage.content);
      setTotalPages(productPage.totalPages);
    }
  }, [productPage]);

  const getItems = (pageNum) => {
    service.getAll({ pageNum, pageSize }).then((response) => {
      if (response.statusCode !== 200) {
        toast.error(response.description, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        setProductPage(response.data?.items);
      }
    });
  };

  const baseRequest = {
    name: "",
    description: "",
    slug: "",
    code: "",
    originalPrice: null,
    quantity: null,
    image: "",
    mainCategoryId: "",
  };

  const formik = useFormik({
    initialValues: baseRequest,
    validationSchema: ProductValidationSchema,
    onSubmit: (data) => {
      createOrUpdate(data).then((response) => {
        if (response.statusCode !== 200) {
          toast.error(response.description, {
            position: "top-center",
            autoClose: 3000,
          });
        } else {
          toast.success(response.description, {
            position: "top-center",
            autoClose: 3000,
          });
          hideDialog();
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      });
    },
  });

  const createOrUpdate = (data) => {
    if (data.id !== undefined) {
      console.log(data);
      return service.update(data);
    } else {
      return service.save(data);
    }
  };

  const handleUpdate = (product) => {
    console.log(product);
    formik.setValues(product);
    formik.setFieldValue("mainCategoryId", product.mainCategory.id);
  };
  const handleDelete = (product) => {
    console.log(product);
    service.delete(product.id).then((response) => {
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

  const hideDialog = () => {
    formik.resetForm();
    setDialogVisible(false);
    setSubmitted(false);
  };

  const header = () => {
    return (
      <div className="flex items-center justify-between py-4">
        <button
          className="rounded-lg bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          onClick={() => {
            setDialogVisible(true);
          }}
        >
          Yeni
        </button>
      </div>
    );
  };

  const handleCategorySelect = (categoryId) => {
    formik.setFieldValue("mainCategoryId", categoryId);
    setCategoryDialogVisible(false);
  };

  const handleUploadSuccess = (url) => {
    console.log("Yükleme başarılı! URL:", url);
    formik.setFieldValue("image", url);
  };

  return (
    <div>
      <ComplexTable
        columns={columns}
        header={header()}
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
      {/* Dialog Bileşeni */}
      <Dialog
        open={dialogVisible}
        onClose={hideDialog}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Panel className="z-20 h-full max-h-[80vh]  w-full max-w-lg overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              {formik.values.id ? "GÜNCELLE" : "EKLE"}
            </Dialog.Title>
            <form onSubmit={formik.handleSubmit} className="mt-4">
              <div className="mb-4">
                <label className="block py-2 text-gray-700">Fotoğraf</label>
                <SingleFileUploadComponent
                  onUploadSuccess={handleUploadSuccess}
                  image={formik.values.image}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Ana Kategori</label>
                <input
                  type="none"
                  name="mainCategoryId"
                  onChange={formik.handleChange}
                  value={formik.values.mainCategoryId}
                  className="w-full rounded-md border px-3 py-2"
                  onClick={() => {
                    setCategoryDialogVisible(true);
                  }}
                  readOnly
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">İsim</label>
                <input
                  type="text"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.name && submitted && (
                  <div className="text-red-500">{formik.errors.name}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Açıklama</label>
                <input
                  type="text"
                  name="description"
                  onChange={formik.handleChange}
                  value={formik.values.description}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.description && submitted && (
                  <div className="text-red-500">
                    {formik.errors.description}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Slug</label>
                <input
                  type="text"
                  name="slug"
                  onChange={formik.handleChange}
                  value={formik.values.slug}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.slug && submitted && (
                  <div className="text-red-500">{formik.errors.slug}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Kod</label>
                <input
                  type="text"
                  name="code"
                  onChange={formik.handleChange}
                  value={formik.values.code}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.code && submitted && (
                  <div className="text-red-500">{formik.errors.code}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Adet</label>
                <input
                  type="number"
                  name="quantity"
                  onChange={formik.handleChange}
                  value={formik.values.quantity}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.quantity && submitted && (
                  <div className="text-red-500">{formik.errors.quantity}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fiyat</label>
                <input
                  type="number"
                  name="originalPrice"
                  onChange={formik.handleChange}
                  value={formik.values.originalPrice}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.originalPrice && submitted && (
                  <div className="text-red-500">
                    {formik.errors.originalPrice}
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={hideDialog}
                  className="mr-2 rounded-md bg-red-500 px-4 py-2 font-bold text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                  onClick={() => setSubmitted(true)}
                >
                  Kaydet
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Ana kategori seçimi için Dialog */}
      <Dialog
        open={categoryDialogVisible}
        onClose={() => setCategoryDialogVisible(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex min-h-screen items-center justify-center">
          <Dialog.Panel className="z-20 w-1/3 rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
            <Dialog.Title
              as="h3"
              className="text-lg font-medium leading-6 text-gray-900"
            >
              Kategoriler
            </Dialog.Title>
            <SelectCategoryComponent
              handleSelect={handleCategorySelect}
              selectionMode="single"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setCategoryDialogVisible(false)}
                className="rounded-md bg-red-500 px-4 py-2 font-bold text-white"
              >
                Kapat
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
export default Product;
