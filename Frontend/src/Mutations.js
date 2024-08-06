import { gql } from '@apollo/client';

export const INCREMENT_CART_ITEM_QUANTITY = gql`
  mutation IncrementCartItem($id: Int!) {
    incrementCartItemQuantity(id: $id)
  }
`;

export const DECREMENT_CART_ITEM_QUANTITY = gql`
  mutation DecrementCartItem($id: Int!) {
    decrementCartItemQuantity(id: $id)
  }
`;

export const REMOVE_CART_ITEM = gql`
  mutation RemoveCartItem($id: Int!) {
    removeCartItem(id: $id)
  }
`;

export const ADD_ITEM_TO_CART = gql`
  mutation AddItemToCart($productId: String!, $selectedAttributes: [SelectedAttributeInput!]!) {
    addItemToCart(productId: $productId, selectedAttributes: $selectedAttributes)
  }
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder {
    placeOrder
  }
`;