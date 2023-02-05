import { ActivityIndicator, Button, View } from "react-native"


const MyButton = ({title, onPress, disabled = false}) => {
    return !disabled ? (
        <Button title={title} onPress={onPress} />
    ) : (
        <View style={{display:'flex', justifyContent:'center'}}>
            <Button title='' onPress={onPress} disabled />
            <ActivityIndicator style={{position:'absolute', alignSelf:'center'}} />
        </View>
    )
}

export default MyButton