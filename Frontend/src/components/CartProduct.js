import React from "react";
import CartAttribute from './CartAttribute';
import {
  INCREMENT_CART_ITEM_QUANTITY,
  DECREMENT_CART_ITEM_QUANTITY,
  REMOVE_CART_ITEM,
} from "../Mutations";
import { GET_CART_ITEMS } from "../Queries";
import withApolloConsumer from "./hocs/withApolloConsumer";

class CartProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  setLoading(loading) {
    this.setState({ loading });
  }

  handleIncrement = () => {
    this.setLoading(true);
    this.props.client
      .mutate({
        mutation: INCREMENT_CART_ITEM_QUANTITY,
        variables: { id: this.props.cartItem.id },
        refetchQueries: [{ query: GET_CART_ITEMS }],
      })
      .then(() => {
        this.props.refetchCartItems();
        this.setLoading(false);
      });
  };

  handleDecrement = () => {
    this.setLoading(true);
    if (this.props.cartItem.quantity === 1) {
      this.props.client
        .mutate({
          mutation: REMOVE_CART_ITEM,
          variables: { id: this.props.cartItem.id },
          refetchQueries: [{ query: GET_CART_ITEMS }],
        })
        .then(() => {
          this.props.refetchCartItems();
          this.setLoading(false);
        });
    } else {
      this.props.client
        .mutate({
          mutation: DECREMENT_CART_ITEM_QUANTITY,
          variables: { id: this.props.cartItem.id },
          refetchQueries: [{ query: GET_CART_ITEMS }],
        })
        .then(() => {
          this.props.refetchCartItems();
          this.setLoading(false);
        });
    }
  };

  render() {
    const { cartItem } = this.props;
    const { loading } = this.state;
    const product = cartItem.product;

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
            onClick={this.handleIncrement}
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
            onClick={this.handleDecrement}
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
}

export default withApolloConsumer(CartProduct);
