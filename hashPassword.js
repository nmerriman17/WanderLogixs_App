const bcrypt = require('bcryptjs');

const passwordToHash = 'demoversionpassword'; 

bcrypt.hash(passwordToHash, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }
    console.log('Hashed Password:', hash);
});
