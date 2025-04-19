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
    from: "Taskflow",
    subject: "Welcome to Taskflow",
    text: `Hey ${username},\n\nThanks for registering at Taskflow!\n\nCheers,\Taskflow Team`,
  };
  await transporter.sendMail(mailOptions);
};
export const forgetPasswordEmail = async (to:string,username:string,otp:string)=>{
  const mailOptions={
    to,
    text:`Hey ${username},\n\n this is your OTP: ${otp}\n\n It is valid for next 10 minutes.`
  }
  await transporter.sendMail(mailOptions)
}