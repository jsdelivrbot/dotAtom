(function() {
  var RemoteBranchListView;

  RemoteBranchListView = require('../../lib/views/remote-branch-list-view');

  describe("RemoteBranchListView", function() {
    var onConfirm, view;
    onConfirm = jasmine.createSpy();
    view = new RemoteBranchListView("remote/branch1\nremote/branch2\norigin/branch3", "remote", onConfirm);
    it("only shows branches from the selected remote", function() {
      return expect(view.items.length).toBe(2);
    });
    return describe("when an item is selected", function() {
      return it("calls the provided callback with the selected item", function() {
        view.confirmSelection();
        return expect(onConfirm).toHaveBeenCalledWith({
          name: 'remote/branch1'
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvcmVtb3RlLWJyYW5jaC1saXN0LXZpZXctc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSx5Q0FBUjs7RUFFdkIsUUFBQSxDQUFTLHNCQUFULEVBQWlDLFNBQUE7QUFDL0IsUUFBQTtJQUFBLFNBQUEsR0FBWSxPQUFPLENBQUMsU0FBUixDQUFBO0lBQ1osSUFBQSxHQUFXLElBQUEsb0JBQUEsQ0FBcUIsZ0RBQXJCLEVBQXVFLFFBQXZFLEVBQWlGLFNBQWpGO0lBRVgsRUFBQSxDQUFHLDhDQUFILEVBQW1ELFNBQUE7YUFDakQsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixDQUEvQjtJQURpRCxDQUFuRDtXQUdBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBO2FBQ25DLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBO1FBQ3ZELElBQUksQ0FBQyxnQkFBTCxDQUFBO2VBQ0EsTUFBQSxDQUFPLFNBQVAsQ0FBaUIsQ0FBQyxvQkFBbEIsQ0FBdUM7VUFBQSxJQUFBLEVBQU0sZ0JBQU47U0FBdkM7TUFGdUQsQ0FBekQ7SUFEbUMsQ0FBckM7RUFQK0IsQ0FBakM7QUFGQSIsInNvdXJjZXNDb250ZW50IjpbIlJlbW90ZUJyYW5jaExpc3RWaWV3ID0gcmVxdWlyZSAnLi4vLi4vbGliL3ZpZXdzL3JlbW90ZS1icmFuY2gtbGlzdC12aWV3J1xuXG5kZXNjcmliZSBcIlJlbW90ZUJyYW5jaExpc3RWaWV3XCIsIC0+XG4gIG9uQ29uZmlybSA9IGphc21pbmUuY3JlYXRlU3B5KClcbiAgdmlldyA9IG5ldyBSZW1vdGVCcmFuY2hMaXN0VmlldyhcInJlbW90ZS9icmFuY2gxXFxucmVtb3RlL2JyYW5jaDJcXG5vcmlnaW4vYnJhbmNoM1wiLCBcInJlbW90ZVwiLCBvbkNvbmZpcm0pXG5cbiAgaXQgXCJvbmx5IHNob3dzIGJyYW5jaGVzIGZyb20gdGhlIHNlbGVjdGVkIHJlbW90ZVwiLCAtPlxuICAgIGV4cGVjdCh2aWV3Lml0ZW1zLmxlbmd0aCkudG9CZSAyXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGFuIGl0ZW0gaXMgc2VsZWN0ZWRcIiwgLT5cbiAgICBpdCBcImNhbGxzIHRoZSBwcm92aWRlZCBjYWxsYmFjayB3aXRoIHRoZSBzZWxlY3RlZCBpdGVtXCIsIC0+XG4gICAgICB2aWV3LmNvbmZpcm1TZWxlY3Rpb24oKVxuICAgICAgZXhwZWN0KG9uQ29uZmlybSkudG9IYXZlQmVlbkNhbGxlZFdpdGggbmFtZTogJ3JlbW90ZS9icmFuY2gxJ1xuIl19
