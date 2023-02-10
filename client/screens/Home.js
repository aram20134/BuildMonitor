import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
  
  const Tab = createMaterialTopTabNavigator()

const Tasks = () => {
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text>Tasks</Text>
        </View>
    )
}

const Plans = () => {

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text>Plans</Text>
        </View>
    )
}

const Home = () => {
    return (
      <Tab.Navigator screenOptions={{tabBarStyle: {backgroundColor:'#42b3ff'}, tabBarLabelStyle:{fontWeight:'bold', fontSize:14}, tabBarIndicatorStyle:{backgroundColor:'white'}}} >
        <Tab.Screen name="Задачи"  component={Tasks} />
        <Tab.Screen name="План" component={Plans}  />
      </Tab.Navigator>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "white",
    },
});