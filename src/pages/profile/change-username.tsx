// react
import { useApi } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { setUser } from "../../redux/userSlice";

// external
import { Formik, FormikValues } from "formik";
import { toastConfig } from "../../constants/constants";
import { toast } from "react-toastify";

// local
import { RequestStatus } from "../../api/django";
import BackButton from "../../components/BackButton";
import { changeUsernameSchema } from "../../constants/yupSchemas";
import { FormInput } from "../../components/FormInput";
import { ChangeUserNameFormData } from "../../constants/formData";
import { User } from "../../api/interfaces";

function ChangeUsername() {
  const django = useApi();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = (
    values: ChangeUserNameFormData,
    { resetForm }: FormikValues
  ) => {
    const toastId = toast.loading("submitting form..", toastConfig);
    django.changeProfileInfo(values).then((response) => {
      if (response.status === RequestStatus.Success) {
        toast.update(toastId, {
          render: "Username Successfully Changed!",
          type: "success",
          isLoading: false,
        });
        const newUser = response.data as User;
        dispatch(setUser(newUser));
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
      <h2 className="text-2xl text-center my-5">Change Your Username</h2>

      <div className="w-full md:w-3/4 md:p-10 md:rounded-xl md:border mx-auto">
        <Formik
          initialValues={{
            username: "",
          }}
          validationSchema={changeUsernameSchema}
          onSubmit={handleSubmit}
        >
          {({ values, touched, errors, handleChange, handleSubmit }) => (
            <form className="flex flex-col md:w" onSubmit={handleSubmit}>
              <FormInput
                id="username"
                type="text"
                label="What is your new username?"
                showError={!!errors.username && !!touched.username}
                errorMessage={errors.username}
                placeholder=""
                onChange={handleChange}
                value={values.username}
              />
              <button type="submit" className="button my-5 px-20 mx-auto">
                Change Username
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ChangeUsername;
