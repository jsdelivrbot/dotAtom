(function() {
  var GitCheckoutNewBranch, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitCheckoutNewBranch = require('../../lib/models/git-checkout-new-branch');

  describe("GitCheckoutNewBranch", function() {
    var inputView;
    inputView = null;
    beforeEach(function() {
      spyOn(atom.workspace, 'addModalPanel').andCallThrough();
      spyOn(git, 'cmd').andReturn(Promise.resolve('new branch created'));
      return inputView = GitCheckoutNewBranch(repo);
    });
    it("displays a text input", function() {
      return expect(atom.workspace.addModalPanel).toHaveBeenCalled();
    });
    describe("when the input has no text and it is submitted", function() {
      return it("does nothing", function() {
        inputView.branchEditor.setText('');
        inputView.createBranch();
        return expect(git.cmd).not.toHaveBeenCalled();
      });
    });
    return describe("when the input has text and it is submitted", function() {
      return it("runs 'checkout -b' with the submitted name", function() {
        var branchName;
        branchName = 'neat/-branch';
        inputView.branchEditor.setText(branchName);
        inputView.createBranch();
        return expect(git.cmd).toHaveBeenCalledWith(['checkout', '-b', branchName], {
          cwd: repo.getWorkingDirectory()
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1jaGVja291dC1uZXctYnJhbmNoLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVI7O0VBQ0wsT0FBUSxPQUFBLENBQVEsYUFBUjs7RUFDVCxvQkFBQSxHQUF1QixPQUFBLENBQVEsMENBQVI7O0VBRXZCLFFBQUEsQ0FBUyxzQkFBVCxFQUFpQyxTQUFBO0FBQy9CLFFBQUE7SUFBQSxTQUFBLEdBQVk7SUFFWixVQUFBLENBQVcsU0FBQTtNQUNULEtBQUEsQ0FBTSxJQUFJLENBQUMsU0FBWCxFQUFzQixlQUF0QixDQUFzQyxDQUFDLGNBQXZDLENBQUE7TUFDQSxLQUFBLENBQU0sR0FBTixFQUFXLEtBQVgsQ0FBaUIsQ0FBQyxTQUFsQixDQUE0QixPQUFPLENBQUMsT0FBUixDQUFnQixvQkFBaEIsQ0FBNUI7YUFDQSxTQUFBLEdBQVksb0JBQUEsQ0FBcUIsSUFBckI7SUFISCxDQUFYO0lBS0EsRUFBQSxDQUFHLHVCQUFILEVBQTRCLFNBQUE7YUFDMUIsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBdEIsQ0FBb0MsQ0FBQyxnQkFBckMsQ0FBQTtJQUQwQixDQUE1QjtJQUdBLFFBQUEsQ0FBUyxnREFBVCxFQUEyRCxTQUFBO2FBQ3pELEVBQUEsQ0FBRyxjQUFILEVBQW1CLFNBQUE7UUFDakIsU0FBUyxDQUFDLFlBQVksQ0FBQyxPQUF2QixDQUErQixFQUEvQjtRQUNBLFNBQVMsQ0FBQyxZQUFWLENBQUE7ZUFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLEdBQVgsQ0FBZSxDQUFDLEdBQUcsQ0FBQyxnQkFBcEIsQ0FBQTtNQUhpQixDQUFuQjtJQUR5RCxDQUEzRDtXQU1BLFFBQUEsQ0FBUyw2Q0FBVCxFQUF3RCxTQUFBO2FBQ3RELEVBQUEsQ0FBRyw0Q0FBSCxFQUFpRCxTQUFBO0FBQy9DLFlBQUE7UUFBQSxVQUFBLEdBQWE7UUFDYixTQUFTLENBQUMsWUFBWSxDQUFDLE9BQXZCLENBQStCLFVBQS9CO1FBQ0EsU0FBUyxDQUFDLFlBQVYsQ0FBQTtlQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsVUFBbkIsQ0FBckMsRUFBcUU7VUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUFyRTtNQUorQyxDQUFqRDtJQURzRCxDQUF4RDtFQWpCK0IsQ0FBakM7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUoJy4uLy4uL2xpYi9naXQnKVxue3JlcG99ID0gcmVxdWlyZSgnLi4vZml4dHVyZXMnKVxuR2l0Q2hlY2tvdXROZXdCcmFuY2ggPSByZXF1aXJlKCcuLi8uLi9saWIvbW9kZWxzL2dpdC1jaGVja291dC1uZXctYnJhbmNoJylcblxuZGVzY3JpYmUgXCJHaXRDaGVja291dE5ld0JyYW5jaFwiLCAtPlxuICBpbnB1dFZpZXcgPSBudWxsXG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHNweU9uKGF0b20ud29ya3NwYWNlLCAnYWRkTW9kYWxQYW5lbCcpLmFuZENhbGxUaHJvdWdoKClcbiAgICBzcHlPbihnaXQsICdjbWQnKS5hbmRSZXR1cm4oUHJvbWlzZS5yZXNvbHZlKCduZXcgYnJhbmNoIGNyZWF0ZWQnKSlcbiAgICBpbnB1dFZpZXcgPSBHaXRDaGVja291dE5ld0JyYW5jaChyZXBvKVxuXG4gIGl0IFwiZGlzcGxheXMgYSB0ZXh0IGlucHV0XCIsIC0+XG4gICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgaW5wdXQgaGFzIG5vIHRleHQgYW5kIGl0IGlzIHN1Ym1pdHRlZFwiLCAtPlxuICAgIGl0IFwiZG9lcyBub3RoaW5nXCIsIC0+XG4gICAgICBpbnB1dFZpZXcuYnJhbmNoRWRpdG9yLnNldFRleHQgJydcbiAgICAgIGlucHV0Vmlldy5jcmVhdGVCcmFuY2goKVxuICAgICAgZXhwZWN0KGdpdC5jbWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIGlucHV0IGhhcyB0ZXh0IGFuZCBpdCBpcyBzdWJtaXR0ZWRcIiwgLT5cbiAgICBpdCBcInJ1bnMgJ2NoZWNrb3V0IC1iJyB3aXRoIHRoZSBzdWJtaXR0ZWQgbmFtZVwiLCAtPlxuICAgICAgYnJhbmNoTmFtZSA9ICduZWF0Ly1icmFuY2gnXG4gICAgICBpbnB1dFZpZXcuYnJhbmNoRWRpdG9yLnNldFRleHQgYnJhbmNoTmFtZVxuICAgICAgaW5wdXRWaWV3LmNyZWF0ZUJyYW5jaCgpXG4gICAgICBleHBlY3QoZ2l0LmNtZCkudG9IYXZlQmVlbkNhbGxlZFdpdGggWydjaGVja291dCcsICctYicsIGJyYW5jaE5hbWVdLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4iXX0=
