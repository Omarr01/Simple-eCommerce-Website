import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as ViewCartIcon } from '../assets/viewCartIcon.svg';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: 'ALL'
    };
    this.categories = ['ALL', 'CLOTHES', 'TECH'];
  }

  handleChangeCategory = (category) => () => {
    this.setState({ selectedCategory: category });
  };

  render() {
    const { toggleCart, isCartOpen, itemCount } = this.props;
    const { selectedCategory } = this.state;

    return (
      <header className="sticky top-0 bg-white z-50 flex items-center py-5">
        <div className="absolute left-0 ml-8 md:ml-40 flex space-x-4 lg:space-x-8">
          {this.categories.map((category) => (
            <div 
              key={category} 
              className="relative cursor-pointer"
              onClick={this.handleChangeCategory(category)}
              data-testid={selectedCategory === category ? 'active-category-link' : 'category-link'}
            >
              <Link to={`/${category.toLowerCase()}`}>
                <span 
                  className={`text-xs ${selectedCategory === category ? 'text-customGreen' : 'hover:customGreen'}`}
                >
                  {category}
                </span>
                {selectedCategory === category && (
                  <div className="absolute top-12 left-0 right-0 bottom-0 h-0.5 bg-customGreen" />
                )}
              </Link>
            </div>
          ))}
        </div>
        <div className="flex flex-grow justify-center">
          <Logo />
        </div>
        <div className="absolute right-0 mr-8 md:mr-40 cursor-pointer" onClick={toggleCart}>
          <ViewCartIcon data-testid="cart-btn" />
          {isCartOpen && itemCount > 0 && (
            <div className="absolute -top-2 -right-3 w-5 h-5 flex justify-center items-center bg-black rounded-full text-white text-xs font-bold">
              {itemCount}
            </div>
          )}
        </div>
      </header>
    );
  }
}

export default Header;
