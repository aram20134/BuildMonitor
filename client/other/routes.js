import Home from "../screens/Home"
import Login from "../screens/Login"


export const PrivateRoutes = [
    {component: Home, name: 'Home', options: {headerShown: false}}
]

export const PublicRoutes = [
    {component: Login, name: 'Login', options: {headerShown: false}}
]

