from flask import Flask, request, jsonify
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os

app = Flask(__name__)

@app.route('/send-email', methods=['POST'])
def send_email():
    try:
        email = request.form['email']
        password = request.form['password']
        recipients = request.json['recipients']
        subject = request.form['subject']
        message = request.form['message']
        attachments = request.files.getlist('attachments')

        msg = MIMEMultipart()
        msg['From'] = email
        msg['To'] = ", ".join(recipients)
        msg['Subject'] = subject

        msg.attach(MIMEText(message, 'plain'))

        # Anhänge hinzufügen
        for attachment in attachments:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header('Content-Disposition', f'attachment; filename={attachment.filename}')
            msg.attach(part)

        # Verbindung zu SMTP-Server herstellen und E-Mail senden
        with smtplib.SMTP('smtp.gmail.com', 587) as server:
            server.starttls()
            server.login(email, password)
            server.sendmail(email, recipients, msg.as_string())

        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e), 'error': repr(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
