import React, { useState, useCallback } from 'react';
import './editionElementsModal.css';
import { Button } from 'react-bootstrap';
import { Alternative } from './Alternative';


export const DecisionEdition = ({ 
    decision,
    graph,
    setGraph,
    hideEditionWindow
}) => {   

    const [formDecisionChangeData, setDecisionChangeFormData] = useState({
        name: decision.name,
        text: decision.text
    });

    const [showAddingAlternativesForm, setAddingAddingAlternativesForm] = useState(false);

    const handleDecisionChangeChange = (e) => {
        const { name, value } = e.target;
        setDecisionChangeFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmitDecisionChange = (e) => {
        e.preventDefault()

        if (formDecisionChangeData.name.length < 4) {
            alert("Поле з назвою повинне містити щонайменше 4 символи!")
            return;
        }
        if (formDecisionChangeData.name.length > 50) {
            alert("Поле з назвою повинне містити не більше 50 символів!")
            return;
        }
        if (formDecisionChangeData.text && formDecisionChangeData.text.length > 100) {
            alert("Опис може містити не більше 100 символів!")
            return;
        }

        const updatedDecision = {
            ...decision,
            name: formDecisionChangeData.name,
            text: formDecisionChangeData.text
        };

        const decisionIndex = graph.findIndex(item => item.name === decision.name);
        if (decisionIndex !== -1) {
            const graphHasSameElement = graph.findIndex(item => item.name === updatedDecision.name);

            if (graphHasSameElement === -1 
                || (graph[graphHasSameElement] 
                && graph[graphHasSameElement] === decision)
            ) {
                const updatedGraph = [...graph];
                updatedGraph[decisionIndex].name = updatedDecision.name;
                updatedGraph[decisionIndex].text = updatedDecision.text;
                setGraph(updatedGraph);
            }
            else {
                alert("Рішення з такою назвою вже існує!")
            }
        } else {
            alert('Елемент "' + decision.name + '" не знайдений у дереві рішень!');
        }
    };



    const toggleAddingAlternativesForm = useCallback(() => {
        setAddingAddingAlternativesForm(prev => !prev);
    }, []);

    const [formNewAlternativeData, setFormNewAlternativeData] = useState({
        alternativeName: '',
        alternativeDescription: ''
    });

    const handleNewAlternativeChange = (e) => {
        const { name, value } = e.target;
        setFormNewAlternativeData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmitNewAlternative = (e) => {
        e.preventDefault()

        if (formNewAlternativeData.alternativeName.length < 4) {
            alert("Поле з назвою повинне містити щонайменше 4 символи!")
            return;
        }

        if (formNewAlternativeData.alternativeName.length > 50) {
            alert("Поле з назвою повинне містити не більше 50 символів!")
            return;
        }

        if (formNewAlternativeData.alternativeDescription && formNewAlternativeData.alternativeDescription.length > 100) {
            alert("Опис може містити не більше 100 символів!")
            return;
        }

        const newDecision = {
            ...decision,
            name: formNewAlternativeData.alternativeName,
            text: formNewAlternativeData.alternativeDescription
        };

        if (newDecision.name === '') {
            alert("Поле з назвою має бути заповненим!")
            return;
        }

        const decisionIndex = graph.findIndex(item => item.name === decision.name);
    
        if (decisionIndex !== -1) {
            const graphHasSameElement = graph.findIndex(item => item.name === newDecision.name);
            if (graphHasSameElement === -1) {
                const updatedGraph = [...graph];
                let addedAlternative = new Alternative(newDecision.name, graph[decisionIndex], newDecision.text);
                updatedGraph[decisionIndex].addAlternative(addedAlternative);
                updatedGraph.push(addedAlternative)
                setGraph(updatedGraph);
                toggleAddingAlternativesForm();
            }
            else {
                alert("Альтернатива з такою назвою вже існує!")
            }
        }
        else {
            alert('Елемент "' + decision.name + '" не знайдений у дереві рішень!');
        }
    };

    const deleteDecision = (e) => {
        const decisionIndex = graph.findIndex(item => item.name === decision.name);

        if (decisionIndex !== -1) {
            const updatedGraph = [...graph];
            decision.remove();
            updatedGraph.splice(decisionIndex, 1);
            setGraph(updatedGraph);
            hideEditionWindow();
        } else {
            alert('Елемент "' + decision.name + '" не знайдений у дереві рішень!');
        }
    }

    return (
        <div className='edition-container'>
            <div className="decision-edition-header">
                <h2>Редагування рішення</h2>
            </div>

            <div className='form-container'>
                <form onSubmit={handleSubmitDecisionChange}>
                    <div className='form-fields'>
                        <label>
                            <span className="label-text">Назва рішення:</span><br />
                            <input 
                                type="text" 
                                id='name' 
                                name='name' 
                                value={formDecisionChangeData.name} 
                                onChange={handleDecisionChangeChange} 
                                autoComplete="off"
                            />
                        </label>
                        
                        <label>
                            <span className="label-text">Опис рішення:</span><br />
                            <textarea 
                                id="text"
                                name='text' 
                                onChange={handleDecisionChangeChange} 
                                value={formDecisionChangeData.text || ""} 
                                rows={4} 
                                cols={25} 
                                autoComplete="off"
                            />
                        </label>
                        
                        <div className='submitButton'>
                            <Button type='submit'>Змінити</Button>
                        </div>
                    </div>
                </form>
            </div>

            {showAddingAlternativesForm && (
                <div className='form-container'>
                    <form onSubmit={handleSubmitNewAlternative}>
                        <div className='form-fields'>
                            <div className="decision-edition-header">
                                <h2>Нова альтернатива</h2>
                            </div>

                            <label>
                                <span className="label-text">Назва альтернативи:</span><br />
                                <input 
                                    type="text" 
                                    id='alternativeName' 
                                    name='alternativeName' 
                                    onChange={handleNewAlternativeChange} 
                                    autoComplete="off"
                                />
                            </label>

                            <label>
                                <span className="label-text">Опис альтернативи:</span><br />
                                <textarea 
                                    id="alternativeDescription"
                                    name='alternativeDescription' 
                                    onChange={handleNewAlternativeChange} 
                                    rows={4} 
                                    cols={25} 
                                    autoComplete="off"
                                />
                            </label>

                            <div className='submitButton'>
                                <Button className='submit-button' type='submit'>Додати</Button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className='buttons'>
                <Button variant='btn btn-secondary' onClick={toggleAddingAlternativesForm}>
                    {showAddingAlternativesForm ? 'Приховати додавання альтернативи' : 'Додати альтернативу'}
                </Button>

                {(decision.alternatives === null || decision.alternatives.length < 1) && (decision.inputAlternative !== null) && (
                    <div>
                        <Button variant='btn btn-danger' onClick={deleteDecision}>
                            Видалити рішення
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
