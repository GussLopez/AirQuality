// AlertsScreen.js - Solo actualizamos los estilos
import { useState } from "react";
import { View, Text, ScrollView, Switch, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getTranslation } from "../utils/languages";
import tw from "tailwind-react-native-classnames";

export default function AlertsScreen({ language }) {
  // Mantenemos todo el estado y lógica existente
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [threshold, setThreshold] = useState("100");

  const alerts = [
    { id: 1, message: "High AQI levels detected", date: "2023-05-10 14:30" },
    { id: 2, message: "CO2 levels above normal", date: "2023-05-09 10:15" },
    { id: 3, message: "NH3 concentration increased", date: "2023-05-08 18:45" },
  ];

  return (
    <ScrollView style={tw`flex-1 bg-gray-900`}>
      

      <View style={tw`bg-gray-800 m-4 p-5 rounded-xl`}>
        <Text style={tw`text-xl font-bold text-white mb-4`}>
          {getTranslation(language, "alertSettings")}
        </Text>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-white text-base`}>
            {getTranslation(language, "enableAlerts")}
          </Text>
          <Switch
            trackColor={{ false: "#374151", true: "#3b82f6" }}
            thumbColor={isEnabled ? "#60a5fa" : "#9ca3af"}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-white text-base`}>
            {getTranslation(language, "aqiThreshold")}
          </Text>
          <TextInput
            style={tw`bg-gray-700 text-white px-3 py-2 rounded-lg w-20 text-center`}
            onChangeText={setThreshold}
            value={threshold}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={tw`bg-gray-800 m-4 p-5 rounded-xl`}>
        <Text style={tw`text-xl font-bold text-white mb-4`}>
          {getTranslation(language, "recentAlerts")}
        </Text>
        {alerts.map((alert) => (
          <View key={alert.id} style={tw`flex-row items-center mb-4 border-b border-gray-700 pb-4`}>
            <Ionicons name="warning-outline" size={24} color="#f59e0b" style={tw`mr-3`} />
            <View>
              <Text style={tw`text-white mb-1`}>{alert.message}</Text>
              <Text style={tw`text-gray-400 text-sm`}>{alert.date}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}