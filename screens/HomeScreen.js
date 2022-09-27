import { View, Text, StyleSheet, Platform, StatusBar, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/home/Header'
import Stories from '../components/home/Stories'
import Post from '../components/home/Post'
import { POSTS } from '../Data/Posts'
import { Divider } from 'react-native-elements'
import BottomTabs from '../components/home/BottomTabs'
import { collection, getDocs, collectionGroup, query, where, limit, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from '../firebase'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
})

export default function HomeScreen({ navigation }) {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);


  useEffect(() => {
    onSnapshot(query(collectionGroup(db, "posts"), orderBy('createdAt', 'desc')), (doc) => {
      const received = [];
      doc.forEach((doc) => {
        received.push({ id: doc.id, ...doc.data() });
      });
      setPosts(received)
    });
    onSnapshot(query(collection(db, "users"), where("email", "==", auth.currentUser.email), limit(1)), (doc) => {
      const received = [];
      doc.forEach((doc) => {
        received.push(doc.data());
      });
      setCurrentUser(received)
    });
  }, [])


  return <View style={styles.container}>
    <Header navigation={navigation} />
    <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 45 }}>
      <Stories />
      <Divider width={1} orientation='vertical' style={{ marginVertical: 10 }} />
      {posts ?
        posts.map((post, index) => (
          <Post post={post} key={index} />
        )) :
        'Loading....'
      }
    </ScrollView>
    {currentUser ? <BottomTabs navigation={navigation} currentUser={currentUser} /> : "Loading...."}
  </View>
}
