const { scrypt, randomBytes, timingSafeEqual } = require('crypto');
const { promisify } = require('util');
 
const asyncScrypt = promisify(scrypt);

//TODO: add try catch

class Password{
    static async toHashString(password) {
        const salt = randomBytes(16).toString('hex');
        const buffer = await asyncScrypt(password, salt, 64)
        return `${buffer.toString('hex')}.${salt}`
    }

    static async compare(originalPass, sourcePass){
        const [hash, salt] = originalPass.split('.');
        const sourceKeyBuffer = Buffer.from(hash, 'hex');
        const derivedKey = await asyncScrypt(sourcePass, salt, 64)
        return timingSafeEqual(sourceKeyBuffer, derivedKey);
    }
}

module.exports = { Password }