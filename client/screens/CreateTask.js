import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView } from "react-native-gesture-handler";
import { addTask, getForms } from "../api/projectAPI";
import ArrowButton from "../compontents/ArrowButton";
import MyButton from "../compontents/MyButton";
import MyInput from "../compontents/MyInput";
import { BuildMonitor } from "../App"
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const CreateTask = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [forms, setForms] = useState([])
  const [selectedForm, setSelectedForm] = useState(null)
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState()

  const [allValues, setAllValues] = useState({})
  const { chosedLayer, user } = useContext(BuildMonitor)

  useEffect(() => {
    setLoading(true)
    getForms().then((res) => res.map((form) => setForms(prev =>[...prev, {label: form.name, value: form, icon: () => <Image source={require('../assets/form.png')} style={{width:15, height:15}} />}]))).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const createTask = new FormData()
    if (image) {
      var imageFile = {
          uri: image.uri,
          type: 'image/jpeg',
          name: 'photo.jpg'
      }
      createTask.append('image', imageFile)
    }
    // allValues, formId, layerId, author, taskId
    console.log(allValues)
    console.log(imageFile)
    createTask.append('allValues', JSON.stringify(allValues))
    createTask.append('formId', selectedForm?.id)
    createTask.append('layerId', chosedLayer.id)
    createTask.append('author', user.name)
  
    navigation.setOptions({
      headerRight: () => (
          <MyButton custom={{text: {color:'#005D99', padding:10, paddingBottom: 5, paddingTop:5, backgroundColor:'white', borderRadius:5}}} enabled={!loading} title={"Сохранить"} onPress={() => addTask(createTask).then(() => navigation.goBack()).catch((e) => console.log(e))} />
      ),
    })
  }, [loading, allValues, selectedForm])

  const chooseDate = (info) => {
    DateTimePickerAndroid.open({
        onChange: (event, selectetDate) => setAllValues(prev => ({...prev, [info.name]: selectetDate})),
        mode: 'date',
        value: new Date(),
    })
  }
  const chooseTime = (info) => {
    DateTimePickerAndroid.open({
        onChange: (event, selectetDate) => setAllValues(prev => ({...prev, [info.name]: selectetDate})),
        mode: 'time',
        value: new Date(),
        is24Hour: true
    })
  }

  useEffect(() => {
    setImage()
    setAllValues({})
    if (selectedForm) {
      selectedForm.formInfos.map((inf) => setAllValues(prev => ({...prev, [inf.name]: null})))
    }
  }, [selectedForm])
    
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{...styles.btnCont, marginBottom:20, zIndex:1000, elevation:10 }}>
            <Text style={{marginBottom:5, fontWeight:'bold'}}>Форма</Text>
            {!loading ? <DropDownPicker mode='BADGE' placeholder="Выберите форму" open={open} setOpen={setOpen} value={selectedForm} setValue={setSelectedForm} items={forms} setItems={setForms} /> : (<ActivityIndicator />)}
        </View>
        <View style={{width:'100%'}}>
          <MyInput enabled={!open} setImage={setImage} image={image} title={'Фотография'} type={'image'} />
        </View>
        <MyInput onChangeText={(text) => setAllValues({...allValues, ['Название']: text})} placeholder={'Добавить текст'} required type='text' title={'Название'} />
        {selectedForm?.formInfos.map((info) => <MyInput timeValue={allValues[info.name] && format(allValues[info.name], 'HH:mm', {locale: ru})} dateValue={allValues[info.name] && format(allValues[info.name], 'dd.MM.yyyy', {locale: ru})} chooseTime={() => chooseTime(info)} chooseDate={() => chooseDate(info)} defaultValue={allValues[info.name]} onCheckboxChange={(val) => setAllValues({...allValues, [info.name]: val})} onChangeText={(text) => setAllValues({...allValues, [info.name]: text})} title={info.name} type={info.type} placeholder={'Добавить текст'} />)}
      </View>
    </ScrollView>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // height:500,
    // backgroundColor:'green'
    
  },
  btnCont: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 10,
    padding:10,
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 14,
  },
  inpCont: {
    width: "100%",
  },
  info: {
    padding: 15,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
