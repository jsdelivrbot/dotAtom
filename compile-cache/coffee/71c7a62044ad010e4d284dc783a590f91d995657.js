(function() {
  var $, Conflict, SideView, util;

  $ = require('space-pen').$;

  SideView = require('../../lib/view/side-view').SideView;

  Conflict = require('../../lib/conflict').Conflict;

  util = require('../util');

  describe('SideView', function() {
    var editorView, ours, ref, text, theirs, view;
    ref = [], view = ref[0], editorView = ref[1], ours = ref[2], theirs = ref[3];
    text = function() {
      return editorView.getModel().getText();
    };
    beforeEach(function() {
      return util.openPath("single-2way-diff.txt", function(v) {
        var conflict, editor, ref1;
        editor = v.getModel();
        editorView = v;
        conflict = Conflict.all({
          isRebase: false
        }, editor)[0];
        ref1 = [conflict.ours, conflict.theirs], ours = ref1[0], theirs = ref1[1];
        return view = new SideView(ours, editor);
      });
    });
    it('applies its position as a CSS class', function() {
      expect(view.hasClass('top')).toBe(true);
      return expect(view.hasClass('bottom')).toBe(false);
    });
    it('knows if its text is unaltered', function() {
      expect(ours.isDirty).toBe(false);
      return expect(theirs.isDirty).toBe(false);
    });
    describe('when its text has been edited', function() {
      var editor;
      editor = [][0];
      beforeEach(function() {
        editor = editorView.getModel();
        editor.setCursorBufferPosition([1, 0]);
        editor.insertText("I won't keep them, but ");
        return view.detectDirty();
      });
      it('detects that its text has been edited', function() {
        return expect(ours.isDirty).toBe(true);
      });
      it('adds a .dirty class to the view', function() {
        return expect(view.hasClass('dirty')).toBe(true);
      });
      return it('reverts its text back to the original on request', function() {
        var t;
        view.revert();
        view.detectDirty();
        t = editor.getTextInBufferRange(ours.marker.getBufferRange());
        expect(t).toBe("These are my changes\n");
        return expect(ours.isDirty).toBe(false);
      });
    });
    it('triggers conflict resolution', function() {
      spyOn(ours, "resolve");
      view.useMe();
      return expect(ours.resolve).toHaveBeenCalled();
    });
    describe('when chosen as the resolution', function() {
      beforeEach(function() {
        return ours.resolve();
      });
      return it('deletes the marker line', function() {
        return expect(text()).not.toContain("<<<<<<< HEAD");
      });
    });
    return describe('when not chosen as the resolution', function() {
      beforeEach(function() {
        return theirs.resolve();
      });
      it('deletes its lines', function() {
        return expect(text()).not.toContain("These are my changes");
      });
      return it('deletes the marker line', function() {
        return expect(text()).not.toContain("<<<<<<< HEAD");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9zcGVjL3ZpZXcvc2lkZS12aWV3LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxJQUFLLE9BQUEsQ0FBUSxXQUFSOztFQUNMLFdBQVksT0FBQSxDQUFRLDBCQUFSOztFQUVaLFdBQVksT0FBQSxDQUFRLG9CQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUjs7RUFFUCxRQUFBLENBQVMsVUFBVCxFQUFxQixTQUFBO0FBQ25CLFFBQUE7SUFBQSxNQUFtQyxFQUFuQyxFQUFDLGFBQUQsRUFBTyxtQkFBUCxFQUFtQixhQUFuQixFQUF5QjtJQUV6QixJQUFBLEdBQU8sU0FBQTthQUFHLFVBQVUsQ0FBQyxRQUFYLENBQUEsQ0FBcUIsQ0FBQyxPQUF0QixDQUFBO0lBQUg7SUFFUCxVQUFBLENBQVcsU0FBQTthQUNULElBQUksQ0FBQyxRQUFMLENBQWMsc0JBQWQsRUFBc0MsU0FBQyxDQUFEO0FBQ3BDLFlBQUE7UUFBQSxNQUFBLEdBQVMsQ0FBQyxDQUFDLFFBQUYsQ0FBQTtRQUNULFVBQUEsR0FBYTtRQUNiLFFBQUEsR0FBVyxRQUFRLENBQUMsR0FBVCxDQUFhO1VBQUUsUUFBQSxFQUFVLEtBQVo7U0FBYixFQUFrQyxNQUFsQyxDQUEwQyxDQUFBLENBQUE7UUFDckQsT0FBaUIsQ0FBQyxRQUFRLENBQUMsSUFBVixFQUFnQixRQUFRLENBQUMsTUFBekIsQ0FBakIsRUFBQyxjQUFELEVBQU87ZUFDUCxJQUFBLEdBQVcsSUFBQSxRQUFBLENBQVMsSUFBVCxFQUFlLE1BQWY7TUFMeUIsQ0FBdEM7SUFEUyxDQUFYO0lBUUEsRUFBQSxDQUFHLHFDQUFILEVBQTBDLFNBQUE7TUFDeEMsTUFBQSxDQUFPLElBQUksQ0FBQyxRQUFMLENBQWMsS0FBZCxDQUFQLENBQTJCLENBQUMsSUFBNUIsQ0FBaUMsSUFBakM7YUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxRQUFkLENBQVAsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxLQUFwQztJQUZ3QyxDQUExQztJQUlBLEVBQUEsQ0FBRyxnQ0FBSCxFQUFxQyxTQUFBO01BQ25DLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBWixDQUFvQixDQUFDLElBQXJCLENBQTBCLEtBQTFCO2FBQ0EsTUFBQSxDQUFPLE1BQU0sQ0FBQyxPQUFkLENBQXNCLENBQUMsSUFBdkIsQ0FBNEIsS0FBNUI7SUFGbUMsQ0FBckM7SUFJQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQTtBQUN4QyxVQUFBO01BQUMsU0FBVTtNQUVYLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsTUFBQSxHQUFTLFVBQVUsQ0FBQyxRQUFYLENBQUE7UUFDVCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUEvQjtRQUNBLE1BQU0sQ0FBQyxVQUFQLENBQWtCLHlCQUFsQjtlQUNBLElBQUksQ0FBQyxXQUFMLENBQUE7TUFKUyxDQUFYO01BTUEsRUFBQSxDQUFHLHVDQUFILEVBQTRDLFNBQUE7ZUFDMUMsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFaLENBQW9CLENBQUMsSUFBckIsQ0FBMEIsSUFBMUI7TUFEMEMsQ0FBNUM7TUFHQSxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQTtlQUNwQyxNQUFBLENBQU8sSUFBSSxDQUFDLFFBQUwsQ0FBYyxPQUFkLENBQVAsQ0FBNkIsQ0FBQyxJQUE5QixDQUFtQyxJQUFuQztNQURvQyxDQUF0QzthQUdBLEVBQUEsQ0FBRyxrREFBSCxFQUF1RCxTQUFBO0FBQ3JELFlBQUE7UUFBQSxJQUFJLENBQUMsTUFBTCxDQUFBO1FBQ0EsSUFBSSxDQUFDLFdBQUwsQ0FBQTtRQUNBLENBQUEsR0FBSSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFaLENBQUEsQ0FBNUI7UUFDSixNQUFBLENBQU8sQ0FBUCxDQUFTLENBQUMsSUFBVixDQUFlLHdCQUFmO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFaLENBQW9CLENBQUMsSUFBckIsQ0FBMEIsS0FBMUI7TUFMcUQsQ0FBdkQ7SUFmd0MsQ0FBMUM7SUFzQkEsRUFBQSxDQUFHLDhCQUFILEVBQW1DLFNBQUE7TUFDakMsS0FBQSxDQUFNLElBQU4sRUFBWSxTQUFaO01BQ0EsSUFBSSxDQUFDLEtBQUwsQ0FBQTthQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsT0FBWixDQUFvQixDQUFDLGdCQUFyQixDQUFBO0lBSGlDLENBQW5DO0lBS0EsUUFBQSxDQUFTLCtCQUFULEVBQTBDLFNBQUE7TUFFeEMsVUFBQSxDQUFXLFNBQUE7ZUFDVCxJQUFJLENBQUMsT0FBTCxDQUFBO01BRFMsQ0FBWDthQUdBLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBO2VBQzVCLE1BQUEsQ0FBTyxJQUFBLENBQUEsQ0FBUCxDQUFjLENBQUMsR0FBRyxDQUFDLFNBQW5CLENBQTZCLGNBQTdCO01BRDRCLENBQTlCO0lBTHdDLENBQTFDO1dBUUEsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUE7TUFFNUMsVUFBQSxDQUFXLFNBQUE7ZUFDVCxNQUFNLENBQUMsT0FBUCxDQUFBO01BRFMsQ0FBWDtNQUdBLEVBQUEsQ0FBRyxtQkFBSCxFQUF3QixTQUFBO2VBQ3RCLE1BQUEsQ0FBTyxJQUFBLENBQUEsQ0FBUCxDQUFjLENBQUMsR0FBRyxDQUFDLFNBQW5CLENBQTZCLHNCQUE3QjtNQURzQixDQUF4QjthQUdBLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBO2VBQzVCLE1BQUEsQ0FBTyxJQUFBLENBQUEsQ0FBUCxDQUFjLENBQUMsR0FBRyxDQUFDLFNBQW5CLENBQTZCLGNBQTdCO01BRDRCLENBQTlCO0lBUjRDLENBQTlDO0VBeERtQixDQUFyQjtBQU5BIiwic291cmNlc0NvbnRlbnQiOlsieyR9ID0gcmVxdWlyZSAnc3BhY2UtcGVuJ1xue1NpZGVWaWV3fSA9IHJlcXVpcmUgJy4uLy4uL2xpYi92aWV3L3NpZGUtdmlldydcblxue0NvbmZsaWN0fSA9IHJlcXVpcmUgJy4uLy4uL2xpYi9jb25mbGljdCdcbnV0aWwgPSByZXF1aXJlICcuLi91dGlsJ1xuXG5kZXNjcmliZSAnU2lkZVZpZXcnLCAtPlxuICBbdmlldywgZWRpdG9yVmlldywgb3VycywgdGhlaXJzXSA9IFtdXG5cbiAgdGV4dCA9IC0+IGVkaXRvclZpZXcuZ2V0TW9kZWwoKS5nZXRUZXh0KClcblxuICBiZWZvcmVFYWNoIC0+XG4gICAgdXRpbC5vcGVuUGF0aCBcInNpbmdsZS0yd2F5LWRpZmYudHh0XCIsICh2KSAtPlxuICAgICAgZWRpdG9yID0gdi5nZXRNb2RlbCgpXG4gICAgICBlZGl0b3JWaWV3ID0gdlxuICAgICAgY29uZmxpY3QgPSBDb25mbGljdC5hbGwoeyBpc1JlYmFzZTogZmFsc2UgfSwgZWRpdG9yKVswXVxuICAgICAgW291cnMsIHRoZWlyc10gPSBbY29uZmxpY3Qub3VycywgY29uZmxpY3QudGhlaXJzXVxuICAgICAgdmlldyA9IG5ldyBTaWRlVmlldyhvdXJzLCBlZGl0b3IpXG5cbiAgaXQgJ2FwcGxpZXMgaXRzIHBvc2l0aW9uIGFzIGEgQ1NTIGNsYXNzJywgLT5cbiAgICBleHBlY3Qodmlldy5oYXNDbGFzcyAndG9wJykudG9CZSh0cnVlKVxuICAgIGV4cGVjdCh2aWV3Lmhhc0NsYXNzICdib3R0b20nKS50b0JlKGZhbHNlKVxuXG4gIGl0ICdrbm93cyBpZiBpdHMgdGV4dCBpcyB1bmFsdGVyZWQnLCAtPlxuICAgIGV4cGVjdChvdXJzLmlzRGlydHkpLnRvQmUoZmFsc2UpXG4gICAgZXhwZWN0KHRoZWlycy5pc0RpcnR5KS50b0JlKGZhbHNlKVxuXG4gIGRlc2NyaWJlICd3aGVuIGl0cyB0ZXh0IGhhcyBiZWVuIGVkaXRlZCcsIC0+XG4gICAgW2VkaXRvcl0gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgZWRpdG9yID0gZWRpdG9yVmlldy5nZXRNb2RlbCgpXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gWzEsIDBdXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcIkkgd29uJ3Qga2VlcCB0aGVtLCBidXQgXCJcbiAgICAgIHZpZXcuZGV0ZWN0RGlydHkoKVxuXG4gICAgaXQgJ2RldGVjdHMgdGhhdCBpdHMgdGV4dCBoYXMgYmVlbiBlZGl0ZWQnLCAtPlxuICAgICAgZXhwZWN0KG91cnMuaXNEaXJ0eSkudG9CZSh0cnVlKVxuXG4gICAgaXQgJ2FkZHMgYSAuZGlydHkgY2xhc3MgdG8gdGhlIHZpZXcnLCAtPlxuICAgICAgZXhwZWN0KHZpZXcuaGFzQ2xhc3MgJ2RpcnR5JykudG9CZSh0cnVlKVxuXG4gICAgaXQgJ3JldmVydHMgaXRzIHRleHQgYmFjayB0byB0aGUgb3JpZ2luYWwgb24gcmVxdWVzdCcsIC0+XG4gICAgICB2aWV3LnJldmVydCgpXG4gICAgICB2aWV3LmRldGVjdERpcnR5KClcbiAgICAgIHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2Ugb3Vycy5tYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgZXhwZWN0KHQpLnRvQmUoXCJUaGVzZSBhcmUgbXkgY2hhbmdlc1xcblwiKVxuICAgICAgZXhwZWN0KG91cnMuaXNEaXJ0eSkudG9CZShmYWxzZSlcblxuICBpdCAndHJpZ2dlcnMgY29uZmxpY3QgcmVzb2x1dGlvbicsIC0+XG4gICAgc3B5T24ob3VycywgXCJyZXNvbHZlXCIpXG4gICAgdmlldy51c2VNZSgpXG4gICAgZXhwZWN0KG91cnMucmVzb2x2ZSkudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgZGVzY3JpYmUgJ3doZW4gY2hvc2VuIGFzIHRoZSByZXNvbHV0aW9uJywgLT5cblxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIG91cnMucmVzb2x2ZSgpXG5cbiAgICBpdCAnZGVsZXRlcyB0aGUgbWFya2VyIGxpbmUnLCAtPlxuICAgICAgZXhwZWN0KHRleHQoKSkubm90LnRvQ29udGFpbihcIjw8PDw8PDwgSEVBRFwiKVxuXG4gIGRlc2NyaWJlICd3aGVuIG5vdCBjaG9zZW4gYXMgdGhlIHJlc29sdXRpb24nLCAtPlxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgdGhlaXJzLnJlc29sdmUoKVxuXG4gICAgaXQgJ2RlbGV0ZXMgaXRzIGxpbmVzJywgLT5cbiAgICAgIGV4cGVjdCh0ZXh0KCkpLm5vdC50b0NvbnRhaW4oXCJUaGVzZSBhcmUgbXkgY2hhbmdlc1wiKVxuXG4gICAgaXQgJ2RlbGV0ZXMgdGhlIG1hcmtlciBsaW5lJywgLT5cbiAgICAgIGV4cGVjdCh0ZXh0KCkpLm5vdC50b0NvbnRhaW4oXCI8PDw8PDw8IEhFQURcIilcbiJdfQ==
