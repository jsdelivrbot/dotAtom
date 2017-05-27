(function() {
  var RemoveListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  RemoveListView = require('../../lib/views/remove-list-view');

  describe("RemoveListView", function() {
    return it("displays a list of files", function() {
      var view;
      view = new RemoveListView(repo, ['file1', 'file2']);
      return expect(view.items.length).toBe(2);
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvcmVtb3ZlLWJyYW5jaC1saXN0LXZpZXctc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUjs7RUFDTCxPQUFRLE9BQUEsQ0FBUSxhQUFSOztFQUNULGNBQUEsR0FBaUIsT0FBQSxDQUFRLGtDQUFSOztFQUVqQixRQUFBLENBQVMsZ0JBQVQsRUFBMkIsU0FBQTtXQUN6QixFQUFBLENBQUcsMEJBQUgsRUFBK0IsU0FBQTtBQUM3QixVQUFBO01BQUEsSUFBQSxHQUFXLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsQ0FBQyxPQUFELEVBQVUsT0FBVixDQUFyQjthQUNYLE1BQUEsQ0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQWxCLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsQ0FBL0I7SUFGNkIsQ0FBL0I7RUFEeUIsQ0FBM0I7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9naXQnXG57cmVwb30gPSByZXF1aXJlICcuLi9maXh0dXJlcydcblJlbW92ZUxpc3RWaWV3ID0gcmVxdWlyZSAnLi4vLi4vbGliL3ZpZXdzL3JlbW92ZS1saXN0LXZpZXcnXG5cbmRlc2NyaWJlIFwiUmVtb3ZlTGlzdFZpZXdcIiwgLT5cbiAgaXQgXCJkaXNwbGF5cyBhIGxpc3Qgb2YgZmlsZXNcIiwgLT5cbiAgICB2aWV3ID0gbmV3IFJlbW92ZUxpc3RWaWV3KHJlcG8sIFsnZmlsZTEnLCAnZmlsZTInXSlcbiAgICBleHBlY3Qodmlldy5pdGVtcy5sZW5ndGgpLnRvQmUgMlxuIl19
