import React from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, TouchableOpacity, Button } from 'react-native';

import {Fraction} from './classes/Fraction'

const LOGGING = 'on'
const MAX_LEN = 12; // 12 chars max

// Calculator symbols
const OP_DIVIDE = '÷';
const OP_MULTIPLY = '×';
const OP_ADD = '+';
const OP_SUBTRACT = '−';
const OP_EQUAL = '=';
const BACKSPACE = '⌫';

// Fraction characters
const FRAC_SEPARATOR = Fraction.SEPARATOR_CHAR;
const FRAC_DELIMITER = Fraction.DELIMITER_CHAR; 

Log('FRAC_SEPARATOR=' + FRAC_SEPARATOR);
Log('FRAC_DELIMITER=' + FRAC_DELIMITER);

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
    // Log('value = ' + value);
    Log('incoming val=' + val);
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
        case FRAC_SEPARATOR:  // "/"
          if(value.length > 0){
            if(value.indexOf(FRAC_SEPARATOR) >= 0)
              return;
            if(this.state.newOperand)
              value = (value.indexOf("0") == 0) ? "0" : val.toString();
            else
              value = (value.indexOf("0") == 0) ? "0" : value.concat(val.toString());
          }
          break;
        case FRAC_DELIMITER:  // "_"
          if(value.length > 0){
            if(value.indexOf(FRAC_DELIMITER) >= 0)
              return;
            if(value.indexOf(FRAC_SEPARATOR) >=0)
              return;
            if(this.state.newOperand)
              value = (value.indexOf("0") == 0) ? "0" : val.toString();
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
      Log('setOperation: oper1 and oper2 are both null');

      // If = was pressed, return
      if(currOp == OP_EQUAL)
        return;

      // Parse currFrac and set as oper1
      Log('setOperation: this.state.currFrac = ' + this.state.currFrac)
      operandFraction = Fraction.TryParse(this.state.currFrac);
      if(operandFraction != null){
        Log('Op1: ' + operandFraction.Display());

        //  show display
        displayData = this.state.displayedInfo;
        displayData += ' ' + operandFraction.Display();
        displayData += ' ' + currOp;

        // Set state
        this.setState({
          oper1: operandFraction,
          operation: currOp,
          nextOp: "",
          displayedInfo: displayData,
          newOperand: true
        }, this.refreshDisplay);
      }
    }
    // if oper1 is fixed, oper2 is null
    else if(this.state.oper1 != null && this.state.oper2 == null){
      Log('oper1 is fixed; oper2 is null; currOp: ' + currOp);
      
      // if(currOp == OP_EQUAL)
      // {
      //   displayData = this.state.displayedInfo + this.state.currFrac +  "\n";
      //   this.setState({
      //     oper1: null,
      //     oper2: null,
      //     operation: "",
      //     nextOp: "",
      //     displayedInfo: displayData
      //   }, this.refreshDisplay);

      //   return;
      // }
      
      // Parse currFrac and set as oper2
      Log('CurrFrac for op2: ' + this.state.currFrac);
      operandFraction = Fraction.TryParse(this.state.currFrac.toString());
      if(operandFraction != null){
        Log('Op2: ' + operandFraction.Display());

        //  show display
        displayData = this.state.displayedInfo;
        displayData += ' ' + operandFraction.Display();
        displayData += ' ' + currOp;

        // Set state
        this.setState({
          oper2: operandFraction,
          displayedInfo: displayData,
          nextOp: currOp,
        }, this.getResult);
      }

      
    }
    else {
      // if oper1 and oper2 are both fixed
      //  CASE Not possible
      Log('oper1 is fixed; oper2 is fixed: CASE NOT Possible???');
    }

  }

  async getResult(){
    var resultFraction;
    var displayData;

    Log('getResult op: ' + this.state.operation);
    Log('oper1: ' + this.state.oper1.Display());
    Log('oper2: ' + this.state.oper2.Display());

    // if oper1 and oper2 are both fixed
    if(this.state.oper1 != null && this.state.oper2 != null){
      Log('getResult not nulls');
      //  perform operation
      switch(this.state.operation){
        case OP_ADD:
          resultFraction = Fraction.Add(this.state.oper1, this.state.oper2);
          break;
        case OP_SUBTRACT:
          resultFraction = Fraction.Subtract(this.state.oper1, this.state.oper2);
          break;
        case OP_MULTIPLY:
          resultFraction = Fraction.Multiply(this.state.oper1, this.state.oper2);
          break;
        case OP_DIVIDE:
          resultFraction = Fraction.Divide(this.state.oper1, this.state.oper2);
          break;
        case OP_EQUAL:
          Log("hitting OP_EQUAL");
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
        displayData += (nextOperation == OP_EQUAL) ? " " + fracString +  "\n" : '';

        Log('getResult = ' + fracString);
        await this.setState({
          currFrac: fracString,
          operation: (nextOperation == OP_EQUAL) ? "" : nextOperation,
          nextOp: "",
          oper1: (nextOperation == OP_EQUAL) ? null : resultFraction,
          oper2: null,
          newOperand: true,
          displayedInfo: displayData
        }, this.refreshDisplay);
      }
    }
  }

  refreshDisplay(){
    Log('Display: ' + this.state.displayedInfo);
    this.scrollView.scrollToEnd({animated:true});
  }

  render() {
    return (
      <View style={styles.mainView}>
        <View style={styles.container}>
          
          <ScrollView 
            style={styles.calculationScrollView}
            ref={ref => this.scrollView = ref}
            contentContainerStyle={styles.calculationScrollContent}>
            <Text 
              adjustsFontSizeToFit={true} 
              style={styles.calculationText}>
              {this.state.displayedInfo}
            </Text>
          </ScrollView>
          
          <ScrollView scrollEnabled={false}>
            <View style={styles.displayArea}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.displayScrollContent}>
                  <Text adjustsFontSizeToFit={true} style={styles.buttonText}>{this.state.currFrac}</Text>
              </ScrollView>
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
                <Text style={styles.buttonText}> {BACKSPACE} </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonOperStyle}
                onPress={() => this.setOperation(OP_EQUAL)}>
                <Text style={styles.buttonText}> {OP_EQUAL} </Text>
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
                onPress={() => this.setOperation(OP_DIVIDE)}>
                <Text style={styles.buttonText}> {OP_DIVIDE} </Text>
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
                onPress={() => this.setOperation(OP_MULTIPLY)}>
                <Text style={styles.buttonText}> {OP_MULTIPLY} </Text>
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
                onPress={() => this.setOperation(OP_SUBTRACT)}>
                <Text style={styles.buttonText}> {OP_SUBTRACT} </Text>
              </TouchableOpacity>
            </View>
            
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(FRAC_DELIMITER)}>
                <Text style={styles.buttonText}> {FRAC_DELIMITER} </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(0)}>
                <Text style={styles.buttonText}> 0 </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonStyle}
                onPress={() => this.createFraction(FRAC_SEPARATOR)}>
                <Text style={styles.buttonText}> / </Text>
              </TouchableOpacity>
              <TouchableOpacity          
                style={styles.buttonOperStyle}
                onPress={() => this.setOperation(OP_ADD)}>
                <Text style={styles.buttonText}> {OP_ADD} </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>


        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: 'darkgray', 
    flex: 1,
  },
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
    height: 40,
    
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
    paddingBottom: 8,
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
  },
  displayScrollContent : {
    alignContent: 'flex-end', 
    alignSelf: 'flex-end', 
    alignItems: 'flex-end', 
    justifyContent: 'flex-end',
  },
});

function Log(message){
  if(LOGGING == 'on'){
    console.log(message);
  }
}