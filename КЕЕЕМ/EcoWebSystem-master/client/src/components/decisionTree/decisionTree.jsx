import React, { useState, useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import './decisionTree.css';
import cytoscape from 'cytoscape';
import { EditionElementsModal } from './editionElementsModal.jsx'
import { Decision } from "./Decision.js";
import { ChanceEvent } from "./ChanceEvent.js";
import { Alternative } from "./Alternative.js";
import { Result } from "./Result.js";
import { cytoscapeStyles } from "./cytoscapeStyles.js";
import 'tippy.js/dist/tippy.css';

import dagre from 'cytoscape-dagre';
cytoscape.use(dagre);

export const DecisionTree = ({ user, tableName }) => {
    //localStorage.clear();

    const [isEditionModalOpen, setIsEditionModalOpen] = useState(false);
    const openEditionModal = () => setIsEditionModalOpen(true);
    const hideEditionModal = () => setIsEditionModalOpen(false);

    function saveGraphToLocalStorage(graph) {
        const graphData = graph.map(node => node.toJSON());
        localStorage.setItem('decisionTree', JSON.stringify(graphData));
    }

    const restoreGraphFromLocalStorage = useCallback(() => {
        const localStorageData = JSON.parse(localStorage.getItem('decisionTree'));
        if (!localStorageData || localStorageData.length < 1) return [
            new Decision("Перше рішення")
        ];

        if (!Array.isArray(localStorageData)) {
            alert("Виникла помилка при зчитуванні даних з кешу, тому створено нове дерево рішень!");
            return [new Decision("Перше рішення")];
        }

        const graph = [];
        localStorageData.forEach(item => {
            switch (item.type) {
                case "Decision":
                    let decision = new Decision(item.name, 
                        null, 
                        item.inputAlternative ? graph.find(elem => elem.name === item.inputAlternative) : null,
                        item.text ? item.text : null
                    );
                    graph.push(decision);
                    break;

                case 'Alternative':
                    let decisionOwner = graph.find(elem => elem.name === item.decisionOwner);
                    if (decisionOwner) {
                        let alternative = new Alternative(
                            item.name, 
                            decisionOwner, 
                            item.text
                        );
                        graph.push(alternative);
                    } 
                    else {
                        console.error("Decision owner not found for alternative:", item.decisionOwner);
                    }
                    break;
                  
                case 'ChanceEvent':
                    let prevStage = graph.find(elem => elem.name === item.prevStage);
                    let event = new ChanceEvent(item.name, prevStage, item.text, item.probability);
                    graph.push(event);
                    break;

                case'Result':
                    let inputEvent = graph.find(elem => elem.name === item.inputEvent);
                    let result = new Result(item.name, inputEvent, item.text)
                    graph.push(result);
                    break;
            }
        });
        return graph;
    }, []);
        

    const [graph, setGraph] = useState(
        restoreGraphFromLocalStorage()
    );

    useEffect(() => {
        saveGraphToLocalStorage(graph);
    }, [graph]);

    const getGraphNodeIndex = useCallback((name) => {
        return graph.findIndex(node => node.name === name);
    }, [graph]);


    function createDataForTree(rootNode) {
        let elements = {
            rectangle: [],
            circle: [],
            resultRectangle: [],
            invisible: [],
            line: []
        };

        if (rootNode instanceof Decision) {
            elements.rectangle.push({
                data: { 
                    id: rootNode.name, 
                    label: rootNode.name,
                    description: rootNode.text,
                    type: 'rectangle'
                }
            });

            if (rootNode.alternatives.length > 0) {
                for (let i = 0;     i < rootNode.alternatives.length;      i++) {
                    let data = createDataForTree(rootNode.alternatives[i]);
                    elements.circle = elements.circle.concat(data.circle);
                    elements.rectangle = elements.rectangle.concat(data.rectangle);
                    elements.invisible = elements.invisible.concat(data.invisible);
                    elements.line = elements.line.concat(data.line);
                    elements.resultRectangle = elements.resultRectangle.concat(data.resultRectangle);
                }
            }
            else {
                elements.invisible.push({
                    data: { 
                        id: rootNode.name + '_end', 
                        label: '', 
                        type: 'invisible' 
                    }
                });
                elements.line.push({
                    data: { 
                        source: rootNode.name, 
                        target: rootNode.name + '_end' 
                    }
                });
            }
            return elements;
        }
        else if (rootNode instanceof Alternative) {
            if (!rootNode.nextDecision) {
                elements.invisible.push({
                    data: { 
                        id: rootNode.decisionOwner.name + '_' + rootNode.name, 
                        label: '', 
                        type: 'invisible' 
                    }
                });

                elements.line.push({
                    data: { 
                        source: rootNode.decisionOwner.name, 
                        label: rootNode.name, 
                        description: rootNode.text,
                        target: rootNode.decisionOwner.name + '_' + rootNode.name,
                        id: rootNode.name 
                    }
                });
            } 
            else if (rootNode.nextDecision instanceof Decision) {
                let data = createDataForTree(rootNode.nextDecision);
                elements.circle = elements.circle.concat(data.circle);
                elements.rectangle = elements.rectangle.concat(data.rectangle);
                elements.invisible = elements.invisible.concat(data.invisible);
                elements.line = elements.line.concat(data.line);
                elements.resultRectangle = elements.resultRectangle.concat(data.resultRectangle);

                elements.line.push({
                    data: { 
                        source: rootNode.decisionOwner.name, 
                        target: rootNode.nextDecision.name, 
                        label: rootNode.name, 
                        description: rootNode.text,
                        id: rootNode.name 
                    }
                });
            } 
            else if (Array.isArray(rootNode.nextDecision)) {
                elements.circle.push({
                    data: { 
                        id: rootNode.name + "_events", 
                        label: '', 
                        type: 'circle' 
                    }
                });
                elements.line.push({
                    data: { 
                        source: rootNode.decisionOwner.name, 
                        target: rootNode.name + "_events", 
                        label: rootNode.name, 
                        description: rootNode.text,
                        id: rootNode.name 
                    }
                });
                for (let i = 0; i < rootNode.nextDecision.length; i++) {
                    let data = createDataForTree(rootNode.nextDecision[i]);
                    elements.circle = elements.circle.concat(data.circle);
                    elements.rectangle = elements.rectangle.concat(data.rectangle);
                    elements.invisible = elements.invisible.concat(data.invisible);
                    elements.line = elements.line.concat(data.line);
                    elements.resultRectangle = elements.resultRectangle.concat(data.resultRectangle);
                }
            }
            return elements;
        }
        else if (rootNode instanceof ChanceEvent) {
            if (rootNode.vertixRefferal instanceof Decision) {
                let data = createDataForTree(rootNode.vertixRefferal);
                elements.circle = elements.circle.concat(data.circle);
                elements.rectangle = elements.rectangle.concat(data.rectangle);
                elements.invisible = elements.invisible.concat(data.invisible);
                elements.line = elements.line.concat(data.line);
                elements.resultRectangle = elements.resultRectangle.concat(data.resultRectangle);

                elements.line.push({
                    data: { 
                        source: rootNode.prevStage.name + "_events", 
                        target: rootNode.vertixRefferal.name, 
                        label: rootNode.name + "\n" + "Ймовірність: " + rootNode.probability,
                        tooltipLabel: rootNode.name,
                        description: rootNode.text,
                        id: rootNode.name
                    }
                });
            } 
            else if (!rootNode.vertixRefferal) {
                elements.invisible.push({
                    data: { 
                        id: rootNode.name + '_end', 
                        label: '', 
                        type: 'invisible' 
                    }
                });
                elements.line.push({
                    data: { 
                        source: rootNode.prevStage.name + "_events", 
                        target: rootNode.name + '_end', 
                        label: rootNode.name + "\n" + "Ймовірність: " + rootNode.probability,
                        tooltipLabel: rootNode.name,
                        description: rootNode.text,
                        id: rootNode.name
                    }
                });
            } 
            else if (rootNode.vertixRefferal instanceof Result) {
                elements.resultRectangle.push({
                    data: { 
                        id: rootNode.vertixRefferal.name, 
                        label: rootNode.vertixRefferal.name, 
                        description: rootNode.vertixRefferal.text,
                        type: 'result' 
                    }
                });

                elements.line.push({
                    data: { 
                        source: rootNode.prevStage.name + '_events', 
                        label: rootNode.name + "\n" + "Ймовірність: " + rootNode.probability,
                        tooltipLabel: rootNode.name,
                        description: rootNode.text,
                        target: rootNode.vertixRefferal.name,
                        id: rootNode.name 
                    }
                });
            }
            else if (Array.isArray(rootNode.vertixRefferal)) {
                if (rootNode.vertixRefferal.length > 0) {
                    elements.circle.push({
                        data: { 
                            id: rootNode.name + "_events", 
                            label: '', 
                            type: 'circle' 
                        }
                    });

                    elements.line.push({
                        data: { 
                            source: rootNode.prevStage.name + "_events", 
                            target: rootNode.name + "_events", 
                            label: rootNode.name + "\n" + "Ймовірність: " + rootNode.probability,
                            tooltipLabel: rootNode.name,
                            description: rootNode.text,
                            id: rootNode.name 
                        }
                    });

                    for (let i = 0; i < rootNode.vertixRefferal.length; i++) {
                        let data = createDataForTree(rootNode.vertixRefferal[i]);
                        elements.circle = elements.circle.concat(data.circle);
                        elements.rectangle = elements.rectangle.concat(data.rectangle);
                        elements.invisible = elements.invisible.concat(data.invisible);
                        elements.line = elements.line.concat(data.line);
                        elements.resultRectangle = elements.resultRectangle.concat(data.resultRectangle);
                    }
                } 
                else {
                    elements.invisible.push({
                        data: { 
                            id: rootNode.name + '_end', 
                            label: '', 
                            type: 'invisible' 
                        }
                    });
                    elements.line.push({
                        data: { 
                            source: rootNode.name, 
                            target: rootNode.name + '_end' 
                        }
                    });
                }
            }
            return elements;
        }
        return elements;
    }


    const [currNode, setCurrNode] = useState(null);
    const [currNodeType, setCurrNodeType] = useState(null);

    function drawTree(nodes, firstNode, graph) {
        const cytoscapeInstance = cytoscape({
            container: document.getElementById('decisions-tree'),
            elements: nodes,
            style: cytoscapeStyles,
            layout: {
                /*name: 'breadthfirst',
                directed: true,
                circle: false,
                spacingFactor: 1.75,
                roots: [firstNode.name],
                animate: true,*/

                name: 'dagre',
                rankDir: 'LR',
                directed: true,
                spacingFactor: 4,
                animate: true,
            },

            zoomingEnabled: true,
            userZoomingEnabled: true,
            minZoom: 0.6,
            maxZoom: 4.0,
        });

        cytoscapeInstance.nodes().forEach(node => {
            let nodeType = node.data('type');
            if (nodeType === 'rectangle' || nodeType === 'result') {
                const label = node.data('label');
                
                const width = label.length * 10;
                const height = 40;
                node.style({
                    'width': width,
                    'height': height
                });
            } 
        });
        
        document.querySelectorAll('#tooltip').forEach(el => el.remove());
        cytoscapeInstance.on('zoom', () => {
            const zoom = cytoscapeInstance.zoom();
            
            document.querySelectorAll('#tooltip').forEach(el => {
                el.style.fontSize = `${zoom * 16}px`;
                const h4 = el.querySelector('h4');
                if (h4) {
                    h4.style.fontSize = `${zoom * 20}px`;
                }
            });
        });
        
        cytoscapeInstance.nodes().forEach((node) => {
            node.off('mouseover');
            node.off('mouseout');
            node.off('position');

            if (!node.data('description')) {
                return
            }
            const tooltip = document.createElement('div');
            tooltip.id = "tooltip";
            tooltip.innerHTML = "<h4>" + node.data('label') + "</h4>" + node.data('description');
            tooltip.style.display = 'none';

            tooltip.style.fontSize = `${cytoscapeInstance.zoom() * 16}px`;
            const h4 = tooltip.querySelector('h4');
            if (h4) {
                h4.style.fontSize = `${cytoscapeInstance.zoom() * 20}px`;
            }

            document.body.appendChild(tooltip);
            const updatePosition = () => {
                const pos = node.renderedPosition();
                tooltip.style.left = `${pos.x + 100}px`;
                tooltip.style.top = `${pos.y + 120}px`;
            };

            node.on('mouseover', () => {
                tooltip.style.display = 'block';
                updatePosition();
            });

            node.on('mouseout', () => {
                tooltip.style.display = 'none';
            });
            node.on('position', updatePosition);
        });

        cytoscapeInstance.edges().forEach((edge) => {
            edge.off('mouseover');
            edge.off('mouseout');
            edge.off('position');

            if (!edge.data('description')) {
                return
            }
            const tooltip = document.createElement('div');
            tooltip.id = "tooltip";

            tooltip.innerHTML = edge.data('tooltipLabel') 
                ? "<h4>" + edge.data('tooltipLabel') + "</h4>" + edge.data('description')
                : "<h4>" + edge.data('label') + "</h4>" + edge.data('description');

            tooltip.style.display = 'none';
            document.body.appendChild(tooltip);
        
            const updatePosition = () => {
                const start = edge.source().renderedPosition();
                const end = edge.target().renderedPosition();
                const pos = {
                    x: (start.x + end.x) / 2,
                    y: (start.y + end.y) / 2
                };
                tooltip.style.left = `${pos.x + 100}px`;
                tooltip.style.top = `${pos.y + 100}px`;
            };
        
            edge.on('mouseover', () => {
                tooltip.style.display = 'block';
                updatePosition();
            });
        
            edge.on('mouseout', () => {
                tooltip.style.display = 'none';
            });
        
            edge.on('position', updatePosition);
        });

        cytoscapeInstance.fit();
        cytoscapeInstance.on('tap', 'node', function(event) {
            let node = event.target;
            let nodeType = node.data('type');

            if (nodeType === 'rectangle') {
                setCurrNode(graph[getGraphNodeIndex(node.id())]);
                setCurrNodeType("Decision");
                openEditionModal();
            } 
            else if (nodeType === 'result') {
                setCurrNode(graph[getGraphNodeIndex(node.id())]);
                setCurrNodeType("Result");
                openEditionModal();
            } 
        });
        cytoscapeInstance.on('tap', 'edge', function(event) {
            let edge = event.target;
            let elementIndex = getGraphNodeIndex(edge._private.data.id, graph);
            let choosedElement = graph[elementIndex];

            if (choosedElement instanceof Alternative) {
                setCurrNode(choosedElement);
                setCurrNodeType("Alternative");
                openEditionModal();
            }
            else if (choosedElement instanceof ChanceEvent) {
                setCurrNode(choosedElement);
                setCurrNodeType("ChanceEvent");
                openEditionModal();
            }
        });
        return () => cytoscapeInstance.destroy();
    }

    const createTreeArray = useCallback((rectangles, circles, invisibles, resultRectangles, lines) => {
        return [...rectangles, ...circles, ...invisibles, ...resultRectangles, ...lines];
    }, []);

    useEffect(() => {
        let convertedElementsForCytoscape = createDataForTree(graph[0]);
        let orderedElements = createTreeArray(
            convertedElementsForCytoscape.rectangle, 
            convertedElementsForCytoscape.circle, 
            convertedElementsForCytoscape.invisible, 
            convertedElementsForCytoscape.resultRectangle, 
            convertedElementsForCytoscape.line
        );
        drawTree(orderedElements, graph[0], graph);
    }, [graph]);
    

    return (
        <Container>
            <div id="decisions-tree"></div>

            <EditionElementsModal 
                isModalOpen={isEditionModalOpen}
                hideEditionModal={hideEditionModal} 
                currentNode={currNode}
                graph={graph}
                setGraph={setGraph}
                currentNodeType={currNodeType}
            />
        </Container>
    );
};
