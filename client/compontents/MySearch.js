import { useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import { TextInput, View } from 'react-native'

const MySearch = ({search, setSearch}) => {
  const [searching, setSearching] = useState(false)
  return (
    <View style={{...styles.cont, backgroundColor:'#DDDD', borderRadius:5, marginTop:10, justifyContent:'center', paddingLeft:30}}>
      <TextInput value={search} onChangeText={(text) => setSearch(text)} onTouchStart={() => setSearching(true)} onEndEditing={() => setSearching(false)} placeholder="Поиск" />
      {searching
        ? <Image source={require('../assets/closeBlack.png')} resizeMode='contain' style={{width:30, height:30, transform: [{scale: 0.5}], position:'absolute'}} />
        : <Image source={require('../assets/searchBlack.png')} resizeMode='contain' style={{width:25, height:25, position:'absolute'}} />
      }
    </View>
  )
}

export default MySearch

const styles = StyleSheet.create({
	cont: {
		width:'95%', 
		backgroundColor:'white',
		padding:5,
	},
})