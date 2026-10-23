import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { useLanguage } from '../LanguageContext'; 

const PRIMARY_COLOR = "#A98467";
const TEXT_DARK = "#2C2C2C";
const TEXT_MUTED = "#777777";
const BG_COLOR = "#FDFBF7";

export default function SpecialistScreen() {
  const params = useLocalSearchParams();
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const { lang, setLang, t } = useLanguage();

  const handleNext = () => {
    if (selectedSpecialist) {
      router.push({
        pathname: '/time',
        params: { ...params, specialist: selectedSpecialist }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('specialistTitle')}</Text>
        
        <View style={styles.langToggle}>
          <TouchableOpacity style={lang === 'th' ? styles.langActive : styles.langInactive} onPress={() => setLang('th')}>
            <Text style={lang === 'th' ? styles.langTextActive : styles.langTextInactive}>TH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={lang === 'en' ? styles.langActive : styles.langInactive} onPress={() => setLang('en')}>
            <Text style={lang === 'en' ? styles.langTextActive : styles.langTextInactive}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer}>
        <Animatable.View animation="fadeInUp" duration={600} delay={100}>
          <TouchableOpacity 
            style={[styles.card, selectedSpecialist === 1 && styles.cardActive]}
            onPress={() => setSelectedSpecialist(1)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircleAny}>
              <Ionicons name="person-outline" size={24} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.title}>{t('anySpecialist')}</Text>
              <Text style={styles.detail}>{t('anySpecialistDesc')}</Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={600} delay={200}>
          <TouchableOpacity 
            style={[styles.card, selectedSpecialist === 2 && styles.cardActive]}
            onPress={() => setSelectedSpecialist(2)}
            activeOpacity={0.7}
          >
            <View style={styles.iconCirclePU}>
              <Text style={styles.puText}>PU</Text>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.title}>PU</Text>
              <Text style={styles.detail}>{t('expertDesc')}</Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.storeBox}>
          <View style={styles.logoBox}><Text style={styles.logoText}>LBPCUT</Text></View>
          <View style={styles.storeInfo}>
            <Text style={styles.storeName}>LBPCUT</Text>
            <Text style={styles.storeAddress}>2999/33 condo ciela sripatum</Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.totalPrice}>฿{params.price || 0}</Text>
            <Text style={styles.totalDetail}>
              {params.count || 0} {t('serviceUnit')} · {selectedSpecialist === 1 ? t('anySpecialist') : selectedSpecialist === 2 ? 'PU' : ''}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.nextButton, !selectedSpecialist && { backgroundColor: '#D1D5DB' }]}
            onPress={handleNext}
            disabled={!selectedSpecialist}
          >
            <Text style={[styles.nextText, !selectedSpecialist && { color: "#9CA3AF" }]}>{t('continueBtn')}</Text>
            <Ionicons name="chevron-forward" size={20} color={!selectedSpecialist ? "#9CA3AF" : "white"} />
          </TouchableOpacity>
        </View>
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
  listContainer: { padding: 20 },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 15, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  cardActive: { borderColor: PRIMARY_COLOR, borderWidth: 2 },
  iconCircleAny: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#F0EBE1", justifyContent: 'center', alignItems: 'center' },
  iconCirclePU: { width: 50, height: 50, borderRadius: 25, backgroundColor: PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center' },
  puText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  cardInfo: { flex: 1, marginLeft: 15 },
  title: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: TEXT_DARK },
  detail: { color: TEXT_MUTED, fontSize: 14 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', padding: 20, borderTopLeftRadius: 25, borderTopRightRadius: 25, shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 15, borderTopWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  storeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: BG_COLOR, padding: 15, borderRadius: 20, borderWidth: 1, borderColor: "rgba(0,0,0,0.03)", marginBottom: 20 },
  logoBox: { width: 50, height: 50, borderRadius: 15, backgroundColor: 'white', borderWidth: 1, borderColor: "rgba(0,0,0,0.05)", justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  logoText: { fontSize: 10, fontWeight: 'bold', color: TEXT_DARK },
  storeInfo: { flex: 1 },
  storeName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: TEXT_DARK },
  storeAddress: { fontSize: 12, color: TEXT_MUTED, lineHeight: 18 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalPrice: { fontSize: 24, fontWeight: 'bold', color: TEXT_DARK },
  totalDetail: { color: TEXT_MUTED, fontSize: 14 },
  nextButton: { backgroundColor: PRIMARY_COLOR, flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15, borderRadius: 30, alignItems: 'center' },
  nextText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 5 }
});