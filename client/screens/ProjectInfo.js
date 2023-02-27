import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { useContext, useEffect, useRef, useState } from "react"
import { Button, Dimensions, Image, StyleSheet, Text, View, ScrollView, PanResponder, Animated } from "react-native"
import { BaseButton, GestureHandlerRootView, RotationGestureHandler } from "react-native-gesture-handler"
import { SafeAreaView } from "react-native-safe-area-context"
import { REACT_NATIVE_API_URL } from "../api/variables"
import { BuildMonitor } from "../App"
import ArrowButton from "../compontents/ArrowButton"
import ImageZoom from 'react-native-image-pan-zoom';
import Draggable from 'react-native-draggable';

const ProjectInfo = ({navigation}) => {
    const { chosedProject } = useContext(BuildMonitor)
    
    useEffect(() => {
        navigation.setOptions({title: chosedProject.name})
    }, [navigation])

    // <View style={{position:'relative', overflow:'hidden'}}>
    //     <ImageZoom ref={img} enableSwipeDown={false} minScale={1} cropWidth={500} cropHeight={250} imageWidth={410} imageHeight={250}>
    //         <Image source={{uri: `${REACT_NATIVE_API_URL}static/projectImages/${chosedProject.image}`, height:250, width:'100%'}} resizeMode='cover'  />  
    //         {/* <Image source={require('../assets/marker.png')} style={{position:'absolute', color:'white', zIndex:200, transform:[{translateX: x}, {translateY: y}], width:20, height:20}} /> */}
    //     </ImageZoom>
    //     <Draggable maxY={340} minY={-150} maxX={650} minX={-150} onDragRelease={handle}>
    //         <View style={{width:420, height:250, alignItems:'center', justifyContent:'center'}}>
    //             <Image style={{width:50, height:50, zIndex:200}} source={require('../assets/marker.png')} />
    //             <View style={{borderBottomWidth:1, borderBottomColor:'red', width:1000, transform:[{rotate:'90deg'}], borderStyle:'dashed'}}></View>
    //             <View style={{borderBottomWidth:1, borderBottomColor:'red', width:1000, borderStyle:'dashed'}}></View>
    //         </View>
    //     </Draggable>
    // {/* maxY={250} minY={0} maxX={420} minX={0} * 2 Для бокса ещё паддинг */}
    // </View>


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