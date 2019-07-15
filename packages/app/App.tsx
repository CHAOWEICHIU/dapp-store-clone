import { createStackNavigator, createAppContainer } from "react-navigation";
import { SCREEN_HOME } from "./constants/screens";

import HomeScreen from "./screens/HomeScreen";

const AppNavigator = createStackNavigator({
  [SCREEN_HOME]: {
    screen: HomeScreen
  }
});

const RenderApp = createAppContainer(AppNavigator);

export default RenderApp;
