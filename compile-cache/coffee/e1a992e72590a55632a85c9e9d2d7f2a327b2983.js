(function() {
  var GitStageFiles, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitStageFiles = require('../../lib/models/git-stage-files');

  describe("GitStageFiles", function() {
    return it("calls git.unstagedFiles to get files to stage", function() {
      spyOn(git, 'unstagedFiles').andReturn(Promise.resolve('unstagedFile.txt'));
      GitStageFiles(repo);
      return expect(git.unstagedFiles).toHaveBeenCalled();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1zdGFnZS1maWxlcy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSOztFQUNMLE9BQVEsT0FBQSxDQUFRLGFBQVI7O0VBQ1QsYUFBQSxHQUFnQixPQUFBLENBQVEsa0NBQVI7O0VBRWhCLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUE7V0FDeEIsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUE7TUFDbEQsS0FBQSxDQUFNLEdBQU4sRUFBVyxlQUFYLENBQTJCLENBQUMsU0FBNUIsQ0FBc0MsT0FBTyxDQUFDLE9BQVIsQ0FBZ0Isa0JBQWhCLENBQXRDO01BQ0EsYUFBQSxDQUFjLElBQWQ7YUFDQSxNQUFBLENBQU8sR0FBRyxDQUFDLGFBQVgsQ0FBeUIsQ0FBQyxnQkFBMUIsQ0FBQTtJQUhrRCxDQUFwRDtFQUR3QixDQUExQjtBQUpBIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vLi4vbGliL2dpdCdcbntyZXBvfSA9IHJlcXVpcmUgJy4uL2ZpeHR1cmVzJ1xuR2l0U3RhZ2VGaWxlcyA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvZ2l0LXN0YWdlLWZpbGVzJ1xuXG5kZXNjcmliZSBcIkdpdFN0YWdlRmlsZXNcIiwgLT5cbiAgaXQgXCJjYWxscyBnaXQudW5zdGFnZWRGaWxlcyB0byBnZXQgZmlsZXMgdG8gc3RhZ2VcIiwgLT5cbiAgICBzcHlPbihnaXQsICd1bnN0YWdlZEZpbGVzJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSAndW5zdGFnZWRGaWxlLnR4dCdcbiAgICBHaXRTdGFnZUZpbGVzIHJlcG9cbiAgICBleHBlY3QoZ2l0LnVuc3RhZ2VkRmlsZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuIl19
