function TopSellingProducts() {
  return (
    <div className="border rounded-2xl p-3">
      <h3 className="text-xl">Top Selling Products</h3>
      <h6 className="font-thin">Last 7 days</h6>

      <table className="w-full text-center">
        <thead>
          <tr className="border-b my-2">
            <th>#</th>
            <th>Product</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Earnings</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1.</td>
            <td>Macmillan Book</td>
            <td>Books</td>
            <td>234</td>
            <td>$5,230</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TopSellingProducts;
