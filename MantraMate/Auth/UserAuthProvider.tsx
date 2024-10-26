import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../../App';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL } from '../../config/Env';
import AsyncStorage from '@react-native-async-storage/async-storage';
type UserType = {
  id: string;
  name: string;
  contactNumber: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
};

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserType | null;
  isAuthenticated: boolean;
  logout: () => void;
  refreshAccessToken: () => Promise<string | null>;
  setUserData: (userData: UserType) => void;
  updateUserProfile: (updates: Partial<UserType>) => void;
  setTokens: (access: string, refresh: string) => void;
};

type Props = StackNavigationProp<StackParamList, 'Login'>;

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}



export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  const navigation = useNavigation<Props>();

  const setUserData = async (userData: UserType) => {
    setUser(userData);
    const userDat = JSON.stringify(userData)
    await AsyncStorage.setItem('userData',userDat)
    console.log("saved user data", userData);
  };
  const updateUserProfile = (updates: Partial<UserType>) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      return {
        ...currentUser,
        ...updates
      };
    });
  };


  const setTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    navigation.navigate('Login');
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/refresh-token`, {
        refresh_token: refreshToken
      });
      const newAccessToken = response.data.results.access;

      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return null;
    }
  };

  const isAuthenticated = !!accessToken;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        isAuthenticated,
        logout,
        refreshAccessToken,
        setUserData,
        updateUserProfile,
        setTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};