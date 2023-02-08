import { DrawerToggleButton } from "@react-navigation/drawer"
import { Button, Text } from "react-native"
import { BaseButton } from "react-native-gesture-handler"
import CreateProject from "../screens/CreateProject"
import Home from "../screens/Home"
import Login from "../screens/Login"
import Test from "../screens/Test"


export const PrivateRoutes = [
    {
        // component: Home, name: 'BuildMonitor', options: {headerShadowVisible: false, headerLeft: () => <DrawerToggleButton />, headerStyle: {backgroundColor: '#42b3ff'}},
        component: Test, name: 'Test',
    },
    {component: CreateProject, name:'Создать проект', options: {headerStyle: {backgroundColor: '#42b3ff'}, headerRight: (props) => (<BaseButton {...props}></BaseButton>)}}
]

export const PublicRoutes = [
    {component: Login, name: 'Login', options: {headerShown: false}}
]

