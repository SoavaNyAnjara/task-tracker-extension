// ---- Helpers Storage (promisifiés)
const get = (keys) =>
  new Promise((resolve) => chrome.storage.local.get(keys, resolve));

const set = (obj) =>
  new Promise((resolve) => chrome.storage.local.set(obj, resolve));

/**
 * Structure dans storage.local :
 * {
 *   currentUser: "M12345" | undefined,
 *   currentTask: { taskName: string, startTime: string } | undefined,
 *   history: [{ taskName, startTime, endTime }]  // par jour cumulatif simple
 * }
 */

// Termine la tâche en cours si existante (en ajoutant endTime) et la pousse dans history
async function closeCurrentTaskIfAny(endTimeISO = new Date().toISOString()) {
  const { currentTask, history = [] } = await get(['currentTask', 'history']);

  if (currentTask && currentTask.taskName) {
    const finished = {
      taskName: currentTask.taskName,
      startTime: currentTask.startTime,
      endTime: endTimeISO
    };
    const updatedHistory = [...history, finished];
    await set({ history: updatedHistory, currentTask: undefined });
    return finished;
  }
  return null;
}

// Démarre une nouvelle tâche (après avoir fermé la précédente si besoin)
async function startTask(taskName) {
  await closeCurrentTaskIfAny();
  const start = {
    taskName,
    startTime: new Date().toISOString()
  };
  await set({ currentTask: start });
  return start;
}

// Déconnexion = terminer la tâche en cours et effacer currentUser
async function logout() {
  await closeCurrentTaskIfAny();
  await set({ currentUser: undefined });
}

// Messages reçus de la popup (React)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    try {
      switch (message.action) {
        case 'startTask': {
          const started = await startTask(message.taskName);
          sendResponse({ ok: true, started });
          break;
        }
        case 'logout': {
          await logout();
          sendResponse({ ok: true });
          break;
        }
        case 'getState': {
          const state = await get(['currentUser', 'currentTask', 'history']);
          sendResponse({ ok: true, state });
          break;
        }
        case 'setUser': {
          await set({ currentUser: message.user });
          sendResponse({ ok: true });
          break;
        }
        case 'clearHistory': {
          await set({ history: [] });
          sendResponse({ ok: true });
          break;
        }
        default:
          sendResponse({ ok: false, error: 'Unknown action' });
      }
    } catch (e) {
      sendResponse({ ok: false, error: String(e) });
    }
  })();

  // Indique que la réponse sera envoyée de manière asynchrone
  return true;
});

// Optionnel : si le SW est suspendu, rien de spécial ici (on ne force pas la fermeture).
// Si tu veux marquer une fin à la fermeture de Chrome, il faut une stratégie côté UI
// (ex: bouton "Déconnexion") ou timers récurrents (non garantis en MV3).
