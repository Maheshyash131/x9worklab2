import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useAuth } from "@clerk/clerk-expo";

const API = process.env.EXPO_PUBLIC_BACKEND_URL;

export default function OpportunitiesScreen() {
  const { getToken } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeed = useCallback(async () => {
    try {
      const token = await getToken();

      const res = await fetch(`${API}/designer/feed`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const merged = [
        ...(data.referrals || []),
        ...(data.consultations || []),
      ];

      setItems(merged);
    } catch {
      Alert.alert("Error", "Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const handleAction = async (referralId: string, action: string) => {
    try {
      const token = await getToken();

      await fetch(`${API}/designer/referral-action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          referral_id: referralId,
          action,
        }),
      });

      fetchFeed();
    } catch {
      Alert.alert("Error", "Action failed");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.referral_id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.client_name}</Text>
          <Text>{item.project_type}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.accept}
              onPress={() => handleAction(item.referral_id, "accept")}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reject}
              onPress={() => handleAction(item.referral_id, "reject")}
            >
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    margin: 12,
    padding: 16,
    borderRadius: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
  accept: {
    backgroundColor: "#ff7a00",
    padding: 12,
    borderRadius: 10,
    flex: 1,
  },
  reject: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 10,
    flex: 1,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
});