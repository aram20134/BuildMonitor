import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { authHost, host } from '.';

export const createProject = async (project) => {
    const {data} = await host.post('api/project/createProject', project, {headers: {"Content-Type": 'multipart/form-data'}}).catch(e => console.log(JSON.stringify(e)))
    return data
}

export const getProjects = async () => {
    const {data} = await host.get('api/project/getProjects')
    return data
}

export const addLayer = async (name, project) => {
    const {data} = await host.post('/api/project/addLayer', {name, project})
    return data
}

export const getLayers = async (projectId) => {
    const {data} = await host.get('/api/project/getLayers', {projectId})
    return data
}

export const getTasks = async (layerId) => {
    const {data} = await host.get('/api/project/getTasks', {layerId})
    return data
}

export const addTask = async () => {
    // API .... formId, layerId, data
}

export const getForms = async () => {
    const {data} = await host.get('/api/project/getForms')
    return data
}