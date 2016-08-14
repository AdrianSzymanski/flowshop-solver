var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template  = require('./TemplateComp'),
    
    Model = require('./InputFormModel');



var HeadCell = React.createClass({
  render: function(){
    var props = this.props,
        head_style = ( props.active === 'all' || 
                      (props.active === 'machine' && props.activeMachine === props.data) ) ? 'active' : '';

    return (
      <th className={ head_style } onClick={ this.columnClick }>{ props.data }</th>
    );
  },

  columnClick: function() {
    var props = this.props;
    Model.select('machine', null, props.data);
  }
});

var Cell = React.createClass({
  render: function(){
    var props = this.props,
        cell_style = ( props.active === 'all' || 
                      (props.active === 'job' && props.activeJob === props.job_number) || 
                      (props.active === 'machine' && props.activeMachine === props.machine_number) || 
                      (props.active === 'cell' && props.activeJob === props.job_number && props.activeMachine === props.machine_number) ) ? 'active' : '';

    return (
      <td onClick={ this.cellClick } className={ cell_style }>{ props.data }</td>
    );
  },

  cellClick: function() {
    var props = this.props;

    Model.select('cell', props.job_number, props.machine_number);
  }
});

var Row = React.createClass({
  render: function() {
    var props = this.props,
        machine_number = 0,
        row_style = ( props.active === 'all' || 
                     (props.active === 'job' && props.activeJob === props.data.jobID) ) ? 'active' : '';

    var cells = props.data.times.map( (cell) => <Cell data={ cell } 
                                                      active={ props.active } 
                                                      activeJob={ props.activeJob } 
                                                      activeMachine={ props.activeMachine } 
                                                      machine_number={ ++machine_number } 
                                                      job_number={ props.job_number } 
                                                      key={ machine_number }  /> );

    return (
      <tr>
        <th className={ row_style } onClick={ this.rowClick }>Job { props.data.jobID }</th>
        { cells }
      </tr>
    );
  },

  rowClick: function(){
    var props = this.props;

    Model.select('job', props.data.jobID);
  }
});

var Table = React.createClass({
  render: function() {
    var props = this.props,
        table_style = (props.active === 'all') ? 'active' : '',
        machine_number = 0;

    var rows = props.data.map( (row) => <Row data={ row } 
                                             active={ props.active } 
                                             activeJob={ props.activeJob } 
                                             activeMachine={ props.activeMachine } 
                                             job_number={ row.jobID } 
                                             key={ row.jobID } /> );
    var head_cells = props.data[0].times.map( (head_cell) => <HeadCell data={ ++machine_number } 
                                                                       active={ props.active } 
                                                                       activeJob={ props.activeJob } 
                                                                       activeMachine={ props.activeMachine } 
                                                                       key={ machine_number }  /> );
    
    return (
      <Template>
        <div className="wrapper table-wrapper">
          <div className="container x-large">
            <div className="content">
              <div className="info">Input problem data</div>

              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th className={ table_style } onClick={ this.allClick }>#</th>
                      { head_cells }
                    </tr>
                  </thead>
                  <tbody>
                    { rows }
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        </div>
      </Template>
    );
  },

  allClick: function() {
    Model.select('all');
  }
});

module.exports = Table;

