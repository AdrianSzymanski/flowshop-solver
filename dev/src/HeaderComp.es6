var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template  = require('./TemplateComp'),
    
    Model = require('./InputFormModel');



var Header = React.createClass({

  render: function() {
    let props = this.props;
    let plus_enabled = props.buttons.plus,
        minus_enabled = props.buttons.minus,
        save_enabled = props.buttons.save,
        reset_enabled = props.buttons.reset,
        randomize_enabled = props.buttons.randomize;
    
    return (
      <Template>
        <div className="wrapper navigation-wrapper">
          <div className="container x-large">
            <div className="row">
              
              <div className="col-sm-6">
                <div className="title">
                  Flow Shop scheduling application
                </div>
              </div>
              <div className="col-sm-6">
                <div className="buttons">
                  <button type="button" disabled={!plus_enabled} onClick={ this.moreClick }>+</button>
                  <button type="button" disabled={!minus_enabled} onClick={ this.lessClick }>-</button>
                  <button type="button" disabled={!save_enabled} onClick={ this.saveClick }>Save</button>
                  <button type="button" disabled={!reset_enabled} onClick={ this.resetClick }>Reset</button>
                  <button type="button" disabled={!randomize_enabled} onClick={ this.randomizeClick }>Randomize</button>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className="navigation-wrapper-fix"></div>
      </Template>
    );
  },

  moreClick: function() { Model.more(); },
  lessClick: function() { Model.less(); },
  saveClick: function() { Model.save(); },
  resetClick: function() { Model.reset(); },
  randomizeClick: function() { Model.randomize(); }

});

module.exports = Header;

