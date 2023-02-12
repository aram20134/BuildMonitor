import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useContext, useEffect } from "react"
import { Button, Image, StyleSheet, Text, View } from "react-native"
import { BaseButton, GestureHandlerRootView, RotationGestureHandler, ScrollView } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { REACT_NATIVE_API_URL } from "../api/variables"
import { BuildMonitor } from "../App"
import ArrowButton from "../compontents/ArrowButton"


const ProjectInfo = ({navigation}) => {
    const { chosedProject } = useContext(BuildMonitor)

    useEffect(() => {
      navigation.setOptions({title: chosedProject.name})
    }, [navigation])

    return (
        <ScrollView style={{backgroundColor:'#d8f4ff'}}>
            <View style={styles.container}>
                <Image source={{uri: `${REACT_NATIVE_API_URL}static/projectImages/${chosedProject.image}`, height:250, width:'100%'}} resizeMode='cover'  />  
                <View style={styles.btnCont}>
                    <ArrowButton title={'Статистика проекта'} />
                </View>
                <View style={styles.btnCont}>
                    <Text style={{marginLeft:15, marginTop:5, fontWeight:'bold', fontSize:16}}>Управление проектом</Text>
                    <ArrowButton title={'Пользователи'} />
                    <ArrowButton title={'Формы'} />
                </View>
                <View style={{...styles.btnCont, marginBottom:10}}>
                    <Text style={{marginLeft:15, marginTop:5, fontWeight:'bold', fontSize:16}}>Информация о проекте</Text>
                    <View style={styles.info}><Text>Код проекта</Text><Text>{chosedProject.code}</Text></View>
                    <View style={styles.info}><Text>Описание</Text><Text>{chosedProject.description}</Text></View>
                    <View style={styles.info}><Text>Начало проекта</Text><Text>{format(new Date(chosedProject.dateStart), 'dd.MM.yyyy', {locale: ru})}</Text></View>
                    <View style={styles.info}><Text>Завершение проекта</Text><Text>{format(new Date(chosedProject.dateEnd), 'dd.MM.yyyy', {locale: ru})}</Text></View>
                    <View style={styles.info}><Text>Веб-страница проекта</Text><Text>{chosedProject.webPage}</Text></View>
                    <View style={styles.info}><Text>Улица</Text><Text>{chosedProject.street}</Text></View>
                    <View style={styles.info}><Text>Почтовый индекс</Text><Text>{chosedProject.postalCode}</Text></View>
                    <View style={styles.info}><Text>Город</Text><Text>{chosedProject.city}</Text></View>
                    <View style={styles.info}><Text>Страна</Text><Text>{chosedProject.country}</Text></View>
                    <View style={{margin:15}}><Button title="Редактировать подробные сведения" /></View>
                </View>
            </View>
        </ScrollView>
    )
}

export default ProjectInfo

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
    btnCont: {
        width:'95%', 
        backgroundColor:'white',
        borderRadius:5,
        marginTop:10
    },
    info: {
        padding:15,
        paddingRight:20,
        flexDirection:'row',
        justifyContent:'space-between'
    }
});