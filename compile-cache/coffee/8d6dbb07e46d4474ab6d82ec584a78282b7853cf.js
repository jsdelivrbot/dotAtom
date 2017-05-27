(function() {
  var GitTags, git, repo;

  repo = require('../fixtures').repo;

  git = require('../../lib/git');

  GitTags = require('../../lib/models/git-tags');

  describe("GitTags", function() {
    return it("calls git.cmd with 'tag' as an arg", function() {
      spyOn(git, 'cmd').andReturn(Promise.resolve('data'));
      GitTags(repo);
      return expect(git.cmd).toHaveBeenCalledWith(['tag', '-ln'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC10YWdzLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxPQUFRLE9BQUEsQ0FBUSxhQUFSOztFQUNULEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUjs7RUFDTixPQUFBLEdBQVUsT0FBQSxDQUFRLDJCQUFSOztFQUVWLFFBQUEsQ0FBUyxTQUFULEVBQW9CLFNBQUE7V0FDbEIsRUFBQSxDQUFHLG9DQUFILEVBQXlDLFNBQUE7TUFDdkMsS0FBQSxDQUFNLEdBQU4sRUFBVyxLQUFYLENBQWlCLENBQUMsU0FBbEIsQ0FBNEIsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsTUFBaEIsQ0FBNUI7TUFDQSxPQUFBLENBQVEsSUFBUjthQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBckMsRUFBcUQ7UUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUFyRDtJQUh1QyxDQUF6QztFQURrQixDQUFwQjtBQUpBIiwic291cmNlc0NvbnRlbnQiOlsie3JlcG99ID0gcmVxdWlyZSAnLi4vZml4dHVyZXMnXG5naXQgPSByZXF1aXJlICcuLi8uLi9saWIvZ2l0J1xuR2l0VGFncyA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvZ2l0LXRhZ3MnXG5cbmRlc2NyaWJlIFwiR2l0VGFnc1wiLCAtPlxuICBpdCBcImNhbGxzIGdpdC5jbWQgd2l0aCAndGFnJyBhcyBhbiBhcmdcIiwgLT5cbiAgICBzcHlPbihnaXQsICdjbWQnKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlICdkYXRhJ1xuICAgIEdpdFRhZ3MocmVwbylcbiAgICBleHBlY3QoZ2l0LmNtZCkudG9IYXZlQmVlbkNhbGxlZFdpdGggWyd0YWcnLCAnLWxuJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiJdfQ==
