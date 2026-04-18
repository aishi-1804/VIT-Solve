import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView, Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity, TouchableWithoutFeedback,
    View
} from 'react-native';
import { DoubtContext } from '../../context/DoubtContext';

// FULL COURSE DATABASE
const COURSES = [
  'CSE1001 - Problem Solving and Programming',
  'CSE2005 - Operating Systems',
  'CSE2011 - Data Structures and Algorithms',
  'MAT1001 - Calculus for Engineers',
  'MAT2001 - Linear Algebra',
  'PHY1001 - Engineering Physics',
  'CHY1001 - Engineering Chemistry',
  'ENG1001 - Effective English',
  'ECE1001 - Digital Logic Design'
];

export default function ComposeScreen() {
  const { addDoubt, doubts, currentUser } = useContext(DoubtContext);

  // Form State
  const [query, setQuery] = useState(''); // What user types
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  // Filter Logic
  const filteredCourses = COURSES.filter(course => 
    course.toLowerCase().includes(query.toLowerCase())
  );

  // My History
  const myDoubts = doubts.filter(d => d.author === currentUser.email);

  const handleSelectCourse = (course) => {
    setQuery(course); // Fill input with full name
    setIsDropdownOpen(false);
    Keyboard.dismiss();
  };

  const handlePost = () => {
    // VALIDATION: Ensure the typed course actually exists in our list
    const isValidCourse = COURSES.includes(query);

    if (!isValidCourse) {
      Alert.alert('Invalid Course', 'Please select a valid course from the list.');
      return;
    }

    if (!title || !desc) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      course: query, // Clean up name for the card
      title,
      description: desc,
      author: currentUser.email,
      date: new Date().toISOString(),
      isSolved: false,
    };

    addDoubt(newPost);
    
    // Reset Form
    setQuery('');
    setTitle('');
    setDesc('');
    
    Alert.alert('Success', 'Doubt Posted!');
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      Keyboard.dismiss();
      setIsDropdownOpen(false);
    }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1, backgroundColor: '#fff' }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          
          <Text style={styles.header}>Post a New Doubt</Text>
          
          {/* --- SEARCHABLE DROPDOWN --- */}
          <Text style={styles.label}>Select Course</Text>
          <View style={styles.dropdownContainer}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color="#666" style={{marginRight: 8}} />
              <TextInput
                placeholder="Type to search (e.g. Data...)"
                value={query}
                onChangeText={(text) => {
                  setQuery(text);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                style={styles.searchInput}
              />
              {query.length > 0 && (
                <Pressable onPress={() => { setQuery(''); setIsDropdownOpen(true); }}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </Pressable>
              )}
            </View>

            {/* DROPDOWN LIST (Conditional Render) */}
            {isDropdownOpen && (
              <View style={styles.dropdownList}>
                {filteredCourses.length === 0 ? (
                  <View style={styles.dropdownItem}>
                    <Text style={{color: '#999'}}>No course found.</Text>
                  </View>
                ) : (
                  filteredCourses.slice(0, 5).map((item) => ( // Limit to 5 results
                    <TouchableOpacity 
                      key={item} 
                      style={styles.dropdownItem}
                      onPress={() => handleSelectCourse(item)}
                    >
                      <Text style={styles.dropdownText}>{item}</Text>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
          </View>

          {/* TITLE INPUT */}
          <Text style={styles.label}>Title</Text>
          <TextInput 
            style={styles.input} 
            placeholder="e.g. Logic Gates" 
            value={title}
            onChangeText={setTitle}
          />

          {/* DESCRIPTION INPUT */}
          <Text style={styles.label}>Description</Text>
          <TextInput 
            style={[styles.input, styles.textArea]} 
            placeholder="Describe your issue..." 
            multiline 
            value={desc}
            onChangeText={setDesc}
          />

          <Pressable style={styles.postBtn} onPress={handlePost}>
            <Text style={styles.postBtnText}>Post Doubt</Text>
          </Pressable>

          <View style={styles.divider} />

          {/* HISTORY SECTION */}
          <Text style={styles.header}>My Past Doubts</Text>
          
          {myDoubts.length === 0 ? (
            <Text style={{color:'#999', fontStyle:'italic'}}>You haven't posted anything yet.</Text>
          ) : (
            myDoubts.map((item) => (
              <Pressable 
                key={item.id} 
                style={styles.historyCard}
                onPress={() => router.push(`/post/${item.id}`)}
              >
                <View style={{flex: 1}}>
                  <Text style={styles.historyTitle}>{item.title}</Text>
                  <Text style={styles.historyMeta} numberOfLines={1}>
                    {item.course} • {new Date(item.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.statusSmall, item.isSolved ? {color:'green'} : {color:'red'}]}>
                  {item.isSolved ? 'Solved' : 'Unsolved'}
                </Text>
              </Pressable>
            ))
          )}
          <View style={{height: 40}}/>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },
  header: { fontSize: 22, fontWeight: '700', marginBottom: 16, color: '#111' },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, textTransform: 'uppercase' },

  // DROPDOWN STYLES
  dropdownContainer: { marginBottom: 16, zIndex: 10 }, // zIndex helps it float on top if needed
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width:0, height:2},
    marginTop: -4, // tuck it right under the input
  },
  dropdownItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  dropdownText: { fontSize: 14, color: '#333' },

  // GENERIC INPUTS
  input: { backgroundColor: '#f0f0f0', borderRadius: 12, padding: 14, fontSize: 16, marginBottom: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  
  postBtn: { backgroundColor: '#7a0c0c', padding: 16, borderRadius: 12, alignItems: 'center' },
  postBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 30 },
  
  historyCard: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 16, backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee', borderRadius: 12, marginBottom: 10
  },
  historyTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 4 },
  historyMeta: { fontSize: 12, color: '#888' },
  statusSmall: { fontSize: 12, fontWeight: '700', marginLeft: 10 }
});
