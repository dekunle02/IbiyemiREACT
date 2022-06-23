import * as Yup from "yup";

// AUTH
export const signInSchema = Yup.object().shape({
  username: Yup.string().required("Please enter a valid username"),
  password: Yup.string().required("Password is required"),
});

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

// STORE
export const customerSchema = Yup.object().shape({
  name: Yup.string(),
  email: Yup.string(),
  address: Yup.string(),
  phone_number: Yup.string(),
});
