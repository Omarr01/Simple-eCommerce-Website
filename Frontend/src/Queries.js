import { gql } from '@apollo/client';

export const GET_PRODUCT_LISTING = gql`
  query {
    products {
      pid
      name
      inStock
      gallery {
        imageUrl
      }
      category
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      attributes {
        key
        values {
          id
          displayValue
          value
          type
        }
      }
    }
  }
`;

export const GET_PRODUCT_DETAILS_BY_ID = gql`
  query GetProductDetailsById($pid: ID!) {
    product(id: $pid) {
      pid
      name
      inStock
      gallery {
        imageUrl
      }
      description
      category
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      brand
      attributes {
        key
        values {
          id
          displayValue
          value
          type
        }
      }
    }
  }
`;

export const GET_CART_ITEMS = gql`
  query {
    cart {
      id
      product {
        pid
        name
        gallery {
          imageUrl
        }
        prices {
          amount
          currency {
            label
            symbol
          }
        }
        attributes {
          key
          values {
            id
            displayValue
            value
            type
          }
        }
      }
      selectedAttributes {
        attributeName
        attributeId
      }
      quantity
    }
  }
`;

