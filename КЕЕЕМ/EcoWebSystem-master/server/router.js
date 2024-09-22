const path = require('path');
const express = require('express');
const router = express.Router();

const authController = require('./controllers/auth');
const polygonsController = require('./controllers/polygons');
const regionsController = require('./controllers/regions');
const pointsController = require('./controllers/points');
const pointController = require('./controllers/point');
const typeOfObjectController = require('./controllers/typeofobject');
const expertsController = require('./controllers/experts');
const environmentsController = require('./controllers/environments');
const elementsController = require('./controllers/elements');
const gdkController = require('./controllers/gdk');
const emissionsCalculationsController = require('./controllers/emissionsCalculations');
const ownerTypesController = require('./controllers/ownerTypes');
const taxValuesController = require('./controllers/taxValues');
const compareController = require('./controllers/compare');
const citiesControler = require('./controllers/cities');
const taskContoler = require('./controllers/tasks');
const medStatControler = require('./controllers/medStat');

const tubeControler = require('./controllers/tubes');

router.post('/login', authController.login);

router.get('/polygons', polygonsController.getPolygons);
router.get('/advancedpolygons', polygonsController.getAdvancedPolygons);

router.post('/polygon', polygonsController.addPolygon);
router.get('/polygon/:id', polygonsController.getPolygon);
router.put('/polygon/:id', polygonsController.updatePolygon);

router.get('/regions', regionsController.getRegions);

router.get('/points', pointsController.getPoints);
router.get('/advancedpoints', pointsController.getAdvancedPoints);

router.post('/point', pointController.addPoint);
router.get('/point/:id', pointController.getPoint);
router.put('/point/:id', pointController.updatePoint);

router.get('/typeofobjects', typeOfObjectController.getTypes);
router.post('/typeofobjects', typeOfObjectController.addType);
router.put('/typeofobjects/:id', typeOfObjectController.editTypeOfObject);
router.delete('/typeofobjects/:id', typeOfObjectController.removeTypeOfObject);

router.get('/experts', expertsController.getExperts);

router.get('/environments', environmentsController.getEnvironments);
router.post('/environments', environmentsController.addEnvironment);
router.put('/environments/:id', environmentsController.editEnvironment);
router.delete('/environments/:id', environmentsController.removeEnvironment);

router.get('/elements', elementsController.getElements);
router.post('/elements', elementsController.addElement);
router.put('/elements/:id', elementsController.editElement);
router.delete('/elements/:id', elementsController.removeElement);

router.get('/gdk', gdkController.getAllGdkElements);
router.post('/gdk', gdkController.addGdkElement);
router.put('/gdk/:id', gdkController.editGdkElement);
router.post('/gdk/find', gdkController.findGdkElement);
router.delete('/gdk/:id', gdkController.removeGdkElement);

router.get(
  '/emissionscalculations',
  emissionsCalculationsController.getEmissionsCalculations
);

router.get('/getcities', citiesControler.getCities);

router.get('/compareEmissions', compareController.getCompareInfo);

router.get('/ownertypes', ownerTypesController.getAll);

router.get('/taxvalues', taxValuesController.getTaxValues);
router.post('/taxvalues', taxValuesController.addTaxValue);
router.put('/taxvalues/:id', taxValuesController.editTaxValue);
router.delete('/taxvalues/:id', taxValuesController.removeTaxValue);

router.get('/tasks', taskContoler.getTasks);
router.get('/medStat', medStatControler.getMedStat);
router.get('/getParams', medStatControler.getParams);
router.post('/getMedStatByParams', medStatControler.getMedStatByParams);
router.get('/getMedStatValues', medStatControler.getMedStatValues);

// router.get('/ages', medStatControler.getAges);

router.get('/getcalculationsinfo/:id', taskContoler.getCalculationsInfo);
router.get('/issuegetter', taskContoler.getPossibleTasks);

router.post('/tube', tubeControler.addTube);
router.get('/tube/:id', tubeControler.getTube);
router.put('/tube/:id', tubeControler.updateTube);

if (process.env.NODE_ENV === 'production') {
  router.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

module.exports = router;
