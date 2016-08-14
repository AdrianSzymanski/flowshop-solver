var React = require('react'),
    ReactDOM  = require('react-dom'),
    Bootstrap = require('react-bootstrap'),
    
    Header = require('./HeaderComp'),
    Info = require('./InfoComp'),
    BaseConf = require('./BaseConfComp'),
    Table = require('./TableComp'),
    Algorithm = require('./AlgorithmComp'),
    Gantt = require('./GanttComp'),
    CompareTable = require('./CompareTableComp'),
    
    Model = require('./InputFormModel');



Model.init();

var MainComp = React.createClass({

  getInitialState: function() {
    return Model.getData();
  },

  componentDidMount: function() {
    Model.addListener( this.onModelChange );
  },

  componentWillUnmount: function() {
    Model.removeListener( this.onModelChange );
  },

  render: function() {
    var data = this.state;

    return (
        <div>
            <Header       buttons={ data.buttons } />
            <Info         />
            <BaseConf     jobsNumber={ data.current_data.length }
                          machinesNumber={ data.current_data[0].times.length }
                          active={ data.active.selection } />
            <Table        data={ data.current_data }
                          active={ data.active.selection }
                          activeJob={ data.active.jobID }
                          activeMachine={ data.active.machineID } />
            <Algorithm    algorithm={ data.algorithm } />
            <Gantt        data={ Model.solve() }
                          algorithm={ data.algorithm } />
            <CompareTable data={ Model.solveAll() } />
        </div>
    );
  },

  onModelChange: function(new_data) {
    this.setState(new_data);
  }

});

ReactDOM.render(<MainComp />, document.getElementById('app'));
