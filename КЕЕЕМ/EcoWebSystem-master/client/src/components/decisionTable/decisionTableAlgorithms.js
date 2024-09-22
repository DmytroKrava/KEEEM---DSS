export function countMaxPrice(allAlthernatives) {
    if (Object.keys(allAlthernatives).length < 1) {
        return null;
    }
    
    let maxPrice = allAlthernatives[Object.keys(allAlthernatives)[0]];
    Object.keys(allAlthernatives).forEach(althernative => {
        if (maxPrice < allAlthernatives[althernative]) {
            maxPrice = allAlthernatives[althernative];
        }
    });
    
    return maxPrice;
}


export function countMinPrice(allAlthernatives) {
    if (Object.keys(allAlthernatives).length < 1) {
        return null;
    }
    
    let minPrice = allAlthernatives[Object.keys(allAlthernatives)[0]];
    Object.keys(allAlthernatives).forEach(althernative => {
        if (minPrice > allAlthernatives[althernative]) {
            minPrice = allAlthernatives[althernative];
        }
    });

    return minPrice;
}


export function alternativesPricesVald(alternatives, priorities) {
    let alternativesMinPrices = {};
    Object.keys(alternatives).forEach(althernative => {
        Object.keys(alternatives[althernative]).filter(key => key !== "general").forEach(factorName => {
            if (!alternativesMinPrices[althernative]
            || alternativesMinPrices[althernative] > alternatives[althernative][factorName] * priorities[factorName]) {
                alternativesMinPrices[althernative] = alternatives[althernative][factorName] * priorities[factorName];
            }
        });
    });

    return alternativesMinPrices;
}


export function alternativesPricesBayesLaplas(alternatives, priorities) {
    let alternativesMinPrices = {};

    Object.keys(alternatives).forEach(althernative => {
        let i = 0;
        Object.keys(alternatives[althernative]).filter(key => key !== "general").forEach(factorName => {
            if (!alternativesMinPrices[althernative]) {
                alternativesMinPrices[althernative] = alternatives[althernative][factorName];
            }
            else {
                alternativesMinPrices[althernative] += alternatives[althernative][factorName];
            }
            i++;
        });
        if (i > 0) {
            alternativesMinPrices[althernative] /= i;
        }

        let [valueIntegerPart, valueDecimalPart] = alternativesMinPrices[althernative].toString().split('.');
        if (valueDecimalPart && valueDecimalPart.length > 2) {
            alternativesMinPrices[althernative] = parseFloat(alternativesMinPrices[althernative].toFixed(2));
        }
    });

    return alternativesMinPrices;
}


export function alternativesPricesSavage(alternatives) {
    let alternativesMaxPrices = {};

    Object.keys(alternatives).forEach(alternative => {
        alternativesMaxPrices[alternative] = alternatives[alternative][Object.keys(alternatives[alternative])
        .filter(key => key !== "general")[0]];
        
        Object.keys(alternatives[alternative]).filter(key => key !== "general").forEach(factorName => {
            if (alternativesMaxPrices[alternative] < alternatives[alternative][factorName]) {
                alternativesMaxPrices[alternative] = alternatives[alternative][factorName];
            }
        });
    });

    let losesMatrix = {}
    Object.keys(alternatives).forEach(alternative => {
        losesMatrix[alternative] = 
            alternativesMaxPrices[alternative] -
            alternatives[alternative][Object.keys(alternatives[alternative]).filter(key => key !== "general")[0]];

        Object.keys(alternatives[alternative]).filter(key => key !== "general").forEach(factorName => {
            if (losesMatrix[alternative] < alternativesMaxPrices[alternative] - alternatives[alternative][factorName]) {
                losesMatrix[alternative] = alternativesMaxPrices[alternative] - alternatives[alternative][factorName];
            }
        });
    });

    return losesMatrix;
}


export function alternativesPricesHurvits(alternatives, optimismPessimismCoefficient) {
    let alternativesPrices = {};

    Object.keys(alternatives).forEach(alternative => {
        let fisrtFactor = Object.keys(alternatives[alternative]).filter(key => key !== "general")[0];
        let maxPrice = alternatives[alternative][fisrtFactor];
        let minPrice = alternatives[alternative][fisrtFactor];

        Object.keys(alternatives[alternative]).filter(key => key !== "general").forEach(factorName => {
            if (alternatives[alternative][factorName] > maxPrice) {
                maxPrice = alternatives[alternative][factorName];
            }
            if (alternatives[alternative][factorName] < minPrice) {
                minPrice = alternatives[alternative][factorName];
            }
        });
        alternativesPrices[alternative] = optimismPessimismCoefficient * maxPrice + (1 - optimismPessimismCoefficient) * minPrice;

        let [valueIntegerPart, valueDecimalPart] = alternativesPrices[alternative].toString().split('.');
        if (valueDecimalPart && valueDecimalPart.length > 2) {
            alternativesPrices[alternative] = parseFloat(alternativesPrices[alternative].toFixed(2));
        }
    });

    return alternativesPrices;
}
