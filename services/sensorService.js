import { ref, onValue, get } from "firebase/database"
import { database } from "../firebaseConfig"

// Obtener datos en tiempo real
export const subscribeSensorData = (callback) => {
  const sensoresRef = ref(database, "sensores")
  
  // Escuchar cambios en tiempo real
  const unsubscribe = onValue(sensoresRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      callback(data)
    }
  }, (error) => {
    console.error("Error al obtener datos de sensores:", error)
  })
  
  // Retornar función para cancelar la suscripción
  return unsubscribe
}

// Obtener datos una sola vez
export const getSensorData = async () => {
  try {
    const sensoresRef = ref(database, "sensores")
    const snapshot = await get(sensoresRef)
    
    if (snapshot.exists()) {
      return snapshot.val()
    }
    return null
  } catch (error) {
    console.error("Error al obtener datos de sensores:", error)
    throw error
  }
}

// Obtener historial de datos (simulado - deberías implementar tu propia lógica)
export const getSensorHistory = async (period = "week") => {
  // Aquí podrías implementar la lógica para obtener datos históricos
  // Por ahora, retornamos datos simulados
  if (period === "week") {
    return [65, 70, 80, 75, 68, 72, 78]
  } else if (period === "month") {
    return [72, 75, 70, 68]
  }
  return []
}