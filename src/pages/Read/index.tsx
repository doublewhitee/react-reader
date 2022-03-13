import React from 'react'
import { useLocation } from 'react-router-dom'
import './index.less'

// interface readProps {
//   title: string,
//   chapterId: string
// }

const Read: React.FC = () => {
  const location = useLocation()
  console.log(location)
  return (
    <div>
      a
    </div>
  );
};

export default Read
