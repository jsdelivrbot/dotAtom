(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = {
    start: function() {
      return requestAnimationFrame(function() {
        var characterWidth, charactersPerLine, currentScope, drawTextLeftAligned, editor, enabledForAllScopes, scopes, showGutter, showScrollbar;
        scopes = atom.config.get('typewriter.scopes').split(',');
        showGutter = atom.config.get('typewriter.showGutter');
        showScrollbar = atom.config.get('typewriter.showScrollbar');
        drawTextLeftAligned = atom.config.get('typewriter.drawTextLeftAligned');
        enabledForAllScopes = atom.config.get('typewriter.enabledForAllScopes');
        editor = atom.workspace.getActiveTextEditor();
        if (editor !== void 0) {
          currentScope = editor.getRootScopeDescriptor().scopes[0];
          if (indexOf.call(scopes, currentScope) >= 0 || enabledForAllScopes === true) {
            atom.views.getView(editor).setAttribute('data-typewriter', true);
            if (drawTextLeftAligned === false) {
              characterWidth = editor.getDefaultCharWidth();
              charactersPerLine = atom.config.get('editor.preferredLineLength', {
                scope: [currentScope]
              });
              atom.config.set('editor.softWrap', true, {
                scope: [currentScope]
              });
              atom.views.getView(editor).style.maxWidth = characterWidth * (charactersPerLine + 4) + 'px';
              atom.views.getView(editor).style.paddingLeft = characterWidth * 2 + 'px';
              atom.views.getView(editor).style.paddingRight = characterWidth * 2 + 'px';
            }
            if (showGutter === false) {
              atom.views.getView(editor).setAttribute('data-typewriter-hide-gutter', true);
            }
            if (showScrollbar === false) {
              return atom.views.getView(editor).setAttribute('data-typewriter-hide-scrollbar', true);
            }
          }
        }
      });
    },
    stop: function() {
      var $;
      $ = require('jquery');
      $('[data-typewriter]').attr('data-typewriter', false);
      $('[data-typewriter]').attr('data-typewriter-hide-gutter', false);
      $('[data-typewriter]').attr('data-typewriter-hide-scrollbar', false);
      return $('atom-text-editor:not(.mini)').css('max-width', '');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL3R5cGV3cml0ZXIvbGliL3J1bi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxLQUFBLEVBQU8sU0FBQTthQUNMLHFCQUFBLENBQXNCLFNBQUE7QUFDcEIsWUFBQTtRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBQW9DLENBQUMsS0FBckMsQ0FBMkMsR0FBM0M7UUFDVCxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHVCQUFoQjtRQUNiLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDBCQUFoQjtRQUNoQixtQkFBQSxHQUFzQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCO1FBQ3RCLG1CQUFBLEdBQXNCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixnQ0FBaEI7UUFDdEIsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQTtRQUVULElBQUcsTUFBQSxLQUFZLE1BQWY7VUFDRSxZQUFBLEdBQWUsTUFBTSxDQUFDLHNCQUFQLENBQUEsQ0FBK0IsQ0FBQyxNQUFPLENBQUEsQ0FBQTtVQUV0RCxJQUFHLGFBQWdCLE1BQWhCLEVBQUEsWUFBQSxNQUFBLElBQTBCLG1CQUFBLEtBQXVCLElBQXBEO1lBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQTBCLENBQUMsWUFBM0IsQ0FBd0MsaUJBQXhDLEVBQTJELElBQTNEO1lBRUEsSUFBRyxtQkFBQSxLQUF1QixLQUExQjtjQUNFLGNBQUEsR0FBaUIsTUFBTSxDQUFDLG1CQUFQLENBQUE7Y0FDakIsaUJBQUEsR0FBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixFQUE4QztnQkFBQSxLQUFBLEVBQU8sQ0FBQyxZQUFELENBQVA7ZUFBOUM7Y0FFcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixFQUFtQyxJQUFuQyxFQUF5QztnQkFBQSxLQUFBLEVBQU8sQ0FBQyxZQUFELENBQVA7ZUFBekM7Y0FDQSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FBMEIsQ0FBQyxLQUFLLENBQUMsUUFBakMsR0FBNEMsY0FBQSxHQUFpQixDQUFDLGlCQUFBLEdBQW9CLENBQXJCLENBQWpCLEdBQTJDO2NBQ3ZGLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUEwQixDQUFDLEtBQUssQ0FBQyxXQUFqQyxHQUErQyxjQUFBLEdBQWlCLENBQWpCLEdBQXFCO2NBQ3BFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUEwQixDQUFDLEtBQUssQ0FBQyxZQUFqQyxHQUFnRCxjQUFBLEdBQWlCLENBQWpCLEdBQXFCLEtBUHZFOztZQVNBLElBQUcsVUFBQSxLQUFjLEtBQWpCO2NBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQTBCLENBQUMsWUFBM0IsQ0FBd0MsNkJBQXhDLEVBQXVFLElBQXZFLEVBREY7O1lBR0EsSUFBRyxhQUFBLEtBQWlCLEtBQXBCO3FCQUNFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUEwQixDQUFDLFlBQTNCLENBQXdDLGdDQUF4QyxFQUEwRSxJQUExRSxFQURGO2FBZkY7V0FIRjs7TUFSb0IsQ0FBdEI7SUFESyxDQUFQO0lBOEJBLElBQUEsRUFBTSxTQUFBO0FBQ0osVUFBQTtNQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjtNQUNKLENBQUEsQ0FBRSxtQkFBRixDQUFzQixDQUFDLElBQXZCLENBQTRCLGlCQUE1QixFQUErQyxLQUEvQztNQUNBLENBQUEsQ0FBRSxtQkFBRixDQUFzQixDQUFDLElBQXZCLENBQTRCLDZCQUE1QixFQUEyRCxLQUEzRDtNQUNBLENBQUEsQ0FBRSxtQkFBRixDQUFzQixDQUFDLElBQXZCLENBQTRCLGdDQUE1QixFQUE4RCxLQUE5RDthQUNBLENBQUEsQ0FBRSw2QkFBRixDQUFnQyxDQUFDLEdBQWpDLENBQXFDLFdBQXJDLEVBQWtELEVBQWxEO0lBTEksQ0E5Qk47O0FBRkYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5cbiAgc3RhcnQ6ICgpIC0+XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIC0+ICMgd2FpdCBmb3Igb3RoZXIgZG9tIGNoYW5nZXNcbiAgICAgIHNjb3BlcyA9IGF0b20uY29uZmlnLmdldCgndHlwZXdyaXRlci5zY29wZXMnKS5zcGxpdCgnLCcpXG4gICAgICBzaG93R3V0dGVyID0gYXRvbS5jb25maWcuZ2V0KCd0eXBld3JpdGVyLnNob3dHdXR0ZXInKVxuICAgICAgc2hvd1Njcm9sbGJhciA9IGF0b20uY29uZmlnLmdldCgndHlwZXdyaXRlci5zaG93U2Nyb2xsYmFyJylcbiAgICAgIGRyYXdUZXh0TGVmdEFsaWduZWQgPSBhdG9tLmNvbmZpZy5nZXQoJ3R5cGV3cml0ZXIuZHJhd1RleHRMZWZ0QWxpZ25lZCcpXG4gICAgICBlbmFibGVkRm9yQWxsU2NvcGVzID0gYXRvbS5jb25maWcuZ2V0KCd0eXBld3JpdGVyLmVuYWJsZWRGb3JBbGxTY29wZXMnKVxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICAgIGlmIGVkaXRvciBpc250IHVuZGVmaW5lZCAjIGUuZy4gc2V0dGluZ3Mtdmlld1xuICAgICAgICBjdXJyZW50U2NvcGUgPSBlZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpLnNjb3Blc1swXVxuXG4gICAgICAgIGlmIGN1cnJlbnRTY29wZSBpbiBzY29wZXMgb3IgZW5hYmxlZEZvckFsbFNjb3BlcyBpcyB0cnVlXG4gICAgICAgICAgYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcikuc2V0QXR0cmlidXRlKCdkYXRhLXR5cGV3cml0ZXInLCB0cnVlKVxuXG4gICAgICAgICAgaWYgZHJhd1RleHRMZWZ0QWxpZ25lZCBpcyBmYWxzZVxuICAgICAgICAgICAgY2hhcmFjdGVyV2lkdGggPSBlZGl0b3IuZ2V0RGVmYXVsdENoYXJXaWR0aCgpXG4gICAgICAgICAgICBjaGFyYWN0ZXJzUGVyTGluZSA9IGF0b20uY29uZmlnLmdldCgnZWRpdG9yLnByZWZlcnJlZExpbmVMZW5ndGgnLCBzY29wZTogW2N1cnJlbnRTY29wZV0pXG5cbiAgICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnZWRpdG9yLnNvZnRXcmFwJywgdHJ1ZSwgc2NvcGU6IFtjdXJyZW50U2NvcGVdKVxuICAgICAgICAgICAgYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcikuc3R5bGUubWF4V2lkdGggPSBjaGFyYWN0ZXJXaWR0aCAqIChjaGFyYWN0ZXJzUGVyTGluZSArIDQpICsgJ3B4J1xuICAgICAgICAgICAgYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcikuc3R5bGUucGFkZGluZ0xlZnQgPSBjaGFyYWN0ZXJXaWR0aCAqIDIgKyAncHgnXG4gICAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBjaGFyYWN0ZXJXaWR0aCAqIDIgKyAncHgnXG5cbiAgICAgICAgICBpZiBzaG93R3V0dGVyIGlzIGZhbHNlXG4gICAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZXdyaXRlci1oaWRlLWd1dHRlcicsIHRydWUpXG5cbiAgICAgICAgICBpZiBzaG93U2Nyb2xsYmFyIGlzIGZhbHNlXG4gICAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKS5zZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZXdyaXRlci1oaWRlLXNjcm9sbGJhcicsIHRydWUpXG5cbiAgc3RvcDogKCkgLT5cbiAgICAkID0gcmVxdWlyZSAnanF1ZXJ5J1xuICAgICQoJ1tkYXRhLXR5cGV3cml0ZXJdJykuYXR0cignZGF0YS10eXBld3JpdGVyJywgZmFsc2UpXG4gICAgJCgnW2RhdGEtdHlwZXdyaXRlcl0nKS5hdHRyKCdkYXRhLXR5cGV3cml0ZXItaGlkZS1ndXR0ZXInLCBmYWxzZSlcbiAgICAkKCdbZGF0YS10eXBld3JpdGVyXScpLmF0dHIoJ2RhdGEtdHlwZXdyaXRlci1oaWRlLXNjcm9sbGJhcicsIGZhbHNlKVxuICAgICQoJ2F0b20tdGV4dC1lZGl0b3I6bm90KC5taW5pKScpLmNzcyAnbWF4LXdpZHRoJywgJydcbiJdfQ==
