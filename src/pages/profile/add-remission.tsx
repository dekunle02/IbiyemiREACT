// react
import { FormEvent, useState } from "react";
import { useApi } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// external
import { Formik, FormikValues } from "formik";
import { addRemissionSchema } from "../../constants/yupSchemas";
import { toastConfig } from "../../constants/constants";
import { toast } from "react-toastify";

//local
import { commaSeparateNumber } from "../../helpers/format-helpers";
import { FormInput } from "../../components/FormInput";
import { RequestStatus } from "../../api/django";
import BackButton from "../../components/BackButton";
import { RemissionFormData } from "../../constants/formData";

function AddRemission() {
  const django = useApi();
  const navigate = useNavigate();
  const [rawAmount, setRawAmount] = useState(0);
  const [amount, setAmount] = useState<string>("0");

  const handleSubmit = (
    values: RemissionFormData,
    { resetForm }: FormikValues
  ) => {
    const toastId = toast.loading("submitting form..", toastConfig);
    values.amount = rawAmount;
    django.addRemission(values).then((response) => {
      if (response.status === RequestStatus.Success) {
        toast.update(toastId, {
          render: "Remission Requested!",
          type: "success",
          isLoading: false,
        });
        resetForm();
        navigate(-1);
      } else {
        toast.update(toastId, {
          render: "Error submitting request",
          type: "error",
          isLoading: false,
        });
      }
    });
  };

  const handleFormChange = (event: FormEvent) => {
    const input = event.target as HTMLInputElement;
    if (input.id === "description") {
      return;
    }
    const newValue = input.value;
    if (newValue === "") {
      setAmount("0");
      setRawAmount(0);
      return;
    }
    const formattedValue = parseInt(newValue.replace(",", ""));
    setRawAmount(formattedValue);
    const displayedValue = commaSeparateNumber(formattedValue);
    setAmount(displayedValue);
  };

  return (
    <div className="relative flex flex-col w-full m-2">
      <BackButton />
      <h1 className="text-2xl text-center my-5">Remit Money</h1>

      <div className="w-full p-5 md:w-3/4 md:p-10 md:rounded-xl md:border mx-auto">
        <Formik
          initialValues={{
            amount: "",
            description: "",
          }}
          validationSchema={addRemissionSchema}
          onSubmit={handleSubmit}
        >
          {({ values, touched, errors, handleChange, handleSubmit }) => (
            <form
              className="flex flex-col md:w"
              onSubmit={handleSubmit}
              onChange={handleFormChange}
            >
              <FormInput
                id="amount"
                type="text"
                label="How much are you remitting?"
                showError={!!errors.amount && !!touched.amount}
                errorMessage={errors.amount}
                placeholder=""
                onChange={handleChange}
                value={amount}
              />
              <FormInput
                id="description"
                type="text"
                label="Description"
                showError={!!errors.description && !!touched.description}
                errorMessage={errors.description}
                placeholder="Bank Transfer, Cash, Deposit?"
                onChange={handleChange}
                value={values.description}
              />
              <button type="submit" className="button my-5 px-20 mx-auto">
                Submit
              </button>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddRemission;
