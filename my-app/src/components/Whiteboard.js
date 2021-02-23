import React from 'react';
import {SketchField, Tools} from 'react-sketch'
interface propType
{
}

class Whiteboard extends React.Component<propType> {
  constructor(props: propType)
  {
    super(props)
  }
  render() {
    return (
      <div>
        Try Drawing!
        <SketchField
        tool={Tools.Pencil}
        lineColor='black'
        lineWidth={3}
        />
      </div>
    );
  }
}

export default Whiteboard;
