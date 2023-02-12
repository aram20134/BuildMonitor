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

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

const Root = () => [
    <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />} initialRouteName='BuildMonitor'>
        <Drawer.Screen  name='BuildMonitor' component={Home} options={{headerShadowVisible: false, headerStyle: {backgroundColor: '#005D99'}, headerTintColor:'white'}} />
    </Drawer.Navigator>
]

const Navigate = () => {
    const insets = useSafeAreaInsets()
    const { isAuth, setIsAuth, setUser } = useContext(BuildMonitor)
    useEffect(() => {
        const checkAuth = async () => {
            // AsyncStorage.removeItem('token')
            const isAuth = await AsyncStorage.getItem('token')
            setUser(JSON.parse(isAuth))
            console.log(isAuth)
            if (isAuth === null) {
                setIsAuth(false)
            } else {
                setIsAuth(true)
            }
        }
        checkAuth()
    }, [])
    
    if (isAuth === null) {
        return (
            <ActivityIndicator size={'large'} />
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
            <Stack.Navigator drawerContent={props => <CustomDrawer {...props} />} initialRouteName='BuildMonitor' screenOptions={{headerTintColor:'white'}} >
                <Stack.Screen name='Root' component={Root} options={{headerShown: false}} />
                {PrivateRoutes.map((route) => <Stack.Screen key={route.name} name={route.name} component={route.component} options={route.options} />)}
            </Stack.Navigator>
        </NavigationContainer>
        
    )
}

export default Navigate