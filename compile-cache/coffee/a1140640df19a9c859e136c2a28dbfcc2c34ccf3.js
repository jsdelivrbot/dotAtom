(function() {
  var $;

  $ = require('jquery');

  module.exports = {
    config: {
      fullscreen: {
        type: 'boolean',
        "default": true,
        order: 1
      },
      softWrap: {
        description: 'Enables / Disables soft wrapping when Zen is active.',
        type: 'boolean',
        "default": atom.config.get('editor.softWrap'),
        order: 2
      },
      gutter: {
        description: 'Shows / Hides the gutter when Zen is active.',
        type: 'boolean',
        "default": false,
        order: 3
      },
      typewriter: {
        description: 'Keeps the cursor vertically centered where possible.',
        type: 'boolean',
        "default": false,
        order: 4
      },
      minimap: {
        description: 'Enables / Disables the minimap plugin when Zen is active.',
        type: 'boolean',
        "default": false,
        order: 5
      },
      width: {
        type: 'integer',
        "default": atom.config.get('editor.preferredLineLength'),
        order: 6
      },
      tabs: {
        description: 'Determines the tab style used while Zen is active.',
        type: 'string',
        "default": 'hidden',
        "enum": ['hidden', 'single', 'multiple'],
        order: 7
      },
      showWordCount: {
        description: 'Show the word-count if you have the package installed.',
        type: 'string',
        "default": 'Hidden',
        "enum": ['Hidden', 'Left', 'Right'],
        order: 8
      }
    },
    activate: function(state) {
      return atom.commands.add('atom-workspace', 'zen:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    },
    toggle: function() {
      var body, editor, fullscreen, minimap, panel, panels, ref, ref1, ref2, ref3, softWrap, width;
      body = document.querySelector('body');
      editor = atom.workspace.getActiveTextEditor();
      fullscreen = atom.config.get('Zen.fullscreen');
      width = atom.config.get('Zen.width');
      softWrap = atom.config.get('Zen.softWrap');
      minimap = atom.config.get('Zen.minimap');
      panels = atom.workspace.getLeftPanels();
      panel = panels[0];
      if (body.getAttribute('data-zen') !== 'true') {
        if (editor === void 0) {
          atom.notifications.addInfo('Zen cannot be achieved in this view.');
          return;
        }
        if (atom.config.get('Zen.tabs')) {
          body.setAttribute('data-zen-tabs', atom.config.get('Zen.tabs'));
        }
        switch (atom.config.get('Zen.showWordCount')) {
          case 'Left':
            body.setAttribute('data-zen-word-count', 'visible');
            body.setAttribute('data-zen-word-count-position', 'left');
            break;
          case 'Right':
            body.setAttribute('data-zen-word-count', 'visible');
            body.setAttribute('data-zen-word-count-position', 'right');
            break;
          case 'Hidden':
            body.setAttribute('data-zen-word-count', 'hidden');
        }
        body.setAttribute('data-zen-gutter', atom.config.get('Zen.gutter'));
        body.setAttribute('data-zen', 'true');
        if (editor.isSoftWrapped() !== softWrap) {
          editor.setSoftWrapped(softWrap);
          this.unSoftWrap = true;
        }
        requestAnimationFrame(function() {
          return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
        });
        this.fontChanged = atom.config.onDidChange('editor.fontSize', function() {
          return requestAnimationFrame(function() {
            return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
          });
        });
        this.paneChanged = atom.workspace.onDidChangeActivePaneItem(function() {
          return requestAnimationFrame(function() {
            return $('atom-text-editor:not(.mini)').css('width', editor.getDefaultCharWidth() * width);
          });
        });
        if (atom.config.get('Zen.typewriter')) {
          if (!atom.config.get('editor.scrollPastEnd')) {
            atom.config.set('editor.scrollPastEnd', true);
            this.scrollPastEndReset = true;
          } else {
            this.scrollPastEndReset = false;
          }
          this.lineChanged = editor.onDidChangeCursorPosition(function() {
            var cursor, halfScreen;
            halfScreen = Math.floor(editor.getRowsPerPage() / 2);
            cursor = editor.getCursorScreenPosition();
            return editor.setScrollTop(editor.getLineHeightInPixels() * (cursor.row - halfScreen));
          });
        }
        this.typewriterConfig = atom.config.observe('Zen.typewriter', (function(_this) {
          return function() {
            var ref, ref1;
            if (!atom.config.get('Zen.typewriter')) {
              if (_this.scrollPastEndReset) {
                _this.scrollPastEndReset = false;
                atom.config.set('editor.scrollPastEnd', false);
              }
              return (ref = _this.lineChanged) != null ? ref.dispose() : void 0;
            } else {
              if (!atom.config.get('editor.scrollPastEnd')) {
                if (!_this.scrollPastEndReset) {
                  atom.config.set('editor.scrollPastEnd', true);
                }
                _this.scrollPastEndReset = true;
              } else {
                _this.scrollPastEndReset = false;
              }
              if ((ref1 = _this.lineChanged) != null) {
                ref1.dispose();
              }
              return _this.lineChanged = editor.onDidChangeCursorPosition(function() {
                var cursor, halfScreen;
                halfScreen = Math.floor(editor.getRowsPerPage() / 2);
                cursor = editor.getCursorScreenPosition();
                return editor.setScrollTop(editor.getLineHeightInPixels() * (cursor.row - halfScreen));
              });
            }
          };
        })(this));
        if ($('.nuclide-file-tree').length) {
          if (panel.isVisible()) {
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'nuclide-file-tree:toggle');
            this.restoreTree = true;
          }
        } else if ($('.tree-view').length) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:toggle');
          this.restoreTree = true;
        }
        if ($('atom-text-editor /deep/ atom-text-editor-minimap').length && !minimap) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'minimap:toggle');
          this.restoreMinimap = true;
        }
        if (fullscreen) {
          return atom.setFullScreen(true);
        }
      } else {
        body.setAttribute('data-zen', 'false');
        if (fullscreen) {
          atom.setFullScreen(false);
        }
        if (this.unSoftWrap && editor !== void 0) {
          editor.setSoftWrapped(atom.config.get('editor.softWrap'));
          this.unSoftWrap = null;
        }
        $('atom-text-editor:not(.mini)').css('width', '');
        $('.status-bar-right').css('overflow', 'hidden');
        requestAnimationFrame(function() {
          return $('.status-bar-right').css('overflow', '');
        });
        if (this.restoreTree) {
          if ($('.nuclide-file-tree').length) {
            if (!panel.isVisible()) {
              atom.commands.dispatch(atom.views.getView(atom.workspace), 'nuclide-file-tree:toggle');
            }
          } else {
            atom.commands.dispatch(atom.views.getView(atom.workspace), 'tree-view:show');
          }
          this.restoreTree = false;
        }
        if (this.restoreMinimap && $('atom-text-editor /deep/ atom-text-editor-minimap').length !== 1) {
          atom.commands.dispatch(atom.views.getView(atom.workspace), 'minimap:toggle');
          this.restoreMinimap = false;
        }
        if ((ref = this.fontChanged) != null) {
          ref.dispose();
        }
        if ((ref1 = this.paneChanged) != null) {
          ref1.dispose();
        }
        if ((ref2 = this.lineChanged) != null) {
          ref2.dispose();
        }
        if (this.scrollPastEndReset) {
          atom.config.set('editor.scrollPastEnd', false);
          this.scrollPastEndReset = false;
        }
        return (ref3 = this.typewriterConfig) != null ? ref3.dispose() : void 0;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL1plbi9saWIvemVuLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUlKLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxVQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLEtBQUEsRUFBTyxDQUZQO09BREY7TUFJQSxRQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsc0RBQWI7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixDQUZUO1FBR0EsS0FBQSxFQUFPLENBSFA7T0FMRjtNQVNBLE1BQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSw4Q0FBYjtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO1FBR0EsS0FBQSxFQUFPLENBSFA7T0FWRjtNQWNBLFVBQUEsRUFDRTtRQUFBLFdBQUEsRUFBYSxzREFBYjtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO1FBR0EsS0FBQSxFQUFPLENBSFA7T0FmRjtNQW1CQSxPQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsMkRBQWI7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtRQUdBLEtBQUEsRUFBTyxDQUhQO09BcEJGO01Bd0JBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBRFQ7UUFFQSxLQUFB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LENBQUMsT0FBWCxDQUFtQixJQUFJLENBQUMsU0FBeEIsQ0FERixFQUVFLGdCQUZGO1VBSUEsSUFBQyxDQUFBLGNBQUQsR0FBa0IsTUFMcEI7OzthQVNZLENBQUUsT0FBZCxDQUFBOzs7Y0FDWSxDQUFFLE9BQWQsQ0FBQTs7O2NBQ1ksQ0FBRSxPQUFkLENBQUE7O1FBQ0EsSUFBRyxJQUFDLENBQUEsa0JBQUo7VUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBQXdDLEtBQXhDO1VBQ0EsSUFBQyxDQUFBLGtCQUFELEdBQXNCLE1BRnhCOzs0REFHaUIsQ0FBRSxPQUFuQixDQUFBLFdBekpGOztJQWZNLENBakRSOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsiJCA9IHJlcXVpcmUgJ2pxdWVyeSdcbiMganF1ZXJ5IHVzZWQgb25seSB0byBtYW5pcHVsYXRlIGVkaXRvciB3aWR0aFxuIyB3ZSdkIHJhdGhlciBtb3ZlIGF3YXkgZnJvbSB0aGlzIGRlcGVuZGVuY3kgdGhhbiBleHBhbmQgb24gaXRcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgZnVsbHNjcmVlbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDFcbiAgICBzb2Z0V3JhcDpcbiAgICAgIGRlc2NyaXB0aW9uOiAnRW5hYmxlcyAvIERpc2FibGVzIHNvZnQgd3JhcHBpbmcgd2hlbiBaZW4gaXMgYWN0aXZlLidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogYXRvbS5jb25maWcuZ2V0ICdlZGl0b3Iuc29mdFdyYXAnXG4gICAgICBvcmRlcjogMlxuICAgIGd1dHRlcjpcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvd3MgLyBIaWRlcyB0aGUgZ3V0dGVyIHdoZW4gWmVuIGlzIGFjdGl2ZS4nXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBvcmRlcjogM1xuICAgIHR5cGV3cml0ZXI6XG4gICAgICBkZXNjcmlwdGlvbjogJ0tlZXBzIHRoZSBjdXJzb3IgdmVydGljYWxseSBjZW50ZXJlZCB3aGVyZSBwb3NzaWJsZS4nXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBvcmRlcjogNFxuICAgIG1pbmltYXA6XG4gICAgICBkZXNjcmlwdGlvbjogJ0VuYWJsZXMgLyBEaXNhYmxlcyB0aGUgbWluaW1hcCBwbHVnaW4gd2hlbiBaZW4gaXMgYWN0aXZlLidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIG9yZGVyOiA1XG4gICAgd2lkdGg6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IGF0b20uY29uZmlnLmdldCAnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnXG4gICAgICBvcmRlcjogNlxuICAgIHRhYnM6XG4gICAgICBkZXNjcmlwdGlvbjogJ0RldGVybWluZXMgdGhlIHRhYiBzdHlsZSB1c2VkIHdoaWxlIFplbiBpcyBhY3RpdmUuJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdoaWRkZW4nXG4gICAgICBlbnVtOiBbJ2hpZGRlbicsICdzaW5nbGUnLCAnbXVsdGlwbGUnXVxuICAgICAgb3JkZXI6IDdcbiAgICBzaG93V29yZENvdW50OlxuICAgICAgZGVzY3JpcHRpb246ICdTaG93IHRoZSB3b3JkLWNvdW50IGlmIHlvdSBoYXZlIHRoZSBwYWNrYWdlIGluc3RhbGxlZC4nXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ0hpZGRlbidcbiAgICAgIGVudW06IFtcbiAgICAgICAgJ0hpZGRlbicsXG4gICAgICAgICdMZWZ0JyxcbiAgICAgICAgJ1JpZ2h0J1xuICAgICAgXVxuICAgICAgb3JkZXI6IDhcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICd6ZW46dG9nZ2xlJywgPT4gQHRvZ2dsZSgpXG5cbiAgdG9nZ2xlOiAtPlxuXG4gICAgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKVxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgIyBzaG91bGQgcmVhbGx5IGNoZWNrIGN1cnJlbnQgZnVsbHNjZWVuIHN0YXRlXG4gICAgZnVsbHNjcmVlbiA9IGF0b20uY29uZmlnLmdldCAnWmVuLmZ1bGxzY3JlZW4nXG4gICAgd2lkdGggPSBhdG9tLmNvbmZpZy5nZXQgJ1plbi53aWR0aCdcbiAgICBzb2Z0V3JhcCA9IGF0b20uY29uZmlnLmdldCAnWmVuLnNvZnRXcmFwJ1xuICAgIG1pbmltYXAgPSBhdG9tLmNvbmZpZy5nZXQgJ1plbi5taW5pbWFwJ1xuXG4gICAgIyBMZWZ0IHBhbmVsIG5lZWRlZCBmb3IgaGlkZS9yZXN0b3JlXG4gICAgcGFuZWxzID0gYXRvbS53b3Jrc3BhY2UuZ2V0TGVmdFBhbmVscygpXG4gICAgcGFuZWwgPSBwYW5lbHNbMF1cblxuICAgIGlmIGJvZHkuZ2V0QXR0cmlidXRlKCdkYXRhLXplbicpIGlzbnQgJ3RydWUnXG5cbiAgICAgICMgUHJldmVudCB6ZW4gbW9kZSBmb3IgdW5kZWZpbmVkIGVkaXRvcnNcbiAgICAgIGlmIGVkaXRvciBpcyB1bmRlZmluZWQgIyBlLmcuIHNldHRpbmdzLXZpZXdcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8gJ1plbiBjYW5ub3QgYmUgYWNoaWV2ZWQgaW4gdGhpcyB2aWV3LidcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCAnWmVuLnRhYnMnXG4gICAgICAgIGJvZHkuc2V0QXR0cmlidXRlICdkYXRhLXplbi10YWJzJywgYXRvbS5jb25maWcuZ2V0ICdaZW4udGFicydcblxuICAgICAgc3dpdGNoIGF0b20uY29uZmlnLmdldCAnWmVuLnNob3dXb3JkQ291bnQnXG4gICAgICAgIHdoZW4gJ0xlZnQnXG4gICAgICAgICAgYm9keS5zZXRBdHRyaWJ1dGUgJ2RhdGEtemVuLXdvcmQtY291bnQnLCAndmlzaWJsZSdcbiAgICAgICAgICBib2R5LnNldEF0dHJpYnV0ZSAnZGF0YS16ZW4td29yZC1jb3VudC1wb3NpdGlvbicsICdsZWZ0J1xuICAgICAgICB3aGVuICdSaWdodCdcbiAgICAgICAgICBib2R5LnNldEF0dHJpYnV0ZSAnZGF0YS16ZW4td29yZC1jb3VudCcsICd2aXNpYmxlJ1xuICAgICAgICAgIGJvZHkuc2V0QXR0cmlidXRlICdkYXRhLXplbi13b3JkLWNvdW50LXBvc2l0aW9uJywgJ3JpZ2h0J1xuICAgICAgICB3aGVuICdIaWRkZW4nXG4gICAgICAgICAgYm9keS5zZXRBdHRyaWJ1dGUgJ2RhdGEtemVuLXdvcmQtY291bnQnLCAnaGlkZGVuJ1xuXG4gICAgICBib2R5LnNldEF0dHJpYnV0ZSAnZGF0YS16ZW4tZ3V0dGVyJywgYXRvbS5jb25maWcuZ2V0ICdaZW4uZ3V0dGVyJ1xuXG4gICAgICAjIEVudGVyIE1vZGVcbiAgICAgIGJvZHkuc2V0QXR0cmlidXRlICdkYXRhLXplbicsICd0cnVlJ1xuXG4gICAgICAjIFNvZnQgV3JhcFxuICAgICAgIyBVc2UgemVuIHNvZnQgd3JhcHBpbmcgc2V0dGluZydzIHRvIG92ZXJyaWRlIHRoZSBkZWZhdWx0IHNldHRpbmdzXG4gICAgICBpZiBlZGl0b3IuaXNTb2Z0V3JhcHBlZCgpIGlzbnQgc29mdFdyYXBcbiAgICAgICAgZWRpdG9yLnNldFNvZnRXcmFwcGVkIHNvZnRXcmFwXG4gICAgICAgICMgcmVzdG9yZSBkZWZhdWx0IHdoZW4gbGVhdmluZyB6ZW4gbW9kZVxuICAgICAgICBAdW5Tb2Z0V3JhcCA9IHRydWVcblxuICAgICAgIyBTZXQgd2lkdGhcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSAtPlxuICAgICAgICAkKCdhdG9tLXRleHQtZWRpdG9yOm5vdCgubWluaSknKS5jc3MgJ3dpZHRoJywgZWRpdG9yLmdldERlZmF1bHRDaGFyV2lkdGgoKSAqIHdpZHRoXG5cbiAgICAgICMgTGlzdGVuIHRvIGZvbnQtc2l6ZSBjaGFuZ2VzIGFuZCB1cGRhdGUgdGhlIHZpZXcgd2lkdGhcbiAgICAgIEBmb250Q2hhbmdlZCA9IGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdlZGl0b3IuZm9udFNpemUnLCAtPlxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgLT5cbiAgICAgICAgICAkKCdhdG9tLXRleHQtZWRpdG9yOm5vdCgubWluaSknKS5jc3MgJ3dpZHRoJywgZWRpdG9yLmdldERlZmF1bHRDaGFyV2lkdGgoKSAqIHdpZHRoXG5cbiAgICAgICMgTGlzdGVuIGZvciBhIHBhbmUgY2hhbmdlIHRvIHVwZGF0ZSB0aGUgdmlldyB3aWR0aFxuICAgICAgQHBhbmVDaGFuZ2VkID0gYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAtPlxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgLT5cbiAgICAgICAgICAkKCdhdG9tLXRleHQtZWRpdG9yOm5vdCgubWluaSknKS5jc3MgJ3dpZHRoJywgZWRpdG9yLmdldERlZmF1bHRDaGFyV2lkdGgoKSAqIHdpZHRoXG5cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCAnWmVuLnR5cGV3cml0ZXInXG4gICAgICAgIGlmIG5vdCBhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5zY3JvbGxQYXN0RW5kJylcbiAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQoJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgdHJ1ZSlcbiAgICAgICAgICBAc2Nyb2xsUGFzdEVuZFJlc2V0ID0gdHJ1ZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHNjcm9sbFBhc3RFbmRSZXNldCA9IGZhbHNlXG4gICAgICAgIEBsaW5lQ2hhbmdlZCA9IGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uIC0+XG4gICAgICAgICAgaGFsZlNjcmVlbiA9IE1hdGguZmxvb3IoZWRpdG9yLmdldFJvd3NQZXJQYWdlKCkgLyAyKVxuICAgICAgICAgIGN1cnNvciA9IGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpXG4gICAgICAgICAgZWRpdG9yLnNldFNjcm9sbFRvcChlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkgKiAoY3Vyc29yLnJvdyAtIGhhbGZTY3JlZW4pKVxuXG4gICAgICBAdHlwZXdyaXRlckNvbmZpZyA9IGF0b20uY29uZmlnLm9ic2VydmUgJ1plbi50eXBld3JpdGVyJywgPT5cbiAgICAgICAgaWYgbm90IGF0b20uY29uZmlnLmdldCAnWmVuLnR5cGV3cml0ZXInXG4gICAgICAgICAgaWYgQHNjcm9sbFBhc3RFbmRSZXNldFxuICAgICAgICAgICAgQHNjcm9sbFBhc3RFbmRSZXNldCA9IGZhbHNlXG4gICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgZmFsc2VcbiAgICAgICAgICBAbGluZUNoYW5nZWQ/LmRpc3Bvc2UoKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgbm90IGF0b20uY29uZmlnLmdldCAnZWRpdG9yLnNjcm9sbFBhc3RFbmQnXG4gICAgICAgICAgICBpZiBub3QgQHNjcm9sbFBhc3RFbmRSZXNldFxuICAgICAgICAgICAgICBhdG9tLmNvbmZpZy5zZXQgJ2VkaXRvci5zY3JvbGxQYXN0RW5kJywgdHJ1ZVxuICAgICAgICAgICAgQHNjcm9sbFBhc3RFbmRSZXNldCA9IHRydWVcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBAc2Nyb2xsUGFzdEVuZFJlc2V0ID0gZmFsc2VcbiAgICAgICAgICBAbGluZUNoYW5nZWQ/LmRpc3Bvc2UoKVxuICAgICAgICAgIEBsaW5lQ2hhbmdlZCA9IGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uIC0+XG4gICAgICAgICAgICBoYWxmU2NyZWVuID0gTWF0aC5mbG9vcihlZGl0b3IuZ2V0Um93c1BlclBhZ2UoKSAvIDIpXG4gICAgICAgICAgICBjdXJzb3IgPSBlZGl0b3IuZ2V0Q3Vyc29yU2NyZWVuUG9zaXRpb24oKVxuICAgICAgICAgICAgZWRpdG9yLnNldFNjcm9sbFRvcCBlZGl0b3IuZ2V0TGluZUhlaWdodEluUGl4ZWxzKCkgKiAoY3Vyc29yLnJvdyAtIGhhbGZTY3JlZW4pXG5cbiAgICAgICMgSGlkZSBUcmVlVmlld1xuICAgICAgaWYgJCgnLm51Y2xpZGUtZmlsZS10cmVlJykubGVuZ3RoXG4gICAgICAgIGlmIHBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChcbiAgICAgICAgICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksXG4gICAgICAgICAgICAnbnVjbGlkZS1maWxlLXRyZWU6dG9nZ2xlJ1xuICAgICAgICAgIClcbiAgICAgICAgICBAcmVzdG9yZVRyZWUgPSB0cnVlXG4gICAgICBlbHNlIGlmICQoJy50cmVlLXZpZXcnKS5sZW5ndGhcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChcbiAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLFxuICAgICAgICAgICd0cmVlLXZpZXc6dG9nZ2xlJ1xuICAgICAgICApXG4gICAgICAgIEByZXN0b3JlVHJlZSA9IHRydWVcblxuICAgICAgIyBIaWRlIE1pbmltYXBcbiAgICAgIGlmICQoJ2F0b20tdGV4dC1lZGl0b3IgL2RlZXAvIGF0b20tdGV4dC1lZGl0b3ItbWluaW1hcCcpLmxlbmd0aCBhbmQgbm90IG1pbmltYXBcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChcbiAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLFxuICAgICAgICAgICdtaW5pbWFwOnRvZ2dsZSdcbiAgICAgICAgKVxuICAgICAgICBAcmVzdG9yZU1pbmltYXAgPSB0cnVlXG5cbiAgICAgICMgRW50ZXIgZnVsbHNjcmVlblxuICAgICAgYXRvbS5zZXRGdWxsU2NyZWVuIHRydWUgaWYgZnVsbHNjcmVlblxuXG4gICAgZWxzZVxuICAgICAgIyBFeGl0IE1vZGVcbiAgICAgIGJvZHkuc2V0QXR0cmlidXRlICdkYXRhLXplbicsICdmYWxzZSdcblxuICAgICAgIyBMZWF2ZSBmdWxsc2NyZWVuXG4gICAgICBhdG9tLnNldEZ1bGxTY3JlZW4gZmFsc2UgaWYgZnVsbHNjcmVlblxuXG4gICAgICAjIFJlc3RvcmUgcHJldmlvdXMgc29mdCB3cmFwIHNldHRpbmcgd2hlbiBsZWF2aW5nIHplbiBtb2RlXG4gICAgICBpZiBAdW5Tb2Z0V3JhcCBhbmQgZWRpdG9yIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgIGVkaXRvci5zZXRTb2Z0V3JhcHBlZChhdG9tLmNvbmZpZy5nZXQoJ2VkaXRvci5zb2Z0V3JhcCcpKTtcbiAgICAgICAgQHVuU29mdFdyYXAgPSBudWxsXG5cbiAgICAgICMgVW5zZXQgdGhlIHdpZHRoXG4gICAgICAkKCdhdG9tLXRleHQtZWRpdG9yOm5vdCgubWluaSknKS5jc3MgJ3dpZHRoJywgJydcblxuICAgICAgIyBIYWNrIHRvIGZpeCAjNTUgLSBzY3JvbGxiYXJzIG9uIHN0YXR1c2JhciBhZnRlciBleGl0aW5nIFplblxuICAgICAgJCgnLnN0YXR1cy1iYXItcmlnaHQnKS5jc3MgJ292ZXJmbG93JywgJ2hpZGRlbidcbiAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSAtPlxuICAgICAgICAkKCcuc3RhdHVzLWJhci1yaWdodCcpLmNzcyAnb3ZlcmZsb3cnLCAnJ1xuXG4gICAgICAjIFJlc3RvcmUgVHJlZVZpZXdcbiAgICAgIGlmIEByZXN0b3JlVHJlZVxuICAgICAgICBpZiAkKCcubnVjbGlkZS1maWxlLXRyZWUnKS5sZW5ndGhcbiAgICAgICAgICB1bmxlc3MgcGFuZWwuaXNWaXNpYmxlKClcbiAgICAgICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goXG4gICAgICAgICAgICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksXG4gICAgICAgICAgICAgICdudWNsaWRlLWZpbGUtdHJlZTp0b2dnbGUnXG4gICAgICAgICAgICApXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKFxuICAgICAgICAgICAgYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSxcbiAgICAgICAgICAgICd0cmVlLXZpZXc6c2hvdydcbiAgICAgICAgICApXG4gICAgICAgIEByZXN0b3JlVHJlZSA9IGZhbHNlXG5cbiAgICAgICMgUmVzdG9yZSBNaW5pbWFwXG4gICAgICBpZiBAcmVzdG9yZU1pbmltYXAgYW5kICQoJ2F0b20tdGV4dC1lZGl0b3IgL2RlZXAvIGF0b20tdGV4dC1lZGl0b3ItbWluaW1hcCcpLmxlbmd0aCBpc250IDFcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaChcbiAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLFxuICAgICAgICAgICdtaW5pbWFwOnRvZ2dsZSdcbiAgICAgICAgKVxuICAgICAgICBAcmVzdG9yZU1pbmltYXAgPSBmYWxzZVxuXG5cbiAgICAgICMgU3RvcCBsaXN0ZW5pbmcgZm9yIHBhbmUgb3IgZm9udCBjaGFuZ2VcbiAgICAgIEBmb250Q2hhbmdlZD8uZGlzcG9zZSgpXG4gICAgICBAcGFuZUNoYW5nZWQ/LmRpc3Bvc2UoKVxuICAgICAgQGxpbmVDaGFuZ2VkPy5kaXNwb3NlKClcbiAgICAgIGlmIEBzY3JvbGxQYXN0RW5kUmVzZXRcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdlZGl0b3Iuc2Nyb2xsUGFzdEVuZCcsIGZhbHNlKVxuICAgICAgICBAc2Nyb2xsUGFzdEVuZFJlc2V0ID0gZmFsc2VcbiAgICAgIEB0eXBld3JpdGVyQ29uZmlnPy5kaXNwb3NlKClcbiJdfQ==
