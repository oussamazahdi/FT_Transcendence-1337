export function getEmailLetter(code)
{
    return `<!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Email Verification</title>
                        </head>
                        <body>
                            <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
                                <tr>
                                    <td align="center">
                                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #2a2a3e; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
                                            <tr>
                                                <td style="padding: 50px 40px;">
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td align="center" style="padding-bottom: 40px;">
                                                                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                                                                    <span style="font-size: 40px;">🏓</span>
                                                                </div>
                                                                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">ft_transcendence</h1>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <h2 style="color: #ffffff; margin: 0 0 15px 0; font-size: 22px; text-align: center;">Verify Your Email</h2>
                                                    <p style="color: #a0a0b0; font-size: 15px; line-height: 1.6; margin: 0 0 40px 0; text-align: center;">
                                                        Enter your verification code
                                                    </p>
                                                    <table width="100%" cellpadding="0" cellspacing="0">
                                                        <tr>
                                                            <td align="center">
                                                                <div style="background-color: #1a1a2e; border: 2px solid #667eea; border-radius: 12px; padding: 25px 40px;">
                                                                    <span style="font-size: 48px; font-weight: bold; letter-spacing: 15px; color: #667eea;">{{OTP_CODE}}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                    
                                                    <p style="color: #a0a0b0; font-size: 14px; margin: 30px 0 0 0; text-align: center;">
                                                        Expires in <span style="color: #667eea;">10 minutes</span>
                                                    </p>
                                                    
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="background-color: #1a1a2e; padding: 20px; text-align: center; border-radius: 0 0 16px 16px;">
                                                    <p style="color: #707080; font-size: 12px; margin: 0;">
                                                        © 2025 ft_transcendence
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </body>
                        </html>`.replace("{{OTP_CODE}}", code);
}