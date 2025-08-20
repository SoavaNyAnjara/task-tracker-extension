import React from 'react'

export default function LogoutButton({ onLogout }) {
  const handleLogout = () => {
    chrome.runtime.sendMessage({ action: 'logout' }, (res) => {
      onLogout?.()
    })
  }

  return <button onClick={handleLogout}>Déconnexion</button>
}
