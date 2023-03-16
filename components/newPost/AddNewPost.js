import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { Divider } from "react-native-elements";
import { Switch } from "react-native";
import { collection, query, where, getDocs, limit, setDoc, Timestamp, doc } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';


const AddNewPost = ({ navigation, image }) => (
  <View style={styles.container}>
    <FormikPostUploader image={image} navigation={navigation} />
  </View>
);
const Header = ({ navigation, handleSubmit }) => {
  const [check, setCheck] = useState(true);
  return (
    <View style={styles.headerContainer}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPressOut={() => { navigation.goBack() }} >
          <Image
            source={{ uri: "https://img.icons8.com/ios/50/ffffff/left.png" }}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>New Post</Text>
      </View>
      {check ?
        <TouchableOpacity onPressOut={() => {
          setCheck(false)
          handleSubmit()
        }}>
          <Image source={{ uri: "https://img.icons8.com/material/144/2187cd/checkmark--v1.png" }} style={{ width: 35, height: 35, marginTop: 5 }} />
        </TouchableOpacity> : <ActivityIndicator size="large" color="#00ff00" />}
    </View>
  );
}

const uploadPostSchema = yup.object().shape({
  caption: yup.string().max(2200, "caption has reached the character limit."),
});




const FormikPostUploader = ({ image, navigation }) => {
  const [switchOn, setSwitchOn] = useState(false);
  const [facebookOn, setFacebookOn] = useState(false);
  const [twitterOn, setTwitterOn] = useState(false);
  const [tumblrOn, setTumblrOn] = useState(false);
  const [currentLogInUser, setCurrentLogInUser] = useState(null);

  const addPostToFire = async (url, caption) => {
    const postId = Timestamp.now() + '';
    const postsRef = doc(db, `users/${auth.currentUser.email}/posts`, postId);
    await setDoc(postsRef, {
      imageUrl: url,
      user: currentLogInUser.username,
      caption: caption,
      owner_uid: auth.currentUser.uid,
      owner_email: auth.currentUser.email,
      createdAt: Timestamp.now(),
      likesByUsers: [],
      profile_picture: currentLogInUser.profile_picture,
      comments: [],
    }).then(() => {
      navigation.push('HomeScreen');
    }).catch((error) => console.log(error))
  }

  useEffect(() => {
    async function getUser() {
      const q = query(collection(db, "users"), where("owner_uid", "==", auth.currentUser.uid), limit(1));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setCurrentLogInUser({
          username: doc.data().username,
          profile_picture: doc.data().profile_picture,
        })
      })
    }
    getUser();
  }, [])

  console.log(currentLogInUser)

  const compressImage = async (uri, format = SaveFormat.JPEG) => { // SaveFormat.PNG
    const result = await manipulateAsync(
      uri,
      [],
      { compress: 0.5, format }
    );

    return { name: `${Date.now()}.${format}`, type: `image/${format}`, ...result };
    // return: { name, type, width, height, uri }
  };

  return (
    <Formik
      initialValues={{ caption: "" }}
      onSubmit={async (values) => {
        const photo = compressImage(image);
        const storageRef = ref(storage, "posts/" + (await photo).name);
        const res = await fetch((await photo).uri);
        const blob = await res.blob();
        await uploadBytes(storageRef, blob).then((snapshot) => {
          console.log("Image Uploaded....");
        })
        await getDownloadURL(storageRef)
          .then((url) => {
            console.log(url)
            addPostToFire(url, values.caption)
          })
          .catch((error) => {
            console.log(error)
          });

      }}
      validationSchema={uploadPostSchema}
    >
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        values,
        errors,
        isValid,
      }) => (
        <>
          <Header navigation={navigation} handleSubmit={handleSubmit} />
          <View style={{ margin: 12, marginTop: 21, flexDirection: "row" }}>
            <Image
              source={{ uri: image }}
              style={{ width: 55, height: 55 }}
            />

            <TextInput
              style={{ color: "#c7c7c7", fontSize: 15, marginLeft: 13, }}
              placeholder="Write a caption..."
              placeholderTextColor={"grey"}
              multiline={true}
              onChangeText={handleChange("caption")}
              onBlur={handleBlur("caption")}
              value={values.caption}
            />
          </View>
          <View
            style={{ flexDirection: "column", justifyContent: "space-between" }}
          >
            <Divider width={1} orientation="vertical" />
            <Text style={[styles.commonTag]}>Tag people</Text>
            <Divider width={1} orientation="vertical" />
            <Text style={[styles.commonTag]}>Add location</Text>
            <Divider width={1} orientation="vertical" />
            <Text style={[styles.commonTag]}>Add event</Text>
            <Divider width={1} orientation="vertical" />
            <Text style={[styles.commonTag]}>Add music</Text>
            <Divider width={1} orientation="vertical" />
            <Text style={[styles.commonTag]}>Some music...</Text>
            <Divider width={1} orientation="vertical" />
            <View
              style={[
                styles.botttomContainer,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 8,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  marginLeft: 7,
                }}
              >
                <Text style={styles.commonText}>Boost post</Text>
                {switchOn ? (
                  <Text style={{ color: "grey" }}>
                    We'll set up your ad settings next
                  </Text>
                ) : (
                  <></>
                )}
              </View>
              <Switch
                value={switchOn}
                trackColor={{ false: "grey", true: "#1C4D78" }}
                thumbColor={switchOn ? "#3987F1" : "white"}
                onValueChange={() => {
                  setSwitchOn(!switchOn);
                }}
              />
            </View>
          </View>
          <Divider width={1} orientation="vertical" />
          <View style={{ flexDirection: "column", padding: 20 }}>
            <Text style={[styles.commonText, { marginBottom: 7 }]}>
              Also post to
            </Text>
            <View style={styles.botttomContainer}>
              <View style={{ flexDirection: "row" }}>
                <Image
                  source={{ uri: currentLogInUser?.profile_picture }}
                  style={{ borderRadius: 50, width: 45, height: 45 }}
                />
                <View style={{ marginLeft: 15 }}>
                  <Text style={styles.commonText}>Facebook</Text>
                  <Text style={{ color: "grey" }}>{currentLogInUser?.username}</Text>
                </View>
              </View>
              <Switch
                value={facebookOn}
                trackColor={{ false: "grey", true: "#1C4D78" }}
                thumbColor={facebookOn ? "#3987F1" : "white"}
                onValueChange={() => {
                  setFacebookOn(!facebookOn);
                }}
              />
            </View>
            <View style={styles.botttomContainer}>
              <Text style={{ color: "white", fontSize: 16 }}>Twitter</Text>
              <Switch
                value={twitterOn}
                trackColor={{ false: "grey", true: "#1C4D78" }}
                thumbColor={twitterOn ? "#3987F1" : "white"}
                onValueChange={() => {
                  setTwitterOn(!twitterOn);
                }}
              />
            </View>
            <View style={styles.botttomContainer}>
              <Text style={styles.commonText}>Tumblr</Text>
              <Switch
                value={tumblrOn}
                trackColor={{ false: "grey", true: "#1C4D78" }}
                thumbColor={tumblrOn ? "#3987F1" : "white"}
                onValueChange={() => {
                  setTumblrOn(!tumblrOn);
                }}
              />
            </View>
            <View style={[styles.botttomContainer, { marginTop: 10 }]}>
              <Text style={[styles.commonText, { marginTop: 5 }]}>
                Advanced settings
              </Text>
              <Image
                source={{
                  uri: "https://img.icons8.com/ios-glyphs/30/ffffff/chevron-right.png",
                }}
                style={{ width: 15, height: 15, marginRight: 10 }}
              />
            </View>
          </View>
        </>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",  
  },
  headerText: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
    marginLeft: 25.5
  },
  botttomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commonText: {
    color: "white",
    fontSize: 16,
  },
  commonTag: {
    color: "white",
    fontSize: 16,
    padding: 16,
  },
});

export default AddNewPost;
