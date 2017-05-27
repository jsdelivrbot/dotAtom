(function() {
  var CompositeDisposable, ExposeTabView, ExposeView, Sortable, TextBuffer, TextEditorView, View, filter, ref, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, TextBuffer = ref.TextBuffer;

  ref1 = require('atom-space-pen-views'), View = ref1.View, TextEditorView = ref1.TextEditorView;

  filter = require('fuzzaldrin').filter;

  Sortable = require('sortablejs');

  ExposeTabView = require('./expose-tab-view');

  module.exports = ExposeView = (function(superClass) {
    extend(ExposeView, superClass);

    ExposeView.prototype.tabs = [];

    ExposeView.content = function(searchBuffer) {
      var searchTextEditor;
      searchTextEditor = atom.workspace.buildTextEditor({
        mini: true,
        tabLength: 2,
        softTabs: true,
        softWrapped: false,
        buffer: searchBuffer,
        placeholderText: 'Search tabs'
      });
      return this.div({
        "class": 'expose-view',
        tabindex: -1
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'expose-top input-block'
          }, function() {
            _this.div({
              "class": 'input-block-item input-block-item--flex'
            }, function() {
              return _this.subview('searchView', new TextEditorView({
                editor: searchTextEditor
              }));
            });
            return _this.div({
              "class": 'input-block-item'
            }, function() {
              return _this.div({
                "class": 'btn-group'
              }, function() {
                _this.button({
                  outlet: 'exposeSettings',
                  "class": 'btn icon-gear'
                });
                return _this.button({
                  "class": 'btn icon-x'
                });
              });
            });
          });
          return _this.div({
            outlet: 'tabList',
            "class": 'tab-list'
          });
        };
      })(this));
    };

    function ExposeView() {
      ExposeView.__super__.constructor.call(this, this.searchBuffer = new TextBuffer);
    }

    ExposeView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      return this.handleDrag();
    };

    ExposeView.prototype.destroy = function() {
      var ref2;
      this.remove();
      return (ref2 = this.disposables) != null ? ref2.dispose() : void 0;
    };

    ExposeView.prototype.handleEvents = function() {
      this.exposeSettings.on('click', function() {
        return atom.workspace.open('atom://config/packages/expose');
      });
      this.searchView.on('click', function(event) {
        return event.stopPropagation();
      });
      this.searchView.getModel().onDidStopChanging((function(_this) {
        return function() {
          if (_this.didIgnoreFirstChange) {
            _this.update();
          }
          return _this.didIgnoreFirstChange = true;
        };
      })(this));
      this.on('click', (function(_this) {
        return function(event) {
          event.stopPropagation();
          return _this.exposeHide();
        };
      })(this));
      this.disposables.add(atom.config.observe('expose.useAnimations', (function(_this) {
        return function(value) {
          return _this.element.classList.toggle('animate', value);
        };
      })(this)));
      this.disposables.add(atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            return _this.handleConfirm();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.exposeHide();
          };
        })(this),
        'core:move-right': (function(_this) {
          return function() {
            return _this.nextTab();
          };
        })(this),
        'core:move-left': (function(_this) {
          return function() {
            return _this.nextTab(-1);
          };
        })(this),
        'expose:close': (function(_this) {
          return function() {
            return _this.exposeHide();
          };
        })(this),
        'expose:activate-1': (function(_this) {
          return function() {
            return _this.handleNumberKey(1);
          };
        })(this),
        'expose:activate-2': (function(_this) {
          return function() {
            return _this.handleNumberKey(2);
          };
        })(this),
        'expose:activate-3': (function(_this) {
          return function() {
            return _this.handleNumberKey(3);
          };
        })(this),
        'expose:activate-4': (function(_this) {
          return function() {
            return _this.handleNumberKey(4);
          };
        })(this),
        'expose:activate-5': (function(_this) {
          return function() {
            return _this.handleNumberKey(5);
          };
        })(this),
        'expose:activate-6': (function(_this) {
          return function() {
            return _this.handleNumberKey(6);
          };
        })(this),
        'expose:activate-7': (function(_this) {
          return function() {
            return _this.handleNumberKey(7);
          };
        })(this),
        'expose:activate-8': (function(_this) {
          return function() {
            return _this.handleNumberKey(8);
          };
        })(this),
        'expose:activate-9': (function(_this) {
          return function() {
            return _this.handleNumberKey(9);
          };
        })(this)
      }));
      this.on('keydown', (function(_this) {
        return function(event) {
          return _this.handleKeyEvent(event);
        };
      })(this));
      this.disposables.add(atom.workspace.onDidAddPaneItem((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
      return this.disposables.add(atom.workspace.onDidDestroyPaneItem((function(_this) {
        return function() {
          return _this.update();
        };
      })(this)));
    };

    ExposeView.prototype.handleDrag = function() {
      return Sortable.create(this.tabList.context, {
        ghostClass: 'ghost',
        onEnd: (function(_this) {
          return function(evt) {
            return _this.moveTab(evt.oldIndex, evt.newIndex);
          };
        })(this)
      });
    };

    ExposeView.prototype.moveTab = function(from, to) {
      var fromItem, fromPane, i, item, j, len, ref2, ref3, ref4, toItem, toPane, toPaneIndex;
      if (!(fromItem = (ref2 = this.tabs[from]) != null ? ref2.item : void 0)) {
        return;
      }
      if (!(toItem = (ref3 = this.tabs[to]) != null ? ref3.item : void 0)) {
        return;
      }
      fromPane = atom.workspace.paneForItem(fromItem);
      toPane = atom.workspace.paneForItem(toItem);
      toPaneIndex = 0;
      ref4 = toPane.getItems();
      for (i = j = 0, len = ref4.length; j < len; i = ++j) {
        item = ref4[i];
        if (item === toItem) {
          toPaneIndex = i;
        }
      }
      fromPane.moveItemToPane(fromItem, toPane, toPaneIndex);
      return this.update(true);
    };

    ExposeView.prototype.didChangeVisible = function(visible) {
      this.visible = visible;
      if (this.visible) {
        this.searchBuffer.setText('');
        this.update();
        this.focus();
      } else {
        atom.workspace.getActivePane().activate();
      }
      return setTimeout(((function(_this) {
        return function() {
          return _this.element.classList.toggle('visible', _this.visible);
        };
      })(this)), 0);
    };

    ExposeView.prototype.getGroupColor = function(n) {
      var colors;
      colors = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6'];
      return colors[n % colors.length];
    };

    ExposeView.prototype.update = function(force) {
      var color, i, item, j, k, len, len1, pane, ref2, ref3;
      if (!(this.visible || force)) {
        return;
      }
      this.removeTabs();
      this.tabs = [];
      ref2 = atom.workspace.getPanes();
      for (i = j = 0, len = ref2.length; j < len; i = ++j) {
        pane = ref2[i];
        color = this.getGroupColor(i);
        ref3 = pane.getItems();
        for (k = 0, len1 = ref3.length; k < len1; k++) {
          item = ref3[k];
          this.tabs.push(new ExposeTabView(item, color));
        }
      }
      return this.renderTabs(this.tabs = this.filterTabs(this.tabs));
    };

    ExposeView.prototype.filterTabs = function(tabs) {
      var text;
      text = this.searchBuffer.getText();
      if (text === '') {
        return tabs;
      }
      return filter(tabs, text, {
        key: 'title'
      });
    };

    ExposeView.prototype.renderTabs = function(tabs) {
      var j, len, results, tab;
      results = [];
      for (j = 0, len = tabs.length; j < len; j++) {
        tab = tabs[j];
        results.push(this.tabList.append(tab));
      }
      return results;
    };

    ExposeView.prototype.removeTabs = function() {
      var j, len, ref2, tab;
      this.tabList.empty();
      ref2 = this.tabs;
      for (j = 0, len = ref2.length; j < len; j++) {
        tab = ref2[j];
        tab.destroy();
      }
      return this.tabs = [];
    };

    ExposeView.prototype.activateTab = function(n) {
      var ref2;
      if (n == null) {
        n = 1;
      }
      if (n < 1) {
        n = 1;
      }
      if (n > 9 || n > this.tabs.length) {
        n = this.tabs.length;
      }
      if ((ref2 = this.tabs[n - 1]) != null) {
        ref2.activateTab();
      }
      return this.exposeHide();
    };

    ExposeView.prototype.handleConfirm = function() {
      if (this.isSearching()) {
        return this.activateTab();
      } else {
        return this.exposeHide();
      }
    };

    ExposeView.prototype.handleNumberKey = function(number) {
      if (this.isSearching()) {
        return this.searchView.getModel().insertText(number.toString());
      } else {
        return this.activateTab(number);
      }
    };

    ExposeView.prototype.handleKeyEvent = function(event) {
      var ignoredKeys;
      ignoredKeys = ['shift', 'control', 'alt', 'meta'];
      if (ignoredKeys.indexOf(event.key.toLowerCase()) === -1) {
        return this.searchView.focus();
      }
    };

    ExposeView.prototype.nextTab = function(n) {
      var i, j, len, nextTabView, ref2, tabView;
      if (n == null) {
        n = 1;
      }
      ref2 = this.tabs;
      for (i = j = 0, len = ref2.length; j < len; i = ++j) {
        tabView = ref2[i];
        if (tabView.isActiveTab()) {
          if (i + n < 0) {
            n = this.tabs.length - 1;
          }
          if (nextTabView = this.tabs[(i + n) % this.tabs.length]) {
            nextTabView.activateTab();
          }
          return this.focus();
        }
      }
    };

    ExposeView.prototype.exposeHide = function() {
      var j, k, len, len1, panel, ref2, ref3, results, tab;
      this.didIgnoreFirstChange = false;
      ref2 = this.tabs;
      for (j = 0, len = ref2.length; j < len; j++) {
        tab = ref2[j];
        tab.destroy();
      }
      ref3 = atom.workspace.getModalPanels();
      results = [];
      for (k = 0, len1 = ref3.length; k < len1; k++) {
        panel = ref3[k];
        if (panel.className === 'expose-panel') {
          results.push(panel.hide());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    ExposeView.prototype.isSearching = function() {
      return this.searchView.hasClass('is-focused');
    };

    return ExposeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2V4cG9zZS9saWIvZXhwb3NlLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw2R0FBQTtJQUFBOzs7RUFBQSxNQUFvQyxPQUFBLENBQVEsTUFBUixDQUFwQyxFQUFDLDZDQUFELEVBQXNCOztFQUN0QixPQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxnQkFBRCxFQUFPOztFQUNOLFNBQVUsT0FBQSxDQUFRLFlBQVI7O0VBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztFQUVYLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSOztFQUVoQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7eUJBQ0osSUFBQSxHQUFNOztJQUVOLFVBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQyxZQUFEO0FBQ1IsVUFBQTtNQUFBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZixDQUNqQjtRQUFBLElBQUEsRUFBTSxJQUFOO1FBQ0EsU0FBQSxFQUFXLENBRFg7UUFFQSxRQUFBLEVBQVUsSUFGVjtRQUdBLFdBQUEsRUFBYSxLQUhiO1FBSUEsTUFBQSxFQUFRLFlBSlI7UUFLQSxlQUFBLEVBQWlCLGFBTGpCO09BRGlCO2FBU25CLElBQUMsQ0FBQSxHQUFELENBQUs7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGFBQVA7UUFBc0IsUUFBQSxFQUFVLENBQUMsQ0FBakM7T0FBTCxFQUF5QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDdkMsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sd0JBQVA7V0FBTCxFQUFzQyxTQUFBO1lBQ3BDLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHlDQUFQO2FBQUwsRUFBdUQsU0FBQTtxQkFDckQsS0FBQyxD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QUFBLEtBQUssQ0FBQyxJQUFOLENBQUEsR0FBQTtTQUFBLE1BQUE7K0JBQUE7O0FBREY7O0lBSlU7O3lCQU9aLFdBQUEsR0FBYSxTQUFBO2FBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxRQUFaLENBQXFCLFlBQXJCO0lBQUg7Ozs7S0E1S1U7QUFSekIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSwgVGV4dEJ1ZmZlcn0gPSByZXF1aXJlICdhdG9tJ1xue1ZpZXcsIFRleHRFZGl0b3JWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xue2ZpbHRlcn0gPSByZXF1aXJlICdmdXp6YWxkcmluJ1xuU29ydGFibGUgPSByZXF1aXJlICdzb3J0YWJsZWpzJ1xuXG5FeHBvc2VUYWJWaWV3ID0gcmVxdWlyZSAnLi9leHBvc2UtdGFiLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIEV4cG9zZVZpZXcgZXh0ZW5kcyBWaWV3XG4gIHRhYnM6IFtdXG5cbiAgQGNvbnRlbnQ6IChzZWFyY2hCdWZmZXIpIC0+XG4gICAgc2VhcmNoVGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmJ1aWxkVGV4dEVkaXRvcihcbiAgICAgIG1pbmk6IHRydWVcbiAgICAgIHRhYkxlbmd0aDogMlxuICAgICAgc29mdFRhYnM6IHRydWVcbiAgICAgIHNvZnRXcmFwcGVkOiBmYWxzZVxuICAgICAgYnVmZmVyOiBzZWFyY2hCdWZmZXJcbiAgICAgIHBsYWNlaG9sZGVyVGV4dDogJ1NlYXJjaCB0YWJzJ1xuICAgIClcblxuICAgIEBkaXYgY2xhc3M6ICdleHBvc2UtdmlldycsIHRhYmluZGV4OiAtMSwgPT5cbiAgICAgIEBkaXYgY2xhc3M6ICdleHBvc2UtdG9wIGlucHV0LWJsb2NrJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ2lucHV0LWJsb2NrLWl0ZW0gaW5wdXQtYmxvY2staXRlbS0tZmxleCcsID0+XG4gICAgICAgICAgQHN1YnZpZXcgJ3NlYXJjaFZpZXcnLCBuZXcgVGV4dEVkaXRvclZpZXcoZWRpdG9yOiBzZWFyY2hUZXh0RWRpdG9yKVxuICAgICAgICBAZGl2IGNsYXNzOiAnaW5wdXQtYmxvY2staXRlbScsID0+XG4gICAgICAgICAgQGRpdiBjbGFzczogJ2J0bi1ncm91cCcsID0+XG4gICAgICAgICAgICBAYnV0dG9uIG91dGxldDogJ2V4cG9zZVNldHRpbmdzJywgY2xhc3M6ICdidG4gaWNvbi1nZWFyJ1xuICAgICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBpY29uLXgnXG5cbiAgICAgIEBkaXYgb3V0bGV0OiAndGFiTGlzdCcsIGNsYXNzOiAndGFiLWxpc3QnXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAgc3VwZXIgQHNlYXJjaEJ1ZmZlciA9IG5ldyBUZXh0QnVmZmVyXG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBoYW5kbGVFdmVudHMoKVxuICAgIEBoYW5kbGVEcmFnKClcblxuICBkZXN0cm95OiAtPlxuICAgIEByZW1vdmUoKVxuICAgIEBkaXNwb3NhYmxlcz8uZGlzcG9zZSgpXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIEBleHBvc2VTZXR0aW5ncy5vbiAnY2xpY2snLCAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiAnYXRvbTovL2NvbmZpZy9wYWNrYWdlcy9leHBvc2UnXG5cbiAgICBAc2VhcmNoVmlldy5vbiAnY2xpY2snLCAoZXZlbnQpIC0+XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXG4gICAgQHNlYXJjaFZpZXcuZ2V0TW9kZWwoKS5vbkRpZFN0b3BDaGFuZ2luZyA9PlxuICAgICAgQHVwZGF0ZSgpIGlmIEBkaWRJZ25vcmVGaXJzdENoYW5nZVxuICAgICAgQGRpZElnbm9yZUZpcnN0Q2hhbmdlID0gdHJ1ZVxuXG4gICAgIyBUaGlzIGV2ZW50IGdldHMgcHJvcGFnYXRlZCBmcm9tIG1vc3QgZWxlbWVudCBjbGlja3Mgb24gdG9wXG4gICAgQG9uICdjbGljaycsIChldmVudCkgPT5cbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgICBAZXhwb3NlSGlkZSgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ2V4cG9zZS51c2VBbmltYXRpb25zJywgKHZhbHVlKSA9PlxuICAgICAgQGVsZW1lbnQuY2xhc3NMaXN0LnRvZ2dsZSgnYW5pbWF0ZScsIHZhbHVlKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCBAZWxlbWVudCxcbiAgICAgICdjb3JlOmNvbmZpcm0nOiA9PiBAaGFuZGxlQ29uZmlybSgpXG4gICAgICAnY29yZTpjYW5jZWwnOiA9PiBAZXhwb3NlSGlkZSgpXG4gICAgICAnY29yZTptb3ZlLXJpZ2h0JzogPT4gQG5leHRUYWIoKVxuICAgICAgJ2NvcmU6bW92ZS1sZWZ0JzogPT4gQG5leHRUYWIoLTEpXG4gICAgICAnZXhwb3NlOmNsb3NlJzogPT4gQGV4cG9zZUhpZGUoKVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS0xJzogPT4gQGhhbmRsZU51bWJlcktleSgxKVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS0yJzogPT4gQGhhbmRsZU51bWJlcktleSgyKVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS0zJzogPT4gQGhhbmRsZU51bWJlcktleSgzKVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS00JzogPT4gQGhhbmRsZU51bWJlcktleSg0KVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS01JzogPT4gQGhhbmRsZU51bWJlcktleSg1KVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS02JzogPT4gQGhhbmRsZU51bWJlcktleSg2KVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS03JzogPT4gQGhhbmRsZU51bWJlcktleSg3KVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS04JzogPT4gQGhhbmRsZU51bWJlcktleSg4KVxuICAgICAgJ2V4cG9zZTphY3RpdmF0ZS05JzogPT4gQGhhbmRsZU51bWJlcktleSg5KVxuXG4gICAgQG9uICdrZXlkb3duJywgKGV2ZW50KSA9PiBAaGFuZGxlS2V5RXZlbnQoZXZlbnQpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkQWRkUGFuZUl0ZW0gPT4gQHVwZGF0ZSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLndvcmtzcGFjZS5vbkRpZERlc3Ryb3lQYW5lSXRlbSA9PiBAdXBkYXRlKClcblxuICBoYW5kbGVEcmFnOiAtPlxuICAgIFNvcnRhYmxlLmNyZWF0ZShcbiAgICAgIEB0YWJMaXN0LmNvbnRleHRcbiAgICAgIGdob3N0Q2xhc3M6ICdnaG9zdCdcbiAgICAgIG9uRW5kOiAoZXZ0KSA9PiBAbW92ZVRhYihldnQub2xkSW5kZXgsIGV2dC5uZXdJbmRleClcbiAgICApXG5cbiAgbW92ZVRhYjogKGZyb20sIHRvKSAtPlxuICAgIHJldHVybiB1bmxlc3MgZnJvbUl0ZW0gPSBAdGFic1tmcm9tXT8uaXRlbVxuICAgIHJldHVybiB1bmxlc3MgdG9JdGVtID0gQHRhYnNbdG9dPy5pdGVtXG5cbiAgICBmcm9tUGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGZyb21JdGVtKVxuICAgIHRvUGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKHRvSXRlbSlcblxuICAgIHRvUGFuZUluZGV4ID0gMFxuICAgIGZvciBpdGVtLCBpIGluIHRvUGFuZS5nZXRJdGVtcygpXG4gICAgICB0b1BhbmVJbmRleCA9IGkgaWYgaXRlbSBpcyB0b0l0ZW1cblxuICAgIGZyb21QYW5lLm1vdmVJdGVtVG9QYW5lKGZyb21JdGVtLCB0b1BhbmUsIHRvUGFuZUluZGV4KVxuICAgIEB1cGRhdGUodHJ1ZSlcblxuICBkaWRDaGFuZ2VWaXNpYmxlOiAoQHZpc2libGUpIC0+XG4gICAgaWYgQHZpc2libGVcbiAgICAgIEBzZWFyY2hCdWZmZXIuc2V0VGV4dCgnJylcbiAgICAgIEB1cGRhdGUoKVxuICAgICAgQGZvY3VzKClcbiAgICBlbHNlXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKCkuYWN0aXZhdGUoKVxuXG4gICAgIyBBbmltYXRpb24gZG9lcyBub3QgdHJpZ2dlciB3aGVuIGNsYXNzIGlzIHNldCBpbW1lZGlhdGVseVxuICAgIHNldFRpbWVvdXQgKD0+IEBlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ3Zpc2libGUnLCBAdmlzaWJsZSkpLCAwXG5cbiAgZ2V0R3JvdXBDb2xvcjogKG4pIC0+XG4gICAgY29sb3JzID0gWycjMzQ5OGRiJywgJyNlNzRjM2MnLCAnIzJlY2M3MScsICcjOWI1OWI2J11cbiAgICBjb2xvcnNbbiAlIGNvbG9ycy5sZW5ndGhdXG5cbiAgdXBkYXRlOiAoZm9yY2UpIC0+XG4gICAgcmV0dXJuIHVubGVzcyBAdmlzaWJsZSBvciBmb3JjZVxuICAgIEByZW1vdmVUYWJzKClcblxuICAgIEB0YWJzID0gW11cbiAgICBmb3IgcGFuZSwgaSBpbiBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpXG4gICAgICBjb2xvciA9IEBnZXRHcm91cENvbG9yKGkpXG4gICAgICBmb3IgaXRlbSBpbiBwYW5lLmdldEl0ZW1zKClcbiAgICAgICAgQHRhYnMucHVzaCBuZXcgRXhwb3NlVGFiVmlldyhpdGVtLCBjb2xvcilcblxuICAgIEByZW5kZXJUYWJzKEB0YWJzID0gQGZpbHRlclRhYnMoQHRhYnMpKVxuXG4gIGZpbHRlclRhYnM6ICh0YWJzKSAtPlxuICAgIHRleHQgPSBAc2VhcmNoQnVmZmVyLmdldFRleHQoKVxuICAgIHJldHVybiB0YWJzIGlmIHRleHQgaXMgJydcbiAgICBmaWx0ZXIodGFicywgdGV4dCwga2V5OiAndGl0bGUnKVxuXG4gIHJlbmRlclRhYnM6ICh0YWJzKSAtPlxuICAgIGZvciB0YWIgaW4gdGFic1xuICAgICAgQHRhYkxpc3QuYXBwZW5kIHRhYlxuXG4gIHJlbW92ZVRhYnM6IC0+XG4gICAgQHRhYkxpc3QuZW1wdHkoKVxuICAgIGZvciB0YWIgaW4gQHRhYnNcbiAgICAgIHRhYi5kZXN0cm95KClcbiAgICBAdGFicyA9IFtdXG5cbiAgYWN0aXZhdGVUYWI6IChuID0gMSkgLT5cbiAgICBuID0gMSBpZiBuIDwgMVxuICAgIG4gPSBAdGFicy5sZW5ndGggaWYgbiA+IDkgb3IgbiA+IEB0YWJzLmxlbmd0aFxuICAgIEB0YWJzW24tMV0/LmFjdGl2YXRlVGFiKClcbiAgICBAZXhwb3NlSGlkZSgpXG5cbiAgaGFuZGxlQ29uZmlybTogLT5cbiAgICBpZiBAaXNTZWFyY2hpbmcoKSB0aGVuIEBhY3RpdmF0ZVRhYigpIGVsc2UgQGV4cG9zZUhpZGUoKVxuXG4gIGhhbmRsZU51bWJlcktleTogKG51bWJlcikgLT5cbiAgICBpZiBAaXNTZWFyY2hpbmcoKVxuICAgICAgQHNlYXJjaFZpZXcuZ2V0TW9kZWwoKS5pbnNlcnRUZXh0KG51bWJlci50b1N0cmluZygpKVxuICAgIGVsc2VcbiAgICAgIEBhY3RpdmF0ZVRhYihudW1iZXIpXG5cbiAgaGFuZGxlS2V5RXZlbnQ6IChldmVudCkgLT5cbiAgICBpZ25vcmVkS2V5cyA9IFsnc2hpZnQnLCAnY29udHJvbCcsICdhbHQnLCAnbWV0YSddXG4gICAgQHNlYXJjaFZpZXcuZm9jdXMoKSBpZiBpZ25vcmVkS2V5cy5pbmRleE9mKGV2ZW50LmtleS50b0xvd2VyQ2FzZSgpKSBpcyAtMVxuXG4gIG5leHRUYWI6IChuID0gMSkgLT5cbiAgICBmb3IgdGFiVmlldywgaSBpbiBAdGFic1xuICAgICAgaWYgdGFiVmlldy5pc0FjdGl2ZVRhYigpXG4gICAgICAgIG4gPSBAdGFicy5sZW5ndGggLSAxIGlmIGkrbiA8IDBcbiAgICAgICAgbmV4dFRhYlZpZXcuYWN0aXZhdGVUYWIoKSBpZiBuZXh0VGFiVmlldyA9IEB0YWJzWyhpK24pJUB0YWJzLmxlbmd0aF1cbiAgICAgICAgcmV0dXJuIEBmb2N1cygpXG5cbiAgZXhwb3NlSGlkZTogLT5cbiAgICBAZGlkSWdub3JlRmlyc3RDaGFuZ2UgPSBmYWxzZVxuICAgIGZvciB0YWIgaW4gQHRhYnNcbiAgICAgIHRhYi5kZXN0cm95KClcbiAgICBmb3IgcGFuZWwgaW4gYXRvbS53b3Jrc3BhY2UuZ2V0TW9kYWxQYW5lbHMoKVxuICAgICAgcGFuZWwuaGlkZSgpIGlmIHBhbmVsLmNsYXNzTmFtZSBpcyAnZXhwb3NlLXBhbmVsJ1xuXG4gIGlzU2VhcmNoaW5nOiAtPiBAc2VhcmNoVmlldy5oYXNDbGFzcygnaXMtZm9jdXNlZCcpXG4iXX0=
