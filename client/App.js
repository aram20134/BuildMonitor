import { createContext, useContext, useState, useEffect } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Navigate from './compontents/Navigate';
import { AsyncStorage } from '@react-native-async-storage/async-storage';


export const BuildMonitor = createContext(null)

export default function App() {
  const [isAuth, setIsAuth] = useState(null)
  const [user, setUser] = useState({})
  const [projects, setProjects] = useState([{}])
  const [chosedProject, setChosedProject] = useState()
  const [chosedLayer, setChosedLayer] = useState()

  // const insets = useSafeAreaInsets()
  

  return (
    <SafeAreaProvider>
      <BuildMonitor.Provider value={{
        isAuth, setIsAuth,
        user, setUser,
        projects, setProjects,
        chosedProject, setChosedProject,
        chosedLayer, setChosedLayer
      }}>
        <Navigate />
      </BuildMonitor.Provider>
    </SafeAreaProvider>
  );
}