(function() {
  var BranchListView, repo;

  repo = require('../fixtures').repo;

  BranchListView = require('../../lib/views/branch-list-view');

  describe("BranchListView", function() {
    var onConfirm, view;
    onConfirm = jasmine.createSpy();
    view = new BranchListView("*branch1\nbranch2", onConfirm);
    it("displays a list of branches", function() {
      return expect(view.items.length).toBe(2);
    });
    return describe("when an item is selected", function() {
      return it("runs the provided function with the selected item", function() {
        view.confirmSelection();
        return expect(onConfirm).toHaveBeenCalledWith({
          name: 'branch1'
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvYnJhbmNoLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsT0FBUSxPQUFBLENBQVEsYUFBUjs7RUFDVCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxrQ0FBUjs7RUFFakIsUUFBQSxDQUFTLGdCQUFULEVBQTJCLFNBQUE7QUFDekIsUUFBQTtJQUFBLFNBQUEsR0FBWSxPQUFPLENBQUMsU0FBUixDQUFBO0lBQ1osSUFBQSxHQUFXLElBQUEsY0FBQSxDQUFlLG1CQUFmLEVBQW9DLFNBQXBDO0lBRVgsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUE7YUFDaEMsTUFBQSxDQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBbEIsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixDQUEvQjtJQURnQyxDQUFsQztXQUdBLFFBQUEsQ0FBUywwQkFBVCxFQUFxQyxTQUFBO2FBQ25DLEVBQUEsQ0FBRyxtREFBSCxFQUF3RCxTQUFBO1FBQ3RELElBQUksQ0FBQyxnQkFBTCxDQUFBO2VBQ0EsTUFBQSxDQUFPLFNBQVAsQ0FBaUIsQ0FBQyxvQkFBbEIsQ0FBdUM7VUFBQSxJQUFBLEVBQU0sU0FBTjtTQUF2QztNQUZzRCxDQUF4RDtJQURtQyxDQUFyQztFQVB5QixDQUEzQjtBQUhBIiwic291cmNlc0NvbnRlbnQiOlsie3JlcG99ID0gcmVxdWlyZSAnLi4vZml4dHVyZXMnXG5CcmFuY2hMaXN0VmlldyA9IHJlcXVpcmUgJy4uLy4uL2xpYi92aWV3cy9icmFuY2gtbGlzdC12aWV3J1xuXG5kZXNjcmliZSBcIkJyYW5jaExpc3RWaWV3XCIsIC0+XG4gIG9uQ29uZmlybSA9IGphc21pbmUuY3JlYXRlU3B5KClcbiAgdmlldyA9IG5ldyBCcmFuY2hMaXN0VmlldyhcIipicmFuY2gxXFxuYnJhbmNoMlwiLCBvbkNvbmZpcm0pXG5cbiAgaXQgXCJkaXNwbGF5cyBhIGxpc3Qgb2YgYnJhbmNoZXNcIiwgLT5cbiAgICBleHBlY3Qodmlldy5pdGVtcy5sZW5ndGgpLnRvQmUgMlxuXG4gIGRlc2NyaWJlIFwid2hlbiBhbiBpdGVtIGlzIHNlbGVjdGVkXCIsIC0+XG4gICAgaXQgXCJydW5zIHRoZSBwcm92aWRlZCBmdW5jdGlvbiB3aXRoIHRoZSBzZWxlY3RlZCBpdGVtXCIsIC0+XG4gICAgICB2aWV3LmNvbmZpcm1TZWxlY3Rpb24oKVxuICAgICAgZXhwZWN0KG9uQ29uZmlybSkudG9IYXZlQmVlbkNhbGxlZFdpdGggbmFtZTogJ2JyYW5jaDEnXG4iXX0=
