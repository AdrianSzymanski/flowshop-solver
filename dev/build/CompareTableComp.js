'use strict';

var React = require('react'),
    Bootstrap = require('react-bootstrap'),
    Template = require('./TemplateComp'),
    Model = require('./InputFormModel');

var roundUp = function roundUp(number, prec) {
  var tempnumber = number * Math.pow(10, prec);
  tempnumber = Math.ceil(tempnumber);
  return tempnumber / Math.pow(10, prec);
};

var CompareTable = React.createClass({
  displayName: 'CompareTable',

  render: function render() {
    var props = this.props;

    return React.createElement(
      Template,
      null,
      React.createElement(
        'div',
        { className: 'wrapper table-wrapper compare' },
        React.createElement(
          'div',
          { className: 'container x-large' },
          React.createElement(
            'div',
            { className: 'content' },
            React.createElement(
              'div',
              { className: 'info' },
              'Camparison table'
            ),
            React.createElement(
              'div',
              { className: 'table-responsive' },
              React.createElement(
                'table',
                { className: 'table table-bordered' },
                React.createElement(
                  'thead',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      null,
                      'Algorithm'
                    ),
                    React.createElement(
                      'th',
                      null,
                      'Type'
                    ),
                    React.createElement(
                      'th',
                      null,
                      'C',
                      React.createElement(
                        'sub',
                        null,
                        'MAX'
                      )
                    ),
                    React.createElement(
                      'th',
                      null,
                      'F',
                      React.createElement(
                        'sub',
                        null,
                        'MEAN'
                      )
                    )
                  )
                ),
                React.createElement(
                  'tbody',
                  null,
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      { rowSpan: '3' },
                      'Johnson'
                    ),
                    React.createElement(
                      'td',
                      null,
                      'Normal'
                    ),
                    React.createElement(
                      'td',
                      null,
                      props.data[0].c_max
                    ),
                    React.createElement(
                      'td',
                      null,
                      roundUp(props.data[0].f_mean, 2)
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      'No-wait'
                    ),
                    React.createElement(
                      'td',
                      null,
                      props.data[1].c_max
                    ),
                    React.createElement(
                      'td',
                      null,
                      roundUp(props.data[1].f_mean, 2)
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      'No-idle'
                    ),
                    React.createElement(
                      'td',
                      null,
                      props.data[2].c_max
                    ),
                    React.createElement(
                      'td',
                      null,
                      roundUp(props.data[2].f_mean, 2)
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'th',
                      { rowSpan: '3' },
                      'Custom'
                    ),
                    React.createElement(
                      'td',
                      null,
                      'Normal'
                    ),
                    React.createElement(
                      'td',
                      null,
                      props.data[3].c_max
                    ),
                    React.createElement(
                      'td',
                      null,
                      roundUp(props.data[3].f_mean, 2)
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      'No-wait'
                    ),
                    React.createElement(
                      'td',
                      null,
                      props.data[4].c_max
                    ),
                    React.createElement(
                      'td',
                      null,
                      roundUp(props.data[4].f_mean, 2)
                    )
                  ),
                  React.createElement(
                    'tr',
                    null,
                    React.createElement(
                      'td',
                      null,
                      'No-idle'
                    ),
                    React.createElement(
                      'td',
                      null,
                      props.data[5].c_max
                    ),
                    React.createElement(
                      'td',
                      null,
                      roundUp(props.data[5].f_mean, 2)
                    )
                  )
                )
              )
            )
          )
        )
      )
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