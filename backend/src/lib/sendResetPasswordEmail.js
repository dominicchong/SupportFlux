import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
  try {
    // 1. Configure transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // or use 'Outlook', 'Yahoo', or custom SMTP
      auth: {
        user: process.env.EMAIL_FROM,      // your email
        pass: process.env.EMAIL_PASSWORD,  // app password (not raw password)
      },
    });

    // 2. Email options
    const mailOptions = {
      from: `"Support Team" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html, // you can also use `text: "Plain text"` if needed
    };

    // 3. Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
};

export default sendEmail;



// import Resend from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function sendResetPasswordEmail(toEmail, resetToken) {
//   const resetLink = `https://yourapp.com/reset-password/${resetToken}`;

//   try {
//     const data = await resend.emails.send({
//       from: "supportflux@gmail.com", // your verified sender email
//       to: toEmail,
//       subject: "Reset Your Password",
//       html: `
//         <p>Hello,</p>
//         <p>Click the link below to reset your password:</p>
//         <a href="${resetLink}">${resetLink}</a>
//         <p>If you did not request this, please ignore this email.</p>
//       `,
//     });
//     console.log("Email sent:", data);
//   } catch (error) {
//     console.error("Error sending email with Resend:", error);
//     throw error;
//   }
// }
