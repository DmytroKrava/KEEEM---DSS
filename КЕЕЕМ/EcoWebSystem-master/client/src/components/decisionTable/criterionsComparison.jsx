import React, { useEffect } from 'react';
import './criterionsComparison.css';
import { Button } from 'react-bootstrap';


export const CriterionsComparison = ({ 
    isOpen, 
    hideComparison, 
    alternatives, 
    criterions,
    algorithms,
    priorities,
    optimismPessimismCoefficient
}) => {   

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }
        
        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isOpen]);


    if (!isOpen) return null;


    function alternativesPricesWithAllAlgorithms (
        alternatives, 
        criterions, 
        algorithms, 
        priorities, 
        optimismPessimismCoefficient) 
    {
        let alternativesPrices = {};
        criterions.forEach(criterion => {
            let algorithm = algorithms[criterion.value];
            if (criterion.value === "Hurvits") {
                alternativesPrices[criterion.value] = algorithm(alternatives, optimismPessimismCoefficient);
            } else {
                alternativesPrices[criterion.value] = algorithm(alternatives, priorities);
            }
        });
        return alternativesPrices;
    }


    function calculateBestPrices (alternativesAlgorithmsCounts) {
        let bestPrices = {};

        Object.keys(alternativesAlgorithmsCounts).forEach(alternative => {
            if (alternative === "Savage") {
                bestPrices["Savage"] = Math.min(...Object.values(alternativesAlgorithmsCounts[alternative]))
            } else {
                bestPrices[alternative] = Math.max(...Object.values(alternativesAlgorithmsCounts[alternative]))
            }
        });
        return bestPrices;
    }

    let alternativesAlgorithmsCounts = alternativesPricesWithAllAlgorithms (
        alternatives, 
        criterions, 
        algorithms, 
        priorities, 
        optimismPessimismCoefficient
    );
    let bestCriterionsPrices = calculateBestPrices (alternativesAlgorithmsCounts);


  return (
    <div className="modal-overlay" onClick={hideComparison}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="alternatives-rating-header">
            <h2>Порівняння альтернатив за критеріями</h2>
        </div>

        <div className='comparison-table-container'>
            <table className='comparison-table'>
                <thead>
                    <tr>                
                        <th>Альтернатива</th>
                        {  
                            criterions.map((currCriterion, index) => (
                                <th key={`${criterions[index].label}-header`}>{criterions[index].label}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(alternatives).map((alternative, index) => (
                            <tr key={`${alternative}-row`}>     
                                <td>{ alternative }</td>
                                {
                                    criterions.map((currCriterion, index) => (
                                        <td key={`${alternative}-${criterions[index].value}`}>
                                            { alternativesAlgorithmsCounts[criterions[index].value][alternative] }
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td>Найкращі оцінки:</td>
                        {
                            criterions.map((currCriterion, index) => (
                                <td key={`best-prices-${criterions[index].value}`}>
                                    { bestCriterionsPrices[criterions[index].value] }
                                </td>
                            ))
                        }
                    </tr>
                </tfoot>
            </table>
        </div>

        <div className="close-btn">
            <Button onClick={hideComparison}>Закрити</Button>
        </div>
      </div>
    </div>
  );
};
