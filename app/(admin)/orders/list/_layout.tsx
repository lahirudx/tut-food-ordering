import { Stack, withLayoutContext } from "expo-router";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function OrdersListLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      <MaterialTopTabs>
        <MaterialTopTabs.Screen
          name="index"
          options={{ tabBarLabel: "Active" }}
        />
        <MaterialTopTabs.Screen
          name="archive"
          options={{ tabBarLabel: "Archive" }}
        />
      </MaterialTopTabs>
    </SafeAreaView>
  );
}
