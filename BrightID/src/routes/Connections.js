import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import ConnectionsScreen from '@/components/Connections/ConnectionsScreen';
import SortingConnectionsScreen from '@/components/Connections/SortingConnectionsScreen';
import SearchConnections from '@/components/Helpers/SearchConnections';
import FullScreenPhoto from '@/components/Helpers/FullScreenPhoto';
import TrustedConnectionsScreen from '@/components/Recovery/TrustedConnectionsScreen';
import { useSelector } from 'react-redux';
import { headerOptions, headerTitleStyle, NavHome } from './helpers';
import ConnectionScreenController from '../components/Connections/ConnectionScreenController';

const Stack = createStackNavigator();

const HeaderTitle = ({ title }) => {
  const searchOpen = useSelector((state) => state.connections.searchOpen);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: searchOpen ? 0 : 1,
      useNativeDriver: true,
      duration: 600,
    }).start();
  }, [fadeAnim, searchOpen]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={headerTitleStyle}>{title}</Text>
    </Animated.View>
  );
};

const connectionsScreenOptions = {
  ...headerOptions,
  headerRight: () => <SearchConnections sortable={true} />,
  headerLeft: () => <NavHome />,
  headerTitle: () => <HeaderTitle title="Connections" />,
};

const connectionScreenOptions = {
  ...headerOptions,
  headerTitle: () => <HeaderTitle title="Connection Details" />,
};

const trustedScreenOptions = {
  ...headerOptions,
  headerRight: () => <SearchConnections sortable={true} />,
  headerTitle: () => <HeaderTitle title="Trusted Connections" />,
};

const fullScreenPhotoOptions = {
  headerShown: false,
  cardOverlayEnabled: true,
  mode: 'modal',
  gestureEnabled: true,
  ...TransitionPresets.FadeFromBottomAndroid,
  cardStyle: { backgroundColor: 'transparent' },
};

const Connections = () => {
  return (
    <>
      <Stack.Screen
        name="Connections"
        component={ConnectionsScreen}
        options={connectionsScreenOptions}
      />
      <Stack.Screen
        name="SortingConnections"
        component={SortingConnectionsScreen}
        options={headerOptions}
      />
      <Stack.Screen
        name="TrustedConnections"
        component={TrustedConnectionsScreen}
        options={trustedScreenOptions}
      />
      <Stack.Screen
        name="FullScreenPhoto"
        component={FullScreenPhoto}
        options={fullScreenPhotoOptions}
      />
      <Stack.Screen
        name="Connection"
        component={ConnectionScreenController}
        options={connectionScreenOptions}
      />
    </>
  );
};

export default Connections;
