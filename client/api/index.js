import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { REACT_NATIVE_API_URL } from './variables';

const host = axios.create({
    baseURL: REACT_NATIVE_API_URL
})

const authHost = axios.create({
    baseURL: REACT_NATIVE_API_URL
})

const authInterceptor = async (config) => {
    const token = await AsyncStorage.getItem('token')
    config.headers.Authorization = `Bearer ${token}`
    return config
}
authHost.interceptors.request.use(authInterceptor)

export {
    host,
    authHost
}