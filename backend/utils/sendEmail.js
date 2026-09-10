import nodemailer from "nodemailer";

export const sendEmail=async(options)=>{
    const transport=nodemailer.createTransport({
        service:process.env.SERVICE,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.APP_PASSWORD
        }
    })

    const mailOptions={
        from:process.env.EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    await transport.sendMail(mailOptions);
}