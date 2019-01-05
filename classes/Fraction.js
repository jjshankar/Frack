

// Generic helper function
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

// Fraction class
export class Fraction {

    constructor(whole, numerator = 0, denominator = 1){
        console.log('Constructor input: ' + whole + ";" + numerator + ";" + denominator);
        this._wholePart = whole;
        this._fracNumerator = numerator;
        if(denominator == 0 ) 
            this._fracDenominator = 1
        else
            this._fracDenominator = denominator;

        console.log('Constructed: ' + this._wholePart + "_" 
                                + this._fracNumerator + "/"
                                + this._fracDenominator);
        this.SimplifyFraction();
    }

    SimplifyFraction(){
        console.log('Simplifying: ' + this._wholePart + "_" 
                                + this._fracNumerator + "/"
                                + this._fracDenominator);

        if (this._fracDenominator == 0)
            return;

        var fracNum = this._fracNumerator % this._fracDenominator;
        console.log('SimplifyFraction: fracNum = ' + fracNum);

        var gcd = GCD(fracNum,this._fracDenominator);
        console.log('SimplifyFraction: gcd = ' + gcd);
        
        // Using unary + operator to treat as numbers
        this._wholePart = +this._wholePart + +Math.trunc(this._fracNumerator / this._fracDenominator);
        console.log('SimplifyFraction: _wholePart = ' + this._wholePart);
        
        this._fracNumerator = fracNum / gcd;
        console.log('SimplifyFraction: _fracNumerator = ' + this._fracNumerator);

        this._fracDenominator = this._fracDenominator / gcd;
        console.log('SimplifyFraction: _fracDenominator = ' + this._fracDenominator);

        if(this._wholePart < 0 && this._fracNumerator < 0)
            this._fracNumerator = Math.abs(this._fracNumerator);
        
        console.log('SimplifyFraction: final: ' + this._wholePart + '_' + this._fracNumerator + '/' + this._fracDenominator);
    }

    // Public methods
    Display(){
    
        // console.log('Displaying: ' + this._wholePart + "_" 
        //                 + this._fracNumerator + "/"
        //                 + this._fracDenominator);
        // Simplify
        this.SimplifyFraction();

        if (this._wholePart != 0)
        {
            if (this._fracNumerator != 0)
                // return format = "{0}_{1}/{2})"
                return this._wholePart + "_" + this._fracNumerator + "/" + this._fracDenominator;
            else
                //return format = "{0}", 
                return this._wholePart;
        }
        else
        {
            if (this._fracNumerator != 0)
                // return format = {0}/{1}
                return this._fracNumerator + "/" + this._fracDenominator;
        }

        return "0";
    }

    Unmix()
    {
        // Change the mixed fraction to a regular fraction
        this._fracNumerator += +this._wholePart * this._fracDenominator;
        this._wholePart = 0;
        return this;
    }

    // public fraction()
    // {
    //     _wholePart = 0;
    //     _fracNumerator = 0;
    //     _fracDenominator = 1;
    // }

    // public fraction(int whole)
    // {
    //     _wholePart = whole;
    //     _fracNumerator = 0;
    //     _fracDenominator = 1;
    // }

    // public fraction(int whole, int numerator, int denominator)
    // {
    //     _wholePart = whole;
    //     _fracNumerator = numerator;
    //     _fracDenominator = denominator;

    //     // Simplify
    //     SimplifyFraction();
    // }

    // public fraction(fraction operand)
    // {
    //     _wholePart = operand._wholePart;
    //     _fracNumerator = operand._fracNumerator;
    //     _fracDenominator = operand._fracDenominator;

    //     // Simplify
    //     SimplifyFraction();
    // }

    static TryParse(sFraction)
    {
        var wholePart = 0;
        var fracNumerator = 0;
        var fracDenominator = 1;

        if(sFraction == null)
            return null;

        // Validate and parse
        sFraction = sFraction.toString();
        if (sFraction.indexOf("_") <= 0)
        {
            wholePart = isNaN(sFraction) ? 0 : sFraction;
        }

        if (sFraction.indexOf("_") > 0)
        {
            wholePart = sFraction.substring(0, sFraction.indexOf("_"));
            console.log('TryParse: wholePart = ' + wholePart);
            wholePart = isNaN(wholePart) ? 0 : wholePart;
            console.log('TryParse: wholePart = ' + wholePart);
            
        }

        if (sFraction.indexOf("/") > 0)
        {
            fracNumerator = sFraction.substring(sFraction.indexOf("_") + 1, sFraction.indexOf("/"));
            console.log('TryParse: fracNumerator=' + fracNumerator);
            fracNumerator = isNaN(fracNumerator) ?  0 : fracNumerator;
            console.log('TryParse: fracNumerator=' + fracNumerator);
            

            fracDenominator = sFraction.substring(sFraction.indexOf("/") + 1);
            console.log('TryParse: fracDenominator=' + fracDenominator);
            fracDenominator = isNaN(fracDenominator) ? 1 : fracDenominator;
            console.log('TryParse: fracDenominator=' + fracDenominator);
            
        }

        // Return val
        console.log('Final parsed: ' + wholePart + "_" 
                            + fracNumerator + "/"
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

    // // Comparison
    // public static bool operator >(fraction operand1, fraction operand2)
    // {
    //     // Comparison true if:
    //     //  n1*d2 > d1* n2
    //     operand1.Unmix();
    //     operand2.Unmix();

    //     return (operand1._fracNumerator * operand2._fracDenominator > operand1._fracDenominator * operand2._fracNumerator);
    // }

    // public static bool operator <(fraction operand1, fraction operand2)
    // {
    //     // Comparison true if:
    //     //  n1*d2 < d1* n2
    //     operand1.Unmix();
    //     operand2.Unmix();

    //     return (operand1._fracNumerator * operand2._fracDenominator < operand1._fracDenominator * operand2._fracNumerator);
    // }

    // public static bool operator >=(fraction operand1, fraction operand2)
    // {
    //     // Comparison true if:
    //     //  n1*d2 >= d1* n2
    //     operand1.Unmix();
    //     operand2.Unmix();

    //     return (operand1._fracNumerator * operand2._fracDenominator >= operand1._fracDenominator * operand2._fracNumerator);
    // }

    // public static bool operator <=(fraction operand1, fraction operand2)
    // {
    //     // Comparison true if:
    //     //  n1*d2 <= d1* n2
    //     operand1.Unmix();
    //     operand2.Unmix();

    //     return (operand1._fracNumerator * operand2._fracDenominator <= operand1._fracDenominator * operand2._fracNumerator);
    // }

    // public static bool operator ==(fraction operand1, fraction operand2)
    // {
    //     // Comparison true if:
    //     //  n1*d2 == d1* n2
    //     operand1.Unmix();
    //     operand2.Unmix();

    //     return (operand1._fracNumerator * operand2._fracDenominator == operand1._fracDenominator * operand2._fracNumerator);
    // }

    // public static bool operator !=(fraction operand1, fraction operand2)
    // {
    //     // Comparison true if:
    //     //  n1*d2 == d1* n2
    //     operand1.Unmix();
    //     operand2.Unmix();

    //     return (operand1._fracNumerator * operand2._fracDenominator != operand1._fracDenominator * operand2._fracNumerator);
    // }

    // public override bool Equals(object obj)
    // {
    //     if (obj == null)
    //         return false;

    //     fraction operand = (fraction)obj;
    //     return (this == operand);
    // }

    // public override int GetHashCode()
    // {
    //     // Simple hash
    //     int hash = _wholePart ^ _fracNumerator ^ _fracDenominator;
    //     return hash;
    // }
}
