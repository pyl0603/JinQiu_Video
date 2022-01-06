import React from 'react';
import { Input, DatePicker, Button, Table } from 'antd';

import RaceTable from './index';

const { RangePicker } = DatePicker;

class Bball extends React.Component {
    render () {
        return (
            <div>
                <RaceTable category={1} />
            </div>
        )
    }
}

export default Bball;