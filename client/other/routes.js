import { DrawerToggleButton } from "@react-navigation/drawer"
import { Button, Text } from "react-native"
import { BaseButton } from "react-native-gesture-handler"
import AddUser from "../screens/AddUser"
import CreateLayer from "../screens/CreateLayer"
import CreateProject from "../screens/CreateProject"
import CreateTask from "../screens/CreateTask"
import Home from "../screens/Home"
import Login from "../screens/Login"
import ManageLayers from "../screens/ManageLayers"
import ProjectInfo from "../screens/ProjectInfo"
import Task from "../screens/Task"
import Test from "../screens/Test"
import Users from "../screens/Users"
import ProjectStats from './../screens/ProjectStats';


export const PrivateRoutes = [
    {component: CreateProject, name:'Создать проект', options: {headerStyle: {backgroundColor: '#005D99'}, headerRight: (props) => (<BaseButton {...props}></BaseButton>)}},
    {component: ProjectInfo, name: 'Информация проекта', options: {headerStyle: {backgroundColor: '#005D99'}}},
    {component: CreateTask, name: 'Создать задачу', options: {headerStyle: {backgroundColor: '#005D99'}, headerRight: (props) => (<BaseButton {...props}></BaseButton>)}},
    {component: Task, name: 'Задача', options: {headerStyle: {backgroundColor: '#005D99'}}},
    {component: ManageLayers, name:'Manage Layers', options: {headerStyle: {backgroundColor: '#005D99'}}},
    {component: CreateLayer, name: 'Создать слой', options: {headerStyle: {backgroundColor: '#005D99'}}},
    {component: ProjectStats, name: 'Статистика проекта', options: {headerStyle: {backgroundColor: '#005D99'}}},
    {component: Users, name: 'Пользователи', options: {headerStyle: {backgroundColor: '#005D99'}}},
    {component: AddUser, name: 'Добавить', options: {headerStyle: {backgroundColor: '#005D99'}}},
    
]

export const PublicRoutes = [
    {component: Login, name: 'Login', options: {headerShown: false}}
]

