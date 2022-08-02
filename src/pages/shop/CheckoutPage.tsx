import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { clearCartItemArr } from "../../redux/cartSlice";
import { useApi } from "../../context/AuthContext";
import BackButton from "../../components/BackButton";
import { Formik } from "formik";
import { customerSchema } from "../../constants/yupSchemas";
import { toastConfig } from "../../constants/constants";
import { toast } from "react-toastify";
import { FormInput } from "../../components/FormInput";

import {
  calculateCartItemSellingPrice,
  calculateCartSellingPrice,
  describeProductQuantity,
  calculateTotalItemsInCart,
} from "../../helpers/cart-helpers";
import { CartItem, PaymentData } from "../../api/interfaces";
import { formatMoney, commaSeparateNumber } from "../../helpers/format-helpers";
import { CustomerFormData } from "../../constants/formData";
import { RequestStatus } from "../../api/django";

const PaymentMethodRadios = [
  { value: "cash", text: "Cash" },
  { value: "transfer", text: "Transfer" },
  { value: "pos", text: "POS" },
  { value: "other", text: "Other" },
];

function CheckoutPage() {
  const dispatch = useAppDispatch();
  const customerForm = useRef(null);
  const django = useApi();
  const navigate = useNavigate();
  const cartItemArr: CartItem[] = useAppSelector(
    (state) => state.cart.cartItemArr
  );
  const cartSellingPrice = calculateCartSellingPrice(cartItemArr);
  const [realAmountReceived, setRealAmountReceived] = useState<number>(0);
  const [amountReceived, setAmountReceived] = useState<string>("0");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [change, setChange] = useState<string>("₦0");

  useEffect(() => {
    if (canCheckOut()) {
      setChange(formatMoney(realAmountReceived - cartSellingPrice));
    } else {
      setChange("₦0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartSellingPrice, realAmountReceived]);

  //   CUSTOMER FORM SUBMIT CO-OPTED TO SUBMIT ALL PAGE DATA
  const handleSubmit = (values: CustomerFormData) => {
    const paymentData: PaymentData = {
      amount_received: realAmountReceived,
      payment_method: paymentMethod,
    };
    const toastId = toast.loading("Making Sale..", toastConfig);
    django.makeSale(values, cartItemArr, paymentData).then((response) => {
      if (response.status === RequestStatus.Success) {
        toast.dismiss(toastId);
        dispatch(clearCartItemArr());
        window.open("/receipt/" + response.data.id, "_blank");
        navigate("/");
      } else {
        toast.update(toastId, {
          render: "Error selling items in cart...",
          type: "error",
          isLoading: false,
          autoClose: 2000,
          hideProgressBar: false,
        });
      }
    });
  };

  const handleRadioFormChange = (event: React.FormEvent) => {
    const radio = event.target as HTMLFormElement;
    setPaymentMethod(radio.value);
  };

  const handleAmountReceivedChange = (event: React.ChangeEvent) => {
    const input = event.target as HTMLInputElement;
    const newValue = input.value;
    if (newValue === "") {
      setAmountReceived("0");
      setRealAmountReceived(0);
      return;
    }
    const formattedValue = parseInt(newValue.replace(",", ""));
    setRealAmountReceived(formattedValue);
    const displayedValue = commaSeparateNumber(formattedValue);
    setAmountReceived(displayedValue);
  };

  const canCheckOut = (): boolean => {
    return realAmountReceived >= cartSellingPrice;
  };

  const handleSellButtonClick = () => {
    if (customerForm.current !== null) {
      const form = customerForm.current as HTMLFormElement;
      form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <div className="p-5 w-full flex flex-col md:grid md:grid-cols-3 md:grid-rows-[min-content_1fr_min-content] gap-5">
      <div className="col-span-3 relative py-5">
        <BackButton />
      </div>

      {/* SALE SUMMARY */}
      <div className="border rounded-xl p-5 md:col-span-2 overflow-auto">
        <h1 className="text-2xl text-center">Sale Summary</h1>
        <table className="w-full">
          <thead className="text-left border-b-2">
            <tr>
              <th className="p-4">Product</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Description</th>
              <th className="p-4">Price</th>
            </tr>
          </thead>
          <tbody>
            {cartItemArr.map((item) => (
              <tr key={item.product.id} className="border-b">
                <td className="p-4">{item.product.name}</td>
                <td className="p-4">x &nbsp;{item.quantity}</td>
                <td className="p-4">
                  {" "}
                  {describeProductQuantity(item.product, item.quantity)}
                </td>
                <td className="p-4">
                  {formatMoney(calculateCartItemSellingPrice(item))}
                </td>
              </tr>
            ))}
            <tr className="text-xl font-semibold">
              <td></td>
              <td className="p-4">TOTAL:</td>
              <td>{calculateTotalItemsInCart(cartItemArr)} item(s)</td>
              <td>{formatMoney(cartSellingPrice)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* PAYMENT */}
      <div className="border rounded-xl p-5 flex flex-col">
        <h1 className="text-2xl text-center">Payment Information</h1>
        <br />

        <div className="my-3 flex flex-row items-center">
          <label htmlFor="amount-received">Enter amount received: ₦</label>
          <input
            id="amount-received"
            value={amountReceived}
            type="text"
            className="w-20 mx-1 rounded-lg focus:border-colorPrimary focus:ring-colorPrimary focus:ring-2 flex-grow"
            onChange={handleAmountReceivedChange}
          />
        </div>

        <p>Payment Method:</p>

        <p className="my-2">
          <form
            onChange={handleRadioFormChange}
            className="flex flex-row gap-2 items-center"
          >
            {PaymentMethodRadios.map((radio) => (
              <>
                <input
                  key={radio.value}
                  type="radio"
                  id={radio.value}
                  name="paymentMethod"
                  value={radio.value}
                  checked={radio.value === paymentMethod}
                />
                <label htmlFor={radio.value}>{radio.text}</label>
              </>
            ))}
          </form>
        </p>

        <p className="text-center text-lg my-5">Change: {change}</p>

        <button
          className={`${
            canCheckOut() ? "success-button" : "inactive-button"
          }  w-3/4 mx-auto mt-auto mb-5`}
          onClick={handleSellButtonClick}
        >
          Confirm Sale
        </button>
      </div>

      {/* Customer information */}
      <div className="col-span-2 border rounded-xl p-2">
        <h1 className="text-2xl text-center">Customer Information</h1>
        <div className="w-3/4 mx-auto mt-5">
          <Formik
            initialValues={{
              name: "",
              email: "",
              address: "",
              phone_number: "",
            }}
            validationSchema={customerSchema}
            onSubmit={handleSubmit}
          >
            {({ values, touched, errors, handleChange, handleSubmit }) => (
              <form
                className="flex flex-col"
                onSubmit={handleSubmit}
                ref={customerForm}
              >
                <FormInput
                  id="name"
                  type="text"
                  label="Name"
                  showError={!!errors.name && !!touched.name}
                  errorMessage={errors.name}
                  placeholder="Type customer's name"
                  onChange={handleChange}
                  value={values.name}
                />
                <FormInput
                  id="email"
                  type="email"
                  label="Email"
                  showError={!!errors.email && !!touched.email}
                  errorMessage={errors.email}
                  placeholder="customer@email.com"
                  onChange={handleChange}
                  value={values.email}
                />

                <FormInput
                  id="address"
                  type="text"
                  label="Address"
                  showError={!!errors.address && !!touched.address}
                  errorMessage={errors.address}
                  placeholder="Address to show on receipt"
                  onChange={handleChange}
                  value={values.address}
                />

                <FormInput
                  id="phone_number"
                  type="text"
                  label="Phone Number"
                  showError={!!errors.phone_number && !!touched.phone_number}
                  errorMessage={errors.phone_number}
                  placeholder="08000000000000"
                  onChange={handleChange}
                  value={values.phone_number}
                />
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
