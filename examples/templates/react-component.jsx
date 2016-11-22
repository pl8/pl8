import React from 'react';
import cx from 'classnames';

export class {pl8.name} extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { className } = this.props;

    const classes = cx({
      '{pl8.name}': true,
      [className]: Boolean(className),
    });

    return (
      <div className={classes}>
        {pl8.name} content
      </div>
    );
  }
}

{pl8.name}.propTypes = {
  className: React.PropTypes.node,
}

{pl8.name}.defaultProps = {
  className: null,
}

export default {pl8.name};
