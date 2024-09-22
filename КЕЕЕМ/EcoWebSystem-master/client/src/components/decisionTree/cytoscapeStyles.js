export const cytoscapeStyles = [
    {
        selector: 'node[type="rectangle"][label]',
        style: {
            'shape': 'rectangle',
            'padding-left': '15px',
            'padding-right': '15px',
            'padding-top': '15px',
            'padding-bottom': '15px',
            'background-color': '#3498db',
            'label': 'data(label)',
            'color': '#fff',
            'text-halign': 'center',
            'text-valign': 'center',
            'font-size': '18px',
        },
    },
    {
        selector: 'node[type="circle"]',
        style: {
            'shape': 'ellipse',
            'width': 30,
            'height': 30,
            'background-color': '#e74c3c'
        }
    },
    {
        selector: 'node[type="invisible"]',
        style: {
            'shape': 'ellipse',
            'width': 3,
            'height': 3,
            'background-color': 'rgba(255, 255, 255, 0.0)',
            'border-width': 0
        }
    },
    {
        selector: 'edge[label]',
        style: {
            'width': 2,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'none',
            'curve-style': 'straight',
            'label': 'data(label)',
            'text-wrap': 'wrap',
        }
    },
    {
        selector: 'node[type="result"][label]',
        style: {
            'shape': 'rectangle',
            'padding-left': '15px',
            'padding-right': '15px',
            'padding-top': '15px',
            'padding-bottom': '15px',
            'background-color': '#BCBCBC',
            'label': 'data(label)',
            'color': 'black',
            'text-halign': 'center',
            'text-valign': 'center',
            'font-size': '18px',
        }
    },
];
