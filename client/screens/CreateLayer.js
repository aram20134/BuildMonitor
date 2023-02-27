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
	  console.log(image)
	}, [image])
	

	const pushAndNavigate = () => {
		const createLayer = new FormData()
		if (image) {
			var imageFile = {
				uri: image.uri,
				type: `image/${image.uri.split('.').pop()}`,
				name: `photo.${image.uri.split('.').pop()}`
			}
			console.log(imageFile)
			createLayer.append('image', imageFile)
		  }
		createLayer.append('name', name)
		createLayer.append('projectId', chosedProject.id)
		addLayer(createLayer).then((res) => setChosedProject(prev => ({...prev, layers: [...prev.layers, res]}))).catch((e) => {setTrigger(true), setTrigger(false)})
		
		navigation.goBack()
	}

	return (
		<View style={styles.container}>
			<MyInput onChangeText={setName} value={name} type={'text'} title={'Имя слоя'} placeholder='Название' />
			<View style={{width:'100%'}}>
				<MyInput setImage={setImage} image={image} type={'image'} title={'Выберите чертёж'} />
			</View>
			<View style={{width:'95%', marginTop:15}}>
				<Button onPress={pushAndNavigate} title="Добавить слой" />
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
