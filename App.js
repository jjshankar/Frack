import React from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Button } from 'react-native';

import {Fraction} from './classes/Fraction'

const MAX_LEN = 15; // 16 chars max

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      currFrac: "",
      oper1: null,
      oper2: null,
      operation: "",
      displayedInfo: "",
      newOperand: true,
      nextOp: "",
    }

    this.createFraction = this.createFraction.bind(this);
  }

  createFraction(val){
    //alert('Doing stuff...');
    var value = this.state.currFrac;
    // console.log('value = ' + value);
    if(value == null)
      return;

    value = value.toString();

    if(isNaN(val)){
      switch(val){
        case 'cancel':
          this.setState({
            currFrac: "0"
          }, this.refreshDisplay)
          return;
        case 'allcancel':
          this.setState({
            currFrac: "0",
            displayedInfo: "",
            oper1: null,
            oper2: null,
            operation: "",
            nextOp: "",
            newOperand: true
          }, this.refreshDisplay);
          value = "0";
          return;
        case "/":
          if(value.length > 0){
            if(value.indexOf("/") >= 0)
              return;
            if(this.state.newOperand)
              value = val.toString();
            else
              value = (value.indexOf("0") == 0) ? "0" : value.concat(val.toString());
          }
          break;
        case "_":
          if(value.length > 0){
            if(value.indexOf("_") >= 0)
              return;
            if(value.indexOf('/') >=0)
              return;
            if(this.state.newOperand)
              value = val.toString();
            else
              value = (value.indexOf("0") == 0) ? "0" : value.concat(val.toString());
          }
          break;
      }
    }
    else
    {
      if(this.state.newOperand)
        value = val.toString();
      else
        value = (value.indexOf("0") == 0) ? val.toString() : value.concat(val.toString());
    }

    if(value.length > MAX_LEN)
      return;

    this.setState({
      currFrac: value,
      newOperand: false
    })
  }

  backSpace(){
    value = this.state.currFrac.substring(0, this.state.currFrac.length - 1);
    this.setState({
      currFrac: value
    }) 
  }

  setOperation(currOp){
    var operandFraction;
    var displayData;

    // if oper1 and oper2 are both null
    if(this.state.oper1 == null && this.state.oper2 == null){
      console.log('setOperation: oper1 and oper2 are both null');

      // Parse currFrac and set as oper1
      console.log('setOperation: this.state.currFrac = ' + this.state.currFrac)
      operandFraction = Fraction.TryParse(this.state.currFrac);
      if(operandFraction != null){
        console.log('Op1: ' + operandFraction.Display());

        //  show display
        displayData = this.state.displayedInfo;
        displayData += " " + operandFraction.Display();
        displayData += " " + currOp;

        // Set state
        this.setState({
          oper1: operandFraction,
          operation: currOp,
          nextOp: "",
          currFrac: "0",
          displayedInfo: displayData,
          newOperand: true
        }, this.refreshDisplay);
      }
    }
    // if oper1 is fixed, oper2 is null
    else if(this.state.oper1 != null && this.state.oper2 == null){
      console.log('oper1 is fixed; oper2 is null; currOp: ' + currOp);
      
      // Parse currFrac and set as oper2
      console.log('CurrFrac for op2: ' + this.state.currFrac);
      operandFraction = Fraction.TryParse(this.state.currFrac.toString());
      if(operandFraction != null){
        console.log('Op2: ' + operandFraction.Display());

        //  show display
        displayData = this.state.displayedInfo + " ";
        displayData += operandFraction.Display();
        displayData += " " + currOp;

        // Set state
        this.setState({
          oper2: operandFraction,
          displayedInfo: displayData,
          nextOp: currOp,
        }, this.getResult);


        // if(currOp == "=")
        // {
        //   displayData = this.state.displayedInfo + this.state.currFrac +  "\n";
        //   this.setState({
        //     oper1: null,
        //     oper2: null,
        //     operation: "",
        //     nextOp: "",
        //     displayedInfo: displayData
        //   })
        // }
      }

      
    }
    else {
      // if oper1 and oper2 are both fixed
      //  CASE Not possible
      console.log('oper1 is fixed; oper2 is fixed: CASE NOT Possible???');
    }

  }

  async getResult(){
    var resultFraction;
    var displayData;

    console.log('getResult op: ' + this.state.operation);
    console.log('oper1: ' + this.state.oper1.Display());
    console.log('oper2: ' + this.state.oper2.Display());

    // if oper1 and oper2 are both fixed
    if(this.state.oper1 != null && this.state.oper2 != null){
      console.log('getResult not nulls');
      //  perform operation
      switch(this.state.operation){
        case '+':
          resultFraction = Fraction.Add(this.state.oper1, this.state.oper2);
          break;
        case '-':
          resultFraction = Fraction.Subtract(this.state.oper1, this.state.oper2);
          break;
        case '*':
          resultFraction = Fraction.Multiply(this.state.oper1, this.state.oper2);
          break;
        case '/':
          resultFraction = Fraction.Divide(this.state.oper1, this.state.oper2);
          break;
        case '=':
          console.log("hitting =");
          resultFraction = this.state.oper1;
          displayData = this.state.displayedInfo + this.state.oper1.Display() +  "\n";
          await this.setState({
            currFrac: resultFraction.Display(),
            displayedInfo: displayData,
            operation: "",
            nextOp: "",
            oper1: null,
            oper2: null,
            newOperand: true
          }, this.refreshDisplay);
          return;
      }
      
      if(resultFraction != null)
      {
        //  set result in currFrac
        var fracString = resultFraction.Display();
        var nextOperation = this.state.nextOp;
        displayData = this.state.displayedInfo;
        displayData += (nextOperation == "=") ? " " + fracString +  "\n" : "";

        console.log('getResult = ' + fracString);
        await this.setState({
          currFrac: fracString,
          operation: (nextOperation == "=") ? "" : nextOperation,
          nextOp: "",
          oper1: (nextOperation == "=") ? null : resultFraction,
          oper2: null,
          newOperand: true,
          displayedInfo: displayData
        }, this.refreshDisplay);
      }
    }
  }

  refreshDisplay(){
    console.log('Display: ' + this.state.displayedInfo);
    this.scrollView.scrollToEnd({animated:true});
  }

  render() {
    return (
      <View style={{backgroundColor: 'darkgray', flex: 1}}>
        <View style={styles.container}>
          
          <ScrollView 
            style={styles.calculationScrollView}
            ref={ref => this.scrollView = ref}
            contentContainerStyle={styles.calculationScrollContent}>
            <Text adjustsFontSizeToFit={true} style={styles.calculationText}>{this.state.displayedInfo}</Text>
          </ScrollView>

          <ScrollView scrollEnabled={false}>
            <View style={styles.displayArea}>
              <Text style={styles.buttonText}>{this.state.currFrac}</Text>
            </View>
            
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity          
                style={styles.buttonSpecialStyle}
                onPress={() => this.createFraction('allcancel')}>
                <Text style={styles.buttonText}>AC</Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonSpecialStyle}
                onPress={() => this.createFraction('cancel')}>
                <Text style={styles.buttonText}> C </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonSpecialStyle}
                onPress={() => this.backSpace()}>
                <Text style={styles.buttonText}> ⌫ </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonOperStyle}
                onPress={() => this.setOperation('=')}>
                <Text style={styles.buttonText}> = </Text>
              </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row'}}>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(7)}>
                <Text style={styles.buttonText}> 7 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(8)}>
                <Text style={styles.buttonText}> 8 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(9)}>
                <Text style={styles.buttonText}> 9 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonOperStyle}
                onPress={() => this.setOperation('/')}>
                <Text style={styles.buttonText}> ÷ </Text>
              </TouchableOpacity>
            </View>

            <View style={{flexDirection:'row'}}>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(4)}>
                <Text style={styles.buttonText}> 4 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(5)}>
                <Text style={styles.buttonText}> 5 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(6)}>
                <Text style={styles.buttonText}> 6 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonOperStyle}
                onPress={() => this.setOperation('*')}>
                <Text style={styles.buttonText}> × </Text>
              </TouchableOpacity>
            </View>
            
            <View style={{flexDirection:'row'}}>
            
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(1)}>
                <Text style={styles.buttonText}> 1 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(2)}>
                <Text style={styles.buttonText}> 2 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(3)}>
                <Text style={styles.buttonText}> 3 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonOperStyle}
                onPress={() => this.setOperation('-')}>
                <Text style={styles.buttonText}> − </Text>
              </TouchableOpacity>
            </View>
            
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction('_')}>
                <Text style={styles.buttonText}> ⌟ </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(0)}>
                <Text style={styles.buttonText}> 0 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction('/')}>
                <Text style={styles.buttonText}> / </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonOperStyle}
                onPress={() => this.setOperation('+')}>
                <Text style={styles.buttonText}> + </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>


        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    marginTop: 50,
    height: 'auto',
    flexDirection: 'column',
    //backgroundColor: '#fff',
    alignItems: 'center',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
  },
  calculationScrollView: {
    // borderWidth: 1, 
    width: 320, 
    height: 12,
  },
  calculationScrollContent: {
    paddingTop: 110,
    // borderWidth: 3, 
    // backgroundColor: 'yellow',
    alignContent: 'flex-end',
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    //flexDirection: 'column',
    position: 'relative',
  },
  buttonStyle: {
    padding: 6,
    margin: 6,
    height: 70,
    width: 70,
    flexDirection: 'row',  
    borderWidth: 3,
    borderRadius: 10,  
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonSpecialStyle: {
    padding: 6,
    margin: 6,
    height: 70,
    width: 70,
    flexDirection: 'row',  
    borderWidth: 3,
    borderRadius: 10,  
    backgroundColor: 'tomato',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonOperStyle: {
    padding: 6,
    margin: 6,
    height: 70,
    width: 70,
    flexDirection: 'row',  
    borderWidth: 3,
    borderRadius: 10,  
    backgroundColor: 'lightyellow',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    padding: 0,
    margin: 0,
    fontSize: 35,
    fontWeight: 'bold' 
  },
  calculationText: {
    padding: 0,
    margin: 0,
    fontSize: 20,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'right',
  },
  displayArea: {
    padding: 6,
    margin: 6,
    height: 70,
    width: 320,  
    borderWidth: 3,
    borderRadius: 10,  
    backgroundColor: '#eee',
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexShrink: 1
  }
});
