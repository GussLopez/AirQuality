"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, Dimensions, ActivityIndicator } from "react-native"
import { LineChart } from "react-native-chart-kit"
import { Ionicons } from "@expo/vector-icons"
import { getTranslation } from "../utils/languages"
import AirQualityGauge from "../components/AirQualityGauge"
import { getAIAdvice } from "../services/aiService"
import { subscribeSensorData } from "../services/sensorService"
import tw from "tailwind-react-native-classnames"

const { width } = Dimensions.get("window")

const AQI_UPDATE_INTERVAL = 600000 
const DEBOUNCE_DELAY = 1000
const MAX_DATA_POINTS = 6

export default function HomeScreen({ language }) {
  const [airQuality, setAirQuality] = useState({
    aqi: 75,
    pollutants: {
      pm25: 15.2,
      co2: 450,
      nh3: 0.8,
    },
  })
  const [sensorData, setSensorData] = useState({
    humedad: 0,
    mq135_ppm: 0,
    temperatura: 0
  })
  const [aiAdvice, setAiAdvice] = useState("")
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date())
  const [isLoadingSensors, setIsLoadingSensors] = useState(true)
  
  const [aqiHistory, setAqiHistory] = useState([])
  const [chartLabels, setChartLabels] = useState([])

  // Función para actualizar el historial de AQI
  const updateAqiHistory = (newAqi) => {
    const now = new Date()
    const timeLabel = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0')
    
    setAqiHistory(prevHistory => {
      const newHistory = [...prevHistory, newAqi]
      return newHistory.slice(-MAX_DATA_POINTS)
    })
    
    setChartLabels(prevLabels => {
      // Añadir nueva etiqueta de tiempo
      const newLabels = [...prevLabels, timeLabel]
      return newLabels.slice(-MAX_DATA_POINTS)
    })
  }

  useEffect(() => {
    const unsubscribe = subscribeSensorData((data) => {
      setSensorData(data)
      setIsLoadingSensors(false)
      setLastUpdateTime(new Date())
      
      if (data.mq135_ppm) {
        const calculatedAqi = Math.min(500, Math.floor(data.mq135_ppm * 1.5))
        setAirQuality(prev => ({ 
          ...prev, 
          aqi: calculatedAqi,
          pollutants: {
            ...prev.pollutants,
            pm25: Math.round(data.mq135_ppm / 20 * 10) / 10,
            co2: Math.round(data.mq135_ppm * 1.5),
            nh3: Math.round(data.mq135_ppm / 300 * 10) / 10
          }
        }))
        
        updateAqiHistory(calculatedAqi)
      }
    })

    if (aqiHistory.length === 0) {
      const now = new Date()
      const initialLabels = []
      const initialData = []
      
      for (let i = 0; i < MAX_DATA_POINTS; i++) {
        const time = new Date(now)
        time.setHours(now.getHours() - (MAX_DATA_POINTS - 1 - i))
        const timeLabel = time.getHours() + ":" + time.getMinutes().toString().padStart(2, '0')
        initialLabels.push(timeLabel)
        
        const baseValue = 75 // Valor base
        const randomOffset = Math.floor(Math.random() * 20) - 10
        initialData.push(baseValue + randomOffset)
      }
      
      setChartLabels(initialLabels)
      setAqiHistory(initialData)
    }

    // Limpiar suscripción al desmontar
    return () => unsubscribe()
  }, [])

  // Obtener consejo de IA con debounce
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      setIsLoadingAdvice(true)
      try {
        const advice = await getAIAdvice(sensorData.mq135_ppm)
        setAiAdvice(advice)
      } catch (error) {
        console.error("Error en HomeScreen al obtener consejo:", error)
        setAiAdvice("Error al obtener consejo. Por favor, intenta más tarde.")
      } finally {
        setIsLoadingAdvice(false)
      }
    }, DEBOUNCE_DELAY)

    return () => clearTimeout(debounceTimer)
  }, [sensorData.mq135_ppm])

  const getTimeUntilNextUpdate = () => {
    const now = new Date()
    const timeSinceLastUpdate = now - lastUpdateTime
    const timeRemaining = AQI_UPDATE_INTERVAL - timeSinceLastUpdate
    const minutesRemaining = Math.floor(timeRemaining / 60000)
    const secondsRemaining = Math.floor((timeRemaining % 60000) / 1000)
    return `${minutesRemaining}:${secondsRemaining.toString().padStart(2, "0")}`
  }

  const [timeRemaining, setTimeRemaining] = useState(getTimeUntilNextUpdate())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeUntilNextUpdate())
    }, 1000)

    return () => clearInterval(timer)
  }, [lastUpdateTime])

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: aqiHistory.length > 0 ? aqiHistory : [0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  }

  return (
    <ScrollView style={tw`flex-1 bg-gray-900 p-4`}>
      <View style={tw`p-5 rounded-lg mb-4`}>
        <Text style={tw`text-white text-2xl font-bold text-center`}>
          {getTranslation(language, "airQualityMonitor")}
        </Text>
        <Text style={tw`text-gray-400 text-center mt-2`}>Última actualización: {lastUpdateTime.toLocaleTimeString()}</Text>
      </View>

      <View style={tw`items-center p-6 rounded-2xl mb-4`}>
        <AirQualityGauge value={airQuality.aqi} />
      </View>

      <View style={tw`bg-gray-800 p-6 rounded-2xl shadow-lg mb-4`}>
        <Text style={tw`text-lg font-bold text-white mb-3`}>{getTranslation(language, "Sensores") || "Datos de Sensores"}</Text>
        {isLoadingSensors ? (
          <ActivityIndicator color="#4F46E5" size="large" />
        ) : (
          <View style={tw`flex-row justify-between`}>
            <View style={tw`items-center`}>
              <Ionicons name="thermometer-outline" size={24} style={tw`text-red-500`} />
              <Text style={tw`text-gray-400 mt-2`}>Temp.</Text>
              <Text style={tw`text-lg font-bold text-white mt-1`}>{sensorData.temperatura}°C</Text>
            </View>
            <View style={tw`items-center`}>
              <Ionicons name="water-outline" size={24} style={tw`text-blue-500`} />
              <Text style={tw`text-gray-400 mt-2`}>Humedad</Text>
              <Text style={tw`text-lg font-bold text-white mt-1`}>{sensorData.humedad}%</Text>
            </View>
            <View style={tw`items-center`}>
              <Ionicons name="flask-outline" size={24} style={tw`text-green-500`} />
              <Text style={tw`text-gray-400 mt-2`}>MQ135</Text>
              <Text style={tw`text-lg font-bold text-white mt-1`}>{sensorData.mq135_ppm} ppm</Text>
            </View>
          </View>
        )}
      </View>

      <View style={tw`border-2 border-gray-800 p-6 rounded-2xl shadow-lg mb-4`}>
        <Text style={tw`text-lg font-bold text-white mb-3`}>{getTranslation(language, "pollutants")}</Text>
        <View style={tw`flex-row justify-between`}>
          {["water-outline", "cloud-outline", "flask-outline"].map((icon, index) => {
            const labels = ["PM2.5", "CO2", "NH3"]
            const values = [airQuality.pollutants.pm25, airQuality.pollutants.co2, airQuality.pollutants.nh3]
            const colors = ["text-blue-500", "text-yellow-500", "text-green-500"]
            return (
              <View key={index} style={tw`items-center`}>
                <Ionicons name={icon} size={24} style={tw`${colors[index]}`} />
                <Text style={tw`text-gray-400 mt-2`}>{labels[index]}</Text>
                <Text style={tw`text-lg font-bold text-white mt-1`}>{values[index]} ppm</Text>
              </View>
            )
          })}
        </View>
      </View>

      <View style={tw`bg-gray-800 p-6 rounded-2xl shadow-lg mb-4`}>
        <Text style={tw`text-lg font-bold text-white mb-3`}>{getTranslation(language, "aiAdvice")}</Text>
        {isLoadingAdvice ? (
          <ActivityIndicator color="#4F46E5" size="large" />
        ) : (
          <Text style={tw`text-white`}>{aiAdvice}</Text>
        )}
      </View>

      <View style={tw`bg-gray-800 p-6 rounded-2xl shadow-lg items-center mb-5`}>
        <Text style={tw`text-lg font-bold text-white mb-3`}>{getTranslation(language, "todayAQITrend")}</Text>
        <LineChart
          data={chartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#1f2937",
            backgroundGradientFrom: "#1f2937",
            backgroundGradientTo: "#1f2937",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: { r: "6", strokeWidth: "2", stroke: "#2563eb" },
          }}
          bezier
          style={tw`mt-2 rounded-lg`}
        />
      </View>
    </ScrollView>
  )
}