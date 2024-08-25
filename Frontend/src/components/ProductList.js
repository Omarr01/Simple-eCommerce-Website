import React from "react";
import { GET_PRODUCT_LISTING } from "../Queries";
import { Helmet } from "react-helmet";
import ProductGrid from "./ProductGrid";
import withLocation from './hocs/withLocation';
import withApolloConsumer from "./hocs/withApolloConsumer";

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      data: null,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({ loading: true, error: null });

    this.props.client
      .query({ query: GET_PRODUCT_LISTING })
      .then((result) => {
        this.setState({
          data: result.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: error,
          loading: false,
        });
      });
  }

  render() {
    const { loading, error, data } = this.state;
    const { toggleCart, location } = this.props;

    const category = location.pathname.split("/").pop();

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
}

export default withApolloConsumer(withLocation(ProductList));
