import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"


const Home = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
            <Text>Home</Text>
        </SafeAreaView>
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
  