import InputField from "components/fields/InputField";
import { FcGoogle } from "react-icons/fc";
import { AuthService } from "../../services/auth/AuthService";
import {useEffect, useState} from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { LoginRequestSchema } from "../../utils/ValidationSchemas";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function SignIn() {
  const navigator = useNavigate();
  const service = new AuthService();
  const [submitted, setSubmitted] = useState(false);
  const baseRequest = {
    username: "",
    password: "",
  };

  useEffect(() => {
    Cookies.remove("token");
  }, []);

  const formik = useFormik({
    initialValues: baseRequest,
    validationSchema: LoginRequestSchema,
    onSubmit: (data) => {
      service.login(data).then((response) => {
        if (response.statusCode === 200) {
          const token = response.data.token;
          Cookies.set("token", `Bearer ${token}`);
          navigator("/", { replace: true });
          setSubmitted(false);
          console.log("Giriş Yapılmalı")
        } else if (response.statusCode === 1002 || 1000) {
          Cookies.remove("token");
          toast.error(response.description, {
            position: "top-center",
            autoClose: 3000,
          });
        }
      });
    },
  });

  const handleSubmit = () => {
    console.log(formik.values);
    setSubmitted(true);
    formik.handleSubmit();
  };

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Giriş Yap
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Mail ve şifreni kullanarak giriş yap!
        </p>
        <div className="mb-6 flex h-[50px] w-full items-center justify-center gap-2 rounded-xl bg-lightPrimary hover:cursor-pointer dark:bg-navy-800">
          <div className="rounded-full text-xl">
            <FcGoogle />
          </div>
          <h5 className="text-sm font-medium text-navy-700 dark:text-white">
            Google Hesabıyla Giriş Yap
          </h5>
        </div>
        <div className="mb-6 flex items-center  gap-3">
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
          <p className="text-base text-gray-600 dark:text-white"> or </p>
          <div className="h-px w-full bg-gray-200 dark:bg-navy-700" />
        </div>
        {/* Email */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Email"
          placeholder="mail@ornek.com"
          id="email"
          type="text"
          onChange={(e) => formik.setFieldValue("username", e.target.value)}
          onBlur={formik.handleBlur}
        />
        {submitted && formik.touched.username && formik.errors.username && (
          <p className="text-xs italic text-red-500">
            {formik.errors.username}
          </p>
        )}

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="Şifre"
          placeholder="Min 8 karakter"
          id="password"
          type="password"
          onChange={(e) => formik.setFieldValue("password", e.target.value)}
          onBlur={formik.handleBlur}
        />
        {submitted && formik.touched.password && formik.errors.password && (
          <p className="text-xs italic text-red-500">
            {formik.errors.password}
          </p>
        )}

        <button
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          onClick={() => handleSubmit()}
          type="submit"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
}
