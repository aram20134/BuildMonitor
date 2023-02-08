import { Image, StyleSheet, Text, View } from "react-native"
import { BaseButton, BorderlessButton, GestureHandlerRootView, TextInput } from "react-native-gesture-handler"
import * as ImagePicker from 'expo-image-picker'

const MyInput = ({title, required = false, placeholder, onChangeText, value, type, onPress, image, setImage}) => {

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
      
          console.log(result);
      
          if (!result.canceled) {
            setImage(result.assets[0].uri);
          }
    }

    switch (type) {
        case 'input':
            return (
                <View style={styles.inputContainer}>
                    <Text style={{fontSize:16, fontWeight:'bold'}}>{required ? '* ' : ''}{title}</Text>
                    <TextInput value={value} placeholder={placeholder} onChangeText={onChangeText} />
                </View>
            )
        case 'date':
            return (
                <GestureHandlerRootView>
                    <View style={styles.inputContainer}>
                        <Text style={{fontSize:16, fontWeight:'bold'}}>{required ? '* ' : ''}{title}</Text>
                        {/* <TextInput value={value} placeholder={placeholder} onChangeText={onChangeText} /> */}
                            <BorderlessButton onPress={onPress}>
                                <View accessible accessibilityRole="button" style={{flexDirection:'row', alignItems:'center'}}>
                                    <Image style={{width:25, height:35, marginRight: 10}} resizeMode='contain' resizeMethod='resize' source={require('../assets/calendar.png')} />
                                    <Text>{value ? value : 'Выбрать'}</Text>
                                </View>
                            </BorderlessButton>
                    </View>
                </GestureHandlerRootView>
            )
        case 'image':
            return (
                <GestureHandlerRootView>
                    <View style={{...styles.inputContainer}}>
                        <Text>Логотип проекта</Text>
                        <BaseButton onPress={pickImage}>
                            <View accessible accessibilityRole="button" style={styles.imgPick}>
                                <Image style={{width:25, height:35, marginRight: 10}} resizeMode='contain' resizeMethod='resize' source={require('../assets/camera.png')} />
                                <Text style={{color:'#10dd', fontSize:16}}>Добавить фото</Text>
                            </View>
                        </BaseButton>
                    </View>
                </GestureHandlerRootView>
            )
        default:
            break;
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
        justifyContent:'center',
        alignItems:'center',
        borderStyle:'dotted',
        flexDirection:'row'
    }
});
  