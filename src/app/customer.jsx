import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useLanguage } from '../LanguageContext'; 

const PRIMARY_COLOR = "#A98467";
const TEXT_DARK = "#2C2C2C";
const TEXT_MUTED = "#777777";
const BG_COLOR = "#FDFBF7";

export default function CustomerScreen() {
  const params = useLocalSearchParams();
  const { lang, setLang, t } = useLanguage();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleNext = () => {
    router.push({
      pathname: '/otp',
      params: { ...params, customerName: name, customerPhone: phone }
    });
  };

  const isFormValid = name.trim().length > 0 && phone.trim().length >= 9;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('customerTitle')}</Text>
        
        <View style={styles.langToggle}>
          <TouchableOpacity style={lang === 'th' ? styles.langActive : styles.langInactive} onPress={() => setLang('th')}>
            <Text style={lang === 'th' ? styles.langTextActive : styles.langTextInactive}>TH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={lang === 'en' ? styles.langActive : styles.langInactive} onPress={() => setLang('en')}>
            <Text style={lang === 'en' ? styles.langTextActive : styles.langTextInactive}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.formContainer}>
          <Animatable.View animation="fadeInUp" duration={600} delay={100}>
            <Text style={styles.label}>{t('fullName')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('enterName')}
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </Animatable.View>

          <Animatable.View animation="fadeInUp" duration={600} delay={200}>
            <Text style={styles.label}>{t('phoneNumber')}</Text>
            <TextInput
              style={styles.input}
              placeholder="08XXXXXXXX"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </Animatable.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={[styles.nextButton, !isFormValid && { backgroundColor: '#D1D5DB' }]}
          onPress={handleNext}
          disabled={!isFormValid}
        >
          <Text style={[styles.nextText, !isFormValid && { color: "#9CA3AF" }]}>{t('continueBtn')}</Text>
          <Ionicons name="chevron-forward" size={20} color={!isFormValid ? "#9CA3AF" : "white"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  backButton: { width: 40, height: 40, backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', flex: 1, marginLeft: 15, color: TEXT_DARK },
  langToggle: { flexDirection: "row", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 20, padding: 4 },
  langActive: { backgroundColor: "white", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, elevation: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 2 },
  langInactive: { paddingHorizontal: 12, paddingVertical: 6 },
  langTextActive: { color: TEXT_DARK, fontWeight: "bold", fontSize: 12 },
  langTextInactive: { color: TEXT_MUTED, fontWeight: "bold", fontSize: 12 },
  formContainer: { padding: 20, paddingTop: 30 },
  label: { fontSize: 16, fontWeight: 'bold', color: TEXT_DARK, marginBottom: 10, marginTop: 15 },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)", fontSize: 16, color: TEXT_DARK },
  bottomBar: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 15, borderTopWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  nextButton: { backgroundColor: PRIMARY_COLOR, flexDirection: 'row', justifyContent: 'center', paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  nextText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 5 }
});