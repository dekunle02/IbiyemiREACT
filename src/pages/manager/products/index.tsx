import { useState, useEffect, useMemo } from "react";
import { useApi } from "../../../context/AuthContext";
import { Product } from "../../../api/interfaces";
import { MdCallMade, MdCategory, MdPrint, MdAdd } from "react-icons/md";
import { HiX, HiOutlineSearch } from "react-icons/hi";
import {
  commaSeparateNumber,
  formatMoney,
} from "../../../helpers/format-helpers";
import { DjangoClient, RequestStatus } from "../../../api/django";
import { LoadStates } from "../../../constants/constants";
import Spinner from "../../../components/Spinner";
import LoadFailedMessage from "../../../components/LoadFailedMessage";
import EmptyListMessage from "../../../components/EmptyListMessage";
import { Link } from "react-router-dom";
import { FormInput } from "../../../components/FormInput";

function ProductsIndex() {
  const django: DjangoClient = useApi();
  const [query, setQuery] = useState<string>("");
  const [productArr, setProductArr] = useState<Product[]>([]);
  // const [queriedProductArr, setQueriedProductArr] = useState<Product[]>([]);
  const [productLoadState, setProductLoadState] = useState<LoadStates>(
    LoadStates.Loading
  );

  useEffect(() => {
    django.getProducts().then((response) => {
      if (response.status === RequestStatus.Success) {
        setProductArr(response.data);
        setProductLoadState(LoadStates.Success);
      } else {
        setProductLoadState(LoadStates.Failure);
      }
    });
  }, [django]);

  const uniqueProductCount: number = productArr.length;

  const productCount: number = useMemo(() => {
    return productArr.reduce(
      (previousValue: number, currentItem: Product) =>
        previousValue + currentItem.quantity,
      0
    );
  }, [productArr]);

  const inventoryCostPrice: number = useMemo(() => {
    return productArr.reduce(
      (previousValue: number, currentItem: Product) =>
        previousValue + currentItem.unit_cost_price * currentItem.quantity,
      0
    );
  }, [productArr]);

  const inventorySellPrice: number = useMemo(() => {
    return productArr.reduce(
      (previousValue: number, currentItem: Product) =>
        previousValue + currentItem.unit_sell_price * currentItem.quantity,
      0
    );
  }, [productArr]);

  const potentialEarnings: number = inventorySellPrice - inventoryCostPrice;

  // Query Handlers
  const handleSearchQueryChange = (event: React.ChangeEvent) => {
    const element = event.target as HTMLInputElement;
    setQuery(element.value);
  };

  const handleClearQuery = () => {
    if (query.length > 0) {
      setQuery("");
    }
  };

  const queriedProductArr = productArr.filter((product) =>
    product.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="flex flex-col">
      {/* Top heading */}
      <div className="flex flex-row flex-wrap gap-2">
        <MdCategory className="font-semibold text-3xl text-colorBlack/80" />
        <h1 className="font-semibold text-3xl text-colorBlack/80 flex-grow">
          Products
        </h1>

        <Link
          to="categories"
          className="icon-button text-lg border rounded-2xl p-1 px-3 border-black hover:bg-colorBlack/5"
        >
          <MdCallMade />
          View Product Categories
        </Link>

        <Link
          to="out"
          className="icon-button text-lg border rounded-2xl p-1 px-3 text-red-800 border-red-800 hover:bg-colorBlack/5"
        >
          <MdCallMade />
          View Products Going Out of Stock
        </Link>

        <Link
          to="print"
          className="icon-button text-lg border rounded-2xl p-1 px-3 text-colorPrimary border-colorPrimary hover:bg-colorBlack/5"
        >
          <MdPrint />
          Print
        </Link>
      </div>

      {/* summary cards */}
      <div className="my-3 flex flex-row gap-3 flex-wrap md:flex-nowrap text-black/80 ">
        {/* Product Count Card */}
        <div className="rounded-xl p-3 flex flex-col w-full border">
          <h3 className="font-semibold text-xl text-black/50">
            Products In Stock
          </h3>
          <span className="text-3xl text-center py-4">
            {productLoadState === LoadStates.Loading && <Spinner />}
            {productLoadState === LoadStates.Success &&
              commaSeparateNumber(uniqueProductCount)}
            {productLoadState === LoadStates.Failure && <LoadFailedMessage />}
          </span>
          <span className="text-center font-light">
            {commaSeparateNumber(productCount)} unique items
          </span>
        </div>

        {/* cost card */}
        <div className="rounded-xl p-3 flex flex-col w-full border">
          <h3 className="font-semibold text-xl text-black/50">Total Cost</h3>
          <span className="text-3xl text-center py-4">
            {productLoadState === LoadStates.Loading && <Spinner />}
            {productLoadState === LoadStates.Success &&
              formatMoney(inventoryCostPrice)}
            {productLoadState === LoadStates.Failure && <LoadFailedMessage />}
          </span>
          <span className="text-center font-light">
            Cost of Stock (uses unit cost)
          </span>
        </div>

        {/* sell card */}
        <div className="rounded-xl p-3 flex flex-col w-full border">
          <h3 className="font-semibold text-xl text-black/50">
            Total Selling Price
          </h3>
          <span className="text-3xl text-center py-4">
            {productLoadState === LoadStates.Loading && <Spinner />}
            {productLoadState === LoadStates.Success &&
              formatMoney(inventorySellPrice)}
            {productLoadState === LoadStates.Failure && <LoadFailedMessage />}
          </span>
          <span className="text-center font-light">
            Selling Price of Stock (uses unit sell)
          </span>
        </div>

        {/* earnings card */}
        <div className="rounded-xl p-3 flex flex-col w-full border">
          <h3 className="font-semibold text-xl text-black/50">
            Potential Earnings
          </h3>
          <span className="text-3xl text-center py-4">
            {productLoadState === LoadStates.Loading && <Spinner />}
            {productLoadState === LoadStates.Success &&
              formatMoney(potentialEarnings)}
            {productLoadState === LoadStates.Failure && <LoadFailedMessage />}
          </span>
          <span className="text-center font-light">Profit margin</span>
        </div>
      </div>

      {/* Product list */}
      <div className="m-3 flex flex-row gap-2">
        <FormInput
          id="query"
          name="query"
          type="text"
          placeholder="Search for a product.."
          value={query}
          onChange={handleSearchQueryChange}
        >
          <button
            onClick={handleClearQuery}
            className="absolute top-1 right-0 text-xl rounded-r-xl
          hover:bg-colorBlack/5 p-3 pl-5"
          >
            {query.length > 0 ? <HiX /> : <HiOutlineSearch />}
          </button>
        </FormInput>

        <Link to="new" className="text-lg button icon-button px-2">
          <MdAdd />
          Add Product
        </Link>
      </div>

      {/* Table */}
      <br />
      {productLoadState === LoadStates.Loading && <Spinner />}
      {productLoadState === LoadStates.Failure && <LoadFailedMessage />}
      {productLoadState === LoadStates.Success && (
        <div className="text-center overflow-y-auto max-h-96">
          <table className="w-full">
            <thead className="border-b-2">
              <tr className="my-2">
                <th>#</th>
                <th className="text-left py-2">Product</th>
                <th className="text-left">Category</th>
                <th>Qty</th>
                <th className="text-left">Unit Cost</th>
                <th className="text-left">Unit Sell</th>
              </tr>
            </thead>

            <tbody>
              {queriedProductArr.map((product, index) => (
                <tr key={product.id + Math.random()}>
                  <td>{index + 1}</td>
                  <td className="text-left py-4 text-blue-600 ">
                    <Link to={`products/${product.id}`}>{product.name} </Link>
                  </td>
                  <td className="text-left py-4 text-blue-600">
                    <Link to={`categories/${product.category?.id}`}>
                      {product.category?.name}
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
      {queriedProductArr.length === 0 &&
        productLoadState === LoadStates.Success && (
          <EmptyListMessage message="No Products to Display..." />
        )}
    </div>
  );
}

export default ProductsIndex;
