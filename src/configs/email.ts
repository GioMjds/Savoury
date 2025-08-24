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
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Savoury OTP Verification</title>
            <style>
                /* Base styles */
                body {
                    font-family: 'Kumbh Sans', ui-sans-serif, system-ui, sans-serif;
                    background-color: #f1f8e8;
                    margin: 0;
                    padding: 0;
                    color: #1a1a1a;
                    line-height: 1.5;
                }

                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                }

                .content {
                    padding: 2rem;
                }

                .header {
                    text-align: center;
                    padding: 1.5rem 0;
                    background-color: #ffffff;
                    border-bottom: 1px solid #e5e7eb;
                }

                .logo {
                    height: 40px;
                }

                h1 {
                    font-size: 1.875rem;
                    color: #55ad9b;
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                    line-height: 1.25;
                }

                h2 {
                    font-size: 1.25rem;
                    color: #1a1a1a;
                    margin-top: 1.5rem;
                    margin-bottom: 0.5rem;
                }

                p {
                    margin-bottom: 1rem;
                    font-size: 1rem;
                }

                .otp-container {
                    text-align: center;
                    margin: 2rem 0;
                }

                .otp-code {
                    display: inline-block;
                    background-color: #d8efd3;
                    color: #1a1a1a;
                    font-size: 2.25rem;
                    font-weight: bold;
                    letter-spacing: 0.5rem;
                    padding: 1rem 1.5rem;
                    border-radius: 0.5rem;
                    margin: 1rem 0;
                }

                .divider {
                    height: 1px;
                    background-color: #e5e7eb;
                    margin: 2rem 0;
                }

                .footer {
                    text-align: center;
                    padding: 1.5rem;
                    font-size: 0.875rem;
                    color: #6b7280;
                    background-color: #f9fafb;
                }

                .button {
                    display: inline-block;
                    background-color: #55ad9b;
                    color: #ffffff;
                    text-decoration: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.375rem;
                    margin: 1rem 0;
                }

                .button:hover {
                    background-color: #3a8e7a;
                }

                .warning {
                    background-color: #fef3c7;
                    border-left: 4px solid #f59e0b;
                    padding: 1rem;
                    margin: 1.5rem 0;
                }

                /* Responsive styles */
                @media (max-width: 640px) {
                    .content {
                        padding: 1rem;
                    }

                    h1 {
                        font-size: 1.5rem;
                    }

                    .otp-code {
                        font-size: 1.875rem;
                        letter-spacing: 0.25rem;
                        padding: 0.75rem 1rem;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/savoury-logo.png" alt="Savoury Logo" class="logo">
                </div>

                <div class="content">
                    <h1>Verify Your Account</h1>
                    <p>Hello there,</p>
                    <p>Thank you for choosing Savoury! To complete your account registration, please use the following verification code:</p>

                    <div class="otp-container">
                        <div class="otp-code">${otp}</div>
                    </div>

                    <p>This verification code will expire in <strong>5 minutes</strong>. Enter this code in the verification screen to complete your registration.</p>

                    <div class="warning">
                        <p><strong>Important:</strong> Never share this verification code with anyone. Savoury will never ask for your verification code via email, phone, or text message.</p>
                    </div>

                    <p>If you didn't request this code, please ignore this email or contact support if you have concerns.</p>

                    <div class="divider"></div>

                    <p>Need help? <a href="savoury@gmail.com" style="color: #55ad9b;">Contact our support team</a></p>
                </div>

                <div class="footer">
                    <p>© ${new Date().getFullYear()} Savoury. All rights reserved.</p>
                    <p>You're receiving this email because you recently created a new Savoury account or added a new email address.</p>
                </div>
            </div>
        </body>
        </html>
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