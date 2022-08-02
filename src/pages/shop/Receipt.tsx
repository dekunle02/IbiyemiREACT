import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "../../context/AuthContext";

import { HiPrinter } from "react-icons/hi";
import { LoadStates } from "../../constants/constants";
import Spinner from "../../components/Spinner";
import LoadFailedMessage from "../../components/LoadFailedMessage";
import { RequestStatus } from "../../api/django";
import { Sale, BusinessInfo } from "../../api/interfaces";
import {
  calculateCartItemSellingPrice,
  calculateCartSellingPrice,
  calculateTotalItemsInCart,
} from "../../helpers/cart-helpers";
import { formatRawDate, formatMoney } from "../../helpers/format-helpers";

function ReceiptPage() {
  const { id } = useParams();
  const django = useApi();
  const [receipt, setReceipt] = useState<Sale | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [loadState, setLoadState] = useState(LoadStates.Loading);

  useEffect(() => {
    if (id) {
      Promise.all([django.getSale(id), django.getBusinessInfo()]).then(
        (responseArr) => {
          const statusArr = responseArr.filter(
            (response) => response.status === RequestStatus.Success
          );
          if (statusArr.length === 2) {
            const sale = responseArr[0].data as Sale;
            setReceipt(sale);
            const businessInfo = responseArr[1].data as BusinessInfo;
            setBusinessInfo(businessInfo);
            setLoadState(LoadStates.Success);
          } else {
            setLoadState(LoadStates.Failure);
          }
        }
      );
    }
  }, [django, id]);

  return (
    <div className="fixed top-0 right-0 z-20 w-screen h-screen bg-white">
      {loadState === LoadStates.Loading && <Spinner />}
      {loadState === LoadStates.Failure && <LoadFailedMessage />}
      {loadState === LoadStates.Success && receipt && businessInfo && (
        <>
          <button
            onClick={() => window.print()}
            className="button icon-button print:hidden m-5"
          >
            <HiPrinter />
            Click To Print
          </button>
          <div className="text-sm">
            <span>Ibiyemi Bookshop</span>
            <br />
            <span>{businessInfo.address}</span>
            <br />
            <span>{businessInfo.phone_numbers}</span>
            <br />
            <br />
            <span>Receipt #{receipt.transaction_id}</span>
            <br />
            <span>Date: {formatRawDate(receipt.date_ordered)}</span>
            <br />
            <br />
            <span>Sold to: {receipt.customer.name}</span>
            <br />
            <span>Sold by: {receipt.user.username}</span>
            <table>
              <thead className="border-b border-black">
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>₦</th>
                </tr>
              </thead>

              <tbody>
                {receipt.sale_items.map((cartItem) => (
                  <tr>
                    <td>{cartItem.product.name}</td>
                    <td>{cartItem.quantity}</td>
                    <td>
                      {formatMoney(calculateCartItemSellingPrice(cartItem))}
                    </td>
                  </tr>
                ))}

                <tr className="border-b border-t border-black">
                  <td>Total</td>
                  <td>
                    {calculateTotalItemsInCart(receipt.sale_items)} item(s)
                  </td>
                  <td>
                    {formatMoney(calculateCartSellingPrice(receipt.sale_items))}
                  </td>
                </tr>
              </tbody>
            </table>
            <span> Paid:{formatMoney(receipt.amount_received)} </span>
            <br />
            <span> Change:{formatMoney(receipt.change)}</span>
            <br />
            <br />
            <p>{businessInfo.receipt_message}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default ReceiptPage;
