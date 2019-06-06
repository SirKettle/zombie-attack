import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from 'components/App';

const mountNode = document.getElementById('app');

const render = (isHot = false) => {
  ReactDOM.render(
    <div>
      <App isHot={isHot} />
    </div>,
    mountNode,
  );
};

console.log(`“Zombie Attack” by Harrison Thirkettle - v${process.env.BUILD_VERSION} - ${process.env.NODE_ENV}`);

// if (module.hot) {
//   // Hot reloadable React components and translation json files
//   // modules.hot.accept does not accept dynamic dependencies,
//   // have to be constants at compile-time
//   // module.hot.accept(['components/App'], () => {
//   //   ReactDOM.unmountComponentAtNode(mountNode);
//   //   render(true);
//   // });
// }

render();
