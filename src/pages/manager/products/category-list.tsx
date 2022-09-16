import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../../context/AuthContext";
import { LoadStates } from "../../../constants/constants";
import { MdCategory, MdAdd } from "react-icons/md";
import BackButton from "../../../components/BackButton";
import LoadFailedMessage from "../../../components/LoadFailedMessage";
import Spinner from "../../../components/Spinner";
import {
  commaSeparateNumber,
  formatMoney,
} from "../../../helpers/format-helpers";
import { DjangoClient, RequestStatus } from "../../../api/django";
import { Category } from "../../../api/interfaces";
import EmptyListMessage from "../../../components/EmptyListMessage";

function CategoryList() {
  const django: DjangoClient = useApi();
  const [categoryArr, setCategoryArr] = useState<Category[]>([]);
  const [categoryLoadState, setCategoryLoadState] = useState<LoadStates>(
    LoadStates.Loading
  );

  useEffect(() => {
    django.getCategories().then((response) => {
      if (response.status === RequestStatus.Success) {
        setCategoryArr(response.data);
        setCategoryLoadState(LoadStates.Success);
      } else {
        setCategoryLoadState(LoadStates.Failure);
      }
    });
  }, [django]);

  return (
    <div className="flex flex-col md:mx-3">
      <div className="flex flex-row flex-wrap gap-2 relative items-center">
        <BackButton relative />
        <MdCategory className="font-semibold text-3xl text-colorBlack/80" />
        <h1 className="font-semibold text-3xl text-colorBlack/80 flex-grow">
          Categories
        </h1>
        <Link
          to="new"
          className="icon-button text-lg border rounded-2xl p-1 px-3 border-black hover:bg-colorBlack/5"
        >
          <MdAdd />
          Add New Category
        </Link>
      </div>
      <br />
      {/* Table */}
      {categoryLoadState === LoadStates.Loading && <Spinner />}
      {categoryLoadState === LoadStates.Failure && <LoadFailedMessage />}
      {categoryLoadState === LoadStates.Success && categoryArr.length === 0 && (
        <EmptyListMessage />
      )}
      {categoryLoadState === LoadStates.Success && (
        <table className="w-full">
          <thead className="border-b-2">
            <tr className="my-2">
              <th>#</th>
              <th className="text-left py-2">Name</th>
              <th className="text-left">Products Count</th>
              <th className="text-left">Product Qty</th>
              <th className="text-left">Cost Price</th>
              <th className="text-left">Sell Price</th>
            </tr>
          </thead>

          <tbody>
            {categoryArr.map((category, index) => (
              <tr key={Math.random()}>
                <td>{index + 1}.</td>
                <td className="text-left py-4 text-blue-600">
                  <Link to={category.id.toString()}>{category.name}</Link>
                </td>
                <td className="text-left py-4">
                  {commaSeparateNumber(category.count!!)}
                </td>
                <td>{commaSeparateNumber(category.quantity!!)}</td>
                <td className="text-left">
                  {formatMoney(category.cost_price!!)}
                </td>
                <td className="text-left">
                  {formatMoney(category.sell_price!!)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default CategoryList;
