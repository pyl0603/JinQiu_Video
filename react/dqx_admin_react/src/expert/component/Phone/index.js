import React from 'react';

import './style.scss';


class Phone extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    type: 'small',
    sizeW: 375,
    sizeH: 120
  }

  render() {
    console.log(this.props.preview, 1, this.props.reviewTxt)
    return (
      <div className="phone">
        {
         this.props.preview.length > 0 && this.props.preview[0].name === '启动页'
         ?
          this.props.preview.map((res,index) => {
            return (
              <div key={index}>
                <img key={index} src={res.url} style={{ width: res.x/2 + 'px', height: res.y/2 + 'px' }} />
              </div>
            )
          })
          :
          <div className="phone-content">
            {
              this.props.preview.length > 0 && this.props.preview[0].name === '帖子列表'? 
              <div className="post-list">
                <span>{this.props.reviewTxt}</span>
                <div>
                {
                  this.props.preview.map((res,index) => {
                    return (
                      res.url
                      ?
                      <img key={index} src={res.url} style={{ width: res.x/2 + 'px', height: res.y/2 + 'px' }} />
                      :
                      null
                    )
                  })
                }
                </div>
              </div>
              : 
              this.props.preview.map((res,index) => {
                return (
                  res.name === ( '大图' || 'banner')
                  ?
                  <>
                    <span>{this.props.reviewTxt}</span>
                    <img key={index} className={res.name === '直播暂停' ? 'live-pause': null} src={res.url} style={{ width: res.x/2 + 'px', height: res.y/2 + 'px' }} />
                  </>
                  :
                  <div className={[res.name ==  '小图' ? 'small' : null,res.name === '弹窗广告' ? 'pop' : null].join('')} key={index}>
                    {res.name == '小图' ? <span>{this.props.reviewTxt}</span> : null}
                    <img key={index} className={res.name === '直播暂停' ? 'live-pause': null} src={res.url} style={{ width: res.x/2 + 'px', height: res.y/2 + 'px' }} />
                  </div>
                )
              })
            }
          </div>
        }
      </div>
    )
  }
}

export default Phone;
