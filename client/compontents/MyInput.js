import { Button, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"
import { BaseButton, BorderlessButton, GestureHandlerRootView, TextInput } from "react-native-gesture-handler"
import * as ImagePicker from 'expo-image-picker'
import Checkbox from "expo-checkbox"
import { useCallback, useEffect, useState } from "react"
import DropDownPicker from "react-native-dropdown-picker"
import { REACT_NATIVE_API_URL } from "../api/variables"
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native"
import { Slider } from "@miblanchard/react-native-slider"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";
import MyButton from "./MyButton"

const MyInput = ({title, required = false, placeholder, chooseDate, timeValue, chooseTime, onChangeText, value, type, onPress, image, setImage, returnKeyType, enabled = true, onCheckboxChange, defaultValue, dateValue, editable = true}) => {

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            // allowsEditing: true,
            // aspect: [4, 3],
            quality: 1,
          });
          console.log(result.assets[0]);
          
          if (!result.canceled) {
            setImage(result.assets[0]);
          }
    }

    const navigation = useNavigation()
    const route = useRoute()

    switch (type) {
        case 'text':
            return (
                <View style={styles.inputContainer}>
                    <Text style={{fontSize:16, fontWeight:'bold'}}>{required ? '* ' : ''}{title}</Text>
                    <TextInput style={{color:'black'}} editable={editable} defaultValue={defaultValue} returnKeyType={returnKeyType} value={value} placeholder={placeholder} onChangeText={onChangeText} />
                </View>
            )
        case 'date':
            return (
                <GestureHandlerRootView style={{width:'100%'}}>
                    <View style={styles.inputContainer}>
                        <Text style={{fontSize:16, fontWeight:'bold'}}>{required ? '* ' : ''}{title}</Text>
                        {/* <TextInput value={value} placeholder={placeholder} onChangeText={onChangeText} /> */}
                        <BorderlessButton onPress={chooseDate}>
                            <View accessible accessibilityRole="button" style={{flexDirection:'row', alignItems:'center'}}>
                                <Image style={{width:25, height:35, marginRight: 10}} resizeMode='contain' resizeMethod='resize' source={require('../assets/calendar.png')} />
                                <Text>{dateValue ? dateValue : 'Выбрать'}</Text>
                            </View>
                        </BorderlessButton>
                    </View>
                </GestureHandlerRootView>
            )
        case 'time':
            return (
                <GestureHandlerRootView style={{width:'100%'}}>
                    <View style={styles.inputContainer}>
                        <Text style={{fontSize:16, fontWeight:'bold'}}>{required ? '* ' : ''}{title}</Text>
                        {/* <TextInput value={value} placeholder={placeholder} onChangeText={onChangeText} /> */}
                        <BorderlessButton onPress={chooseTime}>
                            <View accessible accessibilityRole="button" style={{flexDirection:'row', alignItems:'center'}}>
                                <Image style={{width:25, height:35, marginRight: 10}} resizeMode='contain' resizeMethod='auto' source={require('../assets/clock.png')} />
                                <Text>{timeValue ? timeValue : 'Выбрать'}</Text>
                            </View>
                        </BorderlessButton>
                    </View>
                </GestureHandlerRootView>
            )
        case 'image':
            return (
                <GestureHandlerRootView>
                    <View style={{...styles.inputContainer}}>
                        <Text>{title}</Text>
                        <BaseButton enabled={enabled} onPress={pickImage}>
                            <View accessible accessibilityRole="button" style={{...styles.imgPick, borderWidth: image ? 0 : 2}}>
                                {image ? (
                                    <Image source={{uri: image.uri, width: image.width, height: image.height}} style={{flex: 1}} resizeMode='contain' resizeMethod='scale' />
                                ) : (
                                    <>
                                        <Image style={{width:25, height:35, marginRight: 10}} resizeMode='contain' resizeMethod='resize' source={require('../assets/camera.png')} />
                                        <Text style={{color:'#10dd', fontSize:16}}>Добавить фото</Text>
                                    </>
                                )}
                            </View>
                        </BaseButton>
                    </View>
                </GestureHandlerRootView>
            )
        case 'checkbox':
            const [checked, setChecked] = useState(defaultValue === 'true')
            return (
                <GestureHandlerRootView style={{width:'95%'}}>
                    <View style={{...styles.inputContainer, width:'100%'}}>
                        <BorderlessButton style={{width:'100%'}} onPress={() => {setChecked(!checked), onCheckboxChange(!checked)}}>
                            <Text style={{fontSize:16, fontWeight:'bold'}}>{required ? '* ' : ''}{title}</Text>
                            <View accessible accessibilityRole="button" style={{flexDirection:'row', justifyContent:'space-between', paddingTop:15, paddingRight:10, paddingBottom:5}}>
                                <Text>{checked ? 'Да' : 'Нет'}</Text>
                                <Checkbox value={checked} style={{}} /> 
                            </View>
                        </BorderlessButton>
                    </View>
                </GestureHandlerRootView>
            )
        case 'list':
            const [open, setOpen] = useState(false)
            const [select, setSelect] = useState(defaultValue || null)
            const [items, setItems] = useState([])

            useEffect(() => {
                setItems(value.sort((a, b) => a.id - b.id).map((val, i) => ({id:val.id, label: val.name, value: val.name, icon: () => (<Image source={{uri: `${REACT_NATIVE_API_URL}static/icoList/${val.ico}`}} resizeMode='contain' style={{width:15, height:15}} />)})))
            }, [value])

            useEffect(() => {
                onChangeText(select)
            }, [select])

            return (
                <View style={{...styles.inputContainer}}>
                    <Text style={{fontSize:16, fontWeight:'bold', marginBottom:5}}>{required ? '* ' : ''}{title}</Text>
                    <DropDownPicker itemSeparator={true} itemSeparatorStyle={{backgroundColor:'#dddd'}} modalAnimationType="fade" modalTitle={title} items={items} listMode='MODAL' setValue={setSelect} value={select} placeholder={placeholder} open={open} setOpen={setOpen} />
                </View>
            )
        case 'slider':
            const [progress, setProgress] = useState(Number(defaultValue) || 0)

            useEffect(() => {
                let timer = setTimeout(() => {
                    onChangeText(progress)
                }, 500);
                return () => {
                    clearTimeout(timer)
                }
            }, [progress])

            return (
                <View style={{...styles.inputContainer}}>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{fontSize:16, fontWeight:'bold', marginBottom:5}}>{required ? '* ' : ''}{title}</Text>
                        <Text>{progress}</Text>
                    </View>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
                        <TouchableWithoutFeedback onPress={() => setProgress(0)}>
                            <Image source={require('../assets/close.png')} style={{width:18, height:18, tintColor:'#005D99'}} />
                        </TouchableWithoutFeedback>
                        <View style={{width:'75%'}}>
                            <Slider animateTransitions minimumTrackTintColor={progress !== 100 ? '#005D99' : 'green'} thumbStyle={{backgroundColor:'white', borderWidth:2, borderColor:'#005D99'}} step={5} minimumValue={0} maximumValue={100} value={progress} onValueChange={(val) => setProgress(Math.floor(val))} />
                        </View>
                        <TouchableWithoutFeedback onPress={() => setProgress(100)}>
                            <Image source={require('../assets/check.png')} style={{width:20, height:20, tintColor: progress !== 100 ? '#005D99' : 'green'}} />
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            )
        case 'btnList':
            const [btns, setBtns] = useState(value.sort((a, b) => a.id - b.id))
            const [chosed, setChosed] = useState(defaultValue || 'Средний')

            useEffect(() => {
              onChangeText(chosed)
            }, [chosed])

            const rotate = useSharedValue(0)

            const reanimatedStyle = useAnimatedStyle(() => {
                return {
                    transform:[{rotate: `${rotate.value}deg`}],
                }
            }, [])
            

            const MyBtn = ({value, chosed}) => {
                return (
                    <GestureHandlerRootView>
                        <View>
                            <BaseButton onPress={() => setChosed(value.name)} style={{borderRadius:10, backgroundColor: !chosed ? '#dddd' : '#005D99'}}>
                                <View accessible accessibilityRole="button" style={{padding:5, paddingLeft:20, paddingRight:20, display:'flex', flexDirection:'row', alignItems:'center'}}>
                                    {/* <Image source={{uri: `${REACT_NATIVE_API_URL}static/icoList/${value.ico}`, width:30, height:30}} style={{marginRight:'3%'}} />  */}
                                    <Text style={{color: !chosed ? 'black' : 'white'}}>{value.name}</Text>
                                </View>
                            </BaseButton>
                        </View>
                    </GestureHandlerRootView>
                )
            }

            
            useEffect(() => {
              switch (chosed) {
                case 'Низкий':
                    rotate.value = withSpring(-180)
                    break;
                case 'Средний':
                    rotate.value = withSpring(-90)
                    break;
                case 'Высокий':
                    rotate.value = withSpring(0)
                    break;
                default:
                    break;
              }
            }, [chosed])
            
            return (
                <View style={{...styles.inputContainer}}>
                    <View style={{display:'flex', flexDirection:'row', justifyContent:'space-between', marginBottom:10}}>
                        <Text style={{fontSize:16, fontWeight:'bold', marginBottom:5}}>{required ? '* ' : ''}{title}</Text>
                        <View>
                            <Animated.Image source={require('../assets/arrow.png')} style={[{width:50, height:50, position:'absolute', zIndex:100}, reanimatedStyle]} />
                            <Animated.Image source={require('../assets/bar.png')} style={[{width:50, height:50}]} />
                        </View>
                    </View>
                    <View style={{justifyContent:'space-around', display:'flex', flexDirection:'row'}}>
                        {btns.map((val) => <MyBtn value={val} chosed={val.name === chosed} />)}
                    </View>
                </View>
            )
        case 'user':
            const [user, setUser] = useState(defaultValue)

            useEffect(() => {
                if (route.params?.user?.name) {
                    setUser(route.params?.user?.name)
                }
            }, [route])
            
            useEffect(() => {
                console.log('user', user)
                if (user) {
                    onChangeText(user)
                }
            }, [user])
            
            
            return (
                <View style={styles.inputContainer}>
                    <Text style={{fontSize:16, fontWeight:'bold'}}>{required ? '* ' : ''}{title}</Text>
                    <MyButton onPress={() => navigation.navigate({name: 'Пользователи', params:{userPick: true}})} title={user ? user : 'Выбрать'} custom={{button:{height:35, display:'flex', alignItems:'center', justifyContent:'center', backgroundColor:'#2894f4', borderRadius:5}, text:{color:'white', fontWeight:'bold'}}} />
                </View>
            )
        default:
            return (
                <Text>Молодец (нет)</Text>
            )
    }
}

export default MyInput

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor:'white',
        flexDirection:'column',
        width:'95%',
        borderRadius: 5,
        marginTop:5,
        alignSelf:'center',
        // height:200,
        padding: 10,
        marginBottom: 5,
        // height:500,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    imgPick: {
        borderColor: 'blue',
        borderWidth: 2,
        padding:35,
        height:150,
        justifyContent:'center',
        alignItems:'center',
        borderStyle:'dotted',
        flexDirection:'row',
    }
});
  