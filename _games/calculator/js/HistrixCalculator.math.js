/*
 * «Copyright 2011 José F. Maldonado»
 *
 *  This file is part of Histrix.
 *
 *  Histrix is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  Histrix is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with Histrix. If not, see <http://www.gnu.org/licenses/>.
 */

HistrixCalculator.math = new Object();




// ---------------------------- //
// ----- Unary operations ----- //
// ---------------------------- //

// Performs a unary operation.
HistrixCalculator.math.unaryOperation = function(numAnt, numAct, op)
	{
	if(op == '+/-')
		{ return -numAct; }

	if(op == 'sqrt')
		{ return Math.sqrt(numAct); }

	if(op == '%')
		{
		if(numAnt != 0 && numAnt != null)
			{ return numAct * numAnt / 100; }
		else
			{ return numAct; }
		}

	if(op == '1/x')
		{
		if(numAct != 0)
			{ return 1/numAct; }
		}

	if(op == 'Not')
		{ return -(numAct+1); }

	if(op == 'Int')
		{
		if(HistrixCalculator.isInv())
			{
			HistrixCalculator.setInv(false);

			while(numAct > 1)
				{numAct--;}

			return numAct;
			}
		else
			{ return parseInt(numAct, 10); }
		}

	if(op == 'sin' || op == 'cos' || op == 'tan')
		{
		if(HistrixCalculator.isHyp())
			{
			// Hyperbolic.
			HistrixCalculator.setHyp(false);

			if(HistrixCalculator.isInv())
				{
				HistrixCalculator.setInv(false);

				if(op == 'sin') return HistrixCalculator.math.asinh(numAct);
				if(op == 'cos') return HistrixCalculator.math.acosh(numAct);
				if(op == 'tan') return HistrixCalculator.math.atanh(numAct);
				}
			else
				{
				if(op == 'sin') return HistrixCalculator.math.sinh(numAct);
				if(op == 'cos') return HistrixCalculator.math.cosh(numAct);
				if(op == 'tan') return HistrixCalculator.math.tanh(numAct);
				}
			}
		else
			{
			// Regular.
			var metric = HistrixCalculator.getMetric();

			if(HistrixCalculator.isInv())
				{
				HistrixCalculator.setInv(false);

				if(op == 'sin') numAct = Math.asin(numAct);
				if(op == 'cos') numAct = Math.acos(numAct);
				if(op == 'tan') numAct = Math.atan(numAct);

				if(metric == 'degrees') { return numAct * 180 / Math.PI; }
				if(metric == 'grads') { return numAct * 200 / Math.PI; }
				return numAct;
				}
			else
				{
				if(metric == 'degrees') { numAct = numAct / 180 * Math.PI; }
				if(metric == 'grads') { numAct = numAct / 200 * Math.PI; }

				if(op == 'sin') return Math.sin(numAct);
				if(op == 'cos') return Math.cos(numAct);
				if(op == 'tan') return Math.tan(numAct);
				}
			}
		}

	if(op == 'x^2')
		{
		if(HistrixCalculator.isInv())
			{
			HistrixCalculator.setInv(false);
			return Math.pow(numAct, 1/2);
			}
		else
			{ return Math.pow(numAct, 2); }
		}

	if(op == 'x^3')
		{
		if(HistrixCalculator.isInv())
			{
			HistrixCalculator.setInv(false);
			return Math.pow(numAct, 1/3);
			}
		else
			{ return Math.pow(numAct, 3); }
		}

	if(op == 'n!')
		{
		var numAux = 1;
		while(numAct > 1)
			{
			numAux *= numAct;
			numAct--;
			}
		return numAux;
		}

	if(op == 'log')
		{
		if(HistrixCalculator.isInv())
			{
			HistrixCalculator.setInv(false);
			return Math.pow(10, numAct);
			}
		else
			{ return Math.log(numAct) / Math.log(10); }
		}

	if(op == 'ln')
		{
		if(HistrixCalculator.isInv())
			{
			HistrixCalculator.setInv(false);
			return Math.pow(Math.E, numAct);
			}
		else
			{ return Math.log(numAct); }
		}

	if(op == 'dms')
		{
		if(HistrixCalculator.isInv())
			{
			HistrixCalculator.setInv(false);

			var decs = parseInt( (numAct - parseInt(numAct, 10))*10000, 10);
			var mins = parseInt(decs/100, 10);
			var segs = decs%100;
			numAct = parseInt(numAct, 10);

			return numAct + parseFloat(mins)/60 + parseFloat(segs)/3600;
			}
		else
			{
			var decimals = numAct - parseInt(numAct, 10);
			var resAux = 60*100 * decimals;

			numAct = parseInt(numAct, 10);
			var min = parseInt(resAux / 100, 10);
			var seg = 60 * (resAux % 100) / 100;

			return numAct + parseFloat(min)/100 + parseFloat(seg)/10000;
			}
		}

	return 0;
	};


// Checks if a string is a unary operator.
HistrixCalculator.math.isUnaryOperator = function(act)
	{
	return act == 'sqrt' || act == '%' || act == '1/x' || act == 'Not' || 
		   act == 'sin' || act == 'cos' || act == 'tan' || act == 'x^2' ||
		   act == 'x^3' || act == 'n!' || act == 'log' || act == 'ln' ||
		   act == 'Int' || act == 'dms' ||
		   (! HistrixCalculator.writingFlag && act == '+/-');
	};





// ----------------------------- //
// ----- Binary operations ----- //
// ----------------------------- //

// Performs the pending binary operation.
HistrixCalculator.math.binaryOperation = function(numAnt, numAct, op)
	{
	if(op != null)
		{
		if(op == '+')
			{return numAnt + numAct;}

		if(op == '-')
			{return numAnt - numAct;}

		if(op == '*')
			{return numAnt * numAct;}

		if(op == '/')
			{
			if(numAct != 0)
				{return numAnt / numAct;}
			}

		if(op == 'And')
			{return numAnt & numAct;}

		if(op == 'Or')
			{return numAnt | numAct;}

		if(op == 'Xor')
			{return numAnt ^ numAct;}

		if(op == 'Mod')
			{return numAnt % numAct;}

		if(op == 'x^y')
			{
			if(HistrixCalculator.isInv())
				{
				HistrixCalculator.setInv(false);
				return Math.pow(numAnt, 1/numAct);
				}
			else
				{return Math.pow(numAnt, numAct);}
			}

		if(op == 'Lsh')
			{
			numAnt = parseInt(numAnt, 10);
			numAct = Math.pow(2, parseInt(numAct, 10));

			if(HistrixCalculator.isInv())
				{
				HistrixCalculator.setInv(false);
				return parseInt(numAnt / numAct, 10);
				}
			else
				{ return numAnt * numAct; }
			}
		}

	return 0;
	}


// Check if an action is a binary operator.
HistrixCalculator.math.isBinaryOperator = function(act)
	{
	return act == '+' || act == '-' || act == '*' || act == '/' ||
		   act == 'x^y' || act == 'Mod' || act == 'Lsh' || act == 'And' ||
		   act == 'Or' || act == 'Xor';
	};

HistrixCalculator.math.operatorPriority = function(op)
	{
	var res = 2;
	if(op == '+' || op == '-' || op == 'Or' || op == 'Xor') {res = 1;}
	if(op == '(') {res = 0}
	return res;
	}


// Hyperbolic functions
HistrixCalculator.math.sinh = function(x)
	{ return ( Math.exp(x) - Math.exp(-x) ) / 2; }

HistrixCalculator.math.cosh = function(x)
	{ return ( Math.exp(x) + Math.exp(-x) ) / 2; }

HistrixCalculator.math.tanh = function(x)
	{ return HistrixCalculator.sinh(x) / HistrixCalculator.cosh(x); }

HistrixCalculator.math.asinh = function(x)
	{ return Math.log(x + Math.sqrt(x*x +1)); }

HistrixCalculator.math.acosh = function(x)
	{ return Math.log(x + Math.sqrt(x*x - 1)); }

HistrixCalculator.math.atanh = function(x)
	{ return Math.log( (1+x)/(1-x) ) / 2; }
