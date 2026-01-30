"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const mail_service_1 = require("../services/mail.service");
const sendEmail = async (req, res) => {
    try {
        const { to, subject } = req.body;
        if (!to || !subject) {
            return res.status(400).json({
                success: false,
                message: "Missing fields",
            });
        }
        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
</head>
<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:30px 0;">
    <tr>
      <td align="center">

        <!-- Container -->
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed);padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Logo -->
                  <td width="60" align="left" style="vertical-align:middle;">
                    <img 
                      src="https://drive.google.com/uc?export=view&id=1hw4jemXyDjcvnX-g4KXPEGuw2qzs_6Ur"
                      alt="Elite Fund"
                      width="48"
                      style="display:block;border-radius:10px;"
                    />
                  </td>

                  <!-- Text -->
                  <td align="left" style="vertical-align:middle;color:white;padding-left:12px;">
                    <h1 style="margin:0;font-size:22px;line-height:1;">Elite Fund</h1>
                    <p style="margin:4px 0 0;font-size:13px;opacity:0.9;">
                      Web site Platform
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>



          <tr>
            <td style="padding:30px;color:#333;">
              <h2 style="margin-top:0;color:#111;">Welcome to Elite Fund 👋</h2>
              <p style="font-size:15px;line-height:1.7;color:#555;">
                ทดสอบการแจ้งเตือน System Elite Fund
              </p>

              <div style="margin:24px 0;padding:18px;background:#f1f5ff;border-radius:8px;border-left:4px solid #4f46e5;">
                <p style="margin:0;font-size:14px;color:#333;">
                  🔐 แพลตฟอร์มกู้เงินอัจฉริยะ ที่เร็ว ปลอดภัย และโปร่งใส กู้เงินง่ายในไม่กี่คลิก อนุมัติไว ด้วยระบบเทคโนโลยีอัจฉริยะ ไม่ต้องเดินทาง ไม่ต้องรอคิวนาน
                </p>
              </div>

              <p style="font-size:15px;color:#555;">
                Click the button below to explore your dashboard and start your journey with us.
              </p>

              <div style="text-align:center;margin:30px 0;">
                <a href="https://elitefund.com" 
                   style="background:#4f46e5;color:white;text-decoration:none;padding:12px 28px;border-radius:999px;font-size:15px;font-weight:bold;display:inline-block;">
                  Go to Dashboard
                </a>
              </div>

              <p style="font-size:14px;color:#777;">
                If you have any questions, feel free to contact our support team anytime.
              </p>

              <p style="margin-top:30px;font-size:14px;color:#777;">
                Best regards,<br/>
                <strong>Elite Fund Team</strong>
              </p>
            </td>
          </tr>

          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#999;">
              © 2026 Elite Fund. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
        await (0, mail_service_1.sendMail)({ to, subject, html });
        res.status(200).json({
            success: true,
            message: "Email sent successfully",
        });
    }
    catch (error) {
        console.error("Send mail error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send email",
        });
    }
};
exports.sendEmail = sendEmail;
