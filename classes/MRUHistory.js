import {Globals} from '../Globals'
import {Fraction} from './Fraction'

// MRU/History for display
export class MRUHistory{
    static __mruData = [];

    static MRUClear(){
        this.__mruData = [];
    }

    static MRUAdd(frac1, frac2, oper, resFrac){
        Globals.Log('MRUAdd Curr length: ' + MRUHistory.__mruData.length);
        // Add to mruData array
        MRUHistory.__mruData.push({
            oper1: frac1,
            oper2: frac2,
            op: oper,
            result: resFrac
        });
        Globals.Log('MRUAdd new length: ' + MRUHistory.__mruData.length);
    }

    static MRUShow(){
        var mruDisplayString = '';
        this.__mruData.forEach((object) => {
            mruDisplayString = "\n";
            mruDisplayString += object.oper1.Display();
            mruDisplayString += ' ' + object.op + ' ';
            mruDisplayString += object.oper2.Display();
            mruDisplayString += ' = ' + object.result.Display();
        });
        Globals.Log('MRUShow value: {\n' + mruDisplayString + '\n}');
        return mruDisplayString;
    }
}