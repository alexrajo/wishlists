import { StatusBar } from 'expo-status-bar';
import { NativeBaseProvider } from 'native-base';
import StackNavigator from './src/navigation/StackNavigator';
import { NavigationContainer } from '@react-navigation/native';


export default () => {
  return (
    <NativeBaseProvider>
      <StatusBar/>
      <NavigationContainer>
        <StackNavigator/>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
