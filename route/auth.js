const express = require("express");
const router = express.Router();
const axios = require("axios");
const service = require("../service/auth.js");
const randomstring = require("randomstring");

router.get("/random-string", (req, res, next) => {
  var rString = randomstring.generate(32);
  res.json({ randomString: rString });
});

router.post("/login", async (req, res, next) => {
  try {
    let { email, password } = req.body;
    let response = await service.loginUser(email, password);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    let response = await service.signupUser(req.body);
    res.send(response);
  } catch (error) {
    next(error);
  }
});
// let response=await service.verifyEmail(req.query.token)

router.get("/verify-email", async (req, res, next) => {
  try {
    let token = req.query.token ? req.query.token : "";
    let response = await service.verifyEmail(token);
    res.send(
      `<head>
        <title>Verification Successfull</title>
        </head>
        <center>
        <h3>Your account registered with mail id ${response.user.email} has been verified. You can now start using ZFlix app</h3>
        </center>
      `
    );
  } catch (error) {
    res.send(
      `<head><title>Verification Failed</title></head><center><h3>${error.message}</h3></center>`
    );
  }
});

router.get("/search/:name", async (req, res, next) => {
  try {
    let response = await service.searchUser(req.params.name);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.get("/user-details/:token", async (req, res, next) => {
  try {
    let response = await service.getUser(req.params.token);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/add-to-watchlist", async (req, res, next) => {
  try {
    let response = await service.addToWatchlist(req.body);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/remove-from-watchlist", async (req, res, next) => {
  try {
    let response = await service.removeFromWatchlist(req.body);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/remove-multiple-from-watchlist", async (req, res, next) => {
  try {
    let response = await service.removeMultipleFromWatchlist(req.body);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/add-to-search", async (req, res, next) => {
  try {
    let response = await service.addToSearch(req.body);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/add-to-recent-searched-movie", async (req, res, next) => {
  try {
    let response = await service.addToRecentMovie(req.body,"recently_searched_movie");
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/add-to-recent-watched-movie", async (req, res, next) => {
  try {
    let response = await service.addToRecentMovie(req.body,"recently_watched_movie");
    res.send(response)
  } catch (error) {
    next(error);
  }
});

router.get("/send-mail", async (req, res, next) => {
  try {
    let response = await axios({
      method: "post",
      url: "https://api.sendinblue.com/v3/smtp/email",
      headers: {
        accept: "application/json",
        "api-key":
          "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",
        "content-type": "application/json"
      },
      data: {
        sender: {
          name: "ZFlix",
          email: "no-reply@zflix.com"
        },
        to: [
          {
            email: "josh24dun@gmail.com",
            name: "Naresh"
          }
        ],
        subject: "Welcome to ZFlix",
        htmlContent: `
        <!DOCTYPE html>
<html>

<head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 700;
                src: local('Lato Bold'), local('Lato-Bold'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 400;
                src: local('Lato Italic'), local('Lato-Italic'), url(https://fonts.gstatic.com/s/lato/v11/RYyZNoeFgb0l7W3Vu1aSWOvvDin1pK8aKteLpeZ5c0A.woff) format('woff');
            }

            @font-face {
                font-family: 'Lato';
                font-style: italic;
                font-weight: 700;
                src: local('Lato Bold Italic'), local('Lato-BoldItalic'), url(https://fonts.gstatic.com/s/lato/v11/HkF_qI1x_noxlxhrhMQYELO3LdcAZYWl9Si6vvxL-qU.woff) format('woff');
            }
        }

        /* CLIENT-SPECIFIC STYLES */
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        /* RESET STYLES */
        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }

        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        /* MOBILE STYLES */
        @media screen and (max-width:600px) {
            h1 {
                font-size: 32px !important;
                line-height: 32px !important;
            }
        }

        /* ANDROID CENTER FIX */
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }
    </style>
</head>
<!-- FFECD1 -->
<body style="background-color: #FFE2D9; margin: 0 !important; padding: 0 !important;">
    <!-- HIDDEN PREHEADER TEXT -->
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <!-- LOGO -->
        <tr>
            <td align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td align="center" valign="top" style="padding: 40px 10px 40px 10px;">
                        <img width="90" height="90" src="https://res.cloudinary.com/dkmxj6hie/image/upload/v1635569489/Z_Flix_Logo_1_WO_BG_me01ev.png" alt="">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 40px; font-weight: 400; margin:5px;letter-spacing: normal;">Welcome!</h1> <img src="https://res.cloudinary.com/dkmxj6hie/image/upload/v1635576312/handshake_s4sknk.png" width="125" height="120" style="display: block; border: 0px;" />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 20px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                            <h1 style="font-size: 30px; font-weight: 400; margin:0px;letter-spacing: normal;">Thanks for signing up, Naresh!</h1> 
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#FFE2D9" align="center" style="padding: 0px 10px 50px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                        <table border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td align="center" style="border-radius: 3px;" bgcolor="#c60510"><a href="#" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #c60510; display: inline-block;">Confirm Account</a></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr> <!-- COPY -->
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                        </td>
                    </tr> <!-- COPY -->
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;"><a href="#" target="_blank" style="color: #c60510;">https://bit.li.utlddssdstueincx</a></p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Cheers,<br>ZFlix Team</p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">Please ignore this email if you haven't created an account.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
        `
      }
    });
    console.log(response.data);
    res.json({ message: "Mail sent successfully" });
  } catch (error) {
    console.log(error);
    res.json(error.response.data);
  }
});

//List
router.post("/create-list", async (req, res, next) => {
  try {
    let response = await service.createList(req.body);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/add-to-list", async (req, res, next) => {
  try {
    let response = await service.addToList(req.body);
    res.send(response);
  } catch (error) {
    next(error);
  }
});

router.post("/get-list", async (req, res, next) => {
  try {
    let {id}=req.body
    if (id) {
      let response = await service.getList(id);
      res.send(response); 
    } else {
      throw Error("List Id is missing");
    }
  } catch (error) {
    next(error);
  }
});

router.get("/get-all-lists", async (req, res, next) => {
  try {
    let response = await service.getAllLists();
    res.send(response); 
  } catch (error) {
    next(error);
  }
});

//ZFlix
router.get("/zflix/latest-version", async(req, res,next) => {
  try {
    let info=await service.getAppInfo()
    res.redirect(info.info[0].url)
  } catch (error) {
    next(error)
  }
});

router.get("/zflix/update", async(req, res,next) => {
  try {
    let info=await service.getAppInfo()
    res.json(info.info[0])
  } catch (error) {
    next(error)
  }
});

module.exports = router;
