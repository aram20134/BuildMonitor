import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { authHost, host } from '.';

export const reg = async (email, password) => {
    const {data} = await host.post('api/user/reg', {email, password})
    return data
}   

export const log = async (email, password) => {
    const {data} = await host.post('api/user/log', {email, password})
    await AsyncStorage.setItem('token', JSON.stringify(data.token))
    return jwt_decode(data.token)
}

export const checkLogin = async (email) => {
    const {data} = await host.post('api/user/checklogin', {email})
    return data
}

export const checkUser = async () => {
    const {data} = await authHost.get('api/user/check')
    console.log(data)
    await AsyncStorage.setItem('token', JSON.stringify(data.token))
    return jwt_decode(data.token)
}

export const getAllUsers = async (projectId) => {
    const {data} = await host.get('/api/user/getAllUsers', {
        params: {
            projectId
        }
    })
    return data
}