jQuery(document).ready(function() {
    // When changing the mode, change the help.
    jQuery("#HistrixCalculator select[name='mode']").change(function () {
        if(jQuery(this).val() == 'standard') {
            jQuery("#div_help .scientific").hide();
            jQuery("#div_help .standard").show();
        } else {
            jQuery("#div_help .standard").hide();
            jQuery("#div_help .scientific").show();
        }
    });
        
    // Initialize calculator.
    HistrixCalculator.init();
});
