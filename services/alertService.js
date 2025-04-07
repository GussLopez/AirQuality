import * as Notifications from "expo-notifications"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export const setupNotifications = async () => {
  const { status } = await Notifications.requestPermissionsAsync()
  if (status !== "granted") {
    console.log("Permisos de notificaciones denegados")
    return false
  }
  return true
}

export const sendAlert = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: null,
  })
}

export const checkAirQuality = (aqi, threshold) => {
  if (aqi > threshold) {
    sendAlert("Alerta de Calidad del Aire", `El AQI actual (${aqi}) ha superado el umbral establecido (${threshold}).`)
  }
}

