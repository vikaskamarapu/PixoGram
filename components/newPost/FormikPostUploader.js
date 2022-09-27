import { View, Text, TextInput, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { Formik } from "formik";
import { Divider } from "react-native-elements";
import { Switch } from "react-native";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { ref, uploadBytes } from "firebase/storage";

// const currentLogInUser.profile_picture =
//   "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_FMjpg_UX1000_.jpg";

const uploadPostSchema = yup.object().shape({
  imageUrl: yup.string().url().required("A url is required"),
  caption: yup.string().max(2200, "caption has reached the character limit."),
});


const FormikPostUploader = ({ image }) => {
  const [switchOn, setSwitchOn] = useState(false);
  const [facebookOn, setFacebookOn] = useState(false);
  const [twitterOn, setTwitterOn] = useState(false);
  const [tumblrOn, setTumblrOn] = useState(false);
  const [currentLogInUser, setCurrentLogInUser] = useState(null);

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

  return (
    <Formik
      initialValues={{ caption: "" }}
      onSubmit={(values) => {
        const storageRef = ref(storage, "posts");
        uploadBytes(storageRef, image).then((snapshot) => {
          console.log('Uploaded a blob or file!');
        });
        console.log(values)
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
          <View style={{ margin: 12, marginTop: 21, flexDirection: "row" }}>
            <Image
              source={{ uri: image }}
              style={{ width: 55, height: 55 }}
            />

            <TextInput
              style={{ color: "#c7c7c7", fontSize: 15, marginLeft: 13 }}
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

export default FormikPostUploader;
