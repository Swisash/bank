import nodemailer from 'nodemailer';

// שימי לב שמחקנו את הייבוא של authRoutes כי הוא גרם ללולאה אינסופית
export const sendEmail = async (options) => {
    // create transporter - an object that holds all the connection details
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shiranswisa98@gmail.com',
            pass: 'xqsuaajfuetemwky' // ודאי שאין רווח מיותר בסוף הסיסמה
        }
    });

    // create mail content
    const mailOptions = {
        from: '"The Bank" <noreply@thebank.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `<b>${options.message}</b>`
    };

    // send the email
    await transporter.sendMail(mailOptions);
};