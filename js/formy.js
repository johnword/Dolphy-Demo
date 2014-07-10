(function(){

  var Formy = function(sel){
    this.$form = $(sel);
  };

  Formy.regex = {
    integer:/^\d+$/,
    
    // Used to use Date.parse(), which was the cause of Issue 9,  where the 
    // function would accept 09/80/2009 as parseable. The fix is to use a 
    // RegExp that will only accept American Middle-Endian form. See the 
    // Internationalization section in the documentation for how to cause 
    // it to support other date formats:
    date:/^((0?\d)|(1[012]))[\/-]([012]?\d|30|31)[\/-]\d{1,4}$/, 
    
    email:/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
    usd:/^\$?((\d{1,3}(,\d{3})*)|\d+)(\.(\d{2})?)?$/,            
    url:/^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
    
    // Number should accept floats or integers, be they positive or 
    // negative. It should also support scientific-notation, written as a 
    // lower or capital 'E' followed by the radix. Number assumes base 10. 
    // Unlike the native parseFloat or parseInt functions, this should not 
    // accept trailing Latin characters.
    number:/^[+-]?(\d+(\.\d*)?|\.\d+)([Ee]-?\d+)?$/,
    
    zip:/^\d{5}(-\d{4})?$/,
    phone:/^[2-9]\d{2}-\d{3}-\d{4}$/,
    guid:/^(\{?([0-9a-fA-F]){8}-(([0-9a-fA-F]){4}-){3}([0-9a-fA-F]){12}\}?)$/,
    time12:/^((0?\d)|(1[012])):[0-5]\d?\s?[aApP]\.?[mM]\.?$/,
    time24:/^(20|21|22|23|[01]\d|\d)(([:][0-5]\d){1,2})$/,

    nonHtml:/^[^<>]*$/
  };

  Formy.validators = {
      required: function(el){
        var $el = $(el);

        if ($el.attr('type') == 'checkbox')
          return $el[0].checked;

        if ($.trim($(el).val())) return true;
      }
  };

  Formy.prototype = {
    has_errors: function(){
      return this.$form.find('.error').length;
    },

    check_element: function(el){
      var formy = this;
      var $el = $(el);
      var rules = $el.data('rules');
      var errmsg = $el.data('message') || 'Invalid input.';
      var value = $el.val();
      var valid = true;
      var rule;

      if (!rules) return true;

      rules = rules.split(",");

      for(var i=0; i < rules.length; i++) {
        rule = $.trim(rules[i]);
        if (Formy.validators[rule]) {
          if (!Formy.validators[rule].call(el,el)) {
            valid = false;
            formy.display_error(el,errmsg);
            break;
          }
        }
        else if (Formy.regex[rule]) {
          if (!value.match(Formy.regex[rule])) {
            valid = false;
            formy.display_error(el,errmsg);
            break;
          }
        }
        else { console.log("Validator %s not found",rule); }
      }

      return valid;
    },

    display_error: function(el,msg){
      var $el = $(el);
      var msg = msg || 'Required input.';
      $el.after('<div class="error">'+ msg +'</div>');
      $el.closest('.form-group').addClass('has-error');
    },

    clear_errors: function(){
      this.$form.find('.error').remove();
      this.$form.find('.form-group.has-error').removeClass('has-error');
    },

    validate: function(){
      var formy = this;
      this.clear_errors('form');
      this.$form.find("[data-rules]").each(function(){
        formy.check_element(this);
      });
      return !this.has_errors();
    }
  };

  $.Formy = Formy;

}());