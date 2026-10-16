const { Resend } = require('resend');

exports.sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof message !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return res.status(400).send('Please fill in all fields.');
    }

    if (
      name.trim().length > 100 ||
      email.trim().length > 254 ||
      message.trim().length > 5000 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      return res.status(400).send('Please check your information.');
    }

    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL) {
      throw new Error('Contact email configuration is missing.');
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: 'Byte Shadow <noreply@byteshadow.art>',
      to: [process.env.CONTACT_EMAIL],
      replyTo: email.trim(),
      subject: `New Contact Message from ${name.trim()}`,
      text: [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        '',
        'Message:',
        message.trim()
      ].join('\n')
    });

    if (error) {
      console.error('CONTACT EMAIL ERROR:', error);
      throw new Error('Failed to send contact message.');
    }

    console.log('Contact message email sent successfully.');

    return res.redirect('/?contact=success#contact');
  } catch (err) {
    console.error('Failed to send contact message:', err);
    return res.redirect('/?contact=error#contact');
  }
};
