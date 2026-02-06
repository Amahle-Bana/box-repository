from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags


# Function To Send The Reset Password Email
def send_password_reset_email(email, reset_token):
    """
    Send a password reset email to the user.
    
    Args:
        email (str): The user's email address
        reset_token (str): The JWT token for password reset
    """

    # Create the reset link
    reset_link = f"{settings.FRONTEND_URL}/authentication/changepassword?token={reset_token}"
    
    # Email subject
    subject = 'Reset Your SOMA Password'
    
    # Email message
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center;">
                    <img src="{settings.FRONTEND_URL}/public/somapng.png" alt="Soma AI" style="width: 100px; height: auto; margin-bottom: 8px;" />
                    <h1 style="font-weight: bold; font-size: 18px; color: rgb(2, 8, 23); margin-bottom: 16px;">Soma AI</h1>
                </div>
                <h2 style="color: rgb(2, 8, 23);">Password Reset Request</h2>
                <p style="color: rgb(2, 8, 23);">Hello,</p>
                <p style="color: rgb(2, 8, 23);">We received a request to reset your password for your SOMA account. Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_link}" 
                       style="background-color: rgb(2, 8, 23); color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; display: inline-block;">
                        Reset Password
                    </a>
                </div>
                <p style="color: rgb(2, 8, 23);">If you didn't request this password reset, you can safely ignore this email.</p>
                <p style="color: rgb(2, 8, 23);">This link will expire in 1 hour.</p>
                <p style="color: rgb(2, 8, 23);">Best regards,<br>The SOMA Team</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    If the button above doesn't work, copy and paste this link into your browser:<br>
                    <span style="color: #2c3e50;">{reset_link}</span>
                </p>
            </div>
        </body>
    </html>
    """
    
    # Plain text version of the message
    plain_message = strip_tags(html_message)
    
    # Trying To Send The Email
    try:
        # Sending The Email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False 