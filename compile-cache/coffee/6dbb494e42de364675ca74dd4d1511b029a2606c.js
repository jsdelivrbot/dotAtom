(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      scopes: {
        description: 'Comma seperated, no spaces. Find the scope for each language in its package.',
        type: 'string',
        "default": 'text.md,source.gfm,text.html.mediawiki,text.tex.latex'
      }
    },
    activate: function(state) {
      var Run;
      this.disposables = new CompositeDisposable;
      Run = require('./run');
      Run.start();
      this.disposables.add(atom.config.onDidChange('typewriter.scopes', function() {
        return Run.stop();
      }));
      this.disposables.add(atom.config.onDidChange('editor.fontSize', function() {
        return Run.start();
      }));
      this.disposables.add(atom.config.onDidChange('editor.preferredLineLength', function() {
        return Run.start();
      }));
      return this.disposables.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          var editor;
          Run.start();
          editor = atom.workspace.getActiveTextEditor();
          if (editor !== void 0) {
            return _this.disposables.add(editor.onDidChangeGrammar(function() {
              atom.views.getView(editor).setAttribute('style', '');
              atom.views.getView(editor).setAttribute('data-typewriter', false);
              return Run.start();
            }));
          }
        };
      })(this)));
    },
    deactivate: function(state) {
      var Run;
      Run = require('./run');
      Run.stop();
      return this.disposables.dispose();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL3R5cGV3cml0ZXIvbGliL3R5cGV3cml0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxNQUFBLEVBQ0U7TUFBQSxNQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsOEVBQWI7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsdURBRlQ7T0FERjtLQURGO0lBTUEsUUFBQSxFQUFVLFNBQUMsS0FBRDtBQUNSLFVBQUE7TUFBQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFDbkIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSO01BQ04sR0FBRyxDQUFDLEtBQUosQ0FBQTtNQUVBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsbUJBQXhCLEVBQTZDLFNBQUE7ZUFFNUQsR0FBRyxDQUFDLElBQUosQ0FBQTtNQUY0RCxDQUE3QyxDQUFqQjtNQUlBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsaUJBQXhCLEVBQTJDLFNBQUE7ZUFDMUQsR0FBRyxDQUFDLEtBQUosQ0FBQTtNQUQwRCxDQUEzQyxDQUFqQjtNQUdBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsNEJBQXhCLEVBQXNELFNBQUE7ZUFDckUsR0FBRyxDQUFDLEtBQUosQ0FBQTtNQURxRSxDQUF0RCxDQUFqQjthQUdBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLHlCQUFmLENBQXlDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtBQUN4RCxjQUFBO1VBQUEsR0FBRyxDQUFDLEtBQUosQ0FBQTtVQUVBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7VUFDVCxJQUFHLE1BQUEsS0FBWSxNQUFmO21CQUNFLEtBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixNQUFNLENBQUMsa0JBQVAsQ0FBMEIsU0FBQTtjQUV6QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FBMEIsQ0FBQyxZQUEzQixDQUF3QyxPQUF4QyxFQUFpRCxFQUFqRDtjQUNBLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUEwQixDQUFDLFlBQTNCLENBQXdDLGlCQUF4QyxFQUEyRCxLQUEzRDtxQkFFQSxHQUFHLENBQUMsS0FBSixDQUFBO1lBTHlDLENBQTFCLENBQWpCLEVBREY7O1FBSndEO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFqQjtJQWZRLENBTlY7SUFpQ0EsVUFBQSxFQUFZLFNBQUMsS0FBRDtBQUNWLFVBQUE7TUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7TUFDTixHQUFHLENBQUMsSUFBSixDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFIVSxDQWpDWjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBjb25maWc6XG4gICAgc2NvcGVzOlxuICAgICAgZGVzY3JpcHRpb246ICdDb21tYSBzZXBlcmF0ZWQsIG5vIHNwYWNlcy4gRmluZCB0aGUgc2NvcGUgZm9yIGVhY2ggbGFuZ3VhZ2UgaW4gaXRzIHBhY2thZ2UuJ1xuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICd0ZXh0Lm1kLHNvdXJjZS5nZm0sdGV4dC5odG1sLm1lZGlhd2lraSx0ZXh0LnRleC5sYXRleCdcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgUnVuID0gcmVxdWlyZSAnLi9ydW4nXG4gICAgUnVuLnN0YXJ0KClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3R5cGV3cml0ZXIuc2NvcGVzJywgLT5cbiAgICAgICMgUmVzZXQsIHN0YXJ0KCkgd2lsbCBydW4gYWdhaW4gd2hlbiBwYW5lIGlzIHN3aXRjaGVkIChlLmcuIGF3YXkgZnJvbSBzZXR0aW5ncylcbiAgICAgIFJ1bi5zdG9wKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2VkaXRvci5mb250U2l6ZScsIC0+XG4gICAgICBSdW4uc3RhcnQoKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnLCAtPlxuICAgICAgUnVuLnN0YXJ0KClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSA9PlxuICAgICAgUnVuLnN0YXJ0KClcbiAgICAgICMgTGlzdGVuIHRvIGdyYW1tYXIgY2hhbmdlc1xuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiBlZGl0b3IgaXNudCB1bmRlZmluZWRcbiAgICAgICAgQGRpc3Bvc2FibGVzLmFkZCBlZGl0b3Iub25EaWRDaGFuZ2VHcmFtbWFyIC0+XG4gICAgICAgICAgIyBSZXNldCBmaXJzdFxuICAgICAgICAgIGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCAnJylcbiAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZXdyaXRlcicsIGZhbHNlKVxuICAgICAgICAgICMgVGhlbiBkZWNpZGUgaWYgdGhlIG5ldyBncmFtbWFyIG5lZWRzIHRvIGJlIGluIHR5cGV3cml0ZXIgbW9kZVxuICAgICAgICAgIFJ1bi5zdGFydCgpXG5cbiAgZGVhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIFJ1biA9IHJlcXVpcmUgJy4vcnVuJ1xuICAgIFJ1bi5zdG9wKClcbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4iXX0=
