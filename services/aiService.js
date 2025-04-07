import { COHERE_API_KEY } from "@env"

export const getAIAdvice = async (aqi) => {
  try {
    console.log("Iniciando solicitud a Cohere con AQI:", aqi)

    const response = await fetch("https://api.cohere.ai/v1/generate", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "command",
        prompt: `Dado un Índice de Calidad del Aire (AQI) de ${aqi}, proporciona un consejo breve y específico sobre cómo proteger la salud. El consejo debe ser conciso y directo, en español.`,
        max_tokens: 100,
        temperature: 0.7,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Error al conectar con Cohere")
    }

    const advice = data.generations[0].text.trim()
    console.log("Respuesta recibida de Cohere:", advice)

    return advice
  } catch (error) {
    console.error("Error al obtener consejo de IA:", error)

    // Sistema de respaldo con consejos predefinidos
    if (aqi <= 50) {
      return "La calidad del aire es buena. Puedes realizar actividades al aire libre."
    } else if (aqi <= 100) {
      return "La calidad del aire es moderada. Considere reducir actividades prolongadas al aire libre."
    } else if (aqi <= 150) {
      return "La calidad del aire puede afectar a grupos sensibles. Use protección si es necesario."
    } else if (aqi <= 200) {
      return "La calidad del aire es dañina. Reduzca la exposición al aire libre."
    } else if (aqi <= 300) {
      return "La calidad del aire es muy dañina. Evite actividades al aire libre."
    } else {
      return "¡Calidad del aire peligrosa! Permanezca en interiores."
    }
  }
}

