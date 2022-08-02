import * as Yup from "yup";

const digitsOnly = (value: string | undefined) =>
  /^\d+$/.test(value ? value : "");
const nonZero = (value: string | undefined) =>
  parseInt(value ? value : "0") > 0;

// AUTH
export const signInSchema = Yup.object().shape({
  username: Yup.string().required("Please enter a valid username"),
  password: Yup.string().required("Password is required"),
});

// PROFILE
export const changePasswordSchema = Yup.object().shape({
  old_password: Yup.string().required("Old Password is required"),
  password: Yup.string().required("New Password is required"),
  confirm_password: Yup.string()
    .required("Confirm your new password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const changeUsernameSchema = Yup.object().shape({
  username: Yup.string().required("Please enter a valid username"),
});

export const addRemissionSchema = Yup.object().shape({
  description: Yup.string().required("Please include a description"),
  amount: Yup.string().required("Please indicate how much you are remitting"),
  // .test("Non Zero", "Amount must be greater than 0", nonZero),
});

// STORE
export const customerSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string(),
  address: Yup.string(),
  phone_number: Yup.string(),
});
