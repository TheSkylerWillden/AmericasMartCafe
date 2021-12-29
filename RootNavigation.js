// import {createNavigationContainerRef} from '@react-navigation/native';
import React from 'react';
import {StackActions} from '@react-navigation/native';

export const navigationRef = React.createRef();

export function push(destination, entreeData) {
  navigationRef.current?.dispatch(StackActions.push(destination, {entreeData}));
}

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}
