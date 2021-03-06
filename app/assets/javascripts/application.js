// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require activestorage
//= require turbolinks
//= require jquery3
//= require tooltip
//= require list
//= require popper
//= require bootstrap-sprockets
//= require extendext
//= require dot
//= require clipboard
//= require_tree .

$(document).on("turbolinks:load", function() {
  var clipboard = new ClipboardJS(".copy-text");

  clipboard.on("success", function(e) {
    $(".copy-text span").text("Copied to clipboard!");
    e.clearSelection();
  });

  $("body").on("click", ".feedback_active", function(e) {
    $(".feedback .thanks").hide();
    $(".feedback .form").hide();
    $(".feedback a").show();
    $(".feedback_active").hide();
  });

  $(".feedback a").on("click", function(e) {
    $("body").prepend("<div class='feedback_active'></div>");
    $(".feedback .form").show();
    $(".feedback .form textarea").focus();
    $(".feedback a").hide();
    e.preventDefault();
  });

  $(".contact-form").on("submit", function(e) {
    $(".feedback .thanks").show();
    $(".feedback .form").hide();

    setTimeout(function() {
      $(".feedback textarea").val("");
    }, 100);
  });

  $("#genre_search").bind("keypress", function(e) {
    if (e.keyCode == 13) {
      return false;
    }
  });

  var options = {
    valueNames: ["name", "artist_count"],
    page: 50,
    pagination: true
  };

  var genreList = new List("genre_lists", options);

  $(function() {
    $('[data-toggle="popover"]').popover({});
  });

  var rules_basic = {};

  const template = {
    group:
      '\
      <div id="{{= it.group_id }}" class="rules-group-container"> \
        <div class=rules-group-body> \
          <div class=rules-list></div> \
        </div> \
        <div class="rules-group-header"> \
          <div class="btn-group pull-left group-actions"> \
            <button type="button" class="btn btn-xs btn-primary" data-add="rule"> \
              <i class="{{= it.icons.add_rule }}"></i> {{= it.translate("add_rule") }} \
            </button> \
            {{? it.settings.allow_groups===-1 || it.settings.allow_groups>=it.level }} \
              <button type="button" class="btn btn-xs btn-success" data-add="group"> \
                <i class="{{= it.icons.add_group }}"></i> {{= it.translate("add_group") }} \
              </button> \
            {{?}} \
            {{? it.level>1 }} \
              <button type="button" class="btn btn-xs btn-danger" data-delete="group"> \
                <i class="{{= it.icons.remove_group }}"></i> {{= it.translate("delete_group") }} \
              </button> \
            {{?}} \
          </div> \
          {{? it.settings.display_errors }} \
            <div class="error-container"><i class="{{= it.icons.error }}"></i></div> \
          {{?}} \
        </div> \
      </div>',
    rule:
      '\
        <div id="{{= it.rule_id }}" class="rule-container"> \
          <div class="rule-header"> \
            <div class="btn-group float-right rule-actions"> \
              <button type="button" class="btn btn-xs btn-link text-danger" data-delete="rule"> \
                <i class="{{= it.icons.remove_rule }}"></i> \
              </button> \
            </div> \
          </div> \
          {{? it.settings.display_errors }} \
            <div class="error-container"><i class="{{= it.icons.error }}"></i></div> \
          {{?}} \
          <div class="rule-filter-container"></div> \
          <div class="rule-operator-container"></div> \
          <div class="rule-value-container"></div> \
        </div>'
  };

  if ($("#original_filters").length > 0) {
    if ($("#original_filters").val() === "{}") {
      rules = null;
    } else {
      rules = JSON.parse($("#original_filters").val());
    }
  }

  if ($("#user_genres").length > 0) {
    if ($("#user_genres").val() === "{}") {
      user_genres = null;
    } else {
      user_genres = JSON.parse($("#user_genres").val());
    }
  }

  // var options = {}
  // options.templates = template
  // options.filters = filters
  // options.rules = rules
  if ($("#builder").length > 0) {
    $("#builder").queryBuilder({
      filters: [
        {
          id: "track_name",
          label: "Track Name",
          type: "string",
          operators: [
            "equal",
            "not_equal",
            "contains",
            "not_contains",
            "begins_with",
            "ends_with"
          ],
          unique: true,
          description:
            "Text the track name contains. Use a pipe to include multiple artists: <code>love|tears|pugs</code>."
        },
        {
          id: "artist_name",
          label: "Artist Name",
          type: "string",
          operators: [
            "equal",
            "not_equal",
            "contains",
            "not_contains",
            "begins_with",
            "ends_with"
          ],
          unique: true,
          description:
            "Text the artist name contains. Use a pipe to include multiple artists: <code>Taylor Swift|Bob Dylan|Justin Bieber</code>."
        },
        {
          id: "label",
          label: "Label",
          type: "string",
          operators: ["contains"],
          unique: true,
          description:
            "What label an album was released on. Use a pipe to include multiple labels: <code>Atlantic|Republic|Columbia</code>."
        },
        {
          id: "lyrics",
          label: "Lyrics",
          type: "string",
          operators: ["contains", "not_contains"],
          unique: true,
          description: "What is in those lyrics?"
        },
        {
          id: "days_ago",
          label: "Days Ago",
          type: "integer",
          operators: ["less", "greater"],
          unique: true,
          description: "How many days ago was the song added?"
        },
        {
          id: "bpm",
          label: "BPM",
          type: "integer",
          operators: ["less", "greater", "between"],
          unique: true,
          description: "What BPM (Beats Per Minute) do you like?"
        },
        {
          id: "release_date",
          label: "Release Date",
          type: "date",
          operators: ["between", "less", "greater"],
          unique: true,
          description: "When were the tracks released?",
          plugin: "datepicker",
          plugin_config: {
            format: "yyyy-mm-dd",
            assumeNearbyYear: true,
            autoclose: true
          }
        },
        // {
        //   id: 'genres',
        //   label: 'Genres',
        //   type: 'string',
        //   operators: ['contains'],
        //   unique: true,
        //   description: 'Comma-separated genres you\'d like to limit to. <a href="http://everynoise.com/everynoise1d.cgi?scope=all&vector=popularity">Here\'s a useful list</a> of the 3000+ genres Spotify supports. 🤯'
        // },
        {
          id: "genres",
          label: "Genres",
          type: "string",
          // input: "select",
          input: function(rule, name) {
            var operator = rule.operator.type;
            var form = "";
            var values = user_genres;
            // This runs the first time only, so we need to call it again when the operator value changes, using the
            // "afterUpdateRuleOperator.queryBuilder" event lower in this file.

            // For the life of me I couldn't figure out how to pas the plugin_config values to the selectpicker
            // So we are using the dom attributes here to configure it based on the instructions here:
            // https://developer.snapappointments.com/bootstrap-select
            if(operator == "in"){
              form = '<select class="selectpicker" multiple data-live-search="true" name="'+name+'">';
              for(var i = 0; i < values.length; i++){
                form += '<option value="'+values[i]+'">'+values[i]+'</option>';
              }
              form += '</select>';
            } else {
              form = `<input class="form-control" name="${name}" type="text" value="${rule.value}">`;
            }

            return form;
          },
          operators: ["in", "contains"],
          plugin: "selectpicker",
          values: user_genres,
          plugin_config: {
            liveSearch: true,
            width: "auto",
            selectedTextFormat: "values",
            liveSearchStyle: "contains"
          },
          multiple: true,
          unique: true,
          description:
            "The genres you'd like to limit to. Will include artist from all the genres selected."
        },
        {
          id: "plays",
          label: "Play Count",
          type: "integer",
          operators: ["less", "greater", "between"],
          unique: true,
          description:
            "How many plays does this song have? NOTE: This count only starts <b>after</b> you connect to PLYLST."
        },
        {
          id: "duration",
          label: "Duration",
          type: "integer",
          operators: ["less", "greater", "between"],
          unique: true,
          description: "How long, in seconds, is the song?"
        },
        {
          id: "last_played_days_ago",
          label: "Days Since Last Played",
          type: "integer",
          operators: ["less", "greater"],
          unique: true,
          description:
            "How many days ago was the song last played? NOTE: This data is only available for songs played <b>after</b> you connect to PLYLST."
        },
        {
          id: "key",
          label: "Key",
          type: "integer",
          input: "select",
          values: [
            { "0": "C" },
            { "1": "C♯, D♭" },
            { "2": "D" },
            { "3": "D♯, E♭" },
            { "4": "E" },
            { "5": "F" },
            { "6": "F♯, G♭" },
            { "7": "G" },
            { "8": "G♯, A♭" },
            { "9": "A" },
            { "10": "A♯, B♭" },
            { "11": "B" }
          ],
          operators: ["equal"],
          plugin: "selectpicker",
          unique: true,
          description: "The estimated key of the song"
        },
        {
          id: "danceability",
          label: "Danceability",
          type: "integer",
          input: "select",
          values: [
            { "0": "Not at all" },
            { "1": "A little" },
            { "2": "Somewhat" },
            { "3": "Moderately" },
            { "4": "Very" },
            { "5": "Super" }
          ],
          operators: ["equal", "less", "greater", "between"],
          plugin: "selectpicker",
          unique: true,
          description: "How danceable is the track?"
        },
        {
          id: "mode",
          label: "Mode",
          type: "integer",
          input: "select",
          values: [{ "0": "Minor" }, { "1": "Major" }],
          operators: ["equal"],
          plugin: "selectpicker",
          unique: true,
          description: "Is the melody of the song in a major key or minor key?"
        },
        {
          id: "acousticness",
          label: "Acoustic Likeliness",
          type: "integer",
          input: "select",
          values: [
            { "0": "Not at all" },
            { "1": "Somewhat" },
            { "2": "Likely" },
            { "3": "Very likely" }
          ],
          operators: ["equal", "less", "greater", "between"],
          plugin: "selectpicker",
          unique: true,
          description: "How likely is it the song is acoustic?"
        },
        {
          id: "energy",
          label: "Energy",
          type: "integer",
          input: "select",
          values: [
            { "0": "Low" },
            { "1": "Medium" },
            { "2": "High" },
            { "3": "Insane" }
          ],
          operators: ["equal", "less", "greater", "between"],
          plugin: "selectpicker",
          unique: true,
          description: "How energetic is the song?"
        },
        {
          id: "instrumentalness",
          label: "Instrumental",
          type: "integer",
          input: "select",
          values: [{ "0": "No" }, { "1": "Yes" }],
          operators: ["equal"],
          plugin: "selectpicker",
          unique: true,
          description: "Is it an instrumental track?"
        },
        {
          id: "speechiness",
          label: "Speech",
          type: "integer",
          input: "select",
          values: [{ "0": "No" }, { "1": "Yes" }],
          operators: ["equal"],
          plugin: "selectpicker",
          unique: true,
          description:
            "Is the track mostly spoken word (talk show, audiobook, podcast)?"
        },
        {
          id: "valence",
          label: "Mood",
          type: "integer",
          input: "select",
          values: [
            { "0": "Negative (sad, depressed, angry)" },
            { "1": "Positive (happy, cheerful, euphoric)" }
          ],
          operators: ["equal"],
          plugin: "selectpicker",
          unique: true,
          description: "What's the overall mood of the track?"
        },
        {
          id: "explicit",
          label: "Explicit",
          type: "integer",
          input: "select",
          values: [{ "0": "Excluded" }, { "1": "Included" }],
          operators: ["equal"],
          plugin: "selectpicker",
          unique: true,
          description: "Should explicit tracks be excluded or included?"
        },
        {
          id: "popularity",
          label: "Popularity",
          type: "integer",
          operators: ["less", "greater", "between"],
          unique: true,
          validation: {
            min: 0,
            max: 100
          },
          description: "How popular should the songs be? (0-100)"
        }
      ],
      /*rules: rules_basic,*/
      allow_groups: 0,
      conditions: ["AND"],
      sort_filters: true,
      inputs_separator: '<span class="separator">and</span>',
      select_placeholder: " ",
      display_errors: false,
      lang: {
        operators: {
          less: "less than",
          greater: "greater than",
          equal: "is",
          not_equal: "is not"
        }
      },
      icons: {
        add_group: "fas fa-plus-square",
        add_rule: "fas fa-plus",
        remove_group: "fas fa-minus-square",
        remove_rule: "far fa-trash-alt",
        error: "fas fa-exclamation-circle"
      },
      plugins: {
        "unique-filter": null,
        "filter-description": { mode: "inline" },
        "bt-selectpicker": null
      },
      templates: template,
      rules: rules
    });
  }


  // need to wait short amount  so ui settles
  setTimeout(checkRulesAndTriggerGenreValueRender, 100);

  // if genre->contains op exists on page, replace the searchable DD with an input on first load
  // (mostly an issue on the 'edit' page)
  function checkRulesAndTriggerGenreValueRender() {
    // if there's no builder on the page, don't even run this code (no rules)
    if ($("#builder").length === 0 ) return;

    // get the rule from the model so the proper model data bindings will be in place
    var model = $("#builder").queryBuilder("getModel");

    var genreContainsRule = model && model.rules && model.rules.find(rule=> {
      if (!rule.filter || !rule.operator) return false;
      return rule.filter.id === 'genres' && rule.operator.type === 'contains'
    })

    if (genreContainsRule) toggleGenreValue(null, genreContainsRule);
  }


  // this event fires after any of the operators change (in->contains etc)
  $("#builder").on("afterUpdateRuleOperator.queryBuilder", toggleGenreValue);


  // logic to swap genres value from input to search DD and back
  // this gets called on page load (if there's a genre rule)
  // also gets called on genres -> operator change
  function toggleGenreValue (_e, rule) {
    // var name = rule.id;
    // FIXME: name appears as 'builder_rule_0' because that's the id of the operator DD
    // We need the name of the value though which is what we have here below so it can be
    // passed to the backend properly. FIXME: maybe try to find a way to derive this automagically
    var  name = "builder_rule_0_value_0";

    // only act on genres rule, and 'contains' op
    if (rule.filter.id == 'genres' && rule.operator.type == 'contains') {

      // use the input method on the filter defined above to get the desired html output
      var output = rule.filter.input(rule, name)

      // cleanup the prior selectpicker (helps avoid mem leaks)
      rule.$el.find('.rule-value-container .selectpicker').selectpicker('destroy');

      // render the simple input in the html
      rule.$el.find('.rule-value-container').html(output)

      // after focus is lost from input, update the rule value so it'll be sent properly to the backend
      rule.$el.find('.rule-value-container input').on('blur', function(e) {
        rule.value = [this.value]; // causes input value to be re-rendered as well
      })

      // re-render the fancy multi-select searchable DD
    } else if (rule.filter.id == 'genres' && rule.operator.type == 'in') {

      // get and render the html
      var output = rule.filter.input(rule, name)
      rule.$el.find('.rule-value-container').html(output)

      // force a re-render of the bootstrap-select ui (enhances the <select> with the special features)
      // https://developer.snapappointments.com/bootstrap-select (<- uses this select DD)
      rule.$el.find('.rule-value-container select').selectpicker('render');

      // when select DD is hidden / closed, manually assign the selcted values to rule.value
      // this triggers a model update, which makes the values availible in queryBuilder("getRules")
      // This is necessary because the automagic 2 way change event binding is missing with our manual setup for genres
      // https://developer.snapappointments.com/bootstrap-select (<- uses this select DD)
      rule.$el.find('.rule-value-container select').on('hidden.bs.select', function (e, clickedIndex, isSelected, previousValue) {
        rule.value = $(this).val()
      });

    }
  }

  $("#builder").on(
    "afterUpdateRuleValue.queryBuilder afterUpdateRuleFilter.queryBuilder afterUpdateGroupCondition.queryBuilder afterDeleteRule.queryBuilder afterDeleteGroup.queryBuilder afterUpdateRuleOperator.queryBuilder",
    function(e, rule) {
      // update the playlist_filters hidden input with all the rules
      // this input is transmitted to the backend for processing
      $("#playlist_filters").val(
        JSON.stringify(
          $("#builder").queryBuilder("getRules", { skip_empty: true })
        )
      );

      if (rule.filter.id == "release_date") {
        var $input = rule.$el.find(
          $.fn.queryBuilder.constructor.selectors.rule_value
        );

        if (rule.operator.type == "less" || rule.operator.type == "greater") {
          $input.prop({ type: "number" }).datepicker("destroy");
          $input
            .parent()
            .find("span")
            .remove();
          $input.parent().append("<span class='rule-text'>days ago</span>");
        }

        if (rule.operator.type == "between") {
          $input.prop({ type: "date" }).datepicker({
            format: "dd-mm-yyyy",
            assumeNearbyYear: true,
            autoclose: true
          });
        }
      }
    }
  );
});
