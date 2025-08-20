import React, { useEffect, useState } from 'react'
import { getHistory } from '../storage'

export default function HistoryView() {
  const [history, setHistory] = useState([])

  // Chargement initial + écoute des changements
  useEffect(() => {
    const load = async () => {
      const h = await getHistory()
      setHistory(h)
    }
    load()

    const onChanged = (changes, area) => {
      if (area === 'local' && changes.history) {
        setHistory(changes.history.newValue || [])
      }
    }
    chrome.storage.onChanged.addListener(onChanged)
    return () => chrome.storage.onChanged.removeListener(onChanged)
  }, [])

  return (
    <div>
      <h3>Historique</h3>
      {history.length === 0 ? (
        <div className="small">Aucun enregistrement.</div>
      ) : (
        <ul className="list">
          {history.map((h, idx) => (
            <li key={idx}>
              <strong>{h.taskName}</strong>
              <div className="small">
                {formatDateTime(h.startTime)} → {h.endTime ? formatDateTime(h.endTime) : 'en cours'}
              </div>
            </li>
          ))}
        </ul>
      )}

      <button onClick={clearHistory}>Vider l’historique</button>
    </div>
  )
}

function clearHistory() {
  chrome.runtime.sendMessage({ action: 'clearHistory' }, () => {})
}

function formatDateTime(iso) {
  try {
    const d = new Date(iso)
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
  } catch {
    return iso
  }
}
