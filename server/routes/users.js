const express = require("express");
const router = express.Router();
const request = require("request");
const { CLIENT_ID, REDIRECT_URI } = require("../config/Oatuh");
const kakao_get_token_url = "https://kauth.kakao.com/oauth/token";
const { User } = require("../models/User");

const getKaKaoInfo = (at) => {
    const options = {
        uri: "https://kapi.kakao.com/v2/user/me",
        method: "POST",
        headers: {
            Authorization: `Bearer ${at}`,
        },
    };
    request.post(options, function (error, response, body) {
        let data = JSON.parse(body);
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
        User.findOne({ Oauth_id: data.id }, (err, user) => {
            if (!user)
                return res.json({
                    loginSuccess: false,
                    message: "Auth failed, email not found",
                });
            else {
                user.generateToken((err, user) => {
                    if (err) return res.status(400).send(err);
                    res.cookie("w_authExp", user.tokenExp);
                    res.cookie("w_auth", user.token).status(200).json({
                        loginSuccess: true,
                        userId: user._id,
                    });
                });
            }
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
        getKaKaoInfo(data.access_token);
    });
});

module.exports = router;
