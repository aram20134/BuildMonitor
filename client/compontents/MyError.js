import { useEffect } from "react";
import { Text } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";


const MyError = ({errorMsg, trigger}) => {
    const opacity = useSharedValue(0)
    const bottom = useSharedValue(1)

    const reanimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            bottom: bottom.value
        }
    }, [])

    const Animate = () => {
        bottom.value = withSpring(10)
        opacity.value = withTiming(1)
        
        let timer = setTimeout(() => {
            bottom.value = withSpring(-150)
            opacity.value = withTiming(0)
        }, 3000);
    }
    useEffect(() => {
        if (trigger) {
            Animate()
        }
    }, [trigger])
    

    return (
        <Animated.View style={[{position:'absolute', backgroundColor:'#1a1a1a', width:'100%', bottom:-150, display:'flex', justifyContent:'center', alignItems:'center'}, reanimatedStyle]}>
            <Text style={{fontSize:14, color:'#fff', padding:10}}>{errorMsg}</Text>
        </Animated.View>
    )
}

export default MyError