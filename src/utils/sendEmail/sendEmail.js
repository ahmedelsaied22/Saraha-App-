import nodeMailer from 'nodemailer'

export const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodeMailer.createTransport({
        host: process.env.HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        service: 'gmail',
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    })
    const main = async () => {
        const info = await transporter.sendMail({
            from: `SarahaApp <${process.env.USER}> `,
            to,
            subject,
            html
        })
    }
    main().catch((err) => {
        console.log({ emailError: err });
    })
}