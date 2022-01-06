import React from 'react';
import { Input, DatePicker, Button, Table } from 'antd';

import RaceTable from './index';

const { RangePicker } = DatePicker;

class Fball extends React.Component {
    render () {
        return (
            <div>
                <RaceTable category={0} />
            </div>
        )
    }
}

export default Fball;