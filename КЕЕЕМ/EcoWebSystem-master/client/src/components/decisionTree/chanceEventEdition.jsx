import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { ChanceEvent } from './ChanceEvent';
import { Decision } from './Decision';
import { Result } from "./Result.js";
import './editionElementsModal.css';


export const ChanceEventEdition = ({ 
    chanceEvent,
    graph,
    setGraph,
    hideEditionWindow
}) => {   

    const [nextChanceEventForm, setNextChanceEventForm] = useState(false);
    const [decisionForm, setDecisionForm] = useState(false);
    const [resultForm, setResultForm] = useState(false);


    const [formChanceEventData, setFormChanceEventData] = useState({
        name: chanceEvent.name,
        text: chanceEvent.text,
        probability: chanceEvent.probability
    });

    const handleChangeChanceEvent = (e) => {
        const { name, value } = e.target;
        setFormChanceEventData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmitChanceEvent = (e) => {
        e.preventDefault();
        if (formChanceEventData.name.length < 4) {
            alert("Поле з назвою повинне містити щонайменше 4 символи!")
            return;
        }
    
        if (formChanceEventData.name.length > 50) {
            alert("Поле з назвою повинне містити не більше 50 символів!")
            return;
        }
    
        if (formChanceEventData.text.length > 100) {
            alert("Опис може містити не більше 100 символів!")
            return;
        }

        const updatedEvent = {
            ...chanceEvent,
            name: formChanceEventData.name,
            text: formChanceEventData.text,
            probability: formChanceEventData.probability
        };

        const eventIndex = graph.findIndex(item => item.name === chanceEvent.name);
        if (eventIndex !== -1) {
            const graphHasSameElement = graph.findIndex(item => item.name === updatedEvent.name);

            if (graphHasSameElement === -1 
                || (graph[graphHasSameElement] 
                && graph[graphHasSameElement] === chanceEvent)
            ) {
                const updatedGraph = [...graph];
                updatedGraph[eventIndex].name = updatedEvent.name;
                updatedGraph[eventIndex].text = updatedEvent.text;
                updatedGraph[eventIndex].probability = parseFloat(updatedEvent.probability);
                setGraph(updatedGraph);
            }
            else {
                alert("Можлива подія з такою назвою вже існує!");
            }
        } else {
            alert('Елемент не знайдений у графі');
        }
    };

    const deleteChanceEvent = (e) => {
        const alternativeIndex = graph.findIndex(item => item.name === chanceEvent.name);

        if (alternativeIndex !== -1) {
            const updatedGraph = [...graph];
            chanceEvent.remove();
            updatedGraph.splice(alternativeIndex, 1);
            setGraph(updatedGraph);
            hideEditionWindow();
        } else {
            alert('Елемент не знайдений у графі');
        }
    }



    const [newEventFormData, setNewEventFormData] = useState({
        eventName: '',
        eventDescription: '',
        //eventProbability: ''

        eventProbability: '1'
    });

    const handleInputChangeNextChanceEvent = (event) => {
        const { name, value } = event.target;
        setNewEventFormData({
            ...newEventFormData,
            [name]: value
        });
    };

    const toggleNextChanceEventForm = () => {
        setNextChanceEventForm(!nextChanceEventForm);
    };

    const handleSubmitNextChanceEventForm = (e) => {
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

        const alternativeIndex = graph.findIndex(item => item.name === chanceEvent.name);
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
                updatedGraph.push(addedEvent);
                setGraph(updatedGraph);
                toggleNextChanceEventForm();
            }
            else {
                alert("Можлива подія з такою назвою вже існує!");
            }
        } else {
            alert('Елемент не знайдений у графі');
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

        const eventIndex = graph.findIndex(item => item.name === chanceEvent.name);
        if (eventIndex !== -1) {
            const graphHasSameElement = graph.findIndex(item => item.name === newDecisionFormData.decisionName);
            if (graphHasSameElement === -1) {
                const updatedGraph = [...graph];
                let addedDecision = new Decision(
                    newDecisionFormData.decisionName, 
                    null,
                    graph[eventIndex], 
                    newDecisionFormData.decisionDescription, 
                );
                updatedGraph[eventIndex].nextDecision = addedDecision;
                updatedGraph.push(addedDecision)
                setGraph(updatedGraph);
                toggleDecisionForm();
            }
            else {
                alert("Рішення з такою назвою вже існує!")
            }
        } else {
            alert('Елемент не знайдений у графі');
        }
        
    };

    const toggleResultForm = () => {
        setResultForm(!resultForm)
    }



    const [resulFormData, setResultFormData] = useState({
        resultName: '',
        resultDescription: ''
    });

    const handleInputResult = (event) => {
        const { name, value } = event.target;
        setResultFormData({
            ...resulFormData,
            [name]: value
        });
    };

    const handleSubmitResultForm = (e) => {
        e.preventDefault();
        if (resulFormData.resultName.length < 4) {
            alert("Поле з назвою повинне містити щонайменше 4 символи!")
            return;
        }
    
        if (resulFormData.resultName.length > 50) {
            alert("Поле з назвою повинне містити не більше 50 символів!")
            return;
        }
    
        if (resulFormData.resultDescription.length > 100) {
            alert("Опис може містити не більше 100 символів!")
            return;
        }

        const eventIndex = graph.findIndex(item => item.name === chanceEvent.name);
        if (eventIndex !== -1) {
            const graphHasSameElement = graph.findIndex(item => item.name === resulFormData.resultName);

            if (graphHasSameElement === -1) {
                const updatedGraph = [...graph];
                let addedResult = new Result(
                    resulFormData.resultName, 
                    graph[eventIndex], 
                    resulFormData.resultDescription, 
                );

                updatedGraph[eventIndex].vertixRefferal = addedResult;
                updatedGraph.push(addedResult)
                setGraph(updatedGraph);
                toggleResultForm();
            }
            else {
                alert("Рішення з такою назвою вже існує!")
            }
        } else {
            alert('Елемент не знайдений у графі');
        }
    };

    return (
        <div className='edition-container'>
            <div className="decision-edition-header">
                <h2>Редагування можливої події</h2>
            </div>

            <div className='form-container'>
                <form onSubmit={handleSubmitChanceEvent}>
                    <div className='form-fields'>
                        <label>
                            <span className="label-text">Назва можливої події:</span><br />
                            <input 
                                type="text" 
                                id='name' 
                                name='name' 
                                value={formChanceEventData.name} 
                                onChange={handleChangeChanceEvent} 
                                autoComplete="off"
                            />
                        </label>
                        
                        <label>
                            <span className="label-text">Опис можливої події:</span><br />
                            <textarea 
                                id="text"
                                name='text' 
                                value={formChanceEventData.text} 
                                onChange={handleChangeChanceEvent} 
                                rows={4} 
                                cols={25} 
                                autoComplete="off"
                            />
                        </label>
                        
                        <label>
                            <span className="label-text">Оцінка ймовірності події:</span><br />
                            <input 
                                type="number" 
                                id="probability"
                                name='probability' 
                                min="0" 
                                max="1" 
                                step="0.01"
                                value={formChanceEventData.probability}
                                onChange={handleChangeChanceEvent} 
                                autoComplete="off"
                            />
                        </label>
                        
                        <div className='submitButton'>
                            <Button type='submit'>Змінити</Button>
                        </div>
                    </div>
                </form>
            </div>

            {nextChanceEventForm && (
                <div className='form-container'>
                    <form onSubmit={handleSubmitNextChanceEventForm}>
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
                                    onChange={handleInputChangeNextChanceEvent}
                                    autoComplete="off"
                                />
                            </label>
                            
                            <label>
                                <span className="label-text">Опис події:</span><br />
                                <textarea 
                                    id="eventDescription"
                                    name='eventDescription' 
                                    onChange={handleInputChangeNextChanceEvent} 
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
                                    onChange={handleInputChangeNextChanceEvent} 
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

            {resultForm && (
                <div className='form-container'>
                    <form onSubmit={handleSubmitResultForm}>
                        <div className='form-fields'>
                            <div className='decision-edition-header'>
                                <h2>Результат</h2>
                            </div>

                            <label>
                                <span className="label-text">Назва результату:</span><br />
                                <input 
                                    type="text" 
                                    id='resultName' 
                                    name='resultName' 
                                    onChange={handleInputResult}
                                    autoComplete="off"
                                />
                            </label>
                            
                            <label>
                                <span className="label-text">Опис результату:</span><br />
                                <textarea 
                                    id="resultDescription"
                                    name='resultDescription' 
                                    onChange={handleInputResult} 
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

            {!(chanceEvent.vertixRefferal instanceof Decision) && !(chanceEvent.vertixRefferal instanceof Result) && (
                <div className='buttons'>
                    {(chanceEvent.vertixRefferal === null || chanceEvent.vertixRefferal instanceof Array) 
                        && (!decisionForm) && (!resultForm) && (

                        <Button variant='btn btn-secondary' onClick={toggleNextChanceEventForm}>
                            {nextChanceEventForm ? 'Приховати додавання подій' : 'Додати можливу подію'}
                        </Button>
                    )}

                    {(chanceEvent.vertixRefferal === null) && (!decisionForm) && (!nextChanceEventForm) && (
                        <Button variant='btn btn-secondary' onClick={toggleResultForm}>
                            {resultForm ? 'Приховати додавання результату' : 'Додати результат'}
                        </Button> 
                    )}

                    {(chanceEvent.vertixRefferal === null) && (!nextChanceEventForm) && (!resultForm) && (
                        <Button variant='btn btn-secondary' onClick={toggleDecisionForm}>
                            {decisionForm ? 'Приховати створення рішення' : 'Створити наступне рішення'}
                        </Button>
                    )}

                    {(chanceEvent.vertixRefferal === null) && (
                        <Button variant='btn btn-danger' onClick={deleteChanceEvent}>
                            Видалити
                        </Button> 
                    )}
                </div>
            )}
        </div>
    );
};
