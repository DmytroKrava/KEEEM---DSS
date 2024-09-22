import React, { useEffect } from 'react';
import './editionElementsModal.css';
import { Button } from 'react-bootstrap';
import { DecisionEdition } from './decisionEdition.jsx';
import { AlternativeEdition } from './alternativeEdition.jsx';
import { ChanceEventEdition } from './chanceEventEdition.jsx';
import { ResultEdition } from './resultEdition.jsx'

export const EditionElementsModal = ({ 
    isModalOpen,
    hideEditionModal, 
    currentNode,
    graph,
    setGraph,
    currentNodeType
}) => {

    useEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                hideEditionModal();
            }
        };

        if (isModalOpen) {
            document.body.classList.add('no-scroll');
            window.addEventListener('keydown', handleEscape);
        } else {
            document.body.classList.remove('no-scroll');
        }
        
        return () => {
            document.body.classList.remove('no-scroll');
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isModalOpen, hideEditionModal]);

    if (!isModalOpen) return null;
    let content;

    switch (currentNodeType) {
        case 'Decision':
            content = (
                <DecisionEdition 
                    decision={currentNode}
                    graph={graph}
                    setGraph={setGraph}
                    hideEditionWindow={hideEditionModal}
                />
            );
            break;
        case 'Alternative':
            content = (
                <AlternativeEdition 
                    alternative={currentNode}
                    graph={graph}
                    setGraph={setGraph}
                    hideEditionWindow={hideEditionModal}
                />
            );
            break;
        case 'ChanceEvent':
            content = (
                <ChanceEventEdition 
                    chanceEvent={currentNode}
                    graph={graph}
                    setGraph={setGraph}
                    hideEditionWindow={hideEditionModal}
                />
            );
            break;
        case 'Result':
            content = (
                <ResultEdition 
                    result={currentNode}
                    graph={graph}
                    setGraph={setGraph}
                    hideEditionWindow={hideEditionModal}
                />
            );
            break;
        default:
            content = (
                <div className="error-message">
                    <p>Неправильний тип вузла: {currentNodeType}</p>
                </div>
            );
            break;
    }

    return (
        <div className="modal-overlay" onClick={hideEditionModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {content}
                <div className="close-btn">
                    <Button onClick={hideEditionModal}>Закрити</Button>
                </div>
            </div>
        </div>
    );
};
