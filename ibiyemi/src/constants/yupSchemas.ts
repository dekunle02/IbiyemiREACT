import * as Yup from "yup";

// AUTH
export const signInSchema = Yup.object().shape({
  username: Yup.string().required("Please enter a valid username"),
  password: Yup.string().required("Password is required"),
});
