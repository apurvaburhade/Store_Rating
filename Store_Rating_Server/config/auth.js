module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key_change_in_production',
    JWT_EXPIRES_IN: '7d'
};