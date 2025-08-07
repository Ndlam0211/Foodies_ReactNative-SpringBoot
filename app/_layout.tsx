import "@/unistyles/unistyles";
import { navigationRef } from "@/utils/NavigationUtils";
import { Stack, useNavigationContainerRef } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const ref = useNavigationContainerRef();

  useEffect(() => {
    navigationRef.current = ref;
  }, [ref]);

  return <Stack ref={ref} screenOptions={{headerShown:false}}/>;
}
