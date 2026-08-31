import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Send, Bot } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { sendAdvisorMessage, AssistMessage } from '../services/assistService';
import { spacing, borderRadius, fontSizes } from '../styles/theme';

export default function AssistChatScreen() {
  const { colors } = useApp();
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.surface }]}>खेत सलाह</Text>
        <Text style={[styles.subtitle, { color: colors.surface }]}>AI Farm Advisor</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? [styles.userBubble, { backgroundColor: colors.primary }] : [styles.assistantBubble, { backgroundColor: colors.surface, borderColor: colors.border }]]}>
            <Text style={[styles.msgText, { color: item.role === 'user' ? colors.surface : colors.text }]}>{item.content}</Text>
          </View>
        )}
      />

      <View style={[styles.inputRow, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about crops..."
          placeholderTextColor={colors.textSecondary}
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity style={[styles.sendBtn, { backgroundColor: colors.primary }]} onPress={handleSend} disabled={sending}>
          <Send size={20} color={colors.surface} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: spacing.xxl, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  title: { fontSize: fontSizes.xl, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: fontSizes.md, textAlign: 'center', marginTop: spacing.xs, opacity: 0.9 },
  bubble: { padding: spacing.md, borderRadius: borderRadius.md, marginBottom: spacing.sm, maxWidth: '80%' },
  userBubble: { alignSelf: 'flex-end' },
  assistantBubble: { alignSelf: 'flex-start', borderWidth: 1 },
  msgText: { fontSize: fontSizes.md },
  inputRow: { flexDirection: 'row', padding: spacing.md, borderTopWidth: 1 },
  input: { flex: 1, marginRight: spacing.sm, padding: spacing.md, borderRadius: borderRadius.md },
  sendBtn: { padding: spacing.md, borderRadius: borderRadius.md },
});
