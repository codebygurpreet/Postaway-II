// Third-party packages
import nodemailer from 'nodemailer';
import ApplicationError from '../utils/applicationError.js';

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });
    } catch (err) {
        throw new ApplicationError("Failed to send email", 500);
    }
}

export default sendEmail;