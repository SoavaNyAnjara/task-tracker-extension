import React, { useEffect, useState } from 'react'
import LoginForm from './components/LoginForm'
import TaskSelector from './components/TaskSelector'
import HistoryView from './components/HistoryView'
import LogoutButton from './components/LogoutButton'
import { getCurrentUser } from './storage'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    getCurrentUser().then(setUser)
  }, [])

  return (
    <div>
      {!user ? (
        <>
          <h2>Connexion</h2>
          <LoginForm onLogin={setUser} />
        </>
      ) : (
        <>
          <h2>Utilisateur : <span className="badge">{user}</span></h2>
          <TaskSelector />
          <HistoryView />
          <LogoutButton onLogout={() => setUser(null)} />
        </>
      )}
    </div>
  )
}
