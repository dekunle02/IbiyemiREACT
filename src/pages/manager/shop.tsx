import React, { useState, useEffect } from "react";

import { MdAdd, MdAddBusiness } from "react-icons/md";
import { FormInput } from "../../components/FormInput";
import { BusinessInfo, Creditor, Expense } from "../../api/interfaces";
import EditableText from "../../components/EditableText";
import { useApi } from "../../context/AuthContext";
import { ISO_DATE_FORMAT, LoadStates } from "../../constants/constants";
import {
  BusinessInfoFormData,
  CreditorFormData,
  ExpenseFormData,
} from "../../constants/formData";
import { usePopup } from "../../context/PopupContext";
import SimpleDialog from "../../components/SimpleDialog";
import PopupCloseButton from "../../components/PopupCloseButton";
import dayjs from "dayjs";

export default function ShopPage() {
  const django = useApi();
  const popup = usePopup();
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [creditorArr, setCreditorArr] = useState<Creditor[]>([]);
  const [expenseArr, setExpenseArr] = useState<Expense[]>([]);
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    Promise.all([
      django.getCreditors(),
      django.getExpenses(),
      django.getBusinessInfo(),
    ]).then((responseArr) => {
      if (responseArr.some((r) => r.status === django.FAILURE)) {
        setLoadState(LoadStates.Failure);
      } else {
        const [creditorRes, expenseRes, businessRes] = responseArr;
        setCreditorArr(creditorRes.data);
        setExpenseArr(expenseRes.data);
        setBusinessInfo(businessRes.data);
        setLoadState(LoadStates.Success);
      }
    });
  }, [django]);

  function handleReceiptInfoEditSaved(id: string, value: string) {
    const formData: BusinessInfoFormData = {};
    formData[id as keyof typeof formData] = value;
    django.editBusinessInfo(formData).then((res) => {
      if (res.status === django.SUCCESS) {
        alert("Saved!");
        window.location.reload();
      } else {
        alert("Not Saved!");
      }
    });
  }

  function handleCreditorEditSaved(
    creditorId: number,
    field: string,
    value: string
  ) {
    const formData: CreditorFormData = {};
    formData[field as keyof typeof formData] = value;
    django.editCreditor(creditorId, formData).then((res) => {
      if (res.status === django.SUCCESS) {
        alert("Updated!");
        window.location.reload();
      } else {
        alert("Something Went Wrong");
      }
    });
  }
  function handleExpenseEditSaved(
    expenseId: number,
    field: string,
    value: string
  ) {
    const formData: ExpenseFormData = {};
    formData[field as keyof typeof formData] = value;
    django.editExpense(expenseId, formData).then((res) => {
      if (res.status === django.SUCCESS) {
        alert("Updated!");
        window.location.reload();
      } else {
        alert("Something Went Wrong");
      }
    });
  }

  function handleCreditorDelete(creditorId: number) {
    django.deleteCreditor(creditorId).then((res) => {
      if (res.status === django.SUCCESS) {
        alert("Deleted!");
        window.location.reload();
      } else {
        alert("Something Went Wrong");
      }
    });
  }
  function handleExpenseDelete(expenseId: number) {
    django.deleteExpense(expenseId).then((res) => {
      if (res.status === django.SUCCESS) {
        alert("Deleted!");
        window.location.reload();
      } else {
        alert("Something Went Wrong");
      }
    });
  }

  return (
    <div>
      <h1 className="font-semibold text-3xl text-colorBlack/80 flex flex-row items-center flex-grow">
        <MdAddBusiness />
        My Shop
      </h1>

      <div className="flex flex-col my-2 p-1 lg:px-5 border rounded">
        <h5 className="my-2 text-xl">Receipt Information</h5>
        {businessInfo && (
          <div className="flex flex-col">
            <p className="label">Address: </p>
            <EditableText
              id="address"
              text={businessInfo.address}
              onEditSaved={handleReceiptInfoEditSaved}
              inputType="textarea"
            />
            <br />
            <p className="label">Phone Numbers</p>
            <EditableText
              id="phone_numbers"
              text={businessInfo.phone_numbers}
              onEditSaved={handleReceiptInfoEditSaved}
              inputType="text"
            />
            <br />
            <p className="label">Receipt Message</p>
            <EditableText
              id="receipt_message"
              text="Thanks for shopping with us"
              onEditSaved={handleReceiptInfoEditSaved}
              inputType="text"
            />
          </div>
        )}
      </div>

      <br />
      {/* Creditors/Customers*/}
      <div className="flex flex-col my-2 p-1 lg:px-5 border rounded max-h-60 overflow-auto">
        <div className="flex flex-row justify-between items-centers">
          <h5 className="my-2 text-xl">Creditor/Customers</h5>
          <button
            className="button icon-button px-2 py-1"
            onClick={() => {
              popup?.show(<AddCreditor />);
            }}
          >
            <MdAdd />
            Add
          </button>
        </div>

        <table className="w-full">
          <thead className="border-b-2">
            <tr className="my-2 text-left">
              <th>#</th>
              <th className="">Name</th>
              <th className="">Amount</th>
              <th>Phone number</th>
              <th className="">Action</th>
            </tr>
          </thead>

          <tbody>
            {creditorArr.map((creditor, index) => (
              <tr key={creditor.id} className="border-b">
                <td>{index + 1}.</td>
                <td className="text-left py-4">
                  <EditableText
                    id="name"
                    text={creditor.name}
                    inputType="text"
                    onEditSaved={(id, value) => {
                      handleCreditorEditSaved(creditor.id, "name", value);
                    }}
                  />
                </td>
                <td className="text-left py-4">
                  <EditableText
                    id="amount"
                    text={creditor.amount?.toString() ?? "0"}
                    inputType="number"
                    onEditSaved={(id, value) => {
                      handleCreditorEditSaved(creditor.id, "amount", value);
                    }}
                  />
                </td>
                <td>
                  <EditableText
                    id="phone_number"
                    text={creditor.phone_number ?? "None"}
                    inputType="text"
                    onEditSaved={(id, value) => {
                      handleCreditorEditSaved(
                        creditor.id,
                        "phone_number",
                        value
                      );
                    }}
                  />
                </td>
                <td className="text-left">
                  <button
                    className="text-button"
                    onClick={() => {
                      popup?.show(
                        <SimpleDialog
                          title="Confirm Delete"
                          body="Are you sure you want to delete this Customer?"
                          positiveAction={() => {
                            handleCreditorDelete(creditor.id);
                          }}
                        />
                      );
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expenses */}
      <br />
      <div className="flex flex-col my-2 p-1 lg:px-5 border rounded max-h-60 overflow-auto">
        <div className="flex flex-row justify-between items-centers">
          <h5 className="my-2 text-xl">Expenses</h5>
          <button
            className="button icon-button px-2 py-1"
            onClick={() => {
              popup?.show(<AddExpense />);
            }}
          >
            <MdAdd />
            Add
          </button>
        </div>

        <table className="w-full">
          <thead className="border-b-2">
            <tr className="my-2 text-left">
              <th>#</th>
              <th className="">Name</th>
              <th className="">Description</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th className="">Action</th>
            </tr>
          </thead>

          <tbody>
            {expenseArr.map((expense, index) => (
              <tr key={expense.id} className="border-b">
                <td>{index + 1}.</td>
                <td className="text-left py-4">
                  <EditableText
                    id="name"
                    text={expense.name}
                    inputType="text"
                    onEditSaved={(id, value) => {
                      handleExpenseEditSaved(expense.id, "name", value);
                    }}
                  />
                </td>
                <td className="text-left py-4">
                  <EditableText
                    id="description"
                    text={expense.description}
                    inputType="text"
                    onEditSaved={(id, value) => {
                      handleExpenseEditSaved(expense.id, "description", value);
                    }}
                  />
                </td>
                <td className="text-left py-4">
                  <EditableText
                    id="amount"
                    text={expense.amount?.toString() ?? "0"}
                    inputType="number"
                    onEditSaved={(id, value) => {
                      handleCreditorEditSaved(expense.id, "amount", value);
                    }}
                  />
                </td>
                <td>
                  <EditableText
                    id="due_date"
                    text={expense.due_date ?? "None"}
                    inputType="text"
                    onEditSaved={(id, value) => {
                      handleExpenseEditSaved(expense.id, "due_date", value);
                    }}
                  />
                </td>
                <td className="text-left">
                  <button
                    className="text-button"
                    onClick={() => {
                      popup?.show(
                        <SimpleDialog
                          title="Confirm Delete"
                          body="Are you sure you want to delete this Expense?"
                          positiveAction={() => {
                            handleExpenseDelete(expense.id);
                          }}
                        />
                      );
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddCreditor() {
  const django = useApi();
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    django
      .addCreditor({ name: name, phone_number: phone_number, amount: amount })
      .then((res) => {
        if (res.status === django.SUCCESS) {
          alert("New Customer Added Successfully");
          window.location.reload();
        } else {
          alert("Something went wrong");
        }
      });
  }

  return (
    <div className="popup-card">
      <PopupCloseButton />
      <h3 className="text-xl">Add A Customer/Creditor</h3>
      <form className="flex flex-col gap-3 my-2" onSubmit={handleSubmit}>
        <FormInput
          id="name"
          value={name}
          onChange={(event: React.ChangeEvent) => {
            setName((event.target as HTMLInputElement).value);
          }}
          label="Name"
          type="text"
        />
        <FormInput
          id="phone_number"
          value={phone_number}
          onChange={(event: React.ChangeEvent) => {
            setPhoneNumber((event.target as HTMLInputElement).value);
          }}
          label="Phone Number"
          type="text"
        />
        <FormInput
          id="amount"
          value={amount}
          onChange={(event: React.ChangeEvent) => {
            setAmount((event.target as HTMLInputElement).value);
          }}
          label="Amount"
          type="number"
        />
        <button className="button w-1/2 mx-auto mt-3">Submit</button>
      </form>
    </div>
  );
}

function AddExpense() {
  const django = useApi();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    django
      .addExpense({
        name: name,
        description: description,
        amount: amount,
        due_date: dayjs(dueDate).format(ISO_DATE_FORMAT),
      })
      .then((res) => {
        if (res.status === django.SUCCESS) {
          alert("New Expense Added Successfully");
          window.location.reload();
        } else {
          alert("Something went wrong");
        }
      });
  }

  return (
    <div className="popup-card">
      <PopupCloseButton />
      <h3 className="text-xl">Add Expense</h3>
      <form className="flex flex-col gap-3 my-2" onSubmit={handleSubmit}>
        <FormInput
          id="name"
          value={name}
          onChange={(event: React.ChangeEvent) => {
            setName((event.target as HTMLInputElement).value);
          }}
          label="Name"
          type="text"
        />
        <FormInput
          id="description"
          value={description}
          onChange={(event: React.ChangeEvent) => {
            setDescription((event.target as HTMLInputElement).value);
          }}
          label="Description"
          type="textarea"
        />
        <FormInput
          id="amount"
          value={amount}
          onChange={(event: React.ChangeEvent) => {
            setAmount((event.target as HTMLInputElement).value);
          }}
          label="Amount"
          type="number"
        />
        <FormInput
          id="due_date"
          value={dueDate}
          onChange={(event: React.ChangeEvent) => {
            setDueDate(
              dayjs((event.target as HTMLInputElement).value).format(
                "YYYY-MM-DD"
              )
            );
          }}
          label="Due Date"
          type="date"
        />
        <button className="button w-1/2 mx-auto mt-3">Submit</button>
      </form>
    </div>
  );
}
