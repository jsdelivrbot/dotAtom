
/*
  lib/simple-drag-drop-text.coffee
 */

(function() {
  var $, SimpleDragDropText, SubAtom;

  $ = require('jquery');

  SubAtom = require('sub-atom');

  SimpleDragDropText = (function() {
    function SimpleDragDropText() {}

    SimpleDragDropText.prototype.config = {
      copyKey: {
        type: 'string',
        "default": 'ctrl',
        description: 'Select modifier key for copy action',
        "enum": ['alt', 'ctrl', 'meta']
      }
    };

    SimpleDragDropText.prototype.activate = function() {
      this.subs = new SubAtom;
      this.subs.add('body', 'mouseup', (function(_this) {
        return function(e) {
          if (_this.mouseIsDown) {
            return _this.clear(e[atom.config.get('simple-drag-drop-text.copyKey') + 'Key']);
          }
        };
      })(this));
      this.subs.add(atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return _this.setEditor();
        };
      })(this)));
      return this.subs.add(atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function(editor) {
          return _this.setEditor();
        };
      })(this)));
    };

    SimpleDragDropText.prototype.setEditor = function() {
      return process.nextTick((function(_this) {
        return function() {
          var ref;
          if (!(_this.editor = atom.workspace.getActiveTextEditor())) {
            _this.clear();
            return;
          }
          if ((ref = _this.linesSubs) != null) {
            ref.dispose();
          }
          _this.lines = atom.views.getView(_this.editor);
          _this.lines = _this.lines.querySelector('.lines');
          _this.linesSubs = new SubAtom;
          _this.linesSubs.add(_this.lines, 'mousedown', function(e) {
            return _this.mousedown(e);
          });
          return _this.linesSubs.add(_this.lines, 'mousemove', function(e) {
            if (_this.mouseIsDown && e.which > 0) {
              return _this.drag();
            } else {
              return _this.clear();
            }
          });
        };
      })(this));
    };

    SimpleDragDropText.prototype.mousedown = function(e) {
      var inSelection;
      if (!this.editor) {
        this.clear();
        return;
      }
      this.selMarker = this.editor.getLastSelection().marker;
      this.selBufferRange = this.selMarker.getBufferRange();
      if (this.selBufferRange.isEmpty()) {
        return;
      }
      inSelection = false;
      $(this.lines).find('.highlights .highlight.selection .region').each((function(_this) {
        return function(__, ele) {
          var bottom, left, ref, ref1, ref2, right, top;
          ref = ele.getBoundingClientRect(), left = ref.left, top = ref.top, right = ref.right, bottom = ref.bottom;
          if ((left <= (ref1 = e.pageX) && ref1 < right) && (top <= (ref2 = e.pageY) && ref2 < bottom)) {
            inSelection = true;
            return false;
          }
        };
      })(this));
      if (!inSelection) {
        return;
      }
      this.text = this.editor.getTextInBufferRange(this.selBufferRange);
      this.marker = this.editor.markBufferRange(this.selBufferRange, this.selMarker.getProperties());
      this.editor.decorateMarker(this.marker, {
        type: 'highlight',
        "class": 'selection'
      });
      return this.mouseIsDown = true;
    };

    SimpleDragDropText.prototype.drag = function() {
      var selection;
      this.isDragging = true;
      selection = this.editor.getLastSelection();
      return process.nextTick(function() {
        return selection.clear();
      });
    };

    SimpleDragDropText.prototype.drop = function(altKey) {
      var checkpointBefore, cursorPos;
      checkpointBefore = this.editor.createCheckpoint();
      if (!altKey) {
        this.editor.setTextInBufferRange(this.selBufferRange, '');
      }
      cursorPos = this.editor.getLastSelection().marker.getBufferRange().start;
      this.editor.setTextInBufferRange([cursorPos, cursorPos], this.text);
      return this.editor.groupChangesSinceCheckpoint(checkpointBefore);
    };

    SimpleDragDropText.prototype.clear = function(altKey) {
      var ref;
      if ((altKey != null) && this.isDragging) {
        this.drop(altKey);
      }
      this.mouseIsDown = this.isDragging = false;
      return (ref = this.marker) != null ? ref.destroy() : void 0;
    };

    SimpleDragDropText.prototype.deactivate = function() {
      var ref;
      this.clear();
      if ((ref = this.linesSubs) != null) {
        ref.dispose();
      }
      return this.subs.dispose();
    };

    return SimpleDragDropText;

  })();

  module.exports = new SimpleDragDropText;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL3NpbXBsZS1kcmFnLWRyb3AtdGV4dC9saWIvc2ltcGxlLWRyYWctZHJvcC10ZXh0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0E7Ozs7QUFBQTtBQUFBLE1BQUE7O0VBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUNKLE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7RUFFSjs7O2lDQUNKLE1BQUEsR0FDRTtNQUFBLE9BQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxNQURUO1FBRUEsV0FBQSxFQUFhLHFDQUZiO1FBR0EsQ0FBQSxJQUFBLENBQUEsRUFBTSxDQUFDLEtBQUQsRUFBUSxNQUFSLEVBQWdCLE1BQWhCLENBSE47T0FERjs7O2lDQU1GLFFBQUEsR0FBVSxTQUFBO01BQ1IsSUFBQyxDQUFBLElBQUQsR0FBUSxJQUFJO01BRVosSUFBQyxDQUFBLElBQUksQ0FBQyxHQUFOLENBQVUsTUFBVixFQUFrQixTQUFsQixFQUE2QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUFPLElBQUcsS0FBQyxDQUFBLFdBQUo7bUJBQXFCLEtBQUMsQ0FBQSxLQUFELENBQU8sQ0FBRSxDQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwrQkFBaEIsQ0FBQSxHQUFpRCxLQUFqRCxDQUFULEVBQXJCOztRQUFQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QjtNQUNBLElBQUMsQ0FBQSxJQUFJLENBQUMsR0FBTixDQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBeUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7aUJBQVksS0FBQyxDQUFBLFNBQUQsQ0FBQTtRQUFaO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUFWO2FBQ0Es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QSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUMsQ0FBQSxVQUFELEdBQWM7OENBQ3RCLENBQUUsT0FBVCxDQUFBO0lBSEs7O2lDQUtQLFVBQUEsR0FBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLElBQUMsQ0FBQSxLQUFELENBQUE7O1dBQ1UsQ0FBRSxPQUFaLENBQUE7O2FBQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxPQUFOLENBQUE7SUFIVTs7Ozs7O0VBS2QsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFBSTtBQWhGckIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMjI1xuICBsaWIvc2ltcGxlLWRyYWctZHJvcC10ZXh0LmNvZmZlZVxuIyMjXG5cbiQgPSByZXF1aXJlICdqcXVlcnknXG5TdWJBdG9tID0gcmVxdWlyZSAnc3ViLWF0b20nXG5cbmNsYXNzIFNpbXBsZURyYWdEcm9wVGV4dFxuICBjb25maWc6XG4gICAgY29weUtleTpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnY3RybCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnU2VsZWN0IG1vZGlmaWVyIGtleSBmb3IgY29weSBhY3Rpb24nXG4gICAgICBlbnVtOiBbJ2FsdCcsICdjdHJsJywgJ21ldGEnXVxuXG4gIGFjdGl2YXRlOiAtPlxuICAgIEBzdWJzID0gbmV3IFN1YkF0b21cblxuICAgIEBzdWJzLmFkZCAnYm9keScsICdtb3VzZXVwJywgKGUpID0+IGlmIEBtb3VzZUlzRG93biB0aGVuIEBjbGVhciBlW2F0b20uY29uZmlnLmdldCgnc2ltcGxlLWRyYWctZHJvcC10ZXh0LmNvcHlLZXknKSsnS2V5J11cbiAgICBAc3Vicy5hZGQgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzICAgICAgICAoZWRpdG9yKSA9PiBAc2V0RWRpdG9yKClcbiAgICBAc3Vicy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSAoZWRpdG9yKSA9PiBAc2V0RWRpdG9yKClcblxuICBzZXRFZGl0b3I6IC0+XG4gICAgcHJvY2Vzcy5uZXh0VGljayA9PlxuICAgICAgaWYgbm90IChAZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKVxuICAgICAgICBAY2xlYXIoKVxuICAgICAgICByZXR1cm5cblxuICAgICAgQGxpbmVzU3Vicz8uZGlzcG9zZSgpXG4gICAgICBAbGluZXMgPSBhdG9tLnZpZXdzLmdldFZpZXcoQGVkaXRvcilcbiAgICAgIEBsaW5lcyA9IEBsaW5lcy5xdWVyeVNlbGVjdG9yICcubGluZXMnXG4gICAgICBAbGluZXNTdWJzID0gbmV3IFN1YkF0b21cbiAgICAgIEBsaW5lc1N1YnMuYWRkIEBsaW5lcywgJ21vdXNlZG93bicsIChlKSA9PiBAbW91c2Vkb3duIGVcbiAgICAgIEBsaW5lc1N1YnMuYWRkIEBsaW5lcywgJ21vdXNlbW92ZScsIChlKSA9PlxuICAgICAgICBpZiBAbW91c2VJc0Rvd24gYW5kIGUud2hpY2ggPiAwIHRoZW4gQGRyYWcoKSBlbHNlIEBjbGVhcigpXG5cbiAgbW91c2Vkb3duOiAoZSkgLT5cbiAgICBpZiBub3QgQGVkaXRvciB0aGVuIEBjbGVhcigpOyByZXR1cm5cblxuICAgIEBzZWxNYXJrZXIgPSBAZWRpdG9yLmdldExhc3RTZWxlY3Rpb24oKS5tYXJrZXJcbiAgICBAc2VsQnVmZmVyUmFuZ2UgPSBAc2VsTWFya2VyLmdldEJ1ZmZlclJhbmdlKClcbiAgICBpZiBAc2VsQnVmZmVyUmFuZ2UuaXNFbXB0eSgpIHRoZW4gcmV0dXJuXG5cbiAgICBpblNlbGVjdGlvbiA9IG5vXG4gICAgJChAbGluZXMpLmZpbmQoJy5oaWdobGlnaHRzIC5oaWdobGlnaHQuc2VsZWN0aW9uIC5yZWdpb24nKS5lYWNoIChfXywgZWxlKSA9PlxuICAgICAge2xlZnQsIHRvcCwgcmlnaHQsIGJvdHRvbX0gPSBlbGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGlmIGxlZnQgPD0gZS5wYWdlWCA8IHJpZ2h0IGFuZFxuICAgICAgICAgIHRvcCA8PSBlLnBhZ2VZIDwgYm90dG9tXG4gICAgICAgIGluU2VsZWN0aW9uID0geWVzXG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIGlmIG5vdCBpblNlbGVjdGlvbiB0aGVuIHJldHVyblxuXG4gICAgQHRleHQgPSBAZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlIEBzZWxCdWZmZXJSYW5nZVxuICAgIEBtYXJrZXIgPSBAZWRpdG9yLm1hcmtCdWZmZXJSYW5nZSBAc2VsQnVmZmVyUmFuZ2UsIEBzZWxNYXJrZXIuZ2V0UHJvcGVydGllcygpXG4gICAgQGVkaXRvci5kZWNvcmF0ZU1hcmtlciBAbWFya2VyLCB0eXBlOiAnaGlnaGxpZ2h0JywgY2xhc3M6ICdzZWxlY3Rpb24nXG5cbiAgICBAbW91c2VJc0Rvd24gPSB5ZXNcblxuICBkcmFnOiAtPlxuICAgIEBpc0RyYWdnaW5nID0geWVzXG4gICAgc2VsZWN0aW9uID0gQGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKClcbiAgICBwcm9jZXNzLm5leHRUaWNrIC0+IHNlbGVjdGlvbi5jbGVhcigpXG5cbiAgZHJvcDogKGFsdEtleSkgLT5cbiAgICBjaGVja3BvaW50QmVmb3JlID0gQGVkaXRvci5jcmVhdGVDaGVja3BvaW50KClcbiAgICBpZiBub3QgYWx0S2V5IHRoZW4gQGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZSBAc2VsQnVmZmVyUmFuZ2UsICcnXG4gICAgY3Vyc29yUG9zID0gQGVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkubWFya2VyLmdldEJ1ZmZlclJhbmdlKCkuc3RhcnRcbiAgICBAZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlIFtjdXJzb3JQb3MsIGN1cnNvclBvc10sIEB0ZXh0XG4gICAgQGVkaXRvci5ncm91cENoYW5nZXNTaW5jZUNoZWNrcG9pbnQgY2hlY2twb2ludEJlZm9yZVxuXG4gIGNsZWFyOiAoYWx0S2V5KSAtPlxuICAgIGlmIGFsdEtleT8gYW5kIEBpc0RyYWdnaW5nIHRoZW4gQGRyb3AgYWx0S2V5XG4gICAgQG1vdXNlSXNEb3duID0gQGlzRHJhZ2dpbmcgPSBub1xuICAgIEBtYXJrZXI/LmRlc3Ryb3koKVxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGNsZWFyKClcbiAgICBAbGluZXNTdWJzPy5kaXNwb3NlKClcbiAgICBAc3Vicy5kaXNwb3NlKClcblxubW9kdWxlLmV4cG9ydHMgPSBuZXcgU2ltcGxlRHJhZ0Ryb3BUZXh0XG4iXX0=
