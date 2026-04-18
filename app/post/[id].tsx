import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useContext, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView, Platform, Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { DoubtContext } from '../../context/DoubtContext';

export default function DoubtDetail() {
  const { id } = useLocalSearchParams();
  const { doubts, currentUser, toggleDoubtStatus } = useContext(DoubtContext);
  const inputRef = useRef(null);

  // 1. GET DOUBT DATA
  const doubt = doubts.find((d) => d.id === id);

  // 2. LOCAL STATE FOR REPLIES (Mock Data + Interaction)
  // We use local state here so we can instantly update the UI (Likes/New Replies)
  const [replies, setReplies] = useState([
    { 
      id: 'r1', 
      user: 'Rahul', 
      text: 'Have you tried checking the base case in your recursion?', 
      time: '10:00 AM',
      likes: 2,
      isLiked: false,
      replyingTo: null 
    },
    { 
      id: 'r2', 
      user: 'Sneha', 
      text: 'I think the issue is in the loop condition.', 
      time: '10:15 AM',
      likes: 0,
      isLiked: false,
      replyingTo: null 
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null); // Tracks who we are replying to (e.g., { user: 'Rahul', id: 'r1' })

  if (!doubt) return <Text style={{marginTop:100, textAlign:'center'}}>Doubt not found</Text>;

  const isOwner = currentUser.email === doubt.author;

  // --- ACTIONS ---

  const handleLike = (replyId) => {
    setReplies(prev => prev.map(r => {
      if (r.id === replyId) {
        return {
          ...r,
          likes: r.isLiked ? r.likes - 1 : r.likes + 1,
          isLiked: !r.isLiked
        };
      }
      return r;
    }));
  };

  const initReply = (user, replyId) => {
    setReplyingTo({ user, id: replyId });
    inputRef.current?.focus(); // Auto-focus the keyboard
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newReply = {
      id: Date.now().toString(),
      user: currentUser.name, // You are the user
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      isLiked: false,
      replyingTo: replyingTo ? replyingTo.user : null // Tag the user if replying
    };

    setReplies([...replies, newReply]);
    setInputText('');
    setReplyingTo(null); // Reset reply mode
    Keyboard.dismiss();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen options={{ title: 'Discussion', headerShadowVisible: false }} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{flex:1}}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          
          {/* --- MAIN DOUBT CARD --- */}
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.badge}><Text style={styles.badgeText}>{doubt.course}</Text></View>
              <Text style={[styles.status, doubt.isSolved ? styles.textSolved : styles.textUnsolved]}>
                {doubt.isSolved ? 'SOLVED' : 'UNSOLVED'}
              </Text>
            </View>

            <Text style={styles.title}>{doubt.title}</Text>
            
            <View style={styles.userRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{doubt.author[0].toUpperCase()}</Text>
              </View>
              <View>
                <Text style={styles.username}>{doubt.author.split('@')[0]}</Text>
                <Text style={styles.date}>{new Date(doubt.date).toLocaleString()}</Text>
              </View>
            </View>
            
            <Text style={styles.desc}>{doubt.description}</Text>

            {isOwner && (
              <TouchableOpacity 
                style={[styles.solveBtn, doubt.isSolved && styles.solveBtnActive]}
                onPress={() => toggleDoubtStatus(doubt.id)}
              >
                <Text style={[styles.solveText, doubt.isSolved && {color: 'green'}]}>
                  {doubt.isSolved ? '✔ Mark as Unsolved' : '✔ Mark as Solved'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* --- REPLIES SECTION --- */}
          <Text style={styles.sectionHeader}>Replies ({replies.length})</Text>
          
          {replies.map((r) => (
            <View key={r.id} style={styles.replyCard}>
              <View style={styles.replyHeader}>
                <Text style={styles.replyUser}>{r.user}</Text>
                <Text style={styles.replyTime}>{r.time}</Text>
              </View>

              {/* Show "Replying to X" if applicable */}
              {r.replyingTo && (
                <Text style={styles.replyingToText}>
                  Replying to <Text style={{fontWeight: '700'}}>{r.replyingTo}</Text>
                </Text>
              )}

              <Text style={styles.replyBody}>{r.text}</Text>

              {/* ACTION BUTTONS (Like & Reply) */}
              <View style={styles.replyActions}>
                <TouchableOpacity 
                  style={styles.actionBtn} 
                  onPress={() => handleLike(r.id)}
                >
                  <Ionicons 
                    name={r.isLiked ? "thumbs-up" : "thumbs-up-outline"} 
                    size={16} 
                    color={r.isLiked ? "#7a0c0c" : "#666"} 
                  />
                  <Text style={[styles.actionText, r.isLiked && {color: '#7a0c0c', fontWeight: 'bold'}]}>
                    {r.likes || 'Like'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.actionBtn} 
                  onPress={() => initReply(r.user, r.id)}
                >
                  <Ionicons name="arrow-undo-outline" size={16} color="#666" />
                  <Text style={styles.actionText}>Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          
        </ScrollView>

        {/* --- INPUT AREA --- */}
        <View style={styles.inputWrapper}>
          {/* If replying to someone, show a small banner above input */}
          {replyingTo && (
            <View style={styles.replyingBanner}>
              <Text style={styles.replyingBannerText}>Replying to {replyingTo.user}</Text>
              <TouchableOpacity onPress={() => setReplyingTo(null)}>
                <Ionicons name="close" size={20} color="#666" />
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput 
              ref={inputRef}
              placeholder={replyingTo ? `Reply to ${replyingTo.user}...` : "Write a helpful reply..."} 
              style={styles.input} 
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <Pressable 
              style={[styles.sendBtn, !inputText.trim() && { backgroundColor: '#ccc' }]} 
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={20} color="#fff" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 20, paddingBottom: 100 },
  
  // MAIN CARD
  card: { paddingBottom: 20, borderBottomWidth: 1, borderColor: '#eee', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  badge: { backgroundColor: '#f3f4f6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#333' },
  status: { fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  textSolved: { color: 'green' },
  textUnsolved: { color: '#b91c1c' },
  title: { fontSize: 22, fontWeight: '800', marginBottom: 12, color: '#111' },
  
  userRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFD700', justifyContent:'center', alignItems:'center', marginRight:10 },
  avatarText: { fontWeight:'bold', fontSize:16, color: '#000' },
  username: { fontSize: 13, fontWeight: '600' },
  date: { fontSize: 11, color: '#888' },
  
  desc: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 16 },
  solveBtn: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, borderWidth: 1, borderColor: '#333' },
  solveBtnActive: { borderColor: 'green', backgroundColor: '#e6fffa' },
  solveText: { fontSize: 12, fontWeight: '600' },

  // REPLIES
  sectionHeader: { fontSize: 18, fontWeight: '700', marginBottom: 15, color: '#111' },
  replyCard: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 12, marginBottom: 12 },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  replyUser: { fontSize: 14, fontWeight: '700', color: '#000' },
  replyTime: { fontSize: 12, color: '#999' },
  replyingToText: { fontSize: 12, color: '#7a0c0c', marginBottom: 4 },
  replyBody: { fontSize: 14, color: '#444', lineHeight: 20 },
  
  replyActions: { flexDirection: 'row', marginTop: 10, gap: 15 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionText: { fontSize: 12, color: '#666', fontWeight: '600' },

  // INPUT
  inputWrapper: { borderTopWidth: 1, borderColor: '#eee', backgroundColor: '#fff' },
  replyingBanner: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    backgroundColor: '#f0f0f0', paddingHorizontal: 16, paddingVertical: 8 
  },
  replyingBannerText: { fontSize: 12, color: '#666' },
  
  inputContainer: { flexDirection: 'row', padding: 12, alignItems: 'center' },
  input: { 
    flex: 1, backgroundColor: '#f0f0f0', borderRadius: 20, 
    paddingHorizontal: 16, paddingVertical: 10, maxHeight: 100, marginRight: 10, fontSize: 16 
  },
  sendBtn: { 
    backgroundColor: '#7a0c0c', borderRadius: 20, width: 44, height: 44, 
    justifyContent: 'center', alignItems: 'center' 
  }
});
