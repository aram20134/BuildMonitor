import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { useCallback, useContext, useEffect, useState } from "react"
import { Button, Image, StyleSheet, Text, TouchableHighlight, View } from "react-native"
import { BaseButton, GestureHandlerRootView, ScrollView } from "react-native-gesture-handler"
import { getProjectUsers } from "../api/projectAPI"
import { BuildMonitor } from "../App"
import ArrowButton from "../compontents/ArrowButton"
import MySearch from "../compontents/MySearch"

const Users = ({ navigation, route }) => {
  const { chosedProject } = useContext(BuildMonitor)
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [count, setCount] = useState(0)
  const [prevRoute, setPrevRoute] = useState('')

  const userPick = route.params?.userPick

  const HeaderRight = () => {
    return (
      <GestureHandlerRootView>
        <BaseButton onPress={() => navigation.navigate('Добавить')}>
          <View accessible accessibilityRole="button" style={{padding:5}}>
            <Image source={require('../assets/plus.png')} style={{width:25, height:25}} />
          </View>
        </BaseButton>
      </GestureHandlerRootView>
    )
  }
  useFocusEffect(useCallback(() => {
    getProjectUsers(chosedProject.id).then((res)=> setUsers(res))
  }, []))

  useEffect(() => {
    console.log(route) 
    const routes = navigation.getState()?.routes
    setPrevRoute(routes[routes.length - 2])
    !userPick && navigation.setOptions({headerRight: () => <HeaderRight />})
  }, [userPick])
  
  useEffect(() => {
    setCount(users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())).length)
  }, [search, users])

  return !userPick ? (
    <ScrollView>
      <View style={styles.container}>
        <MySearch search={search} setSearch={setSearch} />
        <View style={{backgroundColor:'white', width:'95%', marginTop:10, borderRadius:5, flex:1}}>
          <View style={{margin:10, display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontWeight:'bold', fontSize:16}}>Пользователи в проекте</Text>
            <Text style={{color:'gray'}}>Всего: {count}</Text>
          </View>
          {users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())).map((user, i) => 
            <View key={user.id} style={{borderBottomWidth: i === users.length - 1 ? 0 : 0.5, borderColor:'gray'}}>
              <ArrowButton onPress={() => navigation.navigate('UserInfo', user)} title={<View><Text style={{fontWeight:'bold'}}>{user.name}</Text><Text style={{color:'gray'}}>{user.email}</Text></View>} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  ) : (
    <ScrollView>
      <View style={styles.container}>
        <MySearch search={search} setSearch={setSearch} />
        <View style={{backgroundColor:'white', width:'95%', marginTop:10, borderRadius:5, flex:1}}>
          <View style={{margin:10, display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontWeight:'bold', fontSize:16}}>Пользователи в проекте</Text>
            <Text style={{color:'gray'}}>Всего: {count}</Text>
          </View>
          {users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase())).map((user, i) => 
            <View key={user.id} style={{borderBottomWidth: i === users.length - 1 ? 0 : 0.5, borderColor:'gray'}}>
              <ArrowButton onPress={() => navigation.navigate({name: prevRoute.name, params: {user}, merge:true})} title={<View><Text style={{fontWeight:'bold'}}>{user.name}</Text><Text style={{color:'gray'}}>{user.email}</Text></View>} />
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default Users

const styles = StyleSheet.create({
  container: {
		flex: 1,
		alignItems: "center",
		height:'100%',
	},
});