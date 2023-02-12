import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { ScrollView } from "react-native-gesture-handler";
import { getForms } from "../api/projectAPI";
import ArrowButton from "../compontents/ArrowButton";
import MyButton from "../compontents/MyButton";

const CreateTask = ({ navigation }) => {
    const [loading, setLoading] = useState(true)
    const [forms, setForms] = useState([])
    const [value, setValue] = useState(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setLoading(true)
        navigation.setOptions({
            headerRight: () => (
                <MyButton custom={{text: {color:'#005D99', padding:10, paddingBottom: 5, paddingTop:5, backgroundColor:'white', borderRadius:5}}} enabled={!loading} title={"Сохранить"} onPress={() => console.log('create')} />
            ),
        })
        getForms().then((res) => res.map((form) => setForms(prev =>[...prev, {label: form.name, value: form.id}]))).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
      console.log(value)
    }, [value])
    

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.btnCont}>
            <Text style={{marginBottom:5, fontWeight:'bold'}}>Форма</Text>
            {!loading ? <DropDownPicker renderBadgeItem={() => <Text>sd</Text>} loading={false} placeholder="Выберите форму" open={open} setOpen={setOpen} value={value} setValue={setValue} items={forms} setItems={setForms} /> : (<ActivityIndicator />)}
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateTask;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    height:500,
    // backgroundColor:'green'
  },
  btnCont: {
    width: "95%",
    backgroundColor: "white",
    borderRadius: 5,
    marginTop: 10,
    padding:10
  },
  info: {
    padding: 15,
    paddingRight: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
