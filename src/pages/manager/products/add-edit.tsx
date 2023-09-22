import React, { useState, useEffect } from "react";
import { Product, Category } from "../../../api/interfaces";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../../../context/AuthContext";
import { LoadStates } from "../../../constants/constants";
import { FormInput, FormSelectInput } from "../../../components/FormInputv2";
import { ProductFormData } from "../../../constants/formData";
import Spinner from "../../../components/Spinner";
import BackButton from "../../../components/BackButton";

const DefaultProductFormData: ProductFormData = {
  name: "",
  description: "",
  quantity: 0,
  category: 0,
  unit_cost_price: 0,
  unit_sell_price: 0,
  dozen_cost_price: 0,
  dozen_sell_price: 0,
  pack_cost_price: 0,
  pack_sell_price: 0,
  barcode: "0",
  notify_quantity: 0,
  pack_quantity: 0,
};

function mapProductToFormData(product: Product) {
  const formData: any = { ...DefaultProductFormData };
  Object.keys(product).forEach((k) => {
    let v = product[k as keyof Product];
    if (k === "category") {
      v = (v as Category).id;
    }
    if (v && k !== "id") formData[k] = v;
  });
  return formData as ProductFormData;
}

export default function ProductAddEdit() {
  const django = useApi();
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState(
    DefaultProductFormData
  );
  const [changedProductFormData, setChangedProductFormData] = useState({});
  const [categoryArr, setCategoryArr] = useState<Category[]>([]);
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    django.getCategories().then((res) => {
      if (res.status === django.SUCCESS) {
        setCategoryArr(res.data);
        setLoadState(LoadStates.Success);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django]);

  useEffect(() => {
    if (!id || isNaN(parseFloat(id))) return;
    django.getProduct(parseInt(id)).then((res) => {
      if (res.status === django.SUCCESS) {
        setProduct(res.data);
        setProductFormData(mapProductToFormData(res.data));
        setLoadState(LoadStates.Success);
      } else {
        setLoadState(LoadStates.Failure);
      }
    });
  }, [django, id]);

  function submitNewProduct() {
    django.addProduct(productFormData).then((res) => {
      if (res.status === django.SUCCESS) {
        alert("Saved!");
      } else {
        alert("Not Saved!");
      }
    });
  }
  function updateProduct() {
    if (!product) return;
    django
      .editProduct(product?.id, changedProductFormData as ProductFormData)
      .then((res) => {
        if (res.status === django.SUCCESS) {
          alert("Saved!");
        } else {
          alert("Not Saved!");
        }
      });
  }

  const save = product ? updateProduct : submitNewProduct;

  function handleSave(event: React.FormEvent) {
    event.preventDefault();
    save();
  }

  function handleSaveAndAddAnother() {
    save();
    navigate("/manager/products/new");
    window.location.reload();
  }

  function handleFormChange(event: React.ChangeEvent) {
    const target = event.target as HTMLInputElement;

    const prevFormData: any = { ...productFormData };
    prevFormData[target.id] = target.value;
    setProductFormData(prevFormData);

    const prevChangedFormData: any = { ...changedProductFormData };
    prevChangedFormData[target.id] = target.value;
    setChangedProductFormData(prevChangedFormData);
  }

  return (
    <div>
      <div className="flex flex-row flex-wrap gap-2 relative items-center">
        {/* {product ? (
          <MdEdit className="font-semibold text-3xl text-colorBlack/80" />
        ) : (
          <MdAdd className="font-semibold text-3xl text-colorBlack/80" />
        )} */}
        <BackButton relative />
        <h1 className="font-semibold text-3xl text-colorBlack/80 flex-grow">
          {product ? "Edit Product" : "Create A Product"}
        </h1>
      </div>
      {loadState === LoadStates.Loading && <Spinner />}
      <form
        className="flex flex-col md:px-10 md:py-5 md:border md:my-10 rounded"
        onSubmit={handleSave}
      >
        <FormInput
          id="name"
          type="text"
          onChange={handleFormChange}
          label="Product Name"
          value={productFormData?.name}
        />
        <FormSelectInput
          id="category"
          label="Category"
          onChange={handleFormChange}
          // value={productFormData?.category}
          type="select"
        >
          <option value={productFormData?.category}>
            {product?.category?.name}
          </option>
          {categoryArr.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </FormSelectInput>

        <FormInput
          id="quantity"
          label="Quantity In Stock"
          onChange={handleFormChange}
          value={productFormData?.quantity}
          type="number"
        />

        <FormInput
          id="pack_quantity"
          label="Quantity In A Pack"
          onChange={handleFormChange}
          value={productFormData?.pack_quantity}
          type="number"
        />

        <FormInput
          id="notify_quantity"
          label="Quantity You want to be notified"
          onChange={handleFormChange}
          value={productFormData?.notify_quantity}
          type="number"
        />

        <FormInput
          id="unit_cost_price"
          type="money"
          onChange={handleFormChange}
          label="Cost price of Single Item"
          value={productFormData?.unit_cost_price}
        />

        <FormInput
          id="pack_cost_price"
          type="money"
          onChange={handleFormChange}
          label="Cost price of a Pack (₦)"
          value={productFormData?.pack_cost_price}
        />
        <FormInput
          id="dozen_cost_price"
          type="money"
          onChange={handleFormChange}
          label="Cost price of a Dozen (₦)"
          value={productFormData?.dozen_cost_price}
        />

        <FormInput
          id="unit_sell_price"
          type="money"
          onChange={handleFormChange}
          label="Selling price of a Single Item (₦)"
          value={productFormData?.unit_sell_price}
        />

        <FormInput
          id="pack_sell_price"
          type="money"
          onChange={handleFormChange}
          label="Selling price of a Pack (₦)"
          value={productFormData?.pack_sell_price}
        />

        <FormInput
          id="dozen_sell_price"
          type="money"
          onChange={handleFormChange}
          label="Selling price of a Dozen (₦)"
          value={productFormData?.dozen_sell_price}
        />

        <FormInput
          id="description"
          type="textarea"
          onChange={handleFormChange}
          label="Description"
          value={productFormData?.description}
        />

        <button className="button w-3/4 lg:w-1/2 mx-auto">Save</button>

        <button
          className="outline-button my-3 w-3/4 lg:w-1/2 mx-auto"
          type="button"
          onClick={handleSaveAndAddAnother}
        >
          Save And Add Another
        </button>
      </form>
    </div>
  );
}
