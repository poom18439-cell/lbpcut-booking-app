import { useState, useEffect, useCallback, createElement } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Platform, Modal } from 'react-native';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import DateTimePicker from '@react-native-community/datetimepicker';
import { supabase } from "../../supabase"; 
import * as Animatable from 'react-native-animatable';
import { useLanguage } from '../LanguageContext'; 

const PRIMARY_COLOR = "#A98467";
const TEXT_DARK = "#2C2C2C";
const TEXT_MUTED = "#777777";
const BG_COLOR = "#FDFBF7";

const dayNamesTh = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'];
const monthNamesTh = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];

const generateDates = () => {
  const dateArray = [];
  const today = new Date();
  today.setHours(0,0,0,0);
  for(let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dateArray.push({
      fullDate: d,
      dayNum: String(d.getDate()),
      dayText: dayNamesTh[d.getDay()],
      monthText: monthNamesTh[d.getMonth()],
      yearTh: String(d.getFullYear() + 543)
    });
  }
  return dateArray;
};

const ALL_TIME_SLOTS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

export default function TimeScreen() {
  const params = useLocalSearchParams();
  const { lang, setLang, t } = useLanguage(); 
  
  const [selectedSpecialist, setSelectedSpecialist] = useState(Number(params.specialist) || 2);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); 
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSpecialistModalVisible, setSpecialistModalVisible] = useState(false);
  const [tempSpecialist, setTempSpecialist] = useState(selectedSpecialist);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    const freshDates = generateDates();
    setDates(freshDates);
    setSelectedDate(freshDates[0]);
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedDate) {
        fetchBookedTimes();
        setSelectedTime(null); 
      }
    }, [selectedDate])
  );

  const fetchBookedTimes = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('time, duration')
        .eq('day_num', String(selectedDate.dayNum))
        .eq('month_text', String(selectedDate.monthText))
        .eq('year_th', String(selectedDate.yearTh));

      if (data && !error) {
        let blocked = new Set();
        data.forEach(booking => {
          const startIndex = ALL_TIME_SLOTS.indexOf(booking.time);
          if (startIndex !== -1) {
            const durationMins = Number(booking.duration) || 60;
            const slotsNeeded = Math.ceil(durationMins / 60);
            for (let i = 0; i < slotsNeeded; i++) {
              if (ALL_TIME_SLOTS[startIndex + i]) blocked.add(ALL_TIME_SLOTS[startIndex + i]);
            }
          }
        });
        setBookedSlots(Array.from(blocked));
      }
    } catch (e) { console.log(e); }
  };

  const handleOpenCalendar = () => {
    if (Platform.OS !== 'web') {
      setShowDatePicker(true);
    }
  };

  const onDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) {
      const formatted = {
        fullDate: selected,
        dayNum: String(selected.getDate()),
        dayText: dayNamesTh[selected.getDay()],
        monthText: monthNamesTh[selected.getMonth()],
        yearTh: String(selected.getFullYear() + 543)
      };
      setSelectedDate(formatted);
    }
  };

  const confirmSpecialistSelection = () => {
    setSelectedSpecialist(tempSpecialist);
    setSpecialistModalVisible(false);
  };

  const currentDurationMins = Number(params.duration) || 60;
  const currentSlotsNeeded = Math.ceil(currentDurationMins / 60);

  const availableSlots = ALL_TIME_SLOTS.filter((time, index) => {
    if (bookedSlots.includes(time)) return false;
    for (let i = 1; i < currentSlotsNeeded; i++) {
      const nextTime = ALL_TIME_SLOTS[index + i];
      if (!nextTime || bookedSlots.includes(nextTime)) return false;
    }
    return true; 
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('selectTimeTitle')}</Text>
        
        <View style={styles.langToggle}>
          <TouchableOpacity style={lang === 'th' ? styles.langActive : styles.langInactive} onPress={() => setLang('th')}>
            <Text style={lang === 'th' ? styles.langTextActive : styles.langTextInactive}>TH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={lang === 'en' ? styles.langActive : styles.langInactive} onPress={() => setLang('en')}>
            <Text style={lang === 'en' ? styles.langTextActive : styles.langTextInactive}>EN</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={styles.specialistSection}>
          <TouchableOpacity style={styles.specialistDropdown} onPress={() => { setTempSpecialist(selectedSpecialist); setSpecialistModalVisible(true); }} activeOpacity={0.7}>
            <View style={[styles.miniIcon, { backgroundColor: selectedSpecialist === 1 ? '#F0EBE1' : PRIMARY_COLOR }]}>
              {selectedSpecialist === 1 ? <Ionicons name="person" size={14} color={TEXT_MUTED} /> : <Text style={styles.miniIconText}>PU</Text>}
            </View>
            <Text style={styles.specialistText}>{selectedSpecialist === 1 ? t('anySpecialist') : 'PU'}</Text>
            <Ionicons name="chevron-down" size={16} color={TEXT_MUTED} style={{marginLeft: 10}} />
          </TouchableOpacity>
        </View>

        <View style={styles.dateSection}>
          <View style={styles.monthHeaderRow}>
            <Text style={styles.monthTitle}>
              {selectedDate?.dayNum} {selectedDate && t('months')[selectedDate.fullDate.getMonth()]} {selectedDate && (lang === 'th' ? selectedDate.fullDate.getFullYear() + 543 : selectedDate.fullDate.getFullYear())}
            </Text>
            
            {Platform.OS === 'web' ? (
              <View style={{ position: 'relative', display: 'flex' }}>
                <View style={styles.calendarButton}>
                  <Ionicons name="calendar-outline" size={20} color="white" />
                  <Text style={styles.calendarButtonText}>{t('calendarBtn')}</Text>
                </View>
                {createElement('input', {
                  type: 'date',
                  min: new Date().toISOString().split('T')[0],
                  style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 999 },
                  onClick: (e) => { try { e.target.showPicker(); } catch (err) {} },
                  onChange: (e) => {
                    if (e.target.value) {
                      const [year, month, day] = e.target.value.split('-');
                      const selected = new Date(year, month - 1, day);
                      onDateChange(null, selected);
                    }
                  }
                })}
              </View>
            ) : (
              <TouchableOpacity style={styles.calendarButton} onPress={handleOpenCalendar}>
                <Ionicons name="calendar-outline" size={20} color="white" />
                <Text style={styles.calendarButtonText}>{t('calendarBtn')}</Text>
              </TouchableOpacity>
            )}
          </View>

          {showDatePicker && Platform.OS !== 'web' && (
            <DateTimePicker value={selectedDate.fullDate} mode="date" display="default" minimumDate={new Date()} onChange={onDateChange} />
          )}
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroller}>
            {dates.map((d, index) => {
              const isSelected = selectedDate?.fullDate.toDateString() === d.fullDate.toDateString();
              return (
                <TouchableOpacity key={index} style={[styles.dateBox, isSelected && styles.dateBoxActive]} onPress={() => setSelectedDate(d)}>
                  <Text style={[styles.dateNum, isSelected && styles.textWhite]}>{d.dayNum}</Text>
                  <Text style={[styles.dateDay, isSelected && styles.textWhite]}>{t('days')[d.fullDate.getDay()]}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.timeSection}>
          {availableSlots.length === 0 ? (
            <Text style={{ textAlign: 'center', color: TEXT_MUTED, marginTop: 20 }}>{t('noQueue')}</Text>
          ) : (
            availableSlots.map((time, index) => {
              const isSelected = selectedTime === time;
              return (
                <Animatable.View key={index} animation="fadeInUp" duration={500} delay={index * 50}>
                  <TouchableOpacity style={[styles.timeBox, isSelected && styles.timeBoxActive]} onPress={() => setSelectedTime(time)}>
                    <Text style={[styles.timeText, isSelected && styles.textPrimary]}>{time}</Text>
                  </TouchableOpacity>
                </Animatable.View>
              );
            })
          )}
        </View>
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
            <Text style={styles.totalDetail}>{params.count || 0} {t('serviceUnit')} · {selectedSpecialist === 1 ? t('anySpecialist') : 'PU'}</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.nextButton, !selectedTime && { backgroundColor: '#D1D5DB' }]}
            onPress={() => router.push({
              pathname: '/customer',
              params: { 
                ...params, specialist: selectedSpecialist, dayNum: selectedDate?.dayNum, monthText: selectedDate?.monthText, yearTh: selectedDate?.yearTh, time: selectedTime
              }
            })}
            disabled={!selectedTime}
          >
            <Text style={[styles.nextText, !selectedTime && { color: "#9CA3AF" }]}>{t('continueBtn')}</Text>
            <Ionicons name="chevron-forward" size={20} color={!selectedTime ? "#9CA3AF" : "white"} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={isSpecialistModalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <TouchableOpacity style={styles.modalDismissArea} onPress={() => setSpecialistModalVisible(false)} />
          <View style={styles.bottomSheet}>
            <View style={styles.dragHandle} />
            <Text style={styles.modalServiceTitle}>
              {params.serviceNames ? `${params.serviceNames} (จองออนไลน์)` : 'บริการทั่วไป (จองออนไลน์)'}
            </Text>

            <TouchableOpacity style={[styles.specCard, tempSpecialist === 1 && styles.specCardActive]} onPress={() => setTempSpecialist(1)}>
              <View style={styles.iconCircleAny}><Ionicons name="person-outline" size={24} color={PRIMARY_COLOR} /></View>
              <View style={styles.specCardInfo}>
                <Text style={styles.specTitle}>{t('anySpecialist')}</Text>
                <Text style={styles.specDetail}>{t('anySpecialistDesc')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.specCard, tempSpecialist === 2 && styles.specCardActive]} onPress={() => setTempSpecialist(2)}>
              <View style={styles.iconCirclePU}><Text style={styles.puText}>PU</Text></View>
              <View style={styles.specCardInfo}>
                <Text style={styles.specTitle}>PU</Text>
                <Text style={styles.specDetail}>{t('expertDesc')}</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmSpecBtn} onPress={confirmSpecialistSelection}>
              <Text style={styles.confirmSpecText}>{t('continueBtn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  specialistSection: { paddingHorizontal: 20, marginBottom: 20 },
  specialistDropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 10, borderRadius: 25, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  miniIcon: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  miniIconText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
  specialistText: { fontWeight: 'bold', color: TEXT_DARK },
  dateSection: { paddingHorizontal: 20, marginBottom: 20 },
  monthHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  monthTitle: { fontSize: 18, fontWeight: 'bold', color: TEXT_DARK },
  calendarButton: { flexDirection: 'row', backgroundColor: PRIMARY_COLOR, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  calendarButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  dateScroller: { flexDirection: 'row' },
  dateBox: { backgroundColor: 'white', width: 65, height: 85, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  dateBoxActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
  dateNum: { fontSize: 22, fontWeight: 'bold', color: TEXT_DARK },
  dateDay: { fontSize: 12, color: TEXT_MUTED, marginTop: 4 },
  textWhite: { color: 'white' },
  timeSection: { paddingHorizontal: 20, paddingBottom: 20 },
  timeBox: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 10, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  timeBoxActive: { borderColor: PRIMARY_COLOR, borderWidth: 2, backgroundColor: "white" },
  timeText: { fontSize: 18, fontWeight: 'bold', color: TEXT_DARK },
  textPrimary: { color: PRIMARY_COLOR },
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
  nextText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginRight: 5 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalDismissArea: { flex: 1 },
  bottomSheet: { backgroundColor: 'white', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, paddingBottom: 40 },
  dragHandle: { width: 40, height: 5, backgroundColor: '#EAEAEA', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
  modalServiceTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, lineHeight: 28, textAlign: 'center', color: TEXT_DARK },
  specCard: { backgroundColor: 'white', padding: 20, borderRadius: 25, marginBottom: 15, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  specCardActive: { borderColor: PRIMARY_COLOR, borderWidth: 2 },
  specCardInfo: { flex: 1, marginLeft: 15 },
  specTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: TEXT_DARK },
  specDetail: { color: TEXT_MUTED, fontSize: 14 },
  iconCircleAny: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#F0EBE1", justifyContent: 'center', alignItems: 'center' },
  iconCirclePU: { width: 60, height: 60, borderRadius: 30, backgroundColor: PRIMARY_COLOR, justifyContent: 'center', alignItems: 'center' },
  puText: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  confirmSpecBtn: { backgroundColor: PRIMARY_COLOR, paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 10 },
  confirmSpecText: { color: 'white', fontSize: 16, fontWeight: 'bold' }
});