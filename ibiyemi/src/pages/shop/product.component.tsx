import { Product } from "../../api/interfaces";

interface ComponentProp {
  product: Product;
}

function ProductComponent({ product }: ComponentProp): JSX.Element {
  return <div className="py-10">{product.name}</div>;
}

export default ProductComponent;
