from fastapi import HTTPException, status
from pydantic import EmailStr
from config.core import settings
from smtplib import SMTP
from email.mime.text import MIMEText
from jinja2 import Environment, FileSystemLoader, select_autoescape
from pathlib import Path

SERVER = settings.MAIL_SERVER
USERNAME = settings.MAIL_USERNAME
PASSWORD = settings.MAIL_PASSWORD
PORT = settings.MAIL_PORT

# Get the absolute path to the template folder
template_folder = Path(__file__).resolve().parent / "templates/email"

# Ensure the template folder exists
if not template_folder.exists():
    raise FileNotFoundError(f"Template folder not found: {template_folder}")

# Configure Jinja2 environment
template_env = Environment(
    loader=FileSystemLoader(template_folder),
    autoescape=select_autoescape(["html", "xml"]),
)


async def send_email(subject: str, email_to: EmailStr, html_content: str):
    print(f"Sending email with subject: {subject} to {email_to}")
    sender = settings.MAIL_FROM
    destination = [email_to]

    try:
        msg = MIMEText(html_content, "html")
        msg["Subject"] = subject
        msg["From"] = sender
        msg["To"] = email_to

        with SMTP(SERVER, PORT) as conn:
            conn.starttls()
            conn.login(USERNAME, PASSWORD)
            conn.sendmail(sender, destination, msg.as_string())
            print(f"Email sent successfully to {email_to}")

    except Exception as e:
        print(f"Failed to send email: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e)
        )


async def send_email_flight_status_change(
    subject: str, email_to: EmailStr, body: dict, msg: str
):
    template_name = "flight_status_change.html"

    # Render the HTML template
    try:
        template = template_env.get_template(template_name)
        html_content = template.render(flight=body, msg=msg)
    except Exception as e:
        print(f"Failed to render email template: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to render email template",
        )

    await send_email(subject, email_to, html_content)


async def send_email_flight_subscription(
    subject: str, email_to: EmailStr, body: dict, msg: str
):
    template_name = "flight_subscription.html"

    # Render the HTML template
    try:
        template = template_env.get_template(template_name)
        html_content = template.render(flight=body, msg=msg)
    except Exception as e:
        print(f"Failed to render email template: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to render email template",
        )

    await send_email(subject, email_to, html_content)
