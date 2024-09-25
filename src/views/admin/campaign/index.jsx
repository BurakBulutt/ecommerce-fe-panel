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
import {FaBell, FaEdit, FaTrash} from "react-icons/fa";

const Campaign = () => {
  const [categoryPage, setCategoryPage] = useState();
  const service = new CampaignService();
  const [submitted, setSubmitted] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [targetsDialogVisible, setTargetsDialogVisible] = useState(false);
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
    columnHelper.accessor("campaignScope", {
      id: "campaignScope",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          KAPSAM
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {
            campaignScopeOptions.find(
              (option) => option.value === info.getValue()
            )?.label
          }
        </p>
      ),
    }),
    columnHelper.accessor("priceEffect", {
      id: "priceEffect",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          İNDİRİM FİYATI
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {
            priceEffectOptions.find(
              (option) => option.value === info.getValue()
            )?.label
          }
        </p>
      ),
    }),
    columnHelper.accessor("expirationDate", {
      id: "expirationDate",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          GEÇERLİLİK SÜRESİ
        </p>
      ),
      cell: (info) => {
        const dateValue = new Date(info.getValue());

        const formattedDate = dateValue.toLocaleString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {formattedDate}
          </p>
        );
      },
    }),
    columnHelper.accessor("discount", {
      id: "discount",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          İNDİRİM ORANI
        </p>
      ),
      cell: (info) => (
        <p className="text-sm font-bold text-navy-700 dark:text-white">
          {info.getValue()}
        </p>
      ),
    }),
    columnHelper.accessor("priority", {
      id: "priority",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          ÖNCELİK
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
        <p className="text-sm font-bold text-gray-600 dark:text-white">AKTİF</p>
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
          <button
            className="flex cursor-pointer items-center justify-center rounded-lg bg-green-400 p-2 text-white hover:bg-green-500"
            onClick={() => handleNotify(info.row.original)}
            aria-label="Kampanya Bildirimi Gönder"
          >
            <FaBell size={24} /> {/* İkon Boyutu */}
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
    campaignScope: "PRODUCT",
    priceEffect: "PRICE",
    expirationDate: null,
    targets: [],
    discount: null,
    priority: null,
    isActive: false,
  };

  const formik = useFormik({
    initialValues: baseRequest,
    validationSchema: CampaignValidationSchema,
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

  const handleUpdate = (campaign) => {
    console.log(campaign);
    formik.setValues(campaign);
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

  const handleNotify = (campaign) => {
    console.log(campaign);
    service.campaignNotify(campaign.id).then((response) => {
      if (response.statusCode === 200) {
        toast.success(response.description, {
          position: "top-center",
          autoClose: 3000,
        });
      } else if (response.statusCode === 500) {
        toast.error(response.description, {
          position: "top-center",
          autoClose: 3000,
        });
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

  const campaignScopeOptions = [
    {
      label: "Ürün İndirim",
      value: "PRODUCT",
    },
    {
      label: "Kategori İndirim",
      value: "CATEGORY",
    },
  ];

  const priceEffectOptions = [
    {
      label: "Fiyat İndirim",
      value: "PRICE",
    },
    {
      label: "Yüzdelik İndirim",
      value: "PERCENTAGE",
    },
  ];

  const handleTargetSelect = (targets) => {
    const existingTargets = formik.values.targets || [];
    const targetsToAdd = targets.filter(
      (target) => !existingTargets.includes(target)
    );
    if (targetsToAdd.length > 0) {
      const updatedTargets = [...existingTargets, ...targetsToAdd];
      formik.setFieldValue("targets", updatedTargets);
    }
    const alreadyExistingTargets = targets.filter((target) =>
      existingTargets.includes(target)
    );
    if (alreadyExistingTargets.length > 0) {
      toast.info("Targetlar Zaten Mevcut -> Liste Güncellendi", {
        position: "top-center",
        autoClose: 3000,
      });
    }
    setTargetsDialogVisible(false);
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
                <label className="block text-gray-700">Kapsam</label>
                <ReactDropdown
                  options={campaignScopeOptions}
                  value={formik.values.campaignScope}
                  placeholder="Kapsam Seçiniz"
                  onChange={(option) =>
                    formik.setFieldValue("campaignScope", option.value)
                  }
                />
                {formik.errors.campaignScope && submitted && (
                  <div className="text-red-500">
                    {formik.errors.campaignScope}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Etkilenecekler</label>
                <button
                  type="button"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 font-bold text-white shadow-lg hover:bg-green-600"
                  onClick={() => {
                    setTargetsDialogVisible(true);
                  }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4v16m8-8H4"
                    ></path>
                  </svg>
                </button>

                <div className="relative mt-4">
                  <div
                    className={`overflow-auto ${
                      formik.values.targets.length > 3 ? "max-h-48" : ""
                    }`}
                  >
                    {formik.values?.targets?.map((target, index) => (
                      <div
                        key={index}
                        className="mb-2 flex items-center justify-between rounded-lg bg-gray-100 p-2"
                      >
                        <span>{target}</span>
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => {
                            const updatedTargets = formik.values.targets.filter(
                              (_, i) => i !== index
                            );
                            formik.setFieldValue("targets", updatedTargets);
                            console.log(formik.values);
                          }}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Overlay for scrolling effect when targets > 3 */}
                  {formik.values.targets.length > 3 && (
                    <div className="pointer-events-none absolute inset-0 bg-white opacity-50"></div>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Fiyat Etkisi</label>
                <ReactDropdown
                  options={priceEffectOptions}
                  value={formik.values.priceEffect}
                  placeholder="Fiyat Etkisi Seçiniz"
                  onChange={(option) =>
                    formik.setFieldValue("priceEffect", option.value)
                  }
                />
                {formik.errors.priceEffect && submitted && (
                  <div className="text-red-500">
                    {formik.errors.priceEffect}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">İndirim</label>
                <input
                  type="number"
                  name="discount"
                  onChange={formik.handleChange}
                  value={formik.values.discount}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.discount && submitted && (
                  <div className="text-red-500">{formik.errors.discount}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Geçerlilik Süresi</label>
                <input
                  type="date"
                  name="expirationDate"
                  onChange={formik.handleChange}
                  value={formik.values.expirationDate}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.expirationDate && submitted && (
                  <div className="text-red-500">
                    {formik.errors.expirationDate}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Öncelik</label>
                <input
                  type="number"
                  name="priority"
                  onChange={formik.handleChange}
                  value={formik.values.priority}
                  className="w-full rounded-md border px-3 py-2"
                />
                {formik.errors.priority && submitted && (
                  <div className="text-red-500">{formik.errors.priority}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Aktif</label>
                <ReactSwitch
                  defaultChecked={false}
                  checked={formik.values.isActive}
                  onChange={(checked) =>
                    formik.setFieldValue("isActive", checked)
                  }
                  offColor="#d1d5db"
                  onColor="#4ade80"
                  handleDiameter={20}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  className="mr-2"
                />
                {formik.errors.isActive && submitted && (
                  <div className="text-red-500">{formik.errors.isActive}</div>
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
        open={targetsDialogVisible}
        onClose={() => setTargetsDialogVisible(false)}
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
            {formik.values.campaignScope === "PRODUCT" ? (
              <SelectProductComponent
                handleSelect={handleTargetSelect}
                selectionMode="multiple"
              />
            ) : formik.values.campaignScope === "CATEGORY" ? (
              <SelectCategoryComponent
                handleSelect={handleTargetSelect}
                selectionMode="multiple"
              />
            ) : (
              <></>
            )}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setTargetsDialogVisible(false)}
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
export default Campaign;
