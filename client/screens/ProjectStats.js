import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text as Txt, Dimensions, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler"
import { BuildMonitor } from './../App';
import { PieChart } from 'react-native-svg-charts'
import Text from 'react-native-svg/src/elements/Text'
import Svg from "react-native-svg/src/elements/Svg";
import Circle from "react-native-svg/src/elements/Circle";
import { getProjectUsers } from "../api/projectAPI";
// import 'react-native-svg'

const ProjectStats = () => {
  const { chosedProject } = useContext(BuildMonitor)
  const [tasks, setTasks] = useState([])
  const [labelWidth, setLabelWidth] = useState(0)
  const [users, setUsers] = useState([])
  
  const pickColor = (name) => {
    switch (name) {
      case 'Открыто':
        return '#de4317'
      case 'В работе':
        return '#2f53c0'
      case 'Решено':
        return '#63ad01'
      case 'Ожидание обратной связи':
        return '#f0a801'
      case 'Отклонено':
        return '#474747'
      case 'Закрыто':
        return '#b2b2b2'
      default:
        return '#dddd'
    }
  }
  
  useEffect(() => {
    var allTasks = chosedProject.layers.reduce((acc, cur) => {
      if (cur.tasks.length) {
        acc.push(...cur.tasks.map((task) => task.taskInfos.filter((taskInfo) => taskInfo.name === 'Статус')).flat(1))
      }
      return acc
    }, [])
    allTasks = allTasks.reduce((acc, cur, i) => {
      const check = acc.filter((val) => val?.name === cur.value)[0]
      if (check) {
        acc.map((val) => val.name === check.name ? val.amount += 1 : val)
      } else {
        acc.push({key: i, name: cur.value, amount: 1, svg: {fill: pickColor(cur.value)}})
      }
      return acc
    }, [])
    setTasks(allTasks)
    console.log(allTasks)
    getProjectUsers(chosedProject.id).then((res) => setUsers(res))
  }, [])

  const deviceWidth = Dimensions.get('window').width

  return (
    <ScrollView style={{flex:1}}>
      <View style={styles.container}>
        <PieChart valueAccessor={({ item }) => item.amount} style={{height:200}} data={tasks} innerRadius={'62%'} outerRadius={'70%'} />
          <View onLayout={({ nativeEvent: { layout: { width } } }) => setLabelWidth(width)} style={{position: 'absolute', left: deviceWidth / 2 - labelWidth / 2}}>
            <Txt style={{textAlign: 'center', fontWeight:'600', fontSize:24}}>{tasks.reduce((acc, cur) => acc += cur.amount, 0)}</Txt>
            <Txt style={{textAlign: 'center', fontSize:18}}>Задачи</Txt>
          </View>
      </View>
      <View>
        {tasks.map((t) => 
          <View key={t.id} style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
              <Svg style={{display:'flex', flexDirection:'row'}} key={t.name} height="40" width="40">
                <Circle cx="20" cy="20" r="10" fill={t.svg.fill} />
              </Svg>
              <Txt>{t.name}</Txt>
            </View>
            <Txt style={{paddingRight:15}}>{t.amount}</Txt>
          </View>
        )}
      </View>
      <View style={{display:'flex', padding:15}}>
        <Txt style={{color:'green'}}>Дополнительная информация</Txt>
        <View style={{marginTop:20, display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
          <View style={{display:'flex', flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
            <Image source={require('../assets/user.png')} style={{width:15, height:15, marginRight:10}} />
            <Txt style={{fontSize:16}}>Пользователей</Txt>
          </View>
          <Txt>{users.length}</Txt>
        </View>
      </View>
    </ScrollView>
  )
}

export default ProjectStats

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'center',
    // backgroundColor:'black'
    // alignItems: "center",
    // height:'100%'
  }
});