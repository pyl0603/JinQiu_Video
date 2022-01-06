import React, { useState, useEffect } from 'react';
import { Input } from 'antd';

const LimitNumber = (props) => {
  const { widthValue, value, max, limit, regType } = props;
  const [content, setContent] = useState(value);
  let regRule = {
    'number': () => {
      return /[^\d]/g
    },
    'url': () => {
      return /[\u4E00-\u9FA5]/g
    },
    'pwd': () => {
      return /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g
    }
  };

  const setFormattedContent = text => {
    if (max) {
      Number(text) > max ? text = max : text = text
    }
    text = text.toString().replace(regRule[regType](), '');
    text.length > limit ? setContent(text.slice(0, limit)) : setContent(text);
    //	text.length > limit ? props.getValue(Number(text.slice(0, limit))) :props.getValue(Number(text));
  };

  useEffect(() => {
    setFormattedContent(content);
    props.getValue(content === '' ? null : Number(content))
  }, [content]);

  return (
    <Input style={{ width: widthValue ? 90 : '100%' }} value={content} onChange={event => setFormattedContent(event.target.value)} />
  )
}

export default LimitNumber;
