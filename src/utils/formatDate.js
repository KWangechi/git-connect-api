const dateToday = new Date();

const currentYear = dateToday.getFullYear();
const currentMonth = dateToday.getMonth();
const currentDay = dateToday.getDay();

// Create a new Date object for the first day of the current month

// const firstDayOfMonth = new Date(currentYear, currentMonth, 1);

console.log(`Today's date: ${dateToday.toLocaleDateString()}`);

module.exports = { dateToday, currentYear, currentMonth, currentDay };
