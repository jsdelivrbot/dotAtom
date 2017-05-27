(function() {
  var TagListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  TagListView = require('../../lib/views/tag-list-view');

  describe("TagListView", function() {
    describe("when there are two tags", function() {
      return it("displays a list of tags", function() {
        var view;
        view = new TagListView(repo, "tag1\ntag2");
        return expect(view.items.length).toBe(2);
      });
    });
    return describe("when there are no tags", function() {
      return it("displays a message to 'Add Tag'", function() {
        var view;
        view = new TagListView(repo);
        expect(view.items.length).toBe(1);
        return expect(view.items[0].tag).toBe('+ Add Tag');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvdGFnLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSOztFQUNMLE9BQVEsT0FBQSxDQUFRLGFBQVI7O0VBQ1QsV0FBQSxHQUFjLE9BQUEsQ0FBUSwrQkFBUjs7RUFFZCxRQUFBLENBQVMsYUFBVCxFQUF3QixTQUFBO0lBQ3RCLFFBQUEsQ0FBUyx5QkFBVCxFQUFvQyxTQUFBO2FBQ2xDLEVBQUEsQ0FBRyx5QkFBSCxFQUE4QixTQUFBO0FBQzVCLFlBQUE7UUFBQSxJQUFBLEdBQVcsSUFBQSxXQUFBLENBQVksSUFBWixFQUFrQixZQUFsQjtlQUNYLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQWxCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsQ0FBL0I7TUFGNEIsQ0FBOUI7SUFEa0MsQ0FBcEM7V0FLQSxRQUFBLENBQVMsd0JBQVQsRUFBbUMsU0FBQTthQUNqQyxFQUFBLENBQUcsaUNBQUgsRUFBc0MsU0FBQTtBQUNwQyxZQUFBO1FBQUEsSUFBQSxHQUFXLElBQUEsV0FBQSxDQUFZLElBQVo7UUFDWCxNQUFBLENBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFsQixDQUF5QixDQUFDLElBQTFCLENBQStCLENBQS9CO2VBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFFLENBQUMsR0FBckIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixXQUEvQjtNQUhvQyxDQUF0QztJQURpQyxDQUFuQztFQU5zQixDQUF4QjtBQUpBIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vLi4vbGliL2dpdCdcbntyZXBvfSA9IHJlcXVpcmUgJy4uL2ZpeHR1cmVzJ1xuVGFnTGlzdFZpZXcgPSByZXF1aXJlICcuLi8uLi9saWIvdmlld3MvdGFnLWxpc3QtdmlldydcblxuZGVzY3JpYmUgXCJUYWdMaXN0Vmlld1wiLCAtPlxuICBkZXNjcmliZSBcIndoZW4gdGhlcmUgYXJlIHR3byB0YWdzXCIsIC0+XG4gICAgaXQgXCJkaXNwbGF5cyBhIGxpc3Qgb2YgdGFnc1wiLCAtPlxuICAgICAgdmlldyA9IG5ldyBUYWdMaXN0VmlldyhyZXBvLCBcInRhZzFcXG50YWcyXCIpXG4gICAgICBleHBlY3Qodmlldy5pdGVtcy5sZW5ndGgpLnRvQmUgMlxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGVyZSBhcmUgbm8gdGFnc1wiLCAtPlxuICAgIGl0IFwiZGlzcGxheXMgYSBtZXNzYWdlIHRvICdBZGQgVGFnJ1wiLCAtPlxuICAgICAgdmlldyA9IG5ldyBUYWdMaXN0VmlldyhyZXBvKVxuICAgICAgZXhwZWN0KHZpZXcuaXRlbXMubGVuZ3RoKS50b0JlIDFcbiAgICAgIGV4cGVjdCh2aWV3Lml0ZW1zWzBdLnRhZykudG9CZSAnKyBBZGQgVGFnJ1xuIl19
