import React, { useEffect, useRef, useState } from "react";
import { useApi } from "../../../context/AuthContext";
import { Product } from "../../../api/interfaces";
import { LoadStates } from "../../../constants/constants";
import BackButton from "../../../components/BackButton";

export default function ProductMassEdit() {
  const django = useApi();
  const [productArr, setProductArr] = useState<Product[]>([]);
  const [loadState, setLoadState] = useState(LoadStates.Loading);
  const massEditor = useRef(new MassEditor());

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

  function handleSave() {
    const productFieldMap = massEditor.current.editedProductFieldToValue;
    const failed = [];

    for (const [key, value] of Object.entries(productFieldMap)) {
      const [productId, field] = key.split("-");
      const formData: any = {};
      formData[field] = value;
      django.editProduct(parseInt(productId), formData).then((res) => {
        if (res.status === django.FAILURE) {
          failed.push(productId);
        }
      });
    }
    if (failed.length === 0) {
      alert("All Saved Successfully");
    } else {
      alert("Some products not saved...");
    }
  }

  return (
    <div>
      <div className="flex flex-row gap-4 items-center pb-4">
        <BackButton relative />
        <h1 className="font-semibold text-3xl text-colorBlack/80">
          Spreadsheet
        </h1>
        <button className="button" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      {loadState === LoadStates.Loading && (
        <p className="text-center">Loading all products.....</p>
      )}
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
                  <input
                    id={`${product.id}-name`}
                    type="text"
                    defaultValue={product.name}
                    onChange={(event: React.ChangeEvent) => {
                      massEditor.current.addProductField(
                        `${product.id}-name`,
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />
                </td>

                <td className="excel-cell">
                  <input
                    id={`${product.id}-quantity`}
                    type="number"
                    className="w-24"
                    defaultValue={product.quantity.toString()}
                    onChange={(event: React.ChangeEvent) => {
                      massEditor.current.addProductField(
                        `${product.id}-quantity`,
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />
                </td>

                <td className="excel-cell">
                  <input
                    id={`${product.id}-unit_cost_price`}
                    type="number"
                    className="w-24"
                    defaultValue={product.unit_cost_price.toString()}
                    onChange={(event: React.ChangeEvent) => {
                      massEditor.current.addProductField(
                        `${product.id}-unit_cost_price`,
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />
                </td>

                <td>
                  <input
                    id={`${product.id}-unit_sell_price`}
                    type="number"
                    className="w-24"
                    defaultValue={product.unit_sell_price.toString()}
                    onChange={(event: React.ChangeEvent) => {
                      massEditor.current.addProductField(
                        `${product.id}-unit_sell_price`,
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />
                </td>

                <td>
                  <input
                    id={`${product.id}-dozen_cost_price`}
                    type="number"
                    className="w-24"
                    defaultValue={product?.dozen_cost_price?.toString() ?? "0"}
                    onChange={(event: React.ChangeEvent) => {
                      massEditor.current.addProductField(
                        `${product.id}-dozen_cost_price`,
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />
                </td>

                <td className="excel-cell">
                  <input
                    id={`${product.id}-dozen_sell_price`}
                    type="number"
                    className="w-24"
                    defaultValue={product?.dozen_sell_price?.toString() ?? "0"}
                    onChange={(event: React.ChangeEvent) => {
                      massEditor.current.addProductField(
                        `${product.id}-dozen_sell_price`,
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />
                </td>

                <td className="excel-cell">
                  <input
                    id={`${product.id}-pack_cost_price`}
                    type="number"
                    className="w-24"
                    defaultValue={product?.pack_cost_price?.toString() ?? "0"}
                    onChange={(event: React.ChangeEvent) => {
                      massEditor.current.addProductField(
                        `${product.id}-pack_cost_price`,
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />
                </td>

                <td className="excel-cell">
                  <input
                    id={`${product.id}-pack_sell_price`}
                    type="number"
                    className="w-24"
                    defaultValue={product?.pack_sell_price?.toString() ?? "0"}
                    onChange={(event: React.ChangeEvent) => {
                      massEditor.current.addProductField(
                        `${product.id}-pack_sell_price`,
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />
                </td>

                <td className="excel-cell">
                  <input
                    id={`${product.id}-pack_quantity`}
                    type="number"
                    className="w-24"
                    defaultValue={product?.pack_quantity?.toString() ?? "0"}
                    onChange={(event: React.ChangeEvent) => {
                      massEditor.current.addProductField(
                        `${product.id}-pack_quantity`,
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />
                </td>

                <td className="excel-cell">
                  <input
                    id={`${product.id}-notify_quantity`}
                    type="number"
                    className="w-24"
                    defaultValue={product?.notify_quantity?.toString() ?? "0"}
                    onChange={(event: React.ChangeEvent) => {
                      massEditor.current.addProductField(
                        `${product.id}-notify_quantity`,
                        (event.target as HTMLInputElement).value
                      );
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

class MassEditor {
  editedProductFieldToValue: any;

  constructor() {
    this.editedProductFieldToValue = {};
  }

  addProductField(productFieldString: string, value: string) {
    this.editedProductFieldToValue[productFieldString] = value;
  }
}
