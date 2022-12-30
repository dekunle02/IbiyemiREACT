import { ToastOptions } from "react-toastify";
import {
  MdDashboard,
  MdPointOfSale,
  MdCategory,
  MdSupervisorAccount,
  MdAddBusiness,
} from "react-icons/md";
import dayjs from "dayjs";
import React from "react";

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

export interface PeriodOption {
  id: string;
  text: string;
  startDate: dayjs.Dayjs;
  granularity: string;
}

const now: dayjs.Dayjs = dayjs();

export const PeriodOptions: PeriodOption[] = [
  { id: "1", text: "Today", startDate: now, granularity: "hour" },
  {
    id: "2",
    text: "Yesterday",
    startDate: now.subtract(1, "day"),
    granularity: "day",
  },
  {
    id: "3",
    text: "Last 7 Days",
    startDate: now.subtract(7, "day"),
    granularity: "day",
  },
  {
    id: "4",
    text: "This Month",
    startDate: now.startOf("month"),
    granularity: "week",
  },
  {
    id: "5",
    text: "Last Month",
    startDate: now.subtract(1, "month").startOf("month"),
    granularity: "week",
  },
  {
    id: "6",
    text: "This Year",
    startDate: now.startOf("year"),
    granularity: "month",
  },
  // {
  //   id: "7",
  //   text: "Last Year",
  //   startDate: now.subtract(1, "year").startOf("year"),
  //   granularity: "month",
  // },
];

export const ISO_DATE_FORMAT = "YYYY-MM-DD";

export interface ManagerMenuItem {
  id: string;
  text: string;
  icon: React.ReactNode;
  link: string;
}

export const ManagerMenuItems: ManagerMenuItem[] = [
  { id: "1", text: "Dashboard", icon: <MdDashboard />, link: "/manager" },
  { id: "2", text: "Sales", icon: <MdPointOfSale />, link: "/manager/sales" },

  {
    id: "3",
    text: "Products",
    icon: <MdCategory />,
    link: "/manager/products",
  },
  {
    id: "4",
    text: "Accounts",
    icon: <MdSupervisorAccount />,
    link: "accounts",
  },
  {
    id: "5",
    text: "My Shop",
    icon: <MdAddBusiness />,
    link: "/manager/myshop",
  },
];
