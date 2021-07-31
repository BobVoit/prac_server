const getDateNow = () => {
    const dt = new Date();
    const date = dt.toLocaleDateString();
    const time = dt.toLocaleTimeString();
    return date + " " + time;
};

module.exports = getDateNow;