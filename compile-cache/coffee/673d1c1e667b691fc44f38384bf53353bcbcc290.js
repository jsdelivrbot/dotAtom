(function() {
  var WordcountView, _, tile, view,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  WordcountView = require('./wordcount-view');

  _ = require('lodash');

  view = null;

  tile = null;

  module.exports = {
    config: {
      alwaysOn: {
        title: 'Always on',
        description: 'Show word count for all files, regardless of extension',
        type: 'boolean',
        "default": false,
        order: 1
      },
      extensions: {
        title: 'Autoactivated file extensions',
        description: 'List of file extenstions which should have the wordcount plugin enabled',
        type: 'array',
        "default": ['md', 'markdown', 'readme', 'txt', 'rst', 'adoc', 'log', 'msg'],
        items: {
          type: 'string'
        },
        order: 2
      },
      noextension: {
        title: 'Autoactivate for files without an extension',
        description: 'Wordcount plugin enabled for files without a file extension',
        type: 'boolean',
        "default": false,
        items: {
          type: 'boolean'
        },
        order: 3
      },
      goal: {
        title: 'Work toward a word goal',
        description: 'Shows a bar showing progress toward a word goal',
        type: 'number',
        "default": 0,
        order: 4
      },
      goalColor: {
        title: 'Color for word goal',
        description: 'Use a CSS color value, such as rgb(0, 85, 255) or green',
        type: 'string',
        "default": 'rgb(0, 85, 0)',
        order: 5
      },
      goalLineHeight: {
        title: 'Percentage height of word goal line',
        type: 'string',
        "default": '20%',
        order: 6
      },
      ignorecode: {
        title: 'Ignore Markdown code blocks',
        description: 'Do not count words inside of code blocks',
        type: 'boolean',
        "default": false,
        items: {
          type: 'boolean'
        },
        order: 7
      },
      hidechars: {
        title: 'Hide character count',
        description: 'Hides the character count from the view',
        type: 'boolean',
        "default": false,
        order: 8
      },
      showprice: {
        title: 'Do you get paid per word?',
        description: 'Shows the price for the text per word',
        type: 'boolean',
        "default": false,
        order: 9
      },
      wordprice: {
        title: 'How much do you get paid per word?',
        description: 'Allows you to find out how much do you get paid per word',
        type: 'string',
        "default": '0.15',
        order: 10
      },
      currencysymbol: {
        title: 'Set a different currency symbol',
        description: 'Allows you to change the currency you get paid with',
        type: 'string',
        "default": '$',
        order: 11
      }
    },
    activate: function(state) {
      var update_count, update_view_and_count;
      this.visible = false;
      view = new WordcountView();
      update_count = _.throttle((function(_this) {
        return function(editor) {
          return _this.visible && view.update_count(editor);
        };
      })(this), 300);
      atom.workspace.observeTextEditors(function(editor) {
        editor.onDidChange(function() {
          return update_count(editor);
        });
        return editor.onDidChangeSelectionRange(function() {
          return update_count(editor);
        });
      });
      update_view_and_count = (function(_this) {
        return function(item) {
          var editor;
          _this.show_or_hide_for_item(item);
          editor = atom.workspace.getActiveTextEditor();
          if (editor != null) {
            return update_count(editor);
          }
        };
      })(this);
      atom.workspace.onDidChangeActivePaneItem(update_view_and_count);
      update_view_and_count(atom.workspace.getActivePaneItem());
      return atom.config.observe('wordcount.goal', this.update_goal);
    },
    update_goal: function(item) {
      if (item === 0) {
        return view.element.style.background = 'transparent';
      }
    },
    show_or_hide_for_item: function(item) {
      var alwaysOn, buffer, current_file_extension, extensions, no_extension, noextension, not_text_editor, ref, ref1, ref2, untitled_tab;
      ref = atom.config.get('wordcount'), alwaysOn = ref.alwaysOn, extensions = ref.extensions, noextension = ref.noextension;
      extensions = (extensions || []).map(function(extension) {
        return extension.toLowerCase();
      });
      buffer = item != null ? item.buffer : void 0;
      not_text_editor = buffer == null;
      untitled_tab = (buffer != null ? buffer.file : void 0) === null;
      current_file_extension = buffer != null ? (ref1 = buffer.file) != null ? (ref2 = ref1.path.match(/\.(\w+)$/)) != null ? ref2[1].toLowerCase() : void 0 : void 0 : void 0;
      no_extension = noextension && ((current_file_extension == null) || untitled_tab);
      if (alwaysOn || no_extension || indexOf.call(extensions, current_file_extension) >= 0) {
        this.visible = true;
        if (!not_text_editor) {
          return view.element.style.display = "inline-block";
        }
      } else {
        this.visible = false;
        return view.element.style.display = "none";
      }
    },
    consumeStatusBar: function(statusBar) {
      return tile = statusBar.addRightTile({
        item: view.element,
        priority: 100
      });
    },
    deactivate: function() {
      if (tile != null) {
        tile.destroy();
      }
      return tile = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL3dvcmRjb3VudC9saWIvbWFpbi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDRCQUFBO0lBQUE7O0VBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsa0JBQVI7O0VBQ2hCLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFFSixJQUFBLEdBQU87O0VBQ1AsSUFBQSxHQUFPOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxNQUFBLEVBQ0U7TUFBQSxRQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sV0FBUDtRQUNBLFdBQUEsRUFBYSx3REFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1FBSUEsS0FBQSxFQUFPLENBSlA7T0FERjtNQU1BLFVBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTywrQkFBUDtRQUNBLFdBQUEsRUFBYSx5RUFEYjtRQUVBLElBQUEsRUFBTSxPQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxDQUFFLElBQUYsRUFBUSxVQUFSLEVBQW9CLFFBQXBCLEVBQThCLEtBQTlCLEVBQXFDLEtBQXJDLEVBQTRDLE1BQTVDLEVBQW9ELEtBQXBELEVBQTJELEtBQTNELENBSFQ7UUFJQSxLQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQUxGO1FBTUEsS0FBQSxFQUFPLENBTlA7T0FQRjtNQWNBLFdBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyw2Q0FBUDtRQUNBLFdBQUEsRUFBYSw2REFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1FBSUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47U0FMRjtRQU1BLEtBQUEsRUFBTyxDQU5QO09BZkY7TUFzQkEsSUFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLHlCQUFQ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QUFDLFNBQUQ7YUFDaEIsSUFBQSxHQUFPLFNBQVMsQ0FBQyxZQUFWLENBQXVCO1FBQUEsSUFBQSxFQUFNLElBQUksQ0FBQyxPQUFYO1FBQW9CLFFBQUEsRUFBVSxHQUE5QjtPQUF2QjtJQURTLENBN0hsQjtJQWdJQSxVQUFBLEVBQVksU0FBQTs7UUFDVixJQUFJLENBQUUsT0FBTixDQUFBOzthQUNBLElBQUEsR0FBTztJQUZHLENBaElaOztBQVJGIiwic291cmNlc0NvbnRlbnQiOlsiV29yZGNvdW50VmlldyA9IHJlcXVpcmUgJy4vd29yZGNvdW50LXZpZXcnXG5fID0gcmVxdWlyZSAnbG9kYXNoJ1xuXG52aWV3ID0gbnVsbFxudGlsZSA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPVxuXG4gIGNvbmZpZzpcbiAgICBhbHdheXNPbjpcbiAgICAgIHRpdGxlOiAnQWx3YXlzIG9uJ1xuICAgICAgZGVzY3JpcHRpb246ICdTaG93IHdvcmQgY291bnQgZm9yIGFsbCBmaWxlcywgcmVnYXJkbGVzcyBvZiBleHRlbnNpb24nXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBvcmRlcjogMVxuICAgIGV4dGVuc2lvbnM6XG4gICAgICB0aXRsZTogJ0F1dG9hY3RpdmF0ZWQgZmlsZSBleHRlbnNpb25zJ1xuICAgICAgZGVzY3JpcHRpb246ICdMaXN0IG9mIGZpbGUgZXh0ZW5zdGlvbnMgd2hpY2ggc2hvdWxkIGhhdmUgdGhlIHdvcmRjb3VudCBwbHVnaW4gZW5hYmxlZCdcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFsgJ21kJywgJ21hcmtkb3duJywgJ3JlYWRtZScsICd0eHQnLCAncnN0JywgJ2Fkb2MnLCAnbG9nJywgJ21zZycgXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBvcmRlcjogMlxuICAgIG5vZXh0ZW5zaW9uOlxuICAgICAgdGl0bGU6ICdBdXRvYWN0aXZhdGUgZm9yIGZpbGVzIHdpdGhvdXQgYW4gZXh0ZW5zaW9uJ1xuICAgICAgZGVzY3JpcHRpb246ICdXb3JkY291bnQgcGx1Z2luIGVuYWJsZWQgZm9yIGZpbGVzIHdpdGhvdXQgYSBmaWxlIGV4dGVuc2lvbidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIG9yZGVyOiAzXG4gICAgZ29hbDpcbiAgICAgIHRpdGxlOiAnV29yayB0b3dhcmQgYSB3b3JkIGdvYWwnXG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3dzIGEgYmFyIHNob3dpbmcgcHJvZ3Jlc3MgdG93YXJkIGEgd29yZCBnb2FsJ1xuICAgICAgdHlwZTogJ251bWJlcidcbiAgICAgIGRlZmF1bHQ6IDBcbiAgICAgIG9yZGVyOiA0XG4gICAgZ29hbENvbG9yOlxuICAgICAgdGl0bGU6ICdDb2xvciBmb3Igd29yZCBnb2FsJ1xuICAgICAgZGVzY3JpcHRpb246ICdVc2UgYSBDU1MgY29sb3IgdmFsdWUsIHN1Y2ggYXMgcmdiKDAsIDg1LCAyNTUpIG9yIGdyZWVuJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdyZ2IoMCwgODUsIDApJ1xuICAgICAgb3JkZXI6IDVcbiAgICBnb2FsTGluZUhlaWdodDpcbiAgICAgIHRpdGxlOiAnUGVyY2VudGFnZSBoZWlnaHQgb2Ygd29yZCBnb2FsIGxpbmUnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJzIwJSdcbiAgICAgIG9yZGVyOiA2XG4gICAgaWdub3JlY29kZTpcbiAgICAgIHRpdGxlOiAnSWdub3JlIE1hcmtkb3duIGNvZGUgYmxvY2tzJ1xuICAgICAgZGVzY3JpcHRpb246ICdEbyBub3QgY291bnQgd29yZHMgaW5zaWRlIG9mIGNvZGUgYmxvY2tzJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgb3JkZXI6IDdcbiAgICBoaWRlY2hhcnM6XG4gICAgICB0aXRsZTogJ0hpZGUgY2hhcmFjdGVyIGNvdW50J1xuICAgICAgZGVzY3JpcHRpb246ICdIaWRlcyB0aGUgY2hhcmFjdGVyIGNvdW50IGZyb20gdGhlIHZpZXcnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBvcmRlcjogOFxuICAgIHNob3dwcmljZTpcbiAgICAgIHRpdGxlOiAnRG8geW91IGdldCBwYWlkIHBlciB3b3JkPydcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2hvd3MgdGhlIHByaWNlIGZvciB0aGUgdGV4dCBwZXIgd29yZCdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIG9yZGVyOiA5XG4gICAgd29yZHByaWNlOlxuICAgICAgdGl0bGU6ICdIb3cgbXVjaCBkbyB5b3UgZ2V0IHBhaWQgcGVyIHdvcmQ/J1xuICAgICAgZGVzY3JpcHRpb246ICdBbGxvd3MgeW91IHRvIGZpbmQgb3V0IGhvdyBtdWNoIGRvIHlvdSBnZXQgcGFpZCBwZXIgd29yZCdcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnMC4xNSdcbiAgICAgIG9yZGVyOiAxMFxuICAgIGN1cnJlbmN5c3ltYm9sOlxuICAgICAgdGl0bGU6ICdTZXQgYSBkaWZmZXJlbnQgY3VycmVuY3kgc3ltYm9sJ1xuICAgICAgZGVzY3JpcHRpb246ICdBbGxvd3MgeW91IHRvIGNoYW5nZSB0aGUgY3VycmVuY3kgeW91IGdldCBwYWlkIHdpdGgnXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJyQnXG4gICAgICBvcmRlcjogMTFcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEB2aXNpYmxlID0gZmFsc2VcbiAgICB2aWV3ID0gbmV3IFdvcmRjb3VudFZpZXcoKVxuXG4gICAgIyBVcGRhdGVzIG9ubHkgdGhlIGNvdW50IG9mIHRoZSBzXG4gICAgdXBkYXRlX2NvdW50ID0gXy50aHJvdHRsZSAoZWRpdG9yKSA9PlxuICAgICAgQHZpc2libGUgJiYgdmlldy51cGRhdGVfY291bnQoZWRpdG9yKVxuICAgICwgMzAwXG5cbiAgICAjIFVwZGF0ZSBjb3VudCB3aGVuIGNvbnRlbnQgb2YgYnVmZmVyIG9yIHNlbGVjdGlvbnMgY2hhbmdlXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpIC0+XG4gICAgICBlZGl0b3Iub25EaWRDaGFuZ2UgLT4gdXBkYXRlX2NvdW50IGVkaXRvclxuXG4gICAgICAjIE5PVEU6IFRoaXMgdHJpZ2dlcnMgYmVmb3JlIGEgZGlkQ2hhbmdlQWN0aXZlUGFuZSwgc28gdGhlIGNvdW50cyBtaWdodCBiZSBjYWxjdWxhdGVkIG9uY2Ugb24gcGFuZSBzd2l0Y2hcbiAgICAgIGVkaXRvci5vbkRpZENoYW5nZVNlbGVjdGlvblJhbmdlIC0+IHVwZGF0ZV9jb3VudCBlZGl0b3JcblxuICAgICMgVXBkYXRlcyB0aGUgdmlzaWJpbGl0eSBhbmQgY291bnQgb2YgdGhlIHZpZXdcbiAgICB1cGRhdGVfdmlld19hbmRfY291bnQgPSAoaXRlbSkgPT5cbiAgICAgIEBzaG93X29yX2hpZGVfZm9yX2l0ZW0gaXRlbVxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICB1cGRhdGVfY291bnQgZWRpdG9yIGlmIGVkaXRvcj9cblxuICAgICMgVXBkYXRlIHdoZW5ldmVyIGFjdGl2ZSBpdGVtIGNoYW5nZXNcbiAgICBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtIHVwZGF0ZV92aWV3X2FuZF9jb3VudFxuXG4gICAgIyBJbml0aWFsIHVwZGF0ZVxuICAgIHVwZGF0ZV92aWV3X2FuZF9jb3VudCBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG5cbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCd3b3JkY291bnQuZ29hbCcsIEB1cGRhdGVfZ29hbClcblxuICB1cGRhdGVfZ29hbDogKGl0ZW0pIC0+XG4gICAgaWYgaXRlbSBpcyAwXG4gICAgICB2aWV3LmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9ICd0cmFuc3BhcmVudCdcblxuICBzaG93X29yX2hpZGVfZm9yX2l0ZW06IChpdGVtKSAtPlxuICAgIHthbHdheXNPbiwgZXh0ZW5zaW9ucywgbm9leHRlbnNpb259ID0gYXRvbS5jb25maWcuZ2V0KCd3b3JkY291bnQnKVxuICAgIGV4dGVuc2lvbnMgPSAoZXh0ZW5zaW9ucyB8fCBbXSkubWFwIChleHRlbnNpb24pIC0+IGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpXG4gICAgYnVmZmVyID0gaXRlbT8uYnVmZmVyXG5cbiAgICBub3RfdGV4dF9lZGl0b3IgPSBub3QgYnVmZmVyP1xuICAgIHVudGl0bGVkX3RhYiA9IGJ1ZmZlcj8uZmlsZSBpcyBudWxsXG4gICAgY3VycmVudF9maWxlX2V4dGVuc2lvbiA9IGJ1ZmZlcj8uZmlsZT8ucGF0aC5tYXRjaCgvXFwuKFxcdyspJC8pP1sxXS50b0xvd2VyQ2FzZSgpXG5cbiAgICBub19leHRlbnNpb24gPSBub2V4dGVuc2lvbiBhbmQgKG5vdCBjdXJyZW50X2ZpbGVfZXh0ZW5zaW9uPyBvciB1bnRpdGxlZF90YWIpXG5cbiAgICBpZiBhbHdheXNPbiBvciBub19leHRlbnNpb24gb3IgY3VycmVudF9maWxlX2V4dGVuc2lvbiBpbiBleHRlbnNpb25zXG4gICAgICBAdmlzaWJsZSA9IHRydWVcbiAgICAgIHZpZXcuZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJpbmxpbmUtYmxvY2tcIiB1bmxlc3Mgbm90X3RleHRfZWRpdG9yXG4gICAgZWxzZVxuICAgICAgQHZpc2libGUgPSBmYWxzZVxuICAgICAgdmlldy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIlxuXG4gIGNvbnN1bWVTdGF0dXNCYXI6IChzdGF0dXNCYXIpIC0+XG4gICAgdGlsZSA9IHN0YXR1c0Jhci5hZGRSaWdodFRpbGUoaXRlbTogdmlldy5lbGVtZW50LCBwcmlvcml0eTogMTAwKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgdGlsZT8uZGVzdHJveSgpXG4gICAgdGlsZSA9IG51bGxcbiJdfQ==
