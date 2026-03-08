import { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Text,
  Card,
  Button,
  ActivityIndicator,
  Chip,
} from "react-native-paper";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getTopic, getSubtopics, getConcepts } from "@my-knowledge/api";
import type { Topic, Concept } from "@my-knowledge/contracts";

export default function TopicDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [subtopics, setSubtopics] = useState<Topic[]>([]);
  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      const [topicData, subtopicsData, conceptsData] = await Promise.all([
        getTopic(id as string),
        getSubtopics(id as string),
        getConcepts(id as string),
      ]);
      setTopic(topicData);
      setSubtopics(subtopicsData);
      setConcepts(conceptsData);
    } catch (err) {
      console.error(err);
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

  if (!topic) {
    return (
      <View style={styles.center}>
        <Text>Topic not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Topic Header */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="headlineMedium">{topic.name}</Text>
          {topic.description && (
            <Text variant="bodyLarge" style={styles.description}>
              {topic.description}
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Subtopics Section */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Subtopics ({subtopics.length})
        </Text>
        {subtopics.map((subtopic) => (
          <Card
            key={subtopic.id}
            style={styles.card}
            onPress={() => router.push(`/topic/${subtopic.id}`)}
          >
            <Card.Content>
              <Text variant="titleMedium">{subtopic.name}</Text>
              {subtopic.description && (
                <Text variant="bodyMedium" style={styles.description}>
                  {subtopic.description}
                </Text>
              )}
            </Card.Content>
          </Card>
        ))}
      </View>

      {/* Concepts Section */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Concepts ({concepts.length})
        </Text>
        {concepts.map((concept) => (
          <Card key={concept.id} style={styles.card}>
            <Card.Content>
              <View style={styles.conceptHeader}>
                <Text variant="titleMedium">{concept.name}</Text>
                <Chip mode="flat" textStyle={styles.chipText}>
                  Concept
                </Chip>
              </View>
              <Text variant="bodyMedium" style={styles.description}>
                {concept.definition}
              </Text>
            </Card.Content>
          </Card>
        ))}
      </View>
    </ScrollView>
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
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  description: {
    marginTop: 8,
    color: "#666",
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 12,
    fontWeight: "bold",
  },
  conceptHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  chipText: {
    fontSize: 10,
  },
});
