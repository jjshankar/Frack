import {Globals} from '../Globals'

// Fraction class
export class Fraction {

    static FRAC_SEPARATOR = '/';
    static FRAC_DELIMITER = '⌟';
    static SIMPLIFY_FRACTION = true;

    static get SEPARATOR_CHAR(){
        return Fraction.FRAC_SEPARATOR;
    }

    static get DELIMITER_CHAR(){
        return Fraction.FRAC_DELIMITER;
    }

    static set ALWAYS_SIMPLIFY(val = true){
        Fraction.SIMPLIFY_FRACTION = val;
    }

    constructor(whole = 0, numerator = 0, denominator = 1){
        Globals.Log('Constructor input: ' + whole + ";" + numerator + ";" + denominator);
        this._wholePart = whole;
        this._fracNumerator = numerator;
        this._fracDenominator = (denominator == 0 ) ? 1 : denominator;

        // Store origials
        this.__origWhole = this._wholePart;
        this.__origNum = this._fracNumerator;
        this.__origDen = this._fracDenominator;

        Globals.Log('Constructed: ' + this._wholePart + Fraction.FRAC_DELIMITER
                                + this._fracNumerator + Fraction.FRAC_SEPARATOR
                                + this._fracDenominator);
        this.SimplifyFraction();
    }

    SimplifyFraction(){
        // Return if ALWAYS_SIMPLIFY is OFF
        if(!Fraction.SIMPLIFY_FRACTION)
            return;

        Globals.Log('Simplifying: ' + this._wholePart + Fraction.FRAC_DELIMITER 
                                + this._fracNumerator + Fraction.FRAC_SEPARATOR
                                + this._fracDenominator);

        if (this._fracDenominator == 0)
            return;

        var fracNum = this._fracNumerator % this._fracDenominator;
        Globals.Log('SimplifyFraction: fracNum = ' + fracNum);

        var gcd = GCD(fracNum,this._fracDenominator);
        Globals.Log('SimplifyFraction: gcd = ' + gcd);
        
        // Using unary + operator to treat as numbers
        this._wholePart = +this._wholePart + +Math.trunc(this._fracNumerator / this._fracDenominator);
        Globals.Log('SimplifyFraction: _wholePart = ' + this._wholePart);
        
        this._fracNumerator = fracNum / gcd;
        Globals.Log('SimplifyFraction: _fracNumerator = ' + this._fracNumerator);

        this._fracDenominator = this._fracDenominator / gcd;
        Globals.Log('SimplifyFraction: _fracDenominator = ' + this._fracDenominator);

        if(this._wholePart < 0 && this._fracNumerator < 0)
            this._fracNumerator = Math.abs(this._fracNumerator);
        
        Globals.Log('SimplifyFraction: final: ' + this._wholePart + Fraction.FRAC_DELIMITER + this._fracNumerator + Fraction.FRAC_SEPARATOR + this._fracDenominator);
    }

    // Public methods
    Display(){
        // Check if we are returning simplified fraction
        if(Fraction.SIMPLIFY_FRACTION){
            // Simplify
            this.SimplifyFraction();

            if (this._wholePart != 0)
            {
                if (this._fracNumerator != 0)
                    // return format = "{0}_{1}/{2})"
                    return this._wholePart + Fraction.FRAC_DELIMITER + this._fracNumerator + Fraction.FRAC_SEPARATOR + this._fracDenominator;
                else
                    //return format = "{0}", 
                    return this._wholePart;
            }
            else
            {
                if (this._fracNumerator != 0)
                    // return format = {0}/{1}
                    return this._fracNumerator + Fraction.FRAC_SEPARATOR + this._fracDenominator;
            }
        }
        else {
            if (this.__origWhole != 0)
            {
                if (this.__origNum != 0)
                    // return format = "{0}_{1}/{2})"
                    return this.__origWhole + Fraction.FRAC_DELIMITER + this.__origNum + Fraction.FRAC_SEPARATOR + this.__origDen;
                else
                    //return format = "{0}", 
                    return this.__origWhole;
            }
            else
            {
                if (this.__origNum != 0)
                    // return format = {0}/{1}
                    return this.__origNum + Fraction.FRAC_SEPARATOR + this.__origDen;
            }            
        }

        return "0";
    }

    Unmix()
    {
        // Change the mixed fraction to a regular fraction
        this._fracNumerator = +this._fracNumerator + (+this._wholePart * +this._fracDenominator);
        this._wholePart = 0;
        return this;
    }

    static TryParse(sFraction)
    {
        var wholePart = 0;
        var fracNumerator = 0;
        var fracDenominator = 1;

        if(sFraction == null)
            return null;

        // Validate and parse
        sFraction = sFraction.toString();
        if (sFraction.indexOf(Fraction.FRAC_DELIMITER) <= 0)
        {
            wholePart = isNaN(sFraction) ? 0 : sFraction;
        }

        if (sFraction.indexOf(Fraction.FRAC_DELIMITER) > 0)
        {
            wholePart = sFraction.substring(0, sFraction.indexOf(Fraction.FRAC_DELIMITER));
            Globals.Log('TryParse: wholePart = ' + wholePart);
            wholePart = isNaN(wholePart) ? 0 : wholePart;
            Globals.Log('TryParse: wholePart = ' + wholePart);
            
        }

        if (sFraction.indexOf(Fraction.FRAC_SEPARATOR) > 0)
        {
            fracNumerator = sFraction.substring(sFraction.indexOf(Fraction.FRAC_DELIMITER) + 1, sFraction.indexOf(Fraction.FRAC_SEPARATOR));
            Globals.Log('TryParse: fracNumerator=' + fracNumerator);
            fracNumerator = isNaN(fracNumerator) ?  0 : fracNumerator;
            Globals.Log('TryParse: fracNumerator=' + fracNumerator);
            

            fracDenominator = sFraction.substring(sFraction.indexOf(Fraction.FRAC_SEPARATOR) + 1);
            Globals.Log('TryParse: fracDenominator=' + fracDenominator);
            fracDenominator = isNaN(fracDenominator) ? 1 : fracDenominator;
            Globals.Log('TryParse: fracDenominator=' + fracDenominator);
            
        }

        // Return val
        Globals.Log('Final parsed: ' + wholePart + Fraction.FRAC_DELIMITER 
                            + fracNumerator + Fraction.FRAC_SEPARATOR
                            + fracDenominator);
        return new Fraction(wholePart, fracNumerator, fracDenominator);
    }

    // Operators
    // Add
    static Add(operand1, operand2)
    {
        // Add operation
        //  Unmix fraction, then:((n1*d2)+(n2*d1)/d1*d2))
        var op1 = operand1.Unmix();
        var op2 = operand2.Unmix();

        var fracNum = (op1._fracNumerator * op2._fracDenominator) + (op1._fracDenominator * op2._fracNumerator);
        var fracDen = op1._fracDenominator * op2._fracDenominator;
        // int gcd = Convert.ToInt32(GCD(Convert.ToUInt32(fracNum), Convert.ToUInt32(fracDen)));

        fraction = new Fraction(0, fracNum, fracDen);
        fraction.SimplifyFraction();
        return fraction;
    }

    // Subtract
    static Subtract(operand1, operand2)
    {
        // Subtract operation
        //  Unmix fraction, then: ((n1*d2)-(n2*d1)/d1*d2))
        var op1 = operand1.Unmix();
        var op2 = operand2.Unmix();
        var fracNum = (op1._fracNumerator * op2._fracDenominator) - (op1._fracDenominator * op2._fracNumerator);
        var fracDen = op1._fracDenominator * op2._fracDenominator;
        // int gcd = Convert.ToInt32(GCD(Convert.ToUInt32(fracNum), Convert.ToUInt32(fracDen)));
        
        fraction = new Fraction(0, fracNum, fracDen);
        fraction.SimplifyFraction();
        return fraction;
    }

    // Mutliply
    static Multiply(operand1, operand2)
    {
        // Multiply
        //  n1*n2 / d1* d2
        var op1 = operand1.Unmix();
        var op2 = operand2.Unmix();

        fraction = new Fraction(0, op1._fracNumerator * op2._fracNumerator, op1._fracDenominator * op2._fracDenominator);
        fraction.SimplifyFraction();
        return fraction;
    }

    // Divide
    static Divide(operand1, operand2)
    {
        // Divide
        //  n1*d2 / d1* n2
        var op1 = operand1.Unmix();
        var op2 = operand2.Unmix();

        fraction = new Fraction(0,op1._fracNumerator * op2._fracDenominator, op1._fracDenominator * op2._fracNumerator);
        fraction.SimplifyFraction();
        return fraction;
    }
}

// Generic helper functions
function GCD(x, y){
    var a = Math.abs(x);
    var b = Math.abs(y);

    // Exit conditions
    if (a == b) return a;
    if (a == 0) return b;
    if (b == 0) return a;

    // If a is even...
    if (a % 2 == 0)
    {
        // ...and b is even
        if (b % 2 == 0)
            return GCD(a >> 1, b >> 1) << 1;
        // ...or b is odd
        else
            return GCD(a >> 1, b);
    }

    // a is odd, b is even
    if (b % 2 == 0)
        return GCD(a, b >> 1);

    // Reduce
    if (a > b)
        return GCD((a - b) >> 1, b);

    return GCD((b - a) >> 1, a);
}
