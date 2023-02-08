import { createContext, useContext, useState } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import Navigate from './compontents/Navigate';


export const BuildMonitor = createContext(null)

export default function App() {
  const [isAuth, setIsAuth] = useState(null)
  const [user, setUser] = useState({})

  // const insets = useSafeAreaInsets()

  return (
    <SafeAreaProvider>
      <BuildMonitor.Provider value={{
        isAuth, setIsAuth,
        user, setUser
      }}>
        <Navigate />
      </BuildMonitor.Provider>
    </SafeAreaProvider>
  );
}