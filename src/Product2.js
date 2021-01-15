import React, { useState, useEffect } from "react";
import Layout from "./core/Layout";
import { read, listRelated } from "./core/apiCore";
import Card from "./core/Card";

const Product = (props) => {
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [error, setError] = useState(false);

  const loadSingleProduct = (productId) => {
    read(productId).then((data) => {
      if (data.error) {
        setError(data.error);
      } else {
        setProduct(data);
        // fetch related products
        listRelated(data._id).then((data) => {
          if (data.error) {
            setError(data.error);
          } else {
            setRelatedProduct(data);
          }
        });
      }
    });
  };

  useEffect(() => {
    const productId = props.match.params.productId;
    loadSingleProduct(productId);
  }, [props]);

  return (
    <Layout
      title={`Order: ${product && product.order}`}
      description={`สถานที่: ${
        product && product.place && product.place.substring(0, 100)
      }`}
      className="container-fluid"
    >
      <div className="row">
        <div className="col-12">
          {product && product.description && (
            <Card
              product={product}
              showViewProductButton={false}
              showEditButton={true}
              showRemoveProductButton={true}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Product;
