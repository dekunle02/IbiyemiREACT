import { useEffect, useState } from "react";
import { useApi } from "../../../context/AuthContext";
import { Product } from "../../../api/interfaces";
import { LoadStates } from "../../../constants/constants";
import EditableText from "../../../components/EditableText";

export default function ProductMassEdit() {
  const django = useApi();
  const [productArr, setProductArr] = useState<Product[]>([]);
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    django.getProducts().then((res) => {
      if (res.status === django.SUCCESS) {
        setProductArr(res.data);
        setLoadState(LoadStates.Success);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django]);

  function handleProductFieldSave(
    productId: number,
    field: string,
    value: string
  ) {
    const formData: any = {};
    formData[field] = value;
    django.editProduct(productId, formData).then((res) => {
      if (res.status === django.SUCCESS) {
        alert("Saved!");
      } else {
        alert("Error Saving...");
      }
    });
  }

  return (
    <div>
      <h1 className="font-semibold text-3xl text-colorBlack/80 flex-grow">
        Edit ALL Products
      </h1>
      {loadState === LoadStates.Loading && (
        <p className="text-center">Loading all products.....</p>
      )}
      {loadState === LoadStates.Success && (
        <div className="border overflow-auto relative max-h-screen">
          <table className="text-left relative">
            <thead className="border-b-2 relative">
              <tr className="my-2 relative">
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  #
                </th>
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  Name
                </th>
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  Qty
                </th>
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  Unit Cost
                </th>
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  Unit Sell
                </th>
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  Dozen Cost
                </th>
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  Dozen Sell
                </th>
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  Pack Cost
                </th>
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  Pack Sell
                </th>
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  Pack Qty
                </th>
                <th className="excel-cell sticky top-0 bg-colorWhite z-[10]">
                  Notify Qty
                </th>
              </tr>
            </thead>

            <tbody>
              {productArr.map((product, index) => (
                <tr
                  key={product.id + Math.random()}
                  className="border-b text-left"
                >
                  <td>{index + 1}.</td>

                  <td className="excel-cell">
                    <EditableText
                      id="name"
                      inputType="text"
                      text={product.name}
                      onEditSaved={(id, value) => {
                        handleProductFieldSave(product.id, "name", value);
                      }}
                    />
                  </td>

                  <td className="excel-cell">
                    <EditableText
                      id="quantity"
                      inputType="text"
                      text={product.quantity.toString()}
                      onEditSaved={(id, value) => {
                        handleProductFieldSave(product.id, "quantity", value);
                      }}
                    />
                  </td>

                  <td className="excel-cell">
                    <EditableText
                      id="unit_cost_price"
                      inputType="number"
                      text={product.unit_cost_price.toString()}
                      onEditSaved={(id, value) => {
                        handleProductFieldSave(product.id, id, value);
                      }}
                    />
                  </td>

                  <td>
                    <EditableText
                      id="unit_sell_price"
                      inputType="number"
                      text={product.unit_sell_price.toString()}
                      onEditSaved={(id, value) => {
                        handleProductFieldSave(product.id, id, value);
                      }}
                    />
                  </td>

                  <td>
                    <EditableText
                      id="dozen_cost_price"
                      inputType="number"
                      text={product?.dozen_cost_price?.toString() ?? "0"}
                      onEditSaved={(id, value) => {
                        handleProductFieldSave(product.id, id, value);
                      }}
                    />
                  </td>

                  <td className="excel-cell">
                    <EditableText
                      id="dozen_sell_price"
                      inputType="number"
                      text={product?.dozen_sell_price?.toString() ?? "0"}
                      onEditSaved={(id, value) => {
                        handleProductFieldSave(product.id, id, value);
                      }}
                    />
                  </td>

                  <td className="excel-cell">
                    <EditableText
                      id="pack_cost_price"
                      inputType="number"
                      text={product?.pack_cost_price?.toString() ?? "0"}
                      onEditSaved={(id, value) => {
                        handleProductFieldSave(product.id, id, value);
                      }}
                    />
                  </td>

                  <td className="excel-cell">
                    <EditableText
                      id="pack_sell_price"
                      inputType="number"
                      text={product?.pack_sell_price?.toString() ?? "0"}
                      onEditSaved={(id, value) => {
                        handleProductFieldSave(product.id, id, value);
                      }}
                    />
                  </td>

                  <td className="excel-cell">
                    <EditableText
                      id="pack_quantity"
                      inputType="number"
                      text={product?.pack_quantity?.toString() ?? "0"}
                      onEditSaved={(id, value) => {
                        handleProductFieldSave(product.id, id, value);
                      }}
                    />
                  </td>

                  <td className="excel-cell">
                    <EditableText
                      id="notify_quantity"
                      inputType="number"
                      text={product?.notify_quantity?.toString() ?? "0"}
                      onEditSaved={(id, value) => {
                        handleProductFieldSave(product.id, id, value);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
