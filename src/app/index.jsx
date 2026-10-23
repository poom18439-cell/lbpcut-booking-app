import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Suspense, useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { supabase } from "../../supabase";
import { useLanguage } from "../LanguageContext";

// นำเข้าเครื่องมือ 3D
import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

const { height: screenHeight } = Dimensions.get("window");

// สีหลักของแอป (Mocha / น้ำตาลทองหม่น)
const PRIMARY_COLOR = "#A98467";
const TEXT_DARK = "#2C2C2C";
const TEXT_MUTED = "#777777";

function ScissorsModel() {
  const { scene } = useGLTF("/scissors.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // เปลี่ยนสีกรรไกรให้เป็นสี Mocha เข้ากับธีม
        child.material.color = new THREE.Color(PRIMARY_COLOR);
        child.material.metalness = 0.7; // ความเป็นโลหะ
        child.material.roughness = 0.2; // ความด้าน (ลดลงเพื่อให้สะท้อนแสง)
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={0.5} position={[0, -1, 0]} />;
}

export default function App() {
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setServices(data);
  }

  const toggleService = (service) => {
    const isAlreadySelected = selectedServices.some((s) => s.id === service.id);
    if (isAlreadySelected)
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    else setSelectedServices([...selectedServices, service]);
  };

  const totalCount = selectedServices.length;
  const totalPrice = selectedServices.reduce(
    (sum, item) => sum + item.price,
    0,
  );
  const totalDuration = selectedServices.reduce(
    (sum, item) => sum + item.duration_minutes,
    0,
  );
  const serviceNames = selectedServices.map((s) => s.name).join(" + ");

  // ธีมสีพื้นหลังแบบ Creamy Minimal (ครีม-เบจ)
  const topBgColors = ["#FDFBF7", "#F0EBE1"];
  const bottomBgColors = ["#F0EBE1", "#E6DFD3"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================== */}
        {/* ส่วนที่ 1: หน้าจอ 3D กรรไกร */}
        {/* ========================================== */}
        <LinearGradient
          colors={topBgColors}
          style={{
            height: screenHeight,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.heroTextContainer}>
            <Animatable.Text
              animation="fadeInDown"
              duration={1000}
              style={styles.heroTitle}
            >
              LBPCUT
            </Animatable.Text>
            <Animatable.Text
              animation="fadeInUp"
              duration={1000}
              delay={300}
              style={styles.heroSubtitle}
            >
              Cut for my G SLATT
            </Animatable.Text>
          </View>

          <Canvas
            style={{ flex: 1, width: "100%", height: "100%" }}
            camera={{ position: [0, 0, 5], fov: 50 }}
          >
            <ambientLight intensity={1} />
            <directionalLight position={[5, 10, 5]} intensity={1.5} />
            {/* ให้แสงสะท้อนแบบ Studio เพื่อความสมจริง */}
            <Environment preset="studio" />

            <Suspense fallback={null}>
              <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                <ScissorsModel />
              </Float>
            </Suspense>
            <OrbitControls
              enableZoom={false}
              autoRotate
              autoRotateSpeed={0.5}
            />
          </Canvas>

          <Animatable.View
            animation="bounce"
            iterationCount="infinite"
            style={styles.scrollDownIcon}
          >
            <Ionicons
              name="chevron-down-outline"
              size={40}
              color={PRIMARY_COLOR}
            />
          </Animatable.View>
        </LinearGradient>

        {/* ========================================== */}
        {/* ส่วนที่ 2: หน้าเลือกบริการ */}
        {/* ========================================== */}
        <LinearGradient
          colors={bottomBgColors}
          style={{ minHeight: screenHeight, paddingBottom: 150 }}
        >
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>{t("selectServiceTitle")}</Text>
            <View style={styles.langToggle}>
              <TouchableOpacity
                style={lang === "th" ? styles.langActive : styles.langInactive}
                onPress={() => setLang("th")}
              >
                <Text
                  style={
                    lang === "th"
                      ? styles.langTextActive
                      : styles.langTextInactive
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
                    lang === "en"
                      ? styles.langTextActive
                      : styles.langTextInactive
                  }
                >
                  EN
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
          >
            <TouchableOpacity style={styles.tabActive}>
              <Text style={styles.tabTextActive}>{t("allServicesTab")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.tabInactive}
              onPress={() => router.push("/schedule")}
            >
              <Text style={styles.tabTextInactive}>{t("queueTableTab")}</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.listContainer}>
            <Text style={styles.sectionTitle}>{t("allServicesTab")}</Text>
            {services.map((item, index) => {
              const isSelected = selectedServices.some((s) => s.id === item.id);
              return (
                <Animatable.View
                  key={item.id}
                  animation="fadeInUp"
                  duration={800}
                  delay={index * 100}
                >
                  <TouchableOpacity
                    style={[styles.card, isSelected && styles.cardActive]}
                    onPress={() => toggleService(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cardInfo}>
                      <Text style={styles.title}>{item.name}</Text>
                      <Text style={styles.detail}>
                        {item.duration_minutes >= 60
                          ? `${item.duration_minutes / 60} ${t("hourLabel")}`
                          : `${item.duration_minutes} ${t("minuteLabel")}`}
                      </Text>
                      <Text style={styles.price}>฿{item.price}</Text>
                    </View>
                    <View
                      style={[
                        styles.addButton,
                        isSelected && styles.addButtonActive,
                      ]}
                    >
                      <Ionicons
                        name={isSelected ? "checkmark" : "add"}
                        size={24}
                        color={isSelected ? "white" : PRIMARY_COLOR}
                      />
                    </View>
                  </TouchableOpacity>
                </Animatable.View>
              );
            })}
          </View>
        </LinearGradient>
      </ScrollView>

      {/* แถบด้านล่าง */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.totalPrice}>
              {totalCount > 0 ? `฿${totalPrice}` : "฿0"}
            </Text>
            <Text style={styles.totalDetail}>
              {totalCount > 0
                ? `${totalCount} ${t("serviceUnit")} • ${totalDuration} ${t("minuteLabel")}`
                : t("selectServiceBottom")}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.nextButton,
              totalCount === 0 && { backgroundColor: "#D1D5DB" },
            ]} // ปุ่มเทาเมื่อยังไม่ได้เลือก
            onPress={() =>
              router.push({
                pathname: "/specialist",
                params: {
                  price: totalPrice,
                  count: totalCount,
                  duration: totalDuration,
                  serviceNames: serviceNames,
                },
              })
            }
            disabled={totalCount === 0}
          >
            <Text
              style={[
                styles.nextText,
                totalCount === 0 && { color: "#9CA3AF" },
              ]}
            >
              {t("continueBtn")}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={totalCount === 0 ? "#9CA3AF" : "white"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFBF7" },
  heroTextContainer: {
    position: "absolute",
    top: "15%",
    zIndex: 10,
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 80,
    fontWeight: "900",
    color: TEXT_DARK,
    letterSpacing: 5,
  },
  heroSubtitle: {
    fontSize: 16,
    color: TEXT_MUTED,
    marginTop: 10,
    letterSpacing: 2,
  },
  scrollDownIcon: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
    zIndex: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: TEXT_DARK },
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
    shadowOffset: { width: 0, height: 1 },
  },
  langInactive: { paddingHorizontal: 12, paddingVertical: 6 },
  langTextActive: { color: TEXT_DARK, fontWeight: "bold", fontSize: 12 },
  langTextInactive: { color: TEXT_MUTED, fontWeight: "bold", fontSize: 12 },
  tabsContainer: { paddingHorizontal: 20, maxHeight: 50 },
  tabActive: {
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    justifyContent: "center",
  },
  tabInactive: {
    backgroundColor: "rgba(255,255,255,0.6)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 10,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  tabTextActive: { color: "white", fontWeight: "bold" },
  tabTextInactive: { color: TEXT_MUTED, fontWeight: "bold" },
  listContainer: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: TEXT_DARK,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  cardInfo: { flex: 1 },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: TEXT_DARK,
  },
  detail: { color: TEXT_MUTED, marginBottom: 8 },
  price: { fontWeight: "bold", fontSize: 16, color: PRIMARY_COLOR },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalPrice: { fontSize: 24, fontWeight: "bold", color: TEXT_DARK },
  totalDetail: { color: TEXT_MUTED, fontSize: 14 },
  nextButton: {
    backgroundColor: PRIMARY_COLOR,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  nextText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  cardActive: {
    borderColor: PRIMARY_COLOR,
    borderWidth: 2,
    backgroundColor: "white",
  },
  addButtonActive: {
    backgroundColor: PRIMARY_COLOR,
    borderColor: PRIMARY_COLOR,
  },
});
