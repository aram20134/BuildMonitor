import { Image, StyleSheet, Text, View } from "react-native"
import { BaseButton, BorderlessButton, GestureHandlerRootView, TextInput } from "react-native-gesture-handler"
import * as ImagePicker from 'expo-image-picker'
import Checkbox from "expo-checkbox"
import { useState } from "react"

const MyInput = ({title, required = false, placeholder, chooseDate, timeValue, chooseTime, onChangeText, value, type, onPress, image, setImage, returnKeyType, enabled = true, onCheckboxChange, defaultValue, dateValue}) => {

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

    switch (type) {
        case 'text':
            return (
                <View style={styles.inputContainer}>
                    <Text style={{fontSize:16, fontWeight:'bold'}}>{required ? '* ' : ''}{title}</Text>
                    <TextInput defaultValue={defaultValue} returnKeyType={returnKeyType} value={value} placeholder={placeholder} onChangeText={onChangeText} />
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
  