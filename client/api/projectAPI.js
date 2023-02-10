import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { authHost, host } from '.';

export const createProject = async (form) => {
    const {data} = await host.post('api/project/createProject', {form}, {headers:{'Content-Type': 'multipart/form-data'}}).catch(e => console.log(e.message))
    return data
}