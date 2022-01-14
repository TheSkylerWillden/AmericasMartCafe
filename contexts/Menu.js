import React, {useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import storage from '@react-native-firebase/storage';

const MenuContext = React.createContext();

export function useMenuContext() {
  return useContext(MenuContext);
}

const MenuContextProvider = ({children}) => {
  const [menu, updateMenu] = useState();

  const fetchMenu = async () => {
    const tempMenu = await firestore().collection('menu').get();
    const tempArray = [];
    tempMenu.forEach(item => tempArray.push(item.data()));
    updateMenu(tempArray);
  };

  const preLoadImages = async () => {
    const temp = [];
    if (menu !== undefined) {
      for await (menuItem of menu) {
        if (menuItem.imageTitle !== undefined) {
          const url = await storage()
            .ref(`/images/${menuItem.imageTitle}`)
            .getDownloadURL();
          temp.push({uri: url});
        }
      }
      FastImage.preload(temp);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  useEffect(() => {
    preLoadImages();
  }, [menu]);

  return <MenuContext.Provider value={{menu}}>{children}</MenuContext.Provider>;
};

export default MenuContextProvider;
