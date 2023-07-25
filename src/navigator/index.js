import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ImageSearchScreen from '../screens/ImageSearch';
import {screens} from '../constants/screens';

const RootStack = createNativeStackNavigator();

const RootStackScreen = () => {
  return (
    <RootStack.Navigator initialRouteName={screens.imageSearch}>
      <RootStack.Screen
        name={screens.imageSearch}
        component={ImageSearchScreen}
      />
    </RootStack.Navigator>
  );
};

export default RootStackScreen;
