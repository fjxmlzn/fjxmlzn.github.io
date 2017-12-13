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

// Handles an action.
HistrixCalculator.handleAction = function(act)
	{
	// Numbers and simbols.
	if( HistrixCalculator.isSimbol(act) )
		{HistrixCalculator.handleSimbol( act );}

	// Delete actions (do not confuse the 'C' from clear with the 'C' from 12 in hexadecimal).
	if(act == 'CA' || act == 'CE' || act == 'Backspace')
		{HistrixCalculator.handleDelete(act);}

	// Unary operation.
	if( HistrixCalculator.math.isUnaryOperator(act) )
		{HistrixCalculator.handleUnaryOperator(act);}

	// Binary operation.
	if( HistrixCalculator.math.isBinaryOperator(act) )
		{HistrixCalculator.handleBinaryOperator(act);}

	// Equals
	if(act == '=')
		{HistrixCalculator.handleEquals(act);}

	// Memory operation.
	if( HistrixCalculator.isMemoryAction(act) )
		{HistrixCalculator.handleMemory(act);}

	// Load constant.
	if(act == 'pi')
		{HistrixCalculator.handleConstant(act);}

	// Stadistic operation.
	if( HistrixCalculator.isStadisticAction(act) )
		{HistrixCalculator.handleStadistic(act);}

	// Round brackets.
	if( act == '(' || act == ')')
		{ HistrixCalculator.push(act); }


	// Set the states flags.
	if( HistrixCalculator.isSimbol(act) )
		{HistrixCalculator.writingFlag = true;}
	else
		{
		if(act != 'Backspace' && act != '+/-')
			{HistrixCalculator.writingFlag = false;}
		}

	if(act == 'F-E')
		{
		HistrixCalculator.exponentialFlag = ! HistrixCalculator.exponentialFlag;
		HistrixCalculator.display.update();
		}
	};




// Handles a number action.
HistrixCalculator.handleSimbol = function(num)
	{
	// Adds the simbol.
	if(HistrixCalculator.writingFlag != true)
		{HistrixCalculator.clearDisplay();}

	HistrixCalculator.display.add(num);
	
	HistrixCalculator.push(HistrixCalculator.display.parse( HistrixCalculator.stringDis ), false);
	};

// Check if an action is a simbol.
HistrixCalculator.isSimbol = function(act)
	{
	return act == '0' || act == '1' || act == '2' || act == '3' || act == '4' || act == '5' ||
		   act == '6' || act == '7' || act == '8' || act == '9' || act == 'A' || act == 'B' ||
		   act == 'C' || act == 'D' || act == 'E' || act == 'F' || act == '.' || act == 'Exp' ||
		   (HistrixCalculator.writingFlag && act == '+/-');
   };





// Handles a delete action.
HistrixCalculator.handleDelete = function(act)
	{
	if(act == 'CA')
		{HistrixCalculator.clearAll();}

	if(act == 'CE')
		{HistrixCalculator.clearDisplay();}

	if(act == 'Backspace')
		{
		// Check if the last relevant action was a symbol.
		if( HistrixCalculator.writingFlag )
			{
			var cont = true;
			var dis = HistrixCalculator.stringDis;

			while(cont)
				{
				if(dis == null || dis.length <= 1)
					{
					dis = "0";
					cont = false;
					}
				else
					{
					var c = dis.substring(dis.length-1, dis.length);
					dis = dis.substring(0, dis.length-1);
					if(c != "," && c != ' ' && dis != '-')
						{cont = false;}
					}
				}

			HistrixCalculator.stringDis = dis;
			HistrixCalculator.push(HistrixCalculator.display.parse( HistrixCalculator.stringDis ), false);
			}
		}
	};




// Handles a memory action.
HistrixCalculator.handleMemory = function(act)
	{
	// Memory restore.
	if(act == 'MR')
		{
		if(HistrixCalculator.mem != null)
			{HistrixCalculator.push(HistrixCalculator.mem);}
		}

	// Memory store.
	if(act == 'MS')
		{HistrixCalculator.mem = HistrixCalculator.numDis;}

	// Memory clear.
	if(act == 'MC')
		{HistrixCalculator.mem = null;}

	// Memory add.
	if(act == 'M+')
		{
		if(HistrixCalculator.mem == null) HistrixCalculator.mem = 0;
		HistrixCalculator.mem += HistrixCalculator.numDis;
		}

	// Check if the memory is fill.
	if(HistrixCalculator.mem == null)
		{jQuery("#HistrixCalculator input[name='mem']").val("");}
	else
		{jQuery("#HistrixCalculator input[name='mem']").val("M");}
	};

// Check if an action is a memory action.
HistrixCalculator.isMemoryAction = function(act)
	{return act == 'MR' || act == 'MC' || act == 'MS' || act == 'M+';};




// Handles a unary operator.
HistrixCalculator.handleUnaryOperator = function(act)
	{
	var numAnt = HistrixCalculator.getNumAnt();
	var res = HistrixCalculator.math.unaryOperation(numAnt, HistrixCalculator.numDis, act);
	HistrixCalculator.push(res);
	};

// Handles a binary operator.
HistrixCalculator.handleBinaryOperator = function(act)
	{HistrixCalculator.push(act);};





// Handles equals.
HistrixCalculator.handleEquals = function(act)
	{
	// Check if exists a pending operation.
	if( ! HistrixCalculator.executePendingOperations() )
		{ HistrixCalculator.executeLastOperation(); }
	else
		{ HistrixCalculator.display.update( HistrixCalculator.top() ); }
	};



// Check if an action is a binary operator.
HistrixCalculator.handleConstant = function(act)
	{
	if(act == 'pi')
		{
		HistrixCalculator.push(Math.PI);
		}
	};


// Handles a memory action.
HistrixCalculator.handleStadistic = function(act)
	{
	var n = jQuery("#HistrixCalculator_stadistics option.stadistic_value").size();

	if(act == 'Sta')
		{
		if( jQuery("#HistrixCalculator_stadistics").is(":hidden") )
			{
			jQuery("#HistrixCalculator .stadistic").attr("disabled", false);
			jQuery("#HistrixCalculator .stadistic").removeAttr("style")
			jQuery("#HistrixCalculator_stadistics").show();
			}
		else
			{
			jQuery("#HistrixCalculator .stadistic").attr("disabled", true);
			jQuery("#HistrixCalculator .stadistic").css("color","#a0a0a0");
			jQuery("#HistrixCalculator_stadistics").hide();
			}
		}

	if(act == 'Ave' || act == 'Sum')
		{
		var res = 0;

		if(HistrixCalculator.isInv())
			{
			jQuery("#HistrixCalculator_stadistics option.stadistic_value").each(function(index)
				{
				var num = parseFloat(jQuery(this).attr('num'));
				res += num*num;
				});

			HistrixCalculator.setInv(false);
			}
		else
			{
			jQuery("#HistrixCalculator_stadistics option.stadistic_value").each(function(index)
				{
				var num = parseFloat(jQuery(this).attr('num'));
				res += num;
				});
			}

		if(act == 'Ave') {res = res / n;}

		HistrixCalculator.push(res);
		}

	if(act == 's')
		{
		if(n > 0)
			{
			var den = n -1;
			if(HistrixCalculator.isInv())
				{
				den++;
				HistrixCalculator.setInv(false);
				}
			if(den <= 0) {den = 1;}

			var ave = 0;
			jQuery("#HistrixCalculator_stadistics option.stadistic_value").each(function(index)
				{ave += parseFloat(jQuery(this).attr('num'));});
			ave = ave / n;

			var s = 0;
			jQuery("#HistrixCalculator_stadistics option.stadistic_value").each(function(index)
				{
				var num = parseFloat(jQuery(this).attr('num')) - ave;
				s += num*num;
				});
			s = Math.sqrt( s/den );

			HistrixCalculator.push(s);
			}
		}

	if(act == 'Dat')
		{	
                var option = '<option class="stadistic_value" value="'+(n+1)+'" num="'+HistrixCalculator.numDis+'">'+HistrixCalculator.stringDis+'</option>';
		jQuery("#HistrixCalculator_stadistics select[name='datos']").prepend(option);
		}
	};

// Check if an action is a memory action.
HistrixCalculator.isStadisticAction = function(act)
	{return act == 'Sta' || act == 'Ave' || act == 'Sum' || act == 's' || act == 'Dat';};



HistrixCalculator.push = function(val, update)
	{
	if(update == null || typeof update != 'boolean')
		{update = true;}

	if(typeof val == 'number')
		{
		if(HistrixCalculator.pila.length > 0 && typeof HistrixCalculator.pila[HistrixCalculator.pila.length-1] == 'number')
			{HistrixCalculator.pila[HistrixCalculator.pila.length-1] = val;}
		else
			{HistrixCalculator.pila.push(val);}

		if(update) {HistrixCalculator.display.update( HistrixCalculator.top() );}
		}

	if(typeof val == 'string')
		{
		if( HistrixCalculator.math.isBinaryOperator(val) && HistrixCalculator.pila.length > 0)
			{
			if( HistrixCalculator.math.isBinaryOperator(HistrixCalculator.pila[HistrixCalculator.pila.length-1]) )
				{HistrixCalculator.pila[HistrixCalculator.pila.length-1] = val;}
			else
				{
				if(typeof HistrixCalculator.pila[HistrixCalculator.pila.length-1] == 'number' || HistrixCalculator.pila[HistrixCalculator.pila.length-1] == ')')
					{
					if( HistrixCalculator.executePendingOperations() && update )
						{HistrixCalculator.display.update( HistrixCalculator.top() );}
					HistrixCalculator.pila.push(val);
					}
				}
			}

		if(val == '(')
			{
			if(HistrixCalculator.pila.length == 0 || HistrixCalculator.top() == '(' || HistrixCalculator.math.isBinaryOperator(HistrixCalculator.top()) )
				{ HistrixCalculator.pila.push(val); }
			}

		if(val == ')')
			{
			if(! HistrixCalculator.math.isBinaryOperator(HistrixCalculator.top()) && HistrixCalculator.countOcurrences('(') > 0)
				{
				if( HistrixCalculator.executePendingOperations(')') && update )
					{HistrixCalculator.display.update( HistrixCalculator.top() );} 
				}
			}
		}
	}


HistrixCalculator.top = function()
	{
	if(HistrixCalculator.pila.length > 0)
		{return HistrixCalculator.pila[HistrixCalculator.pila.length -1];}
	return null;
	}

HistrixCalculator.getNumAnt = function()
	{
	if(HistrixCalculator.pila.length >= 2 && typeof HistrixCalculator.pila[HistrixCalculator.pila.length - 2] == 'number')
		{return HistrixCalculator.pila[HistrixCalculator.pila.length - 2];}

	if(HistrixCalculator.pila.length >= 3 && typeof HistrixCalculator.pila[HistrixCalculator.pila.length - 3] == 'number')
		{return HistrixCalculator.pila[HistrixCalculator.pila.length - 3];}

	return 0;
	}

HistrixCalculator.countOcurrences = function(val)
	{
	var count = 0;
	for(var i=0; i<HistrixCalculator.pila.length; i++)
		{
		if(HistrixCalculator.pila[i] == val)
			{count++;}
		}
	return count;
	}

HistrixCalculator.executePendingOperations = function(param)
	{
	var res = false;
	var n = HistrixCalculator.pila.length;

	if(param == null || param != ')')
		{
		if(n >= 3)
			{
			if(typeof HistrixCalculator.pila[n-1] == 'number' &&
			   typeof HistrixCalculator.pila[n-2] == 'string' && HistrixCalculator.math.isBinaryOperator(HistrixCalculator.pila[n-2]) &&
			   typeof HistrixCalculator.pila[n-3] == 'number')
				{
				var numAct = HistrixCalculator.pila.pop();
				var op = HistrixCalculator.pila.pop();
				var numAnt = HistrixCalculator.pila.pop();

				var result = HistrixCalculator.math.binaryOperation(numAnt, numAct, op);
				HistrixCalculator.pila.push(result);

				res = true;
				}
			}
		}
	else
		{
		// Search the '(' character.
		var pos = null;

		var i = n-1;
		while(pos == null && i >= 0)
			{
			if(HistrixCalculator.pila[i] == '(')
				{pos = i;}
			i--;
			}

		if(pos != null)
			{
			var dif = (n-1) - pos;

			if(dif == 0)
				{HistrixCalculator.pila.pop();}

			if(dif == 1)
				{
				var aux = HistrixCalculator.pila.pop();
				HistrixCalculator.pila.pop()
				HistrixCalculator.pila.push(aux);
				}

			if(dif == 3)
				{
				var num1 = HistrixCalculator.pila.pop();
				var ope = HistrixCalculator.pila.pop();
				var num2 = HistrixCalculator.pila.pop();
				HistrixCalculator.pila.pop();

				if(typeof num1 == 'number' &&
				   typeof ope == 'string' && HistrixCalculator.math.isBinaryOperator(ope) &&
				   typeof num2 == 'number')
					{
					var resu = HistrixCalculator.math.binaryOperation(num2, num1, ope);
					HistrixCalculator.pila.push(resu);

					res = true;
					}
				}
			}
		}

	return res;
	}




// Performs the last binary operation.
HistrixCalculator.executeLastOperation = function()
	{
	if(HistrixCalculator.numDis != null && HistrixCalculator.lastNumAct != null && HistrixCalculator.lastOp != null)
		{
		var res = HistrixCalculator.math.binaryOperation(HistrixCalculator.numDis, HistrixCalculator.lastNumAct, HistrixCalculator.lastOp);
		HistrixCalculator.push(res);
		}
	}

