import { View, StyleSheet, Platform, StatusBar, Image } from 'react-native'
import React from 'react'
import logo from '../assets/instagram.png'
import SignupForm from '../components/signupScreen/SignupForm'

const styles = StyleSheet.create({
    container: {
        backgroundColor: "black",
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        paddingTop: 50,
        paddingHorizontal: 12,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    }
})

const SignupScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={logo} style={{ height: 80, width: 80 }} />
            </View>
            <SignupForm navigation={navigation} />
        </View>
    )
}

export default SignupScreen