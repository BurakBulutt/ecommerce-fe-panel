import * as Yup from "yup";

export const LoginRequestSchema = Yup.object({
  username: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  password: Yup.string().required("Bu Alan Boş Bırakılamaz"),
});

export const UserValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  username: Yup.string().required("Username is required"),
  email : Yup.string().email("Should be Mail Format"),
  password: Yup.string()
    .min(5, "Password must be at least 5 characters")
    .required("Password is required")
});

export const CategoryValidationSchema = Yup.object({
  name: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  description: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  slug: Yup.string().required("Bu Alan Boş Bırakılamaz"),
});

export const ProductValidationSchema = Yup.object({
  name: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  description: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  slug: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  code: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  originalPrice: Yup.number().required("Bu Alan Boş Bırakılamaz")
      .typeError("Geçersiz Veri Tipi"),
  quantity: Yup.number().required("Bu Alan Boş Bırakılamaz")
      .typeError("Geçersiz Veri Tipi"),
  mainCategoryId: Yup.string().required("Bu Alan Boş Bırakılamaz"),
});

export const CampaignValidationSchema = Yup.object({
  name: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  description: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  campaignScope: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  priceEffect: Yup.string().required("Bu Alan Boş Bırakılamaz"),
  expirationDate: Yup.date().required("Bu Alan Boş Bırakılamaz")
      .typeError("Geçersiz Veri Tipi"),
  discount: Yup.number().required("Bu Alan Boş Bırakılamaz"),
  priority: Yup.number().required("Bu Alan Boş Bırakılamaz"),
  isActive: Yup.bool().required("Bu Alan Boş Bırakılamaz"),
});
