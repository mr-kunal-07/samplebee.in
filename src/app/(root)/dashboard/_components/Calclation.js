
export const countDocs = (docs) => docs.length;


export const groupByMonth = (docs, dateField) => {
    const result = {};

    docs.forEach(item => {
        const date = item[dateField]?.toDate();
        if (!date) return;

        const month = date.toLocaleString("default", { month: "short" });
        result[month] = (result[month] || 0) + 1;
    });

    // Convert to [{value:1}, {value:5}, ...]
    return Object.keys(result).map(month => ({
        name: month,
        value: result[month],
    }));
};
