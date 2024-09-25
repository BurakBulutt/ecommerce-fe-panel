import ComplexTable from "../tables/components/ComplexTable";
import { MdCancel, MdCheckCircle } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { UserService } from "../../../services/user/UserService";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { UserValidationSchema } from "../../../utils/ValidationSchemas";
import { Dialog } from "@headlessui/react";
import Paginator from "../../../components/paginator";
import {FaEdit, FaTrash} from "react-icons/fa";

const User = () => {
  const [userPage, setUserPage] = useState();
  const service = new UserService();
  const [submitted, setSubmitted] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [passwordIsMatch,setPasswordIsMatch] = useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">AD</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("surname", {
      id: "surname",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">SOYAD</p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("username", {
      id: "username",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          KULLANICI ADI
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("email", {
      id: "email",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          E-MAIL
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("userType", {
      id: "userType",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          KULLANICI TIPI
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("isActive", {
      id: "isActive",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          AKTIFLIK
        </p>
      ),
      cell: (info) => {
        const value = Boolean(info.getValue());

        if (value === false) {
          return (
            <div className="flex items-center">
              <MdCancel className="me-1 text-red-500 dark:text-red-300" />
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                HAYIR
              </p>
            </div>
          );
        }

        if (value === true) {
          return (
            <div className="flex items-center">
              <MdCheckCircle className="me-1 text-green-500 dark:text-green-300" />
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                EVET
              </p>
            </div>
          );
        }

        return null;
      },
    }),
    columnHelper.accessor("isVerified", {
      id: "isVerified",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          ONAY DURUMU
        </p>
      ),
      cell: (info) => {
        const value = Boolean(info.getValue());

        if (!value) {
          return (
            <div className="flex items-center">
              <MdCancel className="me-1 text-red-500 dark:text-red-300" />
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                HAYIR
              </p>
            </div>
          );
        }

        if (value) {
          return (
            <div className="flex items-center">
              <MdCheckCircle className="me-1 text-green-500 dark:text-green-300" />
              <p className="text-sm font-bold text-navy-700 dark:text-white">
                EVET
              </p>
            </div>
          );
        }
        return null;
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

  const getItems = (pageNum) => {
    service.getAll({ pageNum }).then((response) => {
      if (response.statusCode !== 200) {
        toast.error(response.description, {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        setUserPage(response.data?.items);
      }
    });
  };

  useEffect(() => {
    if (userPage !== undefined) {
      setData(userPage.content);
      setTotalPages(userPage.totalPages);
    }
  }, [userPage]);

  const baseRequest = {
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    passwordRe: "",
  };

  const formik = useFormik({
    initialValues: baseRequest,
    validationSchema: UserValidationSchema,
    onSubmit: (data) => {
      setSubmitted(true);
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

  const handleUpdate = (user) => {
    formik.resetForm();
    formik.setValues(user);
  };

  const handleSubmitFormik = () => {
    console.log(formik.values);
    formik.handleSubmit();
  };

  const handleDelete = (user) => {
    service.delete(user.id).then((response) => {
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

  const validatePass = (val) => {
    if (val === formik.values.password){
      setPasswordIsMatch(true);
    }else {
      setPasswordIsMatch(false);
    }
  }

  return (
    <div>
      <ComplexTable columns={columns} header={header()} tableData={data} />
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
              Kullanıcı
            </Dialog.Title>
            <div className="mb-4">
              <label className="block text-gray-700">Ad</label>
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
              <label className="block text-gray-700">Soyad</label>
              <input
                type="text"
                name="surname"
                onChange={formik.handleChange}
                value={formik.values.surname}
                className="w-full rounded-md border px-3 py-2"
              />
              {formik.errors.surname && submitted && (
                <div className="text-red-500">{formik.errors.surname}</div>
              )}
            </div>
            {!formik.values?.id && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700">Kullanıcı Adı</label>
                  <input
                    type="text"
                    name="username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    className="w-full rounded-md border px-3 py-2"
                  />
                  {formik.errors.username && submitted && (
                    <div className="text-red-500">{formik.errors.username}</div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Şifre</label>
                  <input
                    type="password"
                    name="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    className="w-full rounded-md border px-3 py-2"
                  />
                  {formik.errors.password && submitted && (
                    <div className="text-red-500">{formik.errors.password}</div>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Şifre Tekrar</label>
                  <input
                    type="password"
                    name="passwordRe"
                    onChange={(e)=> {
                      if (!formik.values.id){
                        formik.setFieldValue("passwordRe",e.target.value);
                        validatePass(e.target.value);
                      }
                    }}
                    value={formik.values.passwordRe}
                    className="w-full rounded-md border px-3 py-2"
                  />
                  {!passwordIsMatch && (
                      <div className="text-red-500">{formik.errors.email}</div>
                  )}
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full rounded-md border px-3 py-2"
              />
              {formik.errors.email && submitted && (
                <div className="text-red-500">{formik.errors.email}</div>
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
                type="button"
                className="cursor-pointer rounded-md bg-green-500 px-4 py-2 font-bold text-white"
                onClick={() => handleSubmitFormik()}
              >
                Kaydet
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
};
export default User;
