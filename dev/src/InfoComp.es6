var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template  = require('./TemplateComp'),
    
    Model = require('./InputFormModel');



var BaseConf = React.createClass({

  getInitialState: function(){
      return {
          condition: false
      }
  },

  handleClick: function() {
      this.setState( { condition : !this.state.condition } );
  },

  render: function() {
    var styles = { display: this.state.condition ? 'none' : 'block' };
    
    return (
      <div className="wrapper about-wrapper" style={ styles }>
        <div className="container x-large">
          <div className="content">
            <div className="info link" data-toggle="collapse" data-target="#desc">
              How it works
              <span className="glyphicon glyphicon-remove" onClick={ this.handleClick }></span>
            </div>
            <div className="text collapse" id="desc">
              Welcome to Flow-Shop scheduling application. This application was designed to solve no-wait and no-idle Flow-Shop problems. Let`s see how it works.
              <br /><br />
              In the top right corner you will find five buttons: <span className="button">+</span>, <span className="button">-</span>, <span className="button">Save</span>, <span className="button">Reset</span> and <span className="button">Randomize</span>. You can use them to interact with the application and set up your problem. Depending on the focused element, these buttons can be either active or disabled. The <span className="button">+</span> and <span className="button">-</span> buttons are active whenever the value of your selected element is located in the proper interval (allowed values are described below). The <span className="button">Save</span> button is always active and you can use it to save inserted data in case you want to restore them later. In that situation you can use the <span className="button">Reset</span> button, which is active whenever your currently inserted values differ from your saved values. The <span className="button">Randomize</span> button will activate after clicking on any table cell or any of the two boxes containing the quantity of jobs and machines.
              <br /><br />
              Let`s now have a look at the panels. The first panel lets you set up base configuration. Click the box <span className="box"></span> to choose desired job and machine quantity. You can select any number between <b>2</b> and <b>10</b>. After that, you can insert your data in the table below. A cell may contain any number between <b>0</b> and <b>10</b>. Note, that you can also select entire rows and columns. Additionally, you can select all of the cells by clicking the <b>#</b> symbol. When your data is inserted, you can now choose desired algorithm and see the Gantt chart in the next panel. Remember, that the solution is calculated based on your currently inserted values - not the saved ones. In the last panel you can compare the results given by all algorithms.
            </div>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = BaseConf;

