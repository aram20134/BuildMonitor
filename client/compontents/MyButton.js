import { ActivityIndicator, Button, View } from "react-native"


const MyButton = ({title, onPress, disabled = false}) => {
    return !disabled ? (
        <View style={{display:'flex', justifyContent:'center'}}>
            <Button title={title} onPress={onPress} />
        </View>
        
    ) : (
        <View style={{display:'flex', justifyContent:'center'}}>
            <Button title='' onPress={onPress} disabled />
            <ActivityIndicator style={{position:'absolute', alignSelf:'center'}} />
        </View>
    )
}

export default MyButton