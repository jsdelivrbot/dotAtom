(function() {
  var ReferenceProvider, XRegExp, bibtexParse, citeproc, fs, fuzzaldrin, titlecaps, yaml,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require("fs");

  bibtexParse = require("zotero-bibtex-parse");

  fuzzaldrin = require("fuzzaldrin");

  XRegExp = require('xregexp').XRegExp;

  titlecaps = require("./titlecaps");

  citeproc = require("./citeproc");

  yaml = require("yaml-js");

  module.exports = ReferenceProvider = (function() {
    atom.deserializers.add(ReferenceProvider);

    ReferenceProvider.version = 2;

    ReferenceProvider.deserialize = function(arg) {
      var data;
      data = arg.data;
      return new ReferenceProvider(data);
    };

    function ReferenceProvider(state) {
      this.prefixForCursor = bind(this.prefixForCursor, this);
      this.readReferenceFiles = bind(this.readReferenceFiles, this);
      this.buildWordListFromFiles = bind(this.buildWordListFromFiles, this);
      this.buildWordList = bind(this.buildWordList, this);
      var possibleWords, resultTemplate;
      if (state && Object.keys(state).length !== 0 && (state.bibtex != null)) {
        this.bibtex = state.bibtex;
        this.possibleWords = state.possibleWords;
      } else {
        this.buildWordListFromFiles(atom.config.get("autocomplete-bibtex.bibtex"));
      }
      if (this.bibtex.length === 0) {
        this.buildWordListFromFiles(atom.config.get("autocomplete-bibtex.bibtex"));
      }
      atom.config.onDidChange("autocomplete-bibtex.bibtex", (function(_this) {
        return function(bibtexFiles) {
          return _this.buildWordListFromFiles(bibtexFiles);
        };
      })(this));
      resultTemplate = atom.config.get("autocomplete-bibtex.resultTemplate");
      atom.config.observe("autocomplete-bibtex.resultTemplate", (function(_this) {
        return function(resultTemplate) {
          return _this.resultTemplate = resultTemplate;
        };
      })(this));
      possibleWords = this.possibleWords;
      this.provider = {
        selector: atom.config.get("autocomplete-bibtex.scope"),
        disableForSelector: atom.config.get("autocomplete-bibtex.ignoreScope"),
        compare: function(a, b) {
          if (a.score < b.score) {
            return -1;
          }
          if (a.score > b.score) {
            return 1;
          }
          return 0;
        },
        getSuggestions: function(arg) {
          var bufferPosition, editor, prefix;
          editor = arg.editor, bufferPosition = arg.bufferPosition;
          prefix = this.getPrefix(editor, bufferPosition);
          return new Promise(function(resolve) {
            var hit, hits, i, j, len, len1, normalizedPrefix, suggestions, word;
            if (prefix[0] === "@") {
              normalizedPrefix = prefix.normalize().replace(/^@/, '');
              suggestions = [];
              hits = fuzzaldrin.filter(possibleWords, normalizedPrefix, {
                key: 'author'
              });
              for (i = 0, len = hits.length; i < len; i++) {
                hit = hits[i];
                hit.score = fuzzaldrin.score(normalizedPrefix, hit.author);
              }
              hits.sort(this.compare);
              resultTemplate = atom.config.get("autocomplete-bibtex.resultTemplate");
              for (j = 0, len1 = hits.length; j < len1; j++) {
                word = hits[j];
                suggestions.push({
                  text: resultTemplate.replace("[key]", word.key),
                  displayText: word.label,
                  replacementPrefix: prefix,
                  leftLabel: word.key,
                  rightLabel: word.by,
                  className: word.type,
                  iconHTML: '<i class="icon-mortar-board"></i>',
                  description: word["in"] != null ? word["in"] : void 0,
                  descriptionMoreURL: word.url != null ? word.url : void 0
                });
              }
              return resolve(suggestions);
            }
          });
        },
        getPrefix: function(editor, bufferPosition) {
          var cursor, end, line, ref, regex, start, wordregex;
          regex = /@[\w-]+/;
          wordregex = XRegExp('(?:^|[\\p{WhiteSpace}\\p{Punctuation}])@[\\p{Letter}\\p{Number}\._-]*');
          cursor = editor.getCursors()[0];
          start = cursor.getBeginningOfCurrentWordBufferPosition({
            wordRegex: wordregex,
            allowPrevious: false
          });
          end = bufferPosition;
          line = editor.getTextInRange([start, bufferPosition]);
          return ((ref = line.match(regex)) != null ? ref[0] : void 0) || '';
        }
      };
    }

    ReferenceProvider.prototype.serialize = function() {
      return {
        deserializer: 'ReferenceProvider',
        data: {
          bibtex: this.bibtex,
          possibleWords: this.possibleWords
        }
      };
    };

    ReferenceProvider.prototype.buildWordList = function(bibtex) {
      var author, citation, editor, i, j, k, len, len1, len2, len3, m, possibleWords, ref, ref1, ref2;
      possibleWords = [];
      for (i = 0, len = bibtex.length; i < len; i++) {
        citation = bibtex[i];
        if (citation.entryTags && citation.entryTags.title && (citation.entryTags.authors || citation.entryTags.editors)) {
          citation.entryTags.title = citation.entryTags.title.replace(/(^\{|\}$)/g, "");
          citation.entryTags.prettyTitle = this.prettifyTitle(citation.entryTags.title);
          citation.fuzzyLabel = citation.entryTags.title;
          if (citation.entryTags.authors != null) {
            ref = citation.entryTags.authors;
            for (j = 0, len1 = ref.length; j < len1; j++) {
              author = ref[j];
              citation.fuzzyLabel += " " + author.personalName + " " + author.familyName;
            }
          }
          if (citation.entryTags.editors != null) {
            ref1 = citation.entryTags.editors;
            for (k = 0, len2 = ref1.length; k < len2; k++) {
              editor = ref1[k];
              citation.fuzzyLabel += " " + editor.personalName + " " + editor.familyName;
            }
          }
          if (citation.entryTags.authors != null) {
            citation.entryTags.prettyAuthors = this.prettifyAuthors(citation.entryTags.authors);
            ref2 = citation.entryTags.authors;
            for (m = 0, len3 = ref2.length; m < len3; m++) {
              author = ref2[m];
              possibleWords.push({
                author: this.prettifyName(author),
                key: citation.citationKey,
                label: citation.entryTags.prettyTitle,
                by: citation.entryTags.prettyAuthors,
                type: citation.entryTags.type,
                "in": citation.entryTags["in"] || citation.entryTags.journal || citation.entryTags.booktitle,
                url: citation.entryTags.url != null ? citation.entryTags.url : void 0
              });
            }
          } else {
            possibleWords.push({
              author: '',
              key: citation.citationKey,
              label: citation.entryTags.prettyTitle,
              by: '',
              type: citation.entryTags.type,
              "in": citation.entryTags["in"] || citation.entryTags.journal || citation.entryTags.booktitle,
              url: citation.entryTags.url != null ? citation.entryTags.url : void 0
            });
          }
        }
      }
      return possibleWords;
    };

    ReferenceProvider.prototype.buildWordListFromFiles = function(referenceFiles) {
      this.bibtex = this.readReferenceFiles(referenceFiles);
      return this.possibleWords = this.buildWordList(this.bibtex);
    };

    ReferenceProvider.prototype.readReferenceFiles = function(referenceFiles) {
      var bibtexParser, citeprocObject, citeprocReferences, error, file, fileType, i, len, references;
      if (referenceFiles.newValue != null) {
        referenceFiles = referenceFiles.newValue;
      }
      if (!Array.isArray(referenceFiles)) {
        referenceFiles = [referenceFiles];
      }
      try {
        references = [];
        for (i = 0, len = referenceFiles.length; i < len; i++) {
          file = referenceFiles[i];
          fileType = file.split('.').pop();
          if (fs.statSync(file).isFile()) {
            if (fileType === "json") {
              citeprocObject = JSON.parse(fs.readFileSync(file, 'utf-8'));
              citeprocReferences = citeproc.parse(citeprocObject);
              references = references.concat(citeprocReferences);
            } else if (fileType === "yaml") {
              citeprocObject = yaml.load(fs.readFileSync(file, 'utf-8'));
              citeprocReferences = citeproc.parse(citeprocObject);
              references = references.concat(citeprocReferences);
            } else {
              bibtexParser = new bibtexParse(fs.readFileSync(file, 'utf-8'));
              references = references.concat(this.parseBibtexAuthors(bibtexParser.parse()));
            }
          } else {
            console.warn("'" + file + "' does not appear to be a file, so autocomplete-bibtex will not try to parse it.");
          }
        }
        return references;
      } catch (error1) {
        error = error1;
        return console.error(error);
      }
    };


    /*
    This is a lightly modified version of AutocompleteManager.prefixForCursor
    which allows autocomplete-bibtex to define its own wordRegex.
    
    N.B. Setting `allowPrevious` to `false` is absolutely essential in order to
    make this perform as expected.
     */

    ReferenceProvider.prototype.prefixForCursor = function(cursor, buffer) {
      var end, start;
      if (!((buffer != null) && (cursor != null))) {
        return '';
      }
      start = cursor.getBeginningOfCurrentWordBufferPosition({
        wordRegex: this.wordRegex,
        allowPrevious: false
      });
      end = cursor.getBufferPosition();
      if (!((start != null) && (end != null))) {
        return '';
      }
      return buffer.getTextInRange([start, end]);
    };

    ReferenceProvider.prototype.prettifyTitle = function(title) {
      var colon, l, n;
      if (!title) {
        return;
      }
      if ((colon = title.indexOf(':')) !== -1 && title.split(" ").length > 5) {
        title = title.substring(0, colon);
      }
      title = titlecaps(title);
      l = title.length > 30 ? 30 : title.length;
      title = title.slice(0, l);
      n = title.lastIndexOf(" ");
      return title = title.slice(0, n) + "...";
    };

    ReferenceProvider.prototype.parseBibtexAuthors = function(citations) {
      var citation, i, len, validCitations;
      validCitations = [];
      for (i = 0, len = citations.length; i < len; i++) {
        citation = citations[i];
        if (citation.entryTags != null) {
          if (citation.entryTags.author != null) {
            citation.entryTags.authors = this.cleanAuthors(citation.entryTags.author.split(' and '));
          }
          if (citation.entryTags.editor != null) {
            citation.entryTags.editors = this.cleanAuthors(citation.entryTags.editor.split(' and '));
          }
          validCitations.push(citation);
        }
      }
      return validCitations;
    };

    ReferenceProvider.prototype.cleanAuthors = function(authors) {
      var author, familyName, i, len, personalName, ref, results;
      if (authors == null) {
        return [
          {
            familyName: 'Unknown'
          }
        ];
      }
      results = [];
      for (i = 0, len = authors.length; i < len; i++) {
        author = authors[i];
        ref = author.indexOf(', ') !== -1 ? author.split(', ') : [author], familyName = ref[0], personalName = ref[1];
        results.push({
          personalName: personalName,
          familyName: familyName
        });
      }
      return results;
    };

    ReferenceProvider.prototype.prettifyAuthors = function(authors) {
      var name;
      if (authors == null) {
        return '';
      }
      if (!authors.length) {
        return '';
      }
      name = this.prettifyName(authors[0]);
      name = name.replace(/(^\{|\}$)/g, "");
      if (authors.length > 1) {
        return name + " et al.";
      } else {
        return "" + name;
      }
    };

    ReferenceProvider.prototype.prettifyName = function(person, inverted, separator) {
      if (inverted == null) {
        inverted = false;
      }
      if (separator == null) {
        separator = ' ';
      }
      if (inverted) {
        return this.prettifyName({
          personalName: person.familyName,
          familyName: person.personalName
        }, false, ', ');
      } else {
        return (person.personalName != null ? person.personalName : '') + ((person.personalName != null) && (person.familyName != null) ? separator : '') + (person.familyName != null ? person.familyName : '');
      }
    };

    return ReferenceProvider;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1iaWJ0ZXgvbGliL3Byb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsa0ZBQUE7SUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsV0FBQSxHQUFjLE9BQUEsQ0FBUSxxQkFBUjs7RUFDZCxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVI7O0VBQ2IsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSLENBQWtCLENBQUM7O0VBQzdCLFNBQUEsR0FBWSxPQUFBLENBQVEsYUFBUjs7RUFDWixRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0VBQ1gsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ007SUFFSixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQXVCLGlCQUF2Qjs7SUFDQSxpQkFBQyxDQUFBLE9BQUQsR0FBVTs7SUFDVixpQkFBQyxDQUFBLFdBQUQsR0FBYyxTQUFDLEdBQUQ7QUFBWSxVQUFBO01BQVYsT0FBRDthQUFlLElBQUEsaUJBQUEsQ0FBa0IsSUFBbEI7SUFBaEI7O0lBRUQsMkJBQUMsS0FBRDs7Ozs7QUFDWCxVQUFBO01BQUEsSUFBRyxLQUFBLElBQVUsTUFBTSxDQUFDLElBQVAsQ0FBWSxLQUFaLENBQWtCLENBQUMsTUFBbkIsS0FBNkIsQ0FBdkMsSUFBNkMsc0JBQWhEO1FBQ0UsSUFBQyxDQUFBLE1BQUQsR0FBVSxLQUFLLENBQUM7UUFDaEIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsS0FBSyxDQUFDLGNBRnpCO09BQUEsTUFBQTtRQUlFLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQXhCLEVBSkY7O01BTUEsSUFBRyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7UUFDRSxJQUFDLENBQUEsc0JBQUQsQ0FBd0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUF4QixFQURGOztNQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3Qiw0QkFBeEIsRUFBc0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFdBQUQ7aUJBQ3BELEtBQUMsQ0FBQSxzQkFBRCxDQUF3QixXQUF4QjtRQURvRDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQ7TUFHQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEI7TUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG9DQUFwQixFQUEwRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsY0FBRDtpQkFDeEQsS0FBQyxDQUFBLGNBQUQsR0FBa0I7UUFEc0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFEO01BSUEsYUFBQSxHQUFnQixJQUFDLENBQUE7TUFFakIsSUFBQyxDQUFBLFFBQUQsR0FDRTtRQUFBLFFBQUEsRUFBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMkJBQWhCLENBQVY7UUFDQSxrQkFBQSxFQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLENBRHBCO1FBTUEsT0FBQSxFQUFTLFNBQUMsQ0FBRCxFQUFJLENBQUo7VUFDUCxJQUFHLENBQUMsQ0FBQyxLQUFGLEdBQVUsQ0FBQyxDQUFDLEtBQWY7QUFDRSxtQkFBTyxDQUFDLEVBRFY7O1VBRUEsSUFBRyxDQUFDLENBQUMsS0FBRixHQUFVLENBQUMsQ0FBQyxLQUFmO0FBQ0UsbUJBQU8sRUFEVDs7QUFFQSxpQkFBTztRQUxBLENBTlQ7UUFhQSxjQUFBLEVBQWdCLFNBQUMsR0FBRDtBQUNkLGNBQUE7VUFEZ0IscUJBQVE7VUFDeEIsTUFBQSxHQUFTLElBQUMsQ0FBQSxTQUFELENBQVcsTUFBWCxFQUFtQixjQUFuQjtpQkFFTCxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQ7QUFDVixnQkFBQTtZQUFBLElBQUcsTUFBTyxDQUFBLENBQUEsQ0FBUCxLQUFhLEdBQWhCO2NBQ0UsZ0JBQUEsR0FBbUIsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLE9BQW5CLENBQTJCLElBQTNCLEVBQWlDLEVBQWpDO2NBQ25CLFdBQUEsR0FBYztjQUNkLElBQUEsR0FBTyxVQUFVLENBQUMsTUFBWCxDQUFrQixhQUFsQixFQUFpQyxnQkFBakMsRUFBbUQ7Z0JBQUUsR0FBQSxFQUFLLFFBQVA7ZUFBbkQ7QUFFUCxtQkFBQSxzQ0FBQTs7Z0JBQ0UsR0FBRyxDQUFDLEtBQUosR0FBWSxVQUFVLENBQUMsS0FBWCxDQUFpQixnQkFBakIsRUFBbUMsR0FBRyxDQUFDLE1BQXZDO0FBRGQ7Y0FHQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUMsQ0FBQSxPQUFYO2NBRUEsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0NBQWhCO0FBRWpCLG1CQUFBLHdDQUFBOztnQkFDRSxXQUFXLENBQUMsSUFBWixDQUFpQjtrQkFDZixJQUFBLEVBQU0sY0FBYyxDQUFDLE9BQWYsQ0FBdUIsT0FBdkIsRUFBZ0MsSUFBSSxDQUFDLEdBQXJDLENBRFM7a0JBRWYsV0FBQSxFQUFhLElBQUksQ0FBQyxLQUZIO2tCQUdmLGlCQUFBLEVBQW1CLE1BSEo7a0JBSWYsU0FBQSxFQUFXLElBQUksQ0FBQyxHQUpEO2tCQUtmLFVBQUEsRUFBWSxJQUFJLENBQUMsRUFMRjtrQkFNZixTQUFBLEVBQVcsSUFBSSxDQUFDLElBTkQ7a0JBT2YsUUFBQSxFQUFVLG1DQVBLO2tCQVFmLFdBQUEsRUFBd0Isa0JBQVgsR0FBQSxJQUFJLEVBQUMsRUFBRCxFQUFKLEdBQUEsTUFSRTtrQkFTZixrQkFBQSxFQUFnQyxnQkFBWixHQUFBLElBQUksQ0FBQyxHQUFMLEdBQUEsTUFUTDtpQkFBakI7QUFERjtxQkFhQSxPQUFBLENBQVEsV0FBUixFQXpCRjs7VUFEVSxDQUFSO1FBSFUsQ0FiaEI7UUE0Q0EsU0FBQSxFQUFXLFNBQUMsTUFBRCxFQUFTLGNBQVQ7QUFFVCxjQUFBO1VBQUEsS0FBQSxHQUFRO1VBQ1IsU0FBQSxHQUFZLE9BQUEsQ0FBUSx1RUFBUjtVQUNaLE1BQUEsR0FBUyxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW9CLENBQUEsQ0FBQTtVQUM3QixLQUFBLEdBQVEsTUFBTSxDQUFDLHVDQUFQLENBQStDO1lBQUUsU0FBQSxFQUFXLFNBQWI7WUFBd0IsYUFBQSxFQUFlLEtBQXZDO1dBQS9DO1VBQ1IsR0FBQSxHQUFNO1VBRU4sSUFBQSxHQUFPLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQUMsS0FBRCxFQUFRLGNBQVIsQ0FBdEI7eURBRVksQ0FBQSxDQUFBLFdBQW5CLElBQXlCO1FBVmhCLENBNUNYOztJQXJCUzs7Z0NBNkViLFNBQUEsR0FBVyxTQUFBO2FBQUc7UUFDWixZQUFBLEVBQWMsbUJBREY7UUFFWixJQUFBLEVBQU07VUFBRSxNQUFBLEVBQVEsSUFBQyxDQUFBLE1BQVg7VUFBbUIsYUFBQSxFQUFlLElBQUMsQ0FBQSxhQUFuQztTQUZNOztJQUFIOztnQ0FLWCxhQUFBLEdBQWUsU0FBQyxNQUFEO0FBQ2IsVUFBQTtNQUFBLGFBQUEsR0FBZ0I7QUFFaEIsV0FBQSx3Q0FBQTs7UUFDRSxJQUFHLFFBQVEsQ0FBQyxTQUFULElBQXVCLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBMUMsSUFBb0QsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQW5CLElBQThCLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBbEQsQ0FBdkQ7VUFDRSxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQW5CLEdBQTJCLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQXpCLENBQWlDLFlBQWpDLEVBQStDLEVBQS9DO1VBQzNCLFFBQVEsQ0FBQyxTQUFTLENBQUMsV0FBbkIsR0FDRSxJQUFDLENBQUEsYUFBRCxDQUFlLFFBQVEsQ0FBQyxTQUFTLENBQUMsS0FBbEM7VUFFRixRQUFRLENBQUMsVUFBVCxHQUFzQixRQUFRLENBQUMsU0FBUyxDQUFDO1VBRXpDLElBQUcsa0NBQUg7QUFDRTtBQUFBLGlCQUFBLHVDQUFBOztjQUNFLFFBQVEsQ0FBQyxVQUFULElBQXVCLEdBQUEsR0FBSSxNQUFNLENBQUMsWUFBWCxHQUF3QixHQUF4QixHQUEyQixNQUFNLENBQUM7QUFEM0QsYUFERjs7VUFJQSxJQUFHLGtDQUFIO0FBQ0U7QUFBQSxpQkFBQSx3Q0FBQTs7Y0FDRSxRQUFRLENBQUMsVUFBVCxJQUF1QixHQUFBLEdBQUksTUFBTSxDQUFDLFlBQVgsR0FBd0IsR0FBeEIsR0FBMkIsTUFBTSxDQUFDO0FBRDNELGFBREY7O1VBSUEsSUFBRyxrQ0FBSDtZQUNFLFFBQVEsQ0FBQyxTQUFTLENBQUMsYUFBbkIsR0FDRSxJQUFDLENBQUEsZUFBRCxDQUFpQixRQUFRLENBQUMsU0FBUyxDQUFDLE9BQXBDO0FBRUY7QUFBQSxpQkFBQSx3Q0FBQTs7Y0FDRSxhQUFhLENBQUMsSUFBZCxDQUFtQjtnQkFDakIsTUFBQSxFQUFRLElBQUMsQ0FBQSxZQUFELENBQWMsTUFBZCxDQURTO2dCQUVqQixHQUFBLEVBQUssUUFBUSxDQUFDLFdBRkc7Z0JBR2pCLEtBQUEsRUFBTyxRQUFRLENBQUMsU0FBUyxDQUFDLFdBSFQ7Z0JBSWpCLEVBQUEsRUFBSSxRQUFRLENBQUMsU0FBUyxDQUFDLGFBSk47Z0JBS2pCLElBQUEsRUFBTSxRQUFRLENBQUMsU0FBUyxDQUFDLElBTFI7Z0JBTWpCLENBQUEsRUFBQSxDQUFBLEVBQUksUUFBUSxDQUFDLFNBQVMsRUFBQyxFQUFELEVBQWxCLElBQXlCLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBNUMsSUFBdUQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQU43RDtnQkFPakIsR0FBQSxFQUErQiw4QkFBMUIsR0FBQSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQW5CLEdBQUEsTUFQWTtlQUFuQjtBQURGLGFBSkY7V0FBQSxNQUFBO1lBZUUsYUFBYSxDQUFDLElBQWQsQ0FBbUI7Y0FDakIsTUFBQSxFQUFRLEVBRFM7Y0FFakIsR0FBQSxFQUFLLFFBQVEsQ0FBQyxXQUZHO2NBR2pCLEtBQUEsRUFBTyxRQUFRLENBQUMsU0FBUyxDQUFDLFdBSFQ7Y0FJakIsRUFBQSxFQUFJLEVBSmE7Y0FLakIsSUFBQSxFQUFNLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFMUjtjQU1qQixDQUFBLEVBQUEsQ0FBQSxFQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUMsRUFBRCxFQUFsQixJQUF5QixRQUFRLENBQUMsU0FBUyxDQUFDLE9BQTVDLElBQXVELFFBQVEsQ0FBQyxTQUFTLENBQUMsU0FON0Q7Y0FPakIsR0FBQSxFQUErQiw4QkFBMUIsR0FBQSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQW5CLEdBQUEsTUFQWTthQUFuQixFQWZGO1dBZkY7O0FBREY7QUF5Q0EsYUFBTztJQTVDTTs7Z0NBOENmLHNCQUFBLEdBQXdCLFNBQUMsY0FBRDtNQUN0QixJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixjQUFwQjthQUNWLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBQyxDQUFBLE1BQWhCO0lBRks7O2dDQUl4QixrQkFBQSxHQUFvQixTQUFDLGNBQUQ7QUFDbEIsVUFBQTtNQUFBLElBQUcsK0JBQUg7UUFDRSxjQUFBLEdBQWlCLGNBQWMsQ0FBQyxTQURsQzs7TUFHQSxJQUFHLENBQUksS0FBSyxDQUFDLE9BQU4sQ0FBYyxjQUFkLENBQVA7UUFDRSxjQUFBLEdBQWlCLENBQUMsY0FBRCxFQURuQjs7QUFHQTtRQUNFLFVBQUEsR0FBYTtBQUViLGFBQUEsZ0RBQUE7O1VBRUUsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxDQUFlLENBQUMsR0FBaEIsQ0FBQTtVQUVYLElBQUcsRUFBRSxDQUFDLFFBQUgsQ0FBWSxJQUFaLENBQWlCLENBQUMsTUFBbEIsQ0FBQSxDQUFIO1lBQ0UsSUFBRyxRQUFBLEtBQVksTUFBZjtjQUNFLGNBQUEsR0FBaUIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxFQUFFLENBQUMsWUFBSCxDQUFnQixJQUFoQixFQUFzQixPQUF0QixDQUFYO2NBQ2pCLGtCQUFBLEdBQXFCLFFBQVEsQ0FBQyxLQUFULENBQWUsY0FBZjtjQUNyQixVQUFBLEdBQWEsVUFBVSxDQUFDLE1BQVgsQ0FBa0Isa0JBQWxCLEVBSGY7YUFBQSxNQUlLLElBQUcsUUFBQSxLQUFZLE1BQWY7Y0FDSCxjQUFBLEdBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBaEIsRUFBc0IsT0FBdEIsQ0FBVjtjQUNqQixrQkFBQSxHQUFxQixRQUFRLENBQUMsS0FBVCxDQUFlLGNBQWY7Y0FDckIsVUFBQSxHQUFhLFVBQVUsQ0FBQyxNQUFYLENBQWtCLGtCQUFsQixFQUhWO2FBQUEsTUFBQTtjQU1ILFlBQUEsR0FBbUIsSUFBQSxXQUFBLENBQWEsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsSUFBaEIsRUFBc0IsT0FBdEIsQ0FBYjtjQUNuQixVQUFBLEdBQWEsVUFBVSxDQUFDLE1BQVgsQ0FBbUIsSUFBQyxDQUFBLGtCQUFELENBQXFCLFlBQVksQ0FBQyxLQUFiLENBQUEsQ0FBckIsQ0FBbkIsRUFQVjthQUxQO1dBQUEsTUFBQTtZQWVFLE9BQU8sQ0FBQyxJQUFSLENBQWEsR0FBQSxHQUFJLElBQUosR0FBUyxrRkFBdEIsRUFmRjs7QUFKRjtBQW9CQSxlQUFPLFdBdkJUO09BQUEsY0FBQTtRQXdCTTtlQUNKLE9BQU8sQ0FBQyxLQUFSLENBQWMsS0FBZCxFQXpCRjs7SUFQa0I7OztBQWtDcEI7Ozs7Ozs7O2dDQU9BLGVBQUEsR0FBaUIsU0FBQyxNQUFELEVBQVMsTUFBVDtBQUNmLFVBQUE7TUFBQSxJQUFBLENBQUEsQ0FBaUIsZ0JBQUEsSUFBWSxnQkFBN0IsQ0FBQTtBQUFBLGVBQU8sR0FBUDs7TUFDQSxLQUFBLEdBQVEsTUFBTSxDQUFDLHVDQUFQLENBQStDO1FBQUUsU0FBQSxFQUFXLElBQUMsQ0FBQSxTQUFkO1FBQXlCLGFBQUEsRUFBZSxLQUF4QztPQUEvQztNQUNSLEdBQUEsR0FBTSxNQUFNLENBQUMsaUJBQVAsQ0FBQTtNQUNOLElBQUEsQ0FBQSxDQUFpQixlQUFBLElBQVcsYUFBNUIsQ0FBQTtBQUFBLGVBQU8sR0FBUDs7YUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLEtBQUQsRUFBUSxHQUFSLENBQXRCO0lBTGU7O2dDQU9qQixhQUFBLEdBQWUsU0FBQyxLQUFEO0FBQ2IsVUFBQTtNQUFBLElBQVUsQ0FBSSxLQUFkO0FBQUEsZUFBQTs7TUFDQSxJQUFHLENBQUMsS0FBQSxHQUFRLEtBQUssQ0FBQyxPQUFOLENBQWMsR0FBZCxDQUFULENBQUEsS0FBa0MsQ0FBQyxDQUFuQyxJQUF5QyxLQUFLLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBZ0IsQ0FBQyxNQUFqQixHQUEwQixDQUF0RTtRQUNFLEtBQUEsR0FBUSxLQUFLLENBQUMsU0FBTixDQUFnQixDQUFoQixFQUFtQixLQUFuQixFQURWOztNQUlBLEtBQUEsR0FBUSxTQUFBLENBQVUsS0FBVjtNQUNSLENBQUEsR0FBTyxLQUFLLENBQUMsTUFBTixHQUFlLEVBQWxCLEdBQTBCLEVBQTFCLEdBQWtDLEtBQUssQ0FBQztNQUM1QyxLQUFBLEdBQVEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxDQUFaLEVBQWUsQ0FBZjtNQUNSLENBQUEsR0FBSSxLQUFLLENBQUMsV0FBTixDQUFrQixHQUFsQjthQUNKLEtBQUEsR0FBUSxLQUFLLENBQUMsS0FBTixDQUFZLENBQVosRUFBZSxDQUFmLENBQUEsR0FBb0I7SUFWZjs7Z0NBWWYsa0JBQUEsR0FBb0IsU0FBQyxTQUFEO0FBQ2xCLFVBQUE7TUFBQSxjQUFBLEdBQWlCO0FBQ2pCLFdBQUEsMkNBQUE7O1FBQ0UsSUFBRywwQkFBSDtVQUdFLElBQUcsaUNBQUg7WUFDRSxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQW5CLEdBQTZCLElBQUMsQ0FBQSxZQUFELENBQWMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBMUIsQ0FBZ0MsT0FBaEMsQ0FBZCxFQUQvQjs7VUFHQSxJQUFHLGlDQUFIO1lBQ0UsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFuQixHQUE2QixJQUFDLENBQUEsWUFBRCxDQUFjLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQTFCLENBQWdDLE9BQWhDLENBQWQsRUFEL0I7O1VBR0EsY0FBYyxDQUFDLElBQWYsQ0FBb0IsUUFBcEIsRUFURjs7QUFERjtBQVlBLGFBQU87SUFkVzs7Z0NBZ0JwQixZQUFBLEdBQWMsU0FBQyxPQUFEO0FBQ1osVUFBQTtNQUFBLElBQTBDLGVBQTFDO0FBQUEsZUFBTztVQUFDO1lBQUUsVUFBQSxFQUFZLFNBQWQ7V0FBRDtVQUFQOztBQUVBO1dBQUEseUNBQUE7O1FBQ0UsTUFDSyxNQUFNLENBQUMsT0FBUCxDQUFlLElBQWYsQ0FBQSxLQUEwQixDQUFDLENBQTlCLEdBQXFDLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBYixDQUFyQyxHQUE2RCxDQUFDLE1BQUQsQ0FEL0QsRUFBQyxtQkFBRCxFQUFhO3FCQUdiO1VBQUUsWUFBQSxFQUFjLFlBQWhCO1VBQThCLFVBQUEsRUFBWSxVQUExQzs7QUFKRjs7SUFIWTs7Z0NBU2QsZUFBQSxHQUFpQixTQUFDLE9BQUQ7QUFDZixVQUFBO01BQUEsSUFBaUIsZUFBakI7QUFBQSxlQUFPLEdBQVA7O01BQ0EsSUFBYSxDQUFJLE9BQU8sQ0FBQyxNQUF6QjtBQUFBLGVBQU8sR0FBUDs7TUFFQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFlBQUQsQ0FBYyxPQUFRLENBQUEsQ0FBQSxDQUF0QjtNQUdQLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLFlBQWIsRUFBMkIsRUFBM0I7TUFFUCxJQUFHLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQXBCO2VBQThCLElBQUQsR0FBTSxVQUFuQztPQUFBLE1BQUE7ZUFBaUQsRUFBQSxHQUFHLEtBQXBEOztJQVRlOztnQ0FXakIsWUFBQSxHQUFjLFNBQUMsTUFBRCxFQUFTLFFBQVQsRUFBd0IsU0FBeEI7O1FBQVMsV0FBVzs7O1FBQUksWUFBWTs7TUFDaEQsSUFBRyxRQUFIO2VBQ0UsSUFBQyxDQUFBLFlBQUQsQ0FBYztVQUNaLFlBQUEsRUFBYyxNQUFNLENBQUMsVUFEVDtVQUVaLFVBQUEsRUFBWSxNQUFNLENBQUMsWUFGUDtTQUFkLEVBR0csS0FISCxFQUdPLElBSFAsRUFERjtPQUFBLE1BQUE7ZUFNRSxDQUFJLDJCQUFILEdBQTZCLE1BQU0sQ0FBQyxZQUFwQyxHQUFzRCxFQUF2RCxDQUFBLEdBQ0EsQ0FBSSw2QkFBQSxJQUF5QiwyQkFBNUIsR0FBb0QsU0FBcEQsR0FBbUUsRUFBcEUsQ0FEQSxHQUVBLENBQUkseUJBQUgsR0FBMkIsTUFBTSxDQUFDLFVBQWxDLEdBQWtELEVBQW5ELEVBUkY7O0lBRFk7Ozs7O0FBblBoQiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSBcImZzXCJcbmJpYnRleFBhcnNlID0gcmVxdWlyZSBcInpvdGVyby1iaWJ0ZXgtcGFyc2VcIlxuZnV6emFsZHJpbiA9IHJlcXVpcmUgXCJmdXp6YWxkcmluXCJcblhSZWdFeHAgPSByZXF1aXJlKCd4cmVnZXhwJykuWFJlZ0V4cFxudGl0bGVjYXBzID0gcmVxdWlyZSBcIi4vdGl0bGVjYXBzXCJcbmNpdGVwcm9jID0gcmVxdWlyZSBcIi4vY2l0ZXByb2NcIlxueWFtbCA9IHJlcXVpcmUgXCJ5YW1sLWpzXCJcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgUmVmZXJlbmNlUHJvdmlkZXJcblxuICBhdG9tLmRlc2VyaWFsaXplcnMuYWRkKHRoaXMpXG4gIEB2ZXJzaW9uOiAyXG4gIEBkZXNlcmlhbGl6ZTogKHtkYXRhfSkgLT4gbmV3IFJlZmVyZW5jZVByb3ZpZGVyKGRhdGEpXG5cbiAgY29uc3RydWN0b3I6IChzdGF0ZSkgLT5cbiAgICBpZiBzdGF0ZSBhbmQgT2JqZWN0LmtleXMoc3RhdGUpLmxlbmd0aCAhPSAwIGFuZCBzdGF0ZS5iaWJ0ZXg/XG4gICAgICBAYmlidGV4ID0gc3RhdGUuYmlidGV4XG4gICAgICBAcG9zc2libGVXb3JkcyA9IHN0YXRlLnBvc3NpYmxlV29yZHNcbiAgICBlbHNlXG4gICAgICBAYnVpbGRXb3JkTGlzdEZyb21GaWxlcyhhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtYmlidGV4LmJpYnRleFwiKVxuXG4gICAgaWYgQGJpYnRleC5sZW5ndGggPT0gMFxuICAgICAgQGJ1aWxkV29yZExpc3RGcm9tRmlsZXMoYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWJpYnRleC5iaWJ0ZXhcIilcblxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlIFwiYXV0b2NvbXBsZXRlLWJpYnRleC5iaWJ0ZXhcIiwgKGJpYnRleEZpbGVzKSA9PlxuICAgICAgQGJ1aWxkV29yZExpc3RGcm9tRmlsZXMoYmlidGV4RmlsZXMpXG5cbiAgICByZXN1bHRUZW1wbGF0ZSA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1iaWJ0ZXgucmVzdWx0VGVtcGxhdGVcIlxuICAgIGF0b20uY29uZmlnLm9ic2VydmUoXCJhdXRvY29tcGxldGUtYmlidGV4LnJlc3VsdFRlbXBsYXRlXCIsIChyZXN1bHRUZW1wbGF0ZSkgPT5cbiAgICAgIEByZXN1bHRUZW1wbGF0ZSA9IHJlc3VsdFRlbXBsYXRlXG4gICAgKVxuXG4gICAgcG9zc2libGVXb3JkcyA9IEBwb3NzaWJsZVdvcmRzXG5cbiAgICBAcHJvdmlkZXIgPVxuICAgICAgc2VsZWN0b3I6IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1iaWJ0ZXguc2NvcGVcIlxuICAgICAgZGlzYWJsZUZvclNlbGVjdG9yOiBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtYmlidGV4Lmlnbm9yZVNjb3BlXCJcbiAgICAgICMgSGFjayB0byBzdXByZXNzIGRlZmF1bHQgcHJvdmlkZXIgaW4gTUQgZmlsZXNcbiAgICAgICMgaW5jbHVzaW9uUHJpb3JpdHk6IDJcbiAgICAgICMgZXhjbHVkZUxvd2VyUHJpb3JpdHk6IHRydWVcblxuICAgICAgY29tcGFyZTogKGEsIGIpIC0+XG4gICAgICAgIGlmIGEuc2NvcmUgPCBiLnNjb3JlXG4gICAgICAgICAgcmV0dXJuIC0xXG4gICAgICAgIGlmIGEuc2NvcmUgPiBiLnNjb3JlXG4gICAgICAgICAgcmV0dXJuIDFcbiAgICAgICAgcmV0dXJuIDBcblxuICAgICAgZ2V0U3VnZ2VzdGlvbnM6ICh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbn0pIC0+XG4gICAgICAgIHByZWZpeCA9IEBnZXRQcmVmaXgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcblxuICAgICAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgLT5cbiAgICAgICAgICBpZiBwcmVmaXhbMF0gPT0gXCJAXCJcbiAgICAgICAgICAgIG5vcm1hbGl6ZWRQcmVmaXggPSBwcmVmaXgubm9ybWFsaXplKCkucmVwbGFjZSgvXkAvLCAnJylcbiAgICAgICAgICAgIHN1Z2dlc3Rpb25zID0gW11cbiAgICAgICAgICAgIGhpdHMgPSBmdXp6YWxkcmluLmZpbHRlciBwb3NzaWJsZVdvcmRzLCBub3JtYWxpemVkUHJlZml4LCB7IGtleTogJ2F1dGhvcicgfVxuXG4gICAgICAgICAgICBmb3IgaGl0IGluIGhpdHNcbiAgICAgICAgICAgICAgaGl0LnNjb3JlID0gZnV6emFsZHJpbi5zY29yZSBub3JtYWxpemVkUHJlZml4LCBoaXQuYXV0aG9yXG5cbiAgICAgICAgICAgIGhpdHMuc29ydCBAY29tcGFyZVxuXG4gICAgICAgICAgICByZXN1bHRUZW1wbGF0ZSA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1iaWJ0ZXgucmVzdWx0VGVtcGxhdGVcIlxuXG4gICAgICAgICAgICBmb3Igd29yZCBpbiBoaXRzXG4gICAgICAgICAgICAgIHN1Z2dlc3Rpb25zLnB1c2gge1xuICAgICAgICAgICAgICAgIHRleHQ6IHJlc3VsdFRlbXBsYXRlLnJlcGxhY2UoXCJba2V5XVwiLCB3b3JkLmtleSlcbiAgICAgICAgICAgICAgICBkaXNwbGF5VGV4dDogd29yZC5sYWJlbFxuICAgICAgICAgICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBwcmVmaXhcbiAgICAgICAgICAgICAgICBsZWZ0TGFiZWw6IHdvcmQua2V5XG4gICAgICAgICAgICAgICAgcmlnaHRMYWJlbDogd29yZC5ieVxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZTogd29yZC50eXBlXG4gICAgICAgICAgICAgICAgaWNvbkhUTUw6ICc8aSBjbGFzcz1cImljb24tbW9ydGFyLWJvYXJkXCI+PC9pPidcbiAgICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogd29yZC5pbiBpZiB3b3JkLmluP1xuICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uTW9yZVVSTDogd29yZC51cmwgaWYgd29yZC51cmw/XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmVzb2x2ZShzdWdnZXN0aW9ucylcblxuICAgICAgZ2V0UHJlZml4OiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICAgICAgIyBXaGF0ZXZlciB5b3VyIHByZWZpeCByZWdleCBtaWdodCBiZVxuICAgICAgICByZWdleCA9IC9AW1xcdy1dKy9cbiAgICAgICAgd29yZHJlZ2V4ID0gWFJlZ0V4cCgnKD86XnxbXFxcXHB7V2hpdGVTcGFjZX1cXFxccHtQdW5jdHVhdGlvbn1dKUBbXFxcXHB7TGV0dGVyfVxcXFxwe051bWJlcn1cXC5fLV0qJylcbiAgICAgICAgY3Vyc29yID0gZWRpdG9yLmdldEN1cnNvcnMoKVswXVxuICAgICAgICBzdGFydCA9IGN1cnNvci5nZXRCZWdpbm5pbmdPZkN1cnJlbnRXb3JkQnVmZmVyUG9zaXRpb24oeyB3b3JkUmVnZXg6IHdvcmRyZWdleCwgYWxsb3dQcmV2aW91czogZmFsc2UgfSlcbiAgICAgICAgZW5kID0gYnVmZmVyUG9zaXRpb25cbiAgICAgICAgIyBHZXQgdGhlIHRleHQgZm9yIHRoZSBsaW5lIHVwIHRvIHRoZSB0cmlnZ2VyZWQgYnVmZmVyIHBvc2l0aW9uXG4gICAgICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW3N0YXJ0LCBidWZmZXJQb3NpdGlvbl0pXG4gICAgICAgICMgTWF0Y2ggdGhlIHJlZ2V4IHRvIHRoZSBsaW5lLCBhbmQgcmV0dXJuIHRoZSBtYXRjaFxuICAgICAgICBsaW5lLm1hdGNoKHJlZ2V4KT9bMF0gb3IgJydcblxuICBzZXJpYWxpemU6IC0+IHtcbiAgICBkZXNlcmlhbGl6ZXI6ICdSZWZlcmVuY2VQcm92aWRlcidcbiAgICBkYXRhOiB7IGJpYnRleDogQGJpYnRleCwgcG9zc2libGVXb3JkczogQHBvc3NpYmxlV29yZHMgfVxuICB9XG5cbiAgYnVpbGRXb3JkTGlzdDogKGJpYnRleCkgPT5cbiAgICBwb3NzaWJsZVdvcmRzID0gW11cblxuICAgIGZvciBjaXRhdGlvbiBpbiBiaWJ0ZXhcbiAgICAgIGlmIGNpdGF0aW9uLmVudHJ5VGFncyBhbmQgY2l0YXRpb24uZW50cnlUYWdzLnRpdGxlIGFuZCAoY2l0YXRpb24uZW50cnlUYWdzLmF1dGhvcnMgb3IgY2l0YXRpb24uZW50cnlUYWdzLmVkaXRvcnMpXG4gICAgICAgIGNpdGF0aW9uLmVudHJ5VGFncy50aXRsZSA9IGNpdGF0aW9uLmVudHJ5VGFncy50aXRsZS5yZXBsYWNlKC8oXlxce3xcXH0kKS9nLCBcIlwiKVxuICAgICAgICBjaXRhdGlvbi5lbnRyeVRhZ3MucHJldHR5VGl0bGUgPVxuICAgICAgICAgIEBwcmV0dGlmeVRpdGxlIGNpdGF0aW9uLmVudHJ5VGFncy50aXRsZVxuXG4gICAgICAgIGNpdGF0aW9uLmZ1enp5TGFiZWwgPSBjaXRhdGlvbi5lbnRyeVRhZ3MudGl0bGVcblxuICAgICAgICBpZiBjaXRhdGlvbi5lbnRyeVRhZ3MuYXV0aG9ycz9cbiAgICAgICAgICBmb3IgYXV0aG9yIGluIGNpdGF0aW9uLmVudHJ5VGFncy5hdXRob3JzXG4gICAgICAgICAgICBjaXRhdGlvbi5mdXp6eUxhYmVsICs9IFwiICN7YXV0aG9yLnBlcnNvbmFsTmFtZX0gI3thdXRob3IuZmFtaWx5TmFtZX1cIlxuXG4gICAgICAgIGlmIGNpdGF0aW9uLmVudHJ5VGFncy5lZGl0b3JzP1xuICAgICAgICAgIGZvciBlZGl0b3IgaW4gY2l0YXRpb24uZW50cnlUYWdzLmVkaXRvcnNcbiAgICAgICAgICAgIGNpdGF0aW9uLmZ1enp5TGFiZWwgKz0gXCIgI3tlZGl0b3IucGVyc29uYWxOYW1lfSAje2VkaXRvci5mYW1pbHlOYW1lfVwiXG5cbiAgICAgICAgaWYgY2l0YXRpb24uZW50cnlUYWdzLmF1dGhvcnM/XG4gICAgICAgICAgY2l0YXRpb24uZW50cnlUYWdzLnByZXR0eUF1dGhvcnMgPVxuICAgICAgICAgICAgQHByZXR0aWZ5QXV0aG9ycyBjaXRhdGlvbi5lbnRyeVRhZ3MuYXV0aG9yc1xuXG4gICAgICAgICAgZm9yIGF1dGhvciBpbiBjaXRhdGlvbi5lbnRyeVRhZ3MuYXV0aG9yc1xuICAgICAgICAgICAgcG9zc2libGVXb3Jkcy5wdXNoIHtcbiAgICAgICAgICAgICAgYXV0aG9yOiBAcHJldHRpZnlOYW1lKGF1dGhvciksXG4gICAgICAgICAgICAgIGtleTogY2l0YXRpb24uY2l0YXRpb25LZXksXG4gICAgICAgICAgICAgIGxhYmVsOiBjaXRhdGlvbi5lbnRyeVRhZ3MucHJldHR5VGl0bGVcbiAgICAgICAgICAgICAgYnk6IGNpdGF0aW9uLmVudHJ5VGFncy5wcmV0dHlBdXRob3JzXG4gICAgICAgICAgICAgIHR5cGU6IGNpdGF0aW9uLmVudHJ5VGFncy50eXBlXG4gICAgICAgICAgICAgIGluOiBjaXRhdGlvbi5lbnRyeVRhZ3MuaW4gb3IgY2l0YXRpb24uZW50cnlUYWdzLmpvdXJuYWwgb3IgY2l0YXRpb24uZW50cnlUYWdzLmJvb2t0aXRsZVxuICAgICAgICAgICAgICB1cmw6IGNpdGF0aW9uLmVudHJ5VGFncy51cmwgaWYgY2l0YXRpb24uZW50cnlUYWdzLnVybD9cbiAgICAgICAgICAgIH1cbiAgICAgICAgZWxzZVxuICAgICAgICAgIHBvc3NpYmxlV29yZHMucHVzaCB7XG4gICAgICAgICAgICBhdXRob3I6ICcnLFxuICAgICAgICAgICAga2V5OiBjaXRhdGlvbi5jaXRhdGlvbktleSxcbiAgICAgICAgICAgIGxhYmVsOiBjaXRhdGlvbi5lbnRyeVRhZ3MucHJldHR5VGl0bGVcbiAgICAgICAgICAgIGJ5OiAnJ1xuICAgICAgICAgICAgdHlwZTogY2l0YXRpb24uZW50cnlUYWdzLnR5cGVcbiAgICAgICAgICAgIGluOiBjaXRhdGlvbi5lbnRyeVRhZ3MuaW4gb3IgY2l0YXRpb24uZW50cnlUYWdzLmpvdXJuYWwgb3IgY2l0YXRpb24uZW50cnlUYWdzLmJvb2t0aXRsZVxuICAgICAgICAgICAgdXJsOiBjaXRhdGlvbi5lbnRyeVRhZ3MudXJsIGlmIGNpdGF0aW9uLmVudHJ5VGFncy51cmw/XG4gICAgICAgICAgfVxuXG4gICAgcmV0dXJuIHBvc3NpYmxlV29yZHNcblxuICBidWlsZFdvcmRMaXN0RnJvbUZpbGVzOiAocmVmZXJlbmNlRmlsZXMpID0+XG4gICAgQGJpYnRleCA9IEByZWFkUmVmZXJlbmNlRmlsZXMocmVmZXJlbmNlRmlsZXMpXG4gICAgQHBvc3NpYmxlV29yZHMgPSBAYnVpbGRXb3JkTGlzdChAYmlidGV4KVxuXG4gIHJlYWRSZWZlcmVuY2VGaWxlczogKHJlZmVyZW5jZUZpbGVzKSA9PlxuICAgIGlmIHJlZmVyZW5jZUZpbGVzLm5ld1ZhbHVlP1xuICAgICAgcmVmZXJlbmNlRmlsZXMgPSByZWZlcmVuY2VGaWxlcy5uZXdWYWx1ZVxuICAgICMgTWFrZSBzdXJlIG91ciBsaXN0IG9mIGZpbGVzIGlzIGFuIGFycmF5LCBldmVuIGlmIGl0J3Mgb25seSBvbmUgZmlsZVxuICAgIGlmIG5vdCBBcnJheS5pc0FycmF5KHJlZmVyZW5jZUZpbGVzKVxuICAgICAgcmVmZXJlbmNlRmlsZXMgPSBbcmVmZXJlbmNlRmlsZXNdXG5cbiAgICB0cnlcbiAgICAgIHJlZmVyZW5jZXMgPSBbXVxuXG4gICAgICBmb3IgZmlsZSBpbiByZWZlcmVuY2VGaWxlc1xuICAgICAgICAjIFdoYXQgdHlwZSBvZiBmaWxlIGlzIHRoaXM/XG4gICAgICAgIGZpbGVUeXBlID0gZmlsZS5zcGxpdCgnLicpLnBvcCgpXG5cbiAgICAgICAgaWYgZnMuc3RhdFN5bmMoZmlsZSkuaXNGaWxlKClcbiAgICAgICAgICBpZiBmaWxlVHlwZSBpcyBcImpzb25cIlxuICAgICAgICAgICAgY2l0ZXByb2NPYmplY3QgPSBKU09OLnBhcnNlIGZzLnJlYWRGaWxlU3luYyhmaWxlLCAndXRmLTgnKVxuICAgICAgICAgICAgY2l0ZXByb2NSZWZlcmVuY2VzID0gY2l0ZXByb2MucGFyc2UgY2l0ZXByb2NPYmplY3RcbiAgICAgICAgICAgIHJlZmVyZW5jZXMgPSByZWZlcmVuY2VzLmNvbmNhdCBjaXRlcHJvY1JlZmVyZW5jZXNcbiAgICAgICAgICBlbHNlIGlmIGZpbGVUeXBlIGlzIFwieWFtbFwiXG4gICAgICAgICAgICBjaXRlcHJvY09iamVjdCA9IHlhbWwubG9hZCBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgJ3V0Zi04JylcbiAgICAgICAgICAgIGNpdGVwcm9jUmVmZXJlbmNlcyA9IGNpdGVwcm9jLnBhcnNlIGNpdGVwcm9jT2JqZWN0XG4gICAgICAgICAgICByZWZlcmVuY2VzID0gcmVmZXJlbmNlcy5jb25jYXQgY2l0ZXByb2NSZWZlcmVuY2VzXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgIyBEZWZhdWx0IHRvIHRyeWluZyB0byBwYXJzZSBhcyBhIEJpYlRlWCBmaWxlLlxuICAgICAgICAgICAgYmlidGV4UGFyc2VyID0gbmV3IGJpYnRleFBhcnNlKCBmcy5yZWFkRmlsZVN5bmMoZmlsZSwgJ3V0Zi04JykpXG4gICAgICAgICAgICByZWZlcmVuY2VzID0gcmVmZXJlbmNlcy5jb25jYXQoIEBwYXJzZUJpYnRleEF1dGhvcnMoIGJpYnRleFBhcnNlci5wYXJzZSgpKSlcblxuICAgICAgICBlbHNlXG4gICAgICAgICAgY29uc29sZS53YXJuKFwiJyN7ZmlsZX0nIGRvZXMgbm90IGFwcGVhciB0byBiZSBhIGZpbGUsIHNvIGF1dG9jb21wbGV0ZS1iaWJ0ZXggd2lsbCBub3QgdHJ5IHRvIHBhcnNlIGl0LlwiKVxuICAgICAgcmV0dXJuIHJlZmVyZW5jZXNcbiAgICBjYXRjaCBlcnJvclxuICAgICAgY29uc29sZS5lcnJvciBlcnJvclxuXG4gICMjI1xuICBUaGlzIGlzIGEgbGlnaHRseSBtb2RpZmllZCB2ZXJzaW9uIG9mIEF1dG9jb21wbGV0ZU1hbmFnZXIucHJlZml4Rm9yQ3Vyc29yXG4gIHdoaWNoIGFsbG93cyBhdXRvY29tcGxldGUtYmlidGV4IHRvIGRlZmluZSBpdHMgb3duIHdvcmRSZWdleC5cblxuICBOLkIuIFNldHRpbmcgYGFsbG93UHJldmlvdXNgIHRvIGBmYWxzZWAgaXMgYWJzb2x1dGVseSBlc3NlbnRpYWwgaW4gb3JkZXIgdG9cbiAgbWFrZSB0aGlzIHBlcmZvcm0gYXMgZXhwZWN0ZWQuXG4gICMjI1xuICBwcmVmaXhGb3JDdXJzb3I6IChjdXJzb3IsIGJ1ZmZlcikgPT5cbiAgICByZXR1cm4gJycgdW5sZXNzIGJ1ZmZlcj8gYW5kIGN1cnNvcj9cbiAgICBzdGFydCA9IGN1cnNvci5nZXRCZWdpbm5pbmdPZkN1cnJlbnRXb3JkQnVmZmVyUG9zaXRpb24oeyB3b3JkUmVnZXg6IEB3b3JkUmVnZXgsIGFsbG93UHJldmlvdXM6IGZhbHNlIH0pXG4gICAgZW5kID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICByZXR1cm4gJycgdW5sZXNzIHN0YXJ0PyBhbmQgZW5kP1xuICAgIGJ1ZmZlci5nZXRUZXh0SW5SYW5nZShbc3RhcnQsIGVuZF0pXG5cbiAgcHJldHRpZnlUaXRsZTogKHRpdGxlKSAtPlxuICAgIHJldHVybiBpZiBub3QgdGl0bGVcbiAgICBpZiAoY29sb24gPSB0aXRsZS5pbmRleE9mKCc6JykpIGlzbnQgLTEgYW5kIHRpdGxlLnNwbGl0KFwiIFwiKS5sZW5ndGggPiA1XG4gICAgICB0aXRsZSA9IHRpdGxlLnN1YnN0cmluZygwLCBjb2xvbilcblxuICAgICMgbWFrZSB0aXRsZSBpbnRvIHRpdGxlY2FwcywgdHJpbSBsZW5ndGggdG8gMzAgY2hhcnMoaXNoKSBhbmQgYWRkIGVsaXBzaXNcbiAgICB0aXRsZSA9IHRpdGxlY2Fwcyh0aXRsZSlcbiAgICBsID0gaWYgdGl0bGUubGVuZ3RoID4gMzAgdGhlbiAzMCBlbHNlIHRpdGxlLmxlbmd0aFxuICAgIHRpdGxlID0gdGl0bGUuc2xpY2UoMCwgbClcbiAgICBuID0gdGl0bGUubGFzdEluZGV4T2YoXCIgXCIpXG4gICAgdGl0bGUgPSB0aXRsZS5zbGljZSgwLCBuKSArIFwiLi4uXCJcblxuICBwYXJzZUJpYnRleEF1dGhvcnM6IChjaXRhdGlvbnMpIC0+XG4gICAgdmFsaWRDaXRhdGlvbnMgPSBbXVxuICAgIGZvciBjaXRhdGlvbiBpbiBjaXRhdGlvbnNcbiAgICAgIGlmIGNpdGF0aW9uLmVudHJ5VGFncz9cblxuXG4gICAgICAgIGlmIGNpdGF0aW9uLmVudHJ5VGFncy5hdXRob3I/XG4gICAgICAgICAgY2l0YXRpb24uZW50cnlUYWdzLmF1dGhvcnMgPSBAY2xlYW5BdXRob3JzIGNpdGF0aW9uLmVudHJ5VGFncy5hdXRob3Iuc3BsaXQgJyBhbmQgJ1xuXG4gICAgICAgIGlmIGNpdGF0aW9uLmVudHJ5VGFncy5lZGl0b3I/XG4gICAgICAgICAgY2l0YXRpb24uZW50cnlUYWdzLmVkaXRvcnMgPSBAY2xlYW5BdXRob3JzIGNpdGF0aW9uLmVudHJ5VGFncy5lZGl0b3Iuc3BsaXQgJyBhbmQgJ1xuXG4gICAgICAgIHZhbGlkQ2l0YXRpb25zLnB1c2goY2l0YXRpb24pXG5cbiAgICByZXR1cm4gdmFsaWRDaXRhdGlvbnNcblxuICBjbGVhbkF1dGhvcnM6IChhdXRob3JzKSAtPlxuICAgIHJldHVybiBbeyBmYW1pbHlOYW1lOiAnVW5rbm93bicgfV0gaWYgbm90IGF1dGhvcnM/XG5cbiAgICBmb3IgYXV0aG9yIGluIGF1dGhvcnNcbiAgICAgIFtmYW1pbHlOYW1lLCBwZXJzb25hbE5hbWVdID1cbiAgICAgICAgaWYgYXV0aG9yLmluZGV4T2YoJywgJykgaXNudCAtMSB0aGVuIGF1dGhvci5zcGxpdCgnLCAnKSBlbHNlIFthdXRob3JdXG5cbiAgICAgIHsgcGVyc29uYWxOYW1lOiBwZXJzb25hbE5hbWUsIGZhbWlseU5hbWU6IGZhbWlseU5hbWUgfVxuXG4gIHByZXR0aWZ5QXV0aG9yczogKGF1dGhvcnMpIC0+XG4gICAgcmV0dXJuICcnIGlmIG5vdCBhdXRob3JzP1xuICAgIHJldHVybiAnJyBpZiBub3QgYXV0aG9ycy5sZW5ndGhcblxuICAgIG5hbWUgPSBAcHJldHRpZnlOYW1lIGF1dGhvcnNbMF1cblxuICAgICMgcmVtb3ZlIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHt9XG4gICAgbmFtZSA9IG5hbWUucmVwbGFjZSAvKF5cXHt8XFx9JCkvZywgXCJcIlxuXG4gICAgaWYgYXV0aG9ycy5sZW5ndGggPiAxIHRoZW4gXCIje25hbWV9IGV0IGFsLlwiIGVsc2UgXCIje25hbWV9XCJcblxuICBwcmV0dGlmeU5hbWU6IChwZXJzb24sIGludmVydGVkID0gbm8sIHNlcGFyYXRvciA9ICcgJykgLT5cbiAgICBpZiBpbnZlcnRlZFxuICAgICAgQHByZXR0aWZ5TmFtZSB7XG4gICAgICAgIHBlcnNvbmFsTmFtZTogcGVyc29uLmZhbWlseU5hbWUsXG4gICAgICAgIGZhbWlseU5hbWU6IHBlcnNvbi5wZXJzb25hbE5hbWVcbiAgICAgIH0sIG5vLCAnLCAnXG4gICAgZWxzZVxuICAgICAgKGlmIHBlcnNvbi5wZXJzb25hbE5hbWU/IHRoZW4gcGVyc29uLnBlcnNvbmFsTmFtZSBlbHNlICcnKSArIFxcXG4gICAgICAoaWYgcGVyc29uLnBlcnNvbmFsTmFtZT8gYW5kIHBlcnNvbi5mYW1pbHlOYW1lPyB0aGVuIHNlcGFyYXRvciBlbHNlICcnKSArIFxcXG4gICAgICAoaWYgcGVyc29uLmZhbWlseU5hbWU/IHRoZW4gcGVyc29uLmZhbWlseU5hbWUgZWxzZSAnJylcbiJdfQ==
