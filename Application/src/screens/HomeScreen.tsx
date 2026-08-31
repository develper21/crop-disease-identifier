import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { Camera, History, BookOpen, X } from "lucide-react-native";

export default function HomeScreen({ navigation }: any) {
  const [showTipsModal, setShowTipsModal] = useState(false);

  function handleScanPress() {
    navigation.navigate("Camera");
  }

  function handleTipsPress() {
    setShowTipsModal(true);
  }

  function closeTipsModal() {
    setShowTipsModal(false);
  }

  function handleHistoryPress() {
    navigation.navigate("History");
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.topBar}>
          <Text style={styles.logo}>🌱 CropGuard</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroCard}>
          {/* Farmer with crops image above text */}
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1606607291766-9b74d8b62b43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
            }}
            style={styles.heroImageLarge}
          />
          <Text style={styles.heroTitle}>Protect Your Crops</Text>
          <Text style={styles.heroSubtitle}>
            Identify diseases instantly with AI-powered detection
          </Text>
        </View>

        {/* Scan Button */}
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScanPress}
          activeOpacity={0.8}
        >
          <Camera size={20} color="#fff" />
          <Text style={styles.scanText}>Scan Now</Text>
        </TouchableOpacity>

        {/* History & Tips */}
        <View style={styles.row}>
          <TouchableOpacity style={styles.smallCard} onPress={handleHistoryPress}>
            <History size={22} color="#22c55e" />
            <Text style={styles.smallCardText}>History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.smallCard} onPress={handleTipsPress}>
            <BookOpen size={22} color="#22c55e" />
            <Text style={styles.smallCardText}>Tips</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Tips */}
        <Text style={styles.quickTipsTitle}>Quick Tips</Text>

        {/* Tip 1 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipCardTitle}>📷 Upload Leaf Photo</Text>
          <Text style={styles.tipCardText}>
            Take a clear photo of the affected leaf for accurate detection
          </Text>
        </View>

        {/* Tip 2 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipCardTitle}>💧 Watering Schedule</Text>
          <Text style={styles.tipCardText}>
            Water your crops early in the morning to reduce evaporation and
            prevent fungal growth.
          </Text>
        </View>

        {/* Tip 3 */}
        <View style={styles.tipCard}>
          <Text style={styles.tipCardTitle}>🌞 Proper Sunlight</Text>
          <Text style={styles.tipCardText}>
            Ensure your crops get enough sunlight but avoid overexposure to
            prevent leaf burns.
          </Text>
        </View>
      </ScrollView>

      {/* Tips Modal */}
      <Modal
        visible={showTipsModal}
        transparent={true}
        animationType="fade"
        onRequestClose={closeTipsModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>🌱 Crop Care Tips</Text>
              <TouchableOpacity onPress={closeTipsModal} style={styles.closeButton}>
                <X size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.modalTipCard}>
                <Text style={styles.modalTipTitle}>📷 Photo Quality</Text>
                <Text style={styles.modalTipText}>
                  • Take photos in good lighting conditions{'\n'}
                  • Focus on the affected area clearly{'\n'}
                  • Avoid shadows and blurry images{'\n'}
                  • Include the entire leaf if possible
                </Text>
              </View>

              <View style={styles.modalTipCard}>
                <Text style={styles.modalTipTitle}>💧 Watering Best Practices</Text>
                <Text style={styles.modalTipText}>
                  • Water early in the morning (6-8 AM){'\n'}
                  • Avoid watering leaves directly{'\n'}
                  • Use consistent watering schedule{'\n'}
                  • Check soil moisture before watering
                </Text>
              </View>

              <View style={styles.modalTipCard}>
                <Text style={styles.modalTipTitle}>🌞 Sunlight Management</Text>
                <Text style={styles.modalTipText}>
                  • Provide 6-8 hours of sunlight daily{'\n'}
                  • Protect from harsh afternoon sun{'\n'}
                  • Rotate plants for even growth{'\n'}
                  • Use shade cloth if needed
                </Text>
              </View>

              <View style={styles.modalTipCard}>
                <Text style={styles.modalTipTitle}>🌱 Soil Health</Text>
                <Text style={styles.modalTipText}>
                  • Test soil pH regularly{'\n'}
                  • Add organic compost{'\n'}
                  • Ensure proper drainage{'\n'}
                  • Rotate crops seasonally
                </Text>
              </View>

              <View style={styles.modalTipCard}>
                <Text style={styles.modalTipTitle}>🐛 Pest Prevention</Text>
                <Text style={styles.modalTipText}>
                  • Inspect plants regularly{'\n'}
                  • Remove affected leaves promptly{'\n'}
                  • Use natural pest deterrents{'\n'}
                  • Maintain clean growing area
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },

  // Top bar
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
    marginTop: 35,
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
  },

  // Hero card
  heroCard: {
    backgroundColor: "#22c55e",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  heroImageLarge: {
    width: 140,
    height: 140,
    resizeMode: "cover",
    marginBottom: 12,
    borderRadius: 70,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
    marginTop: 4,
  },

  // Scan button
  scanButton: {
    backgroundColor: "#22c55e",
    marginHorizontal: 16,
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  scanText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
  },
  smallCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 6,
    elevation: 2,
  },
  smallCardText: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
    color: "#111827",
  },

  
  quickTipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 16,
    marginBottom: 8,
    color: "#111827",
  },
  tipCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  tipCardTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: "#111827",
  },
  tipCardText: {
    fontSize: 13,
    color: "#6b7280",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "100%",
    maxHeight: "80%",
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalTipCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#22c55e",
  },
  modalTipTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111827",
  },
  modalTipText: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
});