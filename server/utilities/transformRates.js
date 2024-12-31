function transformRates (rates) {
    return Object.entries(rates).reduce((acc, [ key, value ]) => {
            acc[key] = {
                ...value,
                price: parseFloat(value.price),
                buy: parseFloat(value.buy),
                sell: parseFloat(value.sell),
            };
            return acc;
        }, {}
    )
}

module.exports = transformRates