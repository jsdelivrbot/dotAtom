(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = {
    start: function() {
      return requestAnimationFrame(function() {
        var characterWidth, charactersPerLine, currentScope, editor, scopes;
        scopes = atom.config.get('typewriter.scopes').split(',');
        editor = atom.workspace.getActiveTextEditor();
        if (editor !== void 0) {
          currentScope = editor.getRootScopeDescriptor().scopes[0];
          if (indexOf.call(scopes, currentScope) >= 0) {
            characterWidth = editor.getDefaultCharWidth();
            charactersPerLine = atom.config.get('editor.preferredLineLength', {
              scope: [currentScope]
            });
            atom.config.set('editor.softWrap', true, {
              scopeSelector: currentScope
            });
            atom.views.getView(editor).style.maxWidth = characterWidth * (charactersPerLine + 4) + 'px';
            atom.views.getView(editor).style.paddingLeft = characterWidth * 2 + 'px';
            atom.views.getView(editor).style.paddingRight = characterWidth * 2 + 'px';
            return atom.views.getView(editor).setAttribute('data-typewriter', true);
          }
        }
      });
    },
    stop: function() {
      var $;
      $ = require('jquery');
      $('[data-typewriter]').attr('data-typewriter', false);
      return $('atom-text-editor:not(.mini)').css('max-width', '');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL3R5cGV3cml0ZXIvbGliL3J1bi5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxLQUFBLEVBQU8sU0FBQTthQUNMLHFCQUFBLENBQXNCLFNBQUE7QUFDcEIsWUFBQTtRQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsbUJBQWhCLENBQW9DLENBQUMsS0FBckMsQ0FBMkMsR0FBM0M7UUFDVCxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1FBRVQsSUFBRyxNQUFBLEtBQVksTUFBZjtVQUNFLFlBQUEsR0FBZSxNQUFNLENBQUMsc0JBQVAsQ0FBQSxDQUErQixDQUFDLE1BQU8sQ0FBQSxDQUFBO1VBQ3RELElBQUcsYUFBZ0IsTUFBaEIsRUFBQSxZQUFBLE1BQUg7WUFFRSxjQUFBLEdBQWlCLE1BQU0sQ0FBQyxtQkFBUCxDQUFBO1lBQ2pCLGlCQUFBLEdBQW9CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw0QkFBaEIsRUFBOEM7Y0FBQSxLQUFBLEVBQU8sQ0FBQyxZQUFELENBQVA7YUFBOUM7WUFFcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixFQUFtQyxJQUFuQyxFQUF5QztjQUFBLGFBQUEsRUFBZSxZQUFmO2FBQXpDO1lBQ0EsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQTBCLENBQUMsS0FBSyxDQUFDLFFBQWpDLEdBQTRDLGNBQUEsR0FBaUIsQ0FBQyxpQkFBQSxHQUFvQixDQUFyQixDQUFqQixHQUEyQztZQUN2RixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FBMEIsQ0FBQyxLQUFLLENBQUMsV0FBakMsR0FBK0MsY0FBQSxHQUFpQixDQUFqQixHQUFxQjtZQUNwRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FBMEIsQ0FBQyxLQUFLLENBQUMsWUFBakMsR0FBZ0QsY0FBQSxHQUFpQixDQUFqQixHQUFxQjttQkFDckUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CLENBQTBCLENBQUMsWUFBM0IsQ0FBd0MsaUJBQXhDLEVBQTJELElBQTNELEVBVEY7V0FGRjs7TUFKb0IsQ0FBdEI7SUFESyxDQUFQO0lBbUJBLElBQUEsRUFBTSxTQUFBO0FBQ0osVUFBQTtNQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjtNQUNKLENBQUEsQ0FBRSxtQkFBRixDQUFzQixDQUFDLElBQXZCLENBQTRCLGlCQUE1QixFQUErQyxLQUEvQzthQUNBLENBQUEsQ0FBRSw2QkFBRixDQUFnQyxDQUFDLEdBQWpDLENBQXFDLFdBQXJDLEVBQWtELEVBQWxEO0lBSEksQ0FuQk47O0FBRkYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG5cbiAgc3RhcnQ6ICgpIC0+XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIC0+ICMgd2FpdCBmb3Igb3RoZXIgZG9tIGNoYW5nZXNcbiAgICAgIHNjb3BlcyA9IGF0b20uY29uZmlnLmdldCgndHlwZXdyaXRlci5zY29wZXMnKS5zcGxpdCgnLCcpXG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgaWYgZWRpdG9yIGlzbnQgdW5kZWZpbmVkICMgZS5nLiBzZXR0aW5ncy12aWV3XG4gICAgICAgIGN1cnJlbnRTY29wZSA9IGVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKCkuc2NvcGVzWzBdXG4gICAgICAgIGlmIGN1cnJlbnRTY29wZSBpbiBzY29wZXNcblxuICAgICAgICAgIGNoYXJhY3RlcldpZHRoID0gZWRpdG9yLmdldERlZmF1bHRDaGFyV2lkdGgoKVxuICAgICAgICAgIGNoYXJhY3RlcnNQZXJMaW5lID0gYXRvbS5jb25maWcuZ2V0KCdlZGl0b3IucHJlZmVycmVkTGluZUxlbmd0aCcsIHNjb3BlOiBbY3VycmVudFNjb3BlXSlcblxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCgnZWRpdG9yLnNvZnRXcmFwJywgdHJ1ZSwgc2NvcGVTZWxlY3RvcjogY3VycmVudFNjb3BlKVxuICAgICAgICAgIGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpLnN0eWxlLm1heFdpZHRoID0gY2hhcmFjdGVyV2lkdGggKiAoY2hhcmFjdGVyc1BlckxpbmUgKyA0KSArICdweCdcbiAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKS5zdHlsZS5wYWRkaW5nTGVmdCA9IGNoYXJhY3RlcldpZHRoICogMiArICdweCdcbiAgICAgICAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKS5zdHlsZS5wYWRkaW5nUmlnaHQgPSBjaGFyYWN0ZXJXaWR0aCAqIDIgKyAncHgnXG4gICAgICAgICAgYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcikuc2V0QXR0cmlidXRlKCdkYXRhLXR5cGV3cml0ZXInLCB0cnVlKVxuXG5cbiAgc3RvcDogKCkgLT5cbiAgICAkID0gcmVxdWlyZSAnanF1ZXJ5J1xuICAgICQoJ1tkYXRhLXR5cGV3cml0ZXJdJykuYXR0cignZGF0YS10eXBld3JpdGVyJywgZmFsc2UpXG4gICAgJCgnYXRvbS10ZXh0LWVkaXRvcjpub3QoLm1pbmkpJykuY3NzICdtYXgtd2lkdGgnLCAnJ1xuIl19
