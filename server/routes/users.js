const express = require("express");
const router = express.Router();
const axios = require("axios");
const { CLIENT_ID, REDIRECT_URI } = require("../config/Oatuh");
const kakao_get_token_url = "https://kauth.kakao.com/oauth/token";

router.post("/kakaoSignUp", (req, res) => {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", CLIENT_ID);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("code", req.body.code);
    axios.post(kakao_get_token_url, params).then((response) => {
        res.send(response.data);
    });
});

module.exports = router;
