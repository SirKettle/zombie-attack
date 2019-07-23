import * as React from 'react';
import styled from 'styled-components';

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  overflow: hidden;
`;

class GameCanvas extends React.Component {
  shouldComponentUpdate(nextProps) {
    return Boolean(nextProps.innerRef !== this.props.innerRef);
  }

  render() {
    console.log('render canvas');
    const { innerRef, width, height } = this.props;
    return <Canvas ref={innerRef} width={width} height={height} />;
  }
}
export default React.forwardRef((props, ref) => <GameCanvas innerRef={ref} {...props} />);
