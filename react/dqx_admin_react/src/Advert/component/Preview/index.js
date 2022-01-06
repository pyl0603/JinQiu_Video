import React from 'react';
import './style.scss';

class Preview extends React.Component {
  constructor(props) {
    super(props);
	}

  render() {
    console.log(this.props.isHasTitle, this.props.preview, this.props.reviewTxt)
    return (
      <div className="preview-warp">
					{
						this.props.isHasTitle
						?
						<h3>{this.props.reviewTxt}</h3>
						:
						null
					}
          <div>
					<div>
						{
							this.props.preview.map((element, index) => {
								return (
									<img key={index} src={element.url} style={{ width: element.x / 2.5 + 'px', height: element.y / 2.5 + 'px' }} />
								)
							})
						}
					</div>
					</div>
      </div>
    )
  }
}

export default Preview;
