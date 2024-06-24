import nodemailer from "nodemailer"

const emailRegistro = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // or 'STARTTLS'
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    //Enviamos el correo
    const { nombre, email, token } = data
    const info = await transporter.sendMail({
        from: '<uptask@gmail.com',
        to: email,
        subject: "APV Confirma tu cuenta",
        text: "Confirma tu cuenta en APV",
        html: `<p>Hola ${nombre},</p>`
        + `<p>Para confirmar tu cuenta en APV, haz clic en el siguiente enlace.<br/>`
        + `<a href="${process.env.URL_CONFIRMAR}/confirmar/${token}">Confirmar Cuenta`
        + `</a></p>`
        + `<p>Si tu no creaste esta cuenta puedes ignorar este email</p>`
    })
    console.log("Mensaje enviado: %s",info.messageId)
}

export default emailRegistro