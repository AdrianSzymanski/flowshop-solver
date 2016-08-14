'use strict';

var FlowShopSolver = function FlowShopSolver() {

  var engine = Object.create(null),
      solution = {};

  engine.init = function () {
    solution = {
      scheduled_data: [],
      jobs_order: [],
      c_max: null,
      f_mean: null
    };
  };

  engine.solve = function (algorithm, data) {
    var sorted_data,
        jobs_order = [],
        c_max = null,
        f_mean = null,
        jobs_orders = [],
        temp_c_max = null,
        min_c_max = null,
        temp_f_mean = null,
        min_f_mean = null,
        filtered_sequences = [];

    switch (algorithm) {
      case 'johnson':
        jobs_order = getJobsOrder(data, 'johnson');
        sorted_data = solveNormal(data, jobs_order);

        c_max = getCMax(sorted_data);
        f_mean = getFMean(sorted_data);
        break;
      case 'johnson-no-wait':
        jobs_order = getJobsOrder(data, 'johnson');
        sorted_data = solveNoWait(data, jobs_order);

        c_max = getCMax(sorted_data);
        f_mean = getFMean(sorted_data);
        break;
      case 'johnson-no-idle':
        jobs_order = getJobsOrder(data, 'johnson');
        sorted_data = solveNoIdle(data, jobs_order);

        c_max = getCMax(sorted_data);
        f_mean = getFMean(sorted_data);
        break;
      case 'random':
        // return array of sequences
        jobs_orders = getRandomJobsOrder(data);

        // check all of the sequences and find those with minimal c_max
        for (var i = 0; i < jobs_orders.length; i++) {
          sorted_data = solveNormal(data, jobs_orders[i]);

          // find minimal c_max and get the sequences
          temp_c_max = getCMax(sorted_data);
          if (min_c_max === null) {
            min_c_max = temp_c_max;
            filtered_sequences.push(jobs_orders[i]);
          } else if (temp_c_max < min_c_max) {
            min_c_max = temp_c_max;
            filtered_sequences = [];
            filtered_sequences.push(jobs_orders[i]);
          } else if (temp_c_max === min_c_max) {
            filtered_sequences.push(jobs_orders[i]);
          }
        }

        // check all of the filtered sequences and find the one with minimal f_mean
        for (var i = 0; i < filtered_sequences.length; i++) {
          sorted_data = solveNormal(data, filtered_sequences[i]);

          // find minimal f_mean and get the sequence
          temp_f_mean = getFMean(sorted_data);
          if (min_f_mean === null) {
            min_f_mean = temp_f_mean;
            jobs_order = filtered_sequences[i];
          } else if (temp_f_mean < min_f_mean) {
            min_f_mean = temp_f_mean;
            jobs_order = filtered_sequences[i];
          }
        }

        // get solution for the optimal sequence
        sorted_data = solveNormal(data, jobs_order);
        c_max = getCMax(sorted_data);
        f_mean = getFMean(sorted_data);
        break;
      case 'random-no-wait':
        // return array of sequences
        jobs_orders = getRandomJobsOrder(data);

        // check all of the sequences and find those with minimal c_max
        for (var i = 0; i < jobs_orders.length; i++) {
          sorted_data = solveNoWait(data, jobs_orders[i]);

          // find minimal c_max and get the sequences
          temp_c_max = getCMax(sorted_data);
          if (min_c_max === null) {
            min_c_max = temp_c_max;
            filtered_sequences.push(jobs_orders[i]);
          } else if (temp_c_max < min_c_max) {
            min_c_max = temp_c_max;
            filtered_sequences = [];
            filtered_sequences.push(jobs_orders[i]);
          } else if (temp_c_max === min_c_max) {
            filtered_sequences.push(jobs_orders[i]);
          }
        }

        // check all of the filtered sequences and find the one with minimal f_mean
        for (var i = 0; i < filtered_sequences.length; i++) {
          sorted_data = solveNoWait(data, filtered_sequences[i]);

          // find minimal f_mean and get the sequence
          temp_f_mean = getFMean(sorted_data);
          if (min_f_mean === null) {
            min_f_mean = temp_f_mean;
            jobs_order = filtered_sequences[i];
          } else if (temp_f_mean < min_f_mean) {
            min_f_mean = temp_f_mean;
            jobs_order = filtered_sequences[i];
          }
        }

        // get solution for the optimal sequence
        sorted_data = solveNoWait(data, jobs_order);
        c_max = getCMax(sorted_data);
        f_mean = getFMean(sorted_data);
        break;
      case 'random-no-idle':
        // return array of sequences
        jobs_orders = getRandomJobsOrder(data);

        // check all of the sequences and find those with minimal c_max
        for (var i = 0; i < jobs_orders.length; i++) {
          sorted_data = solveNoIdle(data, jobs_orders[i]);

          // find minimal c_max and get the sequences
          temp_c_max = getCMax(sorted_data);
          if (min_c_max === null) {
            min_c_max = temp_c_max;
            filtered_sequences.push(jobs_orders[i]);
          } else if (temp_c_max < min_c_max) {
            min_c_max = temp_c_max;
            filtered_sequences = [];
            filtered_sequences.push(jobs_orders[i]);
          } else if (temp_c_max === min_c_max) {
            filtered_sequences.push(jobs_orders[i]);
          }
        }

        // check all of the filtered sequences and find the one with minimal f_mean
        for (var i = 0; i < filtered_sequences.length; i++) {
          sorted_data = solveNoIdle(data, filtered_sequences[i]);

          // find minimal f_mean and get the sequence
          temp_f_mean = getFMean(sorted_data);
          if (min_f_mean === null) {
            min_f_mean = temp_f_mean;
            jobs_order = filtered_sequences[i];
          } else if (temp_f_mean < min_f_mean) {
            min_f_mean = temp_f_mean;
            jobs_order = filtered_sequences[i];
          }
        }

        // get solution for the optimal sequence
        sorted_data = solveNoIdle(data, jobs_order);
        c_max = getCMax(sorted_data);
        f_mean = getFMean(sorted_data);
        break;
      default:
        break;
    }

    solution = {
      scheduled_data: sorted_data,
      jobs_order: jobs_order,
      c_max: c_max,
      f_mean: f_mean
    };

    return solution;
  };

  // helper functions
  var getJobsOrder = function getJobsOrder(data) {
    var algorithm = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];

    var jobs_order = [],
        jobs_number = data.length,
        machines_number = data[0].times.length,
        two_machines_data = [],
        new_job;

    for (var i = 0; i < data.length; i++) {
      new_job = { jobID: i + 1, times: [0, 0] };
      two_machines_data.push(new_job);
    };

    /* 
     *    Reduce problem to two-machine problem.
     *    two_machines_data: [ {jobID: 1, times: [0 + 0  |  0 + 0]},
     *                         {jobID: 2, times: [0 + 0  |  0 + 0]},
     *                         {jobID: 3, times: [0 + 0  |  0 + 0]} ];
     *
     */

    if (machines_number === 2) two_machines_data = JSON.parse(JSON.stringify(data));else if (machines_number % 2 === 0) {

      // 4
      for (var i = 0; i < data.length; i++) {
        // 0, 1
        for (var j = 0; j < machines_number / 2; j++) {
          two_machines_data[i].times[0] += data[i].times[j];
        };
      };
      for (var i = 0; i < data.length; i++) {
        // 2, 3
        for (var j = machines_number / 2; j < machines_number; j++) {
          two_machines_data[i].times[1] += data[i].times[j];
        };
      };
    } else {
      // for odd number of machines take the last machine and add its times to each of the two final machines

      // 5
      for (var i = 0; i < data.length; i++) {
        // 0, 1
        for (var j = 0; j < Math.floor(machines_number / 2); j++) {
          two_machines_data[i].times[0] += data[i].times[j] + data[i].times[machines_number - 1];
        };
      };
      for (var i = 0; i < data.length; i++) {
        // 2, 3
        for (var j = Math.floor(machines_number / 2); j < machines_number - 1; j++) {
          two_machines_data[i].times[1] += data[i].times[j] + data[i].times[machines_number - 1];
        };
      };
    }

    if (algorithm === 'johnson') {
      /* 
       *    Sort using Johnson algorithm.
       *
       */

      var conditions = function conditions(a, b) {
        if (a.times[0] <= a.times[1] && b.times[0] <= b.times[1]) {
          if (a.times[0] < b.times[0]) return -1;else if (a.times[0] == b.times[0]) return 0;else return 1;
        } else if (a.times[0] <= a.times[1] && b.times[0] > b.times[1]) {
          return -1;
        } else if (a.times[0] > a.times[1] && b.times[0] <= b.times[1]) {
          return 1;
        } else if (a.times[0] > a.times[1] && b.times[0] > b.times[1]) {
          if (a.times[1] < b.times[1]) return 1;else if (a.times[1] == b.times[1]) return 0;else return -1;
        }
      };

      two_machines_data.sort(conditions);
      jobs_order = two_machines_data.map(function (row) {
        return row.jobID;
      });
    } else {

      // return an unsorted array
      jobs_order = two_machines_data.map(function (row) {
        return row.jobID;
      });
    }

    return jobs_order; // i.e: [5, 1, 4, 3, 2]
  };

  var getRandomJobsOrder = function getRandomJobsOrder(data) {
    /*
     *  Returns an array of all possible sequences or an array of some of them (if there is too many).
     *
     */

    var in_table = [],
        jobs_orders = [];

    // get the initial array
    in_table = data.map(function (row) {
      return row.jobID;
    }); // i.e: [1, 2, 3, 4, 5]

    // if it is small enough find all of the sequences, else - find some of them
    if (in_table.length <= 6) {
      var permArr, usedChars;

      var _ret = (function () {

        // source: http://stackoverflow.com/questions/9960908/permutations-in-javascript

        var permute = function permute(input) {
          var i, ch;
          for (i = 0; i < input.length; i++) {
            ch = input.splice(i, 1)[0];
            usedChars.push(ch);
            if (input.length == 0) {
              permArr.push(usedChars.slice());
            }
            permute(input);
            input.splice(i, 0, ch);
            usedChars.pop();
          }
          return permArr;
        };

        permArr = [];
        usedChars = [];
        ;

        jobs_orders = permute(in_table);
        return {
          v: jobs_orders
        };
      })();

      if (typeof _ret === 'object') return _ret.v;
    } else {

      // source: http://bost.ocks.org/mike/shuffle/

      var shuffle = function shuffle(array) {
        var m = array.length,
            t,
            i;
        // while there remain elements to shuffle...
        while (m) {
          // ...pick a remaining element...
          i = Math.floor(Math.random() * m--);
          // ...and swap it with the current element.
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }
        return array;
      };

      var temp = [];

      for (var k = 0; k < 720; k++) {
        temp = shuffle(in_table);
        jobs_orders.push(temp);
      }

      return jobs_orders;
    }
  };

  var getSolutionTable = function getSolutionTable(data, jobs_order) {
    /*
     *  Create solution table containing all machines, jobs order and jobs duration:
     *  sorted_data = 
     *    [
     *      { machineID: 1, 
     *        jobs: [
     *                { jobID: 2, jobStart: 0, jobDuration: 5 },
     *                { jobID: 1, jobStart: 5, jobDuration: 3 }
     *              ]
     *      },
     *      ...
     *    ];
     *
     */

    var sorted_data = [],
        new_machine = {},
        new_job = {},
        row;

    for (var i = 0; i < data[0].times.length; i++) {
      new_machine = { machineID: i + 1, jobs: [] };
      sorted_data.push(new_machine);
    };
    for (var i = 0; i < sorted_data.length; i++) {
      for (var j = 0; j < jobs_order.length; j++) {
        row = jobs_order[j];
        new_job = { jobID: row, jobStart: 0, jobDuration: data[row - 1].times[i] };

        // insert new job only if it occupies the machine
        if (new_job.jobDuration !== 0) sorted_data[i].jobs.push(new_job);
      };
    };

    return sorted_data;
  };

  var getPreviousMachineFinish = function getPreviousMachineFinish(sorted_data, machine_number, job_number) {
    /*
     *  Finds specified job finish time on the previous machine
     *  (does not apply to the first machine).
     *
     */

    if (machine_number <= 0) return false;

    var jobID = sorted_data[machine_number].jobs[job_number].jobID;

    for (var i = machine_number - 1; i >= 0; i--) {
      for (var j = sorted_data[i].jobs.length - 1; j >= 0; j--) {

        if (sorted_data[i].jobs[j].jobID === jobID) return sorted_data[i].jobs[j].jobStart + sorted_data[i].jobs[j].jobDuration;
      };
    };

    return 0;
  };

  var getPreviousJobFinish = function getPreviousJobFinish(sorted_data, machine_number, job_number) {
    /*
     *  Finds previous job finish time on current machine
     *  (does not apply to the first job).
     *
     */

    if (job_number <= 0) return 0;

    return sorted_data[machine_number].jobs[job_number - 1].jobStart + sorted_data[machine_number].jobs[job_number - 1].jobDuration;
  };

  var getCMax = function getCMax(sorted_data) {
    var machines_number = sorted_data.length,
        last_job = 0,
        c_max = 0,
        c_x = 0;

    for (var i = 0; i < machines_number; i++) {
      last_job = sorted_data[i].jobs.length - 1;
      if (last_job < 0) continue;else {
        c_x = sorted_data[i].jobs[last_job].jobStart + sorted_data[i].jobs[last_job].jobDuration;
        if (c_x > c_max) c_max = c_x;
      }
    };

    return c_max;
  };

  var getCX = function getCX(sorted_data, jobID) {
    var machines_number = sorted_data.length,
        maxID = 1,
        c_x = 0,
        temp = 0;

    // find max ID of jobs
    for (var i = 0; i < machines_number; i++) {
      for (var j = 0; j < sorted_data[i].jobs.length; j++) {

        if (sorted_data[i].jobs[j].jobID > maxID) maxID = sorted_data[i].jobs[j].jobID;
      };
    };

    // find specified job and return its c_x
    for (var i = 0; i < machines_number; i++) {
      for (var j = 0; j < sorted_data[i].jobs.length; j++) {

        temp = sorted_data[i].jobs[j];
        if (temp.jobID === jobID && temp.jobStart + temp.jobDuration > c_x) c_x = temp.jobStart + temp.jobDuration;
      };
    };

    return c_x;
  };

  var getFMean = function getFMean(sorted_data) {
    var f_mean = 0,
        machines_number = sorted_data.length,
        maxID = 1,
        c_x = 0,
        nominator = [];

    // find max ID of jobs
    for (var i = 0; i < machines_number; i++) {
      for (var j = 0; j < sorted_data[i].jobs.length; j++) {

        if (sorted_data[i].jobs[j].jobID > maxID) maxID = sorted_data[i].jobs[j].jobID;
      };
    };

    // find all c_x
    for (var j = 1; j <= maxID; j++) {
      c_x = getCX(sorted_data, j);
      nominator.push(c_x);
    };

    var sum = 0;
    for (var i = 0; i < nominator.length; i++) sum += nominator[i];

    f_mean = sum / nominator.length;

    return f_mean;
  };

  var getEarlierMachineFinish = function getEarlierMachineFinish(sorted_data, machine_number, job_number) {
    /*
     *  Finds specified job finish time on one of the earlier machines
     *  by looking for first non-zero finish time on each earlier machine
     *  (does not apply to the first machine).
     *
     */

    var previous_job_finish = 0;

    if (machine_number <= 0) return false;

    var jobID = sorted_data[machine_number].jobs[job_number].jobID;

    for (var i = machine_number - 1; i >= 0; i--) {
      for (var j = sorted_data[i].jobs.length - 1; j >= 0; j--) {

        if (sorted_data[i].jobs[j].jobID === jobID) {
          previous_job_finish = sorted_data[i].jobs[j].jobStart + sorted_data[i].jobs[j].jobDuration;
          if (previous_job_finish === 0) continue;else return previous_job_finish;
        }
      };
    };

    return previous_job_finish;
  };

  var delayJobsOnCurrentMachine = function delayJobsOnCurrentMachine(sorted_data, jobs_order, machine_number, job_number, delay) {
    /*
     *  Dalays specified job starting time as well as all following starting times on this machine.
     *
     */

    /*console.log('machine_number: '+machine_number);*/
    /*console.log('job_number: '+job_number);*/

    var jobID = sorted_data[machine_number].jobs[job_number].jobID,
        job_position = null;

    // find job position on the machine (from 0 to jobs_order.length-1)
    for (var i = 0; i < sorted_data[machine_number].jobs.length; i++) {
      if (sorted_data[machine_number].jobs[i].jobID === jobID) job_position = i;
    }
    /*console.log('job_position: '+job_position);*/

    for (var j = job_position; j < sorted_data[machine_number].jobs.length; j++) {
      sorted_data[machine_number].jobs[j].jobStart += delay;
      /*console.log('jobStart dla '+j+ ': '+sorted_data[machine_number].jobs[j].jobStart);*/
    }
  };

  var delayJobsOnEarlierMachines = function delayJobsOnEarlierMachines(sorted_data, jobs_order, machine_number, job_number, delay) {
    /*
     *  Dalays specified job starting time on earlier machines as well as following starting times on these machines
     *  (does not apply to the first machine).
     *
     */

    var jobID = sorted_data[machine_number].jobs[job_number].jobID,
        job_position = null,
        job_order_position = 0;

    // for each earlier machine
    for (var i = machine_number - 1; i >= 0; i--) {

      // find job position on the machine (from 0 to jobs_order.length-1)
      for (var k = 0; k < sorted_data[i].jobs.length; k++) {
        if (sorted_data[i].jobs[k].jobID === jobID) job_position = k;
      }
      /*console.log('job_position: '+job_position);*/

      // if there is no specified job on earlier machine find the following jobs in jobs_order and delay them, too
      if (job_position === null) {
        // jobs_order = [2, 5, 4, 1, 3];
        // jobID == 4;

        for (var k = 0; k < jobs_order.length; k++) {
          if (jobs_order[k] === jobID) job_order_position = k;
          // 2
        }

        // for all jobs on the current machine delay only those which are located after jobID (1 and 3 in this example)
        for (var j = 0; j < sorted_data[i].jobs.length; j++) {
          for (var k = job_order_position + 1; k < jobs_order.length; k++) {
            if (sorted_data[i].jobs[j].jobID === jobs_order[k]) {
              sorted_data[i].jobs[j].jobStart += delay;
              /*console.log('jobStart dla m: '+i+' z: '+j+ ': '+sorted_data[i].jobs[j].jobStart);*/
            }
          }
        }

        continue;
      }

      // if there is a specified job on earlier machine - delay it and delay the following jobs as well
      for (var j = job_position; j < sorted_data[i].jobs.length; j++) {
        sorted_data[i].jobs[j].jobStart += delay;
        /*console.log('jobStart dla m: '+i+' z: '+j+ ': '+sorted_data[i].jobs[j].jobStart);*/
      }

      job_position = null;
    }
  };

  var findJobsMinIdleTime = function findJobsMinIdleTime(sorted_data, jobID) {
    /*
     *  Finds job minimal idle time from all machines it occupies.
     *
     */

    var min_idle = null,
        previous_job_finish = 0;

    // for each machine and job
    for (var i = 0; i < sorted_data.length; i++) {
      for (var j = 0; j < sorted_data[i].jobs.length; j++) {

        // if you find specified job, check the earlier job finish time
        if (sorted_data[i].jobs[j].jobID === jobID) {
          previous_job_finish = getPreviousJobFinish(sorted_data, i, j);

          // if previous job finish time is equal to specified job starting time, there is no idle time
          if (previous_job_finish === sorted_data[i].jobs[j].jobStart) return 0;else {
            // for the first found idle_time
            if (min_idle === null) min_idle = sorted_data[i].jobs[j].jobStart - previous_job_finish;
            // for other idle times pick the smaller one
            else if (min_idle > sorted_data[i].jobs[j].jobStart - previous_job_finish) min_idle = sorted_data[i].jobs[j].jobStart - previous_job_finish;
          }
        }
      }
    }

    return min_idle;
  };

  var translateJob = function translateJob(sorted_data, jobID, translation) {
    /*
     *  Translates specified jobs to the left.
     *
     */

    for (var i = 0; i < sorted_data.length; i++) {
      for (var j = 0; j < sorted_data[i].jobs.length; j++) {

        if (sorted_data[i].jobs[j].jobID === jobID) sorted_data[i].jobs[j].jobStart -= translation;
      }
    }
  };

  // main functions
  var solveNormal = function solveNormal(data, jobs_order) {
    var sorted_data = getSolutionTable(data, jobs_order),
        previous_machine_finish = 0,
        previous_job_finish = 0;

    // place jobs on first machine (first job is already placed)
    for (var i = 1; i < sorted_data[0].jobs.length; i++) sorted_data[0].jobs[i].jobStart = sorted_data[0].jobs[i - 1].jobStart + sorted_data[0].jobs[i - 1].jobDuration;

    // place jobs on the remaining machines
    for (var i = 1; i < sorted_data.length; i++) {
      for (var j = 0; j < sorted_data[i].jobs.length; j++) {

        // for first job on each machine:
        if (j === 0) sorted_data[i].jobs[j].jobStart = getPreviousMachineFinish(sorted_data, i, j);else {
          // job may start after previous job is finished on current machine and after the same job is finished on previous machine
          previous_job_finish = getPreviousJobFinish(sorted_data, i, j);
          previous_machine_finish = getPreviousMachineFinish(sorted_data, i, j);

          sorted_data[i].jobs[j].jobStart = Math.max(previous_job_finish, previous_machine_finish);
        }
      };
    };

    return sorted_data;
  };

  var solveNoWait = function solveNoWait(data, jobs_order) {
    var sorted_data = getSolutionTable(data, jobs_order),
        machines_number = sorted_data.length,
        earlier_machine_finish = 0,
        this_machine_start = 0,
        difference = 0,
        delay = 0;

    /*
     *  Place all jobs on machines just like in solveNormal() function,
     *  but with no idle times.
     *
     */

    // place jobs on first machine (first job is already placed)
    for (var i = 1; i < sorted_data[0].jobs.length; i++) sorted_data[0].jobs[i].jobStart = sorted_data[0].jobs[i - 1].jobStart + sorted_data[0].jobs[i - 1].jobDuration;

    // place jobs on the remaining machines
    for (var i = 1; i < sorted_data.length; i++) {
      for (var j = 0; j < sorted_data[i].jobs.length; j++) {

        // for first job on each machine:
        if (j === 0) continue;else {
          // job starts after previous job is finished on current machine
          sorted_data[i].jobs[j].jobStart = getPreviousJobFinish(sorted_data, i, j);
        }
      };
    };

    /*
     *  Now, move all jobs so that the no-wait restriction is preserved.
     *
     */

    // for each machine and job find job's finish time on the earlier machine
    // and find job starting time on current machine,
    for (var i = 1; i < sorted_data.length; i++) {
      for (var j = 0; j < sorted_data[i].jobs.length; j++) {

        /*console.log('___________');*/
        /*console.log('i: '+ i + ', j: '+ j);*/

        this_machine_start = sorted_data[i].jobs[j].jobStart;
        earlier_machine_finish = getEarlierMachineFinish(sorted_data, i, j);
        difference = earlier_machine_finish - this_machine_start;

        // if job starting time is greater than job finish time on earlier machine
        if (difference < 0) {
          // delay job on earlier machines and delay following jobs on earlier machines
          delay = Math.abs(difference);
          /*console.log('delay: -' + delay);*/
          delayJobsOnEarlierMachines(sorted_data, jobs_order, i, j, delay);
        } else if (difference > 0) {
          // delay job and all following jobs on current machine
          delay = difference;
          /*console.log('delay: +' + delay);*/
          delayJobsOnCurrentMachine(sorted_data, jobs_order, i, j, delay);
        }
      }
    }

    /* 
     *  We shouldn't delay following jobs on earlier machines if there is no specified job on those machines.
     *  To fix it we have to chech each job and if it has any idle time on its every machine
     *  we must find its minimal idle time and then translate all the jobs.
     *
     */

    var min_idle = 0;

    for (var i = 0; i < jobs_order.length; i++) {
      min_idle = findJobsMinIdleTime(sorted_data, jobs_order[i]);

      if (min_idle > 0) translateJob(sorted_data, jobs_order[i], min_idle);
    };

    return sorted_data;
  };

  var solveNoIdle = function solveNoIdle(data, jobs_order) {
    var sorted_data = getSolutionTable(data, jobs_order),
        machines_number = sorted_data.length,
        earlier_machine_finish = 0,
        this_job_start = 0,
        delay = 0,
        delay_max = 0;

    /*
     *  Place all jobs on machines just like in solveJohnson() function,
     *  but with no idle times.
     *
     */

    /*console.log('--------------- NO-IDLE ---------------');*/

    // place jobs on first machine (first job is already placed)
    for (var i = 1; i < sorted_data[0].jobs.length; i++) sorted_data[0].jobs[i].jobStart = sorted_data[0].jobs[i - 1].jobStart + sorted_data[0].jobs[i - 1].jobDuration;

    // place jobs on the remaining machines
    for (var i = 1; i < sorted_data.length; i++) {
      for (var j = 0; j < sorted_data[i].jobs.length; j++) {

        // for first job on each machine:
        if (j === 0) continue;else {
          // job starts after previous job is finished on current machine
          sorted_data[i].jobs[j].jobStart = getPreviousJobFinish(sorted_data, i, j);
        }
      };
    };

    /*
     *  Now, find maximal delay time on each machine and delay all of the jobs.
     *
     */

    for (var i = 1; i < machines_number; i++) {
      for (var j = 0; j < sorted_data[i].jobs.length; j++) {

        /*console.log('___________');*/
        /*console.log('i: '+i+', j: '+j);*/

        this_job_start = sorted_data[i].jobs[j].jobStart;
        earlier_machine_finish = getEarlierMachineFinish(sorted_data, i, j);
        delay = earlier_machine_finish - this_job_start;

        /*console.log('this_job_start: '+this_job_start);*/
        /*console.log('earlier_machine_finish: '+earlier_machine_finish);*/
        /*console.log('delay: '+delay);*/

        // find maximal delay on the current machine
        if (delay > delay_max) delay_max = delay;

        /*console.log('delay_max: '+delay_max);*/
      }

      // if there is at least one job on the current machine, delay it
      if (sorted_data[i].jobs.length !== 0) {
        /*console.log('delayJobsOnCurrentMachine dla m: '+i+'z: '+j);*/
        delayJobsOnCurrentMachine(sorted_data, jobs_order, i, 0, delay_max);
      }

      delay_max = 0;
    }

    return sorted_data;
  };

  return engine;
};

module.exports = FlowShopSolver();