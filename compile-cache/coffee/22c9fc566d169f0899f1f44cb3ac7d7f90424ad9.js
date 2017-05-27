(function() {
  var CompositeDisposable, MarkdownMindmapView, createMarkdownMindmapView, isMarkdownMindmapView, url,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  url = require('url');

  CompositeDisposable = require('atom').CompositeDisposable;

  MarkdownMindmapView = null;

  createMarkdownMindmapView = function(state) {
    if (MarkdownMindmapView == null) {
      MarkdownMindmapView = require('./markdown-mindmap-view');
    }
    return new MarkdownMindmapView(state);
  };

  isMarkdownMindmapView = function(object) {
    if (MarkdownMindmapView == null) {
      MarkdownMindmapView = require('./markdown-mindmap-view');
    }
    return object instanceof MarkdownMindmapView;
  };

  atom.deserializers.add({
    name: 'MarkdownMindmapView',
    deserialize: function(state) {
      if (state.constructor === Object) {
        return createMarkdownMindmapView(state);
      }
    }
  });

  module.exports = {
    config: {
      liveUpdate: {
        type: 'boolean',
        "default": true
      },
      autoOpen: {
        type: 'boolean',
        "default": false
      },
      openPreviewInSplitPane: {
        type: 'boolean',
        "default": true
      },
      theme: {
        type: 'string',
        "default": 'default',
        "enum": ['default', 'colorful', 'default-dark', 'colorful-dark']
      },
      linkShape: {
        type: 'string',
        "default": 'diagonal',
        "enum": ['diagonal', 'bracket']
      },
      grammars: {
        type: 'array',
        "default": ['source.gfm', 'source.litcoffee', 'text.html.basic', 'text.plain', 'text.plain.null-grammar']
      }
    },
    activate: function() {
      var previewFile;
      this.disposables = new CompositeDisposable;
      this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(editor) {
          return _this.autoOpen(editor);
        };
      })(this)));
      atom.commands.add('atom-workspace', {
        'markdown-mindmap:toggle-auto-mode': (function(_this) {
          return function() {
            return _this.toggleAutoOpen();
          };
        })(this),
        'markdown-mindmap:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'markdown-mindmap:toggle-break-on-single-newline': function() {
          var keyPath;
          keyPath = 'markdown-mindmap.breakOnSingleNewline';
          return atom.config.set(keyPath, !atom.config.get(keyPath));
        }
      });
      previewFile = this.previewFile.bind(this);
      atom.commands.add('.tree-view .file .name[data-name$=\\.markdown]', 'markdown-mindmap:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.md]', 'markdown-mindmap:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mdown]', 'markdown-mindmap:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mkd]', 'markdown-mindmap:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.mkdown]', 'markdown-mindmap:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.ron]', 'markdown-mindmap:preview-file', previewFile);
      atom.commands.add('.tree-view .file .name[data-name$=\\.txt]', 'markdown-mindmap:preview-file', previewFile);
      return atom.workspace.addOpener(function(uriToOpen) {
        var error, host, pathname, protocol, ref;
        try {
          ref = url.parse(uriToOpen), protocol = ref.protocol, host = ref.host, pathname = ref.pathname;
        } catch (error1) {
          error = error1;
          return;
        }
        if (protocol !== 'markdown-mindmap:') {
          return;
        }
        try {
          if (pathname) {
            pathname = decodeURI(pathname);
          }
        } catch (error1) {
          error = error1;
          return;
        }
        if (host === 'editor') {
          return createMarkdownMindmapView({
            editorId: pathname.substring(1)
          });
        } else {
          return createMarkdownMindmapView({
            filePath: pathname
          });
        }
      });
    },
    deactivate: function() {
      return this.disposables.dispose();
    },
    toggle: function() {
      var editor, grammars, ref, ref1;
      if (isMarkdownMindmapView(atom.workspace.getActivePaneItem())) {
        atom.workspace.destroyActivePaneItem();
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return;
      }
      grammars = (ref = atom.config.get('markdown-mindmap.grammars')) != null ? ref : [];
      if (ref1 = editor.getGrammar().scopeName, indexOf.call(grammars, ref1) < 0) {
        return;
      }
      if (!this.removePreviewForEditor(editor)) {
        return this.addPreviewForEditor(editor);
      }
    },
    toggleAutoOpen: function() {
      var key;
      key = 'markdown-mindmap.autoOpen';
      return atom.config.set(key, !atom.config.get(key));
    },
    uriForEditor: function(editor) {
      return "markdown-mindmap://editor/" + editor.id;
    },
    removePreviewForEditor: function(editor) {
      var previewPane, uri;
      uri = this.uriForEditor(editor);
      previewPane = atom.workspace.paneForURI(uri);
      if (previewPane != null) {
        previewPane.destroyItem(previewPane.itemForURI(uri));
        return true;
      } else {
        return false;
      }
    },
    autoOpen: function(editor) {
      var grammars, newPath, ref, ref1, ref2, ref3;
      if (!(atom.config.get('markdown-mindmap.autoOpen') && ((editor != null ? editor.getPath : void 0) != null))) {
        return;
      }
      if ((ref = editor.element) != null ? ref.classList.contains('markdown-mindmap') : void 0) {
        return;
      }
      grammars = (ref1 = atom.config.get('markdown-mindmap.grammars')) != null ? ref1 : [];
      newPath = editor.getPath();
      if (!(newPath && this.activeEditor !== newPath && (ref2 = typeof editor.getGrammar === "function" ? (ref3 = editor.getGrammar()) != null ? ref3.scopeName : void 0 : void 0, indexOf.call(grammars, ref2) >= 0))) {
        return;
      }
      this.activeEditor = newPath;
      return this.addPreviewForEditor(editor);
    },
    addPreviewForEditor: function(editor) {
      var options, previousActivePane, uri;
      uri = this.uriForEditor(editor);
      previousActivePane = atom.workspace.getActivePane();
      options = {
        searchAllPanes: true
      };
      if (atom.config.get('markdown-mindmap.openPreviewInSplitPane')) {
        options.split = 'right';
      }
      return atom.workspace.open(uri, options).then(function(markdownMindmapView) {
        if (isMarkdownMindmapView(markdownMindmapView)) {
          return previousActivePane.activate();
        }
      });
    },
    previewFile: function(arg) {
      var editor, filePath, i, len, ref, target;
      target = arg.target;
      filePath = target.dataset.path;
      if (!filePath) {
        return;
      }
      ref = atom.workspace.getTextEditors();
      for (i = 0, len = ref.length; i < len; i++) {
        editor = ref[i];
        if (!(editor.getPath() === filePath)) {
          continue;
        }
        this.addPreviewForEditor(editor);
        return;
      }
      return atom.workspace.open("markdown-mindmap://" + (encodeURI(filePath)), {
        searchAllPanes: true
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21hcmtkb3duLW1pbmRtYXAvbGliL21haW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwrRkFBQTtJQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsS0FBUjs7RUFDTCxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLG1CQUFBLEdBQXNCOztFQUV0Qix5QkFBQSxHQUE0QixTQUFDLEtBQUQ7O01BQzFCLHNCQUF1QixPQUFBLENBQVEseUJBQVI7O1dBQ25CLElBQUEsbUJBQUEsQ0FBb0IsS0FBcEI7RUFGc0I7O0VBSTVCLHFCQUFBLEdBQXdCLFNBQUMsTUFBRDs7TUFDdEIsc0JBQXVCLE9BQUEsQ0FBUSx5QkFBUjs7V0FDdkIsTUFBQSxZQUFrQjtFQUZJOztFQUl4QixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQ0U7SUFBQSxJQUFBLEVBQU0scUJBQU47SUFDQSxXQUFBLEVBQWEsU0FBQyxLQUFEO01BQ1gsSUFBb0MsS0FBSyxDQUFDLFdBQU4sS0FBcUIsTUFBekQ7ZUFBQSx5QkFBQSxDQUEwQixLQUExQixFQUFBOztJQURXLENBRGI7R0FERjs7RUFLQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUNFO01BQUEsVUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7T0FERjtNQUdBLFFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BSkY7TUFNQSxzQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7T0FQRjtNQVNBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxT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QyxHQUFaLENBQWdCLHlDQUFoQixDQUFIO1FBQ0UsT0FBTyxDQUFDLEtBQVIsR0FBZ0IsUUFEbEI7O2FBRUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLEdBQXBCLEVBQXlCLE9BQXpCLENBQWlDLENBQUMsSUFBbEMsQ0FBdUMsU0FBQyxtQkFBRDtRQUNyQyxJQUFHLHFCQUFBLENBQXNCLG1CQUF0QixDQUFIO2lCQUNFLGtCQUFrQixDQUFDLFFBQW5CLENBQUEsRUFERjs7TUFEcUMsQ0FBdkM7SUFQbUIsQ0FuSHJCO0lBOEhBLFdBQUEsRUFBYSxTQUFDLEdBQUQ7QUFDWCxVQUFBO01BRGEsU0FBRDtNQUNaLFFBQUEsR0FBVyxNQUFNLENBQUMsT0FBTyxDQUFDO01BQzFCLElBQUEsQ0FBYyxRQUFkO0FBQUEsZUFBQTs7QUFFQTtBQUFBLFdBQUEscUNBQUE7O2NBQW1ELE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBQSxLQUFvQjs7O1FBQ3JFLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixNQUFyQjtBQUNBO0FBRkY7YUFJQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IscUJBQUEsR0FBcUIsQ0FBQyxTQUFBLENBQVUsUUFBVixDQUFELENBQXpDLEVBQWlFO1FBQUEsY0FBQSxFQUFnQixJQUFoQjtPQUFqRTtJQVJXLENBOUhiOztBQW5CRiIsInNvdXJjZXNDb250ZW50IjpbInVybCA9IHJlcXVpcmUgJ3VybCdcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbk1hcmtkb3duTWluZG1hcFZpZXcgPSBudWxsICMgRGVmZXIgdW50aWwgdXNlZFxuXG5jcmVhdGVNYXJrZG93bk1pbmRtYXBWaWV3ID0gKHN0YXRlKSAtPlxuICBNYXJrZG93bk1pbmRtYXBWaWV3ID89IHJlcXVpcmUgJy4vbWFya2Rvd24tbWluZG1hcC12aWV3J1xuICBuZXcgTWFya2Rvd25NaW5kbWFwVmlldyhzdGF0ZSlcblxuaXNNYXJrZG93bk1pbmRtYXBWaWV3ID0gKG9iamVjdCkgLT5cbiAgTWFya2Rvd25NaW5kbWFwVmlldyA/PSByZXF1aXJlICcuL21hcmtkb3duLW1pbmRtYXAtdmlldydcbiAgb2JqZWN0IGluc3RhbmNlb2YgTWFya2Rvd25NaW5kbWFwVmlld1xuXG5hdG9tLmRlc2VyaWFsaXplcnMuYWRkXG4gIG5hbWU6ICdNYXJrZG93bk1pbmRtYXBWaWV3J1xuICBkZXNlcmlhbGl6ZTogKHN0YXRlKSAtPlxuICAgIGNyZWF0ZU1hcmtkb3duTWluZG1hcFZpZXcoc3RhdGUpIGlmIHN0YXRlLmNvbnN0cnVjdG9yIGlzIE9iamVjdFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBsaXZlVXBkYXRlOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgYXV0b09wZW46XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgb3BlblByZXZpZXdJblNwbGl0UGFuZTpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIHRoZW1lOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdkZWZhdWx0J1xuICAgICAgZW51bTogWydkZWZhdWx0JywgJ2NvbG9yZnVsJywgJ2RlZmF1bHQtZGFyaycsICdjb2xvcmZ1bC1kYXJrJ11cbiAgICBsaW5rU2hhcGU6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ2RpYWdvbmFsJ1xuICAgICAgZW51bTogWydkaWFnb25hbCcsICdicmFja2V0J11cbiAgICBncmFtbWFyczpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtcbiAgICAgICAgJ3NvdXJjZS5nZm0nXG4gICAgICAgICdzb3VyY2UubGl0Y29mZmVlJ1xuICAgICAgICAndGV4dC5odG1sLmJhc2ljJ1xuICAgICAgICAndGV4dC5wbGFpbidcbiAgICAgICAgJ3RleHQucGxhaW4ubnVsbC1ncmFtbWFyJ1xuICAgICAgXVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gKGVkaXRvcikgPT5cbiAgICAgIEBhdXRvT3BlbihlZGl0b3IpXG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgJ21hcmtkb3duLW1pbmRtYXA6dG9nZ2xlLWF1dG8tbW9kZSc6ID0+XG4gICAgICAgIEB0b2dnbGVBdXRvT3BlbigpXG4gICAgICAnbWFya2Rvd24tbWluZG1hcDp0b2dnbGUnOiA9PlxuICAgICAgICBAdG9nZ2xlKClcbiAgICAgICMnbWFya2Rvd24tbWluZG1hcDpjb3B5LWh0bWwnOiA9PlxuICAgICAgIyAgQGNvcHlIdG1sKClcbiAgICAgICdtYXJrZG93bi1taW5kbWFwOnRvZ2dsZS1icmVhay1vbi1zaW5nbGUtbmV3bGluZSc6IC0+XG4gICAgICAgIGtleVBhdGggPSAnbWFya2Rvd24tbWluZG1hcC5icmVha09uU2luZ2xlTmV3bGluZSdcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KGtleVBhdGgsIG5vdCBhdG9tLmNvbmZpZy5nZXQoa2V5UGF0aCkpXG5cbiAgICBwcmV2aWV3RmlsZSA9IEBwcmV2aWV3RmlsZS5iaW5kKHRoaXMpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcgLmZpbGUgLm5hbWVbZGF0YS1uYW1lJD1cXFxcLm1hcmtkb3duXScsICdtYXJrZG93bi1taW5kbWFwOnByZXZpZXctZmlsZScsIHByZXZpZXdGaWxlXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcgLmZpbGUgLm5hbWVbZGF0YS1uYW1lJD1cXFxcLm1kXScsICdtYXJrZG93bi1taW5kbWFwOnByZXZpZXctZmlsZScsIHByZXZpZXdGaWxlXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcgLmZpbGUgLm5hbWVbZGF0YS1uYW1lJD1cXFxcLm1kb3duXScsICdtYXJrZG93bi1taW5kbWFwOnByZXZpZXctZmlsZScsIHByZXZpZXdGaWxlXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcgLmZpbGUgLm5hbWVbZGF0YS1uYW1lJD1cXFxcLm1rZF0nLCAnbWFya2Rvd24tbWluZG1hcDpwcmV2aWV3LWZpbGUnLCBwcmV2aWV3RmlsZVxuICAgIGF0b20uY29tbWFuZHMuYWRkICcudHJlZS12aWV3IC5maWxlIC5uYW1lW2RhdGEtbmFtZSQ9XFxcXC5ta2Rvd25dJywgJ21hcmtkb3duLW1pbmRtYXA6cHJldmlldy1maWxlJywgcHJldmlld0ZpbGVcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnLnRyZWUtdmlldyAuZmlsZSAubmFtZVtkYXRhLW5hbWUkPVxcXFwucm9uXScsICdtYXJrZG93bi1taW5kbWFwOnByZXZpZXctZmlsZScsIHByZXZpZXdGaWxlXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcgLmZpbGUgLm5hbWVbZGF0YS1uYW1lJD1cXFxcLnR4dF0nLCAnbWFya2Rvd24tbWluZG1hcDpwcmV2aWV3LWZpbGUnLCBwcmV2aWV3RmlsZVxuXG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyICh1cmlUb09wZW4pIC0+XG4gICAgICB0cnlcbiAgICAgICAge3Byb3RvY29sLCBob3N0LCBwYXRobmFtZX0gPSB1cmwucGFyc2UodXJpVG9PcGVuKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIHJldHVybiB1bmxlc3MgcHJvdG9jb2wgaXMgJ21hcmtkb3duLW1pbmRtYXA6J1xuXG4gICAgICB0cnlcbiAgICAgICAgcGF0aG5hbWUgPSBkZWNvZGVVUkkocGF0aG5hbWUpIGlmIHBhdGhuYW1lXG4gICAgICBjYXRjaCBlcnJvclxuICAgICAgICByZXR1cm5cblxuICAgICAgaWYgaG9zdCBpcyAnZWRpdG9yJ1xuICAgICAgICBjcmVhdGVNYXJrZG93bk1pbmRtYXBWaWV3KGVkaXRvcklkOiBwYXRobmFtZS5zdWJzdHJpbmcoMSkpXG4gICAgICBlbHNlXG4gICAgICAgIGNyZWF0ZU1hcmtkb3duTWluZG1hcFZpZXcoZmlsZVBhdGg6IHBhdGhuYW1lKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBpc01hcmtkb3duTWluZG1hcFZpZXcoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKSlcbiAgICAgIGF0b20ud29ya3NwYWNlLmRlc3Ryb3lBY3RpdmVQYW5lSXRlbSgpXG4gICAgICByZXR1cm5cblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIHJldHVybiB1bmxlc3MgZWRpdG9yP1xuXG4gICAgZ3JhbW1hcnMgPSBhdG9tLmNvbmZpZy5nZXQoJ21hcmtkb3duLW1pbmRtYXAuZ3JhbW1hcnMnKSA/IFtdXG4gICAgcmV0dXJuIHVubGVzcyBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSBpbiBncmFtbWFyc1xuXG4gICAgQGFkZFByZXZpZXdGb3JFZGl0b3IoZWRpdG9yKSB1bmxlc3MgQHJlbW92ZVByZXZpZXdGb3JFZGl0b3IoZWRpdG9yKVxuXG4gIHRvZ2dsZUF1dG9PcGVuOiAtPlxuICAgIGtleSA9ICdtYXJrZG93bi1taW5kbWFwLmF1dG9PcGVuJ1xuICAgIGF0b20uY29uZmlnLnNldChrZXksICFhdG9tLmNvbmZpZy5nZXQoa2V5KSlcblxuICB1cmlGb3JFZGl0b3I6IChlZGl0b3IpIC0+XG4gICAgXCJtYXJrZG93bi1taW5kbWFwOi8vZWRpdG9yLyN7ZWRpdG9yLmlkfVwiXG5cbiAgcmVtb3ZlUHJldmlld0ZvckVkaXRvcjogKGVkaXRvcikgLT5cbiAgICB1cmkgPSBAdXJpRm9yRWRpdG9yKGVkaXRvcilcbiAgICBwcmV2aWV3UGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkodXJpKVxuICAgIGlmIHByZXZpZXdQYW5lP1xuICAgICAgcHJldmlld1BhbmUuZGVzdHJveUl0ZW0ocHJldmlld1BhbmUuaXRlbUZvclVSSSh1cmkpKVxuICAgICAgdHJ1ZVxuICAgIGVsc2VcbiAgICAgIGZhbHNlXG5cbiAgYXV0b09wZW46IChlZGl0b3IpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQoJ21hcmtkb3duLW1pbmRtYXAuYXV0b09wZW4nKSBhbmQgZWRpdG9yPy5nZXRQYXRoP1xuICAgIHJldHVybiBpZiBlZGl0b3IuZWxlbWVudD8uY2xhc3NMaXN0LmNvbnRhaW5zKCdtYXJrZG93bi1taW5kbWFwJylcblxuICAgIGdyYW1tYXJzID0gYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1taW5kbWFwLmdyYW1tYXJzJykgPyBbXVxuICAgIG5ld1BhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgcmV0dXJuIHVubGVzcyBuZXdQYXRoIGFuZCBAYWN0aXZlRWRpdG9yICE9IG5ld1BhdGggYW5kIGVkaXRvci5nZXRHcmFtbWFyPygpPy5zY29wZU5hbWUgaW4gZ3JhbW1hcnNcblxuICAgIEBhY3RpdmVFZGl0b3IgPSBuZXdQYXRoXG4gICAgQGFkZFByZXZpZXdGb3JFZGl0b3IoZWRpdG9yKVxuXG4gIGFkZFByZXZpZXdGb3JFZGl0b3I6IChlZGl0b3IpIC0+XG4gICAgdXJpID0gQHVyaUZvckVkaXRvcihlZGl0b3IpXG4gICAgcHJldmlvdXNBY3RpdmVQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgb3B0aW9ucyA9XG4gICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnbWFya2Rvd24tbWluZG1hcC5vcGVuUHJldmlld0luU3BsaXRQYW5lJylcbiAgICAgIG9wdGlvbnMuc3BsaXQgPSAncmlnaHQnXG4gICAgYXRvbS53b3Jrc3BhY2Uub3Blbih1cmksIG9wdGlvbnMpLnRoZW4gKG1hcmtkb3duTWluZG1hcFZpZXcpIC0+XG4gICAgICBpZiBpc01hcmtkb3duTWluZG1hcFZpZXcobWFya2Rvd25NaW5kbWFwVmlldylcbiAgICAgICAgcHJldmlvdXNBY3RpdmVQYW5lLmFjdGl2YXRlKClcblxuICBwcmV2aWV3RmlsZTogKHt0YXJnZXR9KSAtPlxuICAgIGZpbGVQYXRoID0gdGFyZ2V0LmRhdGFzZXQucGF0aFxuICAgIHJldHVybiB1bmxlc3MgZmlsZVBhdGhcblxuICAgIGZvciBlZGl0b3IgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKSB3aGVuIGVkaXRvci5nZXRQYXRoKCkgaXMgZmlsZVBhdGhcbiAgICAgIEBhZGRQcmV2aWV3Rm9yRWRpdG9yKGVkaXRvcilcbiAgICAgIHJldHVyblxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBcIm1hcmtkb3duLW1pbmRtYXA6Ly8je2VuY29kZVVSSShmaWxlUGF0aCl9XCIsIHNlYXJjaEFsbFBhbmVzOiB0cnVlXG5cbiAgIyBjb3B5SHRtbDogLT5cbiAgIyAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAjICAgcmV0dXJuIHVubGVzcyBlZGl0b3I/XG4gICNcbiAgIyAgIHJlbmRlcmVyID89IHJlcXVpcmUgJy4vcmVuZGVyZXInXG4gICMgICB0ZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpIG9yIGVkaXRvci5nZXRUZXh0KClcbiAgIyAgIHJlbmRlcmVyLnRvSFRNTCB0ZXh0LCBlZGl0b3IuZ2V0UGF0aCgpLCBlZGl0b3IuZ2V0R3JhbW1hcigpLCAoZXJyb3IsIGh0bWwpIC0+XG4gICMgICAgIGlmIGVycm9yXG4gICMgICAgICAgY29uc29sZS53YXJuKCdDb3B5aW5nIE1hcmtkb3duIGFzIEhUTUwgZmFpbGVkJywgZXJyb3IpXG4gICMgICAgIGVsc2VcbiAgIyAgICAgICBhdG9tLmNsaXBib2FyZC53cml0ZShodG1sKVxuIl19
