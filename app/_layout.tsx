import { persistor, store } from "../states/store";
import "@/unistyles/unistyles";
import { navigationRef } from "@/utils/NavigationUtils";
import { Stack, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    navigationRef.current = ref;
  }, [ref]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack ref={ref} screenOptions={{ headerShown: false }} />
      </PersistGate>
    </Provider>
  );
}
