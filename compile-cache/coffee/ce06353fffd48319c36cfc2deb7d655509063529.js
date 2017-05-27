(function() {
  var Beautifiers, Handlebars, _, beautifier, beautifierName, beautifierNames, beautifierOptions, beautifiers, beautifiersMap, beautifyLanguageCommands, context, exampleConfig, fs, i, keywords, languageNames, languageOptions, languagesMap, len, linkifyTitle, lo, optionDef, optionGroup, optionGroupTemplate, optionGroupTemplatePath, optionName, optionTemplate, optionTemplatePath, optionsPath, optionsTemplate, optionsTemplatePath, packageOptions, path, pkg, readmePath, readmeResult, readmeTemplate, readmeTemplatePath, ref, ref1, result, sortKeysBy, sortSettings, template;

  Handlebars = require('handlebars');

  Beautifiers = require("../src/beautifiers");

  fs = require('fs');

  _ = require('lodash');

  path = require('path');

  pkg = require('../package.json');

  console.log('Generating options...');

  beautifier = new Beautifiers();

  languageOptions = beautifier.options;

  packageOptions = require('../src/config.coffee');

  beautifiersMap = _.keyBy(beautifier.beautifiers, 'name');

  languagesMap = _.keyBy(beautifier.languages.languages, 'name');

  beautifierOptions = {};

  for (lo in languageOptions) {
    optionGroup = languageOptions[lo];
    ref = optionGroup.properties;
    for (optionName in ref) {
      optionDef = ref[optionName];
      beautifiers = (ref1 = optionDef.beautifiers) != null ? ref1 : [];
      for (i = 0, len = beautifiers.length; i < len; i++) {
        beautifierName = beautifiers[i];
        if (beautifierOptions[beautifierName] == null) {
          beautifierOptions[beautifierName] = {};
        }
        beautifierOptions[beautifierName][optionName] = optionDef;
      }
    }
  }

  console.log('Loading options template...');

  readmeTemplatePath = path.resolve(__dirname, '../README-template.md');

  readmePath = path.resolve(__dirname, '../README.md');

  optionsTemplatePath = __dirname + '/options-template.md';

  optionTemplatePath = __dirname + '/option-template.md';

  optionGroupTemplatePath = __dirname + '/option-group-template.md';

  optionsPath = __dirname + '/options.md';

  optionsTemplate = fs.readFileSync(optionsTemplatePath).toString();

  optionGroupTemplate = fs.readFileSync(optionGroupTemplatePath).toString();

  optionTemplate = fs.readFileSync(optionTemplatePath).toString();

  readmeTemplate = fs.readFileSync(readmeTemplatePath).toString();

  console.log('Building documentation from template and options...');

  Handlebars.registerPartial('option', optionTemplate);

  Handlebars.registerPartial('option-group', optionGroupTemplate);

  template = Handlebars.compile(optionsTemplate);

  readmeTemplate = Handlebars.compile(readmeTemplate);

  linkifyTitle = function(title) {
    var p, sep;
    title = title.toLowerCase();
    p = title.split(/[\s,+#;,\/?:@&=+$]+/);
    sep = "-";
    return p.join(sep);
  };

  Handlebars.registerHelper('linkify', function(title, options) {
    return new Handlebars.SafeString("[" + (options.fn(this)) + "](\#" + (linkifyTitle(title)) + ")");
  });

  exampleConfig = function(option) {
    var c, d, json, k, namespace, t;
    t = option.type;
    d = (function() {
      switch (false) {
        case option["default"] == null:
          return option["default"];
        case t !== "string":
          return "";
        case t !== "integer":
          return 0;
        case t !== "boolean":
          return false;
        default:
          return null;
      }
    })();
    json = {};
    namespace = option.language.namespace;
    k = option.key;
    c = {};
    c[k] = d;
    json[namespace] = c;
    return "```json\n" + (JSON.stringify(json, void 0, 4)) + "\n```";
  };

  Handlebars.registerHelper('example-config', function(key, option, options) {
    var results;
    results = exampleConfig(key, option);
    return new Handlebars.SafeString(results);
  });

  Handlebars.registerHelper('language-beautifiers-support', function(languageOptions, options) {
    var results, rows;
    rows = _.map(languageOptions, function(val, k) {
      var defaultBeautifier, extensions, grammars, name;
      name = val.title;
      defaultBeautifier = _.get(val, "properties.default_beautifier.default");
      beautifiers = _.map(val.beautifiers, function(b) {
        var isDefault, r;
        beautifier = beautifiersMap[b];
        isDefault = b === defaultBeautifier;
        if (beautifier.link) {
          r = "[`" + b + "`](" + beautifier.link + ")";
        } else {
          r = "`" + b + "`";
        }
        if (isDefault) {
          r += " (Default)";
        }
        return r;
      });
      grammars = _.map(val.grammars, function(b) {
        return "`" + b + "`";
      });
      extensions = _.map(val.extensions, function(b) {
        return "`." + b + "`";
      });
      return "| " + name + " | " + (grammars.join(', ')) + " |" + (extensions.join(', ')) + " | " + (beautifiers.join(', ')) + " |";
    });
    results = "| Language | Grammars | File Extensions | Supported Beautifiers |\n| --- | --- | --- | ---- |\n" + (rows.join('\n'));
    return new Handlebars.SafeString(results);
  });

  Handlebars.registerHelper('language-options-support', function(languageOptions, options) {

    /*
    | Option | PrettyDiff | JS-Beautify |
    | --- | --- | --- |
    | `brace_style` | ? | ? |
    | `break_chained_methods` | ? | ? |
    | `end_with_comma` | ? | ? |
    | `end_with_newline` | ? | ? |
    | `eval_code` | ? | ? |
    | `indent_size` | :white_check_mark: | :white_check_mark: |
    | `indent_char` | :white_check_mark: | :white_check_mark: |
     */
    var headers, results, rows;
    rows = [];
    beautifiers = languageOptions.beautifiers.sort();
    headers = ['Option'].concat(beautifiers);
    rows.push(headers);
    rows.push(_.map(headers, function() {
      return '---';
    }));
    _.each(Object.keys(languageOptions.properties), function(op) {
      var field, support;
      field = languageOptions.properties[op];
      support = _.map(beautifiers, function(b) {
        if (_.includes(field.beautifiers, b) || _.includes(["disabled", "default_beautifier", "beautify_on_save"], op)) {
          return ':white_check_mark:';
        } else {
          return ':x:';
        }
      });
      return rows.push(["`" + op + "`"].concat(support));
    });
    results = _.map(rows, function(r) {
      return "| " + (r.join(' | ')) + " |";
    }).join('\n');
    return new Handlebars.SafeString(results);
  });

  Handlebars.registerHelper('beautifiers-info', function(beautifiers, options) {

    /*
    | Beautifier | Is Pre-Installed? | Installation Instructions |
    | --- | ---- |
    | Pretty Diff | :white_check_mark: | N/A |
    | AutoPEP8 | :x: | LINK |
     */
    var results, rows;
    rows = _.map(beautifiers, function(beautifier, k) {
      var installationInstructions, isPreInstalled, link, name;
      name = beautifier.name;
      isPreInstalled = beautifier.isPreInstalled;
      link = beautifier.link;
      installationInstructions = isPreInstalled ? "Nothing!" : "Go to " + link + " and follow the instructions.";
      return "| " + name + " | " + (isPreInstalled ? ':white_check_mark:' : ':x:') + " | " + installationInstructions + " |";
    });
    results = "| Beautifier | Is Pre-Installed? | Installation Instructions |\n| --- | --- | --- |\n" + (rows.join('\n'));
    return new Handlebars.SafeString(results);
  });

  sortKeysBy = function(obj, comparator) {
    var keys;
    keys = _.sortBy(_.keys(obj), function(key) {
      if (comparator) {
        return comparator(obj[key], key);
      } else {
        return key;
      }
    });
    return _.zipObject(keys, _.map(keys, function(key) {
      return obj[key];
    }));
  };

  sortSettings = function(settings) {
    var r;
    r = _.mapValues(settings, function(op) {
      if (op.type === "object" && op.properties) {
        op.properties = sortSettings(op.properties);
      }
      return op;
    });
    r = sortKeysBy(sortKeysBy(r), function(op) {
      return op.order;
    });
    return r;
  };

  context = {
    "package": pkg,
    packageOptions: sortSettings(packageOptions),
    languageOptions: sortSettings(languageOptions),
    beautifierOptions: sortSettings(beautifierOptions),
    beautifiers: _.sortBy(beautifier.beautifiers, function(beautifier) {
      return beautifier.name.toLowerCase();
    })
  };

  result = template(context);

  readmeResult = readmeTemplate(context);

  console.log('Writing documentation to file...');

  fs.writeFileSync(optionsPath, result);

  fs.writeFileSync(readmePath, readmeResult);

  console.log('Updating package.json');

  languageNames = _.map(Object.keys(languagesMap), function(a) {
    return a.toLowerCase();
  });

  beautifierNames = _.map(Object.keys(beautifiersMap), function(a) {
    return a.toLowerCase();
  });

  keywords = _.union(pkg.keywords, languageNames, beautifierNames);

  pkg.keywords = keywords;

  beautifyLanguageCommands = _.map(languageNames, function(languageName) {
    return "atom-beautify:beautify-language-" + languageName;
  });

  pkg.activationCommands["atom-workspace"] = _.union(pkg.activationCommands["atom-workspace"], beautifyLanguageCommands);

  fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(pkg, void 0, 2));

  console.log('Done.');

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvZG9jcy9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0E7QUFBQSxNQUFBOztFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7RUFDYixXQUFBLEdBQWMsT0FBQSxDQUFRLG9CQUFSOztFQUNkLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEdBQUEsR0FBTSxPQUFBLENBQVEsaUJBQVI7O0VBRU4sT0FBTyxDQUFDLEdBQVIsQ0FBWSx1QkFBWjs7RUFDQSxVQUFBLEdBQWlCLElBQUEsV0FBQSxDQUFBOztFQUNqQixlQUFBLEdBQWtCLFVBQVUsQ0FBQzs7RUFDN0IsY0FBQSxHQUFpQixPQUFBLENBQVEsc0JBQVI7O0VBRWpCLGNBQUEsR0FBaUIsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxVQUFVLENBQUMsV0FBbkIsRUFBZ0MsTUFBaEM7O0VBQ2pCLFlBQUEsR0FBZSxDQUFDLENBQUMsS0FBRixDQUFRLFVBQVUsQ0FBQyxTQUFTLENBQUMsU0FBN0IsRUFBd0MsTUFBeEM7O0VBQ2YsaUJBQUEsR0FBb0I7O0FBQ3BCLE9BQUEscUJBQUE7O0FBQ0U7QUFBQSxTQUFBLGlCQUFBOztNQUNFLFdBQUEsbURBQXNDO0FBQ3RDLFdBQUEsNkNBQUE7OztVQUNFLGlCQUFrQixDQUFBLGNBQUEsSUFBbUI7O1FBQ3JDLGlCQUFrQixDQUFBLGNBQUEsQ0FBZ0IsQ0FBQSxVQUFBLENBQWxDLEdBQWdEO0FBRmxEO0FBRkY7QUFERjs7RUFPQSxPQUFPLENBQUMsR0FBUixDQUFZLDZCQUFaOztFQUNBLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3Qix1QkFBeEI7O0VBQ3JCLFVBQUEs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ZWVcblxuIyBEZXBlbmRlbmNpZXNcbkhhbmRsZWJhcnMgPSByZXF1aXJlKCdoYW5kbGViYXJzJylcbkJlYXV0aWZpZXJzID0gcmVxdWlyZShcIi4uL3NyYy9iZWF1dGlmaWVyc1wiKVxuZnMgPSByZXF1aXJlKCdmcycpXG5fID0gcmVxdWlyZSgnbG9kYXNoJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcbnBrZyA9IHJlcXVpcmUoJy4uL3BhY2thZ2UuanNvbicpXG5cbmNvbnNvbGUubG9nKCdHZW5lcmF0aW5nIG9wdGlvbnMuLi4nKVxuYmVhdXRpZmllciA9IG5ldyBCZWF1dGlmaWVycygpXG5sYW5ndWFnZU9wdGlvbnMgPSBiZWF1dGlmaWVyLm9wdGlvbnNcbnBhY2thZ2VPcHRpb25zID0gcmVxdWlyZSgnLi4vc3JjL2NvbmZpZy5jb2ZmZWUnKVxuIyBCdWlsZCBvcHRpb25zIGJ5IEJlYXV0aWZpZXJcbmJlYXV0aWZpZXJzTWFwID0gXy5rZXlCeShiZWF1dGlmaWVyLmJlYXV0aWZpZXJzLCAnbmFtZScpXG5sYW5ndWFnZXNNYXAgPSBfLmtleUJ5KGJlYXV0aWZpZXIubGFuZ3VhZ2VzLmxhbmd1YWdlcywgJ25hbWUnKVxuYmVhdXRpZmllck9wdGlvbnMgPSB7fVxuZm9yIGxvLCBvcHRpb25Hcm91cCBvZiBsYW5ndWFnZU9wdGlvbnNcbiAgZm9yIG9wdGlvbk5hbWUsIG9wdGlvbkRlZiBvZiBvcHRpb25Hcm91cC5wcm9wZXJ0aWVzXG4gICAgYmVhdXRpZmllcnMgPSBvcHRpb25EZWYuYmVhdXRpZmllcnMgPyBbXVxuICAgIGZvciBiZWF1dGlmaWVyTmFtZSBpbiBiZWF1dGlmaWVyc1xuICAgICAgYmVhdXRpZmllck9wdGlvbnNbYmVhdXRpZmllck5hbWVdID89IHt9XG4gICAgICBiZWF1dGlmaWVyT3B0aW9uc1tiZWF1dGlmaWVyTmFtZV1bb3B0aW9uTmFtZV0gPSBvcHRpb25EZWZcblxuY29uc29sZS5sb2coJ0xvYWRpbmcgb3B0aW9ucyB0ZW1wbGF0ZS4uLicpXG5yZWFkbWVUZW1wbGF0ZVBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vUkVBRE1FLXRlbXBsYXRlLm1kJylcbnJlYWRtZVBhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vUkVBRE1FLm1kJylcbm9wdGlvbnNUZW1wbGF0ZVBhdGggPSBfX2Rpcm5hbWUgKyAnL29wdGlvbnMtdGVtcGxhdGUubWQnXG5vcHRpb25UZW1wbGF0ZVBhdGggPSBfX2Rpcm5hbWUgKyAnL29wdGlvbi10ZW1wbGF0ZS5tZCdcbm9wdGlvbkdyb3VwVGVtcGxhdGVQYXRoID0gX19kaXJuYW1lICsgJy9vcHRpb24tZ3JvdXAtdGVtcGxhdGUubWQnXG5vcHRpb25zUGF0aCA9IF9fZGlybmFtZSArICcvb3B0aW9ucy5tZCdcblxub3B0aW9uc1RlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKG9wdGlvbnNUZW1wbGF0ZVBhdGgpLnRvU3RyaW5nKClcbm9wdGlvbkdyb3VwVGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmMob3B0aW9uR3JvdXBUZW1wbGF0ZVBhdGgpLnRvU3RyaW5nKClcbm9wdGlvblRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKG9wdGlvblRlbXBsYXRlUGF0aCkudG9TdHJpbmcoKVxucmVhZG1lVGVtcGxhdGUgPSBmcy5yZWFkRmlsZVN5bmMocmVhZG1lVGVtcGxhdGVQYXRoKS50b1N0cmluZygpXG5cbmNvbnNvbGUubG9nKCdCdWlsZGluZyBkb2N1bWVudGF0aW9uIGZyb20gdGVtcGxhdGUgYW5kIG9wdGlvbnMuLi4nKVxuSGFuZGxlYmFycy5yZWdpc3RlclBhcnRpYWwoJ29wdGlvbicsIG9wdGlvblRlbXBsYXRlKVxuSGFuZGxlYmFycy5yZWdpc3RlclBhcnRpYWwoJ29wdGlvbi1ncm91cCcsIG9wdGlvbkdyb3VwVGVtcGxhdGUpXG50ZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShvcHRpb25zVGVtcGxhdGUpXG5yZWFkbWVUZW1wbGF0ZSA9IEhhbmRsZWJhcnMuY29tcGlsZShyZWFkbWVUZW1wbGF0ZSlcblxubGlua2lmeVRpdGxlID0gKHRpdGxlKSAtPlxuICB0aXRsZSA9IHRpdGxlLnRvTG93ZXJDYXNlKClcbiAgcCA9IHRpdGxlLnNwbGl0KC9bXFxzLCsjOyxcXC8/OkAmPSskXSsvKSAjIHNwbGl0IGludG8gcGFydHNcbiAgc2VwID0gXCItXCJcbiAgcC5qb2luKHNlcClcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbGlua2lmeScsICh0aXRsZSwgb3B0aW9ucykgLT5cbiAgcmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcoXG4gICAgXCJbI3tvcHRpb25zLmZuKHRoaXMpfV0oXFwjI3tsaW5raWZ5VGl0bGUodGl0bGUpfSlcIlxuICApXG4pXG5cbmV4YW1wbGVDb25maWcgPSAob3B0aW9uKSAtPlxuICAjIGNvbnNvbGUubG9nKG9wdGlvbilcbiAgdCA9IG9wdGlvbi50eXBlXG4gIGQgPSBzd2l0Y2hcbiAgICB3aGVuIG9wdGlvbi5kZWZhdWx0PyB0aGVuIG9wdGlvbi5kZWZhdWx0XG4gICAgd2hlbiB0IGlzIFwic3RyaW5nXCIgdGhlbiBcIlwiXG4gICAgd2hlbiB0IGlzIFwiaW50ZWdlclwiIHRoZW4gMFxuICAgIHdoZW4gdCBpcyBcImJvb2xlYW5cIiB0aGVuIGZhbHNlXG4gICAgZWxzZSBudWxsXG5cbiAganNvbiA9IHt9XG4gIG5hbWVzcGFjZSA9IG9wdGlvbi5sYW5ndWFnZS5uYW1lc3BhY2VcbiAgayA9IG9wdGlvbi5rZXlcbiAgYyA9IHt9XG4gIGNba10gPSBkXG4gIGpzb25bbmFtZXNwYWNlXSA9IGNcbiAgcmV0dXJuIFwiXCJcImBgYGpzb25cbiAgI3tKU09OLnN0cmluZ2lmeShqc29uLCB1bmRlZmluZWQsIDQpfVxuICBgYGBcIlwiXCJcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignZXhhbXBsZS1jb25maWcnLCAoa2V5LCBvcHRpb24sIG9wdGlvbnMpIC0+XG4gIHJlc3VsdHMgPSBleGFtcGxlQ29uZmlnKGtleSwgb3B0aW9uKVxuICAjIGNvbnNvbGUubG9nKHJlc3VsdHMpXG4gIHJldHVybiBuZXcgSGFuZGxlYmFycy5TYWZlU3RyaW5nKHJlc3VsdHMpXG4pXG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2xhbmd1YWdlLWJlYXV0aWZpZXJzLXN1cHBvcnQnLCAobGFuZ3VhZ2VPcHRpb25zLCBvcHRpb25zKSAtPlxuXG4gIHJvd3MgPSBfLm1hcChsYW5ndWFnZU9wdGlvbnMsICh2YWwsIGspIC0+XG4gICAgbmFtZSA9IHZhbC50aXRsZVxuICAgIGRlZmF1bHRCZWF1dGlmaWVyID0gXy5nZXQodmFsLCBcInByb3BlcnRpZXMuZGVmYXVsdF9iZWF1dGlmaWVyLmRlZmF1bHRcIilcbiAgICBiZWF1dGlmaWVycyA9IF8ubWFwKHZhbC5iZWF1dGlmaWVycywgKGIpIC0+XG4gICAgICBiZWF1dGlmaWVyID0gYmVhdXRpZmllcnNNYXBbYl1cbiAgICAgIGlzRGVmYXVsdCA9IGIgaXMgZGVmYXVsdEJlYXV0aWZpZXJcbiAgICAgIGlmIGJlYXV0aWZpZXIubGlua1xuICAgICAgICByID0gXCJbYCN7Yn1gXSgje2JlYXV0aWZpZXIubGlua30pXCJcbiAgICAgIGVsc2VcbiAgICAgICAgciA9IFwiYCN7Yn1gXCJcbiAgICAgIGlmIGlzRGVmYXVsdFxuICAgICAgICByICs9IFwiIChEZWZhdWx0KVwiXG4gICAgICByZXR1cm4gclxuICAgIClcbiAgICBncmFtbWFycyA9IF8ubWFwKHZhbC5ncmFtbWFycywgKGIpIC0+IFwiYCN7Yn1gXCIpXG4gICAgZXh0ZW5zaW9ucyA9IF8ubWFwKHZhbC5leHRlbnNpb25zLCAoYikgLT4gXCJgLiN7Yn1gXCIpXG5cbiAgICByZXR1cm4gXCJ8ICN7bmFtZX0gfCAje2dyYW1tYXJzLmpvaW4oJywgJyl9IHwje2V4dGVuc2lvbnMuam9pbignLCAnKX0gfCAje2JlYXV0aWZpZXJzLmpvaW4oJywgJyl9IHxcIlxuICApXG4gIHJlc3VsdHMgPSBcIlwiXCJcbiAgfCBMYW5ndWFnZSB8IEdyYW1tYXJzIHwgRmlsZSBFeHRlbnNpb25zIHwgU3VwcG9ydGVkIEJlYXV0aWZpZXJzIHxcbiAgfCAtLS0gfCAtLS0gfCAtLS0gfCAtLS0tIHxcbiAgI3tyb3dzLmpvaW4oJ1xcbicpfVxuICBcIlwiXCJcbiAgcmV0dXJuIG5ldyBIYW5kbGViYXJzLlNhZmVTdHJpbmcocmVzdWx0cylcbilcblxuSGFuZGxlYmFycy5yZWdpc3RlckhlbHBlcignbGFuZ3VhZ2Utb3B0aW9ucy1zdXBwb3J0JywgKGxhbmd1YWdlT3B0aW9ucywgb3B0aW9ucykgLT5cblxuICAjIyNcbiAgfCBPcHRpb24gfCBQcmV0dHlEaWZmIHwgSlMtQmVhdXRpZnkgfFxuICB8IC0tLSB8IC0tLSB8IC0tLSB8XG4gIHwgYGJyYWNlX3N0eWxlYCB8ID8gfCA/IHxcbiAgfCBgYnJlYWtfY2hhaW5lZF9tZXRob2RzYCB8ID8gfCA/IHxcbiAgfCBgZW5kX3dpdGhfY29tbWFgIHwgPyB8ID8gfFxuICB8IGBlbmRfd2l0aF9uZXdsaW5lYCB8ID8gfCA/IHxcbiAgfCBgZXZhbF9jb2RlYCB8ID8gfCA/IHxcbiAgfCBgaW5kZW50X3NpemVgIHwgOndoaXRlX2NoZWNrX21hcms6IHwgOndoaXRlX2NoZWNrX21hcms6IHxcbiAgfCBgaW5kZW50X2NoYXJgIHwgOndoaXRlX2NoZWNrX21hcms6IHwgOndoaXRlX2NoZWNrX21hcms6IHxcbiAgIyMjXG5cbiAgcm93cyA9IFtdXG4gIGJlYXV0aWZpZXJzID0gbGFuZ3VhZ2VPcHRpb25zLmJlYXV0aWZpZXJzLnNvcnQoKVxuICBoZWFkZXJzID0gWydPcHRpb24nXS5jb25jYXQoYmVhdXRpZmllcnMpXG4gIHJvd3MucHVzaChoZWFkZXJzKVxuICByb3dzLnB1c2goXy5tYXAoaGVhZGVycywgKCkgLT4gJy0tLScpKVxuICAjIGNvbnNvbGUubG9nKGxhbmd1YWdlT3B0aW9ucylcbiAgXy5lYWNoKE9iamVjdC5rZXlzKGxhbmd1YWdlT3B0aW9ucy5wcm9wZXJ0aWVzKSwgKG9wKSAtPlxuICAgIGZpZWxkID0gbGFuZ3VhZ2VPcHRpb25zLnByb3BlcnRpZXNbb3BdXG4gICAgc3VwcG9ydCA9IF8ubWFwKGJlYXV0aWZpZXJzLCAoYikgLT5cbiAgICAgIGlmIChfLmluY2x1ZGVzKGZpZWxkLmJlYXV0aWZpZXJzLCBiKSBvciBfLmluY2x1ZGVzKFtcImRpc2FibGVkXCIsIFwiZGVmYXVsdF9iZWF1dGlmaWVyXCIsIFwiYmVhdXRpZnlfb25fc2F2ZVwiXSwgb3ApKVxuICAgICAgICByZXR1cm4gJzp3aGl0ZV9jaGVja19tYXJrOidcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICc6eDonXG4gICAgKVxuICAgIHJvd3MucHVzaChbXCJgI3tvcH1gXCJdLmNvbmNhdChzdXBwb3J0KSlcbiAgKVxuXG4gIHJlc3VsdHMgPSBfLm1hcChyb3dzLCAocikgLT4gXCJ8ICN7ci5qb2luKCcgfCAnKX0gfFwiKS5qb2luKCdcXG4nKVxuICByZXR1cm4gbmV3IEhhbmRsZWJhcnMuU2FmZVN0cmluZyhyZXN1bHRzKVxuKVxuXG5cbkhhbmRsZWJhcnMucmVnaXN0ZXJIZWxwZXIoJ2JlYXV0aWZpZXJzLWluZm8nLCAoYmVhdXRpZmllcnMsIG9wdGlvbnMpIC0+XG5cbiAgIyMjXG4gIHwgQmVhdXRpZmllciB8IElzIFByZS1JbnN0YWxsZWQ/IHwgSW5zdGFsbGF0aW9uIEluc3RydWN0aW9ucyB8XG4gIHwgLS0tIHwgLS0tLSB8XG4gIHwgUHJldHR5IERpZmYgfCA6d2hpdGVfY2hlY2tfbWFyazogfCBOL0EgfFxuICB8IEF1dG9QRVA4IHwgOng6IHwgTElOSyB8XG4gICMjI1xuXG4gIHJvd3MgPSBfLm1hcChiZWF1dGlmaWVycywgKGJlYXV0aWZpZXIsIGspIC0+XG4gICAgbmFtZSA9IGJlYXV0aWZpZXIubmFtZVxuICAgIGlzUHJlSW5zdGFsbGVkID0gYmVhdXRpZmllci5pc1ByZUluc3RhbGxlZFxuICAgIGxpbmsgPSBiZWF1dGlmaWVyLmxpbmtcbiAgICBpbnN0YWxsYXRpb25JbnN0cnVjdGlvbnMgPSBpZiBpc1ByZUluc3RhbGxlZCB0aGVuIFwiTm90aGluZyFcIiBlbHNlIFwiR28gdG8gI3tsaW5rfSBhbmQgZm9sbG93IHRoZSBpbnN0cnVjdGlvbnMuXCJcbiAgICByZXR1cm4gXCJ8ICN7bmFtZX0gfCAje2lmIGlzUHJlSW5zdGFsbGVkIHRoZW4gJzp3aGl0ZV9jaGVja19tYXJrOicgZWxzZSAnOng6J30gfCAje2luc3RhbGxhdGlvbkluc3RydWN0aW9uc30gfFwiXG4gIClcbiAgcmVzdWx0cyA9IFwiXCJcIlxuICB8IEJlYXV0aWZpZXIgfCBJcyBQcmUtSW5zdGFsbGVkPyB8IEluc3RhbGxhdGlvbiBJbnN0cnVjdGlvbnMgfFxuICB8IC0tLSB8IC0tLSB8IC0tLSB8XG4gICN7cm93cy5qb2luKCdcXG4nKX1cbiAgXCJcIlwiXG4gIHJldHVybiBuZXcgSGFuZGxlYmFycy5TYWZlU3RyaW5nKHJlc3VsdHMpXG4pXG5cbnNvcnRLZXlzQnkgPSAob2JqLCBjb21wYXJhdG9yKSAtPlxuICBrZXlzID0gXy5zb3J0QnkoXy5rZXlzKG9iaiksIChrZXkpIC0+XG4gICAgcmV0dXJuIGlmIGNvbXBhcmF0b3IgdGhlbiBjb21wYXJhdG9yKG9ialtrZXldLCBrZXkpIGVsc2Uga2V5XG4gIClcbiAgcmV0dXJuIF8uemlwT2JqZWN0KGtleXMsIF8ubWFwKGtleXMsIChrZXkpIC0+XG4gICAgcmV0dXJuIG9ialtrZXldXG4gICkpXG5cbnNvcnRTZXR0aW5ncyA9IChzZXR0aW5ncykgLT5cbiAgIyBUT0RPOiBQcm9jZXNzIG9iamVjdCB0eXBlIG9wdGlvbnNcbiAgciA9IF8ubWFwVmFsdWVzKHNldHRpbmdzLCAob3ApIC0+XG4gICAgaWYgb3AudHlwZSBpcyBcIm9iamVjdFwiIGFuZCBvcC5wcm9wZXJ0aWVzXG4gICAgICBvcC5wcm9wZXJ0aWVzID0gc29ydFNldHRpbmdzKG9wLnByb3BlcnRpZXMpXG4gICAgcmV0dXJuIG9wXG4gIClcbiAgIyBQcm9jZXNzIHRoZXNlIHNldHRpbmdzXG4gIHIgPSBzb3J0S2V5c0J5KHNvcnRLZXlzQnkociksIChvcCkgLT4gb3Aub3JkZXIpXG4gICMgciA9IF8uY2hhaW4ocikuc29ydEJ5KChvcCkgLT4gb3Aua2V5KS5zb3J0QnkoKG9wKSAtPiBzZXR0aW5nc1tvcC5rZXldPy5vcmRlcikudmFsdWUoKVxuICAjIGNvbnNvbGUubG9nKCdzb3J0Jywgc2V0dGluZ3MsIHIpXG4gIHJldHVybiByXG5cbmNvbnRleHQgPSB7XG4gIHBhY2thZ2U6IHBrZyxcbiAgcGFja2FnZU9wdGlvbnM6IHNvcnRTZXR0aW5ncyhwYWNrYWdlT3B0aW9ucylcbiAgbGFuZ3VhZ2VPcHRpb25zOiBzb3J0U2V0dGluZ3MobGFuZ3VhZ2VPcHRpb25zKVxuICBiZWF1dGlmaWVyT3B0aW9uczogc29ydFNldHRpbmdzKGJlYXV0aWZpZXJPcHRpb25zKVxuICBiZWF1dGlmaWVyczogXy5zb3J0QnkoYmVhdXRpZmllci5iZWF1dGlmaWVycywgKGJlYXV0aWZpZXIpIC0+IGJlYXV0aWZpZXIubmFtZS50b0xvd2VyQ2FzZSgpKVxufVxucmVzdWx0ID0gdGVtcGxhdGUoY29udGV4dClcbnJlYWRtZVJlc3VsdCA9IHJlYWRtZVRlbXBsYXRlKGNvbnRleHQpXG5cbmNvbnNvbGUubG9nKCdXcml0aW5nIGRvY3VtZW50YXRpb24gdG8gZmlsZS4uLicpXG5mcy53cml0ZUZpbGVTeW5jKG9wdGlvbnNQYXRoLCByZXN1bHQpXG5mcy53cml0ZUZpbGVTeW5jKHJlYWRtZVBhdGgsIHJlYWRtZVJlc3VsdClcbiMgZnMud3JpdGVGaWxlU3luYyhfX2Rpcm5hbWUrJy9jb250ZXh0Lmpzb24nLCBKU09OLnN0cmluZ2lmeShjb250ZXh0LCB1bmRlZmluZWQsIDIpKVxuXG5jb25zb2xlLmxvZygnVXBkYXRpbmcgcGFja2FnZS5qc29uJylcbiMgQWRkIExhbmd1YWdlIGtleXdvcmRzXG5sYW5ndWFnZU5hbWVzID0gXy5tYXAoT2JqZWN0LmtleXMobGFuZ3VhZ2VzTWFwKSwgKGEpLT5hLnRvTG93ZXJDYXNlKCkpXG5cbiMgQWRkIEJlYXV0aWZpZXIga2V5d29yZHNcbmJlYXV0aWZpZXJOYW1lcyA9IF8ubWFwKE9iamVjdC5rZXlzKGJlYXV0aWZpZXJzTWFwKSwgKGEpLT5hLnRvTG93ZXJDYXNlKCkpXG5rZXl3b3JkcyA9IF8udW5pb24ocGtnLmtleXdvcmRzLCBsYW5ndWFnZU5hbWVzLCBiZWF1dGlmaWVyTmFtZXMpXG5wa2cua2V5d29yZHMgPSBrZXl3b3Jkc1xuXG4jIEFkZCBMYW5ndWFnZS1zcGVjaWZpYyBiZWF1dGlmeSBjb21tYW5kc1xuYmVhdXRpZnlMYW5ndWFnZUNvbW1hbmRzID0gXy5tYXAobGFuZ3VhZ2VOYW1lcywgKGxhbmd1YWdlTmFtZSkgLT4gXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWxhbmd1YWdlLSN7bGFuZ3VhZ2VOYW1lfVwiKVxucGtnLmFjdGl2YXRpb25Db21tYW5kc1tcImF0b20td29ya3NwYWNlXCJdID0gXy51bmlvbihwa2cuYWN0aXZhdGlvbkNvbW1hbmRzW1wiYXRvbS13b3Jrc3BhY2VcIl0sIGJlYXV0aWZ5TGFuZ3VhZ2VDb21tYW5kcylcblxuZnMud3JpdGVGaWxlU3luYyhwYXRoLnJlc29sdmUoX19kaXJuYW1lLCcuLi9wYWNrYWdlLmpzb24nKSwgSlNPTi5zdHJpbmdpZnkocGtnLCB1bmRlZmluZWQsIDIpKVxuXG5jb25zb2xlLmxvZygnRG9uZS4nKVxuIl19
