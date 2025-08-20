import React, { useEffect, useState } from 'react'
import { getCurrentTask } from '../storage'

const TASKS = ['Production', 'Pause', 'Formation', 'Ostie']

export default function TaskSelector() {
  const [currentTask, setCurrentTask] = useState(null)
  const [selectValue, setSelectValue] = useState('')

  // Charger la tâche en cours au montage
  useEffect(() => {
    getCurrentTask().then((t) => {
      setCurrentTask(t)
      setSelectValue(t?.taskName || '')
    })

    // Écouter les changements storage pour maj en temps réel
    const onChanged = (changes, area) => {
      if (area === 'local' && changes.currentTask) {
        setCurrentTask(changes.currentTask.newValue)
        setSelectValue(changes.currentTask.newValue?.taskName || '')
      }
    }
    chrome.storage.onChanged.addListener(onChanged)
    return () => chrome.storage.onChanged.removeListener(onChanged)
  }, [])

  const onSelect = async (taskName) => {
    setSelectValue(taskName)
    chrome.runtime.sendMessage({ action: 'startTask', taskName }, (res) => {
      // Optionnel: handle res / erreurs
    })
  }

  return (
    <div>
      <h3>Tâche actuelle</h3>
      <div className="small" style={{ marginBottom: 6 }}>
        {currentTask?.taskName
          ? `En cours : ${currentTask.taskName} (depuis ${formatTime(currentTask.startTime)})`
          : 'Aucune tâche en cours'}
      </div>

      <select value={selectValue} onChange={(e) => onSelect(e.target.value)}>
        <option value="">-- Choisir une tâche --</option>
        {TASKS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </div>
  )
}

function formatTime(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString()
  } catch {
    return iso
  }
}
