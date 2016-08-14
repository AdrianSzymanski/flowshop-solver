var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template  = require('./TemplateComp'),
    
    Model = require('./InputFormModel');



var BaseConf = React.createClass({

  render: function() {
    let props = this.props;
    let job_style = (props.active === 'jobsNumber') ? 'number active' : 'number';
    let machine_style = (props.active === 'machinesNumber') ? 'number active' : 'number';
    
    return (
      <Template>
        <div className="wrapper top-wrapper">
          <div className="container x-large">
            <div className="content">
              <div className="info">Set up base configuration</div>
              <div className="row">

                <div className="col-sm-6">
                  <div className="jobs">
                    Number of jobs: 
                    <span className={ job_style } onClick={ this.jobsNumberClick }>{ props.jobsNumber }</span>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="machines">
                    Number of machines: 
                    <span className={ machine_style } onClick={ this.machinesNumberClick } >{ props.machinesNumber }</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </Template>
    );
  },

  jobsNumberClick: function() { Model.select('jobsNumber'); },
  machinesNumberClick: function() { Model.select('machinesNumber'); }

});

module.exports = BaseConf;

