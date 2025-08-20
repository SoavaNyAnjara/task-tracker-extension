// Wrappers lisibles pour chrome.storage.local
export const storageGet = (keys) =>
  new Promise((resolve) => chrome.storage.local.get(keys, resolve));

export const storageSet = (obj) =>
  new Promise((resolve) => chrome.storage.local.set(obj, resolve));

// APIs dédiées
export async function getCurrentUser() {
  const { currentUser } = await storageGet(['currentUser']);
  return currentUser;
}

export async function setCurrentUser(user) {
  await storageSet({ currentUser: user });
}

export async function getCurrentTask() {
  const { currentTask } = await storageGet(['currentTask']);
  return currentTask;
}

export async function getHistory() {
  const { history } = await storageGet(['history']);
  return history || [];
}
