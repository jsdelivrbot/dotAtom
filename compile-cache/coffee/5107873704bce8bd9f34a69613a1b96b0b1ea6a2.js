(function() {
  var GitPull, _pull, git, notifier, options, repo;

  git = require('../../lib/git');

  notifier = require('../../lib/notifier');

  repo = require('../fixtures').repo;

  GitPull = require('../../lib/models/git-pull');

  _pull = require('../../lib/models/_pull');

  options = {
    cwd: repo.getWorkingDirectory()
  };

  describe("Git Pull", function() {
    beforeEach(function() {
      return spyOn(git, 'cmd').andReturn(Promise.resolve(true));
    });
    describe("when 'promptForBranch' is disabled", function() {
      return it("calls git.cmd with ['pull'] and the upstream branch path", function() {
        GitPull(repo);
        return expect(git.cmd).toHaveBeenCalledWith(['pull', 'origin', 'foo'], options, {
          color: true
        });
      });
    });
    describe("when 'promptForBranch' is enabled", function() {
      return it("calls git.cmd with ['remote']", function() {
        atom.config.set('git-plus.remoteInteractions.promptForBranch', true);
        GitPull(repo);
        return expect(git.cmd).toHaveBeenCalledWith(['remote'], options);
      });
    });
    return describe("The pull function", function() {
      it("calls git.cmd", function() {
        _pull(repo);
        return expect(git.cmd).toHaveBeenCalledWith(['pull', 'origin', 'foo'], options, {
          color: true
        });
      });
      it("calls git.cmd with extra arguments if passed", function() {
        _pull(repo, {
          extraArgs: ['--rebase']
        });
        return expect(git.cmd).toHaveBeenCalledWith(['pull', '--rebase', 'origin', 'foo'], options, {
          color: true
        });
      });
      it("understands branch names with a '/'", function() {
        spyOn(repo, 'getUpstreamBranch').andReturn('refs/remotes/origin/foo/cool-feature');
        _pull(repo);
        return expect(git.cmd).toHaveBeenCalledWith(['pull', 'origin', 'foo/cool-feature'], options, {
          color: true
        });
      });
      return describe("when there is no upstream branch", function() {
        return it("shows a message", function() {
          spyOn(repo, 'getUpstreamBranch').andReturn(void 0);
          spyOn(notifier, 'addInfo');
          _pull(repo);
          expect(git.cmd).not.toHaveBeenCalled();
          return expect(notifier.addInfo).toHaveBeenCalled();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1wdWxsLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLGVBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxvQkFBUjs7RUFDVixPQUFRLE9BQUEsQ0FBUSxhQUFSOztFQUNULE9BQUEsR0FBVSxPQUFBLENBQVEsMkJBQVI7O0VBQ1YsS0FBQSxHQUFRLE9BQUEsQ0FBUSx3QkFBUjs7RUFFUixPQUFBLEdBQ0U7SUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDs7O0VBRUYsUUFBQSxDQUFTLFVBQVQsRUFBcUIsU0FBQTtJQUNuQixVQUFBLENBQVcsU0FBQTthQUFHLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFNBQWxCLENBQTRCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLElBQWhCLENBQTVCO0lBQUgsQ0FBWDtJQUVBLFFBQUEsQ0FBUyxvQ0FBVCxFQUErQyxTQUFBO2FBQzdDLEVBQUEsQ0FBRywwREFBSCxFQUErRCxTQUFBO1FBQzdELE9BQUEsQ0FBUSxJQUFSO2VBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxNQUFELEVBQVMsUUFBVCxFQUFtQixLQUFuQixDQUFyQyxFQUFnRSxPQUFoRSxFQUF5RTtVQUFDLEtBQUEsRUFBTyxJQUFSO1NBQXpFO01BRjZELENBQS9EO0lBRDZDLENBQS9DO0lBS0EsUUFBQSxDQUFTLG1DQUFULEVBQThDLFNBQUE7YUFDNUMsRUFBQSxDQUFHLCtCQUFILEVBQW9DLFNBQUE7UUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZDQUFoQixFQUErRCxJQUEvRDtRQUNBLE9BQUEsQ0FBUSxJQUFSO2VBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsQ0FBQyxRQUFELENBQXJDLEVBQWlELE9BQWpEO01BSGtDLENBQXBDO0lBRDRDLENBQTlDO1dBTUEsUUFBQSxDQUFTLG1CQUFULEVBQThCLFNBQUE7TUFDNUIsRUFBQSxDQUFHLGVBQUgsRUFBb0IsU0FBQTtRQUNsQixLQUFBLENBQU0sSUFBTjtlQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsS0FBbkIsQ0FBckMsRUFBZ0UsT0FBaEUsRUFBeUU7VUFBQyxLQUFBLEVBQU8sSUFBUjtTQUF6RTtNQUZrQixDQUFwQjtNQUlBLEVBQUEsQ0FBRyw4Q0FBSCxFQUFtRCxTQUFBO1FBQ2pELEtBQUEsQ0FBTSxJQUFOLEVBQVk7VUFBQSxTQUFBLEVBQVcsQ0FBQyxVQUFELENBQVg7U0FBWjtlQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsTUFBRCxFQUFTLFVBQVQsRUFBcUIsUUFBckIsRUFBK0IsS0FBL0IsQ0FBckMsRUFBNEUsT0FBNUUsRUFBcUY7VUFBQyxLQUFBLEVBQU8sSUFBUjtTQUFyRjtNQUZpRCxDQUFuRDtNQUlBLEVBQUEsQ0FBRyxxQ0FBSCxFQUEwQyxTQUFBO1FBQ3hDLEtBQUEsQ0FBTSxJQUFOLEVBQVksbUJBQVosQ0FBZ0MsQ0FBQyxTQUFqQyxDQUEyQyxzQ0FBM0M7UUFDQSxLQUFBLENBQU0sSUFBTjtlQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsa0JBQW5CLENBQXJDLEVBQTZFLE9BQTdFLEVBQXNGO1VBQUMsS0FBQSxFQUFPLElBQVI7U0FBdEY7TUFId0MsQ0FBMUM7YUFLQSxRQUFBLENBQVMsa0NBQVQsRUFBNkMsU0FBQTtlQUMzQyxFQUFBLENBQUcsaUJBQUgsRUFBc0IsU0FBQTtVQUNwQixLQUFBLENBQU0sSUFBTixFQUFZLG1CQUFaLENBQWdDLENBQUMsU0FBakMsQ0FBMkMsTUFBM0M7VUFDQSxLQUFBLENBQU0sUUFBTixFQUFnQixTQUFoQjtVQUNBLEtBQUEsQ0FBTSxJQUFOO1VBQ0EsTUFBQSxDQUFPLEdBQUcsQ0FBQyxHQUFYLENBQWUsQ0FBQyxHQUFHLENBQUMsZ0JBQXBCLENBQUE7aUJBQ0EsTUFBQSxDQUFPLFFBQVEsQ0FBQyxPQUFoQixDQUF3QixDQUFDLGdCQUF6QixDQUFBO1FBTG9CLENBQXRCO01BRDJDLENBQTdDO0lBZDRCLENBQTlCO0VBZG1CLENBQXJCO0FBVEEiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi8uLi9saWIvZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi8uLi9saWIvbm90aWZpZXInXG57cmVwb30gPSByZXF1aXJlICcuLi9maXh0dXJlcydcbkdpdFB1bGwgPSByZXF1aXJlICcuLi8uLi9saWIvbW9kZWxzL2dpdC1wdWxsJ1xuX3B1bGwgPSByZXF1aXJlICcuLi8uLi9saWIvbW9kZWxzL19wdWxsJ1xuXG5vcHRpb25zID1cbiAgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuXG5kZXNjcmliZSBcIkdpdCBQdWxsXCIsIC0+XG4gIGJlZm9yZUVhY2ggLT4gc3B5T24oZ2l0LCAnY21kJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSB0cnVlXG5cbiAgZGVzY3JpYmUgXCJ3aGVuICdwcm9tcHRGb3JCcmFuY2gnIGlzIGRpc2FibGVkXCIsIC0+XG4gICAgaXQgXCJjYWxscyBnaXQuY21kIHdpdGggWydwdWxsJ10gYW5kIHRoZSB1cHN0cmVhbSBicmFuY2ggcGF0aFwiLCAtPlxuICAgICAgR2l0UHVsbChyZXBvKVxuICAgICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsncHVsbCcsICdvcmlnaW4nLCAnZm9vJ10sIG9wdGlvbnMsIHtjb2xvcjogdHJ1ZX1cblxuICBkZXNjcmliZSBcIndoZW4gJ3Byb21wdEZvckJyYW5jaCcgaXMgZW5hYmxlZFwiLCAtPlxuICAgIGl0IFwiY2FsbHMgZ2l0LmNtZCB3aXRoIFsncmVtb3RlJ11cIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCgnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnByb21wdEZvckJyYW5jaCcsIHRydWUpXG4gICAgICBHaXRQdWxsKHJlcG8pXG4gICAgICBleHBlY3QoZ2l0LmNtZCkudG9IYXZlQmVlbkNhbGxlZFdpdGggWydyZW1vdGUnXSwgb3B0aW9uc1xuXG4gIGRlc2NyaWJlIFwiVGhlIHB1bGwgZnVuY3Rpb25cIiwgLT5cbiAgICBpdCBcImNhbGxzIGdpdC5jbWRcIiwgLT5cbiAgICAgIF9wdWxsIHJlcG9cbiAgICAgIGV4cGVjdChnaXQuY21kKS50b0hhdmVCZWVuQ2FsbGVkV2l0aCBbJ3B1bGwnLCAnb3JpZ2luJywgJ2ZvbyddLCBvcHRpb25zLCB7Y29sb3I6IHRydWV9XG5cbiAgICBpdCBcImNhbGxzIGdpdC5jbWQgd2l0aCBleHRyYSBhcmd1bWVudHMgaWYgcGFzc2VkXCIsIC0+XG4gICAgICBfcHVsbCByZXBvLCBleHRyYUFyZ3M6IFsnLS1yZWJhc2UnXVxuICAgICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsncHVsbCcsICctLXJlYmFzZScsICdvcmlnaW4nLCAnZm9vJ10sIG9wdGlvbnMsIHtjb2xvcjogdHJ1ZX1cblxuICAgIGl0IFwidW5kZXJzdGFuZHMgYnJhbmNoIG5hbWVzIHdpdGggYSAnLydcIiwgLT5cbiAgICAgIHNweU9uKHJlcG8sICdnZXRVcHN0cmVhbUJyYW5jaCcpLmFuZFJldHVybiAncmVmcy9yZW1vdGVzL29yaWdpbi9mb28vY29vbC1mZWF0dXJlJ1xuICAgICAgX3B1bGwgcmVwb1xuICAgICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsncHVsbCcsICdvcmlnaW4nLCAnZm9vL2Nvb2wtZmVhdHVyZSddLCBvcHRpb25zLCB7Y29sb3I6IHRydWV9XG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGhlcmUgaXMgbm8gdXBzdHJlYW0gYnJhbmNoXCIsIC0+XG4gICAgICBpdCBcInNob3dzIGEgbWVzc2FnZVwiLCAtPlxuICAgICAgICBzcHlPbihyZXBvLCAnZ2V0VXBzdHJlYW1CcmFuY2gnKS5hbmRSZXR1cm4gdW5kZWZpbmVkXG4gICAgICAgIHNweU9uKG5vdGlmaWVyLCAnYWRkSW5mbycpXG4gICAgICAgIF9wdWxsIHJlcG9cbiAgICAgICAgZXhwZWN0KGdpdC5jbWQpLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgICAgZXhwZWN0KG5vdGlmaWVyLmFkZEluZm8pLnRvSGF2ZUJlZW5DYWxsZWQoKVxuIl19
