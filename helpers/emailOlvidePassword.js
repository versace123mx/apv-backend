import nodemailer from "nodemailer"

const emailOlvidePassword = async (data) => {
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
        subject: "Reestablecer Password",
        text: "Reestablecer Password",
        html: `<p>Hola ${nombre},</p>`
        + `<p>Para reestablecer tu password en APV, haz clic en el siguiente enlace.<br/>`
        + `<a href="${process.env.URL_CONFIRMAR}/olvide-password/${token}">Reestablecer Password`
        + `</a></p>`
        + `<p>Si tu no Solicitaste reestablecer tu password solo ignorar este email</p>`
    })
    console.log("Mensaje enviado: %s",info.messageId)
}

export default emailOlvidePassword