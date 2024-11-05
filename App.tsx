import React, { useEffect } from 'react';
import { MobileAds } from 'react-native-google-mobile-ads';
import Stack_Navigation from './src/navigations/stack_navigation/Stack_Navigation';

const App = () => {
  useEffect(() => {
    // Initialize AdMob when the app starts
    MobileAds()
      .initialize()
      .then(() => {
        // AdMob initialized successfully
      });
  }, []);

  return <Stack_Navigation />;
};

export default App;
