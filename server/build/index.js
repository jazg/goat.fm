"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const request_1 = __importDefault(require("request"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_querystring_1 = __importDefault(require("node:querystring"));
const app = (0, express_1.default)();
const port = 3000;
const clientID = "876c87b4c82f4872aa0a4cfc3bca89e8";
const clientSecret = process.env.SPOTIFY_SECRET;
const redirectURI = `http://localhost:5173/callback`;
const stateKey = "spotify_auth_state";
app.use((0, cors_1.default)()).use((0, cookie_parser_1.default)());
app.get("/login", (req, res) => {
    const state = Math.random().toString(36); // Generate random string to prevent cross-site request forgery.
    res.cookie(stateKey, state);
    res.redirect("https://accounts.spotify.com/authorize?" +
        node_querystring_1.default.stringify({
            response_type: "code",
            client_id: clientID,
            redirect_uri: redirectURI,
            state,
        }));
});
app.get("/callback", (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    if (state === null || state !== storedState) {
        res.redirect("/#" +
            node_querystring_1.default.stringify({
                error: "state_mismatch",
            }));
    }
    else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: "https://accounts.spotify.com/api/token",
            form: {
                code: code,
                redirect_uri: redirectURI,
                grant_type: "authorization_code",
            },
            headers: {
                Authorization: "Basic " +
                    Buffer.from(clientID + ":" + clientSecret).toString("base64"),
            },
            json: true,
        };
        request_1.default.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {
                // Pass the token to the browser to make requests from there.
                res.redirect("/#" +
                    node_querystring_1.default.stringify({
                        access_token: body.access_token,
                        expires_in: body.expires_in,
                        refresh_token: body.refresh_token,
                    }));
            }
            else {
                res.redirect("/#" +
                    node_querystring_1.default.stringify({
                        error: "invalid_token",
                    }));
            }
        });
    }
});
app.get("/refresh_token", (req, res) => {
    const refreshToken = req.query.refresh_token;
    const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
            Authorization: "Basic " +
                Buffer.from(clientID + ":" + clientSecret).toString("base64"),
        },
        form: {
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        },
        json: true,
    };
    request_1.default.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("sending", body.access_token, body.expires_in);
            res.send({
                access_token: body.access_token,
                expires_in: body.expires_in,
            });
        }
    });
});
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});
//# sourceMappingURL=index.js.map