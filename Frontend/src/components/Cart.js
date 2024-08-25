import React from "react";
import CartProduct from "./CartProduct";
import { GET_CART_ITEMS } from "../Queries";
import { PLACE_ORDER } from "../Mutations";
import withApolloConsumer from "./hocs/withApolloConsumer";

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      data: null,
    };

    this.refetchCartItems = this.refetchCartItems.bind(this);
  }

  componentDidMount() {
    if (this.props.isCartOpen) {
      this.refetchCartItems();
    }
  }

  refetchCartItems() {
    this.props.client
      .query({ 
        query: GET_CART_ITEMS,
        fetchPolicy: 'network-only'
      })
      .then((result) => {
        const totalQuantity = result.data.cart.reduce((acc, item) => acc + item.quantity, 0);
        this.props.setTotalQuantity(totalQuantity);
        this.setState({ data: result.data, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  }

  placeOrder = () => {
    this.props.client
      .mutate({
        mutation: PLACE_ORDER
      })
      .then(() => {
        this.refetchCartItems();
      });
  };

  handleCloseCart = (e) => {
    if (e.target.id === "overlay") {
      this.props.toggleCart();
    }
  };

  calculateTotal = () => {
    const { data } = this.state;
    let total = 0;
    for (let i = 0; i < data.cart.length; i++) {
      const item = data.cart[i];
      const itemPrice = item.product.prices[0].amount;
      total += itemPrice * item.quantity;
    }
    return parseFloat(total.toFixed(2));
  };

  render() {
    const { loading, error, data } = this.state;

    if (loading || !data) return null;
    if (error) return <p>Error: {error.message}</p>;

    return (
      <div
        id="overlay"
        className="fixed inset-0 top-20 bg-gray-300 bg-opacity-50 flex justify-end z-50"
        onClick={this.handleCloseCart}
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
              <CartProduct
                key={cartItem.id}
                cartItem={cartItem}
                refetchCartItems={this.refetchCartItems}
              />
            ))}
          </div>
          <div className="pt-5">
            <div className="flex justify-center text-base font-bold">
              <p className="mr-auto">Total</p>
              <p data-testid="cart-total">${this.calculateTotal()}</p>
            </div>
            <button
              className={`w-full bg-customGreen text-white text-sm font-semibold py-4 mt-4 ${
                data.cart.length === 0 && "opacity-50 cursor-not-allowed"
              }`}
              onClick={this.placeOrder}
              disabled={data.cart.length === 0}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default withApolloConsumer(Cart);
