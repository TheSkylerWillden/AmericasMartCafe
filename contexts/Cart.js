import React, {useContext, useEffect, useState} from 'react';

const CartContext = React.createContext();

export function useCartContext() {
  return useContext(CartContext);
}

// export function deleteItemFromCart(toBeDeleted) {
//   updateCart(prevCart => {
//     const tempCart = [
//       prevCart.filter(item => item.index !== toBeDeleted.index),
//     ];
//   });
// }

const CartContextProvider = ({children}) => {
  const [cart, updateCart] = useState([]);

  return (
    <CartContext.Provider value={{cart, updateCart}}>
      {children}
    </CartContext.Provider>
  );
};
export default CartContextProvider;
