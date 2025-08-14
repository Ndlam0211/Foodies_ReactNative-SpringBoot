import emailjs from "@emailjs/browser";
import Config from "react-native-config"; // nếu dùng react-native-config để lấy key từ .env

export async function sendForgotPasswordEmail(
  email: string,
  link: string
) {
  try {
    const serviceId = "service_ocn8c1q";
    const templateId = 'template_406liya';
    const publicKey = "IUHbPPgmY8Vr_Mekz";

    console.log(serviceId);
    console.log(templateId);
    console.log(publicKey);
    
    

    const templateParams = {
      email: email,
      link: link, // có thể là mã OTP hoặc link reset
    };

    const res = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );
    console.log("Email sent:", res.status, res.text);
    return true;
  } catch (error) {
    console.error("Failed to send email:", error);
    return false;
  }
}
