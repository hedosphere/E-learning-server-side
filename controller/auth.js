//
import User from "../model/user";
// import Hedo from "../model/hedopay";
import Hedospays from "../model/hedospays";
import { hashPassword, comparePassword } from "../util/hashing";
import jwt from "jsonwebtoken";
import { randomnumber } from "../util/randomnumber";
import AWS from "aws-sdk";
// var AWS = require("aws-sdk");

// import nanoid from "nanoid";
//
//register
const awsConfig = {
  // { apiVersion: "2010-12-01" }
  apiVersion: process.env.AWS_API_VERSION,
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

export const register = async (req, res) => {
  try {
    //

    //

    const { name, password, email } = req.body;
    // const reqBody = { name, password, email };
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6)
      return res.status(400).send("try again!, Password not accepted");
    if (!email) return res.status(400).send("Email is required");
    // console.table(reqBody);

    const userExist = await User.findOne({ email }).exec();
    if (userExist) {
      console.log(userExist);
      return res.status(400).send("User exist, Pls login");
    }
    const secretpassword = await hashPassword(password);
    //
    const user = new User({ name, password: secretpassword, email });

    await user.save();
    //

    //
    res.json({ ok: true });
    //
    //
  } catch (err) {
    console.log("error", err);
    res.status(400).send("error from catch");
  }
};
//login

export const login = async (req, res) => {
  try {
    //
    //

    const { email, password } = req.body;
    if (!email) return res.status(400).send("Email is required");
    if (!password || password.length < 6)
      return res.status(400).send("wrong password");

    const user = await User.findOne({ email }).exec();

    if (!user) return res.status(400).send("User not found");

    const userAccess = await comparePassword(password, user.password);

    if (!userAccess) return res.status(400).send("Wrong Password");
    var token = jwt.sign({ _id: user._id }, process.env.JWTSECRET, {
      expiresIn: "1d",
    });

    user.password = undefined;
    res.cookie("token", token, { httpOnly: true });

    res.json(user);

    //
  } catch (err) {
    console.log(err);
    res.status(400).send("error from catch");
  }
};

//

// es.clearCookie("key");

//
export const logout = async (req, res) => {
  //
  res.clearCookie("token");
  res.json({ ok: true });
};

//

//Get current user
export const currentUser = async (req, res) => {
  //
  // console.log("current");
  const user = await User.findById({ _id: req.auth._id })
    .select("-password")
    .exec();
  res.json({ ok: true });
};

//
// send code handle  resetPassword

export const sendCode = async (req, res) => {
  //
  try {
    const { email } = req.body;

    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("User not Exist, chech your email");

    const shordCode = await randomnumber(6);

    //// Create  Email params

    var emailParams = {
      Destination: {
        /* required */
        CcAddresses: [
          email,
          // process.env.EMAIL_TO_ADDRESS,
          // "friday9101@gmail.com",
          // process.env.EMAIL_FROM_ADDRESS,
          /* more items */
        ],
        ToAddresses: [
          // "EMAIL_ADDRESS",
          email,
          // process.env.EMAIL_TO_ADDRESS,
          // "friday9101@gmail.com",

          /* more items */
        ],
      },
      Message: {
        /* required */
        Body: {
          /* required */
          Html: {
            Charset: "UTF-8",
            Data: `
            
            <html>
                      <body>
                      <h1>Use the code bellow to reset your password<h1>
                      <p>${shordCode}</p>
                      </body>
            </html>

            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "PASSWORD RESET CODE",
        },
      },
      Source:
        // "hedosphere@gmail.com",
        process.env.EMAIL_FROM_ADDRESS,
      /* required */
      ReplyToAddresses: [process.env.EMAIL_FROM_ADDRESS],
    };
    const awsSES = new AWS.SES(awsConfig);

    const emailSend = awsSES.sendEmail(emailParams).promise();

    emailSend
      .then(function (data) {
        User.findOneAndUpdate(
          { _id: user._id },
          { passwordcode: shordCode }
        ).exec();
        //
        // console.log(data.MessageId);
      })
      .catch(function (err) {
        console.error(err, err.stack);
      });
    //

    // res.json({ ok: true });
    res.send("Code Sent, Check Your Email");

    //

    //
  } catch (err) {
    //

    console.log(err);
    res.status(400).send("unresolved error from catch");
  }
};

//

//

//  resetPassword

export const resetPassword = async (req, res) => {
  //
  // console.log("reset password", req.body);

  const { newpassword, code, email } = req.body;
  // console.log("reset password4 ", newpassword, email, code);
  if (!newpassword || newpassword.length < 6)
    return res.status(400).send("Invalid password, pls reset it");
  if (!email) return res.status(400).send("Email is required");
  if (!code || code.length < 2) return res.status(400).send("Code is required");

  const hashedpassword = await hashPassword(newpassword);

  const user = await User.findOneAndUpdate(
    { email, passwordcode: code },
    { password: hashedpassword, passwordcode: "" }
  ).exec();

  if (!user) return res.status(400).send("Wrong Code, Refresh your email");

  console.log(user);

  res.send("ok");
};

// userInstructor

//
export const isInstructor = async (req, res) => {
  //
  // console.log("hyhhhh ", req.auth._id);
  // return;
  try {
    const user = await User.findOne({ _id: req.auth._id }).exec();

    if (!user) return res.status(403).send("Please Login");

    if (user && user.role && user.role.includes("Instructor"))
      return res.status(400).send("Instructor Setup  Completed");

    return res.json({ ok: false });
  } catch (err) {
    console.log(err);
    return res.send("error try again");
  }
};

export const payOut = async (req, res) => {
  //

  // const p = { name, email, accountType, accountNumber, bankName };

  try {
    const { accountType, accountNumber, bankName } = req.body;
    //
    if (!bankName) return res.status(400).send("Bank Name is required");
    if (!accountNumber)
      return res.status(400).send("Account Number is required");
    if (!accountType) return res.status(400).send("Account Type is required");

    // const user = await User.findOne({ _id: req.auth._id }).exec();
    const user = await User.findOne({ _id: req.auth._id }).exec();

    const hPay = new Hedospays({
      user: user._id,
      accounttype: accountType,
      bankname: bankName,
      accountnumber: accountNumber,
    });
    await hPay.save();

    // console.log("user details", hPay);
    // return;

    const userPayment = await User.findOneAndUpdate(
      { _id: req.auth._id },
      {
        hedopayId: hPay._id,
        hedopayData: hPay,
        $addToSet: {
          role: "Instructor",
        },
      }
    ).exec();
    res.status(200).send("Setup complete");
  } catch (err) {
    console.log("error", err);
  }
};

//

///
export const callback = async (req, res) => {
  const user = await User.findById({ _id: req.auth._id }).exec();
  // console.log(user);

  if (!user) return res.status(401).send("pls login");

  // console.log(userPayment);

  if (!user.role.includes("Instructor"))
    return res.status(401).send("Please Become instructor first");
  // includes;
  user.password = undefined;
  res.json(user);
  // res.send("callback from back");
};

//
