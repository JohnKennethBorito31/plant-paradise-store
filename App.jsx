import React, { useState, createContext, useContext, useReducer } from 'react';

// Create a Cart Context to replace Redux
const CartContext = createContext();

// Cart reducer to manage state
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const newItem = action.payload;
      const existingItem = state.items.find(item => item.id === newItem.id);

      if (!existingItem) {
        return {
          ...state,
          items: [
            ...state.items,
            {
              ...newItem,
              quantity: 1,
              totalPrice: newItem.price,
            },
          ],
          totalQuantity: state.totalQuantity + 1,
          totalAmount: state.totalAmount + newItem.price,
        };
      } else {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === newItem.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                  totalPrice: item.totalPrice + item.price,
                }
              : item
          ),
          totalQuantity: state.totalQuantity + 1,
          totalAmount: state.totalAmount + newItem.price,
        };
      }

    case 'REMOVE_ITEM':
      const idToRemove = action.payload;
      const itemToRemove = state.items.find(item => item.id === idToRemove);

      if (itemToRemove.quantity === 1) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== idToRemove),
          totalQuantity: state.totalQuantity - 1,
          totalAmount: state.totalAmount - itemToRemove.price,
        };
      } else {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === idToRemove
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                  totalPrice: item.totalPrice - item.price,
                }
              : item
          ),
          totalQuantity: state.totalQuantity - 1,
          totalAmount: state.totalAmount - itemToRemove.price,
        };
      }

    case 'DELETE_ITEM':
      const idToDelete = action.payload;
      const itemToDelete = state.items.find(item => item.id === idToDelete);

      return {
        ...state,
        items: state.items.filter(item => item.id !== idToDelete),
        totalQuantity: state.totalQuantity - itemToDelete.quantity,
        totalAmount: state.totalAmount - itemToDelete.totalPrice,
      };

    default:
      return state;
  }
};

// Cart Provider Component
const CartProvider = ({ children }) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    items: [],
    totalQuantity: 0,
    totalAmount: 0,
  });

  const addItemToCart = item => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItemFromCart = id => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const deleteItemFromCart = id => {
    dispatch({ type: 'DELETE_ITEM', payload: id });
  };

  return (
    <CartContext.Provider
      value={{
        cart: cartState,
        addItemToCart,
        removeItemFromCart,
        deleteItemFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Header Component
const Header = () => {
  const { cart } = useCart();

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <a href='#home' style={logoStyle}>
          PLANTOPIA
        </a>

        <nav style={navStyle}>
          <a href='#home' style={linkStyle}>
            Home
          </a>
          <a href='#products' style={linkStyle}>
            Products
          </a>
          <a href='#cart' style={linkStyle}>
            Cart 🛒
            {cart.totalQuantity > 0 && (
              <span style={badgeStyle}>{cart.totalQuantity}</span>
            )}
          </a>
        </nav>
      </div>
    </header>
  );
};

const headerStyle = {
  backgroundColor: '#2d5a27',
  color: 'white',
  padding: '1rem 0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  position: 'fixed',
  top: 0,
  width: '100%',
  zIndex: 1000,
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 2rem',
};

const logoStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '1.5rem',
  fontWeight: 'bold',
};

const navStyle = {
  display: 'flex',
  gap: '2rem',
};

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  position: 'relative',
};

const badgeStyle = {
  position: 'absolute',
  top: '-8px',
  right: '-12px',
  backgroundColor: '#ff4444',
  color: 'white',
  borderRadius: '50%',
  padding: '2px 6px',
  fontSize: '0.8rem',
};

// Landing Page Component
const LandingPage = () => {
  return (
    <div id='home' style={landingContainerStyle}>
      <div style={contentStyle}>
        <h1 style={titleStyle}>PLANTOPIA</h1>
        <p style={paragraphStyle}>
        Welcome to Plantopia, where nature meets your home. We believe every space deserves 
  a touch of greenery, and every plant deserves a loving home. Discover our carefully curated 
  collection of houseplants that bring life, beauty, and fresh air to your indoor spaces. 
  Let's grow together!
        </p>
        <a href='#products'>
          <button style={buttonStyle}>Get Started</button>
        </a>
      </div>
    </div>
  );
};

const landingContainerStyle = {
  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), 
    url('https://i.cbc.ca/1.4350543.1507755955!/fileImage/httpImage/plants.jpg?format=1000w')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '60px',
};

const contentStyle = {
  textAlign: 'center',
  color: 'white',
  maxWidth: '600px',
  padding: '2rem',
};

const titleStyle = {
  fontSize: '3rem',
  marginBottom: '1rem',
};

const paragraphStyle = {
  fontSize: '1.2rem',
  lineHeight: '1.6',
  marginBottom: '2rem',
};

const buttonStyle = {
  backgroundColor: '#2d5a27',
  color: 'white',
  border: 'none',
  padding: '12px 30px',
  fontSize: '1.1rem',
  borderRadius: '5px',
  cursor: 'pointer',
  textDecoration: 'none',
};

// Product Listing Component
const ProductListing = () => {
  const { addItemToCart, cart } = useCart();
  const [addedItems, setAddedItems] = useState(new Set());

  const plants = [
    {
      id: 1,
      name: 'Snake Plant',
      price: 25.99,
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg/1200px-Snake_Plant_%28Sansevieria_trifasciata_%27Laurentii%27%29.jpg',
      category: 'Low Light',
    },
    {
      id: 2,
      name: 'Monstera Deliciosa',
      price: 35.5,
      image:
        'https://www.epicgardening.com/wp-content/uploads/2018/10/Lush-Green-Leaves-with-Signature-Split-Patterns.jpg',
      category: 'Medium Light',
    },
    {
      id: 3,
      name: 'Fiddle Leaf Fig',
      price: 45.0,
      image:
        'https://www.makeoveridea.com/wp-content/uploads/fiddle-leaf-fig-outdoors/Ficus-Lyrata-Fiddle-Leaf-Fig-Outdoors.jpg',
      category: 'Bright Light',
    },
    {
      id: 4,
      name: 'ZZ Plant',
      price: 22.99,
      image:
        'https://www.almanac.com/sites/default/files/styles/or/public/image_nodes/ZZ-plant-shutterstock_2104983308.jpg?itok=PcfMNu3r',
      category: 'Low Light',
    },
    {
      id: 5,
      name: 'Peace Lily',
      price: 28.75,
      image:
        'https://orchidrepublic.com/cdn/shop/articles/Blooming-white-flowers-spathiphyllum.-805418714_4200x3019_fb2f9f32-d2ba-4fd0-9177-6439d1f7b9e1_1200x600_crop_center.jpg?v=1750658072',
      category: 'Medium Light',
    },
    {
      id: 6,
      name: 'Rubber Plant',
      price: 32.99,
      image:
        'https://plantcaretoday.com/wp-content/uploads/LHF-52036-variegated-rubber-plant-t1-min-1024x538.jpg',
      category: 'Bright Light',
    },
  ];

  const categories = [...new Set(plants.map(plant => plant.category))];

  const handleAddToCart = plant => {
    addItemToCart(plant);
    setAddedItems(prev => new Set(prev).add(plant.id));
  };

  return (
    <div id='products' style={productContainerStyle}>
      <h1 style={productTitleStyle}>Our Plants</h1>

      {categories.map(category => (
        <div key={category} style={categorySectionStyle}>
          <h2 style={categoryTitleStyle}>{category} Plants</h2>
          <div style={gridStyle}>
            {plants
              .filter(plant => plant.category === category)
              .map(plant => (
                <div key={plant.id} style={cardStyle}>
                  <img src={plant.image} alt={plant.name} style={imageStyle} />
                  <h3 style={plantNameStyle}>{plant.name}</h3>
                  <p style={priceStyle}>${plant.price}</p>
                  <button
                    onClick={() => handleAddToCart(plant)}
                    disabled={addedItems.has(plant.id)}
                    style={{
                      ...productButtonStyle,
                      ...(addedItems.has(plant.id) ? disabledButtonStyle : {}),
                    }}
                  >
                    {addedItems.has(plant.id) ? 'Added to Cart' : 'Add to Cart'}
                  </button>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const productContainerStyle = {
  maxWidth: '1200px',
  margin: '80px auto 0',
  padding: '2rem',
};

const productTitleStyle = {
  textAlign: 'center',
  color: '#2d5a27',
  marginBottom: '2rem',
};

const categorySectionStyle = {
  marginBottom: '3rem',
};

const categoryTitleStyle = {
  color: '#2d5a27',
  borderBottom: '2px solid #2d5a27',
  paddingBottom: '0.5rem',
  marginBottom: '1rem',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
};

const cardStyle = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  textAlign: 'center',
  backgroundColor: 'white',
};

const imageStyle = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
  borderRadius: '4px',
};

const plantNameStyle = {
  margin: '1rem 0 0.5rem 0',
  color: '#333',
};

const priceStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#2d5a27',
  marginBottom: '1rem',
};

const productButtonStyle = {
  backgroundColor: '#2d5a27',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '4px',
  cursor: 'pointer',
  width: '100%',
};

const disabledButtonStyle = {
  backgroundColor: '#cccccc',
  cursor: 'not-allowed',
};

// Shopping Cart Component
const ShoppingCart = () => {
  const { cart, addItemToCart, removeItemFromCart, deleteItemFromCart } =
    useCart();

  const handleIncrease = plant => {
    addItemToCart(plant);
  };

  const handleDecrease = plantId => {
    removeItemFromCart(plantId);
  };

  const handleDelete = plantId => {
    deleteItemFromCart(plantId);
  };

  if (cart.items.length === 0) {
    return (
      <div id='cart' style={emptyContainerStyle}>
        <h2>Your cart is empty</h2>
        <a href='#products'>
          <button style={continueButtonStyle}>Continue Shopping</button>
        </a>
      </div>
    );
  }

  return (
    <div id='cart' style={cartContainerStyle}>
      <h1 style={cartTitleStyle}>Shopping Cart</h1>

      <div style={summaryStyle}>
        <p>
          Total Items: <strong>{cart.totalQuantity}</strong>
        </p>
        <p>
          Total Cost: <strong>${cart.totalAmount.toFixed(2)}</strong>
        </p>
      </div>

      <div style={cartItemsStyle}>
        {cart.items.map(item => (
          <div key={item.id} style={cartItemStyle}>
            <img src={item.image} alt={item.name} style={cartImageStyle} />

            <div style={itemDetailsStyle}>
              <h3 style={itemNameStyle}>{item.name}</h3>
              <p style={itemPriceStyle}>${item.price} each</p>
            </div>

            <div style={quantityControlsStyle}>
              <button
                onClick={() => handleDecrease(item.id)}
                style={controlButtonStyle}
              >
                -
              </button>
              <span style={quantityStyle}>{item.quantity}</span>
              <button
                onClick={() => handleIncrease(item)}
                style={controlButtonStyle}
              >
                +
              </button>
            </div>

            <div style={totalStyle}>${item.totalPrice.toFixed(2)}</div>

            <button
              onClick={() => handleDelete(item.id)}
              style={deleteButtonStyle}
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <div style={actionsStyle}>
        <button
          onClick={() => alert('Coming Soon!')}
          style={checkoutButtonStyle}
        >
          Checkout
        </button>

        <a href='#products'>
          <button style={continueButtonStyle}>Continue Shopping</button>
        </a>
      </div>
    </div>
  );
};

const cartContainerStyle = {
  maxWidth: '800px',
  margin: '80px auto 0',
  padding: '2rem',
};

const emptyContainerStyle = {
  textAlign: 'center',
  padding: '4rem 2rem',
  marginTop: '80px',
};

const cartTitleStyle = {
  color: '#2d5a27',
  textAlign: 'center',
  marginBottom: '2rem',
};

const summaryStyle = {
  backgroundColor: '#f5f5f5',
  padding: '1rem',
  borderRadius: '8px',
  marginBottom: '2rem',
  display: 'flex',
  justifyContent: 'space-between',
};

const cartItemsStyle = {
  marginBottom: '2rem',
};

const cartItemStyle = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',
  backgroundColor: 'white',
};

const cartImageStyle = {
  width: '80px',
  height: '80px',
  objectFit: 'cover',
  borderRadius: '4px',
  marginRight: '1rem',
};

const itemDetailsStyle = {
  flex: 1,
};

const itemNameStyle = {
  margin: '0 0 0.5rem 0',
  color: '#333',
};

const itemPriceStyle = {
  margin: 0,
  color: '#666',
};

const quantityControlsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  margin: '0 1rem',
};

const controlButtonStyle = {
  backgroundColor: '#2d5a27',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  width: '30px',
  height: '30px',
  cursor: 'pointer',
};

const quantityStyle = {
  padding: '0 1rem',
  fontWeight: 'bold',
};

const totalStyle = {
  fontWeight: 'bold',
  fontSize: '1.1rem',
  margin: '0 1rem',
};

const deleteButtonStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  fontSize: '1.2rem',
  cursor: 'pointer',
  padding: '0.5rem',
};

const actionsStyle = {
  display: 'flex',
  gap: '1rem',
  justifyContent: 'center',
};

const checkoutButtonStyle = {
  backgroundColor: '#ff6b35',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '1.1rem',
};

const continueButtonStyle = {
  backgroundColor: '#2d5a27',
  color: 'white',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '4px',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
};

// Main App Component
const MainApp = () => {
  const [currentView, setCurrentView] = useState('home');

  // Simple routing based on hash
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentView(hash || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'products':
        return <ProductListing />;
      case 'cart':
        return <ShoppingCart />;
      case 'home':
      default:
        return <LandingPage />;
    }
  };

  return (
    <CartProvider>
      <div className='App'>
        <Header />
        {renderCurrentView()}
      </div>
    </CartProvider>
  );
};

export default MainApp;
