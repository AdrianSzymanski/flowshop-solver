var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template  = require('./TemplateComp'),
    
    Model = require('./InputFormModel');



var roundUp = function(number, prec) {
  var tempnumber = number * Math.pow(10, prec);
  tempnumber = Math.ceil(tempnumber);
  return tempnumber / Math.pow(10, prec);
};

var CompareTable = React.createClass({
  render: function() {
    var props = this.props;
    
    return (
      <Template>
        <div className="wrapper table-wrapper compare">
          <div className="container x-large">
            <div className="content">
              <div className="info">Camparison table</div>

              <div className="table-responsive">
                <table className="table table-bordered">

                  <thead>
                    <tr>
                      <th>Algorithm</th>
                      <th>Type</th>
                      <th>C<sub>MAX</sub></th>
                      <th>F<sub>MEAN</sub></th>
                    </tr>
                  </thead>
                  <tbody>

                    <tr>
                      <th rowSpan="3">Johnson</th>
                      <td>Normal</td>
                      <td>{ props.data[0].c_max }</td>
                      <td>{ roundUp(props.data[0].f_mean, 2) }</td>
                    </tr>
                    <tr>
                      <td>No-wait</td>
                      <td>{ props.data[1].c_max }</td>
                      <td>{ roundUp(props.data[1].f_mean, 2) }</td>
                    </tr>
                    <tr>
                      <td>No-idle</td>
                      <td>{ props.data[2].c_max }</td>
                      <td>{ roundUp(props.data[2].f_mean, 2) }</td>
                    </tr>

                    <tr>
                      <th rowSpan="3">Custom</th>
                      <td>Normal</td>
                      <td>{ props.data[3].c_max }</td>
                      <td>{ roundUp(props.data[3].f_mean, 2) }</td>
                    </tr>
                    <tr>
                      <td>No-wait</td>
                      <td>{ props.data[4].c_max }</td>
                      <td>{ roundUp(props.data[4].f_mean, 2) }</td>
                    </tr>
                    <tr>
                      <td>No-idle</td>
                      <td>{ props.data[5].c_max }</td>
                      <td>{ roundUp(props.data[5].f_mean, 2) }</td>
                    </tr>

                  </tbody>

                </table>
              </div>

            </div>
          </div>
        </div>
      </Template>
    );
  }

});

module.exports = CompareTable;

/*
  <tr>
    <th>C<sub>max</sub></th>
    <td>{ props.data[0].c_max }</td>
    <td>{ props.data[1].c_max }</td>
    <td>{ props.data[2].c_max }</td>
    <td>{ props.data[3].c_max }</td>
    <td>{ props.data[4].c_max }</td>
    <td>{ props.data[5].c_max }</td>
  </tr>
  <tr>
    <th>F<sub>mean</sub></th>
    <td>{ props.data[0].f_mean }</td>
    <td>{ props.data[1].f_mean }</td>
    <td>{ props.data[2].f_mean }</td>
    <td>{ props.data[3].f_mean }</td>
    <td>{ props.data[4].f_mean }</td>
    <td>{ props.data[5].f_mean }</td>
  </tr>
*/

