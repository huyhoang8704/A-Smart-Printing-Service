function getCeilingNumber(num) {
    if (num === Math.floor(num)) return num;
    else {
        return Math.floor(num) + 1;
    }
}

module.exports = { getCeilingNumber };
