import React, { useState } from 'react';
import './editionElementsModal.css';
import { Button } from 'react-bootstrap';
import { ChanceEvent } from './ChanceEvent';
import { Decision } from './Decision';

export const AlternativeEdition = ({ 
    alternative,
    graph,
    setGraph,
    hideEditionWindow
}) => {   

    const [chanceEventForm, setChanceEventForm] = useState(false);
    const [decisionForm, setDecisionForm] = useState(false);



    const [formAlternativeChangeData, setFormAlternativeChangeData] = useState({
        name: alternative.name,
        text: alternative.text,
    });

    const handleChangeAlternativeChangeForm = (e) => {
        const { name, value } = e.target;
        setFormAlternativeChangeData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmitAlternativeChangeForm = (e) => {
        e.preventDefault();

        if (formAlternativeChangeData.name.length < 4) {
            alert("Поле з назвою повинне містити щонайменше 4 символи!")
            return;
        }

        if (formAlternativeChangeData.name.length > 50) {
            alert("Поле з назвою повинне містити не більше 50 символів!")
            return;
        }

        if (formAlternativeChangeData.text.length > 100) {
            alert("Опис може містити не більше 100 символів!")
            return;
        }

        const updatedAlternative = {
            ...alternative,
            name: formAlternativeChangeData.name,
            text: formAlternativeChangeData.text
        };

        const alternativeIndex = graph.findIndex(item => item.name === alternative.name);
        if (alternativeIndex !== -1) {
            const graphHasSameElement = graph.findIndex(item => item.name === updatedAlternative.name);
            if (graphHasSameElement === -1 
                || (graph[graphHasSameElement] 
                    && graph[graphHasSameElement] === alternative)
                ) 
            {
                const updatedGraph = [...graph];
                updatedGraph[alternativeIndex].name = updatedAlternative.name;
                updatedGraph[alternativeIndex].text = updatedAlternative.text;
                setGraph(updatedGraph);
                hideEditionWindow();
            }
            else {
                alert("Альтернатива з такою назвою вже існує!")
            }
        } else {
            alert('Елемент "' + alternative.name + '" не знайдений у дереві рішень!');
        }
    };



    const [newEventFormData, setNewEventFormData] = useState({
        eventName: '',
        eventDescription: '',
        eventProbability: '1'
    });

    const handleInputChangeChanceEvent = (event) => {
        const { name, value } = event.target;
        setNewEventFormData({
            ...newEventFormData,
            [name]: value
        });
    };

    const toggleChanceEventForm = () => {
        setChanceEventForm(!chanceEventForm);
    };

    const handleSubmitChanceEventForm = (e) => {
        e.preventDefault();
        if (newEventFormData.eventName.length < 4) {
            alert("Поле з назвою повинне містити щонайменше 4 символи!")
            return;
        }

        if (newEventFormData.eventName.length > 50) {
            alert("Поле з назвою повинне містити не більше 50 символів!")
            return;
        }

        if (newEventFormData.eventDescription.length > 100) {
            alert("Опис може містити не більше 100 символів!")
            return;
        }

        const alternativeIndex = graph.findIndex(item => item.name === alternative.name);
        if (alternativeIndex !== -1) {
            const graphHasSameElement = graph.findIndex(item => item.name === newEventFormData.eventName);
            if (graphHasSameElement === -1) {
                const updatedGraph = [...graph];
                let addedEvent = new ChanceEvent(
                    newEventFormData.eventName, 
                    graph[alternativeIndex], 
                    newEventFormData.eventDescription, 
                    newEventFormData.eventProbability ? parseFloat(newEventFormData.eventProbability) : 0
                );

                updatedGraph.push(addedEvent)
                setGraph(updatedGraph);
                toggleChanceEventForm();

                newEventFormData.eventProbability = '1';
            }
            else {
                alert("Можлива подія з такою назвою вже існує!");
            }
        } 
        else {
            alert('Елемент "' + alternative.name + '" не знайдений у дереві рішень!');
        }
    };



    const toggleDecisionForm = () => {
        setDecisionForm(!decisionForm);
    };

    const [newDecisionFormData, setNewDecisionFormData] = useState({
        decisionName: '',
        decisionDescription: ''
    });

    const handleInputDecision = (event) => {
        const { name, value } = event.target;
        setNewDecisionFormData({
            ...newDecisionFormData,
            [name]: value
        });
    };

    const handleSubmitDecisionForm = (e) => {
        e.preventDefault();
        if (newDecisionFormData.decisionName.length < 4) {
            alert("Поле з назвою повинне містити щонайменше 4 символи!")
            return;
        }

        if (newDecisionFormData.decisionName.length > 50) {
            alert("Поле з назвою повинне містити не більше 50 символів!")
            return;
        }

        if (newDecisionFormData.decisionDescription.length > 100) {
            alert("Опис може містити не більше 100 символів!")
            return;
        }

        const alternativeIndex = graph.findIndex(item => item.name === alternative.name);
        if (alternativeIndex !== -1) {
            const graphHasSameElement = graph.findIndex(item => item.name === newDecisionFormData.decisionName);
            if (graphHasSameElement === -1) {
                const updatedGraph = [...graph];
                let addedDecision = new Decision(
                    newDecisionFormData.decisionName, 
                    null,
                    graph[alternativeIndex], 
                    newDecisionFormData.decisionDescription, 
                );

                updatedGraph[alternativeIndex].nextDecision = addedDecision;
                updatedGraph.push(addedDecision)
                setGraph(updatedGraph);
                toggleDecisionForm();
            }
            else {
                alert("Рішення з такою назвою вже існує!")
            }
        } else {
            alert('Елемент "' + alternative.name + '" не знайдений у дереві рішень!');
        }
    };



    const deleteAlternative = (e) => {
        const decisionIndex = graph.findIndex(item => item.name === alternative.name);

        if (decisionIndex !== -1) {            
            const updatedGraph = [...graph];
            alternative.remove();
            updatedGraph.splice(decisionIndex, 1);
            setGraph(updatedGraph);
            hideEditionWindow();
        } else {
            alert('Елемент "' + alternative.name + '" не знайдений у дереві рішень!');
        }
    }

    return (
        <div className='edition-container'>
            <div className="decision-edition-header">
                <h2>Редагування альтернативи</h2>
            </div>

            <div className='form-container'>
                <form onSubmit={handleSubmitAlternativeChangeForm}>
                    <div className='form-fields'>

                        <label>
                            <span className="label-text">Назва альтернативи:</span><br />
                            <input 
                                type="text" 
                                id='name' 
                                name='name' 
                                value={formAlternativeChangeData.name} 
                                onChange={handleChangeAlternativeChangeForm} 
                                autoComplete="off"
                            />
                        </label>

                        <label>
                            <span className="label-text">Опис альтернативи:</span><br />
                            <textarea 
                                id="text"
                                name='text' 
                                onChange={handleChangeAlternativeChangeForm} 
                                value={formAlternativeChangeData.text || ""} 
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

            {chanceEventForm && (
                <div className='form-container'>
                    <form onSubmit={handleSubmitChanceEventForm}>
                        <div className='form-fields'>
                            <div className='decision-edition-header'>
                                <h2>Нова можлива подія</h2>
                            </div>
                            
                            <label>
                                <span className="label-text">Назва події:</span><br />
                                <input 
                                    type="text" 
                                    id='eventName' 
                                    name='eventName' 
                                    onChange={handleInputChangeChanceEvent}
                                    autoComplete="off"
                                />
                            </label>

                            <label>
                                <span className="label-text">Опис події:</span><br />
                                <textarea 
                                    id="eventDescription"
                                    name='eventDescription' 
                                    onChange={handleInputChangeChanceEvent} 
                                    value={newEventFormData.eventDescription}
                                    rows={4} 
                                    cols={25} 
                                    autoComplete="off"
                                />
                            </label>

                            <label>
                                <span className="label-text">Оцінка події:</span><br />
                                <input 
                                    type="number" 
                                    id="eventProbability"
                                    name='eventProbability' 
                                    min="0" 
                                    max="1" 
                                    step="0.01"
                                    value={newEventFormData.eventProbability}
                                    onChange={handleInputChangeChanceEvent} 
                                    autoComplete="off"
                                />
                            </label>

                            <div className='submitButton'>
                                <Button type='submit'>Додати</Button>
                            </div>
                        </div>
                    </form>
                </div>   
            )}

            {decisionForm && (
                <div className='form-container'>
                    <form onSubmit={handleSubmitDecisionForm}>
                        <div className='form-fields'>
                            <div className='decision-edition-header'>
                                <h2>Наступне рішення</h2>
                            </div>

                            <label>
                                <span className="label-text">Назва рішення:</span><br />
                                <input 
                                    type="text" 
                                    id='decisionName' 
                                    name='decisionName' 
                                    onChange={handleInputDecision}
                                    autoComplete="off"
                                />
                            </label>

                            <label>
                                <span className="label-text">Опис події:</span><br />
                                <textarea 
                                    id="decisionDescription"
                                    name='decisionDescription' 
                                    onChange={handleInputDecision} 
                                    rows={4} 
                                    cols={25} 
                                    autoComplete="off"
                                />
                            </label>
                        
                            <div className='submitButton'>
                                <Button type='submit'>Додати</Button>
                            </div>
                        </div>
                    </form> 
                </div>
            )}
            
            {!(alternative.nextDecision instanceof Decision) && (
                <div className='buttons'>
                    {(alternative.nextDecision === null || alternative.nextDecision instanceof Array) 
                        && (!decisionForm) && (
                        
                        <Button variant='btn btn-secondary' onClick={toggleChanceEventForm}>
                            {chanceEventForm ? 'Приховати додавання подій' : 'Додати можливу подію'}
                        </Button>
                    )}

                    {(alternative.nextDecision === null) && (!chanceEventForm) && (
                        <Button variant='btn btn-secondary' onClick={toggleDecisionForm}>
                            {decisionForm ? 'Приховати створення рішення' : 'Створити наступне рішення'}
                        </Button>
                    )}

                    {(alternative.nextDecision === null) && (
                        <div>
                            <Button variant='btn btn-danger' onClick={deleteAlternative}>
                                Видалити
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
