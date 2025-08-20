import React, { useState } from 'react'

export default function LoginForm({ onLogin }) {
  const [matricule, setMatricule] = useState('')

  const handleLogin = () => {
    const user = (matricule || '').trim()
    if (!user) return
    chrome.runtime.sendMessage({ action: 'setUser', user }, (res) => {
      if (res && res.ok) onLogin(user)
    })
  }

  return (
    <div>
      <input
        className="input"
        type="text"
        placeholder="Matricule"
        value={matricule}
        onChange={(e) => setMatricule(e.target.value)}
      />
      <button onClick={handleLogin}>Connexion</button>
    </div>
  )
}
