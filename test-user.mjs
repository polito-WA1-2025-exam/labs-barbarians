import crypto from 'crypto';

const password = 'test'; // <-- replace with the password you want for ali
const salt = crypto.randomBytes(16).toString('hex');

crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
  if (err) throw err;
  console.log('salt:', salt);
  console.log('hashedPassword:', hashedPassword.toString('hex'));
});