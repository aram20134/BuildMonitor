import { useEffect } from "react"
import { Button, Text, View } from "react-native"

const Test = ({ navigation }) => {
    
    return (
        <View>
            <Text>Testing...</Text>
            <Button title="nazad" onPress={() => navigation.goBack()} />
        </View>
    )
}

export default Test