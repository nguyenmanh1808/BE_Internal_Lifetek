const User = require("../users/user.model.js");
const authValidation = require("./auth.validation.js");
const jwt = require("jsonwebtoken");
const env = require("../config/env.js");
const tokenUtils = require("../utils/tokenUtils.js");
const emailTemplate = require("../services/templateService.js");
const emailQueue = require("../queues/index.js");
const SuccessResponse = require("../utils/SuccessResponse.js");
const crypto = require("crypto");
const { sendMail } = require("../config/nodeMailer.js");
const axios = require("axios"); // Thêm axios để gọi API của SSO provider
const { ROLES } = require("../constants/index.js"); // Import ROLES

//đăng ký
exports.register = async (req, res, next) => {
  try {
    const { email, password, phone, userName } = req.body;
    const { error } = authValidation.signUpValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return next(new Error(errors));
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return next(new Error("Email đã tồn tại"));
    }

    const user = await User.create({
      email,
      password,
      phone,
      userName,
    });

    const verifyToken = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: "30m",
    });

    //gui email
    const verificationLink = `${env.BASE_URL}/api/v1/auth/verify-email/${verifyToken}`;
    const emailContent =
      emailTemplate.getVerificationEmailTemplate(verificationLink);

    // use service send email
    sendMail({
      to: user.email,
      subject: "Xác thực email",
      text: "Xác thực email",
      html: emailContent,
    });

    // use worker send email
    // await emailQueue.emailQueue.add("sendEmail", {
    //     email: user.email,
    //     subject: "Xác thực email",
    //     text: "Xác thực emailabc",
    //     html: emailContent,
    // });
    new SuccessResponse(user).send(res);
  } catch (error) {
    return next(error);
  }
};
//xác thực email
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const decode = jwt.verify(token, env.JWT_SECRET);
    if (!decode) return next(new Error("Token không hợp lệ"));

    const user = await User.findById(decode.id);
    if (!user) return next(new Error("User không tồn tại"));

    user.verified = true;
    await user.save();

    return new SuccessResponse(user).send(res);
  } catch (error) {
    return next(error);
  }
};
//đăng nhập
exports.login = async (req, res, next) => {
  try {
    //validate
    const { error } = authValidation.signInValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return next(new Error(errors))
    }

    
    const { email, password } = req.body

    // truy van user
    const user = await User.findOne({ email });

    // kiem tra user
    if (!user) return next(new Error("Email chưa đăng ký"));

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return next(new Error("Mật khẩu không đúng" + password));

    if (!user.verified) return next(new Error("Email chưa được xác thực"));

    // tao token
    const accessToken = tokenUtils.generateAccessToken(user);
    const refreshToken = tokenUtils.generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, //local
      sameSite: "strict",
    });

    user.password = undefined;

    return new SuccessResponse({
      accessToken: accessToken,
      tokenExpiry: env.JWT_ACCESS_EXPIRY,
      user: user,
    }).send(res);
  } catch (error) {
    return next(error);
  }
};
//làm mới token
exports.getNewAccessToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new Error("Refresh token không được cung cấp")); // Nên sử dụng AppError với status code 401
  }

  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new Error("Người dùng không tồn tại")); // Nên sử dụng AppError với status code 401
    }

    // Kiểm tra xem người dùng có bị vô hiệu hóa hay không (nếu có logic đó)

    const accessToken = tokenUtils.generateAccessToken(user);

    return new SuccessResponse({
      accessToken: accessToken,
      tokenExpiry: env.JWT_ACCESS_EXPIRY,
    }).send(res);
  } catch (error) {
    // Xử lý các lỗi JWT cụ thể (ví dụ: hết hạn, không hợp lệ)
    // Ví dụ: if (error.name === "TokenExpiredError") return next(new AppError("Refresh token đã hết hạn", 401));
    return next(new Error("Refresh token không hợp lệ hoặc đã hết hạn")); // Nên sử dụng AppError với status code 401
  }
};
//đăng xuất
exports.logout = async (req, res, next) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);
    if (!user) return next(new Error("User không tồn tại"));

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false, // local
      sameSite: "strict",
    });
    return new SuccessResponse("Đăng xuất thành công").send(res);
  } catch (error) {
    return next(error);
  }
};
// gửi mail mat khau mới
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmailOrPhone(email);

    if (!user) return next(new Error("Email chưa đăng ký"));

    const resetToken = user.getResetPasswordToken();
    await user.save();

    const isTesting = process.env.NODE_ENV === "development"; // Kiểm tra đang test không
    const url_client = isTesting
      ? `${env.DOMAIN_SWAGGER}:${env.PORT}/api-docs/#/Auth/post_auth_reset-password_token_${resetToken}`
      : `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const contextMail = emailTemplate.getResetPasswordEmailTemplate(url_client);

    await emailQueue.emailQueue.add("sendEmail", {
      email: user.email,
      subject: "Cấp lại mật khẩu",
      html: contextMail,
    });

    return new SuccessResponse(
      "Link đặt lại mật khẩu đã được gửi qua email"
    ).send(res);
  } catch (error) {
    return next(error);
  }
};
//  đặt lại mật khẩu bằng
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.query;
    const { password, confirmPassword } = req.body;

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Không tìm thấy user với token đã hash.");
      return next(new Error("Token không hợp lệ hoặc đã hết hạn"));
    } else {
      console.log("User tìm được:", user.email);
      console.log("resetPasswordExpire:", user.resetPasswordExpire);
      console.log("Hiện tại:", new Date());
    }

    if (password !== confirmPassword)
      return next(new Error("Mật khẩu không trùng khớp"));

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return new SuccessResponse("Đặt lại mật khẩu thành công").send(res);
  } catch (error) {
    return next(error);
  }
};

exports.ssoCallback = async (req, res, next) => {
  try {
    const { provider } = req.params;
    const { code, state, error: ssoError, error_description } = req.query;
    if (ssoError) {
      console.error(`Lỗi từ SSO Provider ${provider}: ${ssoError} - ${error_description}`);
      return res.redirect(`${env.CLIENT_URL}/login?error=${encodeURIComponent(error_description || ssoError)}`);
    }

    if (!code) {
      return next(new Error("Không nhận được mã ủy quyền (authorization code) từ SSO provider."));
    }
    const providerKey = provider.toUpperCase();
    const tokenExchangeUrl = env[`SSO_${providerKey}_TOKEN_URL`];
    const clientId = env[`SSO_${providerKey}_CLIENT_ID`];
    const clientSecret = env[`SSO_${providerKey}_CLIENT_SECRET`];
    const redirectUri = `${env.BASE_URL}/api/v1/auth/sso/${provider.toLowerCase()}/callback`; 
    if (!tokenExchangeUrl || !clientId || !clientSecret) {
        return next(new Error(`Cấu hình trao đổi token cho nhà cung cấp SSO '${provider}' chưa đầy đủ.`));
    }
    let tokenResponse;
    try {
      tokenResponse = await axios.post(tokenExchangeUrl, new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    } catch (err) {
      console.error("Lỗi khi trao đổi code lấy token từ SSO:", err.response?.data || err.message);
      return next(new Error("Không thể trao đổi mã ủy quyền để lấy token từ nhà cung cấp SSO."));
    }

    const { access_token: ssoAccessToken, id_token: ssoIdToken } = tokenResponse.data;
    const userInfoUrl = env[`SSO_${providerKey}_USERINFO_URL`];
    if (!userInfoUrl) {
        return next(new Error(`Cấu hình URL thông tin người dùng cho '${provider}' bị thiếu.`));
    }
    let ssoUserInfo;
    try {
        const userInfoResponse = await axios.get(userInfoUrl, {
            headers: { "Authorization": `Bearer ${ssoAccessToken}` },
        });
        ssoUserInfo = userInfoResponse.data; // Định dạng phụ thuộc vào nhà cung cấp SSO
    } catch (err) {
        console.error("Lỗi khi lấy thông tin người dùng từ SSO:", err.response?.data || err.message);
        return next(new Error("Không thể lấy thông tin người dùng từ nhà cung cấp SSO."));
    }
    const ssoUserId = ssoUserInfo.id || ssoUserInfo.sub; // 'sub' thường là subject identifier trong OpenID Connect
    const ssoUserEmail = ssoUserInfo.email;
    const ssoUserName = ssoUserInfo.name || ssoUserInfo.preferred_username || ssoUserEmail.split("@")[0];
    const ssoEmailVerified = ssoUserInfo.email_verified || true; // Mặc định là true nếu SSO không cung cấp

    if (!ssoUserEmail || !ssoUserId) {
        return next(new Error("Thông tin người dùng từ SSO không đầy đủ (thiếu email hoặc ID)."));
    }

    let user = await User.findOne({ ssoProvider: provider.toLowerCase(), ssoProviderId: ssoUserId });

    if (!user) {
      user = await User.findOne({ email: ssoUserEmail });
      if (user) { // Người dùng đã tồn tại với email này, liên kết tài khoản SSO
        user.ssoProvider = provider.toLowerCase();
        user.ssoProviderId = ssoUserId;
        user.verified = user.verified || ssoEmailVerified;
      } else { // Tạo người dùng mới
        user = await User.create({
          email: ssoUserEmail,
          userName: ssoUserName,
          ssoProvider: provider.toLowerCase(),
          ssoProviderId: ssoUserId,
          verified: ssoEmailVerified,
          role: ROLES.USER, // Vai trò mặc định
          // Mật khẩu không cần thiết vì đăng nhập qua SSO
        });
      }
      await user.save();
    } else if (!user.verified && ssoEmailVerified) {
        // Nếu user đã tồn tại qua SSO nhưng chưa verified, và SSO trả về email đã verified
        user.verified = true;
        await user.save();
    }

    // Bước 4: Tạo token (Access Token, Refresh Token) cho người dùng trong hệ thống của bạn
    const accessToken = tokenUtils.generateAccessToken(user);
    const refreshToken = tokenUtils.generateRefreshToken(user);

    res.cookie("refreshToken", refreshToken, { 
        httpOnly: true, 
        secure: env.NODE_ENV === "production", // true ở production
        sameSite: "strict" 
    });
  
    user.password = undefined; // Không trả về mật khẩu
    return new SuccessResponse({ 
        accessToken, 
        tokenExpiry: env.JWT_ACCESS_EXPIRY, 
        user 
    }).send(res);

  } catch (error) {
    console.error("Lỗi nghiêm trọng trong ssoCallback:", error);
    return res.redirect(`${env.CLIENT_URL}/login?error=sso_failed`);
  }
};
exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const { error } = authValidation.changePasswordValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return next(new Error(errors));
    }

    const user = await User.findById(req.user._id);

    if (!user) return next(new Error("Người dùng không tồn tại"));

    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) return next(new Error("Mật khẩu cũ không đúng"));

    user.password = newPassword;
    await user.save();

    return new SuccessResponse("Đổi mật khẩu thành công").send(res);
  } catch (error) {
    return next(error);
  }
};
