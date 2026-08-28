const nodemailer = require("nodemailer");

const smtpPort =
    Number(process.env.BREVO_SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: smtpPort,

    // Port 465 uses SSL. Port 587 uses STARTTLS.
    secure: smtpPort === 465,

    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
    },
});

const sendEmail = async (
    email,
    subject,
    message,
    otp
) => {
    try {
        const recipientEmail = String(
            email || ""
        )
            .trim()
            .toLowerCase();

        const verificationCode = String(
            otp || ""
        ).trim();

        console.log(
            "Sending verification email to:",
            recipientEmail
        );

        if (!recipientEmail) {
            throw new Error(
                "Recipient email address is missing."
            );
        }

        if (!verificationCode) {
            throw new Error(
                "Verification code is missing."
            );
        }

        if (!process.env.EMAIL_FROM) {
            throw new Error(
                "EMAIL_FROM is missing from .env."
            );
        }

        const info = await transporter.sendMail({
            from: {
                name:
                    process.env.EMAIL_FROM_NAME ||
                    "Pointer",

                address: process.env.EMAIL_FROM,
            },

            to: recipientEmail,

            subject:
                subject ||
                "Pointer Email Verification",

            text:
                message ||
                `Your Pointer verification code is ${verificationCode}. This code expires in 5 minutes.`,

            html: `
                <!DOCTYPE html>

                <html lang="en">
                    <head>
                        <meta charset="UTF-8" />

                        <meta
                            name="viewport"
                            content="width=device-width, initial-scale=1.0"
                        />

                        <title>
                            Pointer Email Verification
                        </title>
                    </head>

                    <body style="
                        margin: 0;
                        padding: 0;
                        background-color: #f2f2f2;
                        font-family: Arial, Helvetica, sans-serif;
                    ">

                        <table
                            width="100%"
                            cellpadding="0"
                            cellspacing="0"
                            border="0"
                            style="
                                width: 100%;
                                background-color: #f2f2f2;
                                padding: 30px 15px;
                            "
                        >
                            <tr>
                                <td align="center">

                                    <table
                                        width="100%"
                                        cellpadding="0"
                                        cellspacing="0"
                                        border="0"
                                        style="
                                            width: 100%;
                                            max-width: 520px;
                                            background-color: #ffffff;
                                            border-radius: 18px;
                                            overflow: hidden;
                                            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.10);
                                        "
                                    >

                                        <!-- Header -->

                                        <tr>
                                            <td
                                                align="center"
                                                style="
                                                    background-color: #111111;
                                                    padding: 32px 20px;
                                                "
                                            >
                                                <h1 style="
                                                    margin: 0;
                                                    color: #ffffff;
                                                    font-size: 28px;
                                                    font-weight: 700;
                                                    letter-spacing: 8px;
                                                ">
                                                    POINTER
                                                </h1>

                                                <p style="
                                                    margin: 10px 0 0;
                                                    color: #999999;
                                                    font-size: 12px;
                                                    letter-spacing: 2px;
                                                ">
                                                    SAFETY • TRACKING • PROTECTION
                                                </p>
                                            </td>
                                        </tr>

                                        <!-- Content -->

                                        <tr>
                                            <td style="
                                                padding: 35px 32px 20px;
                                            ">
                                                <h2 style="
                                                    margin: 0;
                                                    color: #111111;
                                                    font-size: 22px;
                                                    text-align: center;
                                                ">
                                                    Email Verification
                                                </h2>

                                                <p style="
                                                    margin: 12px 0 0;
                                                    color: #777777;
                                                    font-size: 14px;
                                                    line-height: 22px;
                                                    text-align: center;
                                                ">
                                                    Use the verification code
                                                    below to continue with your
                                                    Pointer account.
                                                </p>

                                                <!-- OTP box -->

                                                <table
                                                    width="100%"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    border="0"
                                                    style="
                                                        width: 100%;
                                                        margin: 28px 0;
                                                        background-color: #f5f5f5;
                                                        border: 1px solid #e5e5e5;
                                                        border-radius: 14px;
                                                    "
                                                >
                                                    <tr>
                                                        <td
                                                            align="center"
                                                            style="
                                                                padding: 22px 15px;
                                                            "
                                                        >
                                                            <p style="
                                                                margin: 0 0 10px;
                                                                color: #999999;
                                                                font-size: 11px;
                                                                font-weight: 700;
                                                                letter-spacing: 2px;
                                                            ">
                                                                VERIFICATION CODE
                                                            </p>

                                                            <p style="
                                                                margin: 0;
                                                                padding-left: 12px;
                                                                color: #111111;
                                                                font-size: 34px;
                                                                font-weight: 700;
                                                                letter-spacing: 12px;
                                                            ">
                                                                ${verificationCode}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <!-- Expiry notice -->

                                                <table
                                                    width="100%"
                                                    cellpadding="0"
                                                    cellspacing="0"
                                                    border="0"
                                                    style="
                                                        width: 100%;
                                                        background-color: #fff8e6;
                                                        border-left: 4px solid #f0b429;
                                                        border-radius: 8px;
                                                    "
                                                >
                                                    <tr>
                                                        <td style="
                                                            padding: 13px 15px;
                                                        ">
                                                            <p style="
                                                                margin: 0;
                                                                color: #6f5a20;
                                                                font-size: 13px;
                                                                line-height: 20px;
                                                            ">
                                                                This verification
                                                                code will expire in
                                                                <strong>
                                                                    5 minutes
                                                                </strong>.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <!-- Security information -->

                                                <p style="
                                                    margin: 24px 0 0;
                                                    color: #888888;
                                                    font-size: 12px;
                                                    line-height: 19px;
                                                    text-align: center;
                                                ">
                                                    If you did not request this
                                                    code, you can safely ignore
                                                    this email. Never share your
                                                    verification code with
                                                    anyone.
                                                </p>
                                            </td>
                                        </tr>

                                        <!-- Footer -->

                                        <tr>
                                            <td
                                                align="center"
                                                style="
                                                    padding: 22px;
                                                    border-top: 1px solid #eeeeee;
                                                "
                                            >
                                                <p style="
                                                    margin: 0;
                                                    color: #aaaaaa;
                                                    font-size: 11px;
                                                ">
                                                    Developed by
                                                </p>

                                                <p style="
                                                    margin: 5px 0 0;
                                                    color: #111111;
                                                    font-size: 11px;
                                                    font-weight: 600;
                                                    letter-spacing: 1px;
                                                ">
                                                    Melbourne Institute of Technology
                                                </p>

                                                <p style="
                                                    margin: 14px 0 0;
                                                    color: #bbbbbb;
                                                    font-size: 10px;
                                                ">
                                                    © ${new Date().getFullYear()}
                                                    Pointer. All rights reserved.
                                                </p>
                                            </td>
                                        </tr>

                                    </table>

                                </td>
                            </tr>
                        </table>

                    </body>
                </html>
            `,
        });

        console.log(
            "Email sent successfully:",
            info.messageId
        );
        console.log("OTP IS: " , otp);

        return info;
    } catch (error) {
        console.error(
            "Email sending failed:",
            error.message
        );

        throw new Error(
            "Failed to send verification email"
        );
    }
};

module.exports = sendEmail;