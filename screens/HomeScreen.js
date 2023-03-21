import { View, Text, StyleSheet, Platform, StatusBar, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/home/Header'
import Stories from '../components/home/Stories'
import Post from '../components/home/Post'
import { POSTS } from '../Data/Posts'
import BottomTabs from '../components/home/BottomTabs'
import { collection, getDocs, collectionGroup, query, where, limit, orderBy, onSnapshot, startAfter, getCountFromServer } from "firebase/firestore";
import { auth, db } from '../firebase'
import { FlatList } from 'react-native'

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
  const [lastDoc, setLastDoc] = useState();
  const [page, setPage] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [endOfPage, setEndOfPage] = useState(false);

  useEffect(() => {
    onSnapshot(query(collection(db, "users"), where("email", "==", auth.currentUser.email), limit(1)), (doc) => {
      const received = [];
      doc.forEach((doc) => {
        received.push(doc.data());
      });
      setCurrentUser(received);
      setEndOfPage(false);
    });
  }, []);

  useEffect(() => {
    if (posts.length === 0) {
      const q = query(collectionGroup(db, "posts"));
      getCountFromServer(q).then((value) => {
        setPostsCount(value.data().count);
      });
      onSnapshot(query(collectionGroup(db, "posts"), orderBy('createdAt', 'desc'), limit(2)), (doc) => {
        const received = [];
        setLastDoc(doc.docs[doc.docs.length - 1]);
        doc.forEach((doc) => {
          received.push({ id: doc.id, ...doc.data() });
        });
        setPosts(received)
        console.log(received);
      });
    }
    else {
      if (posts.length < postsCount) {
        onSnapshot(query(collectionGroup(db, "posts"), orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(2)), (doc) => {
          const received = [];
          setLastDoc(doc.docs[doc.docs.length - 1]);
          doc.forEach((doc) => {
            received.push({ id: doc.id, ...doc.data() });
          });
          setPosts([...posts, ...received])
          console.log(received);
        });
      }
    }
  }, [page]);

  const getMore = () => {
    if (!endOfPage)
      setPage(page + 2);
  }

  const Foot = () => (
    <ActivityIndicator size='large' color={"grey"} />
  )

  function isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
  }

  function isCloseToTop({ layoutMeasurement, contentOffset, contentSize }) {
    return contentOffset.y == 0;
  }

  return <View style={styles.container}>
    <Header navigation={navigation} />
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ marginBottom: 60 }}
      onScroll={({ nativeEvent }) => {
        if (isCloseToTop(nativeEvent)) {
          //do something
        }
        if (isCloseToBottom(nativeEvent)) {
          //do something
          getMore();
          if (posts.length >= postsCount) {
            setEndOfPage(true);
          }
        }
      }}
    >
      <Stories />
      {posts ?
        posts.map((post, index) => (
          <Post post={post} key={index} />
        )) :
        'Loading....'
      }
      {!endOfPage && <Foot />}
    </ScrollView>
    {/* <FlatList
      data={posts} 
      renderItem={Post}
      ListHeaderComponent={Stories}
      onEndReached={getMore}
      onEndReachedThreshold={0}
      keyExtractor={posts => (posts.id)}
      ListFooterComponent={Foot}
      style={{ marginBottom: 50 }}
    /> */}
    {currentUser ? <BottomTabs navigation={navigation} currentUser={currentUser} /> : "Loading...."}
  </View>
}
