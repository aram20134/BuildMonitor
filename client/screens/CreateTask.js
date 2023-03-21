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
import { NestableScrollContainer } from "react-native-draggable-flatlist";

const CreateTask = ({ navigation }) => {
  const [loading, setLoading] = useState(true)
  const [forms, setForms] = useState([])
  const [selectedForm, setSelectedForm] = useState(null)
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState()

  const [allValues, setAllValues] = useState({})
  const { setChosedLayer, chosedLayer, user, chosedProject, setChosedProject } = useContext(BuildMonitor)

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
    createTask.append('allValues', JSON.stringify(allValues))
    createTask.append('formId', selectedForm?.id)
    createTask.append('layerId', chosedLayer.id)
    createTask.append('author', user.name)

    const refreshData = (res) => {
      setChosedLayer({...chosedLayer, tasks: [...chosedLayer.tasks, res]})
      setChosedProject({...chosedProject, layers: [...chosedProject.layers.map((layer) => layer.id === chosedLayer.id ? {...layer, tasks: [...layer.tasks, res]} : layer)]})
    }
  
    navigation.setOptions({
      headerRight: () => (
          <MyButton custom={{text: {color:'#005D99', padding:10, paddingBottom: 5, paddingTop:5, backgroundColor:'white', borderRadius:5}}} enabled={!loading} title={"Сохранить"} onPress={() => addTask(createTask).then((res) => {refreshData(res), navigation.goBack()}).catch((e) => console.log('btn:',e))} />
      ),
    })
    console.log(allValues)
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
    <NestableScrollContainer nestedScrollEnabled={true}>
      <View style={styles.container}>
        <View style={{...styles.btnCont, marginBottom:20, zIndex:1000, elevation:10 }}>
            <Text style={{marginBottom:5, fontWeight:'bold'}}>Форма</Text>
            {!loading ? <DropDownPicker itemKey="id" listMode='SCROLLVIEW' theme='LIGHT' placeholder="Выберите форму" open={open} setOpen={setOpen} value={selectedForm} setValue={setSelectedForm} items={forms} /> : (<ActivityIndicator />)}
        </View>
        <View style={{width:'100%'}}>
          <MyInput enabled={!open} setImage={setImage} image={image} title={'Фотография'} type={'image'} />
        </View>
        <MyInput onChangeText={(text) => setAllValues({...allValues, ['Название']: text})} placeholder={'Добавить текст'} required type='text' title={'Название'} />
        {selectedForm?.formInfos.map((info) => {
          switch (info.type) {
            case 'text':
              // timeValue={allValues[info.name] && format(allValues[info.name], 'HH:mm', {locale: ru})} dateValue={allValues[info.name] && format(allValues[info.name], 'dd.MM.yyyy', {locale: ru})} chooseTime={() => chooseTime(info)} chooseDate={() => chooseDate(info)} defaultValue={allValues[info.name]} onCheckboxChange={(val) => setAllValues({...allValues, [info.name]: val})}
              return <MyInput key={info.name} onChangeText={(text) => setAllValues({...allValues, [info.name]: text})} defaultValue={allValues[info.name]} title={info.name} type={info.type} placeholder={'Добавить текст'} />
            case 'date':
              return <MyInput key={info.name} chooseDate={() => chooseDate(info)} dateValue={allValues[info.name] && format(allValues[info.name], 'dd.MM.yyyy', {locale: ru})} defaultValue={allValues[info.name]} title={info.name} type={info.type} placeholder={'Добавить текст'} />
            case 'time':
              return <MyInput key={info.name} chooseTime={() => chooseTime(info)} timeValue={allValues[info.name] && format(allValues[info.name], 'HH:mm', {locale: ru})} defaultValue={allValues[info.name]} title={info.name} type={info.type} placeholder={'Добавить текст'} />
            case 'image': 
              return <MyInput key={info.name} image={image} setImage={setImage} defaultValue={allValues[info.name]} title={info.name} type={info.type} placeholder={'Добавить текст'} />
            case 'checkbox':
              return <MyInput key={info.name} onCheckboxChange={(val) => setAllValues({...allValues, [info.name]: val})} defaultValue={allValues[info.name]} title={info.name} type={info.type} placeholder={'Добавить текст'} />
            case 'list':
              return <MyInput onChangeText={(val) => setAllValues({...allValues, [info.name]: val})} value={info.listInfos} key={info.name} placeholder={'Выбрать'} defaultValue={allValues[info.name]} title={info.name} type={info.type} />
            case 'slider':
              return <MyInput onChangeText={(val) => setAllValues(prev => ({...prev, [info.name]: val}))} key={info.name} title={info.name} type={info.type} />
            case 'btnList':
              return <MyInput onChangeText={(val) => setAllValues(prev => ({...prev, [info.name]: val}))} value={info.listInfos} key={info.name} title={info.name} type={info.type} />
            case 'user':
              return <MyInput key={info.name} title={info.name} type={info.type} onChangeText={(val) => setAllValues(prev => ({...prev, [info.name]: val}))} />
            default:
              return <Text key={'asd'}>Такого типа нету: {info.type}, макака</Text>
          }
        })}
      </View>
    </NestableScrollContainer>
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
