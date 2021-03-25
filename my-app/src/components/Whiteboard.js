import React from 'react';
import {SketchField, Tools} from 'react-sketch'
interface propType
{
}

class Whiteboard extends React.Component<propType> {
  constructor(props: propType)
  {
    super(props);
    this.state = {
      image: null
    };

    this.onImageChange = this.onImageChange.bind(this);
    this.sketchRef = React.createRef();
  }

  onImageChange = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      this.setState({
        image: URL.createObjectURL(img)
      });
    }
  };

  onSketchChange = event => {
  	console.log(this.sketchRef.current.toJSON());
  }
  render() {
    return (
      <div>
        <div class="file-select">
          <img src = {this.state.image} />
          <h3>Select image</h3>
          <input type="file" name="myImage" onChange={this.onImageChange} />
        </div>
        <h1>Draw here!</h1>
        <SketchField
        ref={this.sketchRef}
        tool={Tools.Pencil}
        lineColor='black'
        lineWidth={3}
        onChange={this.onSketchChange}
        />
      </div>
    );
  }
}

export default Whiteboard;
