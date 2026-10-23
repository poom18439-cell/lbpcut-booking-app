import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useLanguage } from '../LanguageContext'; 

const PRIMARY_COLOR = "#A98467";
const TEXT_DARK = "#2C2C2C";
const TEXT_MUTED = "#777777";
const BG_COLOR = "#FDFBF7";

export default function OtpScreen() {
  const params = useLocalSearchParams();
  const { lang, setLang, t } = useLanguage();
  const [otp, setOtp] = useState('');

  const handleVerify = () => {
    router.push({ pathname: '/confirm', params });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        
        <View style={styles.langToggle}>
          <TouchableOpacity style={lang === 'th' ? styles.langActive : styles.langInactive} onPress={() => setLang('th')}>
            <Text style={lang === 'th' ? styles.langTextActive : styles.langTextInactive}>TH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={lang === 'en' ? styles.langActive : styles.langInactive} onPress={() => setLang('en')}>
            <Text style={lang === 'en' ? styles.langTextActive : styles.langTextInactive}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Animatable.View animation="fadeInDown" duration={800} style={{ alignItems: 'center' }}>
          <Text style={styles.title}>{t('otpTitle')}</Text>
          <Text style={styles.subtitle}>{t('otpSubtitle')}</Text>
        </Animatable.View>

        <Animatable.View animation="zoomIn" duration={800} delay={200}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            placeholder={t('otpPlaceholder')}
            placeholderTextColor="#D1D5DB"
            autoFocus
          />
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={400} style={{ width: '100%' }}>
          <TouchableOpacity 
            style={[styles.button, otp.length !== 6 && { backgroundColor: '#D1D5DB' }]}
            onPress={handleVerify}
            disabled={otp.length !== 6}
          >
            <Text style={[styles.buttonText, otp.length !== 6 && { color: "#9CA3AF" }]}>{t('confirmBookingBtn')}</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <TouchableOpacity style={{marginTop: 20}}>
            <Text style={{color: PRIMARY_COLOR, fontWeight: 'bold'}}>{t('resendOtp')}</Text>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 40 },
  backButton: { width: 40, height: 40, backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  langToggle: { flexDirection: "row", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 20, padding: 4, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  langActive: { backgroundColor: "white", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, elevation: 1 },
  langInactive: { paddingHorizontal: 12, paddingVertical: 6 },
  langTextActive: { color: TEXT_DARK, fontWeight: "bold", fontSize: 12 },
  langTextInactive: { color: TEXT_MUTED, fontWeight: "bold", fontSize: 12 },
  content: { padding: 30, alignItems: 'center', marginTop: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: TEXT_DARK },
  subtitle: { color: TEXT_MUTED, marginBottom: 30, textAlign: 'center', paddingHorizontal: 10 },
  input: { fontSize: 24, letterSpacing: 10, borderBottomWidth: 2, borderColor: PRIMARY_COLOR, paddingBottom: 10, width: 220, textAlign: 'center', marginBottom: 40, color: TEXT_DARK },
  button: { backgroundColor: PRIMARY_COLOR, width: '100%', paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});