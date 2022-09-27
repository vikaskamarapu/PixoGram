import { USERS } from './Users';

export const POSTS = [
    {
        imageUrl: 'https://m.economictimes.com/thumb/msid-88925973,width-1599,height-1066,resizemode-4,imgsize-68048/new-delhi-jan-15-ani-file-photo-cricketer-virat-kohli-steps-down-as-india-.jpg',
        user: USERS[0].user,
        likes: 79099002,
        caption: '❤️🎶🙈💕',
        profile_picture: USERS[0].image,
        comments: [
            {
                user: "vikas",
                comment: "nice",
            },
            {
                user: "lokesh",
                comment: "hii sir",
            },
            {
                user: "kuldeep",
                comment: "we love u",
            }
        ]
    },
    {
        imageUrl: 'https://www.filmibeat.com/ph-big/2022/06/samantha-akkineni_165535698810.jpg',
        user: USERS[6].user,
        likes: '7909',
        caption: '😍🤗🤩❤️💕',
        profile_picture: USERS[6].image,
        comments: [
            {
                user: "vikas",
                comment: "143",
            },
            {
                user: "lokesh",
                comment: "naa girlfriend",
            },
            {
                user: "kuldeep",
                comment: "lokesh ithai ra niku",
            }
        ]
    },
    {
        imageUrl: 'https://assets.vogue.in/photos/62da6017e6bdf7ecf0e333ce/2:3/w_2560%2Cc_limit/GettyImages-1388275948.jpg',
        user: USERS[5].user,
        likes: '7945509',
        caption: '🐍🐍🦐❤️💕',
        profile_picture: USERS[5].image,
        comments: [
            
        ]
    },
    {
        imageUrl: 'https://assets.teenvogue.com/photos/627fa868b9ed7234a0a65022/master/w_1600%2Cc_limit/1240647364',
        user: USERS[4].user,
        likes: '7902349',
        caption: "(●'◡'●)✌️💕",
        profile_picture: USERS[4].image,
        comments: [
            {
                user: "vikas",
                comment: "143",
            }
        ]
    }
]