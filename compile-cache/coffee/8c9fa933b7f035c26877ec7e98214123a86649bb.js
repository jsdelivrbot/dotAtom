(function() {
  var CompositeDisposable, ConfigSchema, isOpeningTagLikePattern,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  isOpeningTagLikePattern = /<(?![\!\/])([a-z]{1}[^>\s=\'\"]*)[^>]*>$/i;

  ConfigSchema = require('./configuration.coffee');

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: ConfigSchema.config,
    neverClose: [],
    forceInline: [],
    forceBlock: [],
    makeNeverCloseSelfClosing: false,
    ignoreGrammar: false,
    legacyMode: false,
    activate: function() {
      this.autocloseHTMLEvents = new CompositeDisposable;
      atom.commands.add('atom-text-editor', {
        'autoclose-html:close-and-complete': (function(_this) {
          return function(e) {
            if (_this.legacyMode) {
              console.log(e);
              return e.abortKeyBinding();
            } else {
              atom.workspace.getActiveTextEditor().insertText(">");
              return _this.execAutoclose();
            }
          };
        })(this)
      });
      atom.config.observe('autoclose-html.neverClose', (function(_this) {
        return function(value) {
          return _this.neverClose = value;
        };
      })(this));
      atom.config.observe('autoclose-html.forceInline', (function(_this) {
        return function(value) {
          return _this.forceInline = value;
        };
      })(this));
      atom.config.observe('autoclose-html.forceBlock', (function(_this) {
        return function(value) {
          return _this.forceBlock = value;
        };
      })(this));
      atom.config.observe('autoclose-html.makeNeverCloseSelfClosing', (function(_this) {
        return function(value) {
          return _this.makeNeverCloseSelfClosing = value;
        };
      })(this));
      return atom.config.observe('autoclose-html.legacyMode', (function(_this) {
        return function(value) {
          _this.legacyMode = value;
          if (_this.legacyMode) {
            return _this._events();
          } else {
            return _this._unbindEvents();
          }
        };
      })(this));
    },
    deactivate: function() {
      if (this.legacyMode) {
        return this._unbindEvents();
      }
    },
    isInline: function(eleTag) {
      var ele, ref, ref1, ref2, ret;
      if (this.forceInline.indexOf("*") > -1) {
        return true;
      }
      try {
        ele = document.createElement(eleTag);
      } catch (error) {
        return false;
      }
      if (ref = eleTag.toLowerCase(), indexOf.call(this.forceBlock, ref) >= 0) {
        return false;
      } else if (ref1 = eleTag.toLowerCase(), indexOf.call(this.forceInline, ref1) >= 0) {
        return true;
      }
      document.body.appendChild(ele);
      ret = (ref2 = window.getComputedStyle(ele).getPropertyValue('display')) === 'inline' || ref2 === 'inline-block' || ref2 === 'none';
      document.body.removeChild(ele);
      return ret;
    },
    isNeverClosed: function(eleTag) {
      var ref;
      return ref = eleTag.toLowerCase(), indexOf.call(this.neverClose, ref) >= 0;
    },
    execAutoclose: function() {
      var doubleQuotes, editor, eleTag, index, isInline, line, matches, oddDoubleQuotes, oddSingleQuotes, partial, range, singleQuotes, tag;
      editor = atom.workspace.getActiveTextEditor();
      range = editor.selections[0].getBufferRange();
      line = editor.buffer.getLines()[range.end.row];
      partial = line.substr(0, range.start.column);
      partial = partial.substr(partial.lastIndexOf('<'));
      if (partial.substr(partial.length - 1, 1) === '/') {
        return;
      }
      singleQuotes = partial.match(/\'/g);
      doubleQuotes = partial.match(/\"/g);
      oddSingleQuotes = singleQuotes && (singleQuotes.length % 2);
      oddDoubleQuotes = doubleQuotes && (doubleQuotes.length % 2);
      if (oddSingleQuotes || oddDoubleQuotes) {
        return;
      }
      index = -1;
      while ((index = partial.indexOf('"')) !== -1) {
        partial = partial.slice(0, index) + partial.slice(partial.indexOf('"', index + 1) + 1);
      }
      while ((index = partial.indexOf("'")) !== -1) {
        partial = partial.slice(0, index) + partial.slice(partial.indexOf("'", index + 1) + 1);
      }
      if ((matches = partial.match(isOpeningTagLikePattern)) == null) {
        return;
      }
      eleTag = matches[matches.length - 1];
      if (this.isNeverClosed(eleTag)) {
        if (this.makeNeverCloseSelfClosing) {
          tag = '/>';
          if (partial.substr(partial.length - 1, 1 !== ' ')) {
            tag = ' ' + tag;
          }
          editor.backspace();
          editor.insertText(tag);
        }
        return;
      }
      isInline = this.isInline(eleTag);
      if (!isInline) {
        editor.insertNewline();
        editor.insertNewline();
      }
      editor.insertText('</' + eleTag + '>');
      if (isInline) {
        return editor.setCursorBufferPosition(range.end);
      } else {
        editor.autoIndentBufferRow(range.end.row + 1);
        return editor.setCursorBufferPosition([range.end.row + 1, atom.workspace.getActivePaneItem().getTabText().length * atom.workspace.getActivePaneItem().indentationForBufferRow(range.end.row + 1)]);
      }
    },
    _events: function() {
      return atom.workspace.observeTextEditors((function(_this) {
        return function(textEditor) {
          return textEditor.observeGrammar(function(grammar) {
            if (textEditor.autocloseHTMLbufferEvent != null) {
              textEditor.autocloseHTMLbufferEvent.dispose();
            }
            if (atom.views.getView(textEditor).getAttribute('data-grammar').split(' ').indexOf('html') > -1) {
              textEditor.autocloseHTMLbufferEvent = textEditor.buffer.onDidChange(function(e) {
                if ((e != null ? e.newText : void 0) === '>' && textEditor === atom.workspace.getActiveTextEditor()) {
                  return setTimeout(function() {
                    return _this.execAutoclose();
                  });
                }
              });
              return _this.autocloseHTMLEvents.add(textEditor.autocloseHTMLbufferEvent);
            }
          });
        };
      })(this));
    },
    _unbindEvents: function() {
      return this.autocloseHTMLEvents.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2F1dG9jbG9zZS1odG1sL2xpYi9hdXRvY2xvc2UtaHRtbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDBEQUFBO0lBQUE7O0VBQUEsdUJBQUEsR0FBMEI7O0VBRTFCLFlBQUEsR0FBZSxPQUFBLENBQVEsd0JBQVI7O0VBQ2Qsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNJO0lBQUEsTUFBQSxFQUFRLFlBQVksQ0FBQyxNQUFyQjtJQUVBLFVBQUEsRUFBVyxFQUZYO0lBR0EsV0FBQSxFQUFhLEVBSGI7SUFJQSxVQUFBLEVBQVksRUFKWjtJQUtBLHlCQUFBLEVBQTJCLEtBTDNCO0lBTUEsYUFBQSxFQUFlLEtBTmY7SUFPQSxVQUFBLEVBQVksS0FQWjtJQVNBLFFBQUEsRUFBVSxTQUFBO01BRU4sSUFBQyxDQUFBLG1CQUFELEdBQXVCLElBQUk7TUFFM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUNJO1FBQUEsbUNBQUEsRUFBcUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO1lBQ2pDLElBQUcsS0FBQyxDQUFBLFVBQUo7Y0FDSSxPQUFPLENBQUMsR0FBUixDQUFZLENBQVo7cUJBQ0EsQ0FBQyxDQUFDLGVBQUYsQ0FBQSxFQUZKO2FBQUEsTUFBQTtjQUlJLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLFVBQXJDLENBQWdELEdBQWhEO3FCQUNBLEtBQUksQ0FBQyxhQUFMLENBQUEsRUFMSjs7VUFEaUM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXJDO09BREo7TUFVQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsMkJBQXBCLEVBQWlELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxLQUFEO2lC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cm4gPSAvPCg/IVtcXCFcXC9dKShbYS16XXsxfVtePlxccz1cXCdcXFwiXSopW14+XSo+JC9pXG5cbkNvbmZpZ1NjaGVtYSA9IHJlcXVpcmUoJy4vY29uZmlndXJhdGlvbi5jb2ZmZWUnKVxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIGNvbmZpZzogQ29uZmlnU2NoZW1hLmNvbmZpZ1xuXG4gICAgbmV2ZXJDbG9zZTpbXVxuICAgIGZvcmNlSW5saW5lOiBbXVxuICAgIGZvcmNlQmxvY2s6IFtdXG4gICAgbWFrZU5ldmVyQ2xvc2VTZWxmQ2xvc2luZzogZmFsc2VcbiAgICBpZ25vcmVHcmFtbWFyOiBmYWxzZVxuICAgIGxlZ2FjeU1vZGU6IGZhbHNlXG5cbiAgICBhY3RpdmF0ZTogKCkgLT5cblxuICAgICAgICBAYXV0b2Nsb3NlSFRNTEV2ZW50cyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLFxuICAgICAgICAgICAgJ2F1dG9jbG9zZS1odG1sOmNsb3NlLWFuZC1jb21wbGV0ZSc6IChlKSA9PlxuICAgICAgICAgICAgICAgIGlmIEBsZWdhY3lNb2RlXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpXG4gICAgICAgICAgICAgICAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5pbnNlcnRUZXh0KFwiPlwiKVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmV4ZWNBdXRvY2xvc2UoKVxuXG5cbiAgICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnYXV0b2Nsb3NlLWh0bWwubmV2ZXJDbG9zZScsICh2YWx1ZSkgPT5cbiAgICAgICAgICAgIEBuZXZlckNsb3NlID0gdmFsdWVcblxuICAgICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICdhdXRvY2xvc2UtaHRtbC5mb3JjZUlubGluZScsICh2YWx1ZSkgPT5cbiAgICAgICAgICAgIEBmb3JjZUlubGluZSA9IHZhbHVlXG5cbiAgICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSAnYXV0b2Nsb3NlLWh0bWwuZm9yY2VCbG9jaycsICh2YWx1ZSkgPT5cbiAgICAgICAgICAgIEBmb3JjZUJsb2NrID0gdmFsdWVcblxuICAgICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlICdhdXRvY2xvc2UtaHRtbC5tYWtlTmV2ZXJDbG9zZVNlbGZDbG9zaW5nJywgKHZhbHVlKSA9PlxuICAgICAgICAgICAgQG1ha2VOZXZlckNsb3NlU2VsZkNsb3NpbmcgPSB2YWx1ZVxuXG4gICAgICAgIGF0b20uY29uZmlnLm9ic2VydmUgJ2F1dG9jbG9zZS1odG1sLmxlZ2FjeU1vZGUnLCAodmFsdWUpID0+XG4gICAgICAgICAgICBAbGVnYWN5TW9kZSA9IHZhbHVlXG4gICAgICAgICAgICBpZiBAbGVnYWN5TW9kZVxuICAgICAgICAgICAgICAgIEBfZXZlbnRzKClcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBAX3VuYmluZEV2ZW50cygpXG5cblxuICAgIGRlYWN0aXZhdGU6IC0+XG4gICAgICAgIGlmIEBsZWdhY3lNb2RlXG4gICAgICAgICAgICBAX3VuYmluZEV2ZW50cygpXG5cbiAgICBpc0lubGluZTogKGVsZVRhZykgLT5cbiAgICAgICAgaWYgQGZvcmNlSW5saW5lLmluZGV4T2YoXCIqXCIpID4gLTFcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG5cbiAgICAgICAgdHJ5XG4gICAgICAgICAgICBlbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGVsZVRhZ1xuICAgICAgICBjYXRjaFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG5cbiAgICAgICAgaWYgZWxlVGFnLnRvTG93ZXJDYXNlKCkgaW4gQGZvcmNlQmxvY2tcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICBlbHNlIGlmIGVsZVRhZy50b0xvd2VyQ2FzZSgpIGluIEBmb3JjZUlubGluZVxuICAgICAgICAgICAgcmV0dXJuIHRydWVcblxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkIGVsZVxuICAgICAgICByZXQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGUpLmdldFByb3BlcnR5VmFsdWUoJ2Rpc3BsYXknKSBpbiBbJ2lubGluZScsICdpbmxpbmUtYmxvY2snLCAnbm9uZSddXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQgZWxlXG5cbiAgICAgICAgcmV0XG5cbiAgICBpc05ldmVyQ2xvc2VkOiAoZWxlVGFnKSAtPlxuICAgICAgICBlbGVUYWcudG9Mb3dlckNhc2UoKSBpbiBAbmV2ZXJDbG9zZVxuXG4gICAgZXhlY0F1dG9jbG9zZTogKCkgLT5cbiAgICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIHJhbmdlID0gZWRpdG9yLnNlbGVjdGlvbnNbMF0uZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgICBsaW5lID0gZWRpdG9yLmJ1ZmZlci5nZXRMaW5lcygpW3JhbmdlLmVuZC5yb3ddXG4gICAgICAgIHBhcnRpYWwgPSBsaW5lLnN1YnN0ciAwLCByYW5nZS5zdGFydC5jb2x1bW5cbiAgICAgICAgcGFydGlhbCA9IHBhcnRpYWwuc3Vic3RyKHBhcnRpYWwubGFzdEluZGV4T2YoJzwnKSlcblxuICAgICAgICByZXR1cm4gaWYgcGFydGlhbC5zdWJzdHIocGFydGlhbC5sZW5ndGggLSAxLCAxKSBpcyAnLydcblxuICAgICAgICBzaW5nbGVRdW90ZXMgPSBwYXJ0aWFsLm1hdGNoKC9cXCcvZylcbiAgICAgICAgZG91YmxlUXVvdGVzID0gcGFydGlhbC5tYXRjaCgvXFxcIi9nKVxuICAgICAgICBvZGRTaW5nbGVRdW90ZXMgPSBzaW5nbGVRdW90ZXMgJiYgKHNpbmdsZVF1b3Rlcy5sZW5ndGggJSAyKVxuICAgICAgICBvZGREb3VibGVRdW90ZXMgPSBkb3VibGVRdW90ZXMgJiYgKGRvdWJsZVF1b3Rlcy5sZW5ndGggJSAyKVxuXG4gICAgICAgIHJldHVybiBpZiBvZGRTaW5nbGVRdW90ZXMgb3Igb2RkRG91YmxlUXVvdGVzXG5cbiAgICAgICAgaW5kZXggPSAtMVxuICAgICAgICB3aGlsZSgoaW5kZXggPSBwYXJ0aWFsLmluZGV4T2YoJ1wiJykpIGlzbnQgLTEpXG4gICAgICAgICAgICBwYXJ0aWFsID0gcGFydGlhbC5zbGljZSgwLCBpbmRleCkgKyBwYXJ0aWFsLnNsaWNlKHBhcnRpYWwuaW5kZXhPZignXCInLCBpbmRleCArIDEpICsgMSlcblxuICAgICAgICB3aGlsZSgoaW5kZXggPSBwYXJ0aWFsLmluZGV4T2YoXCInXCIpKSBpc250IC0xKVxuICAgICAgICAgICAgcGFydGlhbCA9IHBhcnRpYWwuc2xpY2UoMCwgaW5kZXgpICsgcGFydGlhbC5zbGljZShwYXJ0aWFsLmluZGV4T2YoXCInXCIsIGluZGV4ICsgMSkgKyAxKVxuXG4gICAgICAgIHJldHVybiBpZiBub3QgKG1hdGNoZXMgPSBwYXJ0aWFsLm1hdGNoKGlzT3BlbmluZ1RhZ0xpa2VQYXR0ZXJuKSk/XG5cbiAgICAgICAgZWxlVGFnID0gbWF0Y2hlc1ttYXRjaGVzLmxlbmd0aCAtIDFdXG5cbiAgICAgICAgaWYgQGlzTmV2ZXJDbG9zZWQoZWxlVGFnKVxuICAgICAgICAgICAgaWYgQG1ha2VOZXZlckNsb3NlU2VsZkNsb3NpbmdcbiAgICAgICAgICAgICAgICB0YWcgPSAnLz4nXG4gICAgICAgICAgICAgICAgaWYgcGFydGlhbC5zdWJzdHIgcGFydGlhbC5sZW5ndGggLSAxLCAxIGlzbnQgJyAnXG4gICAgICAgICAgICAgICAgICAgIHRhZyA9ICcgJyArIHRhZ1xuICAgICAgICAgICAgICAgIGVkaXRvci5iYWNrc3BhY2UoKVxuICAgICAgICAgICAgICAgIGVkaXRvci5pbnNlcnRUZXh0IHRhZ1xuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaXNJbmxpbmUgPSBAaXNJbmxpbmUgZWxlVGFnXG5cbiAgICAgICAgaWYgbm90IGlzSW5saW5lXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgICAgICAgICBlZGl0b3IuaW5zZXJ0TmV3bGluZSgpXG4gICAgICAgIGVkaXRvci5pbnNlcnRUZXh0KCc8LycgKyBlbGVUYWcgKyAnPicpXG4gICAgICAgIGlmIGlzSW5saW5lXG4gICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gcmFuZ2UuZW5kXG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIGVkaXRvci5hdXRvSW5kZW50QnVmZmVyUm93IHJhbmdlLmVuZC5yb3cgKyAxXG4gICAgICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gW3JhbmdlLmVuZC5yb3cgKyAxLCBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpLmdldFRhYlRleHQoKS5sZW5ndGggKiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpLmluZGVudGF0aW9uRm9yQnVmZmVyUm93KHJhbmdlLmVuZC5yb3cgKyAxKV1cblxuICAgIF9ldmVudHM6ICgpIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAodGV4dEVkaXRvcikgPT5cbiAgICAgICAgICAgIHRleHRFZGl0b3Iub2JzZXJ2ZUdyYW1tYXIgKGdyYW1tYXIpID0+XG4gICAgICAgICAgICAgICAgdGV4dEVkaXRvci5hdXRvY2xvc2VIVE1MYnVmZmVyRXZlbnQuZGlzcG9zZSgpIGlmIHRleHRFZGl0b3IuYXV0b2Nsb3NlSFRNTGJ1ZmZlckV2ZW50P1xuICAgICAgICAgICAgICAgIGlmIGF0b20udmlld3MuZ2V0Vmlldyh0ZXh0RWRpdG9yKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JhbW1hcicpLnNwbGl0KCcgJykuaW5kZXhPZignaHRtbCcpID4gLTFcbiAgICAgICAgICAgICAgICAgICAgIHRleHRFZGl0b3IuYXV0b2Nsb3NlSFRNTGJ1ZmZlckV2ZW50ID0gdGV4dEVkaXRvci5idWZmZXIub25EaWRDaGFuZ2UgKGUpID0+XG4gICAgICAgICAgICAgICAgICAgICAgICAgaWYgZT8ubmV3VGV4dCBpcyAnPicgJiYgdGV4dEVkaXRvciA9PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCA9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQGV4ZWNBdXRvY2xvc2UoKVxuICAgICAgICAgICAgICAgICAgICAgQGF1dG9jbG9zZUhUTUxFdmVudHMuYWRkKHRleHRFZGl0b3IuYXV0b2Nsb3NlSFRNTGJ1ZmZlckV2ZW50KVxuXG4gICAgX3VuYmluZEV2ZW50czogKCkgLT5cbiAgICAgICAgQGF1dG9jbG9zZUhUTUxFdmVudHMuZGlzcG9zZSgpXG4iXX0=
