var should = require('should'),
    sinon  = require('sinon'),
    engine = require('../build/FlowShopSolver'),
    model  = require('../build/InputFormModel');



describe('FlowShopSolver tests ', () => {

	describe('jobs order tests', function() {
		var tests = [		
			{
				algorithm: 'johnson',
				current_data: [ 
					            {jobID: 1, times: [7, 6]},
					            {jobID: 2, times: [8, 2]},
					            {jobID: 3, times: [4, 6]},
					            {jobID: 4, times: [2, 8]},
					            {jobID: 5, times: [4, 6]},
					            {jobID: 6, times: [3, 10]},
					            {jobID: 7, times: [9, 2]},
					            {jobID: 8, times: [2, 1]}
					           ],      
				expected: {
			     	jobs_order: [4, 6, 3, 5, 1, 2, 7, 8]
				}
			}
		];

		tests.forEach(function(test) {
			it('check job order', function() {

				engine.init();
				var solution = engine.solve(test.algorithm, test.current_data),
					 {scheduled_data, jobs_order, c_max, f_mean} = solution;

					 //console.log(solution.scheduled_data[0]);

				jobs_order.should.eql(test.expected.jobs_order);
			});
		});

	});

	describe('johnson algorithm tests', function() {
		var tests = [
			{
				algorithm: 'johnson',
				current_data: [ 
					            {jobID: 1, times: [4, 5]},
					            {jobID: 2, times: [4, 1]},
					            {jobID: 3, times: [8, 4]}, 
					            {jobID: 4, times: [6, 8]}, 
					            {jobID: 5, times: [2, 3]}
					           ],      
				expected: {
					scheduled_data: [
			     					      { machineID: 1, 
			     					        jobs: [
			     					                { jobID: 5, jobStart: 0, jobDuration: 2 },
			     					                { jobID: 1, jobStart: 2, jobDuration: 4 },
			     					                { jobID: 4, jobStart: 6, jobDuration: 6 },
			     					                { jobID: 3, jobStart: 12, jobDuration: 8 },
			     					                { jobID: 2, jobStart: 20, jobDuration: 4 }
			     					              ]
			     					      },
			     					      { machineID: 2, 
			     					        jobs: [
			     					                { jobID: 5, jobStart: 2, jobDuration: 3 },
			     					                { jobID: 1, jobStart: 6, jobDuration: 5 },
			     					                { jobID: 4, jobStart: 12, jobDuration: 8 },
			     					                { jobID: 3, jobStart: 20, jobDuration: 4 },
			     					                { jobID: 2, jobStart: 24, jobDuration: 1 }
			     					              ]
			     					      }
			     					    ],
			     	jobs_order: [5, 1, 4, 3, 2],
			     	c_max: 25,
			     	f_mean: 17
				}
			},
			{
				algorithm: 'johnson',
				current_data: [ 
					            {jobID: 1, times: [3, 3, 0, 0, 0, 0]},
					            {jobID: 2, times: [0, 0, 0, 0, 0, 0]},
					            {jobID: 3, times: [0, 0, 0, 3, 1, 2]},
					            {jobID: 4, times: [0, 0, 3, 1, 0, 0]},
					            {jobID: 5, times: [0, 0, 0, 0, 2, 3]},
					            {jobID: 6, times: [2, 0, 0, 0, 0, 0]}
					           ],      
				expected: {
					scheduled_data: [
			     					      { machineID: 1, 
			     					        jobs: [
			     					                { jobID: 1, jobStart: 0, jobDuration: 3 },
			     					                { jobID: 6, jobStart: 3, jobDuration: 2 }
			     					              ]
			     					      },
			     					      { machineID: 2, 
			     					        jobs: [
			     					                { jobID: 1, jobStart: 3, jobDuration: 3 }
			     					              ]
			     					      },
			     					      { machineID: 3, 
			     					        jobs: [
			     					                { jobID: 4, jobStart: 0, jobDuration: 3 }
			     					              ]
			     					      },
			     					      { machineID: 4, 
			     					        jobs: [
			     					                { jobID: 3, jobStart: 0, jobDuration: 3 },
			     					                { jobID: 4, jobStart: 3, jobDuration: 1 }
			     					              ]
			     					      },
			     					      { machineID: 5, 
			     					        jobs: [
			     					                { jobID: 3, jobStart: 3, jobDuration: 1 },
			     					                { jobID: 5, jobStart: 4, jobDuration: 2 }
			     					              ]
			     					      },
			     					      { machineID: 6, 
			     					        jobs: [
			     					                { jobID: 3, jobStart: 4, jobDuration: 2 },
			     					                { jobID: 5, jobStart: 6, jobDuration: 3 }
			     					              ]
			     					      }
			     					    ],
			     	jobs_order: [2, 3, 5, 4, 1, 6],
			     	c_max: 9,
			     	f_mean: 5
				}
			}
		];

		tests.forEach(function(test) {
			it('solve johnson', function() {

				engine.init();
				var solution = engine.solve(test.algorithm, test.current_data),
					 {scheduled_data, jobs_order, c_max, f_mean} = solution;

					 //console.log(solution.scheduled_data[0]);

				scheduled_data.should.eql(test.expected.scheduled_data);
				jobs_order.should.eql(test.expected.jobs_order);
				c_max.should.eql(test.expected.c_max);
				f_mean.should.eql(test.expected.f_mean);

				// var solution = engine.solve(test.algorithm, test.current_data);
				// console.log(solution[0]);
			});
		});

	});

	describe('johnson-no-wait algorithm tests', function() {
		var tests = [			
			{
				algorithm: 'johnson-no-wait',
				current_data: [ 
					            {jobID: 1, times: [7, 5]},
					            {jobID: 2, times: [8, 10]},
					            {jobID: 3, times: [4, 7]}
					           ],      
				expected: {
					scheduled_data: [
			     					      { machineID: 1, 
			     					        jobs: [
			     					                { jobID: 3, jobStart: 0, jobDuration: 4 },
			     					                { jobID: 2, jobStart: 4, jobDuration: 8 },
			     					                { jobID: 1, jobStart: 15, jobDuration: 7 }
			     					              ]
			     					      },
			     					      { machineID: 2, 
			     					        jobs: [
			     					                { jobID: 3, jobStart: 4, jobDuration: 7 },
			     					                { jobID: 2, jobStart: 12, jobDuration: 10 },
			     					                { jobID: 1, jobStart: 22, jobDuration: 5 }
			     					              ]
			     					      }
			     					    ],
			     	jobs_order: [3, 2, 1],
			     	c_max: 27,
			     	f_mean: 20
				}
			},
			{
				algorithm: 'johnson-no-wait',
				current_data: [ 
					            {jobID: 1, times: [4, 0, 6]},
					            {jobID: 2, times: [7, 1, 6]}
					           ],      
				expected: {
					scheduled_data: [
			     					      { machineID: 1, 
			     					        jobs: [
			     					                { jobID: 2, jobStart: 0, jobDuration: 7 },
			     					                { jobID: 1, jobStart: 10, jobDuration: 4 }
			     					              ]
			     					      },
			     					      { machineID: 2, 
			     					        jobs: [
			     					                { jobID: 2, jobStart: 7, jobDuration: 1 }
			     					              ]
			     					      },
			     					      { machineID: 3, 
			     					        jobs: [
			     					                { jobID: 2, jobStart: 8, jobDuration: 6 },
			     					                { jobID: 1, jobStart: 14, jobDuration: 6 }
			     					              ]
			     					      }
			     					    ],
			     	jobs_order: [2, 1],
			     	c_max: 20,
			     	f_mean: 17
				}
			}
		];

		tests.forEach(function(test) {
			it('solve johnson-no-wait', function() {

				engine.init();
				var solution = engine.solve(test.algorithm, test.current_data),
					 {scheduled_data, jobs_order, c_max, f_mean} = solution;

					 //console.log(solution.scheduled_data[0]);

				scheduled_data.should.eql(test.expected.scheduled_data);
				jobs_order.should.eql(test.expected.jobs_order);
				c_max.should.eql(test.expected.c_max);
				f_mean.should.eql(test.expected.f_mean);
			});
		});

	});

	describe('johnson-no-idle algorithm tests', function() {
		var tests = [		
			{
				algorithm: 'johnson-no-idle',
				current_data: [ 
					            {jobID: 1, times: [4, 1, 6]},
					            {jobID: 2, times: [7, 1, 6]}
					           ],      
				expected: {
					scheduled_data: [
			     					      { machineID: 1, 
			     					        jobs: [
			     					                { jobID: 1, jobStart: 0, jobDuration: 4 },
			     					                { jobID: 2, jobStart: 4, jobDuration: 7 }
			     					              ]
			     					      },
			     					      { machineID: 2, 
			     					        jobs: [
			     					                { jobID: 1, jobStart: 10, jobDuration: 1 },
			     					                { jobID: 2, jobStart: 11, jobDuration: 1 }
			     					              ]
			     					      },
			     					      { machineID: 3, 
			     					        jobs: [
			     					                { jobID: 1, jobStart: 11, jobDuration: 6 },
			     					                { jobID: 2, jobStart: 17, jobDuration: 6 }
			     					              ]
			     					      }
			     					    ],
			     	jobs_order: [1, 2],
			     	c_max: 23,
			     	f_mean: 20
				}
			},	
			{
				algorithm: 'johnson-no-idle',
				current_data: [ 
					            {jobID: 1, times: [4, 0, 6]},
					            {jobID: 2, times: [7, 1, 6]}
					           ],      
				expected: {
					scheduled_data: [
			     					      { machineID: 1, 
			     					        jobs: [
			     					                { jobID: 2, jobStart: 0, jobDuration: 7 },
			     					                { jobID: 1, jobStart: 7, jobDuration: 4 }
			     					              ]
			     					      },
			     					      { machineID: 2, 
			     					        jobs: [
			     					                { jobID: 2, jobStart: 7, jobDuration: 1 }
			     					              ]
			     					      },
			     					      { machineID: 3, 
			     					        jobs: [
			     					                { jobID: 2, jobStart: 8, jobDuration: 6 },
			     					                { jobID: 1, jobStart: 14, jobDuration: 6 }
			     					              ]
			     					      }
			     					    ],
			     	jobs_order: [2, 1],
			     	c_max: 20,
			     	f_mean: 17
				}
			}
		];

		tests.forEach(function(test) {
			it('solve johnson-no-idle', function() {

				engine.init();
				var solution = engine.solve(test.algorithm, test.current_data),
					 {scheduled_data, jobs_order, c_max, f_mean} = solution;

					 //console.log(solution.scheduled_data[0]);

				scheduled_data.should.eql(test.expected.scheduled_data);
				jobs_order.should.eql(test.expected.jobs_order);
				c_max.should.eql(test.expected.c_max);
				f_mean.should.eql(test.expected.f_mean);
			});
		});

	});

});

/*
	{jobID: 1, times: [5, 8, 1, 7, 5, 8, 8]},
	{jobID: 2, times: [2, 3, 0, 5, 5, 1, 1]},
	{jobID: 3, times: [5, 9, 4, 0, 6, 5, 5]},
	{jobID: 4, times: [4, 8, 0, 4, 4, 4, 3]},
	{jobID: 5, times: [1, 2, 5, 9, 9, 6, 7]}

	{jobID: 1, times: [0, 0, 3, 3, 0, 2, 2]},
	{jobID: 2, times: [0, 0, 2, 2, 3, 0, 0]},
	{jobID: 3, times: [0, 0, 0, 0, 0, 0, 0]},
	{jobID: 4, times: [0, 0, 0, 3, 1, 1, 0]},
	{jobID: 5, times: [0, 0, 0, 0, 0, 2, 3]}
*/
