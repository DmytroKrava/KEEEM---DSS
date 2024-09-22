import React, { useEffect } from 'react';
import './decisionRating.css';
import { Button, Table } from 'react-bootstrap';


export const DecisionRating = ({ 
    isOpen, 
    hideRating, 
    
    alternatives, 
    setFactors, 
    setPriorities, 
    setAlternatives, 
    setBestAlternativesPrice, 
    setNavigationReloadKey, 
    selectedOption 
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

    function getRating(alternatives) {
        if (selectedOption !== "Savage") {
            return Object.keys(alternatives).sort((a, b) => {
                return alternatives[a].general - alternatives[b].general;
            }).reverse();
        }
        else {
            return Object.keys(alternatives).sort((a, b) => {
                return alternatives[a].general - alternatives[b].general;
            });
        }
    }

    let alternativesRating = getRating(alternatives);

    function clearLocalStorage() {
        localStorage.removeItem('optimism-pessimism-coefficient');
        localStorage.removeItem('selected-criterion');
        localStorage.removeItem('factors');
        localStorage.removeItem('priorities');
        localStorage.removeItem('alternatives');
        localStorage.removeItem('bestAlternativesPrice');
    }

    function clearDatas() {
        setFactors([]);
        setPriorities({});
        setAlternatives({});
        setBestAlternativesPrice(null);
    }

    function chooseAlternative(alternative) {
        clearLocalStorage();
        clearDatas();
        hideRating();
        setNavigationReloadKey(prev => {
            prev = !prev;
            return prev;
        });
    }

    return (
        <div className="modal-overlay" onClick={hideRating}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="alternatives-rating-header">
                    <h2>Рейтинг альтернатив</h2>
                </div>

                <div className="rating-table-container">
                    <Table>
                        <thead>
                            <tr>                
                                <th>Альтернатива</th>
                                <th>Оцінка</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                            alternativesRating.map((alternative, index) => (
                                <tr key={index}> 
                                    <td>
                                        {alternative}
                                    </td>
                                    <td>{alternatives[alternative]["general"]}</td>
                                    <td>
                                        <button 
                                            className="choose-alternative-button"
                                            onClick={() => chooseAlternative(alternatives[alternative])}
                                        >
                                            Вибрати альтернативу
                                        </button>
                                    </td>
                                </tr>
                            ))
                            }
                        </tbody>
                    </Table>
                </div>

                <div className="close-btn">
                    <Button className="btn btn-primary" onClick={hideRating}>
                        Закрити
                    </Button>
                </div>
            </div>
        </div>
    );
};
