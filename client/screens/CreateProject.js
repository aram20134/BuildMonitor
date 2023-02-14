import { useContext, useEffect, useReducer, useState } from "react"
import { Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native"
import { BaseButton, TextInput, BorderlessButton, GestureHandlerRootView, NativeViewGestureHandler } from "react-native-gesture-handler"
import MyButton from "../compontents/MyButton"
import MyInput from "../compontents/MyInput"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker"
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { createProject } from "../api/projectAPI"
import MyError from "../compontents/MyError"
import { BuildMonitor } from "../App"

function reducer(state, action) {
    switch (action.type) {
    case 'projectName':
        return {...state, projectName: action.payload};
    case 'projectCode':
        return {...state, projectCode: action.payload};
    case 'projectDateStart':
        return {...state, projectDateStart: action.payload};
    case 'projectDateEnd':
        return {...state, projectDateEnd: action.payload};
    case 'projectDescription':
        return {...state, projectDescription: action.payload};
    case 'projectWebPage':
        return {...state, projectWebPage: action.payload};
    case 'projectStreet':
        return {...state, projectStreet: action.payload};
    case 'projectPostalCode':
        return {...state, projectPostalCode: action.payload};
    case 'projectCountry':
        return {...state, projectCountry: action.payload};
    case 'projectCity':
        return {...state, projectCity: action.payload};
      default:
        throw new Error();
    }
}

const initialState = {
    projectName: '',
    projectCode: '',
    projectDateStart: '',
    projectDateEnd: '',
    projectDescription: '',
    projectWebPage: '',
    projectStreet: '',
    projectPostalCode: '',
    projectCountry: '',
    projectCity: ''
}

const CreateProject = ({ navigation }) => {
    const [image, setImage] = useState()
    const [trigger, setTrigger] = useState(false)
    const [projectInfo, dispatch] = useReducer(reducer, initialState)
    const [loading, setLoading] = useState(false)

    const { setProjects, projects } = useContext(BuildMonitor)
    
    useEffect(() => {
        const saveProject = () => {
            if (projectInfo.projectName === '') {
                setTrigger(true)
                setTimeout(() => {
                    setTrigger(false)
                }, 100);
                return 
            }
            setLoading(true)
            const project = new FormData()
            if (image) {
                var imageFile = {
                    uri: image.uri,
                    type: 'image/jpeg',
                    name: 'photo.jpg'
                }
                project.append('image', imageFile)
            }
            project.append('projectName', projectInfo.projectName)
            project.append('projectCode', projectInfo.projectCode)
            project.append('projectDateStart', `'${projectInfo.projectDateStart}'`)
            project.append('projectDateEnd', `'${projectInfo.projectDateEnd}'`)
            project.append('projectDescription', projectInfo.projectDescription)
            project.append('projectWebPage', projectInfo.projectWebPage)
            project.append('projectStreet', projectInfo.projectStreet)
            project.append('projectPostalCode', projectInfo.projectPostalCode)
            project.append('projectCountry', projectInfo.projectCountry)
            project.append('projectCity', projectInfo.projectCity)
            createProject(project).then((res) => {
                console.log(res)
                // setProjects(projects),
                navigation.goBack()
            }).catch(e => console.log(e.message)).finally(() => setLoading(false))
        }
      navigation.setOptions({
        headerRight: () => (
            <MyButton enabled={!loading} title={'Сохранить'} onPress={saveProject} />
        )
      })
    
    }, [navigation, image, projectInfo, trigger, loading])

    const chooseDate = (dateName) => {
        DateTimePickerAndroid.open({
            onChange: (event, selectetDate) => dispatch({type: dateName, payload: selectetDate}),
            mode: 'date',
            value: new Date(),
        })
    }
    
    return (
        <KeyboardAvoidingView style={styles.container}>
            <MyError errorMsg={'Обязательные поля не заполнены!'} trigger={trigger} />
            <ScrollView style={{width:'100%'}}>
                <MyInput title={'Логотип проекта'} type='image' image={image} setImage={setImage} />
                <MyInput type='text' returnKeyType="next" required onChangeText={(txt) => dispatch({type: 'projectName', payload: txt})} placeholder='Введите название проекта' title='Название проекта' />
                <MyInput type='text' returnKeyType="next" onChangeText={(txt) => dispatch({type: 'projectCode', payload: txt})} placeholder='Введите Код проекта' title='Код проекта' />
                <MyInput type='date' value={projectInfo.projectDateStart && format(projectInfo.projectDateStart, 'dd.MM.yyyy', {locale: ru})} onPress={() => chooseDate('projectDateStart')} placeholder='Установите дату' title='Начало проекта' />
                <MyInput type='date' value={projectInfo.projectDateEnd && format(projectInfo.projectDateEnd, 'dd.MM.yyyy', {locale: ru})} onPress={() => chooseDate('projectDateEnd')} placeholder='Установите дату' title='Завершение проекта' />
                <MyInput type='text' returnKeyType="next" onChangeText={(txt) => dispatch({type: 'projectDescription', payload: txt})} placeholder='Введите описание' title='Описание' />
                <MyInput type='text' returnKeyType="next" onChangeText={(txt) => dispatch({type: 'projectWebPage', payload: txt})} placeholder='Введите веб-страницу проекта' title='Веб-страница проекта' />
                <MyInput type='text' returnKeyType="next" onChangeText={(txt) => dispatch({type: 'projectStreet', payload: txt})} placeholder='Введите улицу' title='Улица' />
                <MyInput type='text' returnKeyType="next" onChangeText={(txt) => dispatch({type: 'projectPostalCode', payload: txt})} placeholder='Введите почтовый индекс' title='Почтовый индекс' />
                <MyInput type='text' returnKeyType="next" onChangeText={(txt) => dispatch({type: 'projectCountry', payload: txt})} placeholder='Введите страну' title='Страна' />
                <MyInput type='text' onChangeText={(txt) => dispatch({type: 'projectCity', payload: txt})} placeholder='Введите Город' title='Город' />
                {/* <Button title="pick img" onPress={test} /> */}
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

export default CreateProject

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems:'center',
    },
});
  