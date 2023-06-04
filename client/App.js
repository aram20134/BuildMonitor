import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Navigate from './compontents/Navigate';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import MyError from './compontents/MyError';
import { Text, View, Button, Platform, Alert } from 'react-native';
// import * as Notifications from 'expo-notifications';

// import app from '@react-native-firebase/app';
// import messaging from '@react-native-firebase/messaging';

// import {PermissionsAndroid} from 'react-native';
// PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);  

export const BuildMonitor = createContext(null)

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });


export default function App() {
  const [isAuth, setIsAuth] = useState(null)
  const [user, setUser] = useState({})
  const [projects, setProjects] = useState([{}])
  const [chosedProject, setChosedProject] = useState()
  const [chosedLayer, setChosedLayer] = useState()
  const [trigger, setTrigger] = useState(false)
  const [error, setError] = useState('')

  // useEffect(() => {


  //   const asd = async () => {
  //     const token = await messaging().getToken();
  //     return token
  //   }

  //   asd().then((tk) => console.log(tk))
  //   messaging().subscribeToTopic('project')
  //   const unsubscribe2 = messaging().onMessage(async (remoteMessage) => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //   });
  //   return unsubscribe2
  //   //   unsubscribe2
  //   // )
  // }, []);

  // const [expoPushToken, setExpoPushToken] = useState('');
  // const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  // const responseListener = useRef();

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
  
  //   notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
  //     setNotification(notification);
  //   });
  
  //   responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
  //     console.log(response);
  //   });
  
  //   return () => {
  //     Notifications.removeNotificationSubscription(notificationListener.current);
  //     Notifications.removeNotificationSubscription(responseListener.current);
  //   };
  // }, []);
  

  return (
    <SafeAreaProvider>
      <BuildMonitor.Provider value={{
        isAuth, setIsAuth,
        user, setUser,
        projects, setProjects,
        chosedProject, setChosedProject,
        chosedLayer, setChosedLayer,
        trigger, setTrigger,
        error, setError
      }}>
        <Navigate />
        {/* <Button title='send' /> */}
      </BuildMonitor.Provider>
      <MyError errorMsg={error} trigger={trigger} />
    </SafeAreaProvider>
  );
}

// async function schedulePushNotification() {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "You've got mail! 📬",
//       body: 'Here is the notification body',
//       data: { data: 'goes here' },
//     },
//     trigger: { seconds: 2 },
//   });
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: '#FF231F7C',
//     });
//   }

//   if (true) {
//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;
//     if (existingStatus !== 'granted') {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }
//     if (finalStatus !== 'granted') {
//       alert('Failed to get push token for push notification!');
//       return;
//     }
//     token = (await Notifications.getDevicePushTokenAsync()).data;
//     console.log(token);
//   } else {
//     alert('Must use physical device for Push Notifications');
//   }

//   return token;
// }