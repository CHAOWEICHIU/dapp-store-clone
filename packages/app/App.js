import { createStackNavigator, createAppContainer } from "react-navigation";
import { SCREEN_HOME, SCREEN_GOOGLE_MAP_EXPLORER } from "./constants/screens";

import HomeScreen from "./screens/HomeScreen";

const AppNavigator = createStackNavigator({
  [SCREEN_HOME]: {
    screen: HomeScreen
  }
});

export default createAppContainer(AppNavigator);
