(function() {
  var CompositeDisposable;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = {
    config: {
      enabledForAllScopes: {
        description: 'Ignore scopes and enable typewriter mode for all files.',
        type: 'boolean',
        "default": false
      },
      drawTextLeftAligned: {
        description: 'Draw text left aligned and don\'t wrap.',
        type: 'boolean',
        "default": false
      },
      showGutter: {
        type: 'boolean',
        "default": false
      },
      showScrollbar: {
        type: 'boolean',
        "default": false
      },
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
      this.disposables.add(atom.config.onDidChange('typewriter.drawTextLeftAligned', function() {
        return Run.stop();
      }));
      this.disposables.add(atom.config.onDidChange('typewriter.showGutter', function() {
        return Run.stop();
      }));
      this.disposables.add(atom.config.onDidChange('typewriter.showScrollbar', function() {
        return Run.stop();
      }));
      this.disposables.add(atom.config.onDidChange('typewriter.enabledForAllScopes', function() {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL3R5cGV3cml0ZXIvbGliL3R5cGV3cml0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBRXhCLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxNQUFBLEVBQ0U7TUFBQSxtQkFBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLHlEQUFiO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRlQ7T0FERjtNQUlBLG1CQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEseUNBQWI7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtPQUxGO01BUUEsVUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7T0FURjtNQVdBLGFBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BWkY7TUFjQSxNQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsOEVBQWI7UUFDQSxJQUFBLEVBQU0sUUFETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsdURBRlQ7T0FmRjtLQURGO0lBb0JBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFDUixVQUFBO01BQUEsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BQ25CLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjtNQUNOLEdBQUcsQ0FBQyxLQUFKLENBQUE7TUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLG1CQUF4QixFQUE2QyxTQUFBO2VBQzVELEdBQUcsQ0FBQyxJQUFKLENBQUE7TUFENEQsQ0FBN0MsQ0FBakI7TUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLGdDQUF4QixFQUEwRCxTQUFBO2VBQ3pFLEdBQUcsQ0FBQyxJQUFKLENBQUE7TUFEeUUsQ0FBMUQsQ0FBakI7TUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLHVCQUF4QixFQUFpRCxTQUFBO2VBQ2hFLEdBQUcsQ0FBQyxJQUFKLENBQUE7TUFEZ0UsQ0FBakQsQ0FBakI7TUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLDBCQUF4QixFQUFvRCxTQUFBO2VBQ25FLEdBQUcsQ0FBQyxJQUFKLENBQUE7TUFEbUUsQ0FBcEQsQ0FBakI7TUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLGdDQUF4QixFQUEwRCxTQUFBO2VBQ3pFLEdBQUcsQ0FBQyxJQUFKLENBQUE7TUFEeUUsQ0FBMUQsQ0FBakI7TUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLGlCQUF4QixFQUEyQyxTQUFBO2VBQzFELEdBQUcsQ0FBQyxLQUFKLENBQUE7TUFEMEQsQ0FBM0MsQ0FBakI7TUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFaLENBQXdCLDRCQUF4QixFQUFzRCxTQUFBO2VBQ3JFLEdBQUcsQ0FBQyxLQUFKLENBQUE7TUFEcUUsQ0FBdEQsQ0FBakI7YUFHQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyx5QkFBZixDQUF5QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDeEQsY0FBQTtVQUFBLEdBQUcsQ0FBQyxLQUFKLENBQUE7VUFFQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1VBQ1QsSUFBRyxNQUFBLEtBQVksTUFBZjttQkFDRSxLQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsTUFBTSxDQUFDLGtCQUFQLENBQTBCLFNBQUE7Y0FFekMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQTBCLENBQUMsWUFBM0IsQ0FBd0MsT0FBeEMsRUFBaUQsRUFBakQ7Y0FDQSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FBMEIsQ0FBQyxZQUEzQixDQUF3QyxpQkFBeEMsRUFBMkQsS0FBM0Q7cUJBRUEsR0FBRyxDQUFDLEtBQUosQ0FBQTtZQUx5QyxDQUExQixDQUFqQixFQURGOztRQUp3RDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0FBakI7SUEzQlEsQ0FwQlY7SUEyREEsVUFBQSxFQUFZLFNBQUMsS0FBRDtBQUNWLFVBQUE7TUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7TUFDTixHQUFHLENBQUMsSUFBSixDQUFBO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUE7SUFIVSxDQTNEWjs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cbm1vZHVsZS5leHBvcnRzID1cblxuICBjb25maWc6XG4gICAgZW5hYmxlZEZvckFsbFNjb3BlczpcbiAgICAgIGRlc2NyaXB0aW9uOiAnSWdub3JlIHNjb3BlcyBhbmQgZW5hYmxlIHR5cGV3cml0ZXIgbW9kZSBmb3IgYWxsIGZpbGVzLidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBkcmF3VGV4dExlZnRBbGlnbmVkOlxuICAgICAgZGVzY3JpcHRpb246ICdEcmF3IHRleHQgbGVmdCBhbGlnbmVkIGFuZCBkb25cXCd0IHdyYXAuJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIHNob3dHdXR0ZXI6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgc2hvd1Njcm9sbGJhcjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBzY29wZXM6XG4gICAgICBkZXNjcmlwdGlvbjogJ0NvbW1hIHNlcGVyYXRlZCwgbm8gc3BhY2VzLiBGaW5kIHRoZSBzY29wZSBmb3IgZWFjaCBsYW5ndWFnZSBpbiBpdHMgcGFja2FnZS4nXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ3RleHQubWQsc291cmNlLmdmbSx0ZXh0Lmh0bWwubWVkaWF3aWtpLHRleHQudGV4LmxhdGV4J1xuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBSdW4gPSByZXF1aXJlICcuL3J1bidcbiAgICBSdW4uc3RhcnQoKVxuXG4gICAgIyBSZXNldCwgc3RhcnQoKSB3aWxsIHJ1biBhZ2FpbiB3aGVuIHBhbmUgaXMgc3dpdGNoZWQgKGUuZy4gYXdheSBmcm9tIHNldHRpbmdzKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3R5cGV3cml0ZXIuc2NvcGVzJywgLT5cbiAgICAgIFJ1bi5zdG9wKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3R5cGV3cml0ZXIuZHJhd1RleHRMZWZ0QWxpZ25lZCcsIC0+XG4gICAgICBSdW4uc3RvcCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICd0eXBld3JpdGVyLnNob3dHdXR0ZXInLCAtPlxuICAgICAgUnVuLnN0b3AoKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAndHlwZXdyaXRlci5zaG93U2Nyb2xsYmFyJywgLT5cbiAgICAgIFJ1bi5zdG9wKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ3R5cGV3cml0ZXIuZW5hYmxlZEZvckFsbFNjb3BlcycsIC0+XG4gICAgICBSdW4uc3RvcCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdlZGl0b3IuZm9udFNpemUnLCAtPlxuICAgICAgUnVuLnN0YXJ0KClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2VkaXRvci5wcmVmZXJyZWRMaW5lTGVuZ3RoJywgLT5cbiAgICAgIFJ1bi5zdGFydCgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9uRGlkQ2hhbmdlQWN0aXZlUGFuZUl0ZW0gPT5cbiAgICAgIFJ1bi5zdGFydCgpXG4gICAgICAjIExpc3RlbiB0byBncmFtbWFyIGNoYW5nZXNcbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgaWYgZWRpdG9yIGlzbnQgdW5kZWZpbmVkXG4gICAgICAgIEBkaXNwb3NhYmxlcy5hZGQgZWRpdG9yLm9uRGlkQ2hhbmdlR3JhbW1hciAtPlxuICAgICAgICAgICMgUmVzZXQgZmlyc3RcbiAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJycpXG4gICAgICAgICAgYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcikuc2V0QXR0cmlidXRlKCdkYXRhLXR5cGV3cml0ZXInLCBmYWxzZSlcbiAgICAgICAgICAjIFRoZW4gZGVjaWRlIGlmIHRoZSBuZXcgZ3JhbW1hciBuZWVkcyB0byBiZSBpbiB0eXBld3JpdGVyIG1vZGVcbiAgICAgICAgICBSdW4uc3RhcnQoKVxuXG4gIGRlYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBSdW4gPSByZXF1aXJlICcuL3J1bidcbiAgICBSdW4uc3RvcCgpXG4gICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuIl19
