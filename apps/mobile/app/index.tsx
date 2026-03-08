// apps/mobile/app/index.tsx
import { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, Card, Button, FAB, ActivityIndicator } from "react-native-paper";
import { useRouter } from "expo-router";
import { getTopics } from "@my-knowledge/api";
import type { Topic } from "@my-knowledge/contracts";

export default function TopicsScreen() {
  const router = useRouter();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTopics();
  }, []);

  async function loadTopics() {
    try {
      setLoading(true);
      const data = await getTopics();
      setTopics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load topics");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text variant="bodyLarge">{error}</Text>
        <Button mode="contained" onPress={loadTopics} style={styles.retry}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={topics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card
            style={styles.card}
            onPress={() => router.push(`/topic/${item.id}`)}
          >
            <Card.Content>
              <Text variant="titleLarge">{item.name}</Text>
              {item.description && (
                <Text variant="bodyMedium" style={styles.description}>
                  {item.description}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text variant="bodyLarge">No topics yet</Text>
          </View>
        )}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push("/topic/new")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  description: {
    marginTop: 8,
    color: "#666",
  },
  retry: {
    marginTop: 16,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
