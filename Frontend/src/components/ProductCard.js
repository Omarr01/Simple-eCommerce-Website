import React from "react";
import { ReactComponent as AddToCartIcon } from "../assets/addToCartIcon.svg";
import { useMutation } from "@apollo/client";
import { ADD_ITEM_TO_CART } from "../Mutations";
import { Link } from "react-router-dom";

function ProductCard({ product, toggleCart }) {
  const [addItemToCart] = useMutation(ADD_ITEM_TO_CART);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    await addItemToCart({
      variables: {
        productId: product.pid,
        selectedAttributes:
          product.attributes.length !== 0
            ? product.attributes.map((attribute) => ({
                attributeName: attribute.key,
                attributeId: attribute.values[0].id,
              }))
            : [],
      },
    });
    toggleCart();
  };

  const toKebabCase = (str) => {
    return str.toLowerCase()
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/[\s_]+/g, "-")
      .toLowerCase();
  };

  const productNameKebabCase = toKebabCase(product.name);
  
  return (
    <div
      className="group max-w-md mx-auto"
      data-testid={`product-${productNameKebabCase}`}
    >
      <Link to={`/product/${product.pid}`}>
        <div className="relative p-4 overflow-hidden group-hover:shadow-lg transition-shadow duration-200 cursor-pointer">
          <div className="relative w-52 h-52 sm:w-48 sm:h-48 md:w-60 md:h-60 lg:w-60 lg:h-60 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 overflow-hidden ">
            <img
              src={product.gallery[0].imageUrl}
              alt={product.name}
              className={`w-full h-full object-contain object-center ${
                !product.inStock && "opacity-50"
              }`}
            />
            {!product.inStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl text-gray-400">OUT OF STOCK</span>
              </div>
            )}
          </div>
          <div className="mt-4 text-left">
            <p className="text-base">{product.name}</p>
            <p className="mt-1 font-medium">
              {product.prices[0].currency.symbol}
              {product.prices[0].amount}
            </p>
          </div>
          {product.inStock && (
            <div className="absolute bottom-11 right-4 sm:right-3 md:right-5 lg:right-8 xl:right-11 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <AddToCartIcon onClick={handleAddToCart} />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default ProductCard;
