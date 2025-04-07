import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TextInput, TouchableOpacity } from 'react-native';
import { getTranslation } from '../utils/languages';
import tw from 'tailwind-react-native-classnames';

export default function SettingsScreen({ language, changeLanguage }) {
  const [isCloudSyncEnabled, setIsCloudSyncEnabled] = useState(true);
  const [sensorInterval, setSensorInterval] = useState('5');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toggleCloudSync = () => setIsCloudSyncEnabled(previousState => !previousState);

  const handleSave = () => {
    // Save settings logic here
    console.log('Settings saved');
  };

  return (
    <ScrollView style={tw`bg-gray-900 flex-1 p-4`}>
      <View style={tw`bg-gray-800 rounded-xl p-4 mb-4`}>
        <Text style={tw`text-white text-lg font-bold mb-4`}>
          {getTranslation(language, 'generalSettings')}
        </Text>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-white`}>
            {getTranslation(language, 'enableCloudSync')}
          </Text>
          <Switch
            trackColor={{ false: '#4B5563', true: '#22C55E' }}
            thumbColor={isCloudSyncEnabled ? '#10B981' : '#D1D5DB'}
            onValueChange={toggleCloudSync}
            value={isCloudSyncEnabled}
          />
        </View>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-white`}>
            {getTranslation(language, 'sensorInterval')}
          </Text>
          <TextInput
            style={tw`bg-gray-700 text-white px-3 py-2 rounded-lg w-20`}
            value={sensorInterval}
            onChangeText={setSensorInterval}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={tw`bg-gray-800 rounded-xl p-4 mb-4`}>
        <Text style={tw`text-white text-lg font-bold mb-4`}>
          {getTranslation(language, 'accountSettings')}
        </Text>
        <View style={tw`mb-4`}>
          <Text style={tw`text-white mb-2`}>
            {getTranslation(language, 'username')}
          </Text>
          <TextInput
            style={tw`bg-gray-700 text-white px-3 py-2 rounded-lg`}
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View>
          <Text style={tw`text-white mb-2`}>
            {getTranslation(language, 'password')}
          </Text>
          <TextInput
            style={tw`bg-gray-700 text-white px-3 py-2 rounded-lg`}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
      </View>

      <View style={tw`bg-gray-800 rounded-xl p-4 mb-4`}>
        <Text style={tw`text-white text-lg font-bold mb-4`}>
          {getTranslation(language, 'language')}
        </Text>
        <TouchableOpacity
          style={tw`bg-blue-500 p-3 rounded-lg mb-3 ${language === 'es' ? 'opacity-100' : 'opacity-50'}`}
          onPress={() => changeLanguage('es')}
        >
          <Text style={tw`text-white text-center`}>
            {getTranslation(language, 'spanish')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`bg-blue-500 p-3 rounded-lg ${language === 'en' ? 'opacity-100' : 'opacity-50'}`}
          onPress={() => changeLanguage('en')}
        >
          <Text style={tw`text-white text-center`}>
            {getTranslation(language, 'english')}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={tw`bg-green-500 p-4 rounded-lg`}
        onPress={handleSave}
      >
        <Text style={tw`text-white text-center font-bold`}>
          {getTranslation(language, 'saveSettings')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}