import { DrawerToggleButton } from "@react-navigation/drawer"
import { Button, Text } from "react-native"
import { BaseButton } from "react-native-gesture-handler"
import CreateProject from "../screens/CreateProject"
import CreateTask from "../screens/CreateTask"
import Home from "../screens/Home"
import Login from "../screens/Login"
import ProjectInfo from "../screens/ProjectInfo"
import Task from "../screens/Task"
import Test from "../screens/Test"


export const PrivateRoutes = [
    {
        // component: Home, name: 'BuildMonitor', options: {headerShadowVisible: false, headerLeft: () => <DrawerToggleButton />, headerStyle: {backgroundColor: '#42b3ff'}},
        component: Test, name: 'Test',
    },
    {component: CreateProject, name:'Создать проект', options: {headerStyle: {backgroundColor: '#005D99'}, headerRight: (props) => (<BaseButton {...props}></BaseButton>)}},
    {component: ProjectInfo, name: 'Информация проекта', options: {headerStyle: {backgroundColor: '#005D99'}}},
    {component: CreateTask, name: 'Создать задачу', options: {headerStyle: {backgroundColor: '#005D99'}, headerRight: (props) => (<BaseButton {...props}></BaseButton>)}},
    {component: Task, name: 'Задача', options: {headerStyle: {backgroundColor: '#005D99'}}}
]

export const PublicRoutes = [
    {component: Login, name: 'Login', options: {headerShown: false}}
]

