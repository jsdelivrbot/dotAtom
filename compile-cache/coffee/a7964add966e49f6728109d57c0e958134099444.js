(function() {
  var $, $$$, CompositeDisposable, Disposable, Emitter, File, Grim, MarkdownMindmapView, SVG_PADDING, ScrollView, _, d3, fs, getSVG, markmapMindmap, markmapParse, path, ref, ref1, transformHeadings,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require('path');

  ref = require('atom'), Emitter = ref.Emitter, Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable;

  ref1 = require('atom-space-pen-views'), $ = ref1.$, $$$ = ref1.$$$, ScrollView = ref1.ScrollView;

  Grim = require('grim');

  _ = require('underscore-plus');

  fs = require('fs-plus');

  File = require('atom').File;

  markmapParse = require('markmap/parse.markdown');

  markmapMindmap = require('markmap/view.mindmap');

  transformHeadings = require('markmap/transform.headings');

  d3 = require('d3');

  SVG_PADDING = 15;

  getSVG = function(arg) {
    var body, height, viewbox, width;
    body = arg.body, width = arg.width, height = arg.height, viewbox = arg.viewbox;
    return "<?xml version=\"1.0\" standalone=\"no\"?>\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\"\n  \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\"\n     width=\"" + width + "\" height=\"" + height + "\" viewBox=\"" + viewbox + "\">\n  <defs>\n    <style type=\"text/css\"><![CDATA[\n      .markmap-node {\n        cursor: pointer;\n      }\n\n      .markmap-node-circle {\n        fill: #fff;\n        stroke-width: 1.5px;\n      }\n\n      .markmap-node-text {\n        fill:  #000;\n        font: 10px sans-serif;\n      }\n\n      .markmap-link {\n        fill: none;\n      }\n    ]]></style>\n  </defs>\n  " + body + "\n</svg>";
  };

  module.exports = MarkdownMindmapView = (function(superClass) {
    extend(MarkdownMindmapView, superClass);

    MarkdownMindmapView.content = function() {
      return this.div({
        "class": 'markdown-mindmap native-key-bindings',
        tabindex: -1
      });
    };

    function MarkdownMindmapView(arg) {
      this.editorId = arg.editorId, this.filePath = arg.filePath;
      MarkdownMindmapView.__super__.constructor.apply(this, arguments);
      this.emitter = new Emitter;
      this.disposables = new CompositeDisposable;
      this.loaded = false;
    }

    MarkdownMindmapView.prototype.attached = function() {
      if (this.isAttached) {
        return;
      }
      this.isAttached = true;
      if (this.editorId != null) {
        return this.resolveEditor(this.editorId);
      } else {
        if (atom.workspace != null) {
          return this.subscribeToFilePath(this.filePath);
        } else {
          return this.disposables.add(atom.packages.onDidActivateInitialPackages((function(_this) {
            return function() {
              return _this.subscribeToFilePath(_this.filePath);
            };
          })(this)));
        }
      }
    };

    MarkdownMindmapView.prototype.serialize = function() {
      return {
        deserializer: 'MarkdownMindmapView',
        filePath: this.getPath(),
        editorId: this.editorId
      };
    };

    MarkdownMindmapView.prototype.destroy = function() {
      return this.disposables.dispose();
    };

    MarkdownMindmapView.prototype.onDidChangeTitle = function(callback) {
      return this.emitter.on('did-change-title', callback);
    };

    MarkdownMindmapView.prototype.onDidChangeModified = function(callback) {
      return new Disposable;
    };

    MarkdownMindmapView.prototype.onDidChangeMarkdown = function(callback) {
      return this.emitter.on('did-change-markdown', callback);
    };

    MarkdownMindmapView.prototype.subscribeToFilePath = function(filePath) {
      this.file = new File(filePath);
      this.emitter.emit('did-change-title');
      this.handleEvents();
      return this.renderMarkdown();
    };

    MarkdownMindmapView.prototype.resolveEditor = function(editorId) {
      var resolve;
      resolve = (function(_this) {
        return function() {
          var ref2, ref3;
          _this.editor = _this.editorForId(editorId);
          if (_this.editor != null) {
            if (_this.editor != null) {
              _this.emitter.emit('did-change-title');
            }
            _this.handleEvents();
            return _this.renderMarkdown();
          } else {
            return (ref2 = atom.workspace) != null ? (ref3 = ref2.paneForItem(_this)) != null ? ref3.destroyItem(_this) : void 0 : void 0;
          }
        };
      })(this);
      if (atom.workspace != null) {
        return resolve();
      } else {
        return this.disposables.add(atom.packages.onDidActivateInitialPackages(resolve));
      }
    };

    MarkdownMindmapView.prototype.editorForId = function(editorId) {
      var editor, i, len, ref2, ref3;
      ref2 = atom.workspace.getTextEditors();
      for (i = 0, len = ref2.length; i < len; i++) {
        editor = ref2[i];
        if (((ref3 = editor.id) != null ? ref3.toString() : void 0) === editorId.toString()) {
          return editor;
        }
      }
      return null;
    };

    MarkdownMindmapView.prototype.handleEvents = function() {
      var changeHandler;
      this.disposables.add(atom.grammars.onDidAddGrammar((function(_this) {
        return function() {
          return _.debounce((function() {
            return _this.renderMarkdown();
          }), 250);
        };
      })(this)));
      this.disposables.add(atom.grammars.onDidUpdateGrammar(_.debounce(((function(_this) {
        return function() {
          return _this.renderMarkdown();
        };
      })(this)), 250)));
      atom.commands.add(this.element, {
        'core:save-as': (function(_this) {
          return function(event) {
            event.stopPropagation();
            return _this.saveAs();
          };
        })(this),
        'core:copy': (function(_this) {
          return function(event) {
            if (_this.copyToClipboard()) {
              return event.stopPropagation();
            }
          };
        })(this)
      });
      changeHandler = (function(_this) {
        return function() {
          var base, pane, ref2;
          _this.renderMarkdown();
          pane = (ref2 = typeof (base = atom.workspace).paneForItem === "function" ? base.paneForItem(_this) : void 0) != null ? ref2 : atom.workspace.paneForURI(_this.getURI());
          if ((pane != null) && pane !== atom.workspace.getActivePane()) {
            return pane.activateItem(_this);
          }
        };
      })(this);
      if (this.file != null) {
        this.disposables.add(this.file.onDidChange(changeHandler));
      } else if (this.editor != null) {
        this.disposables.add(this.editor.getBuffer().onDidStopChanging(function() {
          if (atom.config.get('markdown-mindmap.liveUpdate')) {
            return changeHandler();
          }
        }));
        this.disposables.add(this.editor.onDidChangePath((function(_this) {
          return function() {
            return _this.emitter.emit('did-change-title');
          };
        })(this)));
        this.disposables.add(this.editor.getBuffer().onDidSave(function() {
          if (!atom.config.get('markdown-mindmap.liveUpdate')) {
            return changeHandler();
          }
        }));
        this.disposables.add(this.editor.getBuffer().onDidReload(function() {
          if (!atom.config.get('markdown-mindmap.liveUpdate')) {
            return changeHandler();
          }
        }));
      }
      this.disposables.add(atom.config.observe('markdown-mindmap.theme', changeHandler));
      return this.disposables.add(atom.config.observe('markdown-mindmap.linkShape', changeHandler));
    };

    MarkdownMindmapView.prototype.renderMarkdown = function() {
      if (!this.loaded) {
        this.showLoading();
      }
      return this.getMarkdownSource().then((function(_this) {
        return function(source) {
          if (source != null) {
            return _this.renderMarkdownText(source);
          }
        };
      })(this));
    };

    MarkdownMindmapView.prototype.getMarkdownSource = function() {
      if (this.file != null) {
        return this.file.read();
      } else if (this.editor != null) {
        return Promise.resolve(this.editor.getText());
      } else {
        return Promise.resolve(null);
      }
    };

    MarkdownMindmapView.prototype.getSVG = function(callback) {
      var body, heightOffset, maxX, maxY, minX, minY, node, nodes, realHeight, realWidth, state, transform;
      state = this.mindmap.state;
      nodes = this.mindmap.layout(state).nodes;
      minX = Math.round(d3.min(nodes, function(d) {
        return d.x;
      }));
      minY = Math.round(d3.min(nodes, function(d) {
        return d.y;
      }));
      maxX = Math.round(d3.max(nodes, function(d) {
        return d.x;
      }));
      maxY = Math.round(d3.max(nodes, function(d) {
        return d.y;
      }));
      realHeight = maxX - minX;
      realWidth = maxY - minY + state.nodeWidth;
      heightOffset = state.nodeHeight;
      minX -= SVG_PADDING;
      minY -= SVG_PADDING;
      realHeight += 2 * SVG_PADDING;
      realWidth += 2 * SVG_PADDING;
      node = this.mindmap.svg.node();
      transform = node.getAttribute('transform');
      node.removeAttribute('transform');
      body = this.mindmap.svg.node().parentNode.innerHTML;
      node.setAttribute('transform', transform);
      return callback(null, getSVG({
        body: body,
        width: realWidth + 'px',
        height: realHeight + 'px',
        viewbox: minY + " " + (minX - heightOffset) + " " + realWidth + " " + (realHeight + heightOffset)
      }));
    };

    MarkdownMindmapView.prototype.renderMarkdownText = function(text) {
      var cls, data, nodes, options, toggleHandler;
      this.hideLoading();
      this.loaded = true;
      data = markmapParse(text);
      data = transformHeadings(data);
      options = {
        preset: atom.config.get('markdown-mindmap.theme').replace(/-dark$/, ''),
        linkShape: atom.config.get('markdown-mindmap.linkShape')
      };
      if (this.mindmap == null) {
        this.mindmap = markmapMindmap($('<svg style="height: 100%; width: 100%"></svg>').appendTo(this).get(0), data, options);
      } else {
        this.mindmap.setData(data).set(options).set({
          duration: 0
        }).update().set({
          duration: 750
        });
      }
      cls = this.attr('class').replace(/markdown-mindmap-theme-[^\s]+/, '');
      cls += ' markdown-mindmap-theme-' + atom.config.get('markdown-mindmap.theme');
      this.attr('class', cls);
      nodes = this.mindmap.svg.selectAll('g.markmap-node');
      toggleHandler = this.mindmap.click.bind(this.mindmap);
      nodes.on('click', null);
      nodes.selectAll('circle').on('click', toggleHandler);
      nodes.selectAll('text,rect').on('click', (function(_this) {
        return function(d) {
          return _this.scrollToLine(d.line);
        };
      })(this));
      this.emitter.emit('did-change-markdown');
      return this.originalTrigger('markdown-mindmap:markdown-changed');
    };

    MarkdownMindmapView.prototype.scrollToLine = function(line) {
      return atom.workspace.open(this.getPath(), {
        initialLine: line,
        activatePane: false,
        searchAllPanes: true
      }).then(function(editor) {
        var cursor, pixel, view;
        cursor = editor.getCursorScreenPosition();
        view = atom.views.getView(editor);
        pixel = view.pixelPositionForScreenPosition(cursor).top;
        return editor.getElement().setScrollTop(pixel);
      });
    };

    MarkdownMindmapView.prototype.getTitle = function() {
      if (this.file != null) {
        return (path.basename(this.getPath())) + " Mindmap";
      } else if (this.editor != null) {
        return (this.editor.getTitle()) + " Mindmap";
      } else {
        return "Markdown Mindmap";
      }
    };

    MarkdownMindmapView.prototype.getIconName = function() {
      return "markdown";
    };

    MarkdownMindmapView.prototype.getURI = function() {
      if (this.file != null) {
        return "markdown-mindmap://" + (this.getPath());
      } else {
        return "markdown-mindmap://editor/" + this.editorId;
      }
    };

    MarkdownMindmapView.prototype.getPath = function() {
      if (this.file != null) {
        return this.file.getPath();
      } else if (this.editor != null) {
        return this.editor.getPath();
      }
    };

    MarkdownMindmapView.prototype.getGrammar = function() {
      var ref2;
      return (ref2 = this.editor) != null ? ref2.getGrammar() : void 0;
    };

    MarkdownMindmapView.prototype.getDocumentStyleSheets = function() {
      return document.styleSheets;
    };

    MarkdownMindmapView.prototype.getTextEditorStyles = function() {
      var textEditorStyles;
      textEditorStyles = document.createElement("atom-styles");
      textEditorStyles.setAttribute("context", "atom-text-editor");
      document.body.appendChild(textEditorStyles);
      textEditorStyles.initialize();
      return Array.prototype.slice.apply(textEditorStyles.childNodes).map(function(styleElement) {
        return styleElement.innerText;
      });
    };

    MarkdownMindmapView.prototype.getMarkdownMindmapCSS = function() {
      var cssUrlRefExp, i, j, len, len1, markdowPreviewRules, ref2, ref3, ref4, rule, ruleRegExp, stylesheet;
      markdowPreviewRules = [];
      ruleRegExp = /\.markdown-mindmap/;
      cssUrlRefExp = /url\(atom:\/\/markdown-mindmap\/assets\/(.*)\)/;
      ref2 = this.getDocumentStyleSheets();
      for (i = 0, len = ref2.length; i < len; i++) {
        stylesheet = ref2[i];
        if (stylesheet.rules != null) {
          ref3 = stylesheet.rules;
          for (j = 0, len1 = ref3.length; j < len1; j++) {
            rule = ref3[j];
            if (((ref4 = rule.selectorText) != null ? ref4.match(ruleRegExp) : void 0) != null) {
              markdowPreviewRules.push(rule.cssText);
            }
          }
        }
      }
      return markdowPreviewRules.concat(this.getTextEditorStyles()).join('\n').replace(/atom-text-editor/g, 'pre.editor-colors').replace(/:host/g, '.host').replace(cssUrlRefExp, function(match, assetsName, offset, string) {
        var assetPath, base64Data, originalData;
        assetPath = path.join(__dirname, '../assets', assetsName);
        originalData = fs.readFileSync(assetPath, 'binary');
        base64Data = new Buffer(originalData, 'binary').toString('base64');
        return "url('data:image/jpeg;base64," + base64Data + "')";
      });
    };

    MarkdownMindmapView.prototype.showError = function(result) {
      var failureMessage;
      failureMessage = result != null ? result.message : void 0;
      return this.html($$$(function() {
        this.h2('Previewing Markdown Failed');
        if (failureMessage != null) {
          return this.h3(failureMessage);
        }
      }));
    };

    MarkdownMindmapView.prototype.showLoading = function() {
      var spinner;
      this.loading = true;
      spinner = this.find('>.markdown-spinner');
      if (spinner.length === 0) {
        this.append($$$(function() {
          return this.div({
            "class": 'markdown-spinner'
          }, 'Loading Markdown\u2026');
        }));
      }
      return spinner.show();
    };

    MarkdownMindmapView.prototype.hideLoading = function() {
      this.loading = false;
      return this.find('>.markdown-spinner').hide();
    };

    MarkdownMindmapView.prototype.copyToClipboard = function() {
      if (this.loading) {
        return false;
      }
      this.getSVG(function(error, html) {
        if (error != null) {
          return console.warn('Copying Markdown as SVG failed', error);
        } else {
          return atom.clipboard.write(html);
        }
      });
      return true;
    };

    MarkdownMindmapView.prototype.saveAs = function() {
      var filePath, htmlFilePath, projectPath, title;
      if (this.loading) {
        return;
      }
      filePath = this.getPath();
      title = 'Markdown to SVG';
      if (filePath) {
        title = path.parse(filePath).name;
        filePath += '.svg';
      } else {
        filePath = 'untitled.md.svg';
        if (projectPath = atom.project.getPaths()[0]) {
          filePath = path.join(projectPath, filePath);
        }
      }
      if (htmlFilePath = atom.showSaveDialogSync(filePath)) {
        return this.getSVG((function(_this) {
          return function(error, htmlBody) {
            if (error != null) {
              return console.warn('Saving Markdown as SVG failed', error);
            } else {
              fs.writeFileSync(htmlFilePath, htmlBody);
              return atom.workspace.open(htmlFilePath);
            }
          };
        })(this));
      }
    };

    MarkdownMindmapView.prototype.isEqual = function(other) {
      return this[0] === (other != null ? other[0] : void 0);
    };

    return MarkdownMindmapView;

  })(ScrollView);

  if (Grim.includeDeprecatedAPIs) {
    MarkdownMindmapView.prototype.on = function(eventName) {
      if (eventName === 'markdown-mindmap:markdown-changed') {
        Grim.deprecate("Use MarkdownMindmapView::onDidChangeMarkdown instead of the 'markdown-mindmap:markdown-changed' jQuery event");
      }
      return MarkdownMindmapView.__super__.on.apply(this, arguments);
    };
  }

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21hcmtkb3duLW1pbmRtYXAvbGliL21hcmtkb3duLW1pbmRtYXAtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLCtMQUFBO0lBQUE7OztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUE2QyxPQUFBLENBQVEsTUFBUixDQUE3QyxFQUFDLHFCQUFELEVBQVUsMkJBQVYsRUFBc0I7O0VBQ3RCLE9BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFVBQUQsRUFBSSxjQUFKLEVBQVM7O0VBQ1QsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNKLE9BQVEsT0FBQSxDQUFRLE1BQVI7O0VBQ1QsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUjs7RUFDZixjQUFBLEdBQWlCLE9BQUEsQ0FBUSxzQkFBUjs7RUFDakIsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLDRCQUFSOztFQUNwQixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBRUwsV0FBQSxHQUFjOztFQUVkLE1BQUEsR0FBUyxTQUFDLEdBQUQ7QUFDUCxRQUFBO0lBRFUsaUJBQU0sbUJBQU8scUJBQVE7V0FDL0IsZ09BQUEsR0FJYyxLQUpkLEdBSW9CLGNBSnBCLEdBSWdDLE1BSmhDLEdBSXVDLGVBSnZDLEdBSW9ELE9BSnBELEdBSTRELGlZQUo1RCxHQTBCSSxJQTFCSixHQTBCUztFQTNCRjs7RUErQlQsTUFBTSxDQUFDLE9BQVAsR0FDTTs7O0lBQ0osbUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHNDQUFQO1FBQStDLFFBQUEsRUFBVSxDQUFDLENBQTFEO09BQUw7SUFEUTs7SUFHRyw2QkFBQyxHQUFEO01BQUUsSUFBQyxDQUFBLGVBQUEsVUFBVSxJQUFDLENBQUEsZUFBQTtNQUN6QixzREFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJO01BQ2YsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BQ25CLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFKQzs7a0NBTWIsUUFBQSxHQUFVLFNBQUE7TUFDUixJQUFVLElBQUMsQ0FBQSxVQUFYO0FBQUEsZUFBQTs7TUFDQSxJQUFDLENBQUEsVUFBRCxHQUFjO01BRWQsSUFBRyxxQkFBSDtlQUNFLElBQUMsQ0FBQSxhQUFELENBQWUsSUFBQyxDQUFBLFFBQWhCLEVBREY7T0FBQSxNQUFBO1FBR0UsSUFBRyxzQkFBSDtpQkFDRSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsSUFBQyxDQUFBLFFBQXRCLEVBREY7U0FBQSxNQUFBO2lCQUdFLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLDRCQUFkLENBQTJDLENBQUEsU0FBQSxLQUFBO21CQUFBLFNBQUE7cUJBQzFELEtBQUMsQ0FBQSxtQkFBRCxDQUFxQixLQUFDLENBQUEsUUFBdEI7WUFEMEQ7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNDLENBQWpCLEVBSEY7U0FIRjs7SUFKUTs7a0NBYVYsU0FBQSxHQUFXLFNBQUE7YUFDVDtRQUFBLFlBQUEsRUFBYyxxQkFBZDtRQUNBLFFBQUEsRUFBVSxJQUFDLENBQUEsT0FBRCxDQUFBLENBRFY7UUFFQSxRQUFBLEVBQVUsSUFBQyxDQUFBLFFBRlg7O0lBRFM7O2tDQUtYLE9BQUEsR0FBUyxTQUFBO2FBQ1AsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFETzs7a0NBR1QsZ0JBQUEsR0FBa0IsU0FBQyxRQUFEO2FBQ2hCLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLGtCQUFaLEVBQWdDLFFBQWhDO0lBRGdCOztrQ0FHbEIsbUJBQUEsR0FBcUIsU0FBQyxRQUFEO2FBRW5CLElBQUk7SUFGZTs7a0NBSXJCLG1CQUFBLEdBQXFCLFNBQUMsUUFBRDthQUNuQixJQUFDLENBQUEsT0FBTyxDQUFDLEVBQVQsQ0FBWSxxQkFBWixFQUFtQyxRQUFuQztJQURtQjs7a0NBR3JCLG1CQUFBLEdBQXFCLFNBQUMsUUFBRDtNQUNuQixJQUFDLENBQUEsSUFBRCxHQUFZLElBQUEsSUFBQSxDQUFLLFFBQUw7TUFDWixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxrQkFBZDtNQUNBLElBQUMsQ0FBQSxZQUFELENBQUE7YUFDQSxJQUFDLENBQUEsY0FBRCxDQUFBO0lBSm1COztrQ0FNckIsYUFBQSxHQUFlLFNBQUMsUUFBRDtBQUNiLFVBQUE7TUFBQSxPQUFBLEdBQVUsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ1IsY0FBQTtVQUFBLEtBQUMsQ0FBQSxNQUFELEdBQVUsS0FBQyxDQUFBLFdBQUQsQ0FBYSxRQUFiO1VBRVYsSUFBRyxvQkFBSDtZQUNFLElBQW9DLG9CQUFwQztjQUFBLEtBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLGtCQUFkLEVBQUE7O1lBQ0EsS0FBQyxDQUFBLFlBQUQsQ0FBQTttQkFDQSxLQUFDLENBQUEsY0FBRCxDQUFBLEVBSEY7V0FBQSxNQUFBO29HQU9tQyxDQUFFLFdBQW5DLENBQStDLEtBQS9DLG9CQVBGOztRQUhRO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQVlWLElBQUcsc0JBQUg7ZUFDRSxPQUFBLENBQUEsRUFERjtPQUFBLE1BQUE7ZUFHRSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyw0QkFBZCxDQUEyQyxPQUEzQyxDQUFqQixFQUhGOztJQWJhOztrQ0FrQmYsV0FBQSxHQUFhLFNBQUMsUUFBRDtBQUNYLFVBQUE7QUFBQTtBQUFBLFdBQUEsc0NBQUE7O1FBQ0Usc0NBQTBCLENBQUUsUUFBWCxDQUFBLFdBQUEsS0FBeUIsUUFBUSxDQUFDLFFBQVQsQ0FBQSxDQUExQztBQUFBLGlCQUFPLE9BQVA7O0FBREY7YUFFQTtJQUhXOztrQ0FLYixZQUFBLEdBQWMsU0FBQTtBQUNaLFVBQUE7TUFBQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxDQUFDLENBQUMsUUFBRixDQUFXLENBQUMsU0FBQTttQkFBRyxLQUFDLENBQUEsY0FBRCxDQUFBO1VBQUgsQ0FBRCxDQUFYLEVBQW1DLEdBQW5DO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBQWpCO01BQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsa0JBQWQsQ0FBaUMsQ0FBQyxDQUFDLFFBQUYsQ0FBVyxDQUFDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsY0FBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUQsQ0FBWCxFQUFtQyxHQUFuQyxDQUFqQyxDQUFqQjtNQUdBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixJQUFDLENBQUEsT0FBbkIsRUFLRTtRQUFBLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxLQUFEO1lBQ2QsS0FBSyxDQUFDLGVBQU4sQ0FBQTttQkFDQSxLQUFDLENBQUEsTUFBRCxDQUFBO1VBRmM7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO1FBR0EsV0FBQSxFQUFhLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDtZQUNYLElBQTJCLEtBQUMsQ0FBQSxlQUFELENBQUEsQ0FBM0I7cUJBQUEsS0FBSyxDQUFDLGVBQU4sQ0FBQSxFQUFBOztVQURXO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhiO09BTEY7TUFtQkEsYUFBQSxHQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDZCxjQUFBO1VBQUEsS0FBQyxDQUFBLGNBQUQsQ0FBQTtVQUdBLElBQUEsMEhBQTJDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBZixDQUEwQixLQUFDLENBQUEsTUFBRCxDQUFBLENBQTFCO1VBQzNDLElBQUcsY0FBQSxJQUFVLElBQUEsS0FBVSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQSxDQUF2QjttQkFDRSxJQUFJLENBQUMsWUFBTCxDQUFrQixLQUFsQixFQURGOztRQUxjO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtNQVFoQixJQUFHLGlCQUFIO1FBQ0UsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxJQUFJLENBQUMsV0FBTixDQUFrQixhQUFsQixDQUFqQixFQURGO09BQUEsTUFFSyxJQUFHLG1CQUFIO1FBQ0gsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsaUJBQXBCLENBQXNDLFNBQUE7VUFDckQsSUFBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFuQjttQkFBQSxhQUFBLENBQUEsRUFBQTs7UUFEcUQsQ0FBdEMsQ0FBakI7UUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxlQUFSLENBQXdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsa0JBQWQ7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEIsQ0FBakI7UUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxTQUFwQixDQUE4QixTQUFBO1VBQzdDLElBQUEsQ0FBdUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUF2QjttQkFBQSxhQUFBLENBQUEsRUFBQTs7UUFENkMsQ0FBOUIsQ0FBakI7UUFFQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxTQUFSLENBQUEsQ0FBbUIsQ0FBQyxXQUFwQixDQUFnQyxTQUFBO1VBQy9DLElBQUEsQ0FBdUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUF2QjttQkFBQSxhQUFBLENBQUEsRUFBQTs7UUFEK0MsQ0FBaEMsQ0FBakIsRUFORzs7TUFTTCxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHdCQUFwQixFQUE4QyxhQUE5QyxDQUFqQjthQUVBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsNEJBQXBCLEVBQWtELGFBQWxELENBQWpCO0lBN0NZOztrQ0ErQ2QsY0FBQSxHQUFnQixTQUFBO01BQ2QsSUFBQSxDQUFzQixJQUFDLENBQUEsTUFBdkI7UUFBQSxJQUFDLENBQUEsV0FBRCxDQUFBLEVBQUE7O2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FBb0IsQ0FBQyxJQUFyQixDQUEwQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRDtVQUFZLElBQStCLGNBQS9CO21CQUFBLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQixNQUFwQixFQUFBOztRQUFaO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUExQjtJQUZjOztrQ0FJaEIsaUJBQUEsR0FBbUIsU0FBQTtNQUNqQixJQUFHLGlCQUFIO2VBQ0UsSUFBQyxDQUFBLElBQUksQ0FBQyxJQUFOLENBQUEsRUFERjtPQUFBLE1BRUssSUFBRyxtQkFBSDtlQUNILE9BQU8sQ0FBQyxPQUFSLENBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsT0FBUixDQUFBLENBQWhCLEVBREc7T0FBQSxNQUFBO2VBR0gsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsSUFBaEIsRUFIRzs7SUFIWTs7a0NBUW5CLE1BQUEsR0FBUSxTQUFDLFFBQUQ7QUFDTixVQUFBO01BQUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUM7TUFDakIsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsTUFBVCxDQUFnQixLQUFoQixDQUFzQixDQUFDO01BQy9CLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUUsQ0FBQyxHQUFILENBQU8sS0FBUCxFQUFjLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQztNQUFULENBQWQsQ0FBWDtNQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUUsQ0FBQyxHQUFILENBQU8sS0FBUCxFQUFjLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQztNQUFULENBQWQsQ0FBWDtNQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUUsQ0FBQyxHQUFILENBQU8sS0FBUCxFQUFjLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQztNQUFULENBQWQsQ0FBWDtNQUNQLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLEVBQUUsQ0FBQyxHQUFILENBQU8sS0FBUCxFQUFjLFNBQUMsQ0FBRDtlQUFPLENBQUMsQ0FBQztNQUFULENBQWQsQ0FBWDtNQUNQLFVBQUEsR0FBYSxJQUFBLEdBQU87TUFDcEIsU0FBQSxHQUFZLElBQUEsR0FBTyxJQUFQLEdBQWMsS0FBSyxDQUFDO01BQ2hDLFlBQUEsR0FBZSxLQUFLLENBQUM7TUFFckIsSUFBQSxJQUFRO01BQ1IsSUFBQSxJQUFRO01BQ1IsVUFBQSxJQUFjLENBQUEsR0FBRTtNQUNoQixTQUFBLElBQWEsQ0FBQSxHQUFFO01BRWYsSUFBQSxHQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQWIsQ0FBQTtNQUdQLFNBQUEsR0FBWSxJQUFJLENBQUMsWUFBTCxDQUFrQixXQUFsQjtNQUNaLElBQUksQ0FBQyxlQUFMLENBQXFCLFdBQXJCO01BR0EsSUFBQSxHQUFPLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQWIsQ0FBQSxDQUFtQixDQUFDLFVBQVUsQ0FBQztNQUd0QyxJQUFJLENBQUMsWUFBTCxDQUFrQixXQUFsQixFQUErQixTQUEvQjthQUVBLFFBQUEsQ0FBUyxJQUFULEVBQWUsTUFBQSxDQUFPO1FBQ3BCLE1BQUEsSUFEb0I7UUFFcEIsS0FBQSxFQUFPLFNBQUEsR0FBWSxJQUZDO1FBR3BCLE1BQUEsRUFBUSxVQUFBLEdBQWEsSUFIRDtRQUlwQixPQUFBLEVBQVksSUFBRCxHQUFNLEdBQU4sR0FBUSxDQUFDLElBQUEsR0FBTyxZQUFSLENBQVIsR0FBNkIsR0FBN0IsR0FBZ0MsU0FBaEMsR0FBMEMsR0FBMUMsR0FBNEMsQ0FBQyxVQUFBLEdBQWEsWUFBZCxDQUpuQztPQUFQLENBQWY7SUE1Qk07O2tDQW1DUixrQkFBQSxHQUFvQixTQUFDLElBQUQ7QUFJaEIsVUFBQTtNQUFBLElBQUMsQ0FBQSxXQUFELENBQUE7TUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVO01BR1YsSUFBQSxHQUFPLFlBQUEsQ0FBYSxJQUFiO01BQ1AsSUFBQSxHQUFPLGlCQUFBLENBQWtCLElBQWxCO01BQ1AsT0FBQSxHQUNFO1FBQUEsTUFBQSxFQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEIsQ0FBeUMsQ0FBQyxPQUExQyxDQUFrRCxRQUFsRCxFQUE0RCxFQUE1RCxDQUFSO1FBQ0EsU0FBQSxFQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsQ0FEWDs7TUFFRixJQUFPLG9CQUFQO1FBQ0UsSUFBQyxDQUFBLE9BQUQsR0FBVyxjQUFBLENBQWUsQ0FBQSxDQUFFLCtDQUFGLENBQWtELENBQUMsUUFBbkQsQ0FBNEQsSUFBNUQsQ0FBaUUsQ0FBQyxHQUFsRSxDQUFzRSxDQUF0RSxDQUFmLEVBQXlGLElBQXpGLEVBQStGLE9BQS9GLEVBRGI7T0FBQSxNQUFBO1FBR0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQWlCLElBQWpCLENBQXNCLENBQUMsR0FBdkIsQ0FBMkIsT0FBM0IsQ0FBbUMsQ0FBQyxHQUFwQyxDQUF3QztVQUFDLFFBQUEsRUFBVSxDQUFYO1NBQXhDLENBQXNELENBQUMsTUFBdkQsQ0FBQSxDQUErRCxDQUFDLEdBQWhFLENBQW9FO1VBQUMsUUFBQSxFQUFVLEdBQVg7U0FBcEUsRUFIRjs7TUFLQSxHQUFBLEdBQU0sSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsK0JBQTNCLEVBQTRELEVBQTVEO01BQ04sR0FBQSxJQUFPLDBCQUFBLEdBQTZCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3QkFBaEI7TUFDcEMsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLEdBQW5CO01BRUEsS0FBQSxHQUFRLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQWIsQ0FBdUIsZ0JBQXZCO01BQ1IsYUFBQSxHQUFnQixJQUFDLENBQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFmLENBQW9CLElBQUMsQ0FBQSxPQUFyQjtNQUNoQixLQUFLLENBQUMsRUFBTixDQUFTLE9BQVQsRUFBa0IsSUFBbEI7TUFDQSxLQUFLLENBQUMsU0FBTixDQUFnQixRQUFoQixDQUF5QixDQUFDLEVBQTFCLENBQTZCLE9BQTdCLEVBQXNDLGFBQXRDO01BQ0EsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsV0FBaEIsQ0FBNEIsQ0FBQyxFQUE3QixDQUFnQyxPQUFoQyxFQUF5QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtpQkFDdkMsS0FBQyxDQUFBLFlBQUQsQ0FBYyxDQUFDLENBQUMsSUFBaEI7UUFEdUM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXpDO01BR0EsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMscUJBQWQ7YUFDQSxJQUFDLENBQUEsZUFBRCxDQUFpQixtQ0FBakI7SUE5QmdCOztrQ0FnQ3BCLFlBQUEsR0FBYyxTQUFDLElBQUQ7YUFDWixJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFwQixFQUNFO1FBQUEsV0FBQSxFQUFhLElBQWI7UUFDQSxZQUFBLEVBQWMsS0FEZDtRQUVBLGNBQUEsRUFBZ0IsSUFGaEI7T0FERixDQUd1QixDQUFDLElBSHhCLENBRzZCLFNBQUMsTUFBRDtBQUN6QixZQUFBO1FBQUEsTUFBQSxHQUFTLE1BQU0sQ0FBQyx1QkFBUCxDQUFBO1FBQ1QsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQjtRQUNQLEtBQUEsR0FBUSxJQUFJLENBQUMsOEJBQUwsQ0FBb0MsTUFBcEMsQ0FBMkMsQ0FBQztlQUNwRCxNQUFNLENBQUMsVUFBUCxDQUFBLENBQW1CLENBQUMsWUFBcEIsQ0FBaUMsS0FBakM7TUFKeUIsQ0FIN0I7SUFEWTs7a0NBVWQsUUFBQSxHQUFVLFNBQUE7TUFDUixJQUFHLGlCQUFIO2VBQ0ksQ0FBQyxJQUFJLENBQUMsUUFBTCxDQUFjLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBZCxDQUFELENBQUEsR0FBMkIsV0FEL0I7T0FBQSxNQUVLLElBQUcsbUJBQUg7ZUFDRCxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsUUFBUixDQUFBLENBQUQsQ0FBQSxHQUFvQixXQURuQjtPQUFBLE1BQUE7ZUFHSCxtQkFIRzs7SUFIRzs7a0NBUVYsV0FBQSxHQUFhLFNBQUE7YUFDWDtJQURXOztrQ0FHYixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUcsaUJBQUg7ZUFDRSxxQkFBQSxHQUFxQixDQUFDLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBRCxFQUR2QjtPQUFBLE1BQUE7ZUFHRSw0QkFBQSxHQUE2QixJQUFDLENBQUEsU0FIaEM7O0lBRE07O2tDQU1SLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBRyxpQkFBSDtlQUNFLElBQUMsQ0FBQSxJQUFJLENBQUMsT0FBTixDQUFBLEVBREY7T0FBQSxNQUVLLElBQUcsbUJBQUg7ZUFDSCxJQUFDLENBQUEsTUFBTSxDQUFDLE9BQVIsQ0FBQSxFQURHOztJQUhFOztrQ0FNVCxVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7Z0RBQU8sQ0FBRSxVQUFULENBQUE7SUFEVTs7a0NBR1osc0JBQUEsR0FBd0IsU0FBQTthQUN0QixRQUFRLENBQUM7SUFEYTs7a0NBR3hCLG1CQUFBLEdBQXFCLFNBQUE7QUFFbkIsVUFBQTtNQUFBLGdCQUFBLEdBQW1CLFFBQVEsQ0FBQyxhQUFULENBQXVCLGFBQXZCO01BQ25CLGdCQUFnQixDQUFDLFlBQWpCLENBQThCLFNBQTlCLEVBQXlDLGtCQUF6QztNQUNBLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBZCxDQUEwQixnQkFBMUI7TUFHQSxnQkFBZ0IsQ0FBQyxVQUFqQixDQUFBO2FBR0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBdEIsQ0FBNEIsZ0JBQWdCLENBQUMsVUFBN0MsQ0FBd0QsQ0FBQyxHQUF6RCxDQUE2RCxTQUFDLFlBQUQ7ZUFDM0QsWUFBWSxDQUFDO01BRDhDLENBQTdEO0lBVm1COztrQ0FhckIscUJBQUEsR0FBdUIsU0FBQTtBQUNyQixVQUFBO01BQUEsbUJBQUEsR0FBc0I7TUFDdEIsVUFBQSxHQUFhO01BQ2IsWUFBQSxHQUFlO0FBRWY7QUFBQSxXQUFBLHNDQUFBOztRQUNFLElBQUcsd0JBQUg7QUFDRTtBQUFBLGVBQUEsd0NBQUE7O1lBRUUsSUFBMEMsOEVBQTFDO2NBQUEsbUJBQW1CLENBQUMsSUFBcEIsQ0FBeUIsSUFBSSxDQUFDLE9BQTlCLEVBQUE7O0FBRkYsV0FERjs7QUFERjthQU1BLG1CQUNFLENBQUMsTUFESCxDQUNVLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBRFYsQ0FFRSxDQUFDLElBRkgsQ0FFUSxJQUZSLENBR0UsQ0FBQyxPQUhILENBR1csbUJBSFgsRUFHZ0MsbUJBSGhDLENBSUUsQ0FBQyxPQUpILENBSVcsUUFKWCxFQUlxQixPQUpyQixDQUtFLENBQUMsT0FMSCxDQUtXLFlBTFgsRUFLeUIsU0FBQyxLQUFELEVBQVEsVUFBUixFQUFvQixNQUFwQixFQUE0QixNQUE1QjtBQUNyQixZQUFBO1FBQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixXQUFyQixFQUFrQyxVQUFsQztRQUNaLFlBQUEsR0FBZSxFQUFFLENBQUMsWUFBSCxDQUFnQixTQUFoQixFQUEyQixRQUEzQjtRQUNmLFVBQUEsR0FBaUIsSUFBQSxNQUFBLENBQU8sWUFBUCxFQUFxQixRQUFyQixDQUE4QixDQUFDLFFBQS9CLENBQXdDLFFBQXhDO2VBQ2pCLDhCQUFBLEdBQStCLFVBQS9CLEdBQTBDO01BSnJCLENBTHpCO0lBWHFCOztrQ0FzQnZCLFNBQUEsR0FBVyxTQUFDLE1BQUQ7QUFDVCxVQUFBO01BQUEsY0FBQSxvQkFBaUIsTUFBTSxDQUFFO2FBRXpCLElBQUMsQ0FBQSxJQUFELENBQU0sR0FBQSxDQUFJLFNBQUE7UUFDUixJQUFDLENBQUEsRUFBRCxDQUFJLDRCQUFKO1FBQ0EsSUFBc0Isc0JBQXRCO2lCQUFBLElBQUMsQ0FBQSxFQUFELENBQUksY0FBSixFQUFBOztNQUZRLENBQUosQ0FBTjtJQUhTOztrQ0FPWCxXQUFBLEdBQWEsU0FBQTtBQUNYLFVBQUE7TUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXO01BQ1gsT0FBQSxHQUFVLElBQUMsQ0FBQSxJQUFELENBQU0sb0JBQU47TUFDVixJQUFHLE9BQU8sQ0FBQyxNQUFSLEtBQWtCLENBQXJCO1FBQ0UsSUFBQyxDQUFBLE1BQUQsQ0FBUSxHQUFBLENBQUksU0FBQTtpQkFDVixJQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxrQkFBUDtXQUFMLEVBQWdDLHdCQUFoQztRQURVLENBQUosQ0FBUixFQURGOzthQUdBLE9BQU8sQ0FBQyxJQUFSLENBQUE7SUFOVzs7a0NBUWIsV0FBQSxHQUFhLFNBQUE7TUFDWCxJQUFDLENBQUEsT0FBRCxHQUFXO2FBQ1gsSUFBQyxDQUFBLElBQUQsQ0FBTSxvQkFBTixDQUEyQixDQUFDLElBQTVCLENBQUE7SUFGVzs7a0NBSWIsZUFBQSxHQUFpQixTQUFBO01BQ2YsSUFBZ0IsSUFBQyxDQUFBLE9BQWpCO0FBQUEsZUFBTyxNQUFQOztNQUVBLElBQUMsQ0FBQSxNQUFELENBQVEsU0FBQyxLQUFELEVBQVEsSUFBUjtRQUNOLElBQUcsYUFBSDtpQkFDRSxPQUFPLENBQUMsSUFBUixDQUFhLGdDQUFiLEVBQStDLEtBQS9DLEVBREY7U0FBQSxNQUFBO2lCQUdFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBZixDQUFxQixJQUFyQixFQUhGOztNQURNLENBQVI7YUFNQTtJQVRlOztrQ0FXakIsTUFBQSxHQUFRLFNBQUE7QUFDTixVQUFBO01BQUEsSUFBVSxJQUFDLENBQUEsT0FBWDtBQUFBLGVBQUE7O01BRUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxPQUFELENBQUE7TUFDWCxLQUFBLEdBQVE7TUFDUixJQUFHLFFBQUg7UUFDRSxLQUFBLEdBQVEsSUFBSSxDQUFDLEtBQUwsQ0FBVyxRQUFYLENBQW9CLENBQUM7UUFDN0IsUUFBQSxJQUFZLE9BRmQ7T0FBQSxNQUFBO1FBSUUsUUFBQSxHQUFXO1FBQ1gsSUFBRyxXQUFBLEdBQWMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQXpDO1VBQ0UsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBVixFQUF1QixRQUF2QixFQURiO1NBTEY7O01BUUEsSUFBRyxZQUFBLEdBQWUsSUFBSSxDQUFDLGtCQUFMLENBQXdCLFFBQXhCLENBQWxCO2VBRUUsSUFBQyxDQUFBLE1BQUQsQ0FBUSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEtBQUQsRUFBUSxRQUFSO1lBQ04sSUFBRyxhQUFIO3FCQUNFLE9BQU8sQ0FBQyxJQUFSLENBQWEsK0JBQWIsRUFBOEMsS0FBOUMsRUFERjthQUFBLE1BQUE7Y0FHRSxFQUFFLENBQUMsYUFBSCxDQUFpQixZQUFqQixFQUErQixRQUEvQjtxQkFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsWUFBcEIsRUFKRjs7VUFETTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUixFQUZGOztJQWJNOztrQ0FzQlIsT0FBQSxHQUFTLFNBQUMsS0FBRDthQUNQLElBQUUsQ0FBQSxDQUFBLENBQUYsc0JBQVEsS0FBTyxDQUFBLENBQUE7SUFEUjs7OztLQWxVdUI7O0VBcVVsQyxJQUFHLElBQUksQ0FBQyxxQkFBUjtJQUNFLG1CQUFtQixDQUFBLFNBQUUsQ0FBQSxFQUFyQixHQUEwQixTQUFDLFNBQUQ7TUFDeEIsSUFBRyxTQUFBLEtBQWEsbUNBQWhCO1FBQ0UsSUFBSSxDQUFDLFNBQUwsQ0FBZSw4R0FBZixFQURGOzthQUVBLDZDQUFBLFNBQUE7SUFId0IsRUFENUI7O0FBcFhBIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbntFbWl0dGVyLCBEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgJCQkLCBTY3JvbGxWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuR3JpbSA9IHJlcXVpcmUgJ2dyaW0nXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xue0ZpbGV9ID0gcmVxdWlyZSAnYXRvbSdcbm1hcmttYXBQYXJzZSA9IHJlcXVpcmUgJ21hcmttYXAvcGFyc2UubWFya2Rvd24nXG5tYXJrbWFwTWluZG1hcCA9IHJlcXVpcmUgJ21hcmttYXAvdmlldy5taW5kbWFwJ1xudHJhbnNmb3JtSGVhZGluZ3MgPSByZXF1aXJlICdtYXJrbWFwL3RyYW5zZm9ybS5oZWFkaW5ncydcbmQzID0gcmVxdWlyZSAnZDMnXG5cblNWR19QQURESU5HID0gMTVcblxuZ2V0U1ZHID0gKHsgYm9keSwgd2lkdGgsIGhlaWdodCwgdmlld2JveCB9KSAtPlxuICBcIlwiXCI8P3htbCB2ZXJzaW9uPVwiMS4wXCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxuICA8IURPQ1RZUEUgc3ZnIFBVQkxJQyBcIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOXCJcbiAgICBcImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZFwiPlxuICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB2ZXJzaW9uPVwiMS4xXCJcbiAgICAgICB3aWR0aD1cIiN7d2lkdGh9XCIgaGVpZ2h0PVwiI3toZWlnaHR9XCIgdmlld0JveD1cIiN7dmlld2JveH1cIj5cbiAgICA8ZGVmcz5cbiAgICAgIDxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj48IVtDREFUQVtcbiAgICAgICAgLm1hcmttYXAtbm9kZSB7XG4gICAgICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgICAgICB9XG5cbiAgICAgICAgLm1hcmttYXAtbm9kZS1jaXJjbGUge1xuICAgICAgICAgIGZpbGw6ICNmZmY7XG4gICAgICAgICAgc3Ryb2tlLXdpZHRoOiAxLjVweDtcbiAgICAgICAgfVxuXG4gICAgICAgIC5tYXJrbWFwLW5vZGUtdGV4dCB7XG4gICAgICAgICAgZmlsbDogICMwMDA7XG4gICAgICAgICAgZm9udDogMTBweCBzYW5zLXNlcmlmO1xuICAgICAgICB9XG5cbiAgICAgICAgLm1hcmttYXAtbGluayB7XG4gICAgICAgICAgZmlsbDogbm9uZTtcbiAgICAgICAgfVxuICAgICAgXV0+PC9zdHlsZT5cbiAgICA8L2RlZnM+XG4gICAgI3tib2R5fVxuICA8L3N2Zz5cbiAgXCJcIlwiXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE1hcmtkb3duTWluZG1hcFZpZXcgZXh0ZW5kcyBTY3JvbGxWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgY2xhc3M6ICdtYXJrZG93bi1taW5kbWFwIG5hdGl2ZS1rZXktYmluZGluZ3MnLCB0YWJpbmRleDogLTFcblxuICBjb25zdHJ1Y3RvcjogKHtAZWRpdG9ySWQsIEBmaWxlUGF0aH0pIC0+XG4gICAgc3VwZXJcbiAgICBAZW1pdHRlciA9IG5ldyBFbWl0dGVyXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAbG9hZGVkID0gZmFsc2VcblxuICBhdHRhY2hlZDogLT5cbiAgICByZXR1cm4gaWYgQGlzQXR0YWNoZWRcbiAgICBAaXNBdHRhY2hlZCA9IHRydWVcblxuICAgIGlmIEBlZGl0b3JJZD9cbiAgICAgIEByZXNvbHZlRWRpdG9yKEBlZGl0b3JJZClcbiAgICBlbHNlXG4gICAgICBpZiBhdG9tLndvcmtzcGFjZT9cbiAgICAgICAgQHN1YnNjcmliZVRvRmlsZVBhdGgoQGZpbGVQYXRoKVxuICAgICAgZWxzZVxuICAgICAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ucGFja2FnZXMub25EaWRBY3RpdmF0ZUluaXRpYWxQYWNrYWdlcyA9PlxuICAgICAgICAgIEBzdWJzY3JpYmVUb0ZpbGVQYXRoKEBmaWxlUGF0aClcblxuICBzZXJpYWxpemU6IC0+XG4gICAgZGVzZXJpYWxpemVyOiAnTWFya2Rvd25NaW5kbWFwVmlldydcbiAgICBmaWxlUGF0aDogQGdldFBhdGgoKVxuICAgIGVkaXRvcklkOiBAZWRpdG9ySWRcblxuICBkZXN0cm95OiAtPlxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxuICBvbkRpZENoYW5nZVRpdGxlOiAoY2FsbGJhY2spIC0+XG4gICAgQGVtaXR0ZXIub24gJ2RpZC1jaGFuZ2UtdGl0bGUnLCBjYWxsYmFja1xuXG4gIG9uRGlkQ2hhbmdlTW9kaWZpZWQ6IChjYWxsYmFjaykgLT5cbiAgICAjIE5vIG9wIHRvIHN1cHByZXNzIGRlcHJlY2F0aW9uIHdhcm5pbmdcbiAgICBuZXcgRGlzcG9zYWJsZVxuXG4gIG9uRGlkQ2hhbmdlTWFya2Rvd246IChjYWxsYmFjaykgLT5cbiAgICBAZW1pdHRlci5vbiAnZGlkLWNoYW5nZS1tYXJrZG93bicsIGNhbGxiYWNrXG5cbiAgc3Vic2NyaWJlVG9GaWxlUGF0aDogKGZpbGVQYXRoKSAtPlxuICAgIEBmaWxlID0gbmV3IEZpbGUoZmlsZVBhdGgpXG4gICAgQGVtaXR0ZXIuZW1pdCAnZGlkLWNoYW5nZS10aXRsZSdcbiAgICBAaGFuZGxlRXZlbnRzKClcbiAgICBAcmVuZGVyTWFya2Rvd24oKVxuXG4gIHJlc29sdmVFZGl0b3I6IChlZGl0b3JJZCkgLT5cbiAgICByZXNvbHZlID0gPT5cbiAgICAgIEBlZGl0b3IgPSBAZWRpdG9yRm9ySWQoZWRpdG9ySWQpXG5cbiAgICAgIGlmIEBlZGl0b3I/XG4gICAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2UtdGl0bGUnIGlmIEBlZGl0b3I/XG4gICAgICAgIEBoYW5kbGVFdmVudHMoKVxuICAgICAgICBAcmVuZGVyTWFya2Rvd24oKVxuICAgICAgZWxzZVxuICAgICAgICAjIFRoZSBlZGl0b3IgdGhpcyBwcmV2aWV3IHdhcyBjcmVhdGVkIGZvciBoYXMgYmVlbiBjbG9zZWQgc28gY2xvc2VcbiAgICAgICAgIyB0aGlzIHByZXZpZXcgc2luY2UgYSBwcmV2aWV3IGNhbm5vdCBiZSByZW5kZXJlZCB3aXRob3V0IGFuIGVkaXRvclxuICAgICAgICBhdG9tLndvcmtzcGFjZT8ucGFuZUZvckl0ZW0odGhpcyk/LmRlc3Ryb3lJdGVtKHRoaXMpXG5cbiAgICBpZiBhdG9tLndvcmtzcGFjZT9cbiAgICAgIHJlc29sdmUoKVxuICAgIGVsc2VcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlSW5pdGlhbFBhY2thZ2VzKHJlc29sdmUpXG5cbiAgZWRpdG9yRm9ySWQ6IChlZGl0b3JJZCkgLT5cbiAgICBmb3IgZWRpdG9yIGluIGF0b20ud29ya3NwYWNlLmdldFRleHRFZGl0b3JzKClcbiAgICAgIHJldHVybiBlZGl0b3IgaWYgZWRpdG9yLmlkPy50b1N0cmluZygpIGlzIGVkaXRvcklkLnRvU3RyaW5nKClcbiAgICBudWxsXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5ncmFtbWFycy5vbkRpZEFkZEdyYW1tYXIgPT4gXy5kZWJvdW5jZSgoPT4gQHJlbmRlck1hcmtkb3duKCkpLCAyNTApXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmdyYW1tYXJzLm9uRGlkVXBkYXRlR3JhbW1hciBfLmRlYm91bmNlKCg9PiBAcmVuZGVyTWFya2Rvd24oKSksIDI1MClcblxuICAgICMgZGlzYWJsZSBldmVudHMgZm9yIG5vdywgbWF5YmUgcmVpbXBsZW1lbnQgdGhlbSBsYXRlclxuICAgIGF0b20uY29tbWFuZHMuYWRkIEBlbGVtZW50LFxuICAgICAgIyAnY29yZTptb3ZlLXVwJzogPT5cbiAgICAgICMgICBAc2Nyb2xsVXAoKVxuICAgICAgIyAnY29yZTptb3ZlLWRvd24nOiA9PlxuICAgICAgIyAgIEBzY3JvbGxEb3duKClcbiAgICAgICdjb3JlOnNhdmUtYXMnOiAoZXZlbnQpID0+XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICAgIEBzYXZlQXMoKVxuICAgICAgJ2NvcmU6Y29weSc6IChldmVudCkgPT5cbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCkgaWYgQGNvcHlUb0NsaXBib2FyZCgpXG4gICAgICAjICdtYXJrZG93bi1taW5kbWFwOnpvb20taW4nOiA9PlxuICAgICAgIyAgIHpvb21MZXZlbCA9IHBhcnNlRmxvYXQoQGNzcygnem9vbScpKSBvciAxXG4gICAgICAjICAgQGNzcygnem9vbScsIHpvb21MZXZlbCArIC4xKVxuICAgICAgIyAnbWFya2Rvd24tbWluZG1hcDp6b29tLW91dCc6ID0+XG4gICAgICAjICAgem9vbUxldmVsID0gcGFyc2VGbG9hdChAY3NzKCd6b29tJykpIG9yIDFcbiAgICAgICMgICBAY3NzKCd6b29tJywgem9vbUxldmVsIC0gLjEpXG4gICAgICAjICdtYXJrZG93bi1taW5kbWFwOnJlc2V0LXpvb20nOiA9PlxuICAgICAgIyAgIEBjc3MoJ3pvb20nLCAxKVxuXG4gICAgY2hhbmdlSGFuZGxlciA9ID0+XG4gICAgICBAcmVuZGVyTWFya2Rvd24oKVxuXG4gICAgICAjIFRPRE86IFJlbW92ZSBwYW5lRm9yVVJJIGNhbGwgd2hlbiA6OnBhbmVGb3JJdGVtIGlzIHJlbGVhc2VkXG4gICAgICBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0/KHRoaXMpID8gYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShAZ2V0VVJJKCkpXG4gICAgICBpZiBwYW5lPyBhbmQgcGFuZSBpc250IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgICBwYW5lLmFjdGl2YXRlSXRlbSh0aGlzKVxuXG4gICAgaWYgQGZpbGU/XG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIEBmaWxlLm9uRGlkQ2hhbmdlKGNoYW5nZUhhbmRsZXIpXG4gICAgZWxzZSBpZiBAZWRpdG9yP1xuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBAZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU3RvcENoYW5naW5nIC0+XG4gICAgICAgIGNoYW5nZUhhbmRsZXIoKSBpZiBhdG9tLmNvbmZpZy5nZXQgJ21hcmtkb3duLW1pbmRtYXAubGl2ZVVwZGF0ZSdcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgQGVkaXRvci5vbkRpZENoYW5nZVBhdGggPT4gQGVtaXR0ZXIuZW1pdCAnZGlkLWNoYW5nZS10aXRsZSdcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgQGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZFNhdmUgLT5cbiAgICAgICAgY2hhbmdlSGFuZGxlcigpIHVubGVzcyBhdG9tLmNvbmZpZy5nZXQgJ21hcmtkb3duLW1pbmRtYXAubGl2ZVVwZGF0ZSdcbiAgICAgIEBkaXNwb3NhYmxlcy5hZGQgQGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZFJlbG9hZCAtPlxuICAgICAgICBjaGFuZ2VIYW5kbGVyKCkgdW5sZXNzIGF0b20uY29uZmlnLmdldCAnbWFya2Rvd24tbWluZG1hcC5saXZlVXBkYXRlJ1xuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdtYXJrZG93bi1taW5kbWFwLnRoZW1lJywgY2hhbmdlSGFuZGxlclxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICdtYXJrZG93bi1taW5kbWFwLmxpbmtTaGFwZScsIGNoYW5nZUhhbmRsZXJcblxuICByZW5kZXJNYXJrZG93bjogLT5cbiAgICBAc2hvd0xvYWRpbmcoKSB1bmxlc3MgQGxvYWRlZFxuICAgIEBnZXRNYXJrZG93blNvdXJjZSgpLnRoZW4gKHNvdXJjZSkgPT4gQHJlbmRlck1hcmtkb3duVGV4dChzb3VyY2UpIGlmIHNvdXJjZT9cblxuICBnZXRNYXJrZG93blNvdXJjZTogLT5cbiAgICBpZiBAZmlsZT9cbiAgICAgIEBmaWxlLnJlYWQoKVxuICAgIGVsc2UgaWYgQGVkaXRvcj9cbiAgICAgIFByb21pc2UucmVzb2x2ZShAZWRpdG9yLmdldFRleHQoKSlcbiAgICBlbHNlXG4gICAgICBQcm9taXNlLnJlc29sdmUobnVsbClcblxuICBnZXRTVkc6IChjYWxsYmFjaykgLT5cbiAgICBzdGF0ZSA9IEBtaW5kbWFwLnN0YXRlXG4gICAgbm9kZXMgPSBAbWluZG1hcC5sYXlvdXQoc3RhdGUpLm5vZGVzXG4gICAgbWluWCA9IE1hdGgucm91bmQoZDMubWluKG5vZGVzLCAoZCkgLT4gZC54KSlcbiAgICBtaW5ZID0gTWF0aC5yb3VuZChkMy5taW4obm9kZXMsIChkKSAtPiBkLnkpKVxuICAgIG1heFggPSBNYXRoLnJvdW5kKGQzLm1heChub2RlcywgKGQpIC0+IGQueCkpXG4gICAgbWF4WSA9IE1hdGgucm91bmQoZDMubWF4KG5vZGVzLCAoZCkgLT4gZC55KSlcbiAgICByZWFsSGVpZ2h0ID0gbWF4WCAtIG1pblhcbiAgICByZWFsV2lkdGggPSBtYXhZIC0gbWluWSArIHN0YXRlLm5vZGVXaWR0aFxuICAgIGhlaWdodE9mZnNldCA9IHN0YXRlLm5vZGVIZWlnaHRcblxuICAgIG1pblggLT0gU1ZHX1BBRERJTkc7XG4gICAgbWluWSAtPSBTVkdfUEFERElORztcbiAgICByZWFsSGVpZ2h0ICs9IDIqU1ZHX1BBRERJTkc7XG4gICAgcmVhbFdpZHRoICs9IDIqU1ZHX1BBRERJTkc7XG5cbiAgICBub2RlID0gQG1pbmRtYXAuc3ZnLm5vZGUoKVxuXG4gICAgIyB1bnNldCB0cmFuc2Zvcm1hdGlvbiBiZWZvcmUgd2UgdGFrZSB0aGUgc3ZnLCB3ZSB3aWxsIGhhbmRsZSBpdCB2aWEgdmlld3BvcnQgc2V0dGluZ1xuICAgIHRyYW5zZm9ybSA9IG5vZGUuZ2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nKVxuICAgIG5vZGUucmVtb3ZlQXR0cmlidXRlKCd0cmFuc2Zvcm0nKVxuXG4gICAgIyB0YWtlIHRoZSBzdmdcbiAgICBib2R5ID0gQG1pbmRtYXAuc3ZnLm5vZGUoKS5wYXJlbnROb2RlLmlubmVySFRNTFxuXG4gICAgIyByZXN0b3JlIHRoZSB0cmFuc2Zvcm1hdGlvblxuICAgIG5vZGUuc2V0QXR0cmlidXRlKCd0cmFuc2Zvcm0nLCB0cmFuc2Zvcm0pXG5cbiAgICBjYWxsYmFjayhudWxsLCBnZXRTVkcoe1xuICAgICAgYm9keSxcbiAgICAgIHdpZHRoOiByZWFsV2lkdGggKyAncHgnLFxuICAgICAgaGVpZ2h0OiByZWFsSGVpZ2h0ICsgJ3B4JyxcbiAgICAgIHZpZXdib3g6IFwiI3ttaW5ZfSAje21pblggLSBoZWlnaHRPZmZzZXR9ICN7cmVhbFdpZHRofSAje3JlYWxIZWlnaHQgKyBoZWlnaHRPZmZzZXR9XCJcbiAgICB9KSlcblxuICByZW5kZXJNYXJrZG93blRleHQ6ICh0ZXh0KSAtPlxuICAgICAgIyBpZiBlcnJvclxuICAgICAgIyAgIEBzaG93RXJyb3IoZXJyb3IpXG4gICAgICAjIGVsc2VcbiAgICAgIEBoaWRlTG9hZGluZygpXG4gICAgICBAbG9hZGVkID0gdHJ1ZVxuXG4gICAgICAjIFRPRE8gcGFyYWxlbCByZW5kZXJpbmdcbiAgICAgIGRhdGEgPSBtYXJrbWFwUGFyc2UodGV4dClcbiAgICAgIGRhdGEgPSB0cmFuc2Zvcm1IZWFkaW5ncyhkYXRhKVxuICAgICAgb3B0aW9ucyA9XG4gICAgICAgIHByZXNldDogYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1taW5kbWFwLnRoZW1lJykucmVwbGFjZSgvLWRhcmskLywgJycpXG4gICAgICAgIGxpbmtTaGFwZTogYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1taW5kbWFwLmxpbmtTaGFwZScpXG4gICAgICBpZiBub3QgQG1pbmRtYXA/XG4gICAgICAgIEBtaW5kbWFwID0gbWFya21hcE1pbmRtYXAoJCgnPHN2ZyBzdHlsZT1cImhlaWdodDogMTAwJTsgd2lkdGg6IDEwMCVcIj48L3N2Zz4nKS5hcHBlbmRUbyh0aGlzKS5nZXQoMCksIGRhdGEsIG9wdGlvbnMpXG4gICAgICBlbHNlXG4gICAgICAgIEBtaW5kbWFwLnNldERhdGEoZGF0YSkuc2V0KG9wdGlvbnMpLnNldCh7ZHVyYXRpb246IDB9KS51cGRhdGUoKS5zZXQoe2R1cmF0aW9uOiA3NTB9KVxuXG4gICAgICBjbHMgPSB0aGlzLmF0dHIoJ2NsYXNzJykucmVwbGFjZSgvbWFya2Rvd24tbWluZG1hcC10aGVtZS1bXlxcc10rLywgJycpXG4gICAgICBjbHMgKz0gJyBtYXJrZG93bi1taW5kbWFwLXRoZW1lLScgKyBhdG9tLmNvbmZpZy5nZXQoJ21hcmtkb3duLW1pbmRtYXAudGhlbWUnKVxuICAgICAgdGhpcy5hdHRyKCdjbGFzcycsIGNscylcblxuICAgICAgbm9kZXMgPSBAbWluZG1hcC5zdmcuc2VsZWN0QWxsKCdnLm1hcmttYXAtbm9kZScpXG4gICAgICB0b2dnbGVIYW5kbGVyID0gQG1pbmRtYXAuY2xpY2suYmluZCBAbWluZG1hcFxuICAgICAgbm9kZXMub24oJ2NsaWNrJywgbnVsbClcbiAgICAgIG5vZGVzLnNlbGVjdEFsbCgnY2lyY2xlJykub24oJ2NsaWNrJywgdG9nZ2xlSGFuZGxlcilcbiAgICAgIG5vZGVzLnNlbGVjdEFsbCgndGV4dCxyZWN0Jykub24gJ2NsaWNrJywgKGQpID0+XG4gICAgICAgIEBzY3JvbGxUb0xpbmUgZC5saW5lXG5cbiAgICAgIEBlbWl0dGVyLmVtaXQgJ2RpZC1jaGFuZ2UtbWFya2Rvd24nXG4gICAgICBAb3JpZ2luYWxUcmlnZ2VyKCdtYXJrZG93bi1taW5kbWFwOm1hcmtkb3duLWNoYW5nZWQnKVxuXG4gIHNjcm9sbFRvTGluZTogKGxpbmUpIC0+XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihAZ2V0UGF0aCgpLFxuICAgICAgaW5pdGlhbExpbmU6IGxpbmVcbiAgICAgIGFjdGl2YXRlUGFuZTogZmFsc2VcbiAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICAgIGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpXG4gICAgICAgIHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICAgICAgICBwaXhlbCA9IHZpZXcucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKGN1cnNvcikudG9wXG4gICAgICAgIGVkaXRvci5nZXRFbGVtZW50KCkuc2V0U2Nyb2xsVG9wIHBpeGVsXG5cbiAgZ2V0VGl0bGU6IC0+XG4gICAgaWYgQGZpbGU/XG4gICAgICBcIiN7cGF0aC5iYXNlbmFtZShAZ2V0UGF0aCgpKX0gTWluZG1hcFwiXG4gICAgZWxzZSBpZiBAZWRpdG9yP1xuICAgICAgXCIje0BlZGl0b3IuZ2V0VGl0bGUoKX0gTWluZG1hcFwiXG4gICAgZWxzZVxuICAgICAgXCJNYXJrZG93biBNaW5kbWFwXCJcblxuICBnZXRJY29uTmFtZTogLT5cbiAgICBcIm1hcmtkb3duXCJcblxuICBnZXRVUkk6IC0+XG4gICAgaWYgQGZpbGU/XG4gICAgICBcIm1hcmtkb3duLW1pbmRtYXA6Ly8je0BnZXRQYXRoKCl9XCJcbiAgICBlbHNlXG4gICAgICBcIm1hcmtkb3duLW1pbmRtYXA6Ly9lZGl0b3IvI3tAZWRpdG9ySWR9XCJcblxuICBnZXRQYXRoOiAtPlxuICAgIGlmIEBmaWxlP1xuICAgICAgQGZpbGUuZ2V0UGF0aCgpXG4gICAgZWxzZSBpZiBAZWRpdG9yP1xuICAgICAgQGVkaXRvci5nZXRQYXRoKClcblxuICBnZXRHcmFtbWFyOiAtPlxuICAgIEBlZGl0b3I/LmdldEdyYW1tYXIoKVxuXG4gIGdldERvY3VtZW50U3R5bGVTaGVldHM6IC0+ICMgVGhpcyBmdW5jdGlvbiBleGlzdHMgc28gd2UgY2FuIHN0dWIgaXRcbiAgICBkb2N1bWVudC5zdHlsZVNoZWV0c1xuXG4gIGdldFRleHRFZGl0b3JTdHlsZXM6IC0+XG5cbiAgICB0ZXh0RWRpdG9yU3R5bGVzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF0b20tc3R5bGVzXCIpXG4gICAgdGV4dEVkaXRvclN0eWxlcy5zZXRBdHRyaWJ1dGUgXCJjb250ZXh0XCIsIFwiYXRvbS10ZXh0LWVkaXRvclwiXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCB0ZXh0RWRpdG9yU3R5bGVzXG5cbiAgICAjIEZvcmNlIHN0eWxlcyBpbmplY3Rpb25cbiAgICB0ZXh0RWRpdG9yU3R5bGVzLmluaXRpYWxpemUoKVxuXG4gICAgIyBFeHRyYWN0IHN0eWxlIGVsZW1lbnRzIGNvbnRlbnRcbiAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuYXBwbHkodGV4dEVkaXRvclN0eWxlcy5jaGlsZE5vZGVzKS5tYXAgKHN0eWxlRWxlbWVudCkgLT5cbiAgICAgIHN0eWxlRWxlbWVudC5pbm5lclRleHRcblxuICBnZXRNYXJrZG93bk1pbmRtYXBDU1M6IC0+XG4gICAgbWFya2Rvd1ByZXZpZXdSdWxlcyA9IFtdXG4gICAgcnVsZVJlZ0V4cCA9IC9cXC5tYXJrZG93bi1taW5kbWFwL1xuICAgIGNzc1VybFJlZkV4cCA9IC91cmxcXChhdG9tOlxcL1xcL21hcmtkb3duLW1pbmRtYXBcXC9hc3NldHNcXC8oLiopXFwpL1xuXG4gICAgZm9yIHN0eWxlc2hlZXQgaW4gQGdldERvY3VtZW50U3R5bGVTaGVldHMoKVxuICAgICAgaWYgc3R5bGVzaGVldC5ydWxlcz9cbiAgICAgICAgZm9yIHJ1bGUgaW4gc3R5bGVzaGVldC5ydWxlc1xuICAgICAgICAgICMgV2Ugb25seSBuZWVkIGAubWFya2Rvd24tcmV2aWV3YCBjc3NcbiAgICAgICAgICBtYXJrZG93UHJldmlld1J1bGVzLnB1c2gocnVsZS5jc3NUZXh0KSBpZiBydWxlLnNlbGVjdG9yVGV4dD8ubWF0Y2gocnVsZVJlZ0V4cCk/XG5cbiAgICBtYXJrZG93UHJldmlld1J1bGVzXG4gICAgICAuY29uY2F0KEBnZXRUZXh0RWRpdG9yU3R5bGVzKCkpXG4gICAgICAuam9pbignXFxuJylcbiAgICAgIC5yZXBsYWNlKC9hdG9tLXRleHQtZWRpdG9yL2csICdwcmUuZWRpdG9yLWNvbG9ycycpXG4gICAgICAucmVwbGFjZSgvOmhvc3QvZywgJy5ob3N0JykgIyBSZW1vdmUgc2hhZG93LWRvbSA6aG9zdCBzZWxlY3RvciBjYXVzaW5nIHByb2JsZW0gb24gRkZcbiAgICAgIC5yZXBsYWNlIGNzc1VybFJlZkV4cCwgKG1hdGNoLCBhc3NldHNOYW1lLCBvZmZzZXQsIHN0cmluZykgLT4gIyBiYXNlNjQgZW5jb2RlIGFzc2V0c1xuICAgICAgICBhc3NldFBhdGggPSBwYXRoLmpvaW4gX19kaXJuYW1lLCAnLi4vYXNzZXRzJywgYXNzZXRzTmFtZVxuICAgICAgICBvcmlnaW5hbERhdGEgPSBmcy5yZWFkRmlsZVN5bmMgYXNzZXRQYXRoLCAnYmluYXJ5J1xuICAgICAgICBiYXNlNjREYXRhID0gbmV3IEJ1ZmZlcihvcmlnaW5hbERhdGEsICdiaW5hcnknKS50b1N0cmluZygnYmFzZTY0JylcbiAgICAgICAgXCJ1cmwoJ2RhdGE6aW1hZ2UvanBlZztiYXNlNjQsI3tiYXNlNjREYXRhfScpXCJcblxuICBzaG93RXJyb3I6IChyZXN1bHQpIC0+XG4gICAgZmFpbHVyZU1lc3NhZ2UgPSByZXN1bHQ/Lm1lc3NhZ2VcblxuICAgIEBodG1sICQkJCAtPlxuICAgICAgQGgyICdQcmV2aWV3aW5nIE1hcmtkb3duIEZhaWxlZCdcbiAgICAgIEBoMyBmYWlsdXJlTWVzc2FnZSBpZiBmYWlsdXJlTWVzc2FnZT9cblxuICBzaG93TG9hZGluZzogLT5cbiAgICBAbG9hZGluZyA9IHRydWVcbiAgICBzcGlubmVyID0gQGZpbmQoJz4ubWFya2Rvd24tc3Bpbm5lcicpXG4gICAgaWYgc3Bpbm5lci5sZW5ndGggPT0gMFxuICAgICAgQGFwcGVuZCAkJCQgLT5cbiAgICAgICAgQGRpdiBjbGFzczogJ21hcmtkb3duLXNwaW5uZXInLCAnTG9hZGluZyBNYXJrZG93blxcdTIwMjYnXG4gICAgc3Bpbm5lci5zaG93KClcblxuICBoaWRlTG9hZGluZzogLT5cbiAgICBAbG9hZGluZyA9IGZhbHNlXG4gICAgQGZpbmQoJz4ubWFya2Rvd24tc3Bpbm5lcicpLmhpZGUoKVxuXG4gIGNvcHlUb0NsaXBib2FyZDogLT5cbiAgICByZXR1cm4gZmFsc2UgaWYgQGxvYWRpbmdcblxuICAgIEBnZXRTVkcgKGVycm9yLCBodG1sKSAtPlxuICAgICAgaWYgZXJyb3I/XG4gICAgICAgIGNvbnNvbGUud2FybignQ29weWluZyBNYXJrZG93biBhcyBTVkcgZmFpbGVkJywgZXJyb3IpXG4gICAgICBlbHNlXG4gICAgICAgIGF0b20uY2xpcGJvYXJkLndyaXRlKGh0bWwpXG5cbiAgICB0cnVlXG5cbiAgc2F2ZUFzOiAtPlxuICAgIHJldHVybiBpZiBAbG9hZGluZ1xuXG4gICAgZmlsZVBhdGggPSBAZ2V0UGF0aCgpXG4gICAgdGl0bGUgPSAnTWFya2Rvd24gdG8gU1ZHJ1xuICAgIGlmIGZpbGVQYXRoXG4gICAgICB0aXRsZSA9IHBhdGgucGFyc2UoZmlsZVBhdGgpLm5hbWVcbiAgICAgIGZpbGVQYXRoICs9ICcuc3ZnJ1xuICAgIGVsc2VcbiAgICAgIGZpbGVQYXRoID0gJ3VudGl0bGVkLm1kLnN2ZydcbiAgICAgIGlmIHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF1cbiAgICAgICAgZmlsZVBhdGggPSBwYXRoLmpvaW4ocHJvamVjdFBhdGgsIGZpbGVQYXRoKVxuXG4gICAgaWYgaHRtbEZpbGVQYXRoID0gYXRvbS5zaG93U2F2ZURpYWxvZ1N5bmMoZmlsZVBhdGgpXG5cbiAgICAgIEBnZXRTVkcgKGVycm9yLCBodG1sQm9keSkgPT5cbiAgICAgICAgaWYgZXJyb3I/XG4gICAgICAgICAgY29uc29sZS53YXJuKCdTYXZpbmcgTWFya2Rvd24gYXMgU1ZHIGZhaWxlZCcsIGVycm9yKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgZnMud3JpdGVGaWxlU3luYyhodG1sRmlsZVBhdGgsIGh0bWxCb2R5KVxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oaHRtbEZpbGVQYXRoKVxuXG4gIGlzRXF1YWw6IChvdGhlcikgLT5cbiAgICBAWzBdIGlzIG90aGVyP1swXSAjIENvbXBhcmUgRE9NIGVsZW1lbnRzXG5cbmlmIEdyaW0uaW5jbHVkZURlcHJlY2F0ZWRBUElzXG4gIE1hcmtkb3duTWluZG1hcFZpZXc6Om9uID0gKGV2ZW50TmFtZSkgLT5cbiAgICBpZiBldmVudE5hbWUgaXMgJ21hcmtkb3duLW1pbmRtYXA6bWFya2Rvd24tY2hhbmdlZCdcbiAgICAgIEdyaW0uZGVwcmVjYXRlKFwiVXNlIE1hcmtkb3duTWluZG1hcFZpZXc6Om9uRGlkQ2hhbmdlTWFya2Rvd24gaW5zdGVhZCBvZiB0aGUgJ21hcmtkb3duLW1pbmRtYXA6bWFya2Rvd24tY2hhbmdlZCcgalF1ZXJ5IGV2ZW50XCIpXG4gICAgc3VwZXJcbiJdfQ==
