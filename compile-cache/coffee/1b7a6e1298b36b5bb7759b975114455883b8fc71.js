(function() {
  var Point, Range, actionUtils, editorUtils, emmet, insertSnippet, normalize, path, preprocessSnippet, ref, resources, tabStops, utils, visualize;

  ref = require('atom'), Point = ref.Point, Range = ref.Range;

  path = require('path');

  emmet = require('emmet');

  utils = require('emmet/lib/utils/common');

  tabStops = require('emmet/lib/assets/tabStops');

  resources = require('emmet/lib/assets/resources');

  editorUtils = require('emmet/lib/utils/editor');

  actionUtils = require('emmet/lib/utils/action');

  insertSnippet = function(snippet, editor) {
    var ref1, ref2, ref3, ref4;
    if ((ref1 = atom.packages.getLoadedPackage('snippets')) != null) {
      if ((ref2 = ref1.mainModule) != null) {
        ref2.insert(snippet, editor);
      }
    }
    return editor.snippetExpansion = (ref3 = atom.packages.getLoadedPackage('snippets')) != null ? (ref4 = ref3.mainModule) != null ? ref4.getExpansions(editor)[0] : void 0 : void 0;
  };

  visualize = function(str) {
    return str.replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\s/g, '\\s');
  };

  normalize = function(text, editor) {
    return editorUtils.normalize(text, {
      indentation: editor.getTabText(),
      newline: '\n'
    });
  };

  preprocessSnippet = function(value) {
    var order, tabstopOptions;
    order = [];
    tabstopOptions = {
      tabstop: function(data) {
        var group, placeholder;
        group = parseInt(data.group, 10);
        if (group === 0) {
          order.push(-1);
          group = order.length;
        } else {
          if (order.indexOf(group) === -1) {
            order.push(group);
          }
          group = order.indexOf(group) + 1;
        }
        placeholder = data.placeholder || '';
        if (placeholder) {
          placeholder = tabStops.processText(placeholder, tabstopOptions);
        }
        if (placeholder) {
          return "${" + group + ":" + placeholder + "}";
        } else {
          return "${" + group + "}";
        }
      },
      escape: function(ch) {
        if (ch === '$') {
          return '\\$';
        } else {
          return ch;
        }
      }
    };
    return tabStops.processText(value, tabstopOptions);
  };

  module.exports = {
    setup: function(editor1, selectionIndex) {
      var buf, bufRanges;
      this.editor = editor1;
      this.selectionIndex = selectionIndex != null ? selectionIndex : 0;
      buf = this.editor.getBuffer();
      bufRanges = this.editor.getSelectedBufferRanges();
      return this._selection = {
        index: 0,
        saved: new Array(bufRanges.length),
        bufferRanges: bufRanges,
        indexRanges: bufRanges.map(function(range) {
          return {
            start: buf.characterIndexForPosition(range.start),
            end: buf.characterIndexForPosition(range.end)
          };
        })
      };
    },
    exec: function(fn) {
      var ix, success;
      ix = this._selection.bufferRanges.length - 1;
      this._selection.saved = [];
      success = true;
      while (ix >= 0) {
        this._selection.index = ix;
        if (fn(this._selection.index) === false) {
          success = false;
          break;
        }
        ix--;
      }
      if (success && this._selection.saved.length > 1) {
        return this._setSelectedBufferRanges(this._selection.saved);
      }
    },
    _setSelectedBufferRanges: function(sels) {
      var filteredSels;
      filteredSels = sels.filter(function(s) {
        return !!s;
      });
      if (filteredSels.length) {
        return this.editor.setSelectedBufferRanges(filteredSels);
      }
    },
    _saveSelection: function(delta) {
      var i, range, results;
      this._selection.saved[this._selection.index] = this.editor.getSelectedBufferRange();
      if (delta) {
        i = this._selection.index;
        delta = Point.fromObject([delta, 0]);
        results = [];
        while (++i < this._selection.saved.length) {
          range = this._selection.saved[i];
          if (range) {
            results.push(this._selection.saved[i] = new Range(range.start.translate(delta), range.end.translate(delta)));
          } else {
            results.push(void 0);
          }
        }
        return results;
      }
    },
    selectionList: function() {
      return this._selection.indexRanges;
    },
    getCaretPos: function() {
      return this.getSelectionRange().start;
    },
    setCaretPos: function(pos) {
      return this.createSelection(pos);
    },
    getSelectionRange: function() {
      return this._selection.indexRanges[this._selection.index];
    },
    getSelectionBufferRange: function() {
      return this._selection.bufferRanges[this._selection.index];
    },
    createSelection: function(start, end) {
      var buf, sels;
      if (end == null) {
        end = start;
      }
      sels = this._selection.bufferRanges;
      buf = this.editor.getBuffer();
      sels[this._selection.index] = new Range(buf.positionForCharacterIndex(start), buf.positionForCharacterIndex(end));
      return this._setSelectedBufferRanges(sels);
    },
    getSelection: function() {
      return this.editor.getTextInBufferRange(this.getSelectionBufferRange());
    },
    getCurrentLineRange: function() {
      var index, lineLength, row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      lineLength = this.editor.lineTextForBufferRow(row).length;
      index = this.editor.getBuffer().characterIndexForPosition({
        row: row,
        column: 0
      });
      return {
        start: index,
        end: index + lineLength
      };
    },
    getCurrentLine: function() {
      var row, sel;
      sel = this.getSelectionBufferRange();
      row = sel.getRows()[0];
      return this.editor.lineTextForBufferRow(row);
    },
    getContent: function() {
      return this.editor.getText();
    },
    replaceContent: function(value, start, end, noIndent) {
      var buf, caret, changeRange, oldValue;
      if (end == null) {
        end = start == null ? this.getContent().length : start;
      }
      if (start == null) {
        start = 0;
      }
      value = normalize(value, this.editor);
      buf = this.editor.getBuffer();
      changeRange = new Range(Point.fromObject(buf.positionForCharacterIndex(start)), Point.fromObject(buf.positionForCharacterIndex(end)));
      oldValue = this.editor.getTextInBufferRange(changeRange);
      buf.setTextInRange(changeRange, '');
      caret = buf.positionForCharacterIndex(start);
      this.editor.setSelectedBufferRange(new Range(caret, caret));
      insertSnippet(preprocessSnippet(value), this.editor);
      this._saveSelection(utils.splitByLines(value).length - utils.splitByLines(oldValue).length);
      return value;
    },
    getGrammar: function() {
      return this.editor.getGrammar().scopeName.toLowerCase();
    },
    getSyntax: function() {
      var m, ref1, scope, sourceSyntax, syntax;
      scope = this.getCurrentScope().join(' ');
      if (~scope.indexOf('xsl')) {
        return 'xsl';
      }
      if (!/\bstring\b/.test(scope) && /\bsource\.(js|ts)x?\b/.test(scope)) {
        return 'jsx';
      }
      sourceSyntax = (ref1 = scope.match(/\bsource\.([\w\-]+)/)) != null ? ref1[0] : void 0;
      if (!/\bstring\b/.test(scope) && sourceSyntax && resources.hasSyntax(sourceSyntax)) {
        syntax = sourceSyntax;
      } else {
        m = scope.match(/\b(source|text)\.[\w\-\.]+/);
        syntax = m != null ? m[0].split('.').reduceRight(function(result, token) {
          return result || (resources.hasSyntax(token) ? token : void 0);
        }, null) : void 0;
      }
      return actionUtils.detectSyntax(this, syntax || 'html');
    },
    getCurrentScope: function() {
      var range;
      range = this._selection.bufferRanges[this._selection.index];
      return this.editor.scopeDescriptorForBufferPosition(range.start).getScopesArray();
    },
    getProfileName: function() {
      if (this.getCurrentScope().some(function(scope) {
        return /\bstring\.quoted\b/.test(scope);
      })) {
        return 'line';
      } else {
        return actionUtils.detectProfile(this);
      }
    },
    getFilePath: function() {
      return this.editor.buffer.file.path;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2VtbWV0L2xpYi9lZGl0b3ItcHJveHkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGlCQUFELEVBQVE7O0VBQ1IsSUFBQSxHQUFpQixPQUFBLENBQVEsTUFBUjs7RUFFakIsS0FBQSxHQUFjLE9BQUEsQ0FBUSxPQUFSOztFQUNkLEtBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVI7O0VBQ2QsUUFBQSxHQUFjLE9BQUEsQ0FBUSwyQkFBUjs7RUFDZCxTQUFBLEdBQWMsT0FBQSxDQUFRLDRCQUFSOztFQUNkLFdBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVI7O0VBQ2QsV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUjs7RUFFZCxhQUFBLEdBQWdCLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDZCxRQUFBOzs7WUFBc0QsQ0FBRSxNQUF4RCxDQUErRCxPQUEvRCxFQUF3RSxNQUF4RTs7O1dBR0EsTUFBTSxDQUFDLGdCQUFQLHdHQUFnRixDQUFFLGFBQXhELENBQXNFLE1BQXRFLENBQThFLENBQUEsQ0FBQTtFQUoxRjs7RUFNaEIsU0FBQSxHQUFZLFNBQUMsR0FBRDtXQUNWLEdBQ0UsQ0FBQyxPQURILENBQ1csS0FEWCxFQUNrQixLQURsQixDQUVFLENBQUMsT0FGSCxDQUVXLEtBRlgsRUFFa0IsS0FGbEIsQ0FHRSxDQUFDLE9BSEgsQ0FHVyxLQUhYLEVBR2tCLEtBSGxCO0VBRFU7O0VBV1osU0FBQSxHQUFZLFNBQUMsSUFBRCxFQUFPLE1BQVA7V0FDVixXQUFXLENBQUMsU0FBWixDQUFzQixJQUF0QixFQUNFO01BQUEsV0FBQSxFQUFhLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBYjtNQUNBLE9BQUEsRUFBUyxJQURUO0tBREY7RUFEVTs7RUFRWixpQkFBQSxHQUFvQixT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WjtRQUNKLE1BQUEsZUFBUyxDQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsS0FBTixDQUFZLEdBQVosQ0FBZ0IsQ0FBQyxXQUFqQixDQUE2QixTQUFDLE1BQUQsRUFBUyxLQUFUO2lCQUNsQyxNQUFBLElBQVUsQ0FBVSxTQUFTLENBQUMsU0FBVixDQUFvQixLQUFwQixDQUFULEdBQUEsS0FBQSxHQUFBLE1BQUQ7UUFEd0IsQ0FBN0IsRUFFTCxJQUZLLFdBTFg7O2FBU0EsV0FBVyxDQUFDLFlBQVosQ0FBeUIsSUFBekIsRUFBNEIsTUFBQSxJQUFVLE1BQXRDO0lBaEJTLENBakpYO0lBbUtBLGVBQUEsRUFBaUIsU0FBQTtBQUNmLFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxZQUFhLENBQUEsSUFBQyxDQUFBLFVBQVUsQ0FBQyxLQUFaO2FBQ2pDLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0NBQVIsQ0FBeUMsS0FBSyxDQUFDLEtBQS9DLENBQXFELENBQUMsY0FBdEQsQ0FBQTtJQUZlLENBbktqQjtJQTBLQSxjQUFBLEVBQWdCLFNBQUE7TUFDUCxJQUFHLElBQUMsQ0FBQSxlQUFELENBQUEsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixTQUFDLEtBQUQ7ZUFBVyxvQkFBb0IsQ0FBQyxJQUFyQixDQUEwQixLQUExQjtNQUFYLENBQXhCLENBQUg7ZUFBNEUsT0FBNUU7T0FBQSxNQUFBO2VBQXdGLFdBQVcsQ0FBQyxhQUFaLENBQTBCLElBQTFCLEVBQXhGOztJQURPLENBMUtoQjtJQThLQSxXQUFBLEVBQWEsU0FBQTthQUVYLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztJQUZULENBOUtiOztBQTdERiIsInNvdXJjZXNDb250ZW50IjpbIntQb2ludCwgUmFuZ2V9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggICAgICAgICAgID0gcmVxdWlyZSAncGF0aCdcblxuZW1tZXQgICAgICAgPSByZXF1aXJlICdlbW1ldCdcbnV0aWxzICAgICAgID0gcmVxdWlyZSAnZW1tZXQvbGliL3V0aWxzL2NvbW1vbidcbnRhYlN0b3BzICAgID0gcmVxdWlyZSAnZW1tZXQvbGliL2Fzc2V0cy90YWJTdG9wcydcbnJlc291cmNlcyAgID0gcmVxdWlyZSAnZW1tZXQvbGliL2Fzc2V0cy9yZXNvdXJjZXMnXG5lZGl0b3JVdGlscyA9IHJlcXVpcmUgJ2VtbWV0L2xpYi91dGlscy9lZGl0b3InXG5hY3Rpb25VdGlscyA9IHJlcXVpcmUgJ2VtbWV0L2xpYi91dGlscy9hY3Rpb24nXG5cbmluc2VydFNuaXBwZXQgPSAoc25pcHBldCwgZWRpdG9yKSAtPlxuICBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ3NuaXBwZXRzJyk/Lm1haW5Nb2R1bGU/Lmluc2VydChzbmlwcGV0LCBlZGl0b3IpXG5cbiAgIyBGZXRjaCBleHBhbnNpb25zIGFuZCBhc3NpZ24gdG8gZWRpdG9yXG4gIGVkaXRvci5zbmlwcGV0RXhwYW5zaW9uID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdzbmlwcGV0cycpPy5tYWluTW9kdWxlPy5nZXRFeHBhbnNpb25zKGVkaXRvcilbMF1cblxudmlzdWFsaXplID0gKHN0cikgLT5cbiAgc3RyXG4gICAgLnJlcGxhY2UoL1xcdC9nLCAnXFxcXHQnKVxuICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcbiAgICAucmVwbGFjZSgvXFxzL2csICdcXFxccycpXG5cbiMgTm9ybWFsaXplcyB0ZXh0IGJlZm9yZSBpdCBnb2VzIHRvIGVkaXRvcjogcmVwbGFjZXMgaW5kZW50YXRpb25cbiMgYW5kIG5ld2xpbmVzIHdpdGggb25lcyB1c2VkIGluIGVkaXRvclxuIyBAcGFyYW0gIHtTdHJpbmd9IHRleHQgICBUZXh0IHRvIG5vcm1hbGl6ZVxuIyBAcGFyYW0gIHtFZGl0b3J9IGVkaXRvciBCcmFja2V0cyBlZGl0b3IgaW5zdGFuY2VcbiMgQHJldHVybiB7U3RyaW5nfVxubm9ybWFsaXplID0gKHRleHQsIGVkaXRvcikgLT5cbiAgZWRpdG9yVXRpbHMubm9ybWFsaXplIHRleHQsXG4gICAgaW5kZW50YXRpb246IGVkaXRvci5nZXRUYWJUZXh0KCksXG4gICAgbmV3bGluZTogJ1xcbidcblxuIyBQcm9wcm9jZXNzIHRleHQgZGF0YSB0aGF0IHNob3VsZCBiZSB1c2VkIGFzIHNuaXBwZXQgY29udGVudFxuIyBDdXJyZW50bHksIEF0b23igJlzIHNuaXBwZXRzIGltcGxlbWVudGF0aW9uIGhhcyB0aGUgZm9sbG93aW5nIGlzc3VlczpcbiMgKiBtdWx0aXBsZSAkMCBhcmUgbm90IHRyZWF0ZWQgYXMgZGlzdGluY3QgZmluYWwgdGFic3RvcHNcbnByZXByb2Nlc3NTbmlwcGV0ID0gKHZhbHVlKSAtPlxuICBvcmRlciA9IFtdXG5cbiAgdGFic3RvcE9wdGlvbnMgPVxuICAgIHRhYnN0b3A6IChkYXRhKSAtPlxuICAgICAgZ3JvdXAgPSBwYXJzZUludChkYXRhLmdyb3VwLCAxMClcbiAgICAgIGlmIGdyb3VwIGlzIDBcbiAgICAgICAgb3JkZXIucHVzaCgtMSlcbiAgICAgICAgZ3JvdXAgPSBvcmRlci5sZW5ndGhcbiAgICAgIGVsc2VcbiAgICAgICAgb3JkZXIucHVzaChncm91cCkgaWYgb3JkZXIuaW5kZXhPZihncm91cCkgaXMgLTFcbiAgICAgICAgZ3JvdXAgPSBvcmRlci5pbmRleE9mKGdyb3VwKSArIDFcblxuICAgICAgcGxhY2Vob2xkZXIgPSBkYXRhLnBsYWNlaG9sZGVyIG9yICcnXG4gICAgICBpZiBwbGFjZWhvbGRlclxuICAgICAgICAjIHJlY3Vyc2l2ZWx5IHVwZGF0ZSBuZXN0ZWQgdGFic3RvcHNcbiAgICAgICAgcGxhY2Vob2xkZXIgPSB0YWJTdG9wcy5wcm9jZXNzVGV4dChwbGFjZWhvbGRlciwgdGFic3RvcE9wdGlvbnMpXG5cbiAgICAgIGlmIHBsYWNlaG9sZGVyIHRoZW4gXCIkeyN7Z3JvdXB9OiN7cGxhY2Vob2xkZXJ9fVwiIGVsc2UgXCIkeyN7Z3JvdXB9fVwiXG5cbiAgICBlc2NhcGU6IChjaCkgLT5cbiAgICAgIGlmIGNoID09ICckJyB0aGVuICdcXFxcJCcgZWxzZSBjaFxuXG4gIHRhYlN0b3BzLnByb2Nlc3NUZXh0KHZhbHVlLCB0YWJzdG9wT3B0aW9ucylcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzZXR1cDogKEBlZGl0b3IsIEBzZWxlY3Rpb25JbmRleD0wKSAtPlxuICAgIGJ1ZiA9IEBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICBidWZSYW5nZXMgPSBAZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKClcbiAgICBAX3NlbGVjdGlvbiA9XG4gICAgICBpbmRleDogMFxuICAgICAgc2F2ZWQ6IG5ldyBBcnJheShidWZSYW5nZXMubGVuZ3RoKVxuICAgICAgYnVmZmVyUmFuZ2VzOiBidWZSYW5nZXNcbiAgICAgIGluZGV4UmFuZ2VzOiBidWZSYW5nZXMubWFwIChyYW5nZSkgLT5cbiAgICAgICAgICBzdGFydDogYnVmLmNoYXJhY3RlckluZGV4Rm9yUG9zaXRpb24ocmFuZ2Uuc3RhcnQpXG4gICAgICAgICAgZW5kOiAgIGJ1Zi5jaGFyYWN0ZXJJbmRleEZvclBvc2l0aW9uKHJhbmdlLmVuZClcblxuICAjIEV4ZWN1dGVzIGdpdmVuIGZ1bmN0aW9uIGZvciBldmVyeSBzZWxlY3Rpb25cbiAgZXhlYzogKGZuKSAtPlxuICAgIGl4ID0gQF9zZWxlY3Rpb24uYnVmZmVyUmFuZ2VzLmxlbmd0aCAtIDFcbiAgICBAX3NlbGVjdGlvbi5zYXZlZCA9IFtdXG4gICAgc3VjY2VzcyA9IHRydWVcbiAgICB3aGlsZSBpeCA+PSAwXG4gICAgICBAX3NlbGVjdGlvbi5pbmRleCA9IGl4XG4gICAgICBpZiBmbihAX3NlbGVjdGlvbi5pbmRleCkgaXMgZmFsc2VcbiAgICAgICAgc3VjY2VzcyA9IGZhbHNlXG4gICAgICAgIGJyZWFrXG4gICAgICBpeC0tXG5cbiAgICBpZiBzdWNjZXNzIGFuZCBAX3NlbGVjdGlvbi5zYXZlZC5sZW5ndGggPiAxXG4gICAgICBAX3NldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKEBfc2VsZWN0aW9uLnNhdmVkKVxuXG4gIF9zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlczogKHNlbHMpIC0+XG4gICAgZmlsdGVyZWRTZWxzID0gc2Vscy5maWx0ZXIgKHMpIC0+ICEhc1xuICAgIGlmIGZpbHRlcmVkU2Vscy5sZW5ndGhcbiAgICAgIEBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoZmlsdGVyZWRTZWxzKVxuXG4gIF9zYXZlU2VsZWN0aW9uOiAoZGVsdGEpIC0+XG4gICAgQF9zZWxlY3Rpb24uc2F2ZWRbQF9zZWxlY3Rpb24uaW5kZXhdID0gQGVkaXRvci5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKClcbiAgICBpZiBkZWx0YVxuICAgICAgaSA9IEBfc2VsZWN0aW9uLmluZGV4XG4gICAgICBkZWx0YSA9IFBvaW50LmZyb21PYmplY3QoW2RlbHRhLCAwXSlcbiAgICAgIHdoaWxlICsraSA8IEBfc2VsZWN0aW9uLnNhdmVkLmxlbmd0aFxuICAgICAgICByYW5nZSA9IEBfc2VsZWN0aW9uLnNhdmVkW2ldXG4gICAgICAgIGlmIHJhbmdlXG4gICAgICAgICAgQF9zZWxlY3Rpb24uc2F2ZWRbaV0gPSBuZXcgUmFuZ2UocmFuZ2Uuc3RhcnQudHJhbnNsYXRlKGRlbHRhKSwgcmFuZ2UuZW5kLnRyYW5zbGF0ZShkZWx0YSkpXG5cbiAgc2VsZWN0aW9uTGlzdDogLT5cbiAgICBAX3NlbGVjdGlvbi5pbmRleFJhbmdlc1xuXG4gICMgUmV0dXJucyB0aGUgY3VycmVudCBjYXJldCBwb3NpdGlvbi5cbiAgZ2V0Q2FyZXRQb3M6IC0+XG4gICAgQGdldFNlbGVjdGlvblJhbmdlKCkuc3RhcnRcblxuICAjIFNldHMgdGhlIGN1cnJlbnQgY2FyZXQgcG9zaXRpb24uXG4gIHNldENhcmV0UG9zOiAocG9zKSAtPlxuICAgIEBjcmVhdGVTZWxlY3Rpb24ocG9zKVxuXG4gICMgRmV0Y2hlcyB0aGUgY2hhcmFjdGVyIGluZGV4ZXMgb2YgdGhlIHNlbGVjdGVkIHRleHQuXG4gICMgUmV0dXJucyBhbiB7T2JqZWN0fSB3aXRoIGBzdGFydGAgYW5kIGBlbmRgIHByb3BlcnRpZXMuXG4gIGdldFNlbGVjdGlvblJhbmdlOiAtPlxuICAgIEBfc2VsZWN0aW9uLmluZGV4UmFuZ2VzW0Bfc2VsZWN0aW9uLmluZGV4XVxuXG4gIGdldFNlbGVjdGlvbkJ1ZmZlclJhbmdlOiAtPlxuICAgIEBfc2VsZWN0aW9uLmJ1ZmZlclJhbmdlc1tAX3NlbGVjdGlvbi5pbmRleF1cblxuICAjIENyZWF0ZXMgYSBzZWxlY3Rpb24gZnJvbSB0aGUgYHN0YXJ0YCB0byBgZW5kYCBjaGFyYWN0ZXIgaW5kZXhlcy5cbiAgI1xuICAjIElmIGBlbmRgIGlzIG9tbWl0ZWQsIHRoaXMgbWV0aG9kIHNob3VsZCBwbGFjZSBhIGNhcmV0IGF0IHRoZSBgc3RhcnRgIGluZGV4LlxuICAjXG4gICMgc3RhcnQgLSBBIHtOdW1iZXJ9IHJlcHJlc2VudGluZyB0aGUgc3RhcnRpbmcgY2hhcmFjdGVyIGluZGV4XG4gICMgZW5kIC0gQSB7TnVtYmVyfSByZXByZXNlbnRpbmcgdGhlIGVuZGluZyBjaGFyYWN0ZXIgaW5kZXhcbiAgY3JlYXRlU2VsZWN0aW9uOiAoc3RhcnQsIGVuZD1zdGFydCkgLT5cbiAgICBzZWxzID0gQF9zZWxlY3Rpb24uYnVmZmVyUmFuZ2VzXG4gICAgYnVmID0gQGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIHNlbHNbQF9zZWxlY3Rpb24uaW5kZXhdID0gbmV3IFJhbmdlKGJ1Zi5wb3NpdGlvbkZvckNoYXJhY3RlckluZGV4KHN0YXJ0KSwgYnVmLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoZW5kKSlcbiAgICBAX3NldFNlbGVjdGVkQnVmZmVyUmFuZ2VzKHNlbHMpXG5cbiAgIyBSZXR1cm5zIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgdGV4dC5cbiAgZ2V0U2VsZWN0aW9uOiAtPlxuICAgIEBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoQGdldFNlbGVjdGlvbkJ1ZmZlclJhbmdlKCkpXG5cbiAgIyBGZXRjaGVzIHRoZSBjdXJyZW50IGxpbmUncyBzdGFydCBhbmQgZW5kIGluZGV4ZXMuXG4gICNcbiAgIyBSZXR1cm5zIGFuIHtPYmplY3R9IHdpdGggYHN0YXJ0YCBhbmQgYGVuZGAgcHJvcGVydGllc1xuICBnZXRDdXJyZW50TGluZVJhbmdlOiAtPlxuICAgIHNlbCA9IEBnZXRTZWxlY3Rpb25CdWZmZXJSYW5nZSgpXG4gICAgcm93ID0gc2VsLmdldFJvd3MoKVswXVxuICAgIGxpbmVMZW5ndGggPSBAZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHJvdykubGVuZ3RoXG4gICAgaW5kZXggPSBAZWRpdG9yLmdldEJ1ZmZlcigpLmNoYXJhY3RlckluZGV4Rm9yUG9zaXRpb24oe3Jvdzogcm93LCBjb2x1bW46IDB9KVxuICAgIHJldHVybiB7XG4gICAgICBzdGFydDogaW5kZXhcbiAgICAgIGVuZDogaW5kZXggKyBsaW5lTGVuZ3RoXG4gICAgfVxuXG4gICMgUmV0dXJucyB0aGUgY3VycmVudCBsaW5lLlxuICBnZXRDdXJyZW50TGluZTogLT5cbiAgICBzZWwgPSBAZ2V0U2VsZWN0aW9uQnVmZmVyUmFuZ2UoKVxuICAgIHJvdyA9IHNlbC5nZXRSb3dzKClbMF1cbiAgICByZXR1cm4gQGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhyb3cpXG5cbiAgIyBSZXR1cm5zIHRoZSBlZGl0b3IgY29udGVudC5cbiAgZ2V0Q29udGVudDogLT5cbiAgICByZXR1cm4gQGVkaXRvci5nZXRUZXh0KClcblxuICAjIFJlcGxhY2UgdGhlIGVkaXRvcidzIGNvbnRlbnQgKG9yIHBhcnQgb2YgaXQsIGlmIHVzaW5nIGBzdGFydGAgdG9cbiAgIyBgZW5kYCBpbmRleCkuXG4gICNcbiAgIyBJZiBgdmFsdWVgIGNvbnRhaW5zIGBjYXJldF9wbGFjZWhvbGRlcmAsIHRoZSBlZGl0b3IgcHV0cyBhIGNhcmV0IGludG9cbiAgIyB0aGlzIHBvc2l0aW9uLiBJZiB5b3Ugc2tpcCB0aGUgYHN0YXJ0YCBhbmQgYGVuZGAgYXJndW1lbnRzLCB0aGUgd2hvbGUgdGFyZ2V0J3NcbiAgIyBjb250ZW50IGlzIHJlcGxhY2VkIHdpdGggYHZhbHVlYC5cbiAgI1xuICAjIElmIHlvdSBwYXNzIGp1c3QgdGhlIGBzdGFydGAgYXJndW1lbnQsIHRoZSBgdmFsdWVgIGlzIHBsYWNlZCBhdCB0aGUgYHN0YXJ0YCBzdHJpbmdcbiAgIyBpbmRleCBvZiB0aHIgY3VycmVudCBjb250ZW50LlxuICAjXG4gICMgSWYgeW91IHBhc3MgYm90aCBgc3RhcnRgIGFuZCBgZW5kYCBhcmd1bWVudHMsIHRoZSBjb3JyZXNwb25kaW5nIHN1YnN0cmluZyBvZlxuICAjIHRoZSBjdXJyZW50IHRhcmdldCdzIGNvbnRlbnQgaXMgcmVwbGFjZWQgd2l0aCBgdmFsdWVgLlxuICAjXG4gICMgdmFsdWUgLSBBIHtTdHJpbmd9IG9mIGNvbnRlbnQgeW91IHdhbnQgdG8gcGFzdGVcbiAgIyBzdGFydCAtIFRoZSBvcHRpb25hbCBzdGFydCBpbmRleCB7TnVtYmVyfSBvZiB0aGUgZWRpdG9yJ3MgY29udGVudFxuICAjIGVuZCAtIFRoZSBvcHRpb25hbCBlbmQgaW5kZXgge051bWJlcn0gb2YgdGhlIGVkaXRvcidzIGNvbnRlbnRcbiAgIyBub0lkZW50IC0gQW4gb3B0aW9uYWwge0Jvb2xlYW59IHdoaWNoLCBpZiBgdHJ1ZWAsIGRvZXMgbm90IGF0dGVtcHQgdG8gYXV0byBpbmRlbnQgYHZhbHVlYFxuICByZXBsYWNlQ29udGVudDogKHZhbHVlLCBzdGFydCwgZW5kLCBub0luZGVudCkgLT5cbiAgICB1bmxlc3MgZW5kP1xuICAgICAgZW5kID0gdW5sZXNzIHN0YXJ0PyB0aGVuIEBnZXRDb250ZW50KCkubGVuZ3RoIGVsc2Ugc3RhcnRcbiAgICBzdGFydCA9IDAgdW5sZXNzIHN0YXJ0P1xuXG4gICAgdmFsdWUgPSBub3JtYWxpemUodmFsdWUsIEBlZGl0b3IpXG4gICAgYnVmID0gQGVkaXRvci5nZXRCdWZmZXIoKVxuICAgIGNoYW5nZVJhbmdlID0gbmV3IFJhbmdlKFxuICAgICAgUG9pbnQuZnJvbU9iamVjdChidWYucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChzdGFydCkpLFxuICAgICAgUG9pbnQuZnJvbU9iamVjdChidWYucG9zaXRpb25Gb3JDaGFyYWN0ZXJJbmRleChlbmQpKVxuICAgIClcblxuICAgIG9sZFZhbHVlID0gQGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZShjaGFuZ2VSYW5nZSlcbiAgICBidWYuc2V0VGV4dEluUmFuZ2UoY2hhbmdlUmFuZ2UsICcnKVxuICAgICMgQmVmb3JlIGluc2VydGluZyBzbmlwcGV0IHdlIGhhdmUgdG8gcmVzZXQgYWxsIGF2YWlsYWJsZSBzZWxlY3Rpb25zXG4gICAgIyB0byBpbnNlcnQgc25pcHBlbnQgcmlnaHQgaW4gcmVxdWlyZWQgcGxhY2UuIE90aGVyd2lzZSBzbmlwcGV0XG4gICAgIyB3aWxsIGJlIGluc2VydGVkIGZvciBlYWNoIHNlbGVjdGlvbiBpbiBlZGl0b3JcblxuICAgICMgUmlnaHQgYWZ0ZXIgdGhhdCB3ZSBzaG91bGQgc2F2ZSBmaXJzdCBhdmFpbGFibGUgc2VsZWN0aW9uIGFzIGJ1ZmZlciByYW5nZVxuICAgIGNhcmV0ID0gYnVmLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoc3RhcnQpXG4gICAgQGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKG5ldyBSYW5nZShjYXJldCwgY2FyZXQpKVxuICAgIGluc2VydFNuaXBwZXQgcHJlcHJvY2Vzc1NuaXBwZXQodmFsdWUpLCBAZWRpdG9yXG4gICAgQF9zYXZlU2VsZWN0aW9uKHV0aWxzLnNwbGl0QnlMaW5lcyh2YWx1ZSkubGVuZ3RoIC0gdXRpbHMuc3BsaXRCeUxpbmVzKG9sZFZhbHVlKS5sZW5ndGgpXG4gICAgdmFsdWVcblxuICBnZXRHcmFtbWFyOiAtPlxuICAgIEBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgIyBSZXR1cm5zIHRoZSBlZGl0b3IncyBzeW50YXggbW9kZS5cbiAgZ2V0U3ludGF4OiAtPlxuICAgIHNjb3BlID0gQGdldEN1cnJlbnRTY29wZSgpLmpvaW4oJyAnKVxuICAgIHJldHVybiAneHNsJyBpZiB+c2NvcGUuaW5kZXhPZigneHNsJylcbiAgICByZXR1cm4gJ2pzeCcgaWYgbm90IC9cXGJzdHJpbmdcXGIvLnRlc3Qoc2NvcGUpICYmIC9cXGJzb3VyY2VcXC4oanN8dHMpeD9cXGIvLnRlc3Qoc2NvcGUpXG5cbiAgICBzb3VyY2VTeW50YXggPSBzY29wZS5tYXRjaCgvXFxic291cmNlXFwuKFtcXHdcXC1dKykvKT9bMF1cblxuICAgIGlmIG5vdCAvXFxic3RyaW5nXFxiLy50ZXN0KHNjb3BlKSAmJiBzb3VyY2VTeW50YXggJiYgcmVzb3VyY2VzLmhhc1N5bnRheChzb3VyY2VTeW50YXgpXG4gICAgICBzeW50YXggPSBzb3VyY2VTeW50YXg7XG4gICAgZWxzZVxuICAgICAgIyBwcm9iZSBzeW50YXggYmFzZWQgb24gY3VycmVudCBzZWxlY3RvclxuICAgICAgbSA9IHNjb3BlLm1hdGNoKC9cXGIoc291cmNlfHRleHQpXFwuW1xcd1xcLVxcLl0rLylcbiAgICAgIHN5bnRheCA9IG0/WzBdLnNwbGl0KCcuJykucmVkdWNlUmlnaHQgKHJlc3VsdCwgdG9rZW4pIC0+XG4gICAgICAgICAgcmVzdWx0IG9yICh0b2tlbiBpZiByZXNvdXJjZXMuaGFzU3ludGF4IHRva2VuKVxuICAgICAgICAsIG51bGxcblxuICAgIGFjdGlvblV0aWxzLmRldGVjdFN5bnRheChALCBzeW50YXggb3IgJ2h0bWwnKVxuXG4gIGdldEN1cnJlbnRTY29wZTogLT5cbiAgICByYW5nZSA9IEBfc2VsZWN0aW9uLmJ1ZmZlclJhbmdlc1tAX3NlbGVjdGlvbi5pbmRleF1cbiAgICBAZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKHJhbmdlLnN0YXJ0KS5nZXRTY29wZXNBcnJheSgpXG5cbiAgIyBSZXR1cm5zIHRoZSBjdXJyZW50IG91dHB1dCBwcm9maWxlIG5hbWVcbiAgI1xuICAjIFNlZSBlbW1ldC5zZXR1cFByb2ZpbGUgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gIGdldFByb2ZpbGVOYW1lOiAtPlxuICAgIHJldHVybiBpZiBAZ2V0Q3VycmVudFNjb3BlKCkuc29tZSgoc2NvcGUpIC0+IC9cXGJzdHJpbmdcXC5xdW90ZWRcXGIvLnRlc3Qgc2NvcGUpIHRoZW4gJ2xpbmUnIGVsc2UgYWN0aW9uVXRpbHMuZGV0ZWN0UHJvZmlsZShAKVxuXG4gICMgUmV0dXJucyB0aGUgY3VycmVudCBlZGl0b3IncyBmaWxlIHBhdGhcbiAgZ2V0RmlsZVBhdGg6IC0+XG4gICAgIyBpcyB0aGVyZSBhIGJldHRlciB3YXkgdG8gZ2V0IHRoaXM/XG4gICAgQGVkaXRvci5idWZmZXIuZmlsZS5wYXRoXG4iXX0=
