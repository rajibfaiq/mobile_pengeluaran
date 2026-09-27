import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DaftarPengeluaranScreen from './src/screens/DaftarPengeluaranScreen';
import TambahPengeluaranScreen from './src/screens/TambahPengeluaranScreen';
import UbahPengeluaranScreen from './src/screens/UbahPengeluaranScreen';
import DetailPengeluaranScreen from './src/screens/DetailPengeluaranScreen';
import KonfirmasiHapusScreen from './src/screens/KonfirmasiHapusScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <Stack.Navigator
          initialRouteName="Daftar"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#F8FAFC' },
          }}
        >
          <Stack.Screen
            name="Daftar"
            component={DaftarPengeluaranScreen}
          />
          <Stack.Screen
            name="Tambah"
            component={TambahPengeluaranScreen}
          />
          <Stack.Screen
            name="Ubah"
            component={UbahPengeluaranScreen}
          />
          <Stack.Screen
            name="Detail"
            component={DetailPengeluaranScreen}
          />
          <Stack.Screen
            name="KonfirmasiHapus"
            component={KonfirmasiHapusScreen}
            options={{
              presentation: 'transparentModal',
              animation: 'fade',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}