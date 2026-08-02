const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT) || 587,
    secure: false,

    auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASS,
    },
});

const sendEmail = async (email, subject, message) => {
    try {
        const info = await transporter.sendMail({
            from: {
                name: process.env.EMAIL_FROM_NAME || "Pointer",
                address: process.env.EMAIL_FROM,
            },

            to: email,
            subject,

            text: message,

            html: `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Pointer Email Verification</h2>

                    <p>${message}</p>

                    <p style="font-size: 13px; color: #666;">
                        This verification code expires in 5 minutes.
                    </p>
                </div>
            `,
        });

        console.log("Email sent successfully:", info.messageId);

        return info;
    } catch (error) {
        console.error("Email sending failed:", error.message);

        throw new Error("Failed to send verification email");
    }
};

module.exports = sendEmail;

// const sendEmail = async (email, subject, message) => {
//     console.log("==================================");
//     console.log("To:", email);
//     console.log("Subject:", subject);
//     console.log("Message:", message);
//     console.log("==================================");
// };

// module.exports = sendEmail;