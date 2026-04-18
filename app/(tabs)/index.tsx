import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Keyboard,
  Pressable, ScrollView, StyleSheet, Text, TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { DoubtContext } from '../../context/DoubtContext';

// --- DATA MAPPING: Which Course belongs to Which Category? ---
const COURSE_DB = [
  { name: 'CSE1001 - Problem Solving and Programming', category: 'CS' },
  { name: 'CSE2005 - Operating Systems', category: 'CS' },
  { name: 'CSE2011 - Data Structures and Algorithms', category: 'CS' },
  { name: 'MAT1001 - Calculus for Engineers', category: 'Math' },
  { name: 'MAT2001 - Linear Algebra', category: 'Math' },
  { name: 'PHY1001 - Engineering Physics', category: 'Physics' },
  { name: 'CHY1001 - Engineering Chemistry', category: 'Chemistry' },
  { name: 'ENG1001 - Effective English', category: 'English' },
  { name: 'ECE1001 - Digital Logic Design', category: 'Electronics' }
];

const CATEGORIES = ['All', 'Math', 'CS', 'Physics', 'Chemistry', 'Electronics'];

export default function HomeScreen() {
  const { doubts, currentUser } = useContext(DoubtContext);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 1. AUTOCOMPLETE: Filter specific COURSE NAMES for the dropdown
  const suggestedCourses = COURSE_DB.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0
  );

  // 2. MAIN FEED FILTER LOGIC
  const filteredDoubts = doubts.filter((doubt) => {
    
    // Find which category this doubt's course belongs to
    const courseData = COURSE_DB.find(c => c.name === doubt.course);
    const courseCategory = courseData ? courseData.category : 'Other';

    // A. Category Filter: Does the course's category match the selected tab?
    const matchesCategory = selectedCategory === 'All' || courseCategory === selectedCategory;

    // B. Search Filter: Does the Title OR Course Name match the text?
    const matchesSearch = doubt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doubt.course.toLowerCase().includes(searchQuery.toLowerCase());
                          
    return matchesCategory && matchesSearch;
  });

  const handleSelectCourse = (courseName) => {
    setSearchQuery(courseName); 
    setIsDropdownOpen(false);   
    Keyboard.dismiss();         
  };

  return (
    <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); setIsDropdownOpen(false); }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {currentUser.name}!</Text>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#bbb" style={{marginRight: 10}} />
            <TextInput
              placeholder="Search specific course..."
              placeholderTextColor="#bbb"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => { setSearchQuery(''); setIsDropdownOpen(false); }}>
                <Ionicons name="close-circle" size={18} color="#ccc" />
              </TouchableOpacity>
            )}
          </View>

          {/* DROPDOWN */}
          {isDropdownOpen && suggestedCourses.length > 0 && (
            <View style={styles.dropdownList}>
              {suggestedCourses.slice(0, 4).map((item) => (
                <TouchableOpacity 
                  key={item.name} 
                  style={styles.dropdownItem}
                  onPress={() => handleSelectCourse(item.name)}
                >
                  <Text style={styles.dropdownText} numberOfLines={1}>{item.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          
          {/* CATEGORY TABS */}
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[styles.catChip, selectedCategory === cat && styles.catChipActive]}
              >
                <Text style={[styles.catText, selectedCategory === cat && styles.catTextActive]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* RESULTS FEED */}
          <Text style={styles.sectionTitle}>
            {selectedCategory === 'All' ? 'Recent Doubts' : `${selectedCategory} Doubts`}
          </Text>

          <View style={styles.feed}>
            {filteredDoubts.length === 0 ? (
              <Text style={styles.emptyText}>No doubts found.</Text>
            ) : (
              filteredDoubts.map((item) => (
                <Pressable
                  key={item.id}
                  style={styles.card}
                  onPress={() => router.push(`/post/${item.id}`)}
                >
                  <View style={styles.cardHeader}>
                    {/* DISPLAY THE SPECIFIC COURSE NAME */}
                    <Text style={styles.courseTag} numberOfLines={1}>{item.course}</Text>
                    <Text style={[styles.status, item.isSolved ? styles.solved : styles.unsolved]}>
                      {item.isSolved ? '✔ Solved' : 'Unsolved'}
                    </Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta} numberOfLines={2}>{item.description}</Text>
                  <View style={styles.cardFooter}>
                    <Text style={styles.author}>{item.author.split('@')[0]}</Text>
                    <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                  </View>
                </Pressable>
              ))
            )}
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 60, paddingHorizontal: 16 },
  header: { marginBottom: 10 },
  greeting: { fontSize: 28, fontWeight: '700', color: '#000' },
  searchContainer: { zIndex: 10, marginBottom: 20, position: 'relative' },
  searchBox: { 
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width:0, height:2}, elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  dropdownList: {
    position: 'absolute', top: 50, left: 0, right: 0,
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#eee',
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, paddingVertical: 5,
  },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#f9f9f9' },
  dropdownText: { fontSize: 14, color: '#333' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, color: '#333' },
  catScroll: { flexDirection: 'row', marginBottom: 20, maxHeight: 50 },
  catChip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 10 },
  catChipActive: { backgroundColor: '#000' },
  catText: { fontWeight: '500', color: '#555' },
  catTextActive: { color: '#fff' },
  feed: { gap: 16 },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  card: { backgroundColor: '#F3F4F6', padding: 16, borderRadius: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, gap: 10 },
  courseTag: { flex: 1, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', color: '#666' },
  status: { fontSize: 12, fontWeight: '700' },
  solved: { color: 'green' },
  unsolved: { color: '#b91c1c' },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  cardMeta: { fontSize: 14, color: '#555', marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  author: { fontSize: 12, color: '#888' },
  date: { fontSize: 12, color: '#888' },
});
