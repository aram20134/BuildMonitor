import { useState, useEffect } from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PrivateRoutes, PublicRoutes } from '../other/routes'

const Stack = createNativeStackNavigator()

const Navigate = () => {
    const [isAuth, setIsAuth] = useState(null)

    useEffect(() => {
        const checkAuth = async () => {
            const isAuth = await AsyncStorage.getItem('token')
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
    
    return isAuth === false ? (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Login'>
                {PublicRoutes.map((route) => <Stack.Screen key={route.name} name={route.name} component={route.component} options={route.options} />)}
            </Stack.Navigator>
        </NavigationContainer>
    ) : (
        <NavigationContainer>
            <Stack.Navigator>
                {PrivateRoutes.map((route) => <Stack.Screen key={route.name} name={route.name} component={route.component} options={route.options} />)}
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigate