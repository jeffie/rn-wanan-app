// NavigationService.js

import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      }),
  );
}

function naviBack() {
  const backAtion = NavigationActions.back();
  _navigator.dispatch(backAtion);
}

function naviReset(target) {
  const redirectToMain = StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({routeName: target}),
    ],
  });
  _navigator.dispatch(redirectToMain);
}

function getNavi() {
  return _navigator._navigation;
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  naviBack,
  naviReset,
  getNavi,
};