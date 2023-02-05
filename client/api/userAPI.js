import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { authHost, host } from '.';

export const reg = async (name, password) => {
    const {data} = await host.post('api/user/reg', {name, password})
    return data
}   

export const log = async (name, password) => {
    const {data} = await host.post('api/user/log', {name, password})
    await AsyncStorage.setItem('token', JSON.stringify(data))
    return jwt_decode(data.token)
}

export const checkLogin = async (name) => {
    const {data} = await host.post('api/user/checklogin', {name})
    return data
}