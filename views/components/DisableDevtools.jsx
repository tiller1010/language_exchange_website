import React from 'react';

const DisableDevtools = (props) => {
  return (
    <script>
        {"if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === `object`) {\
            __REACT_DEVTOOLS_GLOBAL_HOOK__.inject = function() {};\
        }"}
    </script>
  );
}

export default DisableDevtools;
