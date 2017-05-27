(function() {
  var $, CompositeDisposable, TreeViewAutoresize, requirePackages, scrollbarWidth;

  requirePackages = require('atom-utils').requirePackages;

  CompositeDisposable = require('atom').CompositeDisposable;

  $ = require('jquery');

  scrollbarWidth = require('scrollbar-width')();

  module.exports = TreeViewAutoresize = {
    config: {
      minimumWidth: {
        type: 'integer',
        "default": 0,
        description: 'Minimum tree-view width. Put 0 if you don\'t want a min limit.'
      },
      maximumWidth: {
        type: 'integer',
        "default": 0,
        description: 'Maximum tree-view width. Put 0 if you don\'t want a max limit.'
      },
      padding: {
        type: 'integer',
        "default": 0,
        description: 'Add padding to the right side of the tree-view.'
      },
      animationMilliseconds: {
        type: 'integer',
        "default": 200,
        description: 'Number of milliseconds to elapse during animations. Smaller means faster.'
      },
      delayMilliseconds: {
        type: 'integer',
        "default": 200,
        description: 'Number of milliseconds to wait before animations. Smaller means faster.'
      }
    },
    subscriptions: null,
    max: 0,
    min: 0,
    pad: 0,
    animationMs: 200,
    delayMs: 200,
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.config.observe('tree-view-autoresize.maximumWidth', (function(_this) {
        return function(max) {
          return _this.max = max;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tree-view-autoresize.minimumWidth', (function(_this) {
        return function(min) {
          return _this.min = min;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tree-view-autoresize.padding', (function(_this) {
        return function(pad) {
          return _this.pad = pad;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tree-view-autoresize.animationMilliseconds', (function(_this) {
        return function(animationMs) {
          return _this.animationMs = animationMs;
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('tree-view-autoresize.delayMilliseconds', (function(_this) {
        return function(delayMs) {
          return _this.delayMs = delayMs;
        };
      })(this)));
      if (atom.packages.isPackageLoaded('nuclide-file-tree')) {
        $('body').on('click.autoresize', '.nuclide-file-tree .directory', (function(_this) {
          return function(e) {
            return _this.resizeNuclideFileTree();
          };
        })(this));
        this.subscriptions.add(atom.project.onDidChangePaths(((function(_this) {
          return function() {
            return _this.resizeNuclideFileTree();
          };
        })(this))));
        return this.resizeNuclideFileTree();
      } else {
        return requirePackages('tree-view').then((function(_this) {
          return function(arg) {
            var treeView;
            treeView = arg[0];
            if (treeView.treeView == null) {
              treeView.createView();
            }
            _this.treePanel = $(treeView.treeView.element);
            _this.treeList = $(treeView.treeView.list);
            _this.treePanel.on('click.autoresize', '.directory', (function() {
              return _this.resizeTreeView();
            }));
            _this.subscriptions.add(atom.project.onDidChangePaths((function() {
              return _this.resizeTreeView();
            })));
            _this.subscriptions.add(atom.commands.add('atom-workspace', {
              'tree-view:reveal-active-file': function() {
                return _this.resizeTreeView();
              },
              'tree-view:toggle': function() {
                return _this.resizeTreeView();
              },
              'tree-view:show': function() {
                return _this.resizeTreeView();
              }
            }));
            _this.subscriptions.add(atom.commands.add('.tree-view', {
              'tree-view:open-selected-entry': function() {
                return _this.resizeTreeView();
              },
              'tree-view:expand-item': function() {
                return _this.resizeTreeView();
              },
              'tree-view:recursive-expand-directory': function() {
                return _this.resizeTreeView();
              },
              'tree-view:collapse-directory': function() {
                return _this.resizeTreeView();
              },
              'tree-view:recursive-collapse-directory': function() {
                return _this.resizeTreeView();
              },
              'tree-view:move': function() {
                return _this.resizeTreeView();
              },
              'tree-view:cut': function() {
                return _this.resizeTreeView();
              },
              'tree-view:paste': function() {
                return _this.resizeTreeView();
              },
              'tree-view:toggle-vcs-ignored-files': function() {
                return _this.resizeTreeView();
              },
              'tree-view:toggle-ignored-names': function() {
                return _this.resizeTreeView();
              },
              'tree-view:remove-project-folder': function() {
                return _this.resizeTreeView();
              }
            }));
            return _this.resizeTreeView();
          };
        })(this));
      }
    },
    deactivate: function() {
      var ref;
      this.subscriptions.dispose();
      if ((ref = this.treePanel) != null) {
        ref.unbind('click.autoresize');
      }
      return $('body').unbind('click.autoresize');
    },
    resizeTreeView: function() {
      return setTimeout((function(_this) {
        return function() {
          var newTreeWidth, origListWidth, origTreeWidth;
          origListWidth = _this.treeList.outerWidth();
          origTreeWidth = _this.treePanel.width();
          if (origListWidth > origTreeWidth) {
            return _this.treePanel.animate({
              width: _this.getWidth(origListWidth + scrollbarWidth + _this.pad)
            }, _this.animationMs);
          } else {
            _this.treePanel.width(1);
            _this.treePanel.width(_this.treeList.outerWidth());
            newTreeWidth = _this.getWidth(_this.treeList.outerWidth() + scrollbarWidth + _this.pad);
            _this.treePanel.width(origTreeWidth);
            if (origTreeWidth !== newTreeWidth) {
              return _this.treePanel.animate({
                width: newTreeWidth
              }, _this.animationMs);
            }
          }
        };
      })(this), this.delayMs);
    },
    resizeNuclideFileTree: function() {
      return setTimeout((function(_this) {
        return function() {
          var currWidth, fileTree, newWidth;
          fileTree = $('.tree-view-resizer');
          currWidth = fileTree.find('.nuclide-file-tree').outerWidth();
          if (currWidth > fileTree.width()) {
            return fileTree.animate({
              width: _this.getWidth(currWidth + 10)
            }, _this.animationMs);
          } else {
            fileTree.width(1);
            fileTree.width(fileTree.find('.nuclide-file-tree').outerWidth());
            newWidth = fileTree.find('.nuclide-file-tree').outerWidth();
            fileTree.width(currWidth);
            return fileTree.animate({
              width: _this.getWidth(newWidth + 10)
            }, _this.animationMs);
          }
        };
      })(this), this.delayMs);
    },
    getWidth: function(w) {
      if (this.max === 0 || w < this.max) {
        if (this.min === 0 || w > this.min) {
          return w;
        } else {
          return this.min;
        }
      } else {
        return this.max;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL3RyZWUtdmlldy1hdXRvcmVzaXplL2xpYi90cmVlLXZpZXctYXV0b3Jlc2l6ZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLGtCQUFtQixPQUFBLENBQVEsWUFBUjs7RUFDbkIsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBQ0osY0FBQSxHQUFpQixPQUFBLENBQVEsaUJBQVIsQ0FBQSxDQUFBOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUFpQixrQkFBQSxHQUNmO0lBQUEsTUFBQSxFQUNFO01BQUEsWUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBRFQ7UUFFQSxXQUFBLEVBQ0UsZ0VBSEY7T0FERjtNQUtBLFlBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQURUO1FBRUEsV0FBQSxFQUNFLGdFQUhGO09BTkY7TUFVQSxPQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FEVDtRQUVBLFdBQUEsRUFBYSxpREFGYjtPQVhGO01BY0EscUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxHQURUO1FBRUEsV0FBQSxFQUFhLDJFQUZiO09BZkY7TUFrQkEsaUJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxHQURUO1FBRUEsV0FBQSxFQUFhLHlFQUZiO09BbkJGO0tBREY7SUF3QkEsYUFBQSxFQUFlLElBeEJmO0lBeUJBLEdBQUEsRUFBSyxDQXpCTDtJQTBCQSxHQUFBLEVBQUssQ0ExQkw7SUEyQkEsR0FB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WUFDWCxRQUFRLENBQUMsS0FBVCxDQUFlLFNBQWY7bUJBQ0EsUUFBUSxDQUFDLE9BQVQsQ0FBaUI7Y0FBQyxLQUFBLEVBQU8sS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFBLEdBQVcsRUFBckIsQ0FBUjthQUFqQixFQUFvRCxLQUFDLENBQUEsV0FBckQsRUFQRjs7UUFIUztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQVdFLElBQUMsQ0FBQSxPQVhIO0lBRHFCLENBekd2QjtJQXVIQSxRQUFBLEVBQVUsU0FBQyxDQUFEO01BQ1IsSUFBRyxJQUFDLENBQUEsR0FBRCxLQUFRLENBQVIsSUFBYSxDQUFBLEdBQUksSUFBQyxDQUFBLEdBQXJCO1FBQ0UsSUFBRyxJQUFDLENBQUEsR0FBRCxLQUFRLENBQVIsSUFBYSxDQUFBLEdBQUksSUFBQyxDQUFBLEdBQXJCO2lCQUNFLEVBREY7U0FBQSxNQUFBO2lCQUdFLElBQUMsQ0FBQSxJQUhIO1NBREY7T0FBQSxNQUFBO2VBTUUsSUFBQyxDQUFBLElBTkg7O0lBRFEsQ0F2SFY7O0FBTkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7cmVxdWlyZVBhY2thZ2VzfSA9IHJlcXVpcmUgJ2F0b20tdXRpbHMnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbnNjcm9sbGJhcldpZHRoID0gcmVxdWlyZSgnc2Nyb2xsYmFyLXdpZHRoJykoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVWaWV3QXV0b3Jlc2l6ZSA9XG4gIGNvbmZpZzpcbiAgICBtaW5pbXVtV2lkdGg6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAnTWluaW11bSB0cmVlLXZpZXcgd2lkdGguIFB1dCAwIGlmIHlvdSBkb25cXCd0IHdhbnQgYSBtaW4gbGltaXQuJ1xuICAgIG1heGltdW1XaWR0aDpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMFxuICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICdNYXhpbXVtIHRyZWUtdmlldyB3aWR0aC4gUHV0IDAgaWYgeW91IGRvblxcJ3Qgd2FudCBhIG1heCBsaW1pdC4nXG4gICAgcGFkZGluZzpcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMFxuICAgICAgZGVzY3JpcHRpb246ICdBZGQgcGFkZGluZyB0byB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgdHJlZS12aWV3LidcbiAgICBhbmltYXRpb25NaWxsaXNlY29uZHM6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IDIwMFxuICAgICAgZGVzY3JpcHRpb246ICdOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGVsYXBzZSBkdXJpbmcgYW5pbWF0aW9ucy4gU21hbGxlciBtZWFucyBmYXN0ZXIuJ1xuICAgIGRlbGF5TWlsbGlzZWNvbmRzOlxuICAgICAgdHlwZTogJ2ludGVnZXInXG4gICAgICBkZWZhdWx0OiAyMDBcbiAgICAgIGRlc2NyaXB0aW9uOiAnTnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB3YWl0IGJlZm9yZSBhbmltYXRpb25zLiBTbWFsbGVyIG1lYW5zIGZhc3Rlci4nXG5cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuICBtYXg6IDBcbiAgbWluOiAwXG4gIHBhZDogMFxuICBhbmltYXRpb25NczogMjAwXG4gIGRlbGF5TXM6IDIwMFxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1hdXRvcmVzaXplLm1heGltdW1XaWR0aCcsXG4gICAgICAobWF4KSA9PlxuICAgICAgICBAbWF4ID0gbWF4XG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJlZS12aWV3LWF1dG9yZXNpemUubWluaW11bVdpZHRoJyxcbiAgICAgIChtaW4pID0+XG4gICAgICAgIEBtaW4gPSBtaW5cblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBhdG9tLmNvbmZpZy5vYnNlcnZlICd0cmVlLXZpZXctYXV0b3Jlc2l6ZS5wYWRkaW5nJywgKHBhZCkgPT5cbiAgICAgICAgQHBhZCA9IHBhZFxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29uZmlnLm9ic2VydmUgJ3RyZWUtdmlldy1hdXRvcmVzaXplLmFuaW1hdGlvbk1pbGxpc2Vjb25kcycsXG4gICAgICAoYW5pbWF0aW9uTXMpID0+XG4gICAgICAgIEBhbmltYXRpb25NcyA9IGFuaW1hdGlvbk1zXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb25maWcub2JzZXJ2ZSAndHJlZS12aWV3LWF1dG9yZXNpemUuZGVsYXlNaWxsaXNlY29uZHMnLFxuICAgICAgKGRlbGF5TXMpID0+XG4gICAgICAgIEBkZWxheU1zID0gZGVsYXlNc1xuXG4gICAgaWYgYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQgJ251Y2xpZGUtZmlsZS10cmVlJ1xuICAgICAgJCgnYm9keScpLm9uICdjbGljay5hdXRvcmVzaXplJywgJy5udWNsaWRlLWZpbGUtdHJlZSAuZGlyZWN0b3J5JywgKGUpID0+XG4gICAgICAgIEByZXNpemVOdWNsaWRlRmlsZVRyZWUoKVxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzICg9PiBAcmVzaXplTnVjbGlkZUZpbGVUcmVlKCkpXG4gICAgICBAcmVzaXplTnVjbGlkZUZpbGVUcmVlKClcblxuICAgIGVsc2VcbiAgICAgIHJlcXVpcmVQYWNrYWdlcygndHJlZS12aWV3JykudGhlbiAoW3RyZWVWaWV3XSkgPT5cbiAgICAgICAgdW5sZXNzIHRyZWVWaWV3LnRyZWVWaWV3P1xuICAgICAgICAgIHRyZWVWaWV3LmNyZWF0ZVZpZXcoKVxuICAgICAgICBAdHJlZVBhbmVsID0gJCh0cmVlVmlldy50cmVlVmlldy5lbGVtZW50KVxuICAgICAgICBAdHJlZUxpc3QgPSAkKHRyZWVWaWV3LnRyZWVWaWV3Lmxpc3QpXG4gICAgICAgIEB0cmVlUGFuZWwub24gJ2NsaWNrLmF1dG9yZXNpemUnLCAnLmRpcmVjdG9yeScsICg9PiBAcmVzaXplVHJlZVZpZXcoKSlcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzICg9PiBAcmVzaXplVHJlZVZpZXcoKSlcbiAgICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsXG4gICAgICAgICAgJ3RyZWUtdmlldzpyZXZlYWwtYWN0aXZlLWZpbGUnOiA9PiBAcmVzaXplVHJlZVZpZXcoKVxuICAgICAgICAgICd0cmVlLXZpZXc6dG9nZ2xlJzogPT4gQHJlc2l6ZVRyZWVWaWV3KClcbiAgICAgICAgICAndHJlZS12aWV3OnNob3cnOiA9PiBAcmVzaXplVHJlZVZpZXcoKVxuICAgICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJy50cmVlLXZpZXcnLFxuICAgICAgICAgICd0cmVlLXZpZXc6b3Blbi1zZWxlY3RlZC1lbnRyeSc6ID0+IEByZXNpemVUcmVlVmlldygpXG4gICAgICAgICAgJ3RyZWUtdmlldzpleHBhbmQtaXRlbSc6ID0+IEByZXNpemVUcmVlVmlldygpXG4gICAgICAgICAgJ3RyZWUtdmlldzpyZWN1cnNpdmUtZXhwYW5kLWRpcmVjdG9yeSc6ID0+IEByZXNpemVUcmVlVmlldygpXG4gICAgICAgICAgJ3RyZWUtdmlldzpjb2xsYXBzZS1kaXJlY3RvcnknOiA9PiBAcmVzaXplVHJlZVZpZXcoKVxuICAgICAgICAgICd0cmVlLXZpZXc6cmVjdXJzaXZlLWNvbGxhcHNlLWRpcmVjdG9yeSc6ID0+IEByZXNpemVUcmVlVmlldygpXG4gICAgICAgICAgJ3RyZWUtdmlldzptb3ZlJzogPT4gQHJlc2l6ZVRyZWVWaWV3KClcbiAgICAgICAgICAndHJlZS12aWV3OmN1dCc6ID0+IEByZXNpemVUcmVlVmlldygpXG4gICAgICAgICAgJ3RyZWUtdmlldzpwYXN0ZSc6ID0+IEByZXNpemVUcmVlVmlldygpXG4gICAgICAgICAgJ3RyZWUtdmlldzp0b2dnbGUtdmNzLWlnbm9yZWQtZmlsZXMnOiA9PiBAcmVzaXplVHJlZVZpZXcoKVxuICAgICAgICAgICd0cmVlLXZpZXc6dG9nZ2xlLWlnbm9yZWQtbmFtZXMnOiA9PiBAcmVzaXplVHJlZVZpZXcoKVxuICAgICAgICAgICd0cmVlLXZpZXc6cmVtb3ZlLXByb2plY3QtZm9sZGVyJzogPT4gQHJlc2l6ZVRyZWVWaWV3KClcbiAgICAgICAgQHJlc2l6ZVRyZWVWaWV3KClcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuICAgIEB0cmVlUGFuZWw/LnVuYmluZCAnY2xpY2suYXV0b3Jlc2l6ZSdcbiAgICAkKCdib2R5JykudW5iaW5kICdjbGljay5hdXRvcmVzaXplJ1xuXG4gIHJlc2l6ZVRyZWVWaWV3OiAtPlxuICAgIHNldFRpbWVvdXQgPT5cbiAgICAgIG9yaWdMaXN0V2lkdGggPSBAdHJlZUxpc3Qub3V0ZXJXaWR0aCgpXG4gICAgICBvcmlnVHJlZVdpZHRoID0gQHRyZWVQYW5lbC53aWR0aCgpXG4gICAgICBpZiBvcmlnTGlzdFdpZHRoID4gb3JpZ1RyZWVXaWR0aFxuICAgICAgICBAdHJlZVBhbmVsLmFuaW1hdGUge3dpZHRoOiBAZ2V0V2lkdGgob3JpZ0xpc3RXaWR0aCArIHNjcm9sbGJhcldpZHRoICsgQHBhZCl9LCBAYW5pbWF0aW9uTXNcbiAgICAgIGVsc2VcbiAgICAgICAgQHRyZWVQYW5lbC53aWR0aCAxXG4gICAgICAgIEB0cmVlUGFuZWwud2lkdGggQHRyZWVMaXN0Lm91dGVyV2lkdGgoKVxuICAgICAgICBuZXdUcmVlV2lkdGggPSBAZ2V0V2lkdGgoQHRyZWVMaXN0Lm91dGVyV2lkdGgoKSArIHNjcm9sbGJhcldpZHRoICsgQHBhZClcbiAgICAgICAgQHRyZWVQYW5lbC53aWR0aCBvcmlnVHJlZVdpZHRoXG4gICAgICAgIGlmIG9yaWdUcmVlV2lkdGggaXNudCBuZXdUcmVlV2lkdGhcbiAgICAgICAgICBAdHJlZVBhbmVsLmFuaW1hdGUge3dpZHRoOiBuZXdUcmVlV2lkdGh9LCBAYW5pbWF0aW9uTXNcbiAgICAsIEBkZWxheU1zXG5cbiAgcmVzaXplTnVjbGlkZUZpbGVUcmVlOiAtPlxuICAgIHNldFRpbWVvdXQgPT5cbiAgICAgIGZpbGVUcmVlID0gJCgnLnRyZWUtdmlldy1yZXNpemVyJylcbiAgICAgIGN1cnJXaWR0aCA9IGZpbGVUcmVlLmZpbmQoJy5udWNsaWRlLWZpbGUtdHJlZScpLm91dGVyV2lkdGgoKVxuICAgICAgaWYgY3VycldpZHRoID4gZmlsZVRyZWUud2lkdGgoKVxuICAgICAgICBmaWxlVHJlZS5hbmltYXRlIHt3aWR0aDogQGdldFdpZHRoKGN1cnJXaWR0aCArIDEwKX0sIEBhbmltYXRpb25Nc1xuICAgICAgZWxzZVxuICAgICAgICBmaWxlVHJlZS53aWR0aCAxXG4gICAgICAgIGZpbGVUcmVlLndpZHRoIGZpbGVUcmVlLmZpbmQoJy5udWNsaWRlLWZpbGUtdHJlZScpLm91dGVyV2lkdGgoKVxuICAgICAgICBuZXdXaWR0aCA9IGZpbGVUcmVlLmZpbmQoJy5udWNsaWRlLWZpbGUtdHJlZScpLm91dGVyV2lkdGgoKVxuICAgICAgICBmaWxlVHJlZS53aWR0aCBjdXJyV2lkdGhcbiAgICAgICAgZmlsZVRyZWUuYW5pbWF0ZSB7d2lkdGg6IEBnZXRXaWR0aChuZXdXaWR0aCArIDEwKX0sIEBhbmltYXRpb25Nc1xuICAgICwgQGRlbGF5TXNcblxuICBnZXRXaWR0aDogKHcpIC0+XG4gICAgaWYgQG1heCBpcyAwIG9yIHcgPCBAbWF4XG4gICAgICBpZiBAbWluIGlzIDAgb3IgdyA+IEBtaW5cbiAgICAgICAgd1xuICAgICAgZWxzZVxuICAgICAgICBAbWluXG4gICAgZWxzZVxuICAgICAgQG1heFxuIl19
