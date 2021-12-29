import React, {useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';

const MenuContext = React.createContext();

export function useMenuContext() {
  return useContext(MenuContext);
}

const MenuContextProvider = ({children}) => {
  const fetchMenu = async () => {
    const tempMenu = await firestore().collection('menu').get();
    const tempArray = [];
    tempMenu.forEach(item => tempArray.push(item.data()));
    updateMenu(tempArray);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const [menu, updateMenu] = useState();
  return <MenuContext.Provider value={{menu}}>{children}</MenuContext.Provider>;
};

export default MenuContextProvider;
