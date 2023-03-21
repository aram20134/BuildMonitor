import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { addUserToProject, getProjectUsers } from "../api/projectAPI"
import { getAllUsers } from "../api/userAPI"
import { BuildMonitor } from "../App"
import MyButton from "../compontents/MyButton"
import MySearch from "../compontents/MySearch"


const AddUser = ({ navigation }) => {
  const { chosedProject } = useContext(BuildMonitor)
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])
  const [projectUsers, setProjectUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllUsers(chosedProject.id).then((res) => setUsers(res))
    getProjectUsers(chosedProject.id).then((res) => setProjectUsers(res)).finally(() => setLoading(false))
  }, [])

  const UserLine = ({user, i}) => {
    const [added, setAdded] = useState(projectUsers.filter((prjUser) => prjUser.id === user.id).length === 1 ? true : false)
   
    return (
      <View style={{borderBottomWidth: i === users.length - 1 ? 0 : 0.5, borderColor:'gray'}}>
        <View style={{margin:10, display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <View>
            <Text style={{fontWeight:'bold'}}>{user.name}</Text>
            <Text style={{color:'gray'}}>{user.email}</Text>
          </View>
          <Button onPress={() => {addUserToProject(chosedProject.id, user.id).then(() => setAdded(true))}} disabled={added} title={added ? 'В проекте' : 'Добавить'} />
        </View>
      </View>
    )
  }
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <MySearch search={search} setSearch={setSearch} />
        <View style={{backgroundColor:'white', width:'95%', marginTop:10, borderRadius:5, flex:1}}>
          <View style={{margin:10, display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            <Text style={{fontWeight:'bold', fontSize:16}}>Добавить пользователя</Text>
            {/* <Text style={{color:'gray'}}>Всего: {count}</Text> */}
          </View>
          {loading 
          ? <ActivityIndicator size={'large'} /> 
          : users.filter((user) => 
            user.name.toLowerCase().includes(search.toLowerCase())).map((user, i) => 
            <UserLine key={user.name} user={user} i={i} />
          )}
        </View>
      </View>
    </ScrollView>
  )
}

export default AddUser

const styles = StyleSheet.create({
  container: {
		flex: 1,
		alignItems: "center",
		height:'100%',
	},
});