import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { auth, db } from '../../firebase'
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const styles = StyleSheet.create({
    storyBorder: {
        width: 37,
        height: 37,
        borderRadius: 50,
        marginHorizontal: 7,
        alignItems: "center",
        justifyContent: "center",
    },

    story: {
        width: 35,
        height: 35,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: 'black',
    },

    icon: {
        width: 15,
        height: 15,
        marginRight: 7,
        resizeMode: "contain",
    },

    footerIcon: {
        width: 30,
        height: 30,
        marginHorizontal: 10,
    },

    saveIcon: {
        width: 28,
        height: 28,
        marginHorizontal: 10,
    }
})

const Post = ({ item }) => {

    const handleLike = async (item) => {
        const currentLikesStatus = !item.likesByUsers.includes(auth.currentUser.email)
        const postRef = doc(db, `users/${item.owner_email}/posts/${item.id}`);
        try {
            currentLikesStatus ?
                await updateDoc(postRef, {
                    likesByUsers: arrayUnion(auth.currentUser.email)
                }) :
                await updateDoc(postRef, {
                    likesByUsers: arrayRemove(auth.currentUser.email)
                })
        }
        catch (error) {
            console.log(error.message);
        }
    }


    return (
        <View style={{ marginBottom: 10 }}>
            <PostHeader item={item} />
            <PostImage item={item} handleLike={handleLike} />
            <PostFooter item={item} handleLike={handleLike} />
            <Likes item={item} />
            <Caption item={item} />
            <CommentsSection item={item} />
            <Comments item={item} />
        </View>
    );
}

const PostHeader = ({ item }) => {
    return <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 6,
        marginBottom: 5,
        alignItems: "center",
    }}>
        <View style={{ flexDirection: "row" }}>
            <LinearGradient colors={['#CA1D7E', '#E35157', '#F2703F']} style={styles.storyBorder}>
                <View style={styles.innerBorder}>
                    <Image source={{ uri: item.profile_picture }} style={styles.story} />
                </View>
            </LinearGradient>
            <Text style={{
                color: 'white',
                alignSelf: 'center',
                marginLeft: 4,
                fontWeight: '600',
                fontSize: 15,
            }}>{item.user}</Text>
        </View>
        <TouchableOpacity>
            <Image style={styles.icon} source={{ uri: "https://img.icons8.com/tiny-glyph/16/ffffff/experimental-menu-2-tiny-glyph.png" }} />
        </TouchableOpacity>
    </View>
}

const PostImage = ({ item, handleLike }) => {
    const win = Dimensions.get('window');
    return (
        <TouchableOpacity onPress={() => handleLike(item)} activeOpacity={1} >
            <View style={{
                width: win.width,
                height: win.width+150,
            }} >
                <Image source={{ uri: item.imageUrl }} style={{ height: '100%', resizeMode: 'cover' }} />
            </View>
        </TouchableOpacity>
    )  
}

const PostFooter = ({ item, handleLike }) => (
    <View style={{
        flexDirection: 'row',
        marginVertical: 8,
        justifyContent: 'space-between',
    }}>
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPressIn={() => { handleLike(item) }}>
                <Image source={!item.likesByUsers.includes(auth.currentUser.email) ? require('../../assets/images/heart.png') : require('../../assets/images/redHeart.png')} style={styles.footerIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source={require('../../assets/images/chat.png')} style={styles.footerIcon} />
            </TouchableOpacity>
            <TouchableOpacity>
                <Image source={require('../../assets/images/send.png')} style={styles.footerIcon} />
            </TouchableOpacity>
        </View>
        <TouchableOpacity>
            <Image source={require('../../assets/images/save.png')} style={styles.saveIcon} />
        </TouchableOpacity>
    </View>
)

const Likes = ({ item }) => (
    <View style={{ flexDirection: 'row', }}>
        <Text style={{ color: 'white', fontWeight: '600', marginLeft: 10 }}>{item.likesByUsers.length.toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")} likes</Text>
    </View>
)

const Caption = ({ item }) => (
    <View>
        <Text style={{ color: 'white', marginLeft: 10, marginTop: 4, }}>
            <Text style={{ fontWeight: '700' }}>{item.user}</Text>
            <Text> {item.caption}</Text>
        </Text>
    </View>
)

const CommentsSection = ({ item }) => (
    <View style={{ marginLeft: 10, marginTop: 5 }}>
        <TouchableOpacity>
            {!!item.comments.length && (
                <Text style={{ color: 'gray', }}>
                    View
                    {item.comments.length > 1 ? ' all ' : ' '}
                    {item.comments.length}
                    {item.comments.length > 1 ? ' comments' : ' comment'}
                </Text>
            )}
        </TouchableOpacity>
    </View>
)

const Comments = ({ item }) => (
    <>
        {item.comments.map((comment, index) => (
            <View key={index}>
                <Text style={{ color: 'white', marginLeft: 10, marginTop: 4, }} >
                    <Text style={{ fontWeight: '700' }}>{comment.user}</Text>
                    <Text> {comment.comment}</Text>
                </Text>
            </View>
        ))}
    </>
)

export default Post