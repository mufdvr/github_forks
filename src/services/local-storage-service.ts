const { REACT_APP_VERSION } = process.env
const STORAGE_KEY = `__SERIALIZED_STATE_TREE_v${REACT_APP_VERSION}__`

export function saveState<T = object>(storeState: T): boolean {
  if (!localStorage) {
    return false
  }

  try {
    const serializedState = JSON.stringify(storeState)
    localStorage.setItem(STORAGE_KEY, serializedState)
    return true
  } catch (error) {
    throw new Error('store serialization failed')
  }
}

export function loadState<T = object>(): T | undefined {
  if (!localStorage) {
    return
  }

  try {
    const serializedState = localStorage.getItem(STORAGE_KEY)
    if (serializedState == null) {
      return
    }
    return JSON.parse(serializedState)
  } catch (error) {
    throw new Error('store deserialization failed')
  }
}
