var React     = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template  = require('./TemplateComp'),
    
    Model     = require('./InputFormModel');



var roundUp = function(number, prec) {
  var tempnumber = number * Math.pow(10, prec);
  tempnumber = Math.ceil(tempnumber);
  return tempnumber / Math.pow(10, prec);
};

var Axis = React.createClass({
  render: function(){
    var props = this.props,
        value_position = props.data * 100 / props.axis_max,
        styles = { left: roundUp(value_position, 2).toString() + '%' };

    return (
      <span style={ styles }>{ props.data }</span>
    );
  }
});

var Box = React.createClass({
  render: function(){
    var props = this.props,
        colors = ['#3498db', '#2ecc71', '#9b59b6', '#34495e', '#f1c40f', '#95a5a6', '#e67e22', '#e74c3c', '#1e1e1e', '#1abc9c', '#680000', '#ff00cc'],
        job_start = props.data.jobStart * 100 / props.axis_max,
        job_duration = props.data.jobDuration * 100 / props.axis_max,

        styles = { left: roundUp(job_start, 2).toString() + '%', width: roundUp(job_duration, 2).toString() + '%', background: colors[props.data.jobID - 1] };

    return (
      <span className="job" style={ styles }>
        <span className="pin start">{ props.data.jobStart }</span>
        <span className="pin finish">{ props.data.jobStart + props.data.jobDuration }</span>
        { props.data.jobID }
      </span>
    );
  }
});

var Jobs = React.createClass({
  render: function(){
    var props = this.props;

    var jobs = props.data.jobs.map( (box) => <Box data={ box }
                                                  axis_max={ props.axis_max } 
                                                  key={ box.jobID } /> );    

    return (
     <div className="machine">
        <span className="machine-number">{ props.machine_number }</span>
        { jobs }        
      </div>
    );
  }
});

var Gantt = React.createClass({
  render: function() {
    var props = this.props,
        axis_max = 0,
        axis_values = new Array();

    // prepare axis values
    if(props.data.c_max <= 30) {
      axis_max = props.data.c_max + (2 - props.data.c_max%2); // make axis_max divisible by 2...
      for(var i = 0; i <= axis_max; i++)
        axis_values.push(i);
    }
    else if(props.data.c_max > 20 && props.data.c_max <= 100) {
      axis_max = props.data.c_max + (5 - props.data.c_max%5); // ...by 5
      for(var i = 0; i <= axis_max/5; i++)
        axis_values.push(i*5);
    }
    else {
      axis_max = props.data.c_max + (10 - props.data.c_max%10); // ...by 10
      for(var i = 0; i <= axis_max/10; i++)
        axis_values.push(i*10);
    }

    var axis = axis_values.map( (value) => <Axis data={ value } 
                                                 axis_max={ axis_max } 
                                                 key={ value } /> );

    var machines = props.data.scheduled_data.map( (row) => <Jobs data={ row } 
                                                                 machine_number={ row.machineID } 
                                                                 axis_max={ axis_max } 
                                                                 key={ row.machineID } /> );

    return (
      <Template>
        <div className="wrapper gantt-wrapper">
          <div className="container x-large">
            <div className="content">
              <div className="info">Gantt chart</div>

              <div className="chart-wrapper">
                { machines }
                <div className="axis">
                  { axis }
                </div>
              </div>

              <div className="subinfo">
                C<sub>max</sub> = { props.data.c_max }
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
                F<sub>mean</sub> = { roundUp(props.data.f_mean, 2) }
                &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;
                Order: { props.data.jobs_order.join(", ") }
              </div>
            </div>
          </div>
        </div>
      </Template>
    );
  }
});

module.exports = Gantt;

