import React from 'react'

import { useThrottle } from '../../utils'

const Bookshelf: React.FC = () => {
  const handleC = useThrottle(() => {
    console.log('click')
  }, 1000)
  return (
    <div>
      <button type="button" onClick={handleC}>a</button>
    </div>
  );
};

export default Bookshelf
