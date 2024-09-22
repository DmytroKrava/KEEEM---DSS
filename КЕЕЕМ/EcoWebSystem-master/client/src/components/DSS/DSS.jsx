import React, { useState, useEffect } from 'react';
import { DecisionTable } from '../decisionTable/decisionTable.jsx';
import { DecisionTree } from '../decisionTree/decisionTree.jsx';
import "./DSS.css";


export const DSS = ({ user, tableName }) => {
  useEffect(() => {

  }, []);

  const [selectedModel, setSelectedModel] = useState('DecisionTable');

  const handleModelChange = (event) => {
    setSelectedModel(event.target.value);
  };

  return (

    <React.Fragment>
      <div className="container ">
        <div className='dssModelsRadio'>
          <div className="task">
            <h3>Опис задачі</h3>
            <p>Опис задачі (текст)</p>  
          </div>

          <div className='dssModels-header'>
            Оберіть модель прийняття рішень:
          </div>

          <div className='dssModels'>
            <div className='models__item'>
              <input 
                type="radio" 
                name="DSSModel" 
                id="DecisionTable"
                value="DecisionTable"
                checked={selectedModel === 'DecisionTable'}
                onChange={handleModelChange} 
              />

              <label htmlFor="DecisionTable">
                <span>Таблиця рішень</span>
              </label>
            </div>

            <div className='models__item'>
              <input 
                type="radio" 
                name="DSSModel" 
                value="DecisionTree"
                id='DecisionTree'
                checked={selectedModel === 'DecisionTree'}
                onChange={handleModelChange}
              />
              <label htmlFor='DecisionTree'>
                  <span>Дерево рішень</span>
              </label>
            </div>

            <div className='models__item'>
              <input 
                type="radio" 
                name="DSSModel" 
                value="ExpertModel"
                id='ExpertModel'
                disabled
              />

              <label htmlFor='ExpertModel'>
                <span>Експертна модель</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {selectedModel === 'DecisionTable' && <DecisionTable />}
      {selectedModel === 'DecisionTree' && <DecisionTree />}
    </React.Fragment>
  );
};


