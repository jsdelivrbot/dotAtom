(function() {
  var CompositeDisposable, MinimapHighlightSelected, requirePackages,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  requirePackages = require('atom-utils').requirePackages;

  MinimapHighlightSelected = (function() {
    function MinimapHighlightSelected() {
      this.markersDestroyed = bind(this.markersDestroyed, this);
      this.markerCreated = bind(this.markerCreated, this);
      this.dispose = bind(this.dispose, this);
      this.init = bind(this.init, this);
      this.subscriptions = new CompositeDisposable;
    }

    MinimapHighlightSelected.prototype.activate = function(state) {
      if (!atom.inSpecMode()) {
        return require('atom-package-deps').install('minimap-highlight-selected', true);
      }
    };

    MinimapHighlightSelected.prototype.consumeMinimapServiceV1 = function(minimap1) {
      this.minimap = minimap1;
      return this.minimap.registerPlugin('highlight-selected', this);
    };

    MinimapHighlightSelected.prototype.consumeHighlightSelectedServiceV2 = function(highlightSelected) {
      this.highlightSelected = highlightSelected;
      if ((this.minimap != null) && (this.active != null)) {
        return this.init();
      }
    };

    MinimapHighlightSelected.prototype.deactivate = function() {
      this.deactivatePlugin();
      this.minimapPackage = null;
      this.highlightSelectedPackage = null;
      this.highlightSelected = null;
      return this.minimap = null;
    };

    MinimapHighlightSelected.prototype.isActive = function() {
      return this.active;
    };

    MinimapHighlightSelected.prototype.activatePlugin = function() {
      if (this.active) {
        return;
      }
      this.subscriptions.add(this.minimap.onDidActivate(this.init));
      this.subscriptions.add(this.minimap.onDidDeactivate(this.dispose));
      this.active = true;
      if (this.highlightSelected != null) {
        return this.init();
      }
    };

    MinimapHighlightSelected.prototype.init = function() {
      this.decorations = [];
      this.highlightSelected.onDidAddMarkerForEditor((function(_this) {
        return function(options) {
          return _this.markerCreated(options);
        };
      })(this));
      this.highlightSelected.onDidAddSelectedMarkerForEditor((function(_this) {
        return function(options) {
          return _this.markerCreated(options, true);
        };
      })(this));
      return this.highlightSelected.onDidRemoveAllMarkers((function(_this) {
        return function() {
          return _this.markersDestroyed();
        };
      })(this));
    };

    MinimapHighlightSelected.prototype.dispose = function() {
      var ref;
      if ((ref = this.decorations) != null) {
        ref.forEach(function(decoration) {
          return decoration.destroy();
        });
      }
      return this.decorations = null;
    };

    MinimapHighlightSelected.prototype.markerCreated = function(options, selected) {
      var className, decoration, minimap;
      if (selected == null) {
        selected = false;
      }
      minimap = this.minimap.minimapForEditor(options.editor);
      if (minimap == null) {
        return;
      }
      className = 'highlight-selected';
      if (selected) {
        className += ' selected';
      }
      decoration = minimap.decorateMarker(options.marker, {
        type: 'highlight',
        "class": className
      });
      return this.decorations.push(decoration);
    };

    MinimapHighlightSelected.prototype.markersDestroyed = function() {
      this.decorations.forEach(function(decoration) {
        return decoration.destroy();
      });
      return this.decorations = [];
    };

    MinimapHighlightSelected.prototype.deactivatePlugin = function() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.dispose();
      return this.subscriptions.dispose();
    };

    return MinimapHighlightSelected;

  })();

  module.exports = new MinimapHighlightSelected;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21pbmltYXAtaGlnaGxpZ2h0LXNlbGVjdGVkL2xpYi9taW5pbWFwLWhpZ2hsaWdodC1zZWxlY3RlZC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDhEQUFBO0lBQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSOztFQUN2QixrQkFBbUIsT0FBQSxDQUFRLFlBQVI7O0VBRWQ7SUFDUyxrQ0FBQTs7Ozs7TUFDWCxJQUFDLENBQUEsYUFBRCxHQUFpQixJQUFJO0lBRFY7O3VDQUdiLFFBQUEsR0FBVSxTQUFDLEtBQUQ7TUFDUixJQUFBLENBQU8sSUFBSSxDQUFDLFVBQUwsQ0FBQSxDQUFQO2VBQ0UsT0FBQSxDQUFRLG1CQUFSLENBQTRCLENBQUMsT0FBN0IsQ0FBcUMsNEJBQXJDLEVBQW1FLElBQW5FLEVBREY7O0lBRFE7O3VDQUlWLHVCQUFBLEdBQXlCLFNBQUMsUUFBRDtNQUFDLElBQUMsQ0FBQSxVQUFEO2FBQ3hCLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUF3QixvQkFBeEIsRUFBOEMsSUFBOUM7SUFEdUI7O3VDQUd6QixpQ0FBQSxHQUFtQyxTQUFDLGlCQUFEO01BQUMsSUFBQyxDQUFBLG9CQUFEO01BQ2xDLElBQVcsc0JBQUEsSUFBYyxxQkFBekI7ZUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBQUE7O0lBRGlDOzt1Q0FHbkMsVUFBQSxHQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsZ0JBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCO01BQ2xCLElBQUMsQ0FBQSx3QkFBRCxHQUE0QjtNQUM1QixJQUFDLENBQUEsaUJBQUQsR0FBcUI7YUFDckIsSUFBQyxDQUFBLE9BQUQsR0FBVztJQUxEOzt1Q0FPWixRQUFBLEdBQVUsU0FBQTthQUFHLElBQUMsQ0FBQTtJQUFKOzt1Q0FFVixjQUFBLEdBQWdCLFNBQUE7TUFDZCxJQUFVLElBQUMsQ0FBQSxNQUFYO0FBQUEsZUFBQTs7TUFFQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxhQUFULENBQXVCLElBQUMsQ0FBQSxJQUF4QixDQUFuQjtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsT0FBTyxDQUFDLGVBQVQsQ0FBeUIsSUFBQyxDQUFBLE9BQTFCLENBQW5CO01BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUVWLElBQVcsOEJBQVg7ZUFBQSxJQUFDLENBQUEsSUFBRCxDQUFBLEVBQUE7O0lBUmM7O3VDQVVoQixJQUFBLEdBQU0sU0FBQTtNQUNKLElBQUMsQ0FBQSxXQUFELEdBQWU7TUFDZixJQUFDLENBQUEsaUJBQWlCLENBQUMsdUJBQW5CLENBQTJDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO2lCQUFhLEtBQUMsQ0FBQSxhQUFELENBQWUsT0FBZjtRQUFiO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEzQztNQUNBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQywrQkFBbkIsQ0FBbUQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7aUJBQWEsS0FBQyxDQUFBLGFBQUQsQ0FBZSxPQUFmLEVBQXdCLElBQXhCO1FBQWI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5EO2FBQ0EsSUFBQyxDQUFBLGlCQUFpQixDQUFDLHFCQUFuQixDQUF5QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQUcsS0FBQyxDQUFBLGdCQUFELENBQUE7UUFBSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7SUFKSTs7dUNBTU4sT0FBQSxHQUFTLFNBQUE7QUFDUCxVQUFBOztXQUFZLENBQUUsT0FBZCxDQUFzQixTQUFDLFVBQUQ7aUJBQWdCLFVBQVUsQ0FBQyxPQUFYLENBQUE7UUFBaEIsQ0FBdEI7O2FBQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZTtJQUZSOzt1Q0FJVCxhQUFBLEdBQWUsU0FBQyxPQUFELEVBQVUsUUFBVjtBQUNiLFVBQUE7O1FBRHVCLFdBQVc7O01BQ2xDLE9BQUEsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLGdCQUFULENBQTBCLE9BQU8sQ0FBQyxNQUFsQztNQUNWLElBQWMsZUFBZDtBQUFBLGVBQUE7O01BQ0EsU0FBQSxHQUFhO01BQ2IsSUFBNEIsUUFBNUI7UUFBQSxTQUFBLElBQWEsWUFBYjs7TUFFQSxVQUFBLEdBQWEsT0FBTyxDQUFDLGNBQVIsQ0FBdUIsT0FBTyxDQUFDLE1BQS9CLEVBQ1g7UUFBQyxJQUFBLEVBQU0sV0FBUDtRQUFvQixDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQTNCO09BRFc7YUFFYixJQUFDLENBQUEsV0FBVyxDQUFDLElBQWIsQ0FBa0IsVUFBbEI7SUFSYTs7dUNBVWYsZ0JBQUEsR0FBa0IsU0FBQTtNQUNoQixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBcUIsU0FBQyxVQUFEO2VBQWdCLFVBQVUsQ0FBQyxPQUFYLENBQUE7TUFBaEIsQ0FBckI7YUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlO0lBRkM7O3VDQUlsQixnQkFBQSxHQUFrQixTQUFBO01BQ2hCLElBQUEsQ0FBYyxJQUFDLENBQUEsTUFBZjtBQUFBLGVBQUE7O01BRUEsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNWLElBQUMsQ0FBQSxPQUFELENBQUE7YUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQWYsQ0FBQTtJQUxnQjs7Ozs7O0VBT3BCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUk7QUFuRXJCIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnZXZlbnQta2l0J1xue3JlcXVpcmVQYWNrYWdlc30gPSByZXF1aXJlICdhdG9tLXV0aWxzJ1xuXG5jbGFzcyBNaW5pbWFwSGlnaGxpZ2h0U2VsZWN0ZWRcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgdW5sZXNzIGF0b20uaW5TcGVjTW9kZSgpXG4gICAgICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwgJ21pbmltYXAtaGlnaGxpZ2h0LXNlbGVjdGVkJywgdHJ1ZVxuXG4gIGNvbnN1bWVNaW5pbWFwU2VydmljZVYxOiAoQG1pbmltYXApIC0+XG4gICAgQG1pbmltYXAucmVnaXN0ZXJQbHVnaW4gJ2hpZ2hsaWdodC1zZWxlY3RlZCcsIHRoaXNcblxuICBjb25zdW1lSGlnaGxpZ2h0U2VsZWN0ZWRTZXJ2aWNlVjI6IChAaGlnaGxpZ2h0U2VsZWN0ZWQpIC0+XG4gICAgQGluaXQoKSBpZiBAbWluaW1hcD8gYW5kIEBhY3RpdmU/XG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAZGVhY3RpdmF0ZVBsdWdpbigpXG4gICAgQG1pbmltYXBQYWNrYWdlID0gbnVsbFxuICAgIEBoaWdobGlnaHRTZWxlY3RlZFBhY2thZ2UgPSBudWxsXG4gICAgQGhpZ2hsaWdodFNlbGVjdGVkID0gbnVsbFxuICAgIEBtaW5pbWFwID0gbnVsbFxuXG4gIGlzQWN0aXZlOiAtPiBAYWN0aXZlXG5cbiAgYWN0aXZhdGVQbHVnaW46IC0+XG4gICAgcmV0dXJuIGlmIEBhY3RpdmVcblxuICAgIEBzdWJzY3JpcHRpb25zLmFkZCBAbWluaW1hcC5vbkRpZEFjdGl2YXRlIEBpbml0XG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkIEBtaW5pbWFwLm9uRGlkRGVhY3RpdmF0ZSBAZGlzcG9zZVxuXG4gICAgQGFjdGl2ZSA9IHRydWVcblxuICAgIEBpbml0KCkgaWYgQGhpZ2hsaWdodFNlbGVjdGVkP1xuXG4gIGluaXQ6ID0+XG4gICAgQGRlY29yYXRpb25zID0gW11cbiAgICBAaGlnaGxpZ2h0U2VsZWN0ZWQub25EaWRBZGRNYXJrZXJGb3JFZGl0b3IgKG9wdGlvbnMpID0+IEBtYXJrZXJDcmVhdGVkKG9wdGlvbnMpXG4gICAgQGhpZ2hsaWdodFNlbGVjdGVkLm9uRGlkQWRkU2VsZWN0ZWRNYXJrZXJGb3JFZGl0b3IgKG9wdGlvbnMpID0+IEBtYXJrZXJDcmVhdGVkKG9wdGlvbnMsIHRydWUpXG4gICAgQGhpZ2hsaWdodFNlbGVjdGVkLm9uRGlkUmVtb3ZlQWxsTWFya2VycyA9PiBAbWFya2Vyc0Rlc3Ryb3llZCgpXG5cbiAgZGlzcG9zZTogPT5cbiAgICBAZGVjb3JhdGlvbnM/LmZvckVhY2ggKGRlY29yYXRpb24pIC0+IGRlY29yYXRpb24uZGVzdHJveSgpXG4gICAgQGRlY29yYXRpb25zID0gbnVsbFxuXG4gIG1hcmtlckNyZWF0ZWQ6IChvcHRpb25zLCBzZWxlY3RlZCA9IGZhbHNlKSA9PlxuICAgIG1pbmltYXAgPSBAbWluaW1hcC5taW5pbWFwRm9yRWRpdG9yKG9wdGlvbnMuZWRpdG9yKVxuICAgIHJldHVybiB1bmxlc3MgbWluaW1hcD9cbiAgICBjbGFzc05hbWUgID0gJ2hpZ2hsaWdodC1zZWxlY3RlZCdcbiAgICBjbGFzc05hbWUgKz0gJyBzZWxlY3RlZCcgaWYgc2VsZWN0ZWRcblxuICAgIGRlY29yYXRpb24gPSBtaW5pbWFwLmRlY29yYXRlTWFya2VyKG9wdGlvbnMubWFya2VyLFxuICAgICAge3R5cGU6ICdoaWdobGlnaHQnLCBjbGFzczogY2xhc3NOYW1lIH0pXG4gICAgQGRlY29yYXRpb25zLnB1c2ggZGVjb3JhdGlvblxuXG4gIG1hcmtlcnNEZXN0cm95ZWQ6ID0+XG4gICAgQGRlY29yYXRpb25zLmZvckVhY2ggKGRlY29yYXRpb24pIC0+IGRlY29yYXRpb24uZGVzdHJveSgpXG4gICAgQGRlY29yYXRpb25zID0gW11cblxuICBkZWFjdGl2YXRlUGx1Z2luOiAtPlxuICAgIHJldHVybiB1bmxlc3MgQGFjdGl2ZVxuXG4gICAgQGFjdGl2ZSA9IGZhbHNlXG4gICAgQGRpc3Bvc2UoKVxuICAgIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBNaW5pbWFwSGlnaGxpZ2h0U2VsZWN0ZWRcbiJdfQ==
