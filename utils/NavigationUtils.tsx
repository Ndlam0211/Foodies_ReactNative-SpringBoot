import {
  CommonActions,
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export async function navigate(routeName: string, params?: object) {
  navigationRef.isReady();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.navigate(routeName, params));
  }
}

export async function replace(routeName: string, params?: object) {
  navigationRef.isReady();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.replace(routeName, params));
  }
}

export async function resetAndNavigate(routeName: string, params?: object) {
  if (!navigationRef.isReady()) return;
  // ensure route exists
  // @ts-ignore
  const state = navigationRef.getRootState();
  // @ts-ignore
  const exists = state?.routeNames?.includes(routeName);
  if (!exists) {
    console.warn(
      "[Navigation] Route not found during reset, fallback navigate:",
      routeName
    );
    return navigationRef.dispatch(
      CommonActions.navigate(routeName as never, params)
    );
  }
  navigationRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    })
  );
}

export async function goBack() {
  navigationRef.isReady();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(CommonActions.goBack());
  }
}

export async function push(routeName: string, params?: object) {
  navigationRef.isReady();
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(routeName, params));
  }
}

export async function prepareNavigation() {
  navigationRef.isReady();
}
