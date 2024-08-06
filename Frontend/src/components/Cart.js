import React from "react";
import CartProduct from "./CartProduct";
import { useQuery } from "@apollo/client";
import { GET_CART_ITEMS } from "../Queries";
import { useMutation } from "@apollo/client";
import { PLACE_ORDER } from "../Mutations";

function Cart({ toggleCart, isCartOpen, setTotalQuantity }) {
  const { loading, error, data, refetch } = useQuery(GET_CART_ITEMS);
  const [placeOrder] = useMutation(PLACE_ORDER, {
    refetchQueries: [{ query: GET_CART_ITEMS }],
  });

  React.useEffect(() => {
    if (isCartOpen) {
      refetch();
    }
  }, [isCartOpen, refetch]);

  React.useEffect(() => {
    if (data) {
      const totalQuantity = data.cart.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      setTotalQuantity(totalQuantity);
    }
  }, [data, setTotalQuantity]);

  if (loading || !data) return <></>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCloseCart = (e) => {
    if (e.target.id === "overlay") {
      toggleCart();
    }
  };

  const calculateTotal = () => {
    let total = 0;
    for (let i = 0; i < data.cart.length; i++) {
      const item = data.cart[i];
      const itemPrice = item.product.prices[0].amount;
      total += itemPrice * item.quantity;
    }
    return parseFloat(total.toFixed(2));
  };

  return (
    <div
      id="overlay"
      className="fixed inset-0 top-20 bg-gray-300 bg-opacity-50 flex justify-end z-50"
      onClick={handleCloseCart}
    >
      <div className="bg-white w-full h-full sm:w-96 sm:h-160 p-4 py-8 sm:mr-20 md:mr-24 flex flex-col">
        <div className="flex items-center text-lg">
          <p className="font-bold mr-1">My Bag,</p>
          <p className="font-medium">
            {data.cart.reduce((acc, item) => acc + item.quantity, 0)}{" "}
            {data.cart.reduce((acc, item) => acc + item.quantity, 0) === 1
              ? "item"
              : "items"}
          </p>
        </div>
        <div className="mb-auto overflow-y-scroll hide-scrollbar flex flex-col items-center">
          {data.cart.map((cartItem) => (
            <CartProduct key={cartItem.id} cartItem={cartItem} />
          ))}
        </div>
        <div className="pt-5">
          <div className="flex justify-center text-base font-bold">
            <p className="mr-auto">Total</p>
            <p data-testid="cart-total">${calculateTotal()}</p>
          </div>
          <button
            className={`w-full bg-customGreen text-white text-sm font-semibold py-4 mt-4 ${
              data.cart.length === 0 && "opacity-50 cursor-not-allowed"
            }`}
            onClick={placeOrder}
            disabled={data.cart.length === 0}
            data-testid="cart-btn"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
