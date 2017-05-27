(function() {
  var GitFetchAll, git, repo;

  git = require('../../lib/git');

  GitFetchAll = require('../../lib/models/git-fetch-all');

  repo = require('../fixtures').repo;

  describe("GitFetchAll", function() {
    beforeEach(function() {
      return spyOn(git, 'cmd').andReturn(Promise.resolve());
    });
    it("runs `git fetch --all` for each repo passed to it", function() {
      var repo2, repos;
      repo2 = Object.create(repo);
      repo2.getWorkingDirectory = function() {
        return 'repo2';
      };
      repos = [repo, repo2];
      GitFetchAll(repos);
      return repos.forEach(function(r) {
        return expect(git.cmd).toHaveBeenCalledWith(['fetch', '--all'], {
          cwd: r.getWorkingDirectory()
        });
      });
    });
    return it('shows a notification if the configuration to show notifications is true', function() {
      var addSuccess;
      spyOn(atom.config, 'get').andReturn(true);
      addSuccess = spyOn(atom.notifications, 'addSuccess');
      return GitFetchAll([repo])[0].then(function() {
        return expect(addSuccess).toHaveBeenCalled();
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1mZXRjaC1hbGwtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUjs7RUFDTixXQUFBLEdBQWMsT0FBQSxDQUFRLGdDQUFSOztFQUNiLE9BQVEsT0FBQSxDQUFRLGFBQVI7O0VBRVQsUUFBQSxDQUFTLGFBQVQsRUFBd0IsU0FBQTtJQUN0QixVQUFBLENBQVcsU0FBQTthQUNULEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBNUI7SUFEUyxDQUFYO0lBR0EsRUFBQSxDQUFHLG1EQUFILEVBQXdELFNBQUE7QUFDdEQsVUFBQTtNQUFBLEtBQUEsR0FBUSxNQUFNLENBQUMsTUFBUCxDQUFjLElBQWQ7TUFDUixLQUFLLENBQUMsbUJBQU4sR0FBNEIsU0FBQTtlQUFHO01BQUg7TUFDNUIsS0FBQSxHQUFRLENBQUMsSUFBRCxFQUFPLEtBQVA7TUFDUixXQUFBLENBQVksS0FBWjthQUNBLEtBQUssQ0FBQyxPQUFOLENBQWMsU0FBQyxDQUFEO2VBQ1osTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxPQUFELEVBQVUsT0FBVixDQUFyQyxFQUF5RDtVQUFBLEdBQUEsRUFBSyxDQUFDLENBQUMsbUJBQUYsQ0FBQSxDQUFMO1NBQXpEO01BRFksQ0FBZDtJQUxzRCxDQUF4RDtXQVFBLEVBQUEsQ0FBRyx5RUFBSCxFQUE4RSxTQUFBO0FBQzVFLFVBQUE7TUFBQSxLQUFBLENBQU0sSUFBSSxDQUFDLE1BQVgsRUFBbUIsS0FBbkIsQ0FBeUIsQ0FBQyxTQUExQixDQUFvQyxJQUFwQztNQUNBLFVBQUEsR0FBYSxLQUFBLENBQU0sSUFBSSxDQUFDLGFBQVgsRUFBMEIsWUFBMUI7YUFDYixXQUFBLENBQVksQ0FBQyxJQUFELENBQVosQ0FBb0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxJQUF2QixDQUE0QixTQUFBO2VBQzFCLE1BQUEsQ0FBTyxVQUFQLENBQWtCLENBQUMsZ0JBQW5CLENBQUE7TUFEMEIsQ0FBNUI7SUFINEUsQ0FBOUU7RUFac0IsQ0FBeEI7QUFKQSIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9naXQnXG5HaXRGZXRjaEFsbCA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvZ2l0LWZldGNoLWFsbCdcbntyZXBvfSA9IHJlcXVpcmUgJy4uL2ZpeHR1cmVzJ1xuXG5kZXNjcmliZSBcIkdpdEZldGNoQWxsXCIsIC0+XG4gIGJlZm9yZUVhY2ggLT5cbiAgICBzcHlPbihnaXQsICdjbWQnKS5hbmRSZXR1cm4gUHJvbWlzZS5yZXNvbHZlKClcblxuICBpdCBcInJ1bnMgYGdpdCBmZXRjaCAtLWFsbGAgZm9yIGVhY2ggcmVwbyBwYXNzZWQgdG8gaXRcIiwgLT5cbiAgICByZXBvMiA9IE9iamVjdC5jcmVhdGUocmVwbylcbiAgICByZXBvMi5nZXRXb3JraW5nRGlyZWN0b3J5ID0gLT4gJ3JlcG8yJ1xuICAgIHJlcG9zID0gW3JlcG8sIHJlcG8yXVxuICAgIEdpdEZldGNoQWxsKHJlcG9zKVxuICAgIHJlcG9zLmZvckVhY2ggKHIpIC0+XG4gICAgICBleHBlY3QoZ2l0LmNtZCkudG9IYXZlQmVlbkNhbGxlZFdpdGggWydmZXRjaCcsICctLWFsbCddLCBjd2Q6IHIuZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG5cbiAgaXQgJ3Nob3dzIGEgbm90aWZpY2F0aW9uIGlmIHRoZSBjb25maWd1cmF0aW9uIHRvIHNob3cgbm90aWZpY2F0aW9ucyBpcyB0cnVlJywgLT5cbiAgICBzcHlPbihhdG9tLmNvbmZpZywgJ2dldCcpLmFuZFJldHVybiB0cnVlXG4gICAgYWRkU3VjY2VzcyA9IHNweU9uKGF0b20ubm90aWZpY2F0aW9ucywgJ2FkZFN1Y2Nlc3MnKVxuICAgIEdpdEZldGNoQWxsKFtyZXBvXSlbMF0udGhlbiAtPlxuICAgICAgZXhwZWN0KGFkZFN1Y2Nlc3MpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuIl19
