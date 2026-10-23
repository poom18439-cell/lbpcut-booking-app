import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Linking, Modal } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "../../supabase"; 
import * as Animatable from 'react-native-animatable';
import { useLanguage } from '../LanguageContext'; 

const PRIMARY_COLOR = "#A98467";
const TEXT_DARK = "#2C2C2C";
const TEXT_MUTED = "#777777";
const BG_COLOR = "#FDFBF7";
const monthNamesTh = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

export default function ConfirmScreen() {
  const params = useLocalSearchParams();
  const { lang, setLang, t } = useLanguage();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const hasSaved = useRef(false); 

  useEffect(() => {
    setIsMounted(true);
    if (!hasSaved.current) {
      saveBookingToSupabase();
      hasSaved.current = true;
    }
  }, []);

  const saveBookingToSupabase = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert([{
          time: params.time,
          customer_name: params.customerName,
          phone: params.customerPhone,
          barber: params.specialist == 1 ? t('anySpecialist') : 'PU',
          service: params.serviceNames ? `${params.serviceNames} (จองออนไลน์)` : 'บริการทั่วไป (จองออนไลน์)',
          day_num: String(params.dayNum),
          month_text: String(params.monthText),
          year_th: String(params.yearTh),
          duration: String(params.duration) 
        }]);
      if (error) console.log("Supabase Insert Error: ", error);
    } catch (error) { console.log(error); }
  };

  const handleCancelBooking = async () => {
    try {
      await supabase.from('bookings').delete().match({
        time: params.time,
        day_num: String(params.dayNum),
        month_text: String(params.monthText),
        year_th: String(params.yearTh),
        customer_name: params.customerName
      });
    } catch(e) { console.log(e); }
    
    setShowCancelModal(false);
    router.push({ pathname: '/cancel', params });
  };

  const openMaps = () => Linking.openURL('https://www.google.com/maps/search/?api=1&query=ciela+sripatum');

  if (!isMounted) return <View style={styles.container} />;

  // ระบบดึงเดือนเพื่อแก้บั๊กภาษาอังกฤษ
  const monthIndex = monthNamesTh.indexOf(params.monthText);
  const displayMonth = lang === 'th' ? params.monthText : (monthIndex !== -1 ? t('months')[monthIndex] : params.monthText);
  const displayYear = lang === 'th' ? params.yearTh : (Number(params.yearTh) - 543);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRightLang}>
        <View style={styles.langToggle}>
          <TouchableOpacity style={lang === 'th' ? styles.langActive : styles.langInactive} onPress={() => setLang('th')}>
            <Text style={lang === 'th' ? styles.langTextActive : styles.langTextInactive}>TH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={lang === 'en' ? styles.langActive : styles.langInactive} onPress={() => setLang('en')}>
            <Text style={lang === 'en' ? styles.langTextActive : styles.langTextInactive}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animatable.View animation="zoomIn" duration={800} style={styles.successHeader}>
          <View style={styles.checkCircle}><Ionicons name="checkmark" size={40} color="white" /></View>
          <Text style={styles.successTitle}>{t('confirmSuccess')}</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={200}>
          <Text style={styles.sectionTitle}>{t('shopInfo')}</Text>
          <View style={styles.mapCard}>
            <TouchableOpacity style={styles.mapPlaceholder} onPress={openMaps}>
              <Ionicons name="map" size={40} color="#D1D5DB" />
              <Text style={{color: TEXT_MUTED, marginTop: 10}}>{t('tapMap')}</Text>
            </TouchableOpacity>
            <View style={styles.mapInfo}>
              <Text style={styles.storeName}>LBPCUT</Text>
              <Text style={styles.storeAddress}>2999/33 condo ciela sripatum</Text>
              <TouchableOpacity onPress={openMaps}><Text style={styles.mapLink}>{t('getDirections')}</Text></TouchableOpacity>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={400}>
          <Text style={styles.sectionTitle}>{t('bookingDetails')}</Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={TEXT_MUTED} />
              <Text style={styles.detailText}>{t('custName')}: {params.customerName} ({params.customerPhone})</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={TEXT_MUTED} />
              <Text style={styles.detailText}>{t('date')}: {params.dayNum} {displayMonth} {displayYear}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color={TEXT_MUTED} />
              <Text style={styles.detailText}>{t('time')}: {params.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="cut-outline" size={20} color={TEXT_MUTED} />
              <Text style={styles.detailText}>{t('service')}: {params.serviceNames ? `${params.serviceNames} (จองออนไลน์)` : 'บริการทั่วไป (จองออนไลน์)'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="people-outline" size={20} color={PRIMARY_COLOR} />
              <Text style={[styles.detailText, {color: PRIMARY_COLOR, fontWeight: 'bold'}]}>
                {t('expertDesc')}: {params.specialist == 1 ? t('anySpecialist') : 'PU'}
              </Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={600}>
          <Text style={styles.sectionTitle}>{t('bookingPolicy')}</Text>
          <View style={styles.policyBox}>
            <Text style={styles.policyText}>
              {t('policyDesc')} <Text style={styles.policyLink}>063-913-2584</Text>
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.rescheduleBtn} onPress={() => router.push({ pathname: '/time', params })}>
              <Text style={styles.rescheduleText}>{t('rescheduleBtn')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBpn} onPress={() => setShowCancelModal(true)}>
              <Text style={styles.cancelText}>{t('cancelBpn')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeBtn} onPress={() => router.replace('/')}>
              <Text style={styles.homeText}>{t('homeBtn')}</Text>
            </TouchableOpacity>
          </View>
        </Animatable.View>
      </ScrollView>

      <Modal visible={showCancelModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Ionicons name="warning-outline" size={40} color="#E57373" style={{marginBottom: 15}} />
            <Text style={styles.modalTitle}>เราอยากให้คุณมาใช้บริการนะ คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการเข้าร้าน?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.keepBtn} onPress={() => setShowCancelModal(false)}>
                <Text style={styles.keepText}>เก็บการจองไว้</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmCancelBpn} onPress={handleCancelBooking}>
                <Text style={styles.confirmCancelText}>ใช่, ยกเลิก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR },
  topRightLang: { alignItems: 'flex-end', padding: 20 },
  langToggle: { flexDirection: "row", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 20, padding: 4 },
  langActive: { backgroundColor: "white", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, elevation: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 2 },
  langInactive: { paddingHorizontal: 12, paddingVertical: 6 },
  langTextActive: { color: TEXT_DARK, fontWeight: "bold", fontSize: 12 },
  langTextInactive: { color: TEXT_MUTED, fontWeight: "bold", fontSize: 12 },
  scroll: { padding: 20, paddingBottom: 50 },
  successHeader: { alignItems: 'center', marginVertical: 15 },
  checkCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  successTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: TEXT_DARK },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, marginTop: 10, color: TEXT_DARK },
  mapCard: { backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', marginBottom: 25, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  mapPlaceholder: { height: 150, backgroundColor: '#F0EBE1', justifyContent: 'center', alignItems: 'center' },
  mapInfo: { padding: 20 },
  storeName: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: TEXT_DARK },
  storeAddress: { color: TEXT_MUTED, marginBottom: 10, fontSize: 13 },
  mapLink: { color: PRIMARY_COLOR, fontWeight: 'bold', fontSize: 14 },
  detailsCard: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 20, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  detailText: { fontSize: 14, color: TEXT_DARK, marginLeft: 10 },
  policyBox: { backgroundColor: 'white', padding: 20, borderRadius: 20, marginBottom: 30, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  policyText: { color: TEXT_MUTED, fontSize: 14, lineHeight: 22 },
  policyLink: { color: PRIMARY_COLOR, fontWeight: 'bold' },
  actionButtons: { gap: 15, marginBottom: 30 },
  rescheduleBtn: { backgroundColor: PRIMARY_COLOR, padding: 15, borderRadius: 30, alignItems: 'center' },
  rescheduleText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  cancelBpn: { backgroundColor: '#E57373', padding: 15, borderRadius: 30, alignItems: 'center' },
  cancelText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  homeBtn: { backgroundColor: 'transparent', padding: 15, borderRadius: 30, alignItems: 'center', borderWidth: 1, borderColor: PRIMARY_COLOR },
  homeText: { color: PRIMARY_COLOR, fontWeight: 'bold', fontSize: 16 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: 'white', padding: 25, borderRadius: 20, width: '100%', alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 25, color: TEXT_DARK },
  modalButtons: { flexDirection: 'row', gap: 10, width: '100%' },
  keepBtn: { flex: 1, padding: 15, borderRadius: 25, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center' },
  keepText: { fontWeight: 'bold', color: TEXT_DARK },
  confirmCancelBpn: { flex: 1, padding: 15, borderRadius: 25, backgroundColor: '#E57373', alignItems: 'center' },
  confirmCancelText: { fontWeight: 'bold', color: 'white' }
});