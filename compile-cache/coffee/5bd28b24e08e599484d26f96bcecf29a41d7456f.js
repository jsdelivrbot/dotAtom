(function() {
  var CherryPickSelectBranch, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  CherryPickSelectBranch = require('../../lib/views/cherry-pick-select-branch-view');

  describe("CherryPickSelectBranch view", function() {
    beforeEach(function() {
      return this.view = new CherryPickSelectBranch(repo, ['head1', 'head2'], 'currentHead');
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("calls git.cmd to get commits between currentHead and selected head", function() {
      var expectedArgs;
      spyOn(git, 'cmd').andReturn(Promise.resolve('heads'));
      this.view.confirmSelection();
      expectedArgs = ['log', '--cherry-pick', '-z', '--format=%H%n%an%n%ar%n%s', "currentHead...head1"];
      return expect(git.cmd).toHaveBeenCalledWith(expectedArgs, {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvY2hlcnJ5LXBpY2stc2VsZWN0LWJyYW5jaC12aWV3LXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVI7O0VBQ0wsT0FBUSxPQUFBLENBQVEsYUFBUjs7RUFDVCxzQkFBQSxHQUF5QixPQUFBLENBQVEsZ0RBQVI7O0VBRXpCLFFBQUEsQ0FBUyw2QkFBVCxFQUF3QyxTQUFBO0lBQ3RDLFVBQUEsQ0FBVyxTQUFBO2FBQ1QsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLHNCQUFBLENBQXVCLElBQXZCLEVBQTZCLENBQUMsT0FBRCxFQUFVLE9BQVYsQ0FBN0IsRUFBaUQsYUFBakQ7SUFESCxDQUFYO0lBR0EsRUFBQSxDQUFHLDZCQUFILEVBQWtDLFNBQUE7YUFDaEMsTUFBQSxDQUFPLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEM7SUFEZ0MsQ0FBbEM7V0FHQSxFQUFBLENBQUcsb0VBQUgsRUFBeUUsU0FBQTtBQUN2RSxVQUFBO01BQUEsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsT0FBaEIsQ0FBNUI7TUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLGdCQUFOLENBQUE7TUFDQSxZQUFBLEdBQWUsQ0FDYixLQURhLEVBRWIsZUFGYSxFQUdiLElBSGEsRUFJYiwyQkFKYSxFQUtiLHFCQUxhO2FBT2YsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsWUFBckMsRUFBbUQ7UUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUFuRDtJQVZ1RSxDQUF6RTtFQVBzQyxDQUF4QztBQUpBIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vLi4vbGliL2dpdCdcbntyZXBvfSA9IHJlcXVpcmUgJy4uL2ZpeHR1cmVzJ1xuQ2hlcnJ5UGlja1NlbGVjdEJyYW5jaCA9IHJlcXVpcmUgJy4uLy4uL2xpYi92aWV3cy9jaGVycnktcGljay1zZWxlY3QtYnJhbmNoLXZpZXcnXG5cbmRlc2NyaWJlIFwiQ2hlcnJ5UGlja1NlbGVjdEJyYW5jaCB2aWV3XCIsIC0+XG4gIGJlZm9yZUVhY2ggLT5cbiAgICBAdmlldyA9IG5ldyBDaGVycnlQaWNrU2VsZWN0QnJhbmNoKHJlcG8sIFsnaGVhZDEnLCAnaGVhZDInXSwgJ2N1cnJlbnRIZWFkJylcblxuICBpdCBcImRpc3BsYXlzIGEgbGlzdCBvZiBicmFuY2hlc1wiLCAtPlxuICAgIGV4cGVjdChAdmlldy5pdGVtcy5sZW5ndGgpLnRvQmUgMlxuXG4gIGl0IFwiY2FsbHMgZ2l0LmNtZCB0byBnZXQgY29tbWl0cyBiZXR3ZWVuIGN1cnJlbnRIZWFkIGFuZCBzZWxlY3RlZCBoZWFkXCIsIC0+XG4gICAgc3B5T24oZ2l0LCAnY21kJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSAnaGVhZHMnXG4gICAgQHZpZXcuY29uZmlybVNlbGVjdGlvbigpXG4gICAgZXhwZWN0ZWRBcmdzID0gW1xuICAgICAgJ2xvZydcbiAgICAgICctLWNoZXJyeS1waWNrJ1xuICAgICAgJy16J1xuICAgICAgJy0tZm9ybWF0PSVIJW4lYW4lbiVhciVuJXMnXG4gICAgICBcImN1cnJlbnRIZWFkLi4uaGVhZDFcIlxuICAgIF1cbiAgICBleHBlY3QoZ2l0LmNtZCkudG9IYXZlQmVlbkNhbGxlZFdpdGggZXhwZWN0ZWRBcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4iXX0=
