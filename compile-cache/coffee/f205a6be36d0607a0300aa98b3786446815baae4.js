(function() {
  var TreeViewAutoresize;

  module.exports = TreeViewAutoresize = {
    config: {
      delayMilliseconds: {
        type: 'integer',
        "default": 100,
        description: 'Number of milliseconds to wait before animations. Smaller means faster.'
      }
    },
    subscriptions: null,
    delayMs: 100,
    activate: function() {
      return requestIdleCallback((function(_this) {
        return function() {
          var CompositeDisposable, requirePackages;
          requirePackages = require('atom-utils').requirePackages;
          CompositeDisposable = require('atom').CompositeDisposable;
          _this.subscriptions = new CompositeDisposable;
          _this.subscriptions.add(atom.config.observe('tree-view-autoresize.delayMilliseconds', function(delayMs) {
            return _this.delayMs = delayMs;
          }));
          return requirePackages('tree-view').then(function(arg) {
            var treeView;
            treeView = arg[0];
            if (treeView.treeView == null) {
              treeView.createView();
            }
            _this.treePanel = treeView.treeView.element;
            _this.treePanel.style.width = null;
            _this.initTreeViewEvents();
            return _this.resizeTreeView();
          });
        };
      })(this));
    },
    deactivate: function() {
      this.treePanel.removeEventListener('click', this.bindClick);
      return this.subscriptions.dispose();
    },
    resizeTreeView: function() {
      return setTimeout((function(_this) {
        return function() {
          if (_this.isInLeft()) {
            return atom.workspace.getLeftDock().handleResizeToFit();
          } else {
            return atom.workspace.getRightDock().handleResizeToFit();
          }
        };
      })(this), this.delayMs);
    },
    onClickDirectory: function(e) {
      var node;
      node = e.target;
      while (node !== null && node !== this.treePanel) {
        if (node.classList.contains('directory')) {
          this.resizeTreeView();
          return;
        }
        node = node.parentNode;
      }
    },
    isInLeft: function() {
      var node;
      node = this.treePanel.parentNode;
      while (node !== null) {
        if (node.classList.contains('left')) {
          return true;
        }
        node = node.parentNode;
      }
      return false;
    },
    initTreeViewEvents: function() {
      this.bindClick = this.onClickDirectory.bind(this);
      this.treePanel.addEventListener('click', this.bindClick);
      this.subscriptions.add(atom.project.onDidChangePaths(((function(_this) {
        return function() {
          return _this.resizeTreeView();
        };
      })(this))));
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'tree-view:reveal-active-file': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:toggle': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:show': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this)
      }));
      return this.subscriptions.add(atom.commands.add('.tree-view', {
        'tree-view:open-selected-entry': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:expand-item': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:recursive-expand-directory': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:collapse-directory': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:recursive-collapse-directory': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:move': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:cut': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:paste': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:toggle-vcs-ignored-files': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:toggle-ignored-names': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this),
        'tree-view:remove-project-folder': (function(_this) {
          return function() {
            return _this.resizeTreeView();
          };
        })(this)
      }));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL3RyZWUtdmlldy1hdXRvcmVzaXplL2xpYi90cmVlLXZpZXctYXV0b3Jlc2l6ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLGtCQUFBLEdBQ2Y7SUFBQSxNQUFBLEVBQ0U7TUFBQSxpQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEdBRFQ7UUFFQSxXQUFBLEVBQWEseUVBRmI7T0FERjtLQURGO0lBTUEsYUFBQSxFQUFlLElBTmY7SUFPQSxPQUFBLEVBQVMsR0FQVDtJQVNBLFFBQUEsRUFBVSxTQUFBO2FBQ1IsbUJBQUEsQ0FBb0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ2xCLGNBQUE7VUFBQyxrQkFBbUIsT0FBQSxDQUFRLFlBQVI7VUFDbkIsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSO1VBRXhCLEtBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7VUFDckIsS0FBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQix3Q0FBcEIsRUFDakIsU0FBQyxPQUFEO21CQUNFLEtBQUMsQ0FBQSxPQUFELEdBQVc7VUFEYixDQURpQixDQUFuQjtpQkFJQSxlQUFBLENBQWdCLFdBQWhCLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsU0FBQyxHQUFEO0FBQ2hDLGdCQUFBO1lBRGtDLFdBQUQ7WUFDakMsSUFBTyx5QkFBUDtjQUNFLFFBQVEsQ0FBQyxVQUFULENBQUEsRUFERjs7WUFFQSxLQUFDLENBQUEsU0FBRCxHQUFhLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDL0IsS0FBQyxDQUFBLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBakIsR0FBeUI7WUFFekIsS0FBQyxDQUFBLGtCQUFE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Q0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVJ0QztRQVNBLGdDQUFBLEVBQWtDLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGNBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVRsQztRQVVBLGlDQUFBLEVBQW1DLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLGNBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVZuQztPQURpQixDQUFuQjtJQVJrQixDQXhEcEI7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFRyZWVWaWV3QXV0b3Jlc2l6ZSA9XG4gIGNvbmZpZzpcbiAgICBkZWxheU1pbGxpc2Vjb25kczpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMTAwXG4gICAgICBkZXNjcmlwdGlvbjogJ051bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gd2FpdCBiZWZvcmUgYW5pbWF0aW9ucy4gU21hbGxlciBtZWFucyBmYXN0ZXIuJ1xuXG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcbiAgZGVsYXlNczogMTAwXG5cbiAgYWN0aXZhdGU6ICgpIC0+XG4gICAgcmVxdWVzdElkbGVDYWxsYmFjayA9PlxuICAgICAge3JlcXVpcmVQYWNrYWdlc30gPSByZXF1aXJlICdhdG9tLXV0aWxzJ1xuICAgICAge0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxuICAgICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1hdXRvcmVzaXplLmRlbGF5TWlsbGlzZWNvbmRzJyxcbiAgICAgICAgKGRlbGF5TXMpID0+XG4gICAgICAgICAgQGRlbGF5TXMgPSBkZWxheU1zXG5cbiAgICAgIHJlcXVpcmVQYWNrYWdlcygndHJlZS12aWV3JykudGhlbiAoW3RyZWVWaWV3XSkgPT5cbiAgICAgICAgdW5sZXNzIHRyZWVWaWV3LnRyZWVWaWV3P1xuICAgICAgICAgIHRyZWVWaWV3LmNyZWF0ZVZpZXcoKVxuICAgICAgICBAdHJlZVBhbmVsID0gdHJlZVZpZXcudHJlZVZpZXcuZWxlbWVudFxuICAgICAgICBAdHJlZVBhbmVsLnN0eWxlLndpZHRoID0gbnVsbFxuXG4gICAgICAgIEBpbml0VHJlZVZpZXdFdmVudHMoKVxuICAgICAgICBAcmVzaXplVHJlZVZpZXcoKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHRyZWVQYW5lbC5yZW1vdmVFdmVudExpc3RlbmVyICdjbGljaycsIEBiaW5kQ2xpY2tcbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICByZXNpemVUcmVlVmlldzogLT5cbiAgICBzZXRUaW1lb3V0ID0+XG4gICAgICBpZiBAaXNJbkxlZnQoKVxuICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRMZWZ0RG9jaygpLmhhbmRsZVJlc2l6ZVRvRml0KClcbiAgICAgIGVsc2VcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0UmlnaHREb2NrKCkuaGFuZGxlUmVzaXplVG9GaXQoKVxuICAgICwgQGRlbGF5TXNcblxuICBvbkNsaWNrRGlyZWN0b3J5OiAoZSkgLT5cbiAgICBub2RlID0gZS50YXJnZXRcbiAgICB3aGlsZSBub2RlICE9IG51bGwgYW5kIG5vZGUgIT0gQHRyZWVQYW5lbFxuICAgICAgaWYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoJ2RpcmVjdG9yeScpXG4gICAgICAgIEByZXNpemVUcmVlVmlldygpXG4gICAgICAgIHJldHVyblxuICAgICAgbm9kZSA9IG5vZGUucGFyZW50Tm9kZVxuXG4gIGlzSW5MZWZ0OiAtPlxuICAgIG5vZGUgPSBAdHJlZVBhbmVsLnBhcmVudE5vZGVcbiAgICB3aGlsZSBub2RlICE9IG51bGxcbiAgICAgIGlmIG5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCdsZWZ0JylcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIG5vZGUgPSBub2RlLnBhcmVudE5vZGVcbiAgICBmYWxzZVxuXG4gIGluaXRUcmVlVmlld0V2ZW50czogLT5cbiAgICBAYmluZENsaWNrID0gQG9uQ2xpY2tEaXJlY3RvcnkuYmluZCh0aGlzKVxuICAgIEB0cmVlUGFuZWwuYWRkRXZlbnRMaXN0ZW5lciAnY2xpY2snLCBAYmluZENsaWNrXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzICg9PiBAcmVzaXplVHJlZVZpZXcoKSlcbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20td29ya3NwYWNlJyxcbiAgICAgICd0cmVlLXZpZXc6cmV2ZWFsLWFjdGl2ZS1maWxlJzogPT4gQHJlc2l6ZVRyZWVWaWV3KClcbiAgICAgICd0cmVlLXZpZXc6dG9nZ2xlJzogPT4gQHJlc2l6ZVRyZWVWaWV3KClcbiAgICAgICd0cmVlLXZpZXc6c2hvdyc6ID0+IEByZXNpemVUcmVlVmlldygpXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICcudHJlZS12aWV3JyxcbiAgICAgICd0cmVlLXZpZXc6b3Blbi1zZWxlY3RlZC1lbnRyeSc6ID0+IEByZXNpemVUcmVlVmlldygpXG4gICAgICAndHJlZS12aWV3OmV4cGFuZC1pdGVtJzogPT4gQHJlc2l6ZVRyZWVWaWV3KClcbiAgICAgICd0cmVlLXZpZXc6cmVjdXJzaXZlLWV4cGFuZC1kaXJlY3RvcnknOiA9PiBAcmVzaXplVHJlZVZpZXcoKVxuICAgICAgJ3RyZWUtdmlldzpjb2xsYXBzZS1kaXJlY3RvcnknOiA9PiBAcmVzaXplVHJlZVZpZXcoKVxuICAgICAgJ3RyZWUtdmlldzpyZWN1cnNpdmUtY29sbGFwc2UtZGlyZWN0b3J5JzogPT4gQHJlc2l6ZVRyZWVWaWV3KClcbiAgICAgICd0cmVlLXZpZXc6bW92ZSc6ID0+IEByZXNpemVUcmVlVmlldygpXG4gICAgICAndHJlZS12aWV3OmN1dCc6ID0+IEByZXNpemVUcmVlVmlldygpXG4gICAgICAndHJlZS12aWV3OnBhc3RlJzogPT4gQHJlc2l6ZVRyZWVWaWV3KClcbiAgICAgICd0cmVlLXZpZXc6dG9nZ2xlLXZjcy1pZ25vcmVkLWZpbGVzJzogPT4gQHJlc2l6ZVRyZWVWaWV3KClcbiAgICAgICd0cmVlLXZpZXc6dG9nZ2xlLWlnbm9yZWQtbmFtZXMnOiA9PiBAcmVzaXplVHJlZVZpZXcoKVxuICAgICAgJ3RyZWUtdmlldzpyZW1vdmUtcHJvamVjdC1mb2xkZXInOiA9PiBAcmVzaXplVHJlZVZpZXcoKVxuIl19
