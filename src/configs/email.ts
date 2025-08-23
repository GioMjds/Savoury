import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

export async function sendOtpEmail(email: string, otp: string) {
    const htmlTemplate = `
    
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Savoury OTP Verification",
        html: htmlTemplate,
        text: `
            Welcome to Savoury!

            Your verification code is: ${otp}

            This OTP code will expire within 5 minutes. Please use it to complete account registration

            Never share this verification OTP to anyone. Savoury will never ask for your verification code via email.

            If you did not request this OTP, please ignore this email.

            © ${new Date().getFullYear()} Savoury. All rights reserved.
        `
    }

    await transporter.sendMail(mailOptions);
}