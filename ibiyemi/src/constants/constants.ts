import { ToastOptions } from "react-toastify";

export enum LoadStates {
  Loading,
  Success,
  Failure,
  Empty,
}

export const toastConfig: ToastOptions = {
  position: "top-center",
  autoClose: 500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
};
