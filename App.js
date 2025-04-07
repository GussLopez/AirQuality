import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';
import AlertsScreen from './screens/AlertsScreen';
import SettingsScreen from './screens/SettingsScreen';
import { getTranslation } from './utils/languages';
import tw from 'tailwind-react-native-classnames';

const Tab = createBottomTabNavigator();

export default function App() {
  const [language, setLanguage] = useState('es');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem('language', newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'History':
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                break;
              case 'Alerts':
                iconName = focused ? 'notifications' : 'notifications-outline';
                break;
              case 'Settings':
                iconName = focused ? 'settings' : 'settings-outline';
                break;
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#22c55e',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: tw`bg-gray-900 border-t-2 border-gray-600`,
          headerStyle: tw`bg-gray-900`,
          headerTitleStyle: tw`text-white`,
        })}
      >
        <Tab.Screen 
          name="Home" 
          options={{ title: getTranslation(language, 'home') }}
        >
          {(props) => <HomeScreen {...props} language={language} />}
        </Tab.Screen>
        <Tab.Screen 
          name="History" 
          options={{ title: getTranslation(language, 'history') }}
        >
          {(props) => <HistoryScreen {...props} language={language} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Alerts" 
          options={{ title: getTranslation(language, 'alerts') }}
        >
          {(props) => <AlertsScreen {...props} language={language} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Settings" 
          options={{ title: getTranslation(language, 'settings') }}
        >
          {(props) => <SettingsScreen {...props} language={language} changeLanguage={changeLanguage} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}