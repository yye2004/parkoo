import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";
import { AvailabilitySnapshot, AvailabilityZone } from "../types";

const REFRESH_MS = 15000;

export const AvailabilityScreen = () => {
  const { accessToken, user, logout } = useAuth();
  const [snapshot, setSnapshot] = useState<AvailabilitySnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const data = await api.get<AvailabilitySnapshot>("/availability", accessToken);
      setSnapshot(data);
    } catch (err) {
      console.warn("availability error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
    const id = setInterval(fetchAvailability, REFRESH_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({ item }: { item: AvailabilityZone }) => {
    const total = item.available + item.occupied;
    const ratio = total ? item.available / total : 0;
    const color = ratio > 0.5 ? "#16a34a" : ratio > 0.2 ? "#f59e0b" : "#dc2626";
    return (
      <View style={styles.card}>
        <View style={[styles.statusDot, { backgroundColor: color }]} />
        <View style={{ flex: 1 }}>
          <Text style={styles.zoneName}>{item.name}</Text>
          <Text style={styles.meta}>
            Floor {item.floor} • {item.available} free / {item.occupied} busy
          </Text>
        </View>
        {item.type ? <Text style={styles.badge}>{item.type.toUpperCase()}</Text> : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.name || "driver"}</Text>
          <Text style={styles.subtle}>Auto-refreshing every {REFRESH_MS / 1000}s</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {loading && !snapshot ? <ActivityIndicator size="large" style={{ marginTop: 24 }} /> : null}

      <FlatList
        data={snapshot?.zones || []}
        keyExtractor={(z) => z.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchAvailability} />}
        contentContainerStyle={{ paddingVertical: 8 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 24 }}>No data yet. Pull to refresh.</Text>
        }
      />
      {snapshot ? (
        <Text style={styles.footer}>Updated: {new Date(snapshot.timestamp).toLocaleTimeString()}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12
  },
  greeting: { fontSize: 18, fontWeight: "600" },
  subtle: { color: "#475569" },
  logoutBtn: {
    borderColor: "#cbd5e1",
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  logoutText: { color: "#0f172a", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10
  },
  zoneName: { fontSize: 16, fontWeight: "600" },
  meta: { color: "#475569", marginTop: 4 },
  badge: {
    backgroundColor: "#e2e8f0",
    color: "#0f172a",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    fontWeight: "700"
  },
  footer: { textAlign: "center", color: "#475569", marginTop: 8 }
});

