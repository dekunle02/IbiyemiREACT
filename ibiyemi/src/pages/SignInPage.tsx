import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../redux/hooks";
import { setUserAndToken } from "../redux/userSlice";

import { Formik } from "formik";
import { signInSchema } from "../constants/yupSchemas";
import { toastConfig } from "../constants/constants";
import { SignInFormData } from "../constants/formData";
import { toast } from "react-toastify";
import { FormInput } from "../components/FormInput";

import companyLogo from "../assets/images/company_logo.png";
import getDjango, { DjangoClient, RequestStatus } from "../api/django";

function SignInPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (values: SignInFormData) => {
    const django: DjangoClient = getDjango();
    const toastId = toast.loading("Signing in..", toastConfig);
    django.signIn(values).then((response) => {
      if (response.status === RequestStatus.Success) {
        toast.dismiss(toastId);
        const { user, token } = response.data;
        dispatch(setUserAndToken({ user: user, token: token }));
        navigate("/", { replace: true });
      } else {
        toast.update(toastId, {
          render: "Error Signing in...",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    });
  };

  return (
    <div className="w-screen h-screen flex flex-col pt-20">
      {/* SIGN IN FORM */}
      <div className="flex-col p-2 w-full rounded-2xl md:mx-auto md:border md:max-w-2xl md:p-10 md:my-5">
        <img src={companyLogo} alt="company" className="mx-auto" />
        <div className="m-3 md:mx-0 ">
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={signInSchema}
            onSubmit={handleSubmit}
          >
            {({ values, touched, errors, handleChange, handleSubmit }) => (
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <FormInput
                  id="username"
                  type="text"
                  label="Username"
                  showError={!!errors.username && !!touched.username}
                  errorMessage={errors.username}
                  isRequired
                  placeholder="Type your username"
                  onChange={handleChange}
                  value={values.username}
                />
                <FormInput
                  id="password"
                  type="password"
                  label="Password"
                  isRequired
                  showError={!!errors.password && !!touched.password}
                  errorMessage={errors.password}
                  placeholder="**********"
                  onChange={handleChange}
                  value={values.password}
                />

                <button type="submit" className="button my-5 px-14 mx-auto">
                  Continue
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
export default SignInPage;
