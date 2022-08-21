import { useNavigate } from "react-router-dom";
import { useApi } from "../../../context/AuthContext";
import { Formik } from "formik";
import { categorySchema } from "../../../constants/yupSchemas";
import { toastConfig } from "../../../constants/constants";
import { toast } from "react-toastify";
import { CategoryFormData } from "../../../constants/formData";
import { FormInput } from "../../../components/FormInput";
import { DjangoClient, RequestStatus } from "../../../api/django";
import BackButton from "../../../components/BackButton";
import { MdAdd } from "react-icons/md";

function CategoryNew() {
  const navigate = useNavigate();
  const django: DjangoClient = useApi();

  const handleSubmit = (values: CategoryFormData) => {
    const toastId = toast.loading("Adding new category..", toastConfig);
    django.addCategory(values).then((response) => {
      if (response.status === RequestStatus.Success) {
        toast.update(toastId, {
          render: "New Category Added!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        navigate(-1);
      } else {
        toast.update(toastId, {
          render: "Error adding category..",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    });
  };

  return (
    <div>
      <div className="flex flex-row flex-wrap gap-2 relative items-center">
        <BackButton relative />
        <MdAdd className="font-semibold text-3xl text-colorBlack/80" />
        <h1 className="font-semibold text-3xl text-colorBlack/80 flex-grow">
          Add a Category
        </h1>
      </div>

      <div className="flex-col p-2 w-full rounded-2xl md:mx-auto md:border md:max-w-2xl md:p-10 md:my-5">
        <Formik
          initialValues={{
            name: "",
            description: "",
          }}
          validationSchema={categorySchema}
          onSubmit={handleSubmit}
        >
          {({ values, touched, errors, handleChange, handleSubmit }) => (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <FormInput
                id="name"
                type="text"
                label="Name"
                showError={!!errors.name && !!touched.name}
                errorMessage={errors.name}
                isRequired
                placeholder="Name of category"
                onChange={handleChange}
                value={values.name}
              />
              <FormInput
                id="description"
                type="textarea"
                label="Description"
                showError={!!errors.description && !!touched.description}
                errorMessage={errors.description}
                placeholder=""
                onChange={handleChange}
                value={values.description}
              />

              <button type="submit" className="button my-5 px-14 mx-auto">
                Add
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
export default CategoryNew;
