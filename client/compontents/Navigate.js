import { useEffect, useContext } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrivateRoutes, PublicRoutes } from '../other/routes'
import { BuildMonitor } from '../App';
import { createDrawerNavigator, DrawerToggleButton } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomDrawer from './CustomDrawer';
import Home from '../screens/Home';
import Test from '../screens/Test';
import { checkUser } from '../api/userAPI';
import jwt_decode from 'jwt-decode';
import { View } from 'react-native';
import { StatusBar } from 'react-native';
import { Text } from 'react-native';

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

const Root = () => [
  <Drawer.Navigator screenOptions={{drawerType:'front'}} drawerContent={props => <CustomDrawer {...props} />} initialRouteName='BuildMonitor'>
    <Drawer.Screen name='BuildMonitor' component={Home} options={{headerShadowVisible: false, headerStyle: {backgroundColor: '#005D99'}, headerTintColor:'white'}} />
  </Drawer.Navigator>
]

const Navigate = () => {
  const insets = useSafeAreaInsets()
  const { isAuth, setIsAuth, setUser } = useContext(BuildMonitor)
  useEffect(() => {
    checkUser()
    .then(async (token) => {
      console.log('new token', token)
      setUser(token)
      setIsAuth(true)
    })
    .catch((e) => {
      setIsAuth(false)
    })
  }, [])
    
  if (isAuth === null) {
      return (
        <View style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', flex:1, backgroundColor:'#005D99'}}>
          <Text style={{fontSize:24, color:'white'}}>Загружаем приложение...</Text>
          <ActivityIndicator size={'large'} style={{margin:20}}  />
        </View>
      )
  }
  
  return !isAuth ? (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {PublicRoutes.map((route) => <Stack.Screen key={route.name} name={route.name} component={route.component} options={route.options} />)}
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='BuildMonitor' screenOptions={{headerTintColor:'white'}} >
        <Stack.Screen name='Root' component={Root} options={{headerShown: false}} />
        {PrivateRoutes.map((route) => <Stack.Screen key={route.name} name={route.name} component={route.component} options={route.options} />)}
      </Stack.Navigator>
    </NavigationContainer>
      
  )
}

export default Navigate