import { resendClient, sender } from "../lib/resend"
import { createWelcomeEmailTemplate } from "./emailTemplates"



export const sendWelcomeEmail = async (email, name, clientURL) => {
    const { data, error } = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to our app",
        html: createWelcomeEmailTemplate(name, clientURL)
    })
    if (error) {
        console.error("Error sending welcom email", error);
        throw new Error("Failed to send welcome email");
    }
    console.log("Welcome Email sent successfully", data);
};