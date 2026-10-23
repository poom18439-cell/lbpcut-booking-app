import { useState, useEffect, useCallback, createElement } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Platform } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
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

export default function ScheduleScreen() {
  const [isMounted, setIsMounted] = useState(false);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allQueues, setAllQueues] = useState([]);
  const { lang, setLang, t } = useLanguage(); 

  useEffect(() => {
    const freshDates = generateDates();
    setDates(freshDates);
    setSelectedDate(freshDates[0]);
    setIsMounted(true); 
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadQueuesFromSupabase();
    }, [])
  );

  const loadQueuesFromSupabase = async () => {
    try {
      const { data, error } = await supabase.from('bookings').select('*');
      if (!error && data) setAllQueues(data);
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
      setSelectedDate({
        fullDate: selected,
        dayNum: String(selected.getDate()),
        dayText: dayNamesTh[selected.getDay()],
        monthText: monthNamesTh[selected.getMonth()],
        yearTh: String(selected.getFullYear() + 543)
      });
    }
  };

  if (!isMounted) return <View style={styles.container} />;

  const filteredQueues = allQueues.filter(q => 
    String(q.day_num) === String(selectedDate?.dayNum) && 
    String(q.month_text) === String(selectedDate?.monthText) && 
    String(q.year_th) === String(selectedDate?.yearTh)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={TEXT_DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('queueTableTab')}</Text>
        
        <View style={[styles.langToggle, { marginRight: 15 }]}>
          <TouchableOpacity style={lang === 'th' ? styles.langActive : styles.langInactive} onPress={() => setLang('th')}>
            <Text style={lang === 'th' ? styles.langTextActive : styles.langTextInactive}>TH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={lang === 'en' ? styles.langActive : styles.langInactive} onPress={() => setLang('en')}>
            <Text style={lang === 'en' ? styles.langTextActive : styles.langTextInactive}>EN</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={loadQueuesFromSupabase}>
          <Ionicons name="refresh" size={28} color={PRIMARY_COLOR} />
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

      <ScrollView contentContainerStyle={styles.scheduleList}>
        {filteredQueues.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="calendar-clear-outline" size={50} color="rgba(0,0,0,0.1)" />
            <Text style={styles.emptyText}>{t('noQueue')}</Text>
          </View>
        ) : (
          filteredQueues.map((item, index) => (
            <Animatable.View key={item.id} animation="fadeInUp" duration={600} delay={index * 150}>
              <View style={styles.scheduleCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.timeWrap}>
                    <Ionicons name="time-outline" size={16} color={PRIMARY_COLOR} />
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                  <Text style={styles.barberText}>{t('expertDesc')}: {item.barber === 'คนไหนก็ได้' ? t('anySpecialist') : item.barber}</Text>
                </View>
                
                <Text style={styles.customerName}>{item.customer_name}</Text>
                <Text style={styles.serviceText}>{item.service}</Text>
                
                <View style={styles.phoneWrap}>
                  <Ionicons name="call-outline" size={14} color={TEXT_MUTED} />
                  <Text style={styles.phoneText}>{item.phone}</Text>
                </View>
              </View>
            </Animatable.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR },
  headerRow: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 40, backgroundColor: 'white' },
  backButton: { width: 40, height: 40, backgroundColor: 'white', borderRadius: 20, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 3 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: TEXT_DARK, flex: 1, marginLeft: 15 },
  langToggle: { flexDirection: "row", backgroundColor: "rgba(0,0,0,0.05)", borderRadius: 20, padding: 4 },
  langActive: { backgroundColor: "white", borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, elevation: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 2 },
  langInactive: { paddingHorizontal: 12, paddingVertical: 6 },
  langTextActive: { color: TEXT_DARK, fontWeight: "bold", fontSize: 12 },
  langTextInactive: { color: TEXT_MUTED, fontWeight: "bold", fontSize: 12 },
  dateSection: { backgroundColor: 'white', paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  monthHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 },
  monthTitle: { fontSize: 18, fontWeight: 'bold', color: TEXT_DARK },
  calendarButton: { flexDirection: 'row', backgroundColor: PRIMARY_COLOR, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, alignItems: 'center', position: 'relative', overflow: 'hidden' },
  calendarButtonText: { color: 'white', fontSize: 12, fontWeight: 'bold', marginLeft: 5 },
  dateScroller: { flexDirection: 'row', paddingHorizontal: 15 },
  dateBox: { backgroundColor: 'white', width: 65, height: 85, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: "rgba(0,0,0,0.05)" },
  dateBoxActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
  dateNum: { fontSize: 22, fontWeight: 'bold', color: TEXT_DARK },
  dateDay: { fontSize: 12, color: TEXT_MUTED, marginTop: 4 },
  textWhite: { color: 'white' },
  scheduleList: { padding: 20, paddingBottom: 50 },
  scheduleCard: { backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, borderLeftWidth: 4, borderLeftColor: PRIMARY_COLOR, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  timeWrap: { flexDirection: 'row', alignItems: 'center' },
  timeText: { fontSize: 14, color: TEXT_DARK, marginLeft: 5, fontWeight: '500' },
  barberText: { fontSize: 13, color: TEXT_MUTED, fontWeight: 'bold' },
  customerName: { fontSize: 18, fontWeight: 'bold', color: PRIMARY_COLOR, marginBottom: 5 },
  serviceText: { fontSize: 14, color: TEXT_MUTED, marginBottom: 10 },
  phoneWrap: { flexDirection: 'row', alignItems: 'center' },
  phoneText: { fontSize: 13, color: TEXT_MUTED, marginLeft: 5 },
  emptyBox: { alignItems: 'center', marginTop: 50 },
  emptyText: { color: TEXT_MUTED, fontSize: 16, marginTop: 10 }
});