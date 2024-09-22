import React, { useState, useEffect } from 'react';
import {
  Table,
  Tabs,
  Tab,
  Container,
  Row,
  Col,
  Button,
  Form,
} from 'react-bootstrap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { get, post } from '../../utils/httpService';
import {
  GET_PARAMS_URL,
  GET_MED_STAT_BY_PARAMS,
  GET_MED_STAT_VALUES,
} from '../../utils/constants';

import { VerticallyCenteredModal } from '../modals/modal';

import SuperTreeView from 'react-super-treeview';

import '../charts/emissionsChartModal';
import './cbStyles.css';

export const RegionMedStatModal = ({ regionId, name, onHide, show }) => {
  const modalHeader = `Медична статистика (${name})`;
  const [checkboxes, setCheckboxes] = useState([]);
  const [medStatData, setMedStatData] = useState([]);
  const [result, setResult] = useState([]);

  useEffect(() => {
    get(GET_PARAMS_URL).then(({ data }) => {
      setCheckboxes(data);
    });
  }, []);

  const fetchData = () => {
    post(GET_MED_STAT_BY_PARAMS, {
      regionId: regionId,
      checkboxes: JSON.stringify(checkboxes),
    }).then(({ data }) => {
      setMedStatData(data);
    });
  };

  const fetchValues = (id) => {
    if (!id) {
      return;
    }
    get(`${GET_MED_STAT_VALUES}?id=${id}`).then(({ data }) => {
      setResult(
        data.concat({
          name_of_formula: 'Значення',
          value: medStatData[id][0]?.value,
          measurement_of_formula: 'кількість осіб',
        })
      );
    });
  };

  return (
    <VerticallyCenteredModal
      size='xl'
      show={show}
      onHide={onHide}
      header={modalHeader}
    >
      <Tabs>
        <Tab eventKey='statistics' title='Cтатистика'>
          <Container>
            <Row>
              <Col md={5}>
                <div className='table-content-wrapper'>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Назва задачі</th>
                        <th>Показник</th>
                        <th>Рік розрахунку</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(medStatData).map((item) => {
                        return (
                          <tr id={item[0]} onClick={() => fetchValues(item[0])}>
                            <td title={item[1][0].name}>{item[1][0].name}</td>
                            <td title={item[1][0].name_of_formula}>
                              {item[1][0].name_of_formula}
                            </td>
                            <td title={item[1][0].year}>{item[1][0].year}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              </Col>
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Назва параметру</th>
                      <th>Значення</th>
                      <th>Одиниці виміру</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.map((item) => {
                      return (
                        <tr id={item.nomer}>
                          <td title={item.name_of_formula}>
                            {item.name_of_formula}
                          </td>
                          <td title={item.value}>{item.value}</td>
                          <td title={item.measurement_of_formula}>
                            {item.measurement_of_formula}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </Col>
              <Col>
                <SuperTreeView
                  data={checkboxes}
                  onUpdateCb={(updatedData) => {
                    setCheckboxes(updatedData);
                  }}
                  isExpandable={(node, depth) => {
                    return depth === 2 ? false : true;
                  }}
                  isDeletable={() => false}
                  onCheckToggleCb={(nodes) => {
                    const checkState = nodes[0].isChecked;

                    applyCheckStateTo(nodes);

                    function applyCheckStateTo(nodes) {
                      nodes.forEach((node) => {
                        node.isChecked = checkState;
                        if (node.children) {
                          applyCheckStateTo(node.children);
                        }
                      });
                    }
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button className='mt-5' onClick={fetchData}>
                  Оновити дані
                </Button>
              </Col>
              <Col md={3}>
                <div className='mb-2'>
                  <b>Фільтрація за роками:</b>
                </div>
                <Form style={{ float: 'left' }}>
                  <Form.Check label='2019' />

                  <Form.Check label='Поточний рік' />
                </Form>
              </Col>
            </Row>
          </Container>
        </Tab>
      </Tabs>
    </VerticallyCenteredModal>
  );
};
