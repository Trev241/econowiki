from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

def sendMail(to_addr, subject, body):
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()
    s.login("testman19361@gmail.com", "vhcydfrbvtfbmqet")

    message = MIMEMultipart('alternative')
    message['Subject'] = f'WORLD INCOME - {subject}'
    message['From'] = "testman19361@gmail.com"

    message['To'] = to_addr
    html = f'''
        <html>
            <head></head>
            <body>
                {body}
            </body>
        </html>
    '''
    message.attach(MIMEText(html, 'html'))
    s.sendmail("testman19361@gmail.com", to_addr, message.as_string())