import { Stack } from 'expo-router';
// เช็กให้ชัวร์ว่าที่อยู่ไฟล์ LanguageContext ตรงกับในโปรเจกต์ของคุณ
import { LanguageProvider } from '../LanguageContext'; 

export default function RootLayout() {
  return (
    <LanguageProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </LanguageProvider>
  );
}