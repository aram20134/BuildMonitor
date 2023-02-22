import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useContext, useEffect, useState } from "react"
import { Button, StyleSheet, Text, View } from "react-native"
import { addLayer, getProjects } from "../api/projectAPI"
import { BuildMonitor } from "../App"
import MyError from "../compontents/MyError"
import MyInput from "../compontents/MyInput"

const CreateLayer = ({ navigation }) => {
	const { chosedProject, setChosedProject, setProjects } = useContext(BuildMonitor)
	const [name, setName] = useState()
	const [image, setImage] = useState()
	const [trigger, setTrigger] = useState(false)

	useEffect(() => {
	  console.log(chosedProject)
	}, [])
	

	const pushAndNavigate = (res) => {
		// console.log(({...chosedProject, layers: [...chosedProject.layers, {...res}]}))
		navigation.goBack()
		setChosedProject(prev => ({...prev, layers: [...prev.layers, res]}))
		// setChosedProject(prev => prev)
	}

	return (
		<View style={styles.container}>
			<MyInput onChangeText={setName} value={name} type={'text'} title={'Имя слоя'} placeholder='Название' />
			<View style={{width:'100%'}}>
				<MyInput setImage={setImage} image={image} type={'image'} title={'Выберите чертёж'} />
			</View>
			<View style={{width:'95%', marginTop:15}}>
				<Button onPress={() => addLayer(name, chosedProject.id).then((res) => pushAndNavigate(res)).catch((e) => {console.log(e)})} title="Добавить слой" />
			</View>
			<MyError trigger={trigger} errorMsg={'Заполнены не все поля!'} />
		</View>
	)
}

export default CreateLayer

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems:'center',
	},
});
