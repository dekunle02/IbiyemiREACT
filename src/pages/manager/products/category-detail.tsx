import { useState, useEffect } from "react";
import { useApi } from "../../../context/AuthContext";
import { usePopup } from "../../../context/PopupContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Category, Product } from "../../../api/interfaces";
import { RequestStatus } from "../../../api/django";
import { LoadStates } from "../../../constants/constants";
import BackButton from "../../../components/BackButton";
import { MdCategory, MdEdit, MdDelete } from "react-icons/md";
import { toastConfig } from "../../../constants/constants";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import EmptyListMessage from "../../../components/EmptyListMessage";
import {
  formatMoney,
  commaSeparateNumber,
} from "../../../helpers/format-helpers";
import SimpleDialog from "../../../components/SimpleDialog";
import LoadFailedMessage from "../../../components/LoadFailedMessage";

function CategoryDetail() {
  const { id } = useParams();
  const django = useApi();
  const navigate = useNavigate();
  const popup = usePopup();
  const [category, setCategory] = useState<Category | null>(null);
  const [productArr, setProductArr] = useState<Product[]>([]);
  const [categoryLoadState, setCategoryLoadState] = useState(
    LoadStates.Loading
  );
  const [productLoadState, setProductLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    if (!id) return;
    django.getCategory(parseInt(id)).then((response) => {
      if (response.status === RequestStatus.Success) {
        setCategory(response.data);
        setCategoryLoadState(LoadStates.Success);
      } else {
        setCategoryLoadState(LoadStates.Failure);
      }
    });
  }, [id, django]);

  useEffect(() => {
    if (!category) return;
    django.getProducts(category.id).then((response) => {
      if (response.status === RequestStatus.Success) {
        setProductArr(response.data);
        setProductLoadState(LoadStates.Success);
      } else {
        setProductLoadState(LoadStates.Failure);
      }
    });
  }, [category, django]);

  const handleDeleteButtonClick = () => {
    popup?.show(
      <SimpleDialog
        title="Delete Category"
        body="Are you sure you want to delete this Category?"
        positiveText="Yes, Delete"
        positiveAction={() => {
          onDeleteConfirmed();
        }}
      />
    );
  };

  const onDeleteConfirmed = () => {
    if (!category) return;
    const toastId = toast.loading("Deleting category..", toastConfig);
    django.deleteCategory(category.id).then((response) => {
      if (response.status === RequestStatus.Success) {
        toast.update(toastId, {
          render: "Category Deleted!",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        navigate(-1);
      } else {
        toast.update(toastId, {
          render: "Error deleting category..",
          type: "error",
          isLoading: false,
          autoClose: 2000,
        });
      }
    });
  };

  return (
    <div className="flex flex-col mx-3">
      <div className="flex flex-row flex-wrap gap-2 relative items-center">
        <BackButton relative />
        <MdCategory className="font-semibold text-3xl text-colorBlack/80" />
        <h1 className="font-semibold text-3xl text-colorBlack/80 flex-grow">
          {categoryLoadState === LoadStates.Success
            ? category!!.name
            : "Category"}
        </h1>
        <Link
          to={`/manager/products/categories/edit/${id}`}
          className="icon-button text-lg border rounded-2xl p-1 px-3 border-black hover:bg-colorBlack/5"
        >
          <MdEdit />
          Edit
        </Link>
        <button
          className="icon-button text-lg border rounded-2xl p-1 px-3 border-red-600 text-red-600 hover:bg-colorBlack/5"
          onClick={handleDeleteButtonClick}
        >
          <MdDelete />
          Delete
        </button>
      </div>

      {/* cards */}
      <div className="my-3 flex flex-row gap-3 flex-wrap md:flex-nowrap text-black/80">
        {/* product card */}
        <div className="rounded-xl p-3 flex flex-col w-full bg-lime-100">
          <h3 className="font-semibold text-xl text-black/50">
            Total Products
          </h3>
          <span className="text-3xl text-center py-4">
            {productLoadState === LoadStates.Loading && <Spinner />}
            {productLoadState === LoadStates.Success &&
              commaSeparateNumber(category?.count!!)}
            {productLoadState === LoadStates.Failure && <LoadFailedMessage />}
          </span>
          <span className="text-center font-light">
            {commaSeparateNumber(category?.quantity!!)} unique items
          </span>
        </div>

        {/* cost card */}
        <div className="rounded-xl p-3 flex flex-col w-full bg-slate-200">
          <h3 className="font-semibold text-xl text-black/50">Total Cost</h3>
          {categoryLoadState === LoadStates.Loading && <Spinner />}
          {categoryLoadState === LoadStates.Failure && <LoadFailedMessage />}
          {categoryLoadState === LoadStates.Success && (
            <>
              <span className="text-3xl text-center py-4">
                {productLoadState === LoadStates.Loading && <Spinner />}
                {productLoadState === LoadStates.Success &&
                  formatMoney(category?.cost_price!!)}
                {productLoadState === LoadStates.Failure && (
                  <LoadFailedMessage />
                )}
              </span>
              <span className="text-center font-light">
                Cost of Products (uses bulk price)
              </span>
            </>
          )}
        </div>

        {/* sell card */}
        <div className="rounded-xl p-3 flex flex-col w-full bg-orange-100">
          <h3 className="font-semibold text-xl text-black/50">
            Total Selling Price
          </h3>
          {categoryLoadState === LoadStates.Loading && <Spinner />}
          {categoryLoadState === LoadStates.Failure && <LoadFailedMessage />}
          {categoryLoadState === LoadStates.Success && (
            <>
              <span className="text-3xl text-center py-4">
                {productLoadState === LoadStates.Loading && <Spinner />}
                {productLoadState === LoadStates.Success &&
                  formatMoney(category?.sell_price!!)}
                {productLoadState === LoadStates.Failure && (
                  <LoadFailedMessage />
                )}
              </span>
              <span className="text-center font-light">
                Selling Price of Products (uses bulk price)
              </span>
            </>
          )}
        </div>

        {/* profit card */}
        <div className="rounded-xl p-3 flex flex-col w-full bg-rose-100">
          <h3 className="font-semibold text-xl text-black/50">
            Potential Profit
          </h3>
          {categoryLoadState === LoadStates.Loading && <Spinner />}
          {categoryLoadState === LoadStates.Failure && <LoadFailedMessage />}
          {categoryLoadState === LoadStates.Success && (
            <>
              <span className="text-3xl text-center py-4">
                {productLoadState === LoadStates.Loading && <Spinner />}
                {productLoadState === LoadStates.Success &&
                  formatMoney(category?.sell_price!! - category?.cost_price!!)}
                {productLoadState === LoadStates.Failure && (
                  <LoadFailedMessage />
                )}
              </span>
              <span className="text-center font-light">
                Potential profit (using bulk)
              </span>
            </>
          )}
        </div>
      </div>
      {/* Table */}
      <br />
      {productLoadState === LoadStates.Loading && <Spinner />}
      {productLoadState === LoadStates.Failure && <LoadFailedMessage />}
      {productLoadState === LoadStates.Success && (
        <div className="text-center overflow-y-auto max-h-[40rem]">
          <table className="w-full">
            <thead className="border-b-2">
              <tr className="my-2">
                <th>#</th>
                <th className="text-left py-2">Product</th>
                <th>Qty</th>
                <th className="text-left">Unit Cost</th>
                <th className="text-left">Unit Sell</th>
              </tr>
            </thead>

            <tbody>
              {productArr.map((product, index) => (
                <tr key={product.id + Math.random()}>
                  <td>{index + 1}</td>
                  <td className="text-left py-4 text-blue-600 ">
                    <Link to={`/manager/products/${product.id}`}>
                      {product.name}{" "}
                    </Link>
                  </td>
                  <td>{commaSeparateNumber(product.quantity)}</td>
                  <td className="text-left">
                    {formatMoney(product.unit_cost_price)}
                  </td>
                  <td className="text-left">
                    {formatMoney(product.unit_sell_price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {productArr.length === 0 && productLoadState === LoadStates.Success && (
        <EmptyListMessage message="No Products to Display..." />
      )}
    </div>
  );
}
export default CategoryDetail;
