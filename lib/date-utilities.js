'use strict';

class DateUtilities {

    /**
     * Seconds between a start and end date
     * @param startDate
     * @param endDate
     * @returns {number}
     */
    static secondsBetween(startDate, endDate) {
        const dif = endDate - startDate;
        const secondsFromStartToEnd = dif / 1000;
        return Math.abs(secondsFromStartToEnd);
    }
}

module.exports = DateUtilities;
