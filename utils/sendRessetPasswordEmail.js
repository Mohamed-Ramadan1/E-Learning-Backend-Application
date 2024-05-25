import createMailTransporter from './email.js';

const sendResetPasswordEmail = (user) => {
  const transport = createMailTransporter();
  const mailOptions = {
    from: 'Learning website <MohamedRamadanMeray@outlook.com>',
    to: user.email,
    subject: 'Verify your email',
    html: `<p>Hello ${user.name},if you tray to reset your password please click here :
     <a href="http://127.0.0.1:3000/api/v1/auth/resetPassword/${user.passwordResetToken}">
       reset your  password
     </a>
   </p>
   <p>If you not tray to reset your password just ignore this.
   `,
  };
  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err.message);
    } else {
      console.log('reset password email sent');
    }
  });
};

export default sendResetPasswordEmail;
