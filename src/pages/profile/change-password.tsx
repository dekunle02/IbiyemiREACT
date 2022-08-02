// react
import { useApi } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// external
import { Formik, FormikValues } from "formik";
import { toastConfig } from "../../constants/constants";
import { toast } from "react-toastify";

// local
import { RequestStatus } from "../../api/django";
import BackButton from "../../components/BackButton";
import { changePasswordSchema } from "../../constants/yupSchemas";
import { FormInput } from "../../components/FormInput";
import { ChangePasswordFormData } from "../../constants/formData";

function ChangePassword() {
  const django = useApi();
  const navigate = useNavigate();

  const handleSubmit = (
    values: ChangePasswordFormData,
    { resetForm }: FormikValues
  ) => {
    const toastId = toast.loading("submitting form..", toastConfig);
    django.changeProfileInfo(values).then((response) => {
      if (response.status === RequestStatus.Success) {
        toast.update(toastId, {
          render: "Password Successfully Changed!",
          type: "success",
          isLoading: false,
        });
        resetForm();
        navigate(-1);
      } else {
        toast.update(toastId, {
          render: "Error. " + response.data.message,
          type: "error",
          isLoading: false,
        });
      }
    });
  };

  return (
    <div className="w-full p-5 relative">
      <BackButton />
      <h2 className="text-2xl text-center my-5">Change Your Password</h2>

      <div className="w-full md:w-3/4 md:p-10 md:rounded-xl md:border mx-auto">
        <Formik
          initialValues={{
            old_password: "",
            password: "",
            confirm_password: "",
          }}
          validationSchema={changePasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ values, touched, errors, handleChange, handleSubmit }) => (
            <form className="flex flex-col md:w" onSubmit={handleSubmit}>
              <FormInput
                id="old_password"
                type="password"
                label="Current Password"
                showError={!!errors.old_password && !!touched.old_password}
                errorMessage={errors.old_password}
                placeholder=""
                onChange={handleChange}
                value={values.old_password}
              />
              <FormInput
                id="password"
                type="password"
                label="New Password"
                showError={!!errors.password && !!touched.password}
                errorMessage={errors.password}
                placeholder=""
                onChange={handleChange}
                value={values.password}
              />
              <FormInput
                id="confirm_password"
                type="password"
                label="Confirm Password"
                showError={
                  !!errors.confirm_password && !!touched.confirm_password
                }
                errorMessage={errors.confirm_password}
                placeholder=""
                onChange={handleChange}
                value={values.confirm_password}
              />

              <button type="submit" className="button my-5 px-20 mx-auto">
                Change Password
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ChangePassword;
