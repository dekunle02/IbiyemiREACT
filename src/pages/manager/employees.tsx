import { useEffect, useState } from "react";
import { User } from "../../api/interfaces";
import { useApi } from "../../context/AuthContext";
import { LoadStates } from "../../constants/constants";
import PopupCloseButton from "../../components/PopupCloseButton";
import { FormInput } from "../../components/FormInput";
import { usePopup } from "../../context/PopupContext";
import { MdAdd } from "react-icons/md";
import { formatRawDate } from "../../helpers/format-helpers";
import SimpleDialog from "../../components/SimpleDialog";

export default function Employees() {
  const django = useApi();
  const popup = usePopup();
  const [loadState, setLoadState] = useState(LoadStates.Loading);
  const [employeeArr, setEmployeeArr] = useState<User[]>([]);

  useEffect(() => {
    django.getSalePersons().then((response) => {
      if (response.status === django.SUCCESS) {
        setEmployeeArr(response.data);
        setLoadState(LoadStates.Success);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django]);

  function handleEmployeeDelete(id: number) {
    django.deleteSalesPerson(id).then((res) => {
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
      <div className="flex flex-row justify-between items-centers">
        <h5 className="my-2 text-xl">Employees</h5>
        <button
          className="button icon-button px-2 py-1"
          onClick={() => {
            popup?.show(<AddEmployee />);
          }}
        >
          <MdAdd />
          Add
        </button>
      </div>
      <div className="flex flex-col my-2 p-1 lg:px-8">
        <table className="w-full">
          <thead className="border-b-2">
            <tr className="my-2 text-left">
              <th>#</th>
              <th className="">Username</th>
              <th className="">Last Login</th>
              <th className="">Action</th>
            </tr>
          </thead>

          <tbody>
            {employeeArr.map((employee, index) => (
              <tr key={employee.id} className="border-b">
                <td>{index + 1}.</td>
                <td className="text-left py-4">{employee.username}</td>
                <td className="text-left py-4">
                  {employee.last_login
                    ? formatRawDate(employee.last_login)
                    : "None"}
                </td>

                <td className="text-left">
                  <button
                    className="text-button"
                    onClick={() => {
                      popup?.show(
                        <SimpleDialog
                          title="Confirm Delete"
                          body="Are you sure you want to delete this Employee? This is irreversible"
                          positiveAction={() => {
                            handleEmployeeDelete(employee.id);
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

function AddEmployee() {
  const django = useApi();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    django
      .addSalesperson({ username: username, password: password })
      .then((res) => {
        if (res.status === django.SUCCESS) {
          alert("New Employee Added Successfully");
          window.location.reload();
        } else {
          alert("Something went wrong");
        }
      });
  }

  return (
    <div className="popup-card">
      <PopupCloseButton />
      <h3 className="text-xl">Add A SalesPerson</h3>
      <form className="flex flex-col gap-3 my-2" onSubmit={handleSubmit}>
        <FormInput
          id="name"
          value={username}
          onChange={(event: React.ChangeEvent) => {
            setUserName((event.target as HTMLInputElement).value);
          }}
          label="Username"
          type="text"
        />
        <FormInput
          id="password"
          value={password}
          onChange={(event: React.ChangeEvent) => {
            setPassword((event.target as HTMLInputElement).value);
          }}
          label="Password"
          type="text"
        />

        <button className="button w-1/2 mx-auto mt-3">Submit</button>
      </form>
    </div>
  );
}
