import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const welcomeEmail = async (to: string, username: string) => {
  const mailOptions = {
    to,
    from: `"Taskflow" <${process.env.GMAIL_USER}>`,
    subject: "🎉 Welcome to Taskflow!",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f6f8fb; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <h1 style="color: #0052cc; text-align: center;">Welcome, ${username}! 🎉</h1>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          We’re excited to have you join <b>Taskflow</b>!  
          You can now manage your tasks, collaborate with your team, and boost productivity — all in one place.
        </p>
        <a href="https://${process.env.CLIENT_URL}/user/sign-in" 
           style="display: inline-block; background-color: #0052cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Get Started 🚀
        </a>
        <p style="margin-top: 30px; font-size: 14px; color: #888;">
          Cheers, <br> The Taskflow Team
        </p>
      </div>
    </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export const forgetPasswordEmail = async (
  to: string,
  username: string,
  otp: string
) => {
  const mailOptions = {
    to,
    from: `"Taskflow" <${process.env.GMAIL_USER}>`,
    subject: "🔑 Your Taskflow Password Reset OTP",
    html: `
    <div style="font-family: Arial, sans-serif; background-color: #f6f8fb; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
        <h1 style="color: #0052cc; text-align: center;">Password Reset Request</h1>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Hey <b>${username}</b>,  
          You requested to reset your password. Use the OTP below:
        </p>
        <div style="font-size: 24px; font-weight: bold; color: #0052cc; text-align: center; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #666;">
          This OTP is valid for <b>10 minutes</b>. If you didn’t request this, please ignore this email.
        </p>
        <a href="https://${process.env.CLIENT_URL}/user/forget/enter-otp" 
           style="display: inline-block; background-color: #0052cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
          Reset Password
        </a>
        <p style="margin-top: 30px; font-size: 14px; color: #888;">
          Cheers, <br> The Taskflow Team
        </p>
      </div>
    </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};
