(function() {
  var CompositeDisposable, Marked, exec;

  exec = require("child_process").exec;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = Marked = {
    subscriptions: null,
    config: {
      application: {
        type: 'string',
        "default": 'Marked 2.app'
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-text-editor', {
        'marked:open': (function(_this) {
          return function() {
            return _this.open();
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    serialize: function() {},
    open: function() {
      var app, path, ref, ref1, ref2;
      path = (ref = atom.workspace.getActiveTextEditor()) != null ? (ref1 = ref.buffer) != null ? (ref2 = ref1.file) != null ? ref2.path : void 0 : void 0 : void 0;
      app = atom.config.get('marked.application');
      if (path != null) {
        return exec("open -a \"" + app + "\" \"" + path + "\"");
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21hcmtlZC9saWIvbWFya2VkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxlQUFSLENBQXdCLENBQUM7O0VBRS9CLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFFeEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsTUFBQSxHQUNmO0lBQUEsYUFBQSxFQUFlLElBQWY7SUFFQSxNQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsY0FEVDtPQURGO0tBSEY7SUFPQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTthQUVyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQztRQUFBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUFHLEtBQUMsQ0FBQSxJQUFELENBQUE7VUFBSDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZjtPQUF0QyxDQUFuQjtJQUhRLENBUFY7SUFZQSxVQUFBLEVBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRFUsQ0FaWjtJQWVBLFNBQUEsRUFBVyxTQUFBLEdBQUEsQ0FmWDtJQWlCQSxJQUFBLEVBQU0sU0FBQTtBQUNKLFVBQUE7TUFBQSxJQUFBLHlIQUF5RCxDQUFFO01BQzNELEdBQUEsR0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCO01BRVAsSUFBeUMsWUFBekM7ZUFBQSxJQUFBLENBQUssWUFBQSxHQUFhLEdBQWIsR0FBaUIsT0FBakIsR0FBd0IsSUFBeEIsR0FBNkIsSUFBbEMsRUFBQTs7SUFKSSxDQWpCTjs7QUFMRiIsInNvdXJjZXNDb250ZW50IjpbImV4ZWMgPSByZXF1aXJlKFwiY2hpbGRfcHJvY2Vzc1wiKS5leGVjXG5cbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID0gTWFya2VkID1cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuXG4gIGNvbmZpZzpcbiAgICBhcHBsaWNhdGlvbjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnTWFya2VkIDIuYXBwJ1xuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ21hcmtlZDpvcGVuJzogPT4gQG9wZW4oKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG5cbiAgc2VyaWFsaXplOiAtPlxuXG4gIG9wZW46IC0+XG4gICAgcGF0aCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uYnVmZmVyPy5maWxlPy5wYXRoXG4gICAgYXBwICA9IGF0b20uY29uZmlnLmdldCgnbWFya2VkLmFwcGxpY2F0aW9uJylcblxuICAgIGV4ZWMgXCJvcGVuIC1hIFxcXCIje2FwcH1cXFwiIFxcXCIje3BhdGh9XFxcIlwiIGlmIHBhdGg/XG4iXX0=
