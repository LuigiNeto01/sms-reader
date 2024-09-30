import { StatusBar } from 'expo-status-bar';
import { FlatList, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import SmsAndroid from 'react-native-get-sms-android';

const SMSReader = () => {
  const [smsList, setSmsList] = useState([]);

  async function requestSmsPermissions() {
    console.log('Solicitando permissão de SMS...'); // Adicionado log para depuração
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS, {
          title: "Permissão de SMS",
          message: "Esse app quer ler os seus SMS",
          buttonNeutral: "Pergunte-me depois",
          buttonNegative: "Cancelar",
          buttonPositive: "Permitir"
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Permissão de SMS concedida');
        return true;
      } else {
        console.log('Permissão de SMS negada');
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão de SMS: ', error);
      return false; // Adicionei um retorno para garantir que a função sempre retorna um booleano
    }
  }

  useEffect(() => {
    async function fetchSms() {
      const hasPermission = await requestSmsPermissions();
      if (hasPermission) {
        SmsAndroid.list(
          JSON.stringify({
            box: 'inbox',
            maxCount: 10,
          }),
          (fail) => {
            console.error('Erro ao listar SMS: ', fail);
          },
          (count, smsList) => {
            const messages = JSON.parse(smsList);
            setSmsList(messages);
            console.log(`SMS list fetched successfully: ${count} messages found`);
          }
        );
      }
    }
    fetchSms();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={{ margin: 10, padding: 10, backgroundColor: '#f9f9f9', borderRadius: 5 }}>
        <Text style={{ fontWeight: "bold" }}>{item.address}</Text>
        <Text>{item.body}</Text>
        <Text style={{ color: 'gray', fontSize: 10 }}>{new Date(item.date).toLocaleString()}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={smsList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text>Sem SMS encontrado</Text>} />
      <StatusBar style="auto" />
    </View>
  );
};

export default SMSReader;
