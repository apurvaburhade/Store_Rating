// Validation helper functions

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // 8-16 characters, at least one uppercase and one special character
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;
    return passwordRegex.test(password);
};

const validateName = (name) => {
    // Min 20 characters, Max 60 characters
    return name.length >= 20 && name.length <= 60;
};

const validateAddress = (address) => {
    // Max 400 characters
    return address.length > 0 && address.length <= 400;
};

const validateRating = (rating) => {
    // Rating between 1 to 5
    const ratingNum = parseInt(rating);
    return ratingNum >= 1 && ratingNum <= 5;
};

module.exports = {
    validateEmail,
    validatePassword,
    validateName,
    validateAddress,
    validateRating
};
