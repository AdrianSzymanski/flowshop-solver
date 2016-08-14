var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template  = require('./TemplateComp'),
    
    Model = require('./InputFormModel');



var Algorithm = React.createClass({

  render: function() {
    var props = this.props,
        johnson_style =         (props.algorithm === 'johnson') ? 'algorithm active' : 'algorithm',
        johnson_nowait_style =  (props.algorithm === 'johnson-no-wait') ? 'algorithm active' : 'algorithm',
        johnson_noidle_style =  (props.algorithm === 'johnson-no-idle') ? 'algorithm active' : 'algorithm',
        random_style =          (props.algorithm === 'random') ? 'algorithm active' : 'algorithm',
        random_nowait_style =   (props.algorithm === 'random-no-wait') ? 'algorithm active' : 'algorithm',
        random_noidle_style =   (props.algorithm === 'random-no-idle') ? 'algorithm active' : 'algorithm';
    
    return (
      <Template>
        <div className="wrapper algorithm-wrapper">
          <div className="container x-large">
            <div className="content">
              <div className="info">Choose algorithm</div>

              <div className="algorithms">
                <div className="row">
                  <div className="col-sm-4 col-sm-del-right bordered-right bordered-bottom">
                    <div className={ johnson_style }        onClick={ this.selectJohnson }>Johnson</div>
                  </div>
                  <div className="col-sm-4 col-sm-del-left col-sm-del-right bordered-right bordered-bottom">
                    <div className={ johnson_nowait_style } onClick={ this.selectJohnsonNoWait }>Johnson no-wait</div>
                  </div>
                  <div className="col-sm-4 col-sm-del-left bordered-bottom">
                    <div className={ johnson_noidle_style } onClick={ this.selectJohnsonNoIdle }>Johnson no-idle</div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-4 col-sm-del-right bordered-right">
                    <div className={ random_style }         onClick={ this.selectRandom }>Custom</div>
                  </div>
                  <div className="col-sm-4 col-sm-del-left col-sm-del-right bordered-right">
                    <div className={ random_nowait_style }  onClick={ this.selectRandomNoWait }>Custom no-wait</div>
                  </div>
                  <div className="col-sm-4 col-sm-del-left">
                    <div className={ random_noidle_style }  onClick={ this.selectRandomNoIdle }>Custom no-idle</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>              
      </Template>
    );
  },

  selectJohnson:        function() { Model.selectAlgorithm('johnson'); },
  selectJohnsonNoWait:  function() { Model.selectAlgorithm('johnson-no-wait'); },
  selectJohnsonNoIdle:  function() { Model.selectAlgorithm('johnson-no-idle'); },
  selectRandom:         function() { Model.selectAlgorithm('random'); },
  selectRandomNoWait:   function() { Model.selectAlgorithm('random-no-wait'); },
  selectRandomNoIdle:   function() { Model.selectAlgorithm('random-no-idle'); }

});

module.exports = Algorithm;

