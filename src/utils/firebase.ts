import { initializeApp } from 'firebase/app'
import { getDatabase, ref, update } from 'firebase/database'
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA5va5RhN3vvAFunEJu2o2BUbPJ4tspOkY',
  authDomain: 'medicinedictionary-9c7a5.firebaseapp.com',
  databaseURL: 'https://medicinedictionary-9c7a5.firebaseio.com',
  projectId: 'medicinedictionary-9c7a5',
  storageBucket: 'medicinedictionary-9c7a5.appspot.com',
  messagingSenderId: '127270993046',
  appId: '1:127270993046:web:1f28dea674f094860296b7',
}

// Initialize Firebase
const firebase_app = initializeApp(firebaseConfig)
const firebase_db = getDatabase(firebase_app)

const text_to_key = (text: string): string => {
  // remove ".", "#", "$", "[", or "]"
  text = text.replace(/\./g, '_')
  text = text.replace(/\$/g, '_')
  text = text.replace(/\[/g, '_')
  text = text.replace(/\]/g, '_')
  text = text.replace(/\//g, '_')
  return text
}

export const firebase_write = (data: string) => {
  //".", "#", "$", "[", or "]" not allowed
  let path = text_to_key(data)

  // create or update data
  const r = ref(firebase_db, 'jupiter/EN/')

  return update(r, {
    [path]: data,
  })
}
