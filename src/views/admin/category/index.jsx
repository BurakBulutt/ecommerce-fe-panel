import ComplexTable from "../tables/components/ComplexTable";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { UserService } from "../../../services/user/UserService";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {
  CategoryValidationSchema,
  UserValidationSchema,
} from "../../../utils/ValidationSchemas";
import { Dialog } from "@headlessui/react";
import SingleFileUploadComponent from "../../../components/fileupload/SingleFileUploadComponent";
import { CategoryService } from "../../../services/category/CategoryService";
import Paginator from "../../../components/paginator";
import SelectCategoryComponent from "../../../components/selectitem/SelectCategoryComponent";
import {FaEdit, FaTrash} from "react-icons/fa";

const Category = () => {
  const [categoryPage, setCategoryPage] = useState();
  const service = new CategoryService();
  const [submitted,setSubmitted] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [parentDialogVisible, setParentDialogVisible] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 13;
  const [data,setData] = useState([])
  const [totalPages,setTotalPages] = useState(1);
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
    if (categoryPage !== undefined) {
      setData(categoryPage.content);
      setTotalPages(categoryPage.totalPages);
    }
  }, [categoryPage]);

  const getItems = (pageNum) => {
    service.getAll({ pageNum, pageSize }).then((response) => {
      if (response.statusCode !== 200) {
        toast.error(response.description, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        setCategoryPage(response.data?.items);
      }
    });
  };

  const baseRequest = {
    name: "",
    description: "",
    slug: "",
    parentId: "",
  };

  const formik = useFormik({
    initialValues: baseRequest,
    validationSchema: CategoryValidationSchema,
    onSubmit: (data) => {
      setSubmitted(true);
      createOrUpdate(data)
        .then((response) => {
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
        })
        .catch((error) => {
          toast.error(error.statusCode, {
            position: "top-center",
            autoClose: 3000,
          });
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

  const handleUpdate = (category) => {
    console.log(category);
    formik.setValues(category);
  };
  const handleDelete = (category) => {
    console.log(category);
    service.delete(category.id).then((response) => {
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

  const handleUploadSuccess = (url) => {
    console.log("Yükleme başarılı! URL:", url);
  };

  const handleCategorySelect = (categoryId) => {
    formik.setFieldValue("parentId", categoryId);
    setParentDialogVisible(false);
  };

  return (
      <div>
        <ComplexTable columns={columns} header={header()} tableData={data} endRow={pageSize}/>
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
                  <label className="block text-gray-700">Parent Kategori</label>
                  <input
                      type="none"
                      name="parentId"
                      onChange={formik.handleChange}
                      value={formik.values.parentId}
                      className="w-full rounded-md border px-3 py-2"
                      onClick={() => {
                        setParentDialogVisible(true)
                      }}
                      readOnly
                  />
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
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>

        {/* Parent kategori seçimi için Dialog */}
        <Dialog
            open={parentDialogVisible}
            onClose={() => setParentDialogVisible(false)}
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
              <SelectCategoryComponent handleSelect={handleCategorySelect} selectionMode="single"/>
              <div className="flex justify-end mt-4">
                <button
                    onClick={() => setParentDialogVisible(false)}
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
export default Category;
