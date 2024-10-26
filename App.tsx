import React, { useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './MantraMate/LoginPage';
import ProfileScreen from './MantraMate/ProfileScreen';
import Otp from './MantraMate/Otp';
import Profile2 from './MantraMate/Profile2';
import CategoriesScreen from './MantraMate/Categories';
import { AuthProvider } from './MantraMate/Auth/UserAuthProvider';
import { createStackNavigator } from '@react-navigation/stack';
import Services from './MantraMate/Services';
import LogoutDialog from './MantraMate/Logout';


export type StackParamList = {
  Login: undefined;
  OTP: { phoneNumber: string };
  ProfileScreen: undefined;
  Profile2: undefined;
  Category:undefined;
  Services:undefined;
  out:undefined;
};

const Stack = createStackNavigator<StackParamList>();
const App: React.FC = (): React.ReactElement => {
  
  return (<>
          <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Services" component={Services}  />
          <Stack.Screen name="Login" component={LoginScreen}  options={{
          headerShown: false, 
        }}  />
          <Stack.Screen name="OTP" component={Otp} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          <Stack.Screen name="Profile2" component={Profile2} />
          <Stack.Screen name="Category" component={CategoriesScreen} />
          
          <Stack.Screen name="out" component={LogoutDialog} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
 
 
    </> 
  );
};

export default App;



