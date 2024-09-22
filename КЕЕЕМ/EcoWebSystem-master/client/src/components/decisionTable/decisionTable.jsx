import React, { useState, useEffect } from 'react';
import { Button, Table } from 'react-bootstrap';
import { Container } from 'react-bootstrap';
import "./decision-table.css";
import { DecisionRating } from './decisionRating.jsx';
import { CriterionsComparison } from './criterionsComparison.jsx';


import { DecisionTableNavigation } from './decisionTableNavigation.jsx';
import * as DTAlgorithm from './decisionTableAlgorithms.js'


export const DecisionTable = ({ user, tableName }) => {

  const [factors, setFactors] = useState(() => {
    try {
      const savedFactors = localStorage.getItem('factors');
      return savedFactors ? JSON.parse(savedFactors) : [];
    } catch (error) {
      console.error("Помилка при зчитуванні факторів з localStorage:", error);
      return [];
    }
  });

  const [priorities, setPriorities] = useState(() => {
    try {
      const savedPriorities = localStorage.getItem('priorities');
      return savedPriorities ? JSON.parse(savedPriorities) : {};
    } catch (error) {
      console.error("Помилка при зчитуванні пріоритетів з localStorage:", error);
      return {};
    }
  });

  const [alternatives, setAlternatives] = useState(() => {
    try {
      const savedAlternatives = localStorage.getItem('alternatives');
      return savedAlternatives ? JSON.parse(savedAlternatives) : {};
    } catch (error) {
      console.error("Помилка при зчитуванні альтернатив з localStorage:", error);
      return {};
    }
  });

  const [bestAlternativesPrice, setBestAlternativesPrice] = useState(() => {
    try {
      const savedBestPrice = localStorage.getItem('bestAlternativesPrice');
      return savedBestPrice ? JSON.parse(savedBestPrice) : null;
    } catch (error) {
      console.error("Помилка при зчитуванні найкращої оцінкиз localStorage:", error);
      return null;
    }
  });

  const [navigationReloadKey, setNavigationReloadKey] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);  // change name
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  const [selectedOption, setSelectedOption] = useState(() => {
    try {
      const choosedCriterion = localStorage.getItem('selected-criterion');
      return choosedCriterion !== "null" ? JSON.parse(choosedCriterion) : null;
    } catch (error) {
      console.error("Помилка при зчитуванні обраного критерія з localStorage:", error);
      return null;
    }
  });


  const [optimismPessimismCoefficient, setOptimismPessimismCoefficient] = useState(() => {
    try {
      const coefficient = localStorage.getItem('optimism-pessimism-coefficient');
      return coefficient ? JSON.parse(coefficient) : 0;;
    } catch (error) {
      console.error("Помилка при зчитуванні коефіцієнта оптимізму-песимізму з localStorage:", error);
      return null;
    }
  });
  

  if (!selectedOption) {
      setSelectedOption(prev => {
          prev = "Vald";
          return prev;
      });
  }


  function countAlternativesGeneralPrices(alternatives, priorities) {
    if (selectedOption === "Vald") {
      return DTAlgorithm.alternativesPricesVald(alternatives, priorities);
    }
    else if (selectedOption === "Bayes-Laplace") {
      return DTAlgorithm.alternativesPricesBayesLaplas(alternatives, priorities);
    }
    else if (selectedOption === "Savage") {
      return DTAlgorithm.alternativesPricesSavage(alternatives);
    }
    else if (selectedOption === "Hurvits") {
      return DTAlgorithm.alternativesPricesHurvits(alternatives, optimismPessimismCoefficient);
    }
    return null;
  }


  function countGeneralPrice(alternatives) {
    setBestAlternativesPrice(prev => {
      if ((Object.keys(alternatives).length < 1) || (factors.length < 1)) {
        prev = null;
        return prev;
      }
      
      if (selectedOption !== "Savage") {
        prev = DTAlgorithm.countMaxPrice(alternatives);
      }
      else {
        prev = DTAlgorithm.countMinPrice(alternatives);
      }
      return prev;
    });
  }


  function nameForNewFactor() {
    let i = 0;
    while (priorities["Фактор " + i]) {
      i++;
    }
    return "Фактор " + i;
  }


  function addNewFactor() {
    let factorsName = nameForNewFactor();
    factors.push(factorsName);
    priorities[factorsName] = 10;
    setAlternatives(prev => {
      const updatedAlternatives = {...prev};
      Object.keys(updatedAlternatives).forEach(alternative => {
        updatedAlternatives[alternative][factorsName] = 10;
      });

      let alternativesGeneralPrices = countAlternativesGeneralPrices(alternatives, priorities);
      Object.keys(updatedAlternatives).forEach(alternative => {
        updatedAlternatives[alternative]["general"] = alternativesGeneralPrices[alternative]
      });

      countGeneralPrice(alternativesGeneralPrices);
      return updatedAlternatives;
    });
  }


  function nameForNewAlternative() {
    let i = 0;
    while (alternatives["Альтернатива " + i]) {
      i++;
    }
    return "Альтернатива " + i;
  }


  function addNewAlternative() {
    let alternativesName = nameForNewAlternative();
    setAlternatives(prev => {
      const updatedAlternatives = {...prev};
      let alternativeFactories = {};
      for (let i = 0;   i < factors.length;   i++) {
        alternativeFactories[factors[i]] = 10;
      }
      updatedAlternatives[alternativesName] = alternativeFactories;
      
      let alternativesGeneralPrices = countAlternativesGeneralPrices(updatedAlternatives, priorities);
      if (factors.length > 0) {
        updatedAlternatives[alternativesName]["general"] = alternativesGeneralPrices[alternativesName];
      }
      else {
        updatedAlternatives[alternativesName]["general"] = null;
      }
      
      countGeneralPrice(alternativesGeneralPrices);
      return updatedAlternatives;
    });
  }


  function deleteAlternative(alternativeName) {
    setAlternatives(prev => {
      const updatedAlternatives = {...prev};
      delete updatedAlternatives[alternativeName];
      
      countGeneralPrice(countAlternativesGeneralPrices(updatedAlternatives, priorities));
      return updatedAlternatives;
    });
  }


  function deleteFactor(factorName) {
    setAlternatives(prev => {
      const updatedAlternatives = {...prev};

      Object.keys(updatedAlternatives)
        .filter(key => key !== 'general')
        .forEach(alternative => {
          delete updatedAlternatives[alternative][factorName];

          let alternativesGeneralPrices = countAlternativesGeneralPrices(updatedAlternatives, priorities);
          if (Object.keys(updatedAlternatives[alternative]).length > 1) {
            updatedAlternatives[alternative]["general"] = alternativesGeneralPrices[alternative];
          }
          else {
            updatedAlternatives[alternative]["general"] = null;
          }
          countGeneralPrice(alternativesGeneralPrices);
        }
      );
      return updatedAlternatives;
    });
    
    setPriorities(prev => {
      const updatedPriorities = {...prev};
      delete updatedPriorities[factorName];
      return updatedPriorities;
    });

    setFactors(prev => {
      prev = prev.filter(factor => factor !== factorName);
      return prev;
    });
  }


  const changeAlternativesFactorPrice = (event, alternative, factor) => {
    if (!event || !event.target) {
      return;
    }

    const newValue = event.target.value;
    setAlternatives(prev => {
      const updatedAlternatives = {...prev};

      if (updatedAlternatives[alternative] && updatedAlternatives[alternative][factor]) {
        updatedAlternatives[alternative][factor] = Number(newValue);
        
        let alternativesGeneralPrices = countAlternativesGeneralPrices(updatedAlternatives, priorities);
        updatedAlternatives[alternative]["general"] = alternativesGeneralPrices[alternative];
        countGeneralPrice(alternativesGeneralPrices);
      }
      return updatedAlternatives;
    });
  }

  const changeFactorPriority = (event, factor) => {
    if (!event || !event.target) {
      return;
    }

    const newPriority = Number(event.target.value);
    setPriorities(prev => {
      const updatedPriorities = { ...prev };
      updatedPriorities[factor] = newPriority;
      priorities[factor] = newPriority;
      return updatedPriorities;
    });

    if (selectedOption === "Vald") {
      setAlternatives(prev => {
        const updatedAlternatives = { ...prev };

        let alternativesGeneralPrices = countAlternativesGeneralPrices(updatedAlternatives, priorities);
        Object.keys(updatedAlternatives).forEach(alternative => {
          updatedAlternatives[alternative]["general"] = alternativesGeneralPrices[alternative];
        });
        
        countGeneralPrice(alternativesGeneralPrices);
        return updatedAlternatives;
      });
    }
  }


  const updateAlternativeName = (oldName, newName) => {
    setAlternatives((prev) => {
      let updatedAlternatives = { ...prev };
      updatedAlternatives[newName] = updatedAlternatives[oldName];
      let result = {};

      for (const key in updatedAlternatives) {
        if (updatedAlternatives.hasOwnProperty(key)) {
          if (key === oldName) {
            result[newName] = updatedAlternatives[oldName];
            continue;
          };
          result[key] = updatedAlternatives[key];
        }
      }

      updatedAlternatives = result;
      delete updatedAlternatives[oldName];
      return updatedAlternatives;
    });
  };


  const updateFactorName = (oldName, newName) => {
    setFactors(prev => {
      let index = prev.indexOf(oldName);
      prev[index] = newName;
      return prev;
    });

    setPriorities(prev => {
      let updatedPriorities = { ...prev };
      let result = {};
      for (const key in updatedPriorities) {
        if (updatedPriorities.hasOwnProperty(key)) {
          if (key === oldName) {
            result[newName] = updatedPriorities[oldName];
            continue;
          };
          result[key] = updatedPriorities[key];
        }
      }
      updatedPriorities = result;
      delete updatedPriorities[oldName];
      return updatedPriorities;
    });

    setAlternatives((prev) => {
      const updatedAlternatives = {...prev};
      Object.keys(updatedAlternatives)
        .filter(key => key !== 'general')
        .forEach(alternative => {
          let result = {};
          for (const factor in updatedAlternatives[alternative]) {
            if (factor !== oldName) {
              result[factor] = updatedAlternatives[alternative][factor];
            }
            else {
              result[newName] = updatedAlternatives[alternative][factor];
            }
          }
          updatedAlternatives[alternative] = result;
        }
      );
      return updatedAlternatives;
    });
  }


  useEffect(() => {
    localStorage.setItem('factors', JSON.stringify(factors));
    localStorage.setItem('priorities', JSON.stringify(priorities));
    localStorage.setItem('alternatives', JSON.stringify(alternatives));
    localStorage.setItem('bestAlternativesPrice', JSON.stringify(bestAlternativesPrice));
    localStorage.setItem('selected-criterion', JSON.stringify(selectedOption));
    localStorage.setItem('optimism-pessimism-coefficient', JSON.stringify(optimismPessimismCoefficient));
  }, [factors, priorities, alternatives, bestAlternativesPrice, selectedOption, optimismPessimismCoefficient]);
  
  return (
    <Container fluid className="full-width-container">
      <DecisionTableNavigation 
        key={navigationReloadKey}

        priorities={priorities}
        alternatives={alternatives}
        setAlternatives={setAlternatives}
        setBestAlternativesPrice={setBestAlternativesPrice}
        setSelectedOption={setSelectedOption}
        selectedOption={selectedOption}
        setOptimismPessimismCoefficient={setOptimismPessimismCoefficient}
        optimismPessimismCoefficient={optimismPessimismCoefficient} 
        />

      <div className="DSS-table">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th rowSpan="2" key="alternatives-header" className="alternatives-header">Альтернативи</th>
              <th colSpan={factors.length} key="factors-header" className="factors-header">Фактори</th>
              <th>Оцінка кожної альтернативи</th>
              <th></th>
            </tr>

            <tr>
              {factors.map((factor, index) => (
                <th key={`factor-${index}`}>
                  <Button
                    onClick={() => {
                      const newName = prompt('Введіть нову назву для фактора', factor);
                      if (newName && newName !== factor && !(newName in priorities)) {
                        updateFactorName(factor, newName);
                      }
                      else if (newName in priorities) {
                        alert("Фактор з такою назвою вже існує!");
                      }
                    }}
                  >
                    {factor}
                    <br />
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </Button>
                </th>
              ))}

              <th></th>
              <th>
                <Button variant="light plus-button" color='light' onClick={addNewFactor}>
                  Новий фактор
                </Button>
              </th>
            </tr>
          </thead>

          <tbody>
            <tr className={selectedOption == "Vald" ? "priority__row" : "priority__row__unactive"}>
              
              <td>Приорітет фактору</td>
              {factors.map((factor, index) => (
                <td key={index}>
                  <select 
                    id={`factor-priority-${index}`} 
                    value={priorities[factor]} 
                    onChange={(event) => changeFactorPriority(event, factor)}
                    disabled={selectedOption !== "Vald"}
                  >

                    <option value="1"> 1 </option>
                    <option value="2"> 2 </option>
                    <option value="3"> 3 </option>
                    <option value="4"> 4 </option>
                    <option value="5"> 5 </option>
                    <option value="6"> 6 </option>
                    <option value="7"> 7 </option>
                    <option value="8"> 8 </option>
                    <option value="9"> 9 </option>
                    <option value="10"> 10 </option>
                  </select>
                </td>
              ))}
              <td></td>
              <td></td>
            </tr>

            {
              Object.keys(alternatives).map((alternative, index) => (
                <tr key={alternative}> 
                  <td>
                    <Button
                      className='edit'
                      onClick={() => {
                        const newName = prompt('Введіть нову назву для альтернативи', alternative);
                        if (newName && newName !== alternative && !(newName in alternatives)) {
                          updateAlternativeName(alternative, newName);
                        }
                        else if (newName in alternatives) {
                          alert("Така назва альтрнативи вже існує!");
                        }
                      }}
                    >
                      {alternative}
                      <br />
                      <i className="fa fa-pencil" aria-hidden="true"></i>
                    </Button>
                  </td>
                  {
                    Object.keys(alternatives[alternative])
                    .filter(key => key !== 'general')  
                    .map((factor, factoIndex) => (
                      <td key={factor}>
                        <select 
                          id={`${alternative}-${factor}-price`} 
                          value={alternatives[alternative][factor]} 
                          onChange={(event) => changeAlternativesFactorPrice(event, alternative, factor)}
                          >
                          
                          <option value="1"> 1 </option>
                          <option value="2"> 2 </option>
                          <option value="3"> 3 </option>
                          <option value="4"> 4 </option>
                          <option value="5"> 5 </option>
                          <option value="6"> 6 </option>
                          <option value="7"> 7 </option>
                          <option value="8"> 8 </option>
                          <option value="9"> 9 </option>
                          <option value="10"> 10 </option>
                        </select>
                      </td>
                    ))
                  }
                  <td>{alternatives[alternative]["general"]}</td>
                  <td>
                    <Button variant="btn btn-danger" color='light' onClick={() => deleteAlternative(alternative)}>
                      Видалити альтернативу
                    </Button>
                  </td>
                </tr>
              ))
            }
          </tbody>

          <tfoot>
            <tr>
              <td>
                <Button variant="light plus-button" color='light' onClick={addNewAlternative}>
                  Нова Альтернатива
                </Button>
              </td>
              {factors.map((factor, index) => (
                <td key={`delete-factor-${index}`}>
                  <Button variant="btn btn-danger" color='light' onClick={() => deleteFactor(factor)}>
                    Видалити фактор
                  </Button>
                </td>
              ))}
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td colSpan={factors.length + 1}>Загальна оцінка:</td>
              <td>
                {bestAlternativesPrice}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </Table>
      </div>
      
      <div className="alternatives-statistic-button">
        <Button onClick={openModal} variant="btn btn-info">Рейтинг альтернатив</Button>
      </div>

      <DecisionRating 
        isOpen={isModalOpen} 
        hideRating={closeModal} 
        
        alternatives={alternatives} 
        setFactors={setFactors}
        setPriorities={setPriorities}
        setAlternatives={setAlternatives}
        setBestAlternativesPrice={setBestAlternativesPrice}
        selectedOption={selectedOption}
        setNavigationReloadKey={setNavigationReloadKey} />
    </Container>
  );
};
