import { DrawerContentScrollView } from "@react-navigation/drawer"
import { useContext, useEffect, useState } from "react"
import { Button, Image, Pressable, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { BuildMonitor } from "../App"
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { BaseButton } from "react-native-gesture-handler"

const CustomDrawer = ({ navigation }) => {
    const [pressed, setPressed] = useState(false)
    const { user } = useContext(BuildMonitor)

    const date = format(new Date(), 'EEEE, d MMMM yyyy', {locale: ru})
    
    const createProject = () => {
        navigation.navigate('Создать проект')
    }
    
    return user && (
        <DrawerContentScrollView style={{backgroundColor:'#222836'}}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image resizeMode='contain' resizeMethod='resize' style={{width: 130, height: 32}} source={require('../assets/logoLight.png')} />
                    <View>
                        <Text style={{color:'white'}}>{user.name}</Text>
                        <Text style={{fontSize: 11, color:'gray'}}>{date}</Text>
                    </View>
                </View>
                <View style={{width:'100%'}}>
                    <BaseButton onPress={createProject} style={styles.btnCreate}>
                        <Text style={{color:'green'}}>+   Создать новый проект</Text>
                    </BaseButton>
                </View>
            </View>
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      color:'white',
      alignItems: 'flex-start',
      justifyContent:'space-between',
    },
    header: {
        color:'white',
        flexDirection:'row'
    },
    btnCreate: {
        // backgroundColor: 'gray',
        color:'green',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        padding:10,
    }
});

export default CustomDrawer