import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import ProductDetails from "./components/ProductDetails";
import Header from "./components/Header";
import Cart from "./components/Cart";

function App() {
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [totalQuantity, setTotalQuantity] = React.useState(0);

  const toggleCart = () => {
    setIsCartOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isCartOpen]);

  return (
    <Router>
      <div>
        <Header
          toggleCart={toggleCart}
          isCartOpen={isCartOpen}
          itemCount={totalQuantity}
        />
        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                toggleCart={toggleCart}
              />
            }
          />
          <Route
            path="/all"
            element={
              <ProductList
                toggleCart={toggleCart}
              />
            }
          />
          <Route
            path="/tech"
            element={
              <ProductList
                toggleCart={toggleCart}
              />
            }
          />
          <Route
            path="/clothes"
            element={
              <ProductList
                toggleCart={toggleCart}
              />
            }
          />
          <Route
            path="/product/:productId"
            element={<ProductDetails toggleCart={toggleCart} />}
          />
        </Routes>
        {isCartOpen && (
          <Cart
            toggleCart={toggleCart}
            isCartOpen={isCartOpen}
            setTotalQuantity={setTotalQuantity}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
