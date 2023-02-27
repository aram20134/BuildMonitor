import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import { authHost, host } from '.';

export const createProject = async (project) => {
    const {data} = await host.post('api/project/createProject', project, {headers: {"Content-Type": 'multipart/form-data'}})
    return data
}

export const getProjects = async () => {
    const {data} = await host.get('api/project/getProjects')
    return data
}

export const addLayer = async (createLayer) => {
    const {data} = await host.post('/api/project/addLayer', createLayer, {headers: {"Content-Type": 'multipart/form-data'}})
    return data
}

export const getLayers = async (projectId) => {
    const {data} = await host.get('/api/project/getLayers', {projectId})
    return data
}

export const getTasks = async (layerId) => {
    const {data} = await host.get('/api/project/getTasks?layerId=' + layerId)
    return data
}

export const addTask = async (createTask) => {
    const {data} = await host.post('/api/project/addTask', createTask, {headers: {"Content-Type": 'multipart/form-data'}})
    return data
}

export const getForms = async () => {
    const {data} = await host.get('/api/project/getForms')
    return data
}

export const getForm = async (formId) => {
    const {data} = await host.get('/api/project/getForm?formId=' + formId)
    return data
}

export const changeLayersPos = async (layers) => {
    const {data} = await host.post('/api/project/changeLayersPos', layers)
    return data
}