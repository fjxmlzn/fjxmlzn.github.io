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

HistrixCalculator = new Object();

HistrixCalculator.stringDis = "0";
HistrixCalculator.numDis = 0;
HistrixCalculator.pila = new Array();

HistrixCalculator.lastNumAct = null;
HistrixCalculator.lastNumAnt = null;
HistrixCalculator.lastOp = null;

HistrixCalculator.mem = null;

HistrixCalculator.writingFlag = false;
HistrixCalculator.exponentialFlag = false;

HistrixCalculator.init = function()
	{
	// Change mode.
	jQuery("#HistrixCalculator select[name='mode']").change(function ()
		{
		if(jQuery(this).val() == 'standard')
			{
			// Show only standard buttons.
                        jQuery("#HistrixCalculator .standard").show();
			jQuery("#HistrixCalculator .scientific").hide();
			jQuery("#HistrixCalculator").width(240);
			jQuery("#HistrixCalculator div.right").width(240);
                        
                        // Disable stadistic mode.
                        jQuery("#HistrixCalculator .stadistic").attr("disabled", true);
                        jQuery("#HistrixCalculator .stadistic").css("color","#a0a0a0");
                        jQuery("#HistrixCalculator_stadistics").hide();
			}
		else
			{
			// Show only scientific buttons.
                        jQuery("#HistrixCalculator .scientific").show();
			jQuery("#HistrixCalculator .standard").hide();
			jQuery("#HistrixCalculator").width(450);
			jQuery("#HistrixCalculator div.right").width(280);
			}
		});
	jQuery("#HistrixCalculator select[name='mode']").change();


	// Change base.
	jQuery("#HistrixCalculator input[name='base']").change(function ()
		{
		if(jQuery(this).attr("checked"))
			{
			jQuery("#HistrixCalculator .up .hexadecimal").hide();
			jQuery("#HistrixCalculator .up .decimal").hide();
			jQuery("#HistrixCalculator .up .octal").hide();
			jQuery("#HistrixCalculator .up .binary").hide();
			jQuery("#HistrixCalculator .up ." + jQuery(this).val()).show();

			jQuery("#HistrixCalculator .down .hexadecimal").attr("disabled", true);
			jQuery("#HistrixCalculator .down .hexadecimal").css("color","#a0a0a0");
			jQuery("#HistrixCalculator .down .decimal").attr("disabled", true);
			jQuery("#HistrixCalculator .down .decimal").css("color","#a0a0a0");
			jQuery("#HistrixCalculator .down .octal").attr("disabled", true);
			jQuery("#HistrixCalculator .down .octal").css("color","#a0a0a0");
			jQuery("#HistrixCalculator .down .binary").attr("disabled", true);
			jQuery("#HistrixCalculator .down .binary").css("color","#a0a0a0");
			jQuery("#HistrixCalculator .down ." + jQuery(this).val()).removeAttr("disabled");
			jQuery("#HistrixCalculator .down ." + jQuery(this).val()).removeAttr("style");

			HistrixCalculator.display.update();
			HistrixCalculator.display.refresh();
			HistrixCalculator.numDis = HistrixCalculator.display.parse(HistrixCalculator.stringDis);
			}
		});
	jQuery("#HistrixCalculator input[name='base']").change();


	// Buttons.
	jQuery("#HistrixCalculator a.button").click(function()
		{
		if(typeof jQuery(this).attr('disabled') == 'undefined' || jQuery(this).attr('disabled') == false || jQuery(this).attr('disabled') == 'false')
                    { HistrixCalculator.action(jQuery(this).html()); }
		return false;
		});


	// Display.
	jQuery("#HistrixCalculator input.display").get(0).onkeypress = function(event)
		{
		var keynum = HistrixCalculator.getKeyPress(event);
		var charCode = "";
		switch(keynum)
			{
			//case 8: charCode = "Backspace"; break;
			case 13:charCode = "=";break;
			default:charCode = String.fromCharCode(keynum);
			}

		HistrixCalculator.action(charCode);
		return false;
		};

	jQuery("#HistrixCalculator input.display").get(0).onkeyup = function(event)
		{
		var keynum = HistrixCalculator.getKeyPress(event);
		if(keynum == 8) {HistrixCalculator.action("Backspace");}
		return false;
		};

	HistrixCalculator.display.refresh();


	// Secondary displays.
	jQuery("#HistrixCalculator .square input").focus(function()
		{jQuery("#HistrixCalculator input.display").focus();});


	// Stadistics
	jQuery("#HistrixCalculator .stadistic").attr("disabled", true);
	jQuery("#HistrixCalculator .stadistic").css("color","#a0a0a0");
	jQuery("#HistrixCalculator_stadistics").hide();

	jQuery("#HistrixCalculator_stadistics button[name='ret']").click(function()
		{
		jQuery("#HistrixCalculator input.display").focus();
		return false;
		});

	jQuery("#HistrixCalculator_stadistics button[name='load']").click(function()
		{ 
		var option = jQuery("#HistrixCalculator_stadistics option.stadistic_value:selected");
		if(jQuery(option).size() > 0)
			{
			HistrixCalculator.push( parseFloat(jQuery(option).attr('num')) );
			HistrixCalculator.display.refresh();
			}
		return false;
		});

	jQuery("#HistrixCalculator_stadistics button[name='cd']").click(function()
		{
		jQuery("#HistrixCalculator_stadistics option.stadistic_value:selected").remove();
		return false;
		});

	jQuery("#HistrixCalculator_stadistics button[name='cad']").click(function()
		{
		jQuery("#HistrixCalculator_stadistics option.stadistic_value").remove();
		return false;
		});
	};



// Get the key pressed by the user.
HistrixCalculator.getKeyPress = function(event)
	{
	var keynum;

	if(window.event) // IE
		{keynum = window.event.keyCode;}
	else
		if(event) // Chrome/Firefox/Opera
			{keynum = event.which;}

	return keynum;
	};



// Get the value of the 'Metric' selector.
HistrixCalculator.getMetric = function()
	{return jQuery("#HistrixCalculator input[name='metric']:checked").val();};

// Get the value of the 'Base' selector.
HistrixCalculator.getBase = function()
	{return jQuery("#HistrixCalculator input[name='base']:checked").val();};

// Get the value of the 'Range' selector.
HistrixCalculator.getRange = function()
	{return jQuery("#HistrixCalculator input[name='range']:checked").val();};



// Checks if the 'Inv' checkbox is checked.
HistrixCalculator.isInv = function()
	{return jQuery("#HistrixCalculator input[name='inv']").attr("checked");};

// Checks or unchecks the 'Inv' checkbox.
HistrixCalculator.setInv = function(check)
	{ 
	if(check)
		{jQuery("#HistrixCalculator input[name='inv']").attr("checked",true);}
	else
		{jQuery("#HistrixCalculator input[name='inv']").removeAttr("checked");}
	};

// Checks if the 'Hyp' checkbox is checked.
HistrixCalculator.isHyp = function()
	{return jQuery("#HistrixCalculator input[name='hyp']").attr("checked");};

// Checks or unchecks the 'Hyp' checkbox.
HistrixCalculator.setHyp = function(check)
	{
	if(check)
		{jQuery("#HistrixCalculator input[name='hyp']").attr("checked",true);}
	else
		{jQuery("#HistrixCalculator input[name='hyp']").removeAttr("checked");}
	};



// An 'action' is produced when the user press a button or press a key.
HistrixCalculator.action = function(act)
	{
	// Update the numeric representacion of the display.
	HistrixCalculator.numDis = HistrixCalculator.display.parse(HistrixCalculator.stringDis);

	// Handle the action.
	HistrixCalculator.handleAction(act);

	// Refresh the display with the new value.
	HistrixCalculator.display.refresh();

	// Update the numeric representacion of the display.
	HistrixCalculator.numDis = HistrixCalculator.display.parse(HistrixCalculator.stringDis);

	// Update the display of parenthesis.
	var paren = HistrixCalculator.countOcurrences('(');
	if(paren == 0)
		{ jQuery("#HistrixCalculator input[name='par']").val(''); }
	else
		{ jQuery("#HistrixCalculator input[name='par']").val('(=' + paren); }

	// Put the focus on the display, so the user can press more keys.
	jQuery("#HistrixCalculator input.display").focus();
	};



// Deletes the current number.
HistrixCalculator.clearDisplay = function()
	{
	HistrixCalculator.push(0);
	HistrixCalculator.numDis = 0;
	HistrixCalculator.stringDis = "0";
	}

// Deletes the current operation.
HistrixCalculator.clearAll = function()
	{
	HistrixCalculator.pila = new Array();
	HistrixCalculator.numDis = 0;
	HistrixCalculator.stringDis = "0"; 
	HistrixCalculator.lastNumAct = null;
	HistrixCalculator.lastNumAnt = null;
	HistrixCalculator.lastOp = null;
	};
