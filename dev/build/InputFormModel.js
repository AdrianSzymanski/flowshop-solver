'use strict';

var Proto = require('./model');
var engine = require('./FlowShopSolver');

var Model = function Model() {
  var proto = Proto(),
      m_data = {},
      model = Object.create(proto);

  model.init = function () {
    m_data = {
      saved_data: [{ jobID: 1, times: [0, 0] }, { jobID: 2, times: [0, 0] }],
      current_data: [{ jobID: 1, times: [0, 0] }, { jobID: 2, times: [0, 0] }],
      active: {
        selection: null,
        jobID: null,
        machineID: null
      },
      algorithm: 'johnson',
      buttons: {
        plus: false,
        minus: false,
        randomize: false,
        reset: false,
        save: false
      }
    };
    engine.init();
  };

  // place available algorithms here
  var all_algorithms = ['johnson', 'johnson-no-wait', 'johnson-no-idle', 'random', 'random-no-wait', 'random-no-idle'];
  var max_jobs_number = 10;
  var max_machines_number = 10;
  var max_table_value = 10;

  var update = function update() {
    var m_data = model.getData();
    model.update(m_data);
  };

  // buttons management functions
  var disableAllButtons = function disableAllButtons() {
    var buttons = m_data.buttons,
        btns = ['plus', 'minus', 'reset', 'randomize', 'save'];
    btns.forEach(function (b) {
      return buttons[b] = false;
    });
  };

  var enablePlusMinusButtons = function enablePlusMinusButtons() {
    var selection = m_data.active.selection;
    var temp, min, max;

    switch (selection) {
      case 'all':
        min = getMinimalTableValue();
        max = getMaximalTableValue();
        if (min < max_table_value) m_data.buttons.plus = true;
        if (max > 0) m_data.buttons.minus = true;
        break;

      case 'jobsNumber':
        temp = m_data.current_data.length;
        if (temp < max_jobs_number) m_data.buttons.plus = true;
        if (temp > 2) m_data.buttons.minus = true;
        break;

      case 'machinesNumber':
        temp = m_data.current_data[0].times.length;
        if (temp < max_machines_number) m_data.buttons.plus = true;
        if (temp > 2) m_data.buttons.minus = true;
        break;

      case 'job':
        var jobID = m_data.active.jobID;
        min = getMinimalTimeOfJob(jobID);
        max = getMaximalTimeOfJob(jobID);
        if (min < max_table_value) m_data.buttons.plus = true;
        if (max > 0) m_data.buttons.minus = true;
        break;

      case 'machine':
        var machineID = m_data.active.machineID;
        min = getMinimalTimeOfMachine(machineID);
        max = getMaximalTimeOfMachine(machineID);
        if (min < max_table_value) m_data.buttons.plus = true;
        if (max > 0) m_data.buttons.minus = true;
        break;

      case 'cell':
        var row = m_data.active.jobID;
        var column = m_data.active.machineID;
        if (m_data.current_data[row - 1]['times'][column - 1] < max_table_value) m_data.buttons.plus = true;
        if (m_data.current_data[row - 1]['times'][column - 1] > 0) m_data.buttons.minus = true;
        break;

      default:
        break;
    }
  };

  var enableResetButton = function enableResetButton() {
    if (JSON.stringify(m_data.saved_data) !== JSON.stringify(m_data.current_data)) m_data.buttons.reset = true;
  };

  var enableRandomizeButton = function enableRandomizeButton() {
    if (m_data.active.selection !== 'nothing') m_data.buttons.randomize = true;
  };

  var updateButtons = function updateButtons() {
    disableAllButtons();
    enablePlusMinusButtons();
    m_data.buttons.save = true;
    enableResetButton();
    enableRandomizeButton();
  };

  // data management functions
  var clearCurrentJobs = function clearCurrentJobs() {
    var rows = m_data.current_data.length;

    for (var i = 0; i < rows - 2; i++) m_data.current_data.pop();
  };

  var clearCurrentMachines = function clearCurrentMachines() {
    var rows = m_data.current_data.length;
    var columns = m_data.current_data[0]['times'].length;

    for (var i = 0; i < rows; i++) for (var j = 0; j < columns - 2; j++) m_data.current_data[i]['times'].pop();
  };

  var getMinimalTimeOfJob = function getMinimalTimeOfJob(jobID) {
    var minimal = m_data.current_data[jobID - 1]['times'][0];
    var columns = m_data.current_data[0]['times'].length;

    for (var i = 0; i < columns; i++) if (m_data.current_data[jobID - 1]['times'][i] < minimal) minimal = m_data.current_data[jobID - 1]['times'][i];

    return minimal;
  };

  var getMaximalTimeOfJob = function getMaximalTimeOfJob(jobID) {
    var maximal = m_data.current_data[jobID - 1]['times'][0];
    var columns = m_data.current_data[0]['times'].length;

    for (var i = 0; i < columns; i++) if (m_data.current_data[jobID - 1]['times'][i] > maximal) maximal = m_data.current_data[jobID - 1]['times'][i];

    return maximal;
  };

  var getMinimalTimeOfMachine = function getMinimalTimeOfMachine(machineID) {
    var minimal = m_data.current_data[0]['times'][machineID - 1];

    for (var i = 0; i < m_data.current_data.length; i++) if (m_data.current_data[i]['times'][machineID - 1] < minimal) minimal = m_data.current_data[i]['times'][machineID - 1];

    return minimal;
  };

  var getMaximalTimeOfMachine = function getMaximalTimeOfMachine(machineID) {
    var maximal = m_data.current_data[0]['times'][machineID - 1];

    for (var i = 0; i < m_data.current_data.length; i++) if (m_data.current_data[i]['times'][machineID - 1] > maximal) maximal = m_data.current_data[i]['times'][machineID - 1];

    return maximal;
  };

  var getMinimalTableValue = function getMinimalTableValue() {
    var minimal = m_data.current_data[0]['times'][0];
    var rows = m_data.current_data.length;
    var columns = m_data.current_data[0]['times'].length;

    for (var i = 0; i < rows; i++) for (var j = 0; j < columns; j++) if (m_data.current_data[i]['times'][j] < minimal) minimal = m_data.current_data[i]['times'][j];

    return minimal;
  };

  var getMaximalTableValue = function getMaximalTableValue() {
    var maximal = m_data.current_data[0]['times'][0];
    var rows = m_data.current_data.length;
    var columns = m_data.current_data[0]['times'].length;

    for (var i = 0; i < rows; i++) for (var j = 0; j < columns; j++) if (m_data.current_data[i]['times'][j] > maximal) maximal = m_data.current_data[i]['times'][j];

    return maximal;
  };

  var getRandomInt = function getRandomInt() {
    var min = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
    var max = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var addNewJob = function addNewJob() {
    if (m_data.current_data.length < max_jobs_number) {
      var machines_number = m_data.current_data[0]['times'].length;
      var time_values = Array.apply(null, { length: machines_number }).map(function () {
        return 0;
      });

      var next_job_id = m_data.current_data.length + 1,
          new_job = {
        jobID: next_job_id,
        times: time_values
      };

      m_data.current_data.push(new_job);
    }
  };

  var addNewMachine = function addNewMachine() {
    var machines_number = m_data.current_data[0]['times'].length;

    if (machines_number < max_machines_number) for (var i = 0; i < m_data.current_data.length; i++) m_data.current_data[i]['times'].push(0);
  };

  var popMachine = function popMachine() {
    var machines_number = m_data.current_data[0]['times'].length;

    if (machines_number > 2) for (var i = 0; i < m_data.current_data.length; i++) m_data.current_data[i]['times'].pop();
  };

  var increaseAllTableValues = function increaseAllTableValues() {
    var rows = m_data.current_data.length;
    var columns = m_data.current_data[0]['times'].length;

    for (var i = 0; i < rows; i++) for (var j = 0; j < columns; j++) if (m_data.current_data[i]['times'][j] < max_table_value) m_data.current_data[i]['times'][j]++;
  };

  var decreaseAllTableValues = function decreaseAllTableValues() {
    var rows = m_data.current_data.length;
    var columns = m_data.current_data[0]['times'].length;

    for (var i = 0; i < rows; i++) for (var j = 0; j < columns; j++) if (m_data.current_data[i]['times'][j] > 0) m_data.current_data[i]['times'][j]--;
  };

  var increaseJobValues = function increaseJobValues(jobID) {
    var columns = m_data.current_data[0]['times'].length;

    for (var i = 0; i < columns; i++) if (m_data.current_data[jobID - 1]['times'][i] < max_table_value) m_data.current_data[jobID - 1]['times'][i]++;
  };

  var decreaseJobValues = function decreaseJobValues(jobID) {
    var columns = m_data.current_data[0]['times'].length;

    for (var i = 0; i < columns; i++) if (m_data.current_data[jobID - 1]['times'][i] > 0) m_data.current_data[jobID - 1]['times'][i]--;
  };

  var increaseMachineValues = function increaseMachineValues(machineID) {
    for (var i = 0; i < m_data.current_data.length; i++) if (m_data.current_data[i]['times'][machineID - 1] < max_table_value) m_data.current_data[i]['times'][machineID - 1]++;
  };

  var decreaseMachineValues = function decreaseMachineValues(machineID) {
    for (var i = 0; i < m_data.current_data.length; i++) if (m_data.current_data[i]['times'][machineID - 1] > 0) m_data.current_data[i]['times'][machineID - 1]--;
  };

  var increaseCellValue = function increaseCellValue(jobID, machineID) {
    if (m_data.current_data[jobID - 1]['times'][machineID - 1] < max_table_value) m_data.current_data[jobID - 1]['times'][machineID - 1]++;
  };

  var decreaseCellValue = function decreaseCellValue(jobID, machineID) {
    if (m_data.current_data[jobID - 1]['times'][machineID - 1] > 0) m_data.current_data[jobID - 1]['times'][machineID - 1]--;
  };

  var randomizeAllTableValues = function randomizeAllTableValues() {
    var rows = m_data.current_data.length;
    var columns = m_data.current_data[0]['times'].length;
    for (var i = 0; i < rows; i++) for (var j = 0; j < columns; j++) m_data.current_data[i]['times'][j] = getRandomInt(0, max_table_value);
  };

  var randomizeJobsNumber = function randomizeJobsNumber() {
    clearCurrentJobs();
    for (var i = 0; i < getRandomInt(1, max_jobs_number); i++) addNewJob();
  };

  var randomizeMachinesNumber = function randomizeMachinesNumber() {
    clearCurrentMachines();
    for (var i = 0; i < getRandomInt(1, max_machines_number); i++) addNewMachine();
  };

  var randomizeJobValues = function randomizeJobValues(jobID) {
    var columns = m_data.current_data[0]['times'].length;
    for (var i = 0; i < columns; i++) m_data.current_data[jobID - 1]['times'][i] = getRandomInt(0, max_table_value);
  };

  var randomizeMachineValues = function randomizeMachineValues(machineID) {
    for (var i = 0; i < m_data.current_data.length; i++) m_data.current_data[i]['times'][machineID - 1] = getRandomInt(0, max_table_value);
  };

  var randomizeCellValue = function randomizeCellValue(jobID, machineID) {
    m_data.current_data[jobID - 1]['times'][machineID - 1] = getRandomInt(0, max_table_value);
  };

  // main functions
  model.getData = function () {
    return JSON.parse(JSON.stringify(m_data));
  };

  model.more = function () {
    var selection = m_data.active.selection;

    if (m_data.buttons.plus == true) {
      switch (selection) {
        case 'all':
          increaseAllTableValues();
          break;
        case 'jobsNumber':
          addNewJob();
          break;
        case 'machinesNumber':
          addNewMachine();
          break;
        case 'job':
          increaseJobValues(m_data.active.jobID);
          break;
        case 'machine':
          increaseMachineValues(m_data.active.machineID);
          break;
        case 'cell':
          increaseCellValue(m_data.active.jobID, m_data.active.machineID);
          break;
        default:
          break;
      }
    }

    updateButtons();
    update();
  };

  model.less = function () {
    var selection = m_data.active.selection;

    if (m_data.buttons.minus == true) {
      switch (selection) {
        case 'all':
          decreaseAllTableValues();
          break;
        case 'jobsNumber':
          m_data.current_data.pop();
          break;
        case 'machinesNumber':
          popMachine();
          break;
        case 'job':
          decreaseJobValues(m_data.active.jobID);
          break;
        case 'machine':
          decreaseMachineValues(m_data.active.machineID);
          break;
        case 'cell':
          decreaseCellValue(m_data.active.jobID, m_data.active.machineID);
          break;
        default:
          break;
      }
    }

    updateButtons();
    update();
  };

  model.save = function () {
    m_data.saved_data = JSON.parse(JSON.stringify(m_data.current_data));

    updateButtons();
    update();
  };

  model.reset = function () {
    m_data.current_data = JSON.parse(JSON.stringify(m_data.saved_data));

    updateButtons();
    update();
  };

  model.randomize = function () {
    var selection = m_data.active.selection;

    if (m_data.buttons.randomize == true) {
      switch (selection) {
        case 'all':
          randomizeAllTableValues();
          break;
        case 'jobsNumber':
          randomizeJobsNumber();
          break;
        case 'machinesNumber':
          randomizeMachinesNumber();
          break;
        case 'job':
          randomizeJobValues(m_data.active.jobID);
          break;
        case 'machine':
          randomizeMachineValues(m_data.active.machineID);
          break;
        case 'cell':
          randomizeCellValue(m_data.active.jobID, m_data.active.machineID);
          break;
        default:
          break;
      }
    }

    updateButtons();
    update();
  };

  model.select = function () {
    var what = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var jobID = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var machineID = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

    m_data.active.selection = what;
    m_data.active.jobID = jobID;
    m_data.active.machineID = machineID;

    updateButtons();
    update();
  };

  model.selectAlgorithm = function (new_algorithm) {
    for (var i = 0; i < all_algorithms.length; i++) if (new_algorithm === all_algorithms[i]) m_data.algorithm = new_algorithm;

    update();
  };

  model.solve = function () {
    return engine.solve(m_data.algorithm, m_data.current_data);
  };

  model.solveAll = function () {
    var all_solutions = [],
        single_solution = {};

    for (var i = 0; i < all_algorithms.length; i++) {
      single_solution = engine.solve(all_algorithms[i], m_data.current_data);
      all_solutions.push(single_solution);
    }

    return all_solutions;
  };

  return model;
};

module.exports = Model();