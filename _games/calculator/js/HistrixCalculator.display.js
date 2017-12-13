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

HistrixCalculator.display = new Object();


// Refresh the display formating.
HistrixCalculator.display.refresh = function()
	{
	jQuery("#HistrixCalculator input.display").val(HistrixCalculator.stringDis);
	};

// Updates 'stringDis' with the result of the last operation.
HistrixCalculator.display.update = function(val)
	{
	if(val != null && typeof val == 'number')
		{ HistrixCalculator.numDis = val; }
	HistrixCalculator.stringDis = HistrixCalculator.display.format(HistrixCalculator.numDis);
	};




// Adds a simbol to the display.
HistrixCalculator.display.add = function(s)
	{
	var base = HistrixCalculator.getBase();

	var maxLength = 2;
	var range = HistrixCalculator.getRange();
	if(range == 'word') maxLength = 4;
	if(range == 'dword') maxLength = 8;
	if(range == 'qword') maxLength = 16;
	if(base == 'octal') maxLength = maxLength * 2;
	if(base == 'binary') maxLength = maxLength * 4;

	// Removes separators.
	HistrixCalculator.stringDis = HistrixCalculator.display.removeSeparators(HistrixCalculator.stringDis);

	// Checks if the simbol is valid.
	if( ( (s == '0' || s == '1') ) ||
		( (s == '2' || s == '3' || s == '4' || s == '5' || s == '6' || s == '7') && (base == 'octal' || base == 'decimal' || base == 'hexadecimal') ) ||
		( (s == '8' || s == '9' ) && (base == 'decimal' || base == 'hexadecimal') ) ||
		( (s == 'A' || s == 'B' || s == 'C' || s == 'D' || s == 'E' || s == 'F') && base == 'hexadecimal' ) )
		{
		if(HistrixCalculator.stringDis != "0")
			{
			// Checks the range.
			if(base == 'decimal' || HistrixCalculator.stringDis.length < maxLength )
				{HistrixCalculator.stringDis = HistrixCalculator.stringDis + s;}
			}
		else
			{HistrixCalculator.stringDis = s;}
		}

	if(s == 'Exp')
		{
		if(HistrixCalculator.stringDis.indexOf('e') <= 0)
			HistrixCalculator.stringDis = HistrixCalculator.stringDis + "e";
		}

	if(s == '+/-' && HistrixCalculator.stringDis.indexOf('e') < 0)
		{ 
		if(HistrixCalculator.stringDis.indexOf('-') <= 0 && HistrixCalculator.stringDis != '0')
			{HistrixCalculator.stringDis = "-" + HistrixCalculator.stringDis;}
		else
			{HistrixCalculator.stringDis = HistrixCalculator.stringDis.subtring(1, HistrixCalculator.stringDis.length);}
		}

	if(s == '+/-' && HistrixCalculator.stringDis.indexOf('e') >= 0)
		{
		var cif = HistrixCalculator.stringDis.split('e')[0];
		var exp = HistrixCalculator.stringDis.split('e')[1];

		if(exp.length > 0 && exp.substring(0, 1) == "-")
			{exp = exp.substring(1, exp.length);}
		else
			{exp = "-" + exp;}

		HistrixCalculator.stringDis = cif + "e" + exp;
		}

	if(s == '.' && base == 'decimal')
		{
		if(HistrixCalculator.stringDis.indexOf('.') <= 0)
			HistrixCalculator.stringDis = HistrixCalculator.stringDis + ".";
		}
		
	// Puts the separators.
	HistrixCalculator.stringDis = HistrixCalculator.display.insertSeparators(HistrixCalculator.stringDis);
	};


// Formats a number depending of the base and the thousand separator.
HistrixCalculator.display.format = function(num)
	{
	var res = "";
	
	// Verify if negative.
	var negative = num < 0;
	if(negative) {num = -num;}

	// Get the base.
	var base = HistrixCalculator.getBase();

	if(base == 'binary') {base = 2;}
	if(base == 'octal') {base = 8;}
	if(base == 'decimal') {base = 10;}
	if(base == 'hexadecimal') {base = 16;}

	// Verify if must use base 10 or another base.
	if(base == 10)
		{
		// Verify if must use exponential notation.
		if(HistrixCalculator.exponentialFlag)
			{ res = num.toExponential(); }
		else
			{ res = num.toString(); }

		// Put the thousan separator.
		res = HistrixCalculator.display.insertSeparators(res);
		}
	else
		{
		// Remove the decimals.
		num = parseInt(num, 10);

		// Checks the range.
		var range = HistrixCalculator.getRange()
		if(range == 'byte') {range = 256;}
		if(range == 'word') {range = 65535;}
		if(range == 'dword') {range = 4294967295;}
		if(range == 'qword') {range = 18446744073709551615;}

		if(! isNaN(range) && (num > range || num < -range) )
			{num = num % range;}

		// Formats the number.
		res = num.toString(base);

		// Put a space between groups of four digits.
		res = HistrixCalculator.display.insertSeparators(res);
		}

	// Put the minus sign.
	if(negative) {res = "-" + res;}

	return res;
	};



// Removes the thousands or digits separators.
HistrixCalculator.display.removeSeparators = function(num)
	{
	while(num.indexOf(" ") >= 0)
		{num = num.replace(" ", "");}
	while(num.indexOf(",") >= 0)
		{num = num.replace(",", "");}

	return num;
	}

// Inserts the thousands or digits separators.
HistrixCalculator.display.insertSeparators = function(num)
	{
	var res = '';
	var base = HistrixCalculator.getBase();

	// Removes the minus sign
	var negative = num.substring(0,1) == '-';
	if(negative)
		{ num = num.substring(1, num.length); }

	// Removes the exponent.
	var exponent = null;
	if(num.indexOf('e') >= 0)
		{
		exponent = num.split('e')[1];
		num = num.split('e')[0];

		if(num.substring(0,1) == '.')
			{ num = '0' + num; }
		}

	// Split the decimals and the integers.
	var integers = num;
	var decimals = null;

	if(integers.indexOf('.') > 0)
		{
		decimals = integers.split('.')[1];
		integers = integers.split('.')[0];
		}

	if(base == 'decimal')
		{
		// Put the thousan separator.
		var k = 0;
		var group = new Array();

		while( integers.length > 3 )
			{
			group[k] = integers.substring(integers.length-3, integers.length);
			integers = integers.substring(0, integers.length-3);
			k++;
			}

		for(var i=1; i<=k; i++)
			{integers += "," + group[k-i];}

		// Put the decimals.
		if(decimals != null)
			{res = integers + '.' + decimals;}
		else
			{res = integers}
		}
	else
		{
		// Put a space between groups of four digits.
		var c = 0;
		var quad = new Array();

		while( integers.length > 4 )
			{
			quad[c] = integers.substring(integers.length-4, integers.length);
			integers = integers.substring(0, integers.length-4);
			c++;
			}

		for(var j=1; j<=c; j++)
			{integers += " " + quad[c-j];}

		res = integers;
		}

	// Ads the minus sign.
	if(negative)
		{ res = '-' + res; }

	// Ads the exponent.
	if(exponent != null)
		{ res = res + 'e' + exponent; }

	return res;
	}



// Parses a number depending of the base and the thousand separator.
HistrixCalculator.display.parse = function(num)
	{
	// Remove the thousands or digits separators.
	num = HistrixCalculator.display.removeSeparators(num);

	// Get the base.
	var base = HistrixCalculator.getBase();
	if(base == 'binary') {base = 2;}
	if(base == 'octal') {base = 8;}
	if(base == 'decimal') {base = 10;}
	if(base == 'hexadecimal') {base = 16;}

	if(base == 10)
		{ return parseFloat(num, 10); }
	else
		{ return parseInt(num, base); }
	}
