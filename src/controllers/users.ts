import bcrypt from "bcrypt";
import { Users } from "../models/users";
import { Response, Request } from "express";
import { ValidatedRequest } from "express-joi-validation";
import {
  RegisterRequestSchema,
  LoginRequestSchema,
  VerifyEmailSchema,
  resendEmailCodeSchema,
  changePasswordSchema,
  ArrayRequestSchema,
} from "../schema/users";
import { generateToken } from "../helpers/generateToken";
import { sendEmail } from "../helpers/sendMail";
import { randomNumber } from "../helpers/randomGenerators";
import { UserInfo } from "../models/userInfo";
import { Application } from "../models/application";
import { Requirements } from "../models/requirements";
import {
  AllApplicationRequestSchema,
  cancellRequestSchema,
} from "../schema/application";

export const createUser = async (
  req: ValidatedRequest<RegisterRequestSchema>,
  res: Response
) => {
  try {
    const { email, password, mobile } = req.body;
    console.log("body", req.body);

    const findUser = await Users.findOne({ email });
    if (findUser)
      return res
        .status(400)
        .json({ message: `Email: ${email} is already registered` });

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = await bcrypt.hashSync(password, salt);
    const generated = randomNumber(6);

    const newuser = new Users({
      email,
      mobile,
      password: passwordHash,
      role: "user",
      otp: generated,
      verified: false,
    });

    const user = await newuser.save();

    if (user) {
      res.status(200).json({
        message: `successfull registered ${email}`,
        email: user.email,
      });

      const mailOptions = {
        from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
        to: email,
        subject: "Email verification code",
        text: "Greetings from Tarlac Agricultural University",
        html: `<span>here is your OTP <h3>${generated}</h3></span>
        `,
      };

      sendEmail(mailOptions);
    } else {
      res.status(400).json({ message: `unable to register ${email}` });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.log("error", error);
  }
};

export const loginAction = async (
  req: ValidatedRequest<LoginRequestSchema>,
  res: Response
) => {
  const { email, password } = req.body;
  try {
    const findUser = await Users.findOne({ email });

    if (!findUser)
      return res.status(400).json({ message: "Invalid Password or Email!" });
    if (!findUser.verified)
      return res.status(401).json({
        message:
          "This email is not yet verified check your email and see the verification code and verify your email",
        email,
      });
    const passwordIsValid = bcrypt.compareSync(password, findUser.password);

    if (!passwordIsValid)
      return res.status(400).json({ message: "Invalid Password or Email!" });
    if (!findUser.verified) {
      return res
        .status(400)
        .json({ message: "This account is not yet verified!" });
    }

    const userInfo = await UserInfo.findOne({ email });
    const application = await Application.find({ email });
    const requirements = await Requirements.find({ email });

    res.status(200).json({
      token: generateToken({
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
        mobile: findUser.mobile,
      }),
      role: findUser.role,
      email: findUser.email,
      verified: findUser.verified,
      userInfo: userInfo ? userInfo : null,
      application: application.length > 0 ? application : null,
      requirements: requirements.length > 0 ? requirements : null,
    });
  } catch (error) {
    return res.status(500).json({ message: `Internal server error`, error });
  }
};

export const verifyEmail = async (
  req: ValidatedRequest<VerifyEmailSchema>,
  res: Response
) => {
  const { verificationCode, email } = req.query;

  try {
    const checkEmail = await Users.findOne({ email });
    if (!checkEmail)
      return res.status(400).json({
        message: `${email} cannot be found in our query or this is not registered`,
      });

    if (checkEmail.otp !== verificationCode)
      return res.status(400).json({
        message: `Sorry, ${verificationCode} is not valid OTP please enter a valid OTP`,
      });

    checkEmail.verified = true;
    checkEmail.otp = 0;
    const verifyEmail = await checkEmail.save();

    if (verifyEmail)
      return res
        .status(200)
        .json({ message: `Successfully verified email: ${email}` });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendVericationCode = async (
  req: ValidatedRequest<resendEmailCodeSchema>,
  res: Response
) => {
  try {
    const { email } = req.query;
    const checkEmail = await Users.findOne({
      email,
    });

    if (!checkEmail) {
      return res.status(400).json({
        message: "Email cannot be found in our query or this is not registered",
      });
    }

    const generated = randomNumber(6);

    checkEmail.otp = generated;

    const resendCode = await checkEmail.save();

    const mailOptions = {
      from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
      to: email,
      subject: "Resend Email verification code",
      text: "Greetings from Tarlac Agricultural University",
      html: `<span>here is your new OTP <h3>${generated}</h3></span>`,
    };

    sendEmail(mailOptions);
    if (resendCode)
      return res.status(200).json({
        message:
          "Successfully created new email verification code please check your email",
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (
  req: ValidatedRequest<resendEmailCodeSchema>,
  res: Response
) => {
  try {
    const { email } = req.query;
    const checkEmail = await Users.findOne({
      email,
    });

    if (!checkEmail)
      return res.status(404).json({
        message: `${email} cannot be found in our query or this is not registered!`,
      });

    const generated = randomNumber(6);

    checkEmail.otp = generated;

    const resetPassword = await checkEmail.save();

    const mailOptions = {
      from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
      to: email,
      subject: "Reset Password Request",
      text: "Greetings from Tarlac Agricultural University",
      html: `<span>here is your OTP <h3>${generated} for the new password request</h3></span>`,
    };

    sendEmail(mailOptions);
    if (resetPassword)
      return res.status(200).json({
        message:
          "Successfully send a request for the new password please check your email for OTP",
        email: checkEmail.email,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const changePassword = async (
  req: ValidatedRequest<changePasswordSchema>,
  res: Response
) => {
  try {
    const { otp, email, password } = req.query;

    const checkEmail = await Users.findOne({ email });
    if (!checkEmail)
      return res.status(404).json({
        message: `${email} cannot be found in our query or this is not registered!`,
      });

    if (otp !== checkEmail.otp) {
      return res.status(404).json({
        message: `${otp} is not match in requested credentials!`,
      });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = await bcrypt.hashSync(password, salt);
    checkEmail.otp = 0;
    checkEmail.password = passwordHash;
    const resetPassword = await checkEmail.save();
    if (resetPassword) {
      const mailOptions = {
        from: '"Tarlac Agricultural University" <admin@tau.edu.ph>',
        to: email,
        subject: "Success Password Reset",
        text: "Greetings from Tarlac Agricultural University",
        html: `<span>here is your new password <h3>${password} for this ${email}</h3></span>`,
      };

      sendEmail(mailOptions);
      return res.status(200).json({
        message: "Successfully reset your password",
      });
    } else {
      res
        .status(400)
        .json({ message: "There is a something wrong in our end" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refreshToken = async (
  req: ValidatedRequest<AllApplicationRequestSchema>,
  res: Response
) => {
  try {
    const { email } = req.query;
    const token = await Users.findOne({ email });
    if (token) {
      res.status(200).json({
        token: generateToken({
          id: token.id,
          email: token.email,
          role: token.role,
          mobile: token.mobile,
        }),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminLoginAction = async (
  req: ValidatedRequest<LoginRequestSchema>,
  res: Response
) => {
  const { email, password } = req.body;
  try {
    const findUser = await Users.findOne({ email });

    if (!findUser)
      return res.status(400).json({ message: "Invalid Password or Email!" });
    if (!findUser.verified)
      return res.status(400).json({
        message:
          "This email is not yet verified check your email and see the verification code and verify your email",
      });
    if (findUser.role !== "admin")
      return res.status(400).json({
        message:
          "This email is not an admin account, please login an admin account",
      });
    const passwordIsValid = bcrypt.compareSync(password, findUser.password);

    if (!passwordIsValid)
      return res.status(400).json({ message: "Invalid Password or Email!" });
    if (!findUser.verified) {
      return res
        .status(400)
        .json({ message: "This account is not yet verified!" });
    }

    const userInfo = await UserInfo.findOne({ email });

    return res.status(200).json({
      token: generateToken({
        id: findUser.id,
        email: findUser.email,
        role: findUser.role,
        mobile: findUser.mobile,
      }),
      userInfo: userInfo ? userInfo : [],
    });
    // return res
    //   .status(400)
    //   .json({ message: "Registration process in not yet compeleted" });
  } catch (error) {
    return res.status(500).json({ message: `Internal server error`, error });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await Users.find({ role: "user" });
    if (users) {
      return res.status(200).json({ users });
    } else {
      return res.status(404).json({ message: "Users not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUsers = async (
  req: ValidatedRequest<ArrayRequestSchema>,
  res: Response
) => {
  try {
    const { deletedId } = req.body;

    const users = await Users.deleteMany({
      _id: {
        $in: deletedId,
      },
    });
    if (users) {
      return res.status(200).json({ message: "Successfully remove" });
    } else {
      res.status(400).json({ message: "Error in delete" });
    }
  } catch (error) {
    console.log("500 error", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deactivateUser = async (
  req: ValidatedRequest<cancellRequestSchema>,
  res: Response
) => {
  try {
    const { appId } = req.query;

    const users = await Users.findById(appId);
    if (users) {
      users.verified = false;
      const upadteUser = await users.save();
      if (upadteUser) {
        res
          .status(200)
          .json({ message: "Successfully cancelled your application" });
      } else {
        res.status(400).json({ message: "Unable to cancel your application" });
      }
    } else {
      res.status(404).json({ message: "Application not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal error" });
  }
};
