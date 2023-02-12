import { Image, Text, View } from 'react-native'
import { BaseButton, GestureHandlerRootView } from 'react-native-gesture-handler'

const ArrowButton = ({title}) => {
    return (
        <GestureHandlerRootView>
            <BaseButton onPress={''}>
                <View accessible accessibilityRole="button" style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:15}}>
                    <Text style={{}}>{title}</Text>
                    <Image source={require('../assets/backGray.png')} style={{width:20, height:20, transform: [{rotate: '180deg'}, {scale:0.8}]}} />
                </View>
            </BaseButton>
        </GestureHandlerRootView>
    )
}

export default ArrowButton