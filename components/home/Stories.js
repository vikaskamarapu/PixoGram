import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { USERS } from '../../Data/Users.js';
import { LinearGradient } from 'expo-linear-gradient';
import { Divider } from 'react-native-elements';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.js';



const styles = StyleSheet.create({
    storyBorder: {
        width: 75,
        height: 75,
        borderRadius: 50,
        marginHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
    },
    // innerBorder: {
    //     width: 70,
    //     height: 70,
    //     borderRadius: 50,
    //     borderWidth: 3,
    //     alignItems: "center",
    // },
    story: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 3,
        borderColor:'black',
    },
})

export default function Stories() {
    const [users, setUsers] = useState([]);
    async function getUsers() {
        const querySnapshot = await getDocs(collection(db, "users"));
        setUsers(querySnapshot.docs.map(doc => doc.data()));
    }

    useEffect(() => {
        getUsers();
    }, [])
    console.log(users)
    return (
        <View style={{ marginTop: 16, }}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {users?.map((story, index) => (
                    <View key={index}>
                        <LinearGradient colors={['#CA1D7E', '#E35157', '#F2703F']} style={styles.storyBorder}>
                            <View key={index} style={styles.innerBorder}>
                                <Image source={{ uri: story.profile_picture }} style={styles.story} />
                            </View>
                        </LinearGradient>
                        <Text style={{
                            color: 'white',
                            textAlign: 'center',
                        }} >{story.username.length > 11 ? story.username.slice(0, 10).toLowerCase() + "..." : story.username.toLowerCase()}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}