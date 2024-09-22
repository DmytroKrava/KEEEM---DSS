import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Decision } from './Decision';
import './editionElementsModal.css';


export const ResultEdition = ({ 
    result,
    graph,
    setGraph,
    hideEditionWindow
}) => {

    const [formData, setFormData] = useState({
        name: result.name,
        text: result.text,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name.length < 4) {
            alert("Поле з назвою повинне містити щонайменше 4 символи!")
            return;
        }
    
        if (formData.name.length > 50) {
            alert("Поле з назвою повинне містити не більше 50 символів!")
            return;
        }
    
        if (formData.text.length > 100) {
            alert("Опис може містити не більше 100 символів!")
            return;
        }

        const updatedAlternative = {
            ...result,
            name: formData.name,
            text: formData.text,
            probability: formData.probability
        };

        const eventIndex = graph.findIndex(item => item.name === result.name);
        if (eventIndex !== -1) {
            const graphHasSameElement = graph.findIndex(item => item.name === updatedAlternative.name);
            if (graphHasSameElement === -1
                || (graph[graphHasSameElement] 
                    && graph[graphHasSameElement] === result)
            ) {
                const updatedGraph = [...graph];
                updatedGraph[eventIndex].name = updatedAlternative.name;
                updatedGraph[eventIndex].text = updatedAlternative.text;
                setGraph(updatedGraph);
            }
            else {
                alert("Результат з такою назвою вже існує!");
            }
        } else {
            alert('Елемент "' + result.name + '" не знайдений у дереві рішень!');
        }
    };

    const deleteChanceEvent = (e) => {
        const resultIndex = graph.findIndex(item => item.name === result.name);

        if (resultIndex !== -1) {
            const updatedGraph = [...graph];
            result.remove();
            updatedGraph.splice(resultIndex, 1);

            setGraph(updatedGraph);
            hideEditionWindow();
        } else {
            alert('Елемент "' + result.name + '" не знайдений у дереві рішень!');
        }
    }

    function clearLocalStorage() {
        localStorage.removeItem('decisionTree');
    }

    const chooseWayToResult = (e) => {
        clearLocalStorage();
        setGraph([new Decision("Перше рішення")]);
        hideEditionWindow();
    }
    
    return (
        <div className='edition-container'>
            <div className="decision-edition-header">
                <h2>Редагування результату</h2>
            </div>

            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <div className='form-fields'>
                        <label>
                            <span className="label-text">Назва альтернативи:</span><br />
                            <input 
                                type="text" 
                                id='name' 
                                name='name' 
                                value={formData.name} 
                                onChange={handleChange} 
                                autoComplete="off"
                            />
                        </label>
                        
                        <label>
                            <span className="label-text">Опис альтернативи:</span><br />
                            <textarea 
                                id="text"
                                name='text' 
                                value={formData.text} 
                                onChange={handleChange} 
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

            <div className='buttons'>
                <Button variant='btn btn-success' onClick={chooseWayToResult}>
                    Вибрати шлях до результату
                </Button>

                <Button variant='btn btn-danger' onClick={deleteChanceEvent}>
                    Видалити
                </Button> 
            </div>
        </div>
    );
};
