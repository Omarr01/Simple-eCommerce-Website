import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Header from "./components/Header";
import Cart from "./components/Cart";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCartOpen: false,
      totalQuantity: 0,
    };
  }

  toggleCart = () => {
    this.setState((prevState) => ({
      isCartOpen: !prevState.isCartOpen,
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isCartOpen !== this.state.isCartOpen) {
      if (this.state.isCartOpen) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
    }
  }

  componentWillUnmount() {
    document.body.classList.remove("overflow-hidden");
  }

  render() {
    const { isCartOpen, totalQuantity } = this.state;

    return (
      <Router>
        <div>
          <Header
            toggleCart={this.toggleCart}
            isCartOpen={isCartOpen}
            itemCount={totalQuantity}
          />
          <Routes>
            <Route
              path="/"
              element={<ProductList toggleCart={this.toggleCart} />}
            />
            <Route
              path="/all"
              element={<ProductList toggleCart={this.toggleCart} />}
            />
            <Route
              path="/tech"
              element={<ProductList toggleCart={this.toggleCart} />}
            />
            <Route
              path="/clothes"
              element={<ProductList toggleCart={this.toggleCart} />}
            />
            <Route
              path="/product/:productId"
              element={<ProductDetails toggleCart={this.toggleCart} />}
            />
          </Routes>
          {isCartOpen && (
            <Cart
              toggleCart={this.toggleCart}
              isCartOpen={isCartOpen}
              setTotalQuantity={(quantity) =>
                this.setState({ totalQuantity: quantity })
              }
            />
          )}
        </div>
      </Router>
    );
  }
}

export default App;
