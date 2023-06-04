import { DrawerContentScrollView, useDrawerStatus } from "@react-navigation/drawer"
import { useCallback, useContext, useEffect, useState } from "react"
import { Button, Image, Keyboard, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { BuildMonitor } from "../App"
import { BaseButton, FlatList, GestureHandlerRootView, TextInput } from "react-native-gesture-handler"
import { getProjects } from "../api/projectAPI"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import MyButton from "./MyButton"
import dayjs from "dayjs"
require('dayjs/locale/ru')

const CustomDrawer = ({ navigation }) => {
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const { user, projects, setProjects, chosedProject, setChosedProject, setChosedLayer, chosedLayer } = useContext(BuildMonitor)

    // const date = format(new Date(), 'EEEE, d MMMM yyyy', {locale: ru})
    const date = dayjs().locale('ru').format('dddd, D MMMM YYYY')
    
    const createProject = () => {
        navigation.navigate('Создать проект')
    }

    useFocusEffect(useCallback(() => {
        setLoading(true)
        console.log('first')
        getProjects().then((res) => {
            console.log('fetched')
            setProjects(res)
            if (chosedProject) {
                setChosedProject(res.filter((prj) => prj.id === chosedProject.id)[0])
            }
        }).finally(() => setLoading(false)).catch((e) => console.log('getprj', e.response))
    }, []))

    const drawer = useDrawerStatus()

    // useEffect(() => {
        // getProjects().then((res) => {
        //     console.log('fetched')
        //     setProjects(res)
        //     if (chosedProject) {
        //         setChosedProject(res.filter((prj) => prj.id === chosedProject.id)[0])
        //     }
        // }).finally(() => setLoading(false)).catch((e) => console.log('getprj', e.response))
    // }, [])

    useEffect(() => {
      setSearch('')
    }, [Keyboard.isVisible()])

    useEffect(() => {
        getProjects().then((res) => setProjects(res)).finally(() => setLoading(false)).catch((e) => console.log('getprj', e.response))
    }, [chosedProject])

    const Item = ({item, isProject = true}) => {
        var count
        if (isProject) {
            count = item.layers.reduce((acc, cur) => {
                acc = acc + cur.tasks.length
                return acc
            }, 0)
        } else {
            count = item.tasks.length
        }
        return isProject ? (
            <GestureHandlerRootView style={{display:'flex', width:'85%'}}>
                <BaseButton rippleColor={'#4181FF'} onPress={() => {setChosedProject(item), setChosedLayer()}}>
                    <View accessible accessibilityRole="button" style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        <Text style={{padding:10, color:'white'}}>{item.name}</Text>
                        <Text style={{fontWeight:'bold', padding: 5, paddingLeft:10, paddingRight:10, color:'white', backgroundColor:'#4181FF', borderRadius:115, overflow:'hidden', margin:5}}>{count}</Text>
                    </View>
                </BaseButton>
            </GestureHandlerRootView>
        ) : (
            <GestureHandlerRootView style={{display:'flex', width:'85%'}}>
                <BaseButton rippleColor={'#4181FF'} onPress={() => {setChosedLayer(item), navigation.closeDrawer()}}>
                    <View accessible accessibilityRole="button" style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                        <Text style={{padding:10, color:'white'}}>{item.name}</Text>
                        <Text style={{fontWeight:'bold', padding: 5, paddingLeft:10, paddingRight:10, color:'white', backgroundColor:'#4181FF', borderRadius:115, overflow:'hidden', margin:5}}>{count}</Text>
                    </View>
                </BaseButton>
            </GestureHandlerRootView>
        )
    }
    
    return user && (
        <DrawerContentScrollView scrollEnabled={false} style={{backgroundColor:'#222836'}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image resizeMode='contain' resizeMethod='resize' style={{width: 130, height: 32}} source={require('../assets/logoLight.png')} />
                    <View>
                        <Text style={{color:'white'}}>{user.name}</Text>
                        <Text style={{fontSize: 10, color:'gray'}}>{date}</Text>
                    </View>
                </View>
                {chosedProject ? (
                    <>
                        <View style={{width:'100%', backgroundColor:'#202124', marginTop:5, flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:5, paddingLeft:0, paddingRight:70}}>
                            <Pressable onPress={() => setChosedProject()}><Image source={require('../assets/back.png')} resizeMode='contain' style={{width:30, height:30, transform: [{scale: 0.6}]}} /></Pressable>
                            <TextInput onChangeText={setSearch} value={search} style={{color:'white', width:'100%'}} placeholder={chosedProject.name} placeholderTextColor={'gray'} />
                            {Keyboard.isVisible() 
                            ? <Image source={require('../assets/close.png')} resizeMode='center' style={{width:30, height:30, transform: [{scale: 0.6}]}} />
                            : <Image source={require('../assets/search.png')} resizeMode='contain' style={{width:30, height:30}} />
                            }
                        </View>
                        <View style={{width:'90%', borderWidth:2, borderColor:'#42b3ff', alignSelf:'center', margin:10, borderRadius:5}}>
                            <MyButton onPress={() => navigation.navigate('Информация проекта')} title={'Показать сведения о проекте'} custom={{text: {color:'#42b3ff', width:'100%'}, button: {justifyContent:'center', alignItems:'center', paddingTop:7, paddingBottom:7, width:'100%'}, container:{width:'100%', alignItems:'center', justifyContent:'center'}}} />
                        </View>
                        <ScrollView style={{width:'100%', maxHeight:'70%'}}>
                            <View style={styles.listContainer}>
                                {chosedProject.layers.filter((pr) => pr.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.pos - b.pos).map((layer) => <Item key={layer.name} isProject={false} item={layer} />)}
                            </View>
                        </ScrollView>
                        <View style={{borderWidth:2, borderColor:'#42b3ff', alignSelf:'center', margin:10, borderRadius:5}}>
                            <MyButton onPress={() => navigation.navigate('Manage Layers')} title={'Управление слоями'} custom={{text: {color:'#42b3ff', paddingLeft:20, paddingRight:20}, button: {justifyContent:'center', alignItems:'center', paddingLeft:'10%', paddingRight:'10%', paddingTop:7, paddingBottom:7}, container:{width:'100%', alignItems:'center', justifyContent:'center'}}} />
                        </View>
                    </>
                ) : (
                    <>
                        <View style={{width:'100%', backgroundColor:'#202124', marginTop:5, flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:5, paddingLeft:10, paddingRight:40}}>
                            <TextInput onChangeText={setSearch} value={search} style={{color:'white', width:'100%'}} placeholder="Мои проекты" placeholderTextColor={'gray'} />
                            {Keyboard.isVisible() 
                            ? <Image source={require('../assets/close.png')} resizeMode='center' style={{width:30, height:30, transform: [{scale: 0.6}]}} />
                            : <Image source={require('../assets/search.png')} resizeMode='contain' style={{width:30, height:30}} />
                            }
                        </View>
                        <View style={{width:'100%', marginBottom:5}}>
                            <BaseButton onPress={createProject} style={styles.btnCreate}>
                                <Text style={{color:'green'}}>+   Создать новый проект</Text>
                            </BaseButton>
                        </View>
                        <View style={styles.listContainer}>
                            {!loading && projects.filter((pr) => pr.name.toLowerCase().includes(search.toLowerCase())).map((item) => <Item key={item.name} item={item} />)}
                            {/* {!loading && <FlatList style={{display:'flex', width:'85%'}} data={projects.filter((pr) => pr.name.toLowerCase().includes(search.toLowerCase()))} renderItem={({item}) => <Item key={item.name} item={item}/>} />} */}
                        </View>
                    </>
                )}
            </View>
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      color:'white',
      alignItems: 'flex-start',
    //   justifyContent:'space-between',
    },
    header: {
        color:'white',
        flexDirection:'row',
    },
    btnCreate: {
        // backgroundColor: 'gray',
        color:'green',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        padding:10,
    },
    listContainer: {
        alignItems:'center',
        justifyContent:'center',
        width:'100%'
    }
});

export default CustomDrawer