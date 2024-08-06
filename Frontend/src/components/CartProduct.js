import React, { useState } from "react";
import CartAttribute from "./CartAttribute";
import { useMutation } from "@apollo/client";
import {
  INCREMENT_CART_ITEM_QUANTITY,
  DECREMENT_CART_ITEM_QUANTITY,
  REMOVE_CART_ITEM,
} from "../Mutations";
import { GET_CART_ITEMS } from "../Queries";

function CartProduct({ cartItem }) {
  const [loading, setLoading] = useState(false);

  const [incrementCartItem] = useMutation(INCREMENT_CART_ITEM_QUANTITY, {
    refetchQueries: [{ query: GET_CART_ITEMS }],
    onCompleted: () => setLoading(false),
  });

  const [decrementCartItem] = useMutation(DECREMENT_CART_ITEM_QUANTITY, {
    refetchQueries: [{ query: GET_CART_ITEMS }],
    onCompleted: () => setLoading(false),
  });

  const [removeCartItem] = useMutation(REMOVE_CART_ITEM, {
    refetchQueries: [{ query: GET_CART_ITEMS }],
    onCompleted: () => setLoading(false),
  });

  const handleIncrement = () => {
    setLoading(true);
    incrementCartItem({ variables: { id: cartItem.id } });
  };

  const handleDecrement = () => {
    setLoading(true);
    if (cartItem.quantity === 1) {
      removeCartItem({ variables: { id: cartItem.id } });
    } else {
      decrementCartItem({ variables: { id: cartItem.id } });
    }
  };

  let product = cartItem.product;

  return (
    <div className="relative flex flex-row items-center w-full mt-5">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-black"></div>
        </div>
      )}
      <div className="mr-auto">
        <p className="truncate text-lg max-w-48">{product.name}</p>
        <p className="font-semibold mt-2">
          {product.prices[0].currency.symbol}
          {product.prices[0].amount * cartItem.quantity}
        </p>
        {product.attributes.length !== 0 &&
          product.attributes.map((attribute) => (
            <CartAttribute
              key={attribute.key}
              attribute={attribute}
              selectedAttributes={cartItem.selectedAttributes}
            />
          ))}
      </div>
      <div className="flex flex-col items-center h-full mr-3">
        <button
          className="w-7 h-7 text-4xl border bg-white text-black border-black flex items-center justify-center hover:bg-black hover:text-white"
          onClick={handleIncrement}
          disabled={loading}
          data-testid="cart-item-amount-increase"
        >
          +
        </button>
        <p className="text-xl my-auto" data-testid="cart-item-amount">
          {cartItem.quantity}
        </p>
        <button
          className="w-7 h-7 text-4xl border bg-white text-black border-black flex items-center justify-center hover:bg-black hover:text-white"
          onClick={handleDecrement}
          disabled={loading}
          data-testid="cart-item-amount-decrease"
        >
          -
        </button>
      </div>
      <img
        src={product.gallery[0].imageUrl}
        alt={product.name}
        className="w-28 h-full object-contain"
      />
    </div>
  );
}

export default CartProduct;
