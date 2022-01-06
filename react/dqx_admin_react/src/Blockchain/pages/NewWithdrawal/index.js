import React from 'react';
import Withdrawal from '@bcpages/Withdrawal'

class NewWithdrawal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isNew: true
    }
  }
  componentDidMount(){
  }
  render(){
    return(
      <Withdrawal states={true}/>
    )
  }
}

export default NewWithdrawal;
