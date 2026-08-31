import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { sendAdvisorMessage, AssistMessage } from '../services/assistService';
import { colors, spacing, borderRadius, fontSizes } from '../styles/theme';

export default function AssistChatScreen() {
  const [messages, setMessages] = useState<AssistMessage[]>([
    { role: 'system', content: 'You are a farm advisor focusing on practical, region‑aware tips for upcoming crop cycles. Keep answers concise and actionable.' }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    setInput('');
    const userMsg: AssistMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setSending(true);
    try {
      const reply = await sendAdvisorMessage([...messages, userMsg]);
      setMessages(prev => [...prev, reply]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, advisory service is temporarily unavailable.' }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>खेत सलाह</Text>
        <Text style={styles.subtitle}>AI Farm Advisor</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.userBubble : styles.assistantBubble]}>
            <Text style={styles.msgText}>{item.content}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask upcoming crop planning..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendBtn} disabled={sending}>
          <Text style={styles.sendText}>{sending ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingTop: spacing.xxl, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, backgroundColor: colors.primary },
  title: { fontSize: fontSizes.xl, fontWeight: 'bold', color: colors.surface, textAlign: 'center' },
  subtitle: { fontSize: fontSizes.md, color: colors.surface, textAlign: 'center', marginTop: spacing.xs, opacity: 0.9 },
  bubble: { borderRadius: borderRadius.md, padding: spacing.md, marginBottom: spacing.sm, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  assistantBubble: { alignSelf: 'flex-start', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  msgText: { color: colors.text },
  inputRow: { flexDirection: 'row', padding: spacing.lg, gap: 8 },
  input: { flex: 1, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSizes.md, color: colors.text },
  sendBtn: { backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingHorizontal: spacing.lg, justifyContent: 'center' },
  sendText: { color: colors.surface, fontWeight: '600' },
});


