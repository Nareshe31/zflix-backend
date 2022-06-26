const model = require("../model/auth.js");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET
let service = {};
const axios = require("axios");

service.loginUser = async (email, password) => {
  let user = await model.getUser(email);
  if (user) {
    if (user.password == password) {
      if (user.verified) {
        const token = jwt.sign(
          { _id: user._id, email: user.email },
          JWT_SECRET
        );
        let addLastLogin=await model.addLastLogin(user._id)
        return { user: user, message: "Login successful", token: token };
      } else {
        let err = new Error(
          "Please verify your account to use the app. Check your email address for verification link"
        );
        err.status = 401;
        throw err;
      }
    } else {
      let err = new Error("Email or password is incorrect");
      err.status = 401;
      throw err;
    }
  } else {
    let err = new Error("User does not exist");
    err.status = 400;
    throw err;
  }
};

service.signupUser = async userObj => {
  let user = await model.getUser(userObj.email);
  if (user) {
    let err = new Error("User already exists with this email-id");
    err.status = 400;
    throw err;
  } else {
    let created = await model.createUser(userObj);
    if (created) {
      const token = jwt.sign(
        { _id: created._id, name: created.name, email: created.email },
        JWT_SECRET
      );
      let response = await axios({
        method: "post",
        url: "https://api.sendinblue.com/v3/smtp/email",
        headers: {
          accept: "application/json",
          "api-key":process.env.SIB_API_KEY,
          "content-type": "application/json"
        },
        data: {
          sender: {
            name: "ZFlix",
            email: "no-reply@zflix.com"
          },
          to: [
            {
              email: userObj.email,
              name: userObj.name
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
                            <h1 style="font-size: 30px; font-weight: 400; margin:0px;letter-spacing: normal;">Thanks for signing up, ${userObj.name}!</h1> 
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
                                                <td align="center" style="border-radius: 3px;" bgcolor="#c60510"><a href="https://important-bow-prawn.glitch.me/verify-email?token=${token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #c60510; display: inline-block;">Confirm Account</a></td>
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
                            <p style="margin: 0;"><a href="#" target="_blank" style="color: #c60510;">https://important-bow-prawn.glitch.me/verify-email?token=${token}</a></p>
                        </td>
                    </tr>
                    <tr>
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">If you have any questions, send an email to zflix.contact@protonmail.com.</p>
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
      return { message: "Signup is successfull" };
    } else {
      let err = new Error("Something went wrong while creating a new user");
      err.status = 400;
      throw err;
    }
  }
};

service.verifyEmail = async token => {
  try {
    const payload = await jwt.verify(token, JWT_SECRET);
    let user = await model.getUser(payload.email);
    if (user) {
      if (user.verified) {
        let err = new Error("You have already verified your account");
        err.status = 404;
        throw err;
      } else {
        let isVerified = await model.verifyUser(user._id);
        if (isVerified) {
          return { user: isVerified };
        } else {
          let err = new Error(
            "Could not verify your account. Please try again later"
          );
          err.status = 400;
          throw err;
        }
      }
    } else {
      let err = new Error(
        "This link is not valid. Please use the link sent to your registered mail id"
      );
      err.status = 401;
      throw err;
    }
  } catch (error) {
    let errorMessage =
      error.message == "You have already verified your account"
        ? error.message
        : "This link is not valid. Please use the link sent to your registered mail id";
    let err = new Error(errorMessage);
    err.status = 400;
    throw err;
  }
};

service.searchUser = async name => {
  let users = await model.searchUser(name);
  if (users) {
    return { users };
  } else {
    let err = new Error("Something went wrong while searching for user");
    err.status = 400;
    throw err;
  }
};

service.getUser = async token => {
  try {
    const payload = await jwt.verify(token, JWT_SECRET);
    const { email } = payload;
    let user = await model.getUser(email);
    let addLastLogin=await model.addLastUsed(user._id)
    // return { "user": { name: user.name, email: user.email, _id: user._id,watchlist:user.watchlist }}
    return { user: user };
  } catch (error) {
    let err = new Error("Login to proceed");
    err.status = 401;
    throw err;
  }
};

service.addToWatchlist = async data => {
  try {
    let user = await model.addToWatchlist(data);
    if (user) {
      return { message: "Added to watchlist", user: user };
    } else {
      throw Error("Cannot add to watchlist");
    }
  } catch (error) {
    let err = new Error("Cannot add to watchlist");
    err.status = 400;
    throw err;
  }
};

service.removeFromWatchlist = async data => {
  try {
    let user = await model.removeFromWatchlist(data);
    if (user) {
      return { message: "Removed from watchlist" };
    } else {
    }
  } catch (error) {
    let err = new Error("Cannot remove from watchlist");
    err.status = 400;
    throw err;
  }
};

service.removeMultipleFromWatchlist = async data => {
  try {
    let user = await model.removeMultipleFromWatchlist(data);
    if (user) {
      return { message: "Removed from watchlist" };
    } else {
    }
  } catch (error) {
    let err = new Error("Cannot remove from watchlist");
    err.status = 400;
    throw err;
  }
};

service.addToSearch = async data => {
  try {
    let user = await model.addToSearch(data);
    if (user) {
      return { message: "Added to searched keywords" };
    } else {
    }
  } catch (error) {
    let err = new Error("Cannot add to searched keywords");
    err.status = 400;
    throw err;
  }
};

service.addToRecentMovie = async (data,key) => {
  try {
    let user = await model.addToRecentMovie(data,key);
    if (user) {
      return { message: `Added to ${key} list` };
    } else {
    }
  } catch (error) {
    let err = new Error(`Cannot add to ${key} list`);
    err.status = 400;
    throw err;
  }
};

//List
service.createList = async data => {
  try {
    let list = await model.createList(data);
    if (list) {
      return { message: "List created successfully",list };
    } else {
      throw Error("Cannot create list");
    }
  } catch (error) {
    console.log(error);
    let err = new Error("Cannot create list");
    err.status = 400;
    throw err;
  }
};

service.addToList = async data => {
  try {
    let list = await model.addToList(data);
    if (list) {
      return { message: "Added to list successfully", list};
    } else {
      throw Error("Cannot add to list");
    }
  } catch (error) {
    let err = new Error("Cannot add to list");
    err.status = 400;
    throw err;
  }
};

service.getList = async id => {
  try {
    let list = await model.getList(id);
    if (list) {
      return { message: "Retrieved the list successfully", list};
    } else {
      throw Error("Cannot find list");
    }
  } catch (error) {
    let err = new Error("Cannot find list");
    err.status = 400;
    throw err;
  }
};

service.getAllLists = async () => {
  try {
    let lists = await model.getAllLists();
    if (lists) {
      return { message: "Retrieved the lists successfully", lists};
    } else {
      throw Error("Cannot find lists");
    }
  } catch (error) {
    let err = new Error("Cannot find lists");
    err.status = 400;
    throw err;
  }
};


//ZFlix
service.getAppInfo = async () => {
  try {
    let info = await model.getAppInfo();
    if (info) {
      return { info};
    } else {
    }
  } catch (error) {
    let err = new Error("Cannot find latest version");
    err.status = 400;
    throw err;
  }
};
module.exports = service;
