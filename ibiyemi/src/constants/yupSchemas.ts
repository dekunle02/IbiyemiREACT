import * as Yup from "yup";

// AUTH
export const signInSchema = Yup.object().shape({
  username: Yup.string().required("Please enter a valid username"),
  password: Yup.string().required("Password is required"),
});

// STORE
export const customerSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string(),
  address: Yup.string(),
  phone_number: Yup.string(),
});
