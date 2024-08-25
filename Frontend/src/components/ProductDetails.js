import React from "react";
import withApolloConsumer from "./hocs/withApolloConsumer";
import ImageSlider from "./ImageSlider";
import parse from "html-react-parser";
import Attribute from "./Attribute";
import { GET_PRODUCT_DETAILS_BY_ID } from "../Queries";
import { ADD_ITEM_TO_CART } from "../Mutations";
import { Helmet } from "react-helmet";
import withLocation from "./hocs/withLocation";

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      data: null,
      selectedAttributes: {},
    };
    this.handleAddToCart = this.handleAddToCart.bind(this);
    this.setSelectedAttributes = this.setSelectedAttributes.bind(this);
  }

  componentDidMount() {
    const { location } = this.props;
    const productId = location.pathname.split("/").pop();

    this.props.client
      .query({
        query: GET_PRODUCT_DETAILS_BY_ID,
        variables: { pid: productId },
      })
      .then((result) => {
        this.setState({ data: result.data, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  }

  setSelectedAttributes(attributeKey, attributeId) {
    this.setState((prevState) => ({
      selectedAttributes: {
        ...prevState.selectedAttributes,
        [attributeKey]: attributeId,
      },
    }));
  }

  async handleAddToCart() {
    const { data, selectedAttributes } = this.state;
    const { toggleCart } = this.props;

    await this.props.client.mutate({
      mutation: ADD_ITEM_TO_CART,
      variables: {
        productId: data.product.pid,
        selectedAttributes: Object.keys(selectedAttributes).map((attrName) => ({
          attributeName: attrName,
          attributeId: selectedAttributes[attrName],
        })),
      },
    });

    toggleCart();
  }

  render() {
    const { loading, error, data } = this.state;

    if (loading) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-black"></div>
        </div>
      );
    }

    if (error) return <p>Error: {error.message}</p>;

    return (
      <>
        <Helmet>
          <title>Product Details</title>
        </Helmet>
        <div className="p-10 flex flex-col sm:flex-row items-start justify-center">
          <div data-testid="product-gallery">
            <ImageSlider images={data.product.gallery} />
          </div>
          <div className="sm:pl-10 mt-4">
            <p className="text-2xl sm:text-xl md:text-2xl font-semibold">
              {data.product.name}
            </p>
            {data.product.attributes.length !== 0 &&
              data.product.attributes.map((attribute) => (
                <Attribute
                  key={attribute.key}
                  attribute={attribute}
                  selectedAttributes={this.state.selectedAttributes}
                  setSelectedAttributes={this.setSelectedAttributes}
                />
              ))}
            <p className="text-sm font-bold mt-4">PRICE:</p>
            <p className="text-2xl font-bold mt-2">
              {data.product.prices[0].currency.symbol}
              {data.product.prices[0].amount}
            </p>
            <div className="flex flex-col text-center">
              <button
                className={`bg-customGreen text-white py-3 px-20 sm:px-14 md:px-16 lg:px-20 mt-4 text-sm font-semibold ${
                  !data.product.inStock && "opacity-50 cursor-not-allowed"
                }`}
                disabled={!data.product.inStock}
                onClick={this.handleAddToCart}
                data-testid="add-to-cart"
              >
                ADD TO CART
              </button>
              {!data.product.inStock && (
                <p className="font-semibold mt-4">OUT OF STOCK</p>
              )}
            </div>
            <div
              className="max-w-96 mt-8 sm:max-w-72"
              data-testid="product-description"
            >
              {parse(data.product.description)}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default withApolloConsumer(withLocation(ProductDetails));
