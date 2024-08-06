import React from "react";
import { useLocation } from 'react-router-dom';
import ProductGrid from "./ProductGrid";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_LISTING } from "../Queries";
import { Helmet } from "react-helmet";

function ProductList({ toggleCart }) {
  const { loading, error, data } = useQuery(GET_PRODUCT_LISTING);

  const location = useLocation();
  const path = location.pathname;
  const category = path.substring(path.lastIndexOf('/') + 1);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-black"></div>
      </div>
    );
  }
  if (error) return <p>Error: {error.message}</p>;

  const filteredProducts = category === 'clothes' || category === 'tech'
    ? data.products.filter((product) => product.category === category)
    : data.products;

  return (
    <>
      <Helmet>
        <title>
          Product Listing{category ? ` - ${category.toUpperCase()}` : ""}
        </title>
      </Helmet>
      <div>
        <ProductGrid
          products={filteredProducts}
          toggleCart={toggleCart}
        />
      </div>
    </>
  );
}

export default ProductList;
