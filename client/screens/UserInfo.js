import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import { getProjectUser } from '../api/projectAPI';
import { BuildMonitor } from '../App';
import MyInput from '../compontents/MyInput';

const UserInfo = ({navigation, route}) => {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)

  const {id, name, email, role} = route.params

  const { chosedProject } = useContext(BuildMonitor)

  useEffect(() => {
    navigation.setOptions({title: `${name}`})
    getProjectUser(chosedProject.id).then((res) => setUser(res)).finally(() => setLoading(false))
  }, [])
  
  return (
    <View style={styles.container}>
      <MyInput type={'text'} title={'Имя'} defaultValue={name} editable={false} />
      <MyInput type={'text'} title={'Почта'} defaultValue={email} editable={false} />
      <MyInput type={'text'} title={'Проект'} defaultValue={chosedProject.name} editable={false} />
      <MyInput type={'text'} title={'Роль'} defaultValue={role} editable={false} />
      <View style={{width:'95%'}}>
        {loading ? <ActivityIndicator size={'large'} /> : <Button disabled={role === 'Администратор' || user.id === id || user.role !== 'Администратор'} color={'red'} title='Удалить из проекта' />}
      </View>
    </View>
  )
}

export default UserInfo

const styles = StyleSheet.create({
  container: {
		flex: 1,
		alignItems: "center",
		height:'100%',
	},
});