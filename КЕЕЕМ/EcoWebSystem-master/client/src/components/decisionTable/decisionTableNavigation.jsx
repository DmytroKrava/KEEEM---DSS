import React, { useState, useEffect } from 'react';
import "./decision-table.css";
import './decisionTableNavigation.css';
import * as DTAlgorithm from './decisionTableAlgorithms.js'
import { Button } from 'react-bootstrap';
import { CriterionsComparison } from './criterionsComparison.jsx';


export const DecisionTableNavigation = ({ 
    priorities, 
    alternatives, 
    setAlternatives, 
    setBestAlternativesPrice, 
    setSelectedOption, 
    selectedOption,
    setOptimismPessimismCoefficient,
    optimismPessimismCoefficient
}) => {

    const [isComparisonOpen, setIsComparisonOpen] = useState(false);
    const openComparison = () => setIsComparisonOpen(true);
    const closeComparison = () => setIsComparisonOpen(false);

    const criterions = [
        { value: "Vald", label: "Критерій Вальда" },
        { value: "Bayes-Laplace", label: "Критерій Байєса-Лапласа" },
        { value: "Savage", label: "Критерій Севіджа" },
        { value: "Hurvits", label: "Критерій Гурвіца" }
    ];

    const algorithms = {
        "Vald": DTAlgorithm.alternativesPricesVald,
        "Bayes-Laplace": DTAlgorithm.alternativesPricesBayesLaplas,
        "Savage": DTAlgorithm.alternativesPricesSavage,
        "Hurvits": DTAlgorithm.alternativesPricesHurvits
    };


    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        const algorithm = algorithms[event.target.value];
        let alternativesGeneralPrices;
    
        if (event.target.value === "Hurvits") {
            alternativesGeneralPrices = algorithm(alternatives, optimismPessimismCoefficient);
        } else {
            alternativesGeneralPrices = algorithm(alternatives, priorities);
        }
    
        setAlternatives(prev => {
            const updatedAlternatives = { ...prev };
            Object.keys(updatedAlternatives)
                .filter(key => key !== 'general')
                .forEach(alternative => {
                    if (Object.keys(updatedAlternatives[alternative]).length > 1) {
                        updatedAlternatives[alternative]["general"] = alternativesGeneralPrices[alternative];
                        alternatives[alternative]["general"] = alternativesGeneralPrices[alternative];
                    } else {
                        updatedAlternatives[alternative]["general"] = null;
                        alternatives[alternative]["general"] = null;
                    }
                });
            return updatedAlternatives;
        });
    
        let overallPrice ;
        if (event.target.value !== "Savage") {
            overallPrice  = DTAlgorithm.countMaxPrice(alternativesGeneralPrices);
        } else {
            overallPrice  = DTAlgorithm.countMinPrice(alternativesGeneralPrices);
        }
        setBestAlternativesPrice(overallPrice );
    };


    // copy
    const handleKeyDown = (event) => {      // обмеження на ввід символів
        let [valueIntegerPart, valueDecimalPart] = event.target.value.toString().split('.');
        const invalidChars = ["e", "E", "+", "-"];
        if (invalidChars.includes(event.key) 
            || (valueDecimalPart && valueDecimalPart.length >= 2 && event.key !== 'Backspace')) {
            event.preventDefault();
        }
    };


    const handleCoefficientChange = (event) => {
        let value = parseFloat(event.target.value);

        if (isNaN(value) || value < 0 || value > 1) {
            return;
        }
        setOptimismPessimismCoefficient(value);

        if (selectedOption === "Hurvits") {
            setAlternatives(prev => {
                const updatedAlternatives = {...prev};

                let alternativesGeneralPrices = DTAlgorithm.alternativesPricesHurvits(alternatives, value);
                Object.keys(updatedAlternatives).forEach(alternative => { 
                    updatedAlternatives[alternative]["general"] = alternativesGeneralPrices[alternative];
                });

                let overallPrice  = DTAlgorithm.countMaxPrice(alternativesGeneralPrices);
                setBestAlternativesPrice(prev => {
                    prev = overallPrice ;
                    return prev;
                });
                return updatedAlternatives;
            });
        }
    };


    useEffect(() => {
    }, [selectedOption]);

    return (
        <div className="container ">
            <div className="decision-navigation-panel">
                <div className='criterions'>
                    <div className='criterions-header'>
                        Оберіть критерій:
                    </div>

                    {criterions.map((criterion, index) => (
                        <div className="criterion-item" key={criterion.value}>
                            <input 
                                type="radio" 
                                name="criterion" 
                                value={criterion.value}
                                onChange={handleOptionChange} 
                                checked={selectedOption === criterion.value}
                                id={`criterion-${index}`}
                            />
                            <label htmlFor={`criterion-${index}`}>
                                {criterion.label}
                            </label>
                        </div>
                    ))}
                </div>

                <div 
                    id="optimism-pessimism-field" 
                    style={{ display: selectedOption === "Hurvits" ? "block" : "none" }} 
                >
                    <label>
                        <span className="label-text">Коефіцієнт оптимізму-писемізму (α): </span>
                        <input 
                            id="optimism-pessimism-coefficient"
                            type="number" 
                            name="optimism-pessimism-coefficient" 
                            defaultValue={optimismPessimismCoefficient} 
                            min="0" 
                            max="1" 
                            step="0.01"
                            onKeyDown={handleKeyDown}
                            onChange={handleCoefficientChange}
                        /> 
                    </label>                       
                </div>

                <div className="comparison-button">
                    <Button variant="btn btn-secondary" color='light' onClick={openComparison}>
                        Порівняння альтернатив
                    </Button> 
                </div>
            </div>

            <CriterionsComparison 
                isOpen={isComparisonOpen} 
                hideComparison={closeComparison} 
                alternatives={alternatives} 
                criterions={criterions}
                algorithms={algorithms}
                priorities={priorities}
                optimismPessimismCoefficient={optimismPessimismCoefficient} />
        </div>
    );
}
