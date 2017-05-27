(function() {
  var Conflict, NavigationView, util;

  NavigationView = require('../../lib/view/navigation-view').NavigationView;

  Conflict = require('../../lib/conflict').Conflict;

  util = require('../util');

  describe('NavigationView', function() {
    var conflict, conflicts, editor, editorView, ref, view;
    ref = [], view = ref[0], editorView = ref[1], editor = ref[2], conflicts = ref[3], conflict = ref[4];
    beforeEach(function() {
      return util.openPath("triple-2way-diff.txt", function(v) {
        editorView = v;
        editor = editorView.getModel();
        conflicts = Conflict.all({}, editor);
        conflict = conflicts[1];
        return view = new NavigationView(conflict.navigator, editor);
      });
    });
    it('deletes the separator line on resolution', function() {
      var c, i, len, text;
      for (i = 0, len = conflicts.length; i < len; i++) {
        c = conflicts[i];
        c.ours.resolve();
      }
      text = editor.getText();
      return expect(text).not.toContain("My middle changes\n=======\nYour middle changes");
    });
    it('scrolls to the next diff', function() {
      var p;
      spyOn(editor, "setCursorBufferPosition");
      view.down();
      p = conflicts[2].ours.marker.getTailBufferPosition();
      return expect(editor.setCursorBufferPosition).toHaveBeenCalledWith(p);
    });
    return it('scrolls to the previous diff', function() {
      var p;
      spyOn(editor, "setCursorBufferPosition");
      view.up();
      p = conflicts[0].ours.marker.getTailBufferPosition();
      return expect(editor.setCursorBufferPosition).toHaveBeenCalledWith(p);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9zcGVjL3ZpZXcvbmF2aWdhdGlvbi12aWV3LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxpQkFBa0IsT0FBQSxDQUFRLGdDQUFSOztFQUVsQixXQUFZLE9BQUEsQ0FBUSxvQkFBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVI7O0VBRVAsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUE7QUFDekIsUUFBQTtJQUFBLE1BQWtELEVBQWxELEVBQUMsYUFBRCxFQUFPLG1CQUFQLEVBQW1CLGVBQW5CLEVBQTJCLGtCQUEzQixFQUFzQztJQUV0QyxVQUFBLENBQVcsU0FBQTthQUNULElBQUksQ0FBQyxRQUFMLENBQWMsc0JBQWQsRUFBc0MsU0FBQyxDQUFEO1FBQ3BDLFVBQUEsR0FBYTtRQUNiLE1BQUEsR0FBUyxVQUFVLENBQUMsUUFBWCxDQUFBO1FBQ1QsU0FBQSxHQUFZLFFBQVEsQ0FBQyxHQUFULENBQWEsRUFBYixFQUFpQixNQUFqQjtRQUNaLFFBQUEsR0FBVyxTQUFVLENBQUEsQ0FBQTtlQUVyQixJQUFBLEdBQVcsSUFBQSxjQUFBLENBQWUsUUFBUSxDQUFDLFNBQXhCLEVBQW1DLE1BQW5DO01BTnlCLENBQXRDO0lBRFMsQ0FBWDtJQVNBLEVBQUEsQ0FBRywwQ0FBSCxFQUErQyxTQUFBO0FBQzdDLFVBQUE7QUFBQSxXQUFBLDJDQUFBOztRQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBUCxDQUFBO0FBQUE7TUFDQSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQTthQUNQLE1BQUEsQ0FBTyxJQUFQLENBQVksQ0FBQyxHQUFHLENBQUMsU0FBakIsQ0FBMkIsaURBQTNCO0lBSDZDLENBQS9DO0lBS0EsRUFBQSxDQUFHLDBCQUFILEVBQStCLFNBQUE7QUFDN0IsVUFBQTtNQUFBLEtBQUEsQ0FBTSxNQUFOLEVBQWMseUJBQWQ7TUFDQSxJQUFJLENBQUMsSUFBTCxDQUFBO01BQ0EsQ0FBQSxHQUFJLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUF6QixDQUFBO2FBQ0osTUFBQSxDQUFPLE1BQU0sQ0FBQyx1QkFBZCxDQUFzQyxDQUFDLG9CQUF2QyxDQUE0RCxDQUE1RDtJQUo2QixDQUEvQjtXQU1BLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO0FBQ2pDLFVBQUE7TUFBQSxLQUFBLENBQU0sTUFBTixFQUFjLHlCQUFkO01BQ0EsSUFBSSxDQUFDLEVBQUwsQ0FBQTtNQUNBLENBQUEsR0FBSSxTQUFVLENBQUEsQ0FBQSxDQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBekIsQ0FBQTthQUNKLE1BQUEsQ0FBTyxNQUFNLENBQUMsdUJBQWQsQ0FBc0MsQ0FBQyxvQkFBdkMsQ0FBNEQsQ0FBNUQ7SUFKaUMsQ0FBbkM7RUF2QnlCLENBQTNCO0FBTEEiLCJzb3VyY2VzQ29udGVudCI6WyJ7TmF2aWdhdGlvblZpZXd9ID0gcmVxdWlyZSAnLi4vLi4vbGliL3ZpZXcvbmF2aWdhdGlvbi12aWV3J1xuXG57Q29uZmxpY3R9ID0gcmVxdWlyZSAnLi4vLi4vbGliL2NvbmZsaWN0J1xudXRpbCA9IHJlcXVpcmUgJy4uL3V0aWwnXG5cbmRlc2NyaWJlICdOYXZpZ2F0aW9uVmlldycsIC0+XG4gIFt2aWV3LCBlZGl0b3JWaWV3LCBlZGl0b3IsIGNvbmZsaWN0cywgY29uZmxpY3RdID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgdXRpbC5vcGVuUGF0aCBcInRyaXBsZS0yd2F5LWRpZmYudHh0XCIsICh2KSAtPlxuICAgICAgZWRpdG9yVmlldyA9IHZcbiAgICAgIGVkaXRvciA9IGVkaXRvclZpZXcuZ2V0TW9kZWwoKVxuICAgICAgY29uZmxpY3RzID0gQ29uZmxpY3QuYWxsKHt9LCBlZGl0b3IpXG4gICAgICBjb25mbGljdCA9IGNvbmZsaWN0c1sxXVxuXG4gICAgICB2aWV3ID0gbmV3IE5hdmlnYXRpb25WaWV3KGNvbmZsaWN0Lm5hdmlnYXRvciwgZWRpdG9yKVxuXG4gIGl0ICdkZWxldGVzIHRoZSBzZXBhcmF0b3IgbGluZSBvbiByZXNvbHV0aW9uJywgLT5cbiAgICBjLm91cnMucmVzb2x2ZSgpIGZvciBjIGluIGNvbmZsaWN0c1xuICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgZXhwZWN0KHRleHQpLm5vdC50b0NvbnRhaW4oXCJNeSBtaWRkbGUgY2hhbmdlc1xcbj09PT09PT1cXG5Zb3VyIG1pZGRsZSBjaGFuZ2VzXCIpXG5cbiAgaXQgJ3Njcm9sbHMgdG8gdGhlIG5leHQgZGlmZicsIC0+XG4gICAgc3B5T24oZWRpdG9yLCBcInNldEN1cnNvckJ1ZmZlclBvc2l0aW9uXCIpXG4gICAgdmlldy5kb3duKClcbiAgICBwID0gY29uZmxpY3RzWzJdLm91cnMubWFya2VyLmdldFRhaWxCdWZmZXJQb3NpdGlvbigpXG4gICAgZXhwZWN0KGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbikudG9IYXZlQmVlbkNhbGxlZFdpdGgocClcblxuICBpdCAnc2Nyb2xscyB0byB0aGUgcHJldmlvdXMgZGlmZicsIC0+XG4gICAgc3B5T24oZWRpdG9yLCBcInNldEN1cnNvckJ1ZmZlclBvc2l0aW9uXCIpXG4gICAgdmlldy51cCgpXG4gICAgcCA9IGNvbmZsaWN0c1swXS5vdXJzLm1hcmtlci5nZXRUYWlsQnVmZmVyUG9zaXRpb24oKVxuICAgIGV4cGVjdChlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24pLnRvSGF2ZUJlZW5DYWxsZWRXaXRoKHApXG4iXX0=
