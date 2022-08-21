import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../../context/AuthContext";
import BackButton from "../../../components/BackButton";
import { LoadStates } from "../../../constants/constants";
import Spinner from "../../../components/Spinner";
import LoadFailedMessage from "../../../components/LoadFailedMessage";
import EmptyListMessage from "../../../components/EmptyListMessage";
import { Product } from "../../../api/interfaces";
import { DjangoClient } from "../../../api/django";
import { RequestStatus } from "../../../api/django";

function ProductOutOfStock() {
  const django: DjangoClient = useApi();
  const [productLoadState, setProductLoadState] = useState(LoadStates.Loading);
  const [productArr, setProductArr] = useState<Product[]>([]);

  useEffect(() => {
    django.getOutOfStockProducts().then((response) => {
      if (response.status === RequestStatus.Success) {
        setProductArr(response.data);
        setProductLoadState(LoadStates.Success);
      } else {
        setProductLoadState(LoadStates.Failure);
      }
    });
  }, [django]);

  return (
    <div className="flex flex-col mx-3">
      <div className="flex flex-row flex-wrap gap-2 relative items-center">
        <BackButton relative />
        <h1 className="font-semibold text-3xl text-colorBlack/80 flex-grow">
          Products Out of Stock
        </h1>
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
                <th className="text-left">Category</th>
                <th>Qty</th>
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
                  <td className="text-left py-4 text-blue-600">
                    <Link
                      to={`/manager/products/categories/${product.category?.id}`}
                    >
                      {product.category?.name}
                    </Link>
                  </td>
                  <td>{product.quantity}</td>
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

export default ProductOutOfStock;
