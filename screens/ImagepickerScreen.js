import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native';
import { Image } from 'react-native';

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        paddingHorizontal: 10,
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
    buttonContainer: {
        width: 400,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom:20,
    },
    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

const Header = ({ navigation, image }) => (
    <View style={styles.headerContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPressOut={() => { navigation.goBack() }}>
                <Image
                    source={{ uri: "https://img.icons8.com/ios/50/ffffff/left.png" }}
                    style={{ width: 40, height: 40 }}
                />
            </TouchableOpacity>
            <Text style={styles.headerText}>Pick Image</Text>
        </View>
        {image && <TouchableOpacity onPressOut={() => {
            navigation.push('NewPostScreen',
                { paramKey: image })
        }}>
            <Image source={{ uri: "https://img.icons8.com/ios/50/3498DB/right--v1.png" }} style={{ width: 35, height: 35, marginTop: 5 }} />
        </TouchableOpacity>}
    </View>
);

const Body = ({ pickImage, image, openCamera }) => (
    <View style={styles.body}>
        <View style={styles.buttonContainer}>
            <Button title="Select An Image" onPress={pickImage} />
            <Button title="Open Camera" onPress={openCamera} style={{ marginTop: 30 }} />
        </View>
        {image ? <Image source={{ uri: image }} style={{ width: 300, height: 400 }} /> : <Image source={{ uri: "https://img.freepik.com/free-psd/social-media-instagram-post-template_47618-73.jpg?w=2000" }} style={{ width: 300, height: 400 }} />}
    </View>
);


const ImagepickerScreen = ({ navigation }) => {
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 5],
            quality: 1,
        });

        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            console.log(result.uri)
        }
    };
    const openCamera = async () => {
        // Ask the user for the permission to access the camera
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("You've refused to allow this app to access your camera!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        // Explore the result
        console.log(result);

        if (!result.cancelled) {
            setImage(result.uri);
            console.log(result.uri);
        }
    }

    return (
        <View style={styles.container}>
            <Header navigation={navigation} image={image} />
            <Body pickImage={pickImage} openCamera={openCamera} image={image} />
        </View>
    )
}

export default ImagepickerScreen