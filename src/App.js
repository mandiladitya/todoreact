import React from 'react';

import Firebase from 'firebase';
import config from './config';


class App extends React.Component {

  constructor(props){
    super(props);
    Firebase.initializeApp(config.firebase);

    this.state = {
      developers: []
    }
  }
  
  componentDidMount(){
    this.getUserData();
  }

  componentDidUpdate(prevProps, prevState){
    if (prevState !== this.state) {
      this.writeUserData();
    }
  }

  writeUserData = () => {
    Firebase.database().ref('/merntodo').set(this.state)
    console.log("DATA SAVED");
  }

  getUserData = () => {
    let ref = Firebase.database().ref('/merntodo');
    ref.on('value', snapshot => {
      const state = snapshot.val();
      this.setState(state);
    });
    console.log('DATA RETRIEVED');
  }

  handleSubmit = (event) => {
    event.preventDefault();
    let name = this.refs.name.value;
       let uid = this.refs.uid.value;

    if (uid && name){
      const { developers } = this.state;
      const devIndex = developers.findIndex(data => {
        return data.uid === uid 
      });
      developers[devIndex].name = name;
     
      this.setState({ developers });
    }
    else if (name  ) {
      const uid = new Date().getTime().toString();
      const { developers } = this.state;
      developers.push({ name,uid })
      this.setState({ developers });
    }

    this.refs.name.value = '';
    this.refs.uid.value = '';
  }

  removeData = (developer) => {
    const { developers } = this.state;
    const newState = developers.filter(data => {
      return data.uid !== developer.uid;
    });
    this.setState({ developers: newState });
  }

  updateData = (developer) => {
    this.refs.uid.value = developer.uid;
    this.refs.name.value = developer.name;
   
  }

  render() {
    const { developers } = this.state;
    return(
      <div className="container">
	      <div className="row">
          <div className='col-xl-12'>
            <h3 style={{textAlign:"center"}}> {"\n"}COFFEE</h3>
          </div>
        </div>
        <div className='row'>
          <div className='col-xl-12'>
          { 
            developers
            .map(developer => 
              <div key={developer.uid} className="card float-left" style={{width: '18rem', marginRight: '1rem'}}>
                <div className="card-body">
                  <span style={{fontSize:"20px"}} className="card-title">{ developer.name }</span>
                  <button onClick={ () => this.removeData(developer) } className="btn btn-link">X</button>
                  <button onClick={ () => this.updateData(developer) } className="btn btn-link"><i className="fa fa-pencil"></i></button>
                </div>
              </div>
              )
          } 
          </div>
        </div>
        <div className='row'>
          <div className='col-xl-12'>
            
            <form onSubmit={this.handleSubmit}>
              <div className="form-row">
                <input type='hidden' ref='uid' />
                <div className="form-group col-md-6">
                  <label></label>
                  <input type="text" ref='name' className="form-control" placeholder="Add TASK..." />
                </div>
               
              </div>
              <button type="submit" className="btn btn-primary" style={{background:"lightcoral"}}>Add</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
