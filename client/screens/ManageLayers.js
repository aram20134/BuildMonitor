import { useFocusEffect } from "@react-navigation/native"
import { useCallback, useContext, useEffect, useState } from "react"
import { Image, Keyboard, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import DraggableFlatList, { NestableDraggableFlatList, NestableScrollContainer, ScaleDecorator } from "react-native-draggable-flatlist"
import { BaseButton, GestureHandlerRootView, TextInput } from "react-native-gesture-handler"
import { Header } from "react-native/Libraries/NewAppScreen"
import { changeLayersPos, getProjects } from "../api/projectAPI"
import { BuildMonitor } from "../App"

const ManageLayers = ({ navigation }) => {
	const [searching, setSearching] = useState(false)
	const [search, setSearch] = useState('')
	const [layers, setLayers] = useState([])
	const { chosedProject, setChosedProject, setProjects } = useContext(BuildMonitor)
	const [refreshing, setRefreshing] = useState(false)

	const onRefresh = () => {
		setLayers(chosedProject.layers)
		console.log(chosedProject.layers)
	}

	useEffect(() => {
		if (layers.length) {
			console.log(layers)
			changeLayersPos(layers).then((res) => console.log(res))
			setChosedProject(prev => ({...prev, layers: layers}))
		}
	}, [layers])

	useFocusEffect(useCallback(() => {
		console.log('layers')
		setLayers(chosedProject.layers)
		navigation.setOptions({title: chosedProject.name})
    }, []))
	
	// setLayers(prev => prev.map((layer, i) => ({...layer, pos: i}) )), 
	// () => setLayers(prev => prev.map((layer, i) => ({...layer, pos: i}) ))

	const BtnIco = () => {
		return (
			<GestureHandlerRootView>
				<BaseButton onPress={() => navigation.navigate('Создать слой')} rippleColor={'#005D99'} style={{borderRadius:10}}>
					<View accessible accessibilityRole="button" style={{justifyContent:'center'}}>
						<Image source={require('../assets/layerPlus.png')} style={{width:25, height:25, position:'absolute', margin:5, transform: [{scale: 0.8}]}} resizeMode='center' />
						<Text style={{padding:10, color:'#005D99', paddingLeft:40, fontWeight:'500'}}>Добавить слой</Text>
					</View>
				</BaseButton>
			</GestureHandlerRootView>
		)
	}

	const Item = ({item, drag, isActive, getIndex}) => {
		return (
				<BaseButton onLongPress={drag} style={{borderRadius:10}}>
					<View accessible accessibilityRole="button" style={{justifyContent:'center'}}>
						<Text style={{padding:10, color:'#005D99', fontWeight:'500'}}>{item.name}</Text>
					</View>
					{layers.length !== getIndex() + 1 && <View style={{backgroundColor: '#CCCC', height:1}}></View>}
				</BaseButton>
		)
	}

	return (
		<NestableScrollContainer refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<GestureHandlerRootView>
				<View style={styles.container}>
					<View style={{...styles.cont, backgroundColor:'#DDDD', borderRadius:5, marginTop:10, justifyContent:'center', paddingLeft:30}}>
						<TextInput value={search} onChangeText={(text) => setSearch(text)} onTouchStart={() => setSearching(true)} onEndEditing={() => setSearching(false)} placeholder="Поиск" />
						{searching
						? <Image source={require('../assets/closeBlack.png')} resizeMode='contain' style={{width:30, height:30, transform: [{scale: 0.5}], position:'absolute'}} />
						: <Image source={require('../assets/searchBlack.png')} resizeMode='contain' style={{width:25, height:25, position:'absolute'}} />
						}
					</View>
					<View style={{...styles.cont, marginTop:10, marginBottom:20, padding:0, borderRadius:10}}>
						<BtnIco />
					</View>
					<View style={{...styles.cont, marginBottom:20, padding:0, borderRadius:10}}>
						{/* {layers?.filter((layer) => layer.name.toLowerCase().includes(search.toLowerCase())).map((layer, i) => <Item layer={layer} i={i} />)} */}
						{layers && <NestableDraggableFlatList data={layers?.filter((layer) => layer.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.pos - b.pos)} onDragEnd={({data}) => setLayers(data.map((layer, i) => ({...layer, pos: i}) ))} keyExtractor={(item) => item.id} renderItem={Item} />}
					</View>
				</View>
			</GestureHandlerRootView>
		</NestableScrollContainer>
	)
}	

export default ManageLayers

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		height:'100%',
	},
	cont: {
		width:'95%', 
		backgroundColor:'white',
		padding:5,
	},
	rowItem: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
})