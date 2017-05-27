(function() {
  var Beautifiers, JsDiff, beautifier, fs, isWindows, path;

  Beautifiers = require("../src/beautifiers");

  beautifier = new Beautifiers();

  fs = require("fs");

  path = require("path");

  JsDiff = require('diff');

  isWindows = process.platform === 'win32' || process.env.OSTYPE === 'cygwin' || process.env.OSTYPE === 'msys';

  describe("BeautifyLanguages", function() {
    var allLanguages, config, configs, dependentPackages, fn, i, j, lang, len, len1, optionsDir, results;
    optionsDir = path.resolve(__dirname, "../examples");
    allLanguages = ["c", "clojure", "coffee-script", "css", "d", "html", "java", "javascript", "json", "less", "mustache", "objective-c", "perl", "php", "python", "ruby", "sass", "sql", "svg", "xml", "csharp", "gfm", "marko", "go", "html-swig", "lua"];
    dependentPackages = ['autocomplete-plus'];
    fn = function(lang) {
      return dependentPackages.push("language-" + lang);
    };
    for (i = 0, len = allLanguages.length; i < len; i++) {
      lang = allLanguages[i];
      fn(lang);
    }
    beforeEach(function() {
      var fn1, j, len1, packageName;
      fn1 = function(packageName) {
        return waitsForPromise(function() {
          return atom.packages.activatePackage(packageName);
        });
      };
      for (j = 0, len1 = dependentPackages.length; j < len1; j++) {
        packageName = dependentPackages[j];
        fn1(packageName);
      }
      return waitsForPromise(function() {
        var activationPromise, pack;
        activationPromise = atom.packages.activatePackage('atom-beautify');
        pack = atom.packages.getLoadedPackage("atom-beautify");
        pack.activateNow();
        if (isWindows) {
          atom.config.set('atom-beautify._loggerLevel', 'verbose');
        }
        return activationPromise;
      });
    });

    /*
    Directory structure:
     - examples
       - config1
         - lang1
           - original
             - 1 - test.ext
           - expected
             - 1 - test.ext
         - lang2
       - config2
     */
    configs = fs.readdirSync(optionsDir);
    results = [];
    for (j = 0, len1 = configs.length; j < len1; j++) {
      config = configs[j];
      results.push((function(config) {
        var langsDir, optionStats;
        langsDir = path.resolve(optionsDir, config);
        optionStats = fs.lstatSync(langsDir);
        if (optionStats.isDirectory()) {
          return describe("when using configuration '" + config + "'", function() {
            var k, langNames, len2, results1;
            langNames = fs.readdirSync(langsDir);
            results1 = [];
            for (k = 0, len2 = langNames.length; k < len2; k++) {
              lang = langNames[k];
              if (isWindows && lang === 'ocaml') {
                continue;
              }
              results1.push((function(lang) {
                var expectedDir, langStats, originalDir, testsDir;
                testsDir = path.resolve(langsDir, lang);
                langStats = fs.lstatSync(testsDir);
                if (langStats.isDirectory()) {
                  originalDir = path.resolve(testsDir, "original");
                  if (!fs.existsSync(originalDir)) {
                    console.warn("Directory for test originals/inputs not found." + (" Making it at " + originalDir + "."));
                    fs.mkdirSync(originalDir);
                  }
                  expectedDir = path.resolve(testsDir, "expected");
                  if (!fs.existsSync(expectedDir)) {
                    console.warn("Directory for test expected/results not found." + ("Making it at " + expectedDir + "."));
                    fs.mkdirSync(expectedDir);
                  }
                  return describe("when beautifying language '" + lang + "'", function() {
                    var l, len3, results2, testFileName, testNames;
                    testNames = fs.readdirSync(originalDir);
                    results2 = [];
                    for (l = 0, len3 = testNames.length; l < len3; l++) {
                      testFileName = testNames[l];
                      results2.push((function(testFileName) {
                        var ext, testName;
                        ext = path.extname(testFileName);
                        testName = path.basename(testFileName, ext);
                        if (testFileName[0] === '_') {
                          return;
                        }
                        return it(testName + " " + testFileName, function() {
                          var allOptions, beautifyCompleted, completionFun, expectedContents, expectedTestPath, grammar, grammarName, language, originalContents, originalTestPath, ref, ref1;
                          originalTestPath = path.resolve(originalDir, testFileName);
                          expectedTestPath = path.resolve(expectedDir, testFileName);
                          originalContents = (ref = fs.readFileSync(originalTestPath)) != null ? ref.toString() : void 0;
                          if (!fs.existsSync(expectedTestPath)) {
                            throw new Error(("No matching expected test result found for '" + testName + "' ") + ("at '" + expectedTestPath + "'."));
                          }
                          expectedContents = (ref1 = fs.readFileSync(expectedTestPath)) != null ? ref1.toString() : void 0;
                          grammar = atom.grammars.selectGrammar(originalTestPath, originalContents);
                          grammarName = grammar.name;
                          allOptions = beautifier.getOptionsForPath(originalTestPath);
                          language = beautifier.getLanguage(grammarName, testFileName);
                          beautifyCompleted = false;
                          completionFun = function(text) {
                            var diff, e, fileName, newHeader, newStr, oldHeader, oldStr, opts, selectedBeautifier;
                            try {
                              expect(text instanceof Error).not.toEqual(true, text);
                              if (text instanceof Error) {
                                return beautifyCompleted = true;
                              }
                              expect(text).not.toEqual(null, "Language or Beautifier not found");
                              if (text === null) {
                                return beautifyCompleted = true;
                              }
                              expect(typeof text).toEqual("string", "Text: " + text);
                              if (typeof text !== "string") {
                                return beautifyCompleted = true;
                              }
                              text = text.replace(/(?:\r\n|\r|\n)/g, '⏎\n');
                              expectedContents = expectedContents.replace(/(?:\r\n|\r|\n)/g, '⏎\n');
                              text = text.replace(/(?:\t)/g, '↹');
                              expectedContents = expectedContents.replace(/(?:\t)/g, '↹');
                              text = text.replace(/(?:\ )/g, '␣');
                              expectedContents = expectedContents.replace(/(?:\ )/g, '␣');
                              if (text !== expectedContents) {
                                fileName = expectedTestPath;
                                oldStr = text;
                                newStr = expectedContents;
                                oldHeader = "beautified";
                                newHeader = "expected";
                                diff = JsDiff.createPatch(fileName, oldStr, newStr, oldHeader, newHeader);
                                opts = beautifier.getOptionsForLanguage(allOptions, language);
                                selectedBeautifier = beautifier.getBeautifierForLanguage(language);
                                if (selectedBeautifier != null) {
                                  opts = beautifier.transformOptions(selectedBeautifier, language.name, opts);
                                }
                                expect(text).toEqual(expectedContents, "Beautifier '" + (selectedBeautifier != null ? selectedBeautifier.name : void 0) + "' output does not match expected output:\n" + diff + "\n\nWith options:\n" + (JSON.stringify(opts, void 0, 4)));
                              }
                              return beautifyCompleted = true;
                            } catch (error) {
                              e = error;
                              console.error(e);
                              return beautifyCompleted = e;
                            }
                          };
                          runs(function() {
                            var e;
                            try {
                              return beautifier.beautify(originalContents, allOptions, grammarName, testFileName).then(completionFun)["catch"](completionFun);
                            } catch (error) {
                              e = error;
                              return beautifyCompleted = e;
                            }
                          });
                          return waitsFor(function() {
                            if (beautifyCompleted instanceof Error) {
                              throw beautifyCompleted;
                            } else {
                              return beautifyCompleted;
                            }
                          }, "Waiting for beautification to complete", 60000);
                        });
                      })(testFileName));
                    }
                    return results2;
                  });
                }
              })(lang));
            }
            return results1;
          });
        }
      })(config));
    }
    return results;
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2F0b20tYmVhdXRpZnkvc3BlYy9iZWF1dGlmeS1sYW5ndWFnZXMtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsb0JBQVI7O0VBQ2QsVUFBQSxHQUFpQixJQUFBLFdBQUEsQ0FBQTs7RUFDakIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLE1BQVI7O0VBUVQsU0FBQSxHQUFZLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXBCLElBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFaLEtBQXNCLFFBRFosSUFFVixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQVosS0FBc0I7O0VBRXhCLFFBQUEsQ0FBUyxtQkFBVCxFQUE4QixTQUFBO0FBRTVCLFFBQUE7SUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFiLEVBQXdCLGFBQXhCO0lBR2IsWUFBQSxHQUFlLENBQ2IsR0FEYSxFQUNSLFNBRFEsRUFDRyxlQURILEVBQ29CLEtBRHBCLEVBQzJCLEdBRDNCLEVBQ2dDLE1BRGhDLEVBRWIsTUFGYSxFQUVMLFlBRkssRUFFUyxNQUZULEVBRWlCLE1BRmpCLEVBR2IsVUFIYSxFQUdELGFBSEMsRUFHYyxNQUhkLEVBR3NCLEtBSHRCLEVBSWIsUUFKYSxFQUlILE1BSkcsRUFJSyxNQUpMLEVBSWEsS0FKYixFQUlvQixLQUpwQixFQUtiLEtBTGEsRUFLTixRQUxNLEVBS0ksS0FMSixFQUtXLE9BTFgsRUFNYixJQU5hLEVBTVAsV0FOTyxFQU1NLEtBTk47SUFTZixpQkFBQSxHQUFvQixDQUNsQixtQkFEa0I7U0FPZixTQUFDLElBQUQ7YUFDRCxpQkFBaUIsQ0FBQyxJQUFs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QUFBLENBQU8sSUFBUCxDQUFZLENBQUMsT0FBYixDQUFxQixnQkFBckIsRUFDRSxjQUFBLEdBQWMsOEJBQUMsa0JBQWtCLENBQUUsYUFBckIsQ0FBZCxHQUF3Qyw0Q0FBeEMsR0FDVyxJQURYLEdBQ2dCLHFCQURoQixHQUdDLENBQUMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFmLEVBQXFCLE1BQXJCLEVBQWdDLENBQWhDLENBQUQsQ0FKSCxFQWhCRjs7cUNBc0JBLGlCQUFBLEdBQW9CLEtBakR0Qjs2QkFBQSxhQUFBOzhCQWtETTs4QkFDSixPQUFPLENBQUMsS0FBUixDQUFjLENBQWQ7cUNBQ0EsaUJBQUEsR0FBb0IsRUFwRHRCOzswQkFEYzswQkF1RGhCLElBQUEsQ0FBSyxTQUFBO0FBQ0gsZ0NBQUE7QUFBQTtxQ0FDRSxVQUFVLENBQUMsUUFBWCxDQUFvQixnQkFBcEIsRUFBc0MsVUFBdEMsRUFBa0QsV0FBbEQsRUFBK0QsWUFBL0QsQ0FDQSxDQUFDLElBREQsQ0FDTSxhQUROLENBRUEsRUFBQyxLQUFELEVBRkEsQ0FFTyxhQUZQLEVBREY7NkJBQUEsYUFBQTs4QkFJTTtxQ0FDSixpQkFBQSxHQUFvQixFQUx0Qjs7MEJBREcsQ0FBTDtpQ0FRQSxRQUFBLENBQVMsU0FBQTs0QkFDUCxJQUFHLGlCQUFBLFlBQTZCLEtBQWhDO0FBQ0Usb0NBQU0sa0JBRFI7NkJBQUEsTUFBQTtBQUdFLHFDQUFPLGtCQUhUOzswQkFETyxDQUFULEVBS0Usd0NBTEYsRUFLNEMsS0FMNUM7d0JBM0ZnQyxDQUFsQztzQkFSQyxDQUFBLENBQUgsQ0FBSSxZQUFKO0FBREY7O2tCQUo4QyxDQUFoRCxFQWZGOztjQUxDLENBQUEsQ0FBSCxDQUFJLElBQUo7QUFORjs7VUFIK0MsQ0FBakQsRUFGRjs7TUFMQyxDQUFBLENBQUgsQ0FBSSxNQUFKO0FBREY7O0VBbkU0QixDQUE5QjtBQWhCQSIsInNvdXJjZXNDb250ZW50IjpbIiMgQmVhdXRpZnkgPSByZXF1aXJlICcuLi9zcmMvYmVhdXRpZnknXG5CZWF1dGlmaWVycyA9IHJlcXVpcmUgXCIuLi9zcmMvYmVhdXRpZmllcnNcIlxuYmVhdXRpZmllciA9IG5ldyBCZWF1dGlmaWVycygpXG5mcyA9IHJlcXVpcmUgXCJmc1wiXG5wYXRoID0gcmVxdWlyZSBcInBhdGhcIlxuSnNEaWZmID0gcmVxdWlyZSgnZGlmZicpXG5cbiMgVXNlIHRoZSBjb21tYW5kIGB3aW5kb3c6cnVuLXBhY2thZ2Utc3BlY3NgIChjbWQtYWx0LWN0cmwtcCkgdG8gcnVuIHNwZWNzLlxuI1xuIyBUbyBydW4gYSBzcGVjaWZpYyBgaXRgIG9yIGBkZXNjcmliZWAgYmxvY2sgYWRkIGFuIGBmYCB0byB0aGUgZnJvbnQgKGUuZy4gYGZpdGBcbiMgb3IgYGZkZXNjcmliZWApLiBSZW1vdmUgdGhlIGBmYCB0byB1bmZvY3VzIHRoZSBibG9jay5cblxuIyBDaGVjayBpZiBXaW5kb3dzXG5pc1dpbmRvd3MgPSBwcm9jZXNzLnBsYXRmb3JtIGlzICd3aW4zMicgb3JcbiAgcHJvY2Vzcy5lbnYuT1NUWVBFIGlzICdjeWd3aW4nIG9yXG4gIHByb2Nlc3MuZW52Lk9TVFlQRSBpcyAnbXN5cydcblxuZGVzY3JpYmUgXCJCZWF1dGlmeUxhbmd1YWdlc1wiLCAtPlxuXG4gIG9wdGlvbnNEaXIgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL2V4YW1wbGVzXCIpXG5cbiAgIyBBY3RpdmF0ZSBhbGwgb2YgdGhlIGxhbmd1YWdlc1xuICBhbGxMYW5ndWFnZXMgPSBbXG4gICAgXCJjXCIsIFwiY2xvanVyZVwiLCBcImNvZmZlZS1zY3JpcHRcIiwgXCJjc3NcIiwgXCJkXCIsIFwiaHRtbFwiLFxuICAgIFwiamF2YVwiLCBcImphdmFzY3JpcHRcIiwgXCJqc29uXCIsIFwibGVzc1wiLFxuICAgIFwibXVzdGFjaGVcIiwgXCJvYmplY3RpdmUtY1wiLCBcInBlcmxcIiwgXCJwaHBcIixcbiAgICBcInB5dGhvblwiLCBcInJ1YnlcIiwgXCJzYXNzXCIsIFwic3FsXCIsIFwic3ZnXCIsXG4gICAgXCJ4bWxcIiwgXCJjc2hhcnBcIiwgXCJnZm1cIiwgXCJtYXJrb1wiLFxuICAgIFwiZ29cIiwgXCJodG1sLXN3aWdcIiwgXCJsdWFcIlxuICAgIF1cbiAgIyBBbGwgQXRvbSBwYWNrYWdlcyB0aGF0IEF0b20gQmVhdXRpZnkgaXMgZGVwZW5kZW50IG9uXG4gIGRlcGVuZGVudFBhY2thZ2VzID0gW1xuICAgICdhdXRvY29tcGxldGUtcGx1cydcbiAgICAjICdsaW50ZXInXG4gICAgIyAgICdhdG9tLXR5cGVzY3JpcHQnICMgaXQgbG9ncyB0b28gbXVjaC4uLlxuICBdXG4gICMgQWRkIGxhbmd1YWdlIHBhY2thZ2VzIHRvIGRlcGVuZGVudFBhY2thZ2VzXG4gIGZvciBsYW5nIGluIGFsbExhbmd1YWdlc1xuICAgIGRvIChsYW5nKSAtPlxuICAgICAgZGVwZW5kZW50UGFja2FnZXMucHVzaChcImxhbmd1YWdlLSN7bGFuZ31cIilcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgIyBJbnN0YWxsIGFsbCBvZiB0aGUgbGFuZ3VhZ2VzXG4gICAgZm9yIHBhY2thZ2VOYW1lIGluIGRlcGVuZGVudFBhY2thZ2VzXG4gICAgICBkbyAocGFja2FnZU5hbWUpIC0+XG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKHBhY2thZ2VOYW1lKVxuXG4gICAgIyBBY3RpdmF0ZSBwYWNrYWdlXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhY3RpdmF0aW9uUHJvbWlzZSA9IGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdhdG9tLWJlYXV0aWZ5JylcbiAgICAgICMgRm9yY2UgYWN0aXZhdGUgcGFja2FnZVxuICAgICAgcGFjayA9IGF0b20ucGFja2FnZXMuZ2V0TG9hZGVkUGFja2FnZShcImF0b20tYmVhdXRpZnlcIilcbiAgICAgIHBhY2suYWN0aXZhdGVOb3coKVxuICAgICAgIyBOZWVkIG1vcmUgZGVidWdnaW5nIG9uIFdpbmRvd3NcbiAgICAgIGlmIGlzV2luZG93c1xuICAgICAgICAjIENoYW5nZSBsb2dnZXIgbGV2ZWxcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdhdG9tLWJlYXV0aWZ5Ll9sb2dnZXJMZXZlbCcsICd2ZXJib3NlJylcbiAgICAgICMgUmV0dXJuIHByb21pc2VcbiAgICAgIHJldHVybiBhY3RpdmF0aW9uUHJvbWlzZVxuXG4gICAgIyBTZXQgVW5jcnVzdGlmeSBjb25maWcgcGF0aFxuICAgICMgdW5jcnVzdGlmeUNvbmZpZ1BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4uL2V4YW1wbGVzL25lc3RlZC1qc2JlYXV0aWZ5cmMvdW5jcnVzdGlmeS5jZmdcIilcbiAgICAjIHVuY3J1c3RpZnlMYW5ncyA9IFtcImFwZXhcIiwgXCJjXCIsIFwiY3BwXCIsIFwib2JqZWN0aXZlY1wiLCBcImNzXCIsIFwiZFwiLCBcImphdmFcIiwgXCJwYXduXCIsIFwidmFsYVwiXVxuICAgICMgZm9yIGxhbmcgaW4gdW5jcnVzdGlmeUxhbmdzXG4gICAgIyAgICAgZG8gKGxhbmcpIC0+XG4gICAgICAjIGF0b20uY29uZmlnLnNldChcImF0b20tYmVhdXRpZnkuI3tsYW5nfV9jb25maWdQYXRoXCIsIHVuY3J1c3RpZnlDb25maWdQYXRoKVxuICAgICAgIyBleHBlY3QoYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1iZWF1dGlmeS4je2xhbmd9X2NvbmZpZ1BhdGhcIikpLnRvRXF1YWwoXCJURVNUXCIpXG5cbiAgIyMjXG4gIERpcmVjdG9yeSBzdHJ1Y3R1cmU6XG4gICAtIGV4YW1wbGVzXG4gICAgIC0gY29uZmlnMVxuICAgICAgIC0gbGFuZzFcbiAgICAgICAgIC0gb3JpZ2luYWxcbiAgICAgICAgICAgLSAxIC0gdGVzdC5leHRcbiAgICAgICAgIC0gZXhwZWN0ZWRcbiAgICAgICAgICAgLSAxIC0gdGVzdC5leHRcbiAgICAgICAtIGxhbmcyXG4gICAgIC0gY29uZmlnMlxuICAjIyNcblxuICAjIEFsbCBDb25maWd1cmF0aW9uc1xuICBjb25maWdzID0gZnMucmVhZGRpclN5bmMob3B0aW9uc0RpcilcbiAgZm9yIGNvbmZpZyBpbiBjb25maWdzXG4gICAgZG8gKGNvbmZpZykgLT5cbiAgICAgICMgR2VuZXJhdGUgdGhlIHBhdGggdG8gd2hlcmUgYWxsIG9mIHRoZSBsYW5ndWFnZXMgYXJlXG4gICAgICBsYW5nc0RpciA9IHBhdGgucmVzb2x2ZShvcHRpb25zRGlyLCBjb25maWcpXG4gICAgICBvcHRpb25TdGF0cyA9IGZzLmxzdGF0U3luYyhsYW5nc0RpcilcbiAgICAgICMgQ29uZmlybSB0aGF0IHRoaXMgcGF0aCBpcyBhIGRpcmVjdG9yeVxuICAgICAgaWYgb3B0aW9uU3RhdHMuaXNEaXJlY3RvcnkoKVxuICAgICAgICAjIENyZWF0ZSB0ZXN0aW5nIGdyb3VwIGZvciBjb25maWd1cmF0aW9uXG4gICAgICAgIGRlc2NyaWJlIFwid2hlbiB1c2luZyBjb25maWd1cmF0aW9uICcje2NvbmZpZ30nXCIsIC0+XG4gICAgICAgICAgIyBBbGwgTGFuZ3VhZ2VzIGZvciBjb25maWd1cmF0aW9uXG4gICAgICAgICAgbGFuZ05hbWVzID0gZnMucmVhZGRpclN5bmMobGFuZ3NEaXIpXG4gICAgICAgICAgZm9yIGxhbmcgaW4gbGFuZ05hbWVzXG5cbiAgICAgICAgICAgICMgRklYTUU6IFNraXAgdGVzdGluZyBvY2FtbCBpbiBXaW5kb3dzXG4gICAgICAgICAgICBpZiBpc1dpbmRvd3MgJiYgbGFuZyA9PSAnb2NhbWwnXG4gICAgICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgICAgIGRvIChsYW5nKSAtPlxuICAgICAgICAgICAgICAjIEdlbmVyYXRlIHRoZSBwYXRoIHRvIHdoZXJlIGFsIG9mIHRoZSB0ZXN0cyBhcmVcbiAgICAgICAgICAgICAgdGVzdHNEaXIgPSBwYXRoLnJlc29sdmUobGFuZ3NEaXIsIGxhbmcpXG4gICAgICAgICAgICAgIGxhbmdTdGF0cyA9IGZzLmxzdGF0U3luYyh0ZXN0c0RpcilcbiAgICAgICAgICAgICAgIyBDb25maXJtIHRoYXQgdGhpcyBwYXRoIGlzIGEgZGlyZWN0b3J5XG4gICAgICAgICAgICAgIGlmIGxhbmdTdGF0cy5pc0RpcmVjdG9yeSgpXG4gICAgICAgICAgICAgICAgIyBPcmlnaW5hbFxuICAgICAgICAgICAgICAgIG9yaWdpbmFsRGlyID0gcGF0aC5yZXNvbHZlKHRlc3RzRGlyLCBcIm9yaWdpbmFsXCIpXG4gICAgICAgICAgICAgICAgaWYgbm90IGZzLmV4aXN0c1N5bmMob3JpZ2luYWxEaXIpXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJEaXJlY3RvcnkgZm9yIHRlc3Qgb3JpZ2luYWxzL2lucHV0cyBub3QgZm91bmQuXCIgK1xuICAgICAgICAgICAgICAgICAgICBcIiBNYWtpbmcgaXQgYXQgI3tvcmlnaW5hbERpcn0uXCIpXG4gICAgICAgICAgICAgICAgICBmcy5ta2RpclN5bmMob3JpZ2luYWxEaXIpXG4gICAgICAgICAgICAgICAgIyBFeHBlY3RlZFxuICAgICAgICAgICAgICAgIGV4cGVjdGVkRGlyID0gcGF0aC5yZXNvbHZlKHRlc3RzRGlyLCBcImV4cGVjdGVkXCIpXG4gICAgICAgICAgICAgICAgaWYgbm90IGZzLmV4aXN0c1N5bmMoZXhwZWN0ZWREaXIpXG4gICAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXCJEaXJlY3RvcnkgZm9yIHRlc3QgZXhwZWN0ZWQvcmVzdWx0cyBub3QgZm91bmQuXCIgK1xuICAgICAgICAgICAgICAgICAgICBcIk1ha2luZyBpdCBhdCAje2V4cGVjdGVkRGlyfS5cIilcbiAgICAgICAgICAgICAgICAgIGZzLm1rZGlyU3luYyhleHBlY3RlZERpcilcblxuICAgICAgICAgICAgICAgICMgTGFuZ3VhZ2UgZ3JvdXAgdGVzdHNcbiAgICAgICAgICAgICAgICBkZXNjcmliZSBcIndoZW4gYmVhdXRpZnlpbmcgbGFuZ3VhZ2UgJyN7bGFuZ30nXCIsIC0+XG5cbiAgICAgICAgICAgICAgICAgICMgQWxsIHRlc3RzIGZvciBsYW5ndWFnZVxuICAgICAgICAgICAgICAgICAgdGVzdE5hbWVzID0gZnMucmVhZGRpclN5bmMob3JpZ2luYWxEaXIpXG4gICAgICAgICAgICAgICAgICBmb3IgdGVzdEZpbGVOYW1lIGluIHRlc3ROYW1lc1xuICAgICAgICAgICAgICAgICAgICBkbyAodGVzdEZpbGVOYW1lKSAtPlxuICAgICAgICAgICAgICAgICAgICAgIGV4dCA9IHBhdGguZXh0bmFtZSh0ZXN0RmlsZU5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgdGVzdE5hbWUgPSBwYXRoLmJhc2VuYW1lKHRlc3RGaWxlTmFtZSwgZXh0KVxuICAgICAgICAgICAgICAgICAgICAgICMgSWYgcHJlZml4ZWQgd2l0aCB1bmRlcnNjb3JlIChfKSB0aGVuIHRoaXMgaXMgYSBoaWRkZW4gdGVzdFxuICAgICAgICAgICAgICAgICAgICAgIGlmIHRlc3RGaWxlTmFtZVswXSBpcyAnXydcbiAgICAgICAgICAgICAgICAgICAgICAgICMgRG8gbm90IHNob3cgdGhpcyB0ZXN0XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAjIENvbmZpcm0gdGhpcyBpcyBhIHRlc3RcbiAgICAgICAgICAgICAgICAgICAgICBpdCBcIiN7dGVzdE5hbWV9ICN7dGVzdEZpbGVOYW1lfVwiLCAtPlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEdlbmVyYXRlIHBhdGhzIHRvIHRlc3QgZmlsZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsVGVzdFBhdGggPSBwYXRoLnJlc29sdmUob3JpZ2luYWxEaXIsIHRlc3RGaWxlTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkVGVzdFBhdGggPSBwYXRoLnJlc29sdmUoZXhwZWN0ZWREaXIsIHRlc3RGaWxlTmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICMgR2V0IGNvbnRlbnRzIG9mIG9yaWdpbmFsIHRlc3QgZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgb3JpZ2luYWxDb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhvcmlnaW5hbFRlc3RQYXRoKT8udG9TdHJpbmcoKVxuICAgICAgICAgICAgICAgICAgICAgICAgIyBDaGVjayBpZiB0aGVyZSBpcyBhIG1hdGNoaW5nIGV4cGVjdGVkIHRlc3QgcmVzdXRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIG5vdCBmcy5leGlzdHNTeW5jKGV4cGVjdGVkVGVzdFBhdGgpXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIG1hdGNoaW5nIGV4cGVjdGVkIHRlc3QgcmVzdWx0IGZvdW5kIGZvciAnI3t0ZXN0TmFtZX0nIFwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImF0ICcje2V4cGVjdGVkVGVzdFBhdGh9Jy5cIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIyBlcnIgPSBmcy53cml0ZUZpbGVTeW5jKGV4cGVjdGVkVGVzdFBhdGgsIG9yaWdpbmFsQ29udGVudHMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICMgdGhyb3cgZXJyIGlmIGVyclxuICAgICAgICAgICAgICAgICAgICAgICAgIyBHZXQgY29udGVudHMgb2YgZXhwZWN0ZWQgdGVzdCBmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZENvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKGV4cGVjdGVkVGVzdFBhdGgpPy50b1N0cmluZygpXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGV4cGVjdChleHBlY3RlZENvbnRlbnRzKS5ub3QudG9FcXVhbCBvcmlnaW5hbENvbnRlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAjIGV4cGVjdChhdG9tLmdyYW1tYXJzLmdldEdyYW1tYXJzKCkpLnRvRXF1YWwgW11cbiAgICAgICAgICAgICAgICAgICAgICAgIGdyYW1tYXIgPSBhdG9tLmdyYW1tYXJzLnNlbGVjdEdyYW1tYXIob3JpZ2luYWxUZXN0UGF0aCwgb3JpZ2luYWxDb250ZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICMgZXhwZWN0KGdyYW1tYXIpLnRvRXF1YWwoXCJ0ZXN0XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICBncmFtbWFyTmFtZSA9IGdyYW1tYXIubmFtZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAjIEdldCB0aGUgb3B0aW9uc1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxsT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0ZvclBhdGgob3JpZ2luYWxUZXN0UGF0aClcblxuICAgICAgICAgICAgICAgICAgICAgICAgIyBHZXQgbGFuZ3VhZ2VcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlID0gYmVhdXRpZmllci5nZXRMYW5ndWFnZShncmFtbWFyTmFtZSwgdGVzdEZpbGVOYW1lKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBiZWF1dGlmeUNvbXBsZXRlZCA9IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0aW9uRnVuID0gKHRleHQpIC0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRyeVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdCh0ZXh0IGluc3RhbmNlb2YgRXJyb3IpLm5vdC50b0VxdWFsKHRydWUsIHRleHQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJlYXV0aWZ5Q29tcGxldGVkID0gdHJ1ZSBpZiB0ZXh0IGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIyAgIGxvZ2dlci52ZXJib3NlKGV4cGVjdGVkVGVzdFBhdGgsIHRleHQpIGlmIGV4dCBpcyBcIi5sZXNzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIyAgIGlmIHRleHQgaW5zdGFuY2VvZiBFcnJvclxuICAgICAgICAgICAgICAgICAgICAgICAgICAjICAgICByZXR1cm4gYmVhdXRpZnlDb21wbGV0ZWQgPSB0ZXh0ICMgdGV4dCA9PSBFcnJvclxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHRleHQpLm5vdC50b0VxdWFsKG51bGwsIFwiTGFuZ3VhZ2Ugb3IgQmVhdXRpZmllciBub3QgZm91bmRcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYmVhdXRpZnlDb21wbGV0ZWQgPSB0cnVlIGlmIHRleHQgaXMgbnVsbFxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHR5cGVvZiB0ZXh0KS50b0VxdWFsKFwic3RyaW5nXCIsIFwiVGV4dDogI3t0ZXh0fVwiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiZWF1dGlmeUNvbXBsZXRlZCA9IHRydWUgaWYgdHlwZW9mIHRleHQgaXNudCBcInN0cmluZ1wiXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFJlcGxhY2UgTmV3bGluZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8oPzpcXHJcXG58XFxyfFxcbikvZywgJ+KPjlxcbicpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWRDb250ZW50cyA9IGV4cGVjdGVkQ29udGVudHNcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/OlxcclxcbnxcXHJ8XFxuKS9nLCAn4o+OXFxuJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIFJlcGxhY2UgdGFic1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLyg/OlxcdCkvZywgJ+KGuScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWRDb250ZW50cyA9IGV4cGVjdGVkQ29udGVudHNcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/OlxcdCkvZywgJ+KGuScpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBSZXBsYWNlIHNwYWNlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoLyg/OlxcICkvZywgJ+KQoycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWRDb250ZW50cyA9IGV4cGVjdGVkQ29udGVudHNcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyg/OlxcICkvZywgJ+KQoycpXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAjIENoZWNrIGZvciBiZWF1dGlmaWNhdGlvbiBlcnJvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiB0ZXh0IGlzbnQgZXhwZWN0ZWRDb250ZW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBjb25zb2xlLndhcm4oYWxsT3B0aW9ucywgdGV4dCwgZXhwZWN0ZWRDb250ZW50cylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lID0gZXhwZWN0ZWRUZXN0UGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2xkU3RyPXRleHRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0cj1leHBlY3RlZENvbnRlbnRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbGRIZWFkZXI9XCJiZWF1dGlmaWVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0hlYWRlcj1cImV4cGVjdGVkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpZmYgPSBKc0RpZmYuY3JlYXRlUGF0Y2goZmlsZU5hbWUsIG9sZFN0ciwgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlcilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICMgR2V0IG9wdGlvbnNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdHMgPSBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JMYW5ndWFnZShhbGxPcHRpb25zLCBsYW5ndWFnZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkQmVhdXRpZmllciA9IGJlYXV0aWZpZXIuZ2V0QmVhdXRpZmllckZvckxhbmd1YWdlKGxhbmd1YWdlKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgc2VsZWN0ZWRCZWF1dGlmaWVyP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzID0gYmVhdXRpZmllci50cmFuc2Zvcm1PcHRpb25zKHNlbGVjdGVkQmVhdXRpZmllciwgbGFuZ3VhZ2UubmFtZSwgb3B0cylcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBTaG93IGVycm9yIG1lc3NhZ2Ugd2l0aCBkZWJ1ZyBpbmZvcm1hdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KHRleHQpLnRvRXF1YWwoZXhwZWN0ZWRDb250ZW50cywgXFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJCZWF1dGlmaWVyICcje3NlbGVjdGVkQmVhdXRpZmllcj8ubmFtZX0nIG91dHB1dCBkb2VzIG5vdCBtYXRjaCBleHBlY3RlZCBcXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvdXRwdXQ6XFxuI3tkaWZmfVxcblxcblxcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFdpdGggb3B0aW9uczpcXG5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAje0pTT04uc3RyaW5naWZ5KG9wdHMsIHVuZGVmaW5lZCwgNCl9XCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIyBBbGwgZG9uZSFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWF1dGlmeUNvbXBsZXRlZCA9IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWF1dGlmeUNvbXBsZXRlZCA9IGVcblxuICAgICAgICAgICAgICAgICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB0cnlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZWF1dGlmaWVyLmJlYXV0aWZ5KG9yaWdpbmFsQ29udGVudHMsIGFsbE9wdGlvbnMsIGdyYW1tYXJOYW1lLCB0ZXN0RmlsZU5hbWUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY29tcGxldGlvbkZ1bilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goY29tcGxldGlvbkZ1bilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2F0Y2ggZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlYXV0aWZ5Q29tcGxldGVkID0gZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB3YWl0c0ZvcigtPlxuICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBiZWF1dGlmeUNvbXBsZXRlZCBpbnN0YW5jZW9mIEVycm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgYmVhdXRpZnlDb21wbGV0ZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiZWF1dGlmeUNvbXBsZXRlZFxuICAgICAgICAgICAgICAgICAgICAgICAgLCBcIldhaXRpbmcgZm9yIGJlYXV0aWZpY2F0aW9uIHRvIGNvbXBsZXRlXCIsIDYwMDAwKVxuIl19
