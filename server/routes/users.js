const express = require("express");
const router = express.Router();
const request = require("request");
const { CLIENT_ID, REDIRECT_URI } = require("../config/Oatuh");
const kakao_get_token_url = "https://kauth.kakao.com/oauth/token";
const { User } = require("../models/User");

const getKaKaoInfo = (at, res) => {
    const options = {
        uri: "https://kapi.kakao.com/v2/user/me",
        method: "POST",
        headers: {
            Authorization: `Bearer ${at}`,
        },
    };
    request.post(options, function (error, response, body) {
        const KAKAO_API_DATA = JSON.parse(body);
        // {
        //        id: 1919811222,
        //        connected_at: '2021-09-22T05:33:36Z',
        //        properties: {
        //          nickname: '김명환',
        //          profile_image: 'http://k.kakaocdn.net/dn/hN9Nx/btrfxPiDde2/RBWhsP83gU4vTJ5doE7Ukk/img_640x640.jpg',
        //          thumbnail_image: 'http://k.kakaocdn.net/dn/hN9Nx/btrfxPiDde2/RBWhsP83gU4vTJ5doE7Ukk/img_110x110.jpg'
        //        },
        //        kakao_account: {
        //          profile_nickname_needs_agreement: false,
        //          profile_image_needs_agreement: false,
        //          profile: {
        //            nickname: '김명환',
        //            thumbnail_image_url: 'http://k.kakaocdn.net/dn/hN9Nx/btrfxPiDde2/RBWhsP83gU4vTJ5doE7Ukk/img_110x110.jpg',
        //            profile_image_url: 'http://k.kakaocdn.net/dn/hN9Nx/btrfxPiDde2/RBWhsP83gU4vTJ5doE7Ukk/img_640x640.jpg',
        //            is_default_image: false
        //          }
        //        }
        //      }
        console.log(KAKAO_API_DATA);
        User.findOne({ Oauth_id: KAKAO_API_DATA.id }, async (err, user) => {
            if (!user) {
                console.log("없어서 만듬");
                // 디비 생성
                user = await new User({
                    name: KAKAO_API_DATA.properties.nickname,
                    Oauth_id: KAKAO_API_DATA.id,
                    thumbnail_image: KAKAO_API_DATA.properties.thumbnail_image,
                }).save();
            }

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res.cookie("w_auth", user.token).status(200).json({
                    loginSuccess: true,
                    user: user,
                });
            });
        });
    });
};

router.post("/kakaoSignUp", (req, res) => {
    const options = {
        uri: kakao_get_token_url,
        method: "POST",
        form: {
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            code: req.body.code,
        },
    };
    request.post(options, function (error, response, body) {
        let data = JSON.parse(body);
        getKaKaoInfo(data.access_token, res);
    });
});

module.exports = router;
