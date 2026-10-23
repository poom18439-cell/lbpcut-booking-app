import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  th: {
    selectServiceTitle: "เลือกบริการ",
    allServicesTab: "บริการทั้งหมด",
    queueTableTab: "ตารางคิว",
    hourLabel: "ชม.",
    minuteLabel: "นาที",
    continueBtn: "ดำเนินการต่อ",
    selectServiceBottom: "เลือกบริการ",
    serviceUnit: "บริการ",
    selectTimeTitle: "เลือกเวลา",
    calendarBtn: "เลือกจากปฏิทิน",
    anySpecialist: "คนไหนก็ได้",
    noQueue: "ไม่มีคิวจองในวันนี้",
    specialistTitle: "เลือกผู้เชี่ยวชาญ",
    anySpecialistDesc: "ให้ทางร้านเลือกให้",
    expertDesc: "ผู้เชี่ยวชาญ",
    customerTitle: "ข้อมูลลูกค้า",
    fullName: "ชื่อ-นามสกุล",
    enterName: "กรอกชื่อของคุณ",
    phoneNumber: "เบอร์โทรศัพท์",
    confirmSuccess: "นัดหมายถูกยืนยัน\nเรียบร้อยแล้ว",
    shopInfo: "ข้อมูลร้านค้า",
    tapMap: "แตะเพื่อดู Google Maps",
    getDirections: "ดูเส้นทาง",
    bookingDetails: "รายละเอียดการนัดหมาย",
    custName: "ชื่อลูกค้า",
    date: "วันที่",
    time: "เวลา",
    service: "บริการ",
    bookingPolicy: "นโยบายการจอง",
    policyDesc: "โปรดยกเลิกหรือเลื่อนนัดอย่างน้อย 12 ชั่วโมงก่อนเวลานัดหมายของคุณ\nหากต้องการเปลี่ยนแปลง โปรดโทร",
    rescheduleBtn: "เลื่อนนัด",
    cancelBpn: "ยกเลิกการจอง",
    homeBtn: "กลับหน้าหลัก",
    cancelSuccessTitle: "ยกเลิกการจอง\nเรียบร้อยแล้ว",
    cancelSuccessDesc: "แพลนเปลี่ยนกันได้เสมอ แล้วพบกันใหม่เร็วๆ นี้นะ หากต้องการเวลาที่สะดวกกว่า คุณสามารถจองรอบใหม่ได้ด้านล่าง",
    bookAgainBtn: "จองอีกครั้ง",
    // เพิ่มคำแปลใหม่ด้านล่างนี้
    otpTitle: "ยืนยันการจอง",
    otpSubtitle: "กรุณากรอกรหัส 6 หลักที่ส่งไปยังข้อความของคุณ",
    otpPlaceholder: "000000",
    confirmBookingBtn: "ยืนยันการจอง",
    resendOtp: "ยังไม่ได้รหัสใช่ไหม ส่งอีกครั้ง",
    days: ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์'],
    months: ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'],
  },
  en: {
    selectServiceTitle: "Select Service",
    allServicesTab: "All Services",
    queueTableTab: "Schedules",
    hourLabel: "hrs",
    minuteLabel: "mins",
    continueBtn: "Continue",
    selectServiceBottom: "Select Service",
    serviceUnit: "Services",
    selectTimeTitle: "Select Time",
    calendarBtn: "Calendar",
    anySpecialist: "Any",
    noQueue: "No bookings for today",
    specialistTitle: "Select Specialist",
    anySpecialistDesc: "Let the shop choose",
    expertDesc: "Specialist",
    customerTitle: "Customer Info",
    fullName: "Full Name",
    enterName: "Enter your name",
    phoneNumber: "Phone Number",
    confirmSuccess: "Booking Confirmed\nSuccessfully",
    shopInfo: "Shop Information",
    tapMap: "Tap for Google Maps",
    getDirections: "Get Directions",
    bookingDetails: "Booking Details",
    custName: "Customer Name",
    date: "Date",
    time: "Time",
    service: "Service",
    bookingPolicy: "Booking Policy",
    policyDesc: "Please cancel or reschedule at least 12 hours before your appointment.\nTo make changes, please call",
    rescheduleBtn: "Reschedule",
    cancelBpn: "Cancel Booking",
    homeBtn: "Back to Home",
    cancelSuccessTitle: "Booking Cancelled\nSuccessfully",
    cancelSuccessDesc: "Plans can change! See you again soon. If you need a more convenient time, you can book a new slot below.",
    bookAgainBtn: "Book Again",
    // เพิ่มคำแปลใหม่ด้านล่างนี้
    otpTitle: "Booking Confirmation",
    otpSubtitle: "Please enter the 6-digit code sent to your message",
    otpPlaceholder: "000000",
    confirmBookingBtn: "Confirm Booking",
    resendOtp: "Didn't receive code? Resend",
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('th'); 

  useEffect(() => {
    const loadLang = async () => {
      try {
        const savedLang = await AsyncStorage.getItem('user_lang');
        if (savedLang) setLang(savedLang);
      } catch (error) { console.log(error); }
    };
    loadLang();
  }, []);

  const changeLang = async (newLang) => {
    setLang(newLang);
    try {
      await AsyncStorage.setItem('user_lang', newLang);
    } catch (error) { console.log(error); }
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}