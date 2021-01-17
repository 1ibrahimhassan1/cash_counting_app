import React from 'react';
import { StyleSheet, Text, Button, View, TextInput, ToastAndroid } from 'react-native';

import  Result  from './components/Result' 

export default class App extends React.Component {
  constructor(){
    super();

    this.state = {
      result: false,

      Nickels: 0,
      Dimes: 0,
      Quarters: 0,
      Loonies: 0,
      Toonies: 0,
      FiveDollar: 0,
      TenDollar: 0,
      TwentyDollar: 0,
      FiftyDollar: 0,
      HundredDollar: 0,

      cashArr: {} 
    }

    this.backToParent = this.backToParent.bind(this);
  }

  backToParent(){
    this.setState({result: !this.state.result})
  }

  render() {
    let currency = ['Nickels', 'Dimes', 'Quarters', 'Loonies', 'Toonies', '5$', '10$', '20$', '50$', '100$']; 
    let stateCurrency = ['Nickels', 'Dimes', 'Quarters', 'Loonies', 'Toonies', 'FiveDollar', 'TenDollar', 'TwentyDollar', 'FiftyDollar', 'HundredDollar'];
    let sendToResult = {}; 

    let inputFields = [];
    for(let i = 0; i < 10; i++){
      inputFields.push(
      <View style={{flexDirection: 'row'}} key={currency[i]}>
          <Text style={{paddingTop:10, marginRight: 3}}>{currency[i]}</Text>

          <TextInput 
          onChangeText={(text) => {this.setState({[stateCurrency[i]]: text})}} 
          placeholder={`Enter ${currency[i]}`} 
          style={{borderBottomWidth: 1, paddingTop: 5}}
          keyboardType={"number-pad"}>
          </TextInput>

        </View>
      )
    }

    return !this.state.result ? (
      <View style={styles.container}>
        <Text style={{marginBottom: 10, fontSize: 30}}>Coin Counter</Text>
        {inputFields}
        <View style={styles.button}>
          <Button 
            onPress={() => {
              // for(let i = 0; i < 10; i++){
              //   // console.log(`just displaying this.state.${stateCurrency[i]}: ${this.state[stateCurrency[i]]}`)
              //   sendToResult.push(this.state[stateCurrency[i]])
              // }
              Object.assign(sendToResult, this.state);
              delete sendToResult.cashArr;
              delete sendToResult.result;

              // console.log(`end result ${sendToResult}`)
              this.setState({cashArr: sendToResult,result: !this.state.result})
            }}
            title="Coins Entered"
          />
        </View>
      </View>
    ) : <Result cashArr={this.state.cashArr} return={this.backToParent}/> 
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: 15,
    width: 175
  }
});