import React from 'react';
import {SketchField, Tools} from 'react-sketch'
interface propType
{
}

class Whiteboard extends React.Component<propType> {
  constructor(props: propType)
  {
    super(props);
    this.sketchRef = React.createRef();
    this.onImageChange = this.onImageChange.bind(this);
  }

  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      let imgurl = URL.createObjectURL(img);
      this.sketchRef.current.addImg(imgurl);
      console.log(this.sketchRef.current);
      console.log(this.sketchRef.current.toJSON());
      console.log(imgurl);
    }
  };

  render() {
    return (
      <div>
        <div className="file-select">
          <h3>Select image</h3>
          <input type="file" name="myImage" onChange={this.onImageChange} />
        </div>
        <h1>Draw here!</h1>
        <SketchField
        ref={this.sketchRef}
        tool={Tools.Pencil}
        lineColor='black'
        lineWidth={3}
        />
      </div>
    );
  }
}

export default Whiteboard;
