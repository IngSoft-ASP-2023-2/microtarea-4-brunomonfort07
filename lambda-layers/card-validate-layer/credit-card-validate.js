const validateCreditCard = (cardNumber) => {
    const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/; // Visa: Starts with 4, 13 or 16 digits
    const masterRegex = /^5[1-5][0-9]{14}$/;       // MasterCard: Starts with 51-55, 16 digits

    if (visaRegex.test(cardNumber)) {
        return "VISA";
    } else if (masterRegex.test(cardNumber)) {
        return "MASTERCARD";
    }
    throw new Error("Invalid credit card number.");
};

module.exports = { validateCreditCard };