import { ActivityIndicator, Button, Text, View } from "react-native"
import { BaseButton, GestureHandlerRootView } from "react-native-gesture-handler"


const MyButton = ({title, onPress, enabled = true, custom}) => {
    if (custom) {
        return (
            <GestureHandlerRootView style={custom.container}>
                <BaseButton enabled={enabled} title={title} onPress={onPress} style={custom.button}>
                    <View accessible accessibilityRole="button">
                        <Text style={custom.text}>{title}</Text>
                    </View>
                </BaseButton>
            </GestureHandlerRootView>
        )
    }
    return enabled ? (
        <GestureHandlerRootView>
            <BaseButton enabled={enabled} title={title} onPress={onPress}>
                <View accessible accessibilityRole="button">
                    <Text style={{padding:10, fontWeight:'bold'}}>{title}</Text>
                </View>
            </BaseButton>
        </GestureHandlerRootView>
        // <View style={{display:'flex', justifyContent:'center'}}>
        //     <Button title={title} onPress={onPress} />
        // </View>
        
    ) : (
        <GestureHandlerRootView>
            <BaseButton enabled={enabled} title={title} onPress={onPress}>
                <View accessible accessibilityRole="button">
                    <Text style={{padding:10, fontWeight:'bold'}}><ActivityIndicator size={'small'} style={{position:'absolute', alignSelf:'center'}} /></Text>
                </View>
            </BaseButton>
        </GestureHandlerRootView>
        // <View style={{display:'flex', justifyContent:'center'}}>
        //     <Button title='' onPress={onPress} disabled />
        //     <ActivityIndicator style={{position:'absolute', alignSelf:'center'}} />
        // </View>
    )
}

export default MyButton