import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useLanguage } from "../LanguageContext";

const PRIMARY_COLOR = "#A98467";
const TEXT_DARK = "#2C2C2C";
const TEXT_MUTED = "#777777";
const BG_COLOR = "#FDFBF7";
const monthNamesTh = [
  "มกราคม",
  "กุมภาพันธ์",
  "มีนาคม",
  "เมษายน",
  "พฤษภาคม",
  "มิถุนายน",
  "กรกฎาคม",
  "สิงหาคม",
  "กันยายน",
  "ตุลาคม",
  "พฤศจิกายน",
  "ธันวาคม",
];

export default function CancelScreen() {
  const params = useLocalSearchParams();
  const { lang, setLang, t } = useLanguage();

  const monthIndex = monthNamesTh.indexOf(params.monthText);
  const displayMonth =
    lang === "th"
      ? params.monthText
      : monthIndex !== -1
        ? t("months")[monthIndex]
        : params.monthText;
  const displayYear =
    lang === "th" ? params.yearTh : Number(params.yearTh) - 543;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topRightLang}>
        <View style={styles.langToggle}>
          <TouchableOpacity
            style={lang === "th" ? styles.langActive : styles.langInactive}
            onPress={() => setLang("th")}
          >
            <Text
              style={
                lang === "th" ? styles.langTextActive : styles.langTextInactive
              }
            >
              TH
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={lang === "en" ? styles.langActive : styles.langInactive}
            onPress={() => setLang("en")}
          >
            <Text
              style={
                lang === "en" ? styles.langTextActive : styles.langTextInactive
              }
            >
              EN
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Animatable.View
          animation="zoomIn"
          duration={800}
          style={styles.successHeader}
        >
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={40} color="white" />
          </View>
          <Text style={styles.successTitle}>{t("cancelSuccessTitle")}</Text>
          <Text style={styles.successDesc}>{t("cancelSuccessDesc")}</Text>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" duration={800} delay={300}>
          <View style={styles.detailsCard}>
            <Text style={styles.storeName}>LBPCUT</Text>
            <Text style={styles.storeAddress}>
              2999/33 condo ciela sripatum
            </Text>
            <View style={styles.divider} />
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={20} color={TEXT_MUTED} />
              <Text style={styles.detailText}>
                {t("custName")}: {params.customerName} ({params.customerPhone})
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={20} color={TEXT_MUTED} />
              <Text style={styles.detailText}>
                {t("date")}: {params.dayNum} {displayMonth} {displayYear}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={20} color={TEXT_MUTED} />
              <Text style={styles.detailText}>
                {t("time")}: {params.time}
              </Text>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>

      <Animatable.View
        animation="fadeInUp"
        duration={500}
        delay={600}
        style={styles.bottomBar}
      >
        <TouchableOpacity
          style={styles.bookAgainBtn}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.bookAgainText}>{t("bookAgainBtn")}</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR },
  topRightLang: { alignItems: "flex-end", padding: 20 },
  langToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 20,
    padding: 4,
  },
  langActive: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  langInactive: { paddingHorizontal: 12, paddingVertical: 6 },
  langTextActive: { color: TEXT_DARK, fontWeight: "bold", fontSize: 12 },
  langTextInactive: { color: TEXT_MUTED, fontWeight: "bold", fontSize: 12 },
  scroll: { padding: 20, paddingBottom: 100 },
  successHeader: { alignItems: "center", marginVertical: 30 },
  checkCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E57373",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: TEXT_DARK,
  },
  successDesc: {
    color: TEXT_MUTED,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  detailsCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  storeName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: TEXT_DARK,
  },
  storeAddress: { color: TEXT_MUTED, marginBottom: 15, fontSize: 13 },
  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.05)", marginBottom: 15 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  detailText: { fontSize: 14, color: TEXT_DARK, marginLeft: 10 },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 15,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  bookAgainBtn: {
    backgroundColor: PRIMARY_COLOR,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  bookAgainText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
