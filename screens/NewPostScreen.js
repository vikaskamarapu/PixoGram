import { View, StyleSheet, Platform, StatusBar } from 'react-native'
import React from 'react'
import AddNewPost from '../components/newPost/AddNewPost'

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
})

const NewPostScreen = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <AddNewPost navigation={navigation} image={route.params.paramKey} />
    </View>
  )
}

export default NewPostScreen