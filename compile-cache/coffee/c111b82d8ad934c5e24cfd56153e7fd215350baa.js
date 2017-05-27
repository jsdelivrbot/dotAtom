(function() {
  var AtomOpenMarked, CompositeDisposable, exec;

  CompositeDisposable = require('atom').CompositeDisposable;

  exec = require('child_process').exec;

  module.exports = AtomOpenMarked = {
    subscriptions: null,
    config: {
      OpenCommand: {
        type: 'string',
        "default": "Marked\ 2.app"
      }
    },
    activate: function(state) {
      this.openCommand = atom.config.get("atom-open-marked.OpenCommand");
      this.subscriptions = new CompositeDisposable;
      return this.subscriptions.add(atom.commands.add('atom-workspace', {
        'atom-open-marked:OpenMarked': (function(_this) {
          return function() {
            return _this.openMarked();
          };
        })(this)
      }));
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    openMarked: function() {
      var command, editor, file, path;
      console.log("openMarked()");
      editor = atom.workspace.getActivePaneItem();
      file = editor != null ? editor.buffer.file : void 0;
      path = file.path;
      if (path.indexOf(".md") !== -1) {
        command = "open -a '" + this.openCommand + "' " + path;
        console.log("command:" + command);
        return exec(command);
      } else {
        return alert("Selected file is not .md");
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2F0b20tb3Blbi1tYXJrZWQvbGliL2F0b20tb3Blbi1tYXJrZWQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3ZCLE9BQVEsT0FBQSxDQUFRLGVBQVI7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsY0FBQSxHQUNmO0lBQUEsYUFBQSxFQUFlLElBQWY7SUFDQSxNQUFBLEVBQ0k7TUFBQSxXQUFBLEVBQ0k7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsZUFEVDtPQURKO0tBRko7SUFNQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsOEJBQWhCO01BQ2YsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTthQUNyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztRQUFBLDZCQUFBLEVBQStCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFVBQUQsQ0FBQTtVQUFIO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQjtPQUFwQyxDQUFuQjtJQUhRLENBTlY7SUFXQSxVQUFBLEVBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRFUsQ0FYWjtJQWNBLFVBQUEsRUFBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLE9BQU8sQ0FBQyxHQUFSLENBQVksY0FBWjtNQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUE7TUFDVCxJQUFBLG9CQUFPLE1BQU0sQ0FBRSxNQUFNLENBQUM7TUFDdEIsSUFBQSxHQUFPLElBQUksQ0FBQztNQUVaLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLENBQUEsS0FBeUIsQ0FBQyxDQUE3QjtRQUNFLE9BQUEsR0FBVSxXQUFBLEdBQVksSUFBQyxDQUFBLFdBQWIsR0FBeUIsSUFBekIsR0FBNkI7UUFDdkMsT0FBTyxDQUFDLEdBQVIsQ0FBWSxVQUFBLEdBQWEsT0FBekI7ZUFDQSxJQUFBLENBQUssT0FBTCxFQUhGO09BQUEsTUFBQTtlQUtFLEtBQUEsQ0FBTSwwQkFBTixFQUxGOztJQU5VLENBZFo7O0FBSkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xue2V4ZWN9ID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcblxubW9kdWxlLmV4cG9ydHMgPSBBdG9tT3Blbk1hcmtlZCA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGwsXG4gIGNvbmZpZzpcbiAgICAgIE9wZW5Db21tYW5kOlxuICAgICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICAgICAgZGVmYXVsdDogXCJNYXJrZWRcXCAyLmFwcFwiXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAb3BlbkNvbW1hbmQgPSBhdG9tLmNvbmZpZy5nZXQgXCJhdG9tLW9wZW4tbWFya2VkLk9wZW5Db21tYW5kXCJcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXdvcmtzcGFjZScsICdhdG9tLW9wZW4tbWFya2VkOk9wZW5NYXJrZWQnOiA9PiBAb3Blbk1hcmtlZCgpXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuICBvcGVuTWFya2VkOiAtPlxuICAgIGNvbnNvbGUubG9nIFwib3Blbk1hcmtlZCgpXCJcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpXG4gICAgZmlsZSA9IGVkaXRvcj8uYnVmZmVyLmZpbGVcbiAgICBwYXRoID0gZmlsZS5wYXRoXG5cbiAgICBpZiBwYXRoLmluZGV4T2YoXCIubWRcIikgaXNudCAtMVxuICAgICAgY29tbWFuZCA9IFwib3BlbiAtYSAnI3tAb3BlbkNvbW1hbmR9JyAje3BhdGh9XCJcbiAgICAgIGNvbnNvbGUubG9nIFwiY29tbWFuZDpcIiArIGNvbW1hbmRcbiAgICAgIGV4ZWMoY29tbWFuZClcbiAgICBlbHNlXG4gICAgICBhbGVydCBcIlNlbGVjdGVkIGZpbGUgaXMgbm90IC5tZFwiXG4iXX0=
