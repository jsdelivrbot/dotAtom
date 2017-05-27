(function() {
  var GitOpenChangedFiles, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  GitOpenChangedFiles = require('../../lib/models/git-open-changed-files');

  describe("GitOpenChangedFiles", function() {
    beforeEach(function() {
      return spyOn(atom.workspace, 'open');
    });
    describe("when file is modified", function() {
      beforeEach(function() {
        spyOn(git, 'status').andReturn(Promise.resolve([' M file1.txt']));
        return waitsForPromise(function() {
          return GitOpenChangedFiles(repo);
        });
      });
      return it("opens changed file", function() {
        return expect(atom.workspace.open).toHaveBeenCalledWith("file1.txt");
      });
    });
    describe("when file is added", function() {
      beforeEach(function() {
        spyOn(git, 'status').andReturn(Promise.resolve(['?? file2.txt']));
        return waitsForPromise(function() {
          return GitOpenChangedFiles(repo);
        });
      });
      return it("opens added file", function() {
        return expect(atom.workspace.open).toHaveBeenCalledWith("file2.txt");
      });
    });
    return describe("when file is renamed", function() {
      beforeEach(function() {
        spyOn(git, 'status').andReturn(Promise.resolve(['R  file3.txt']));
        return waitsForPromise(function() {
          return GitOpenChangedFiles(repo);
        });
      });
      return it("opens renamed file", function() {
        return expect(atom.workspace.open).toHaveBeenCalledWith("file3.txt");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1vcGVuLWNoYW5nZWQtZmlsZXMtc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsZUFBUjs7RUFDTCxPQUFRLE9BQUEsQ0FBUSxhQUFSOztFQUNULG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx5Q0FBUjs7RUFFdEIsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUE7SUFDOUIsVUFBQSxDQUFXLFNBQUE7YUFDVCxLQUFBLENBQU0sSUFBSSxDQUFDLFNBQVgsRUFBc0IsTUFBdEI7SUFEUyxDQUFYO0lBR0EsUUFBQSxDQUFTLHVCQUFULEVBQWtDLFNBQUE7TUFDaEMsVUFBQSxDQUFXLFNBQUE7UUFDVCxLQUFBLENBQU0sR0FBTixFQUFXLFFBQVgsQ0FBb0IsQ0FBQyxTQUFyQixDQUErQixPQUFPLENBQUMsT0FBUixDQUFnQixDQUFDLGNBQUQsQ0FBaEIsQ0FBL0I7ZUFDQSxlQUFBLENBQWdCLFNBQUE7aUJBQUcsbUJBQUEsQ0FBb0IsSUFBcEI7UUFBSCxDQUFoQjtNQUZTLENBQVg7YUFJQSxFQUFBLENBQUcsb0JBQUgsRUFBeUIsU0FBQTtlQUN2QixNQUFBLENBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUF0QixDQUEyQixDQUFDLG9CQUE1QixDQUFpRCxXQUFqRDtNQUR1QixDQUF6QjtJQUxnQyxDQUFsQztJQVFBLFFBQUEsQ0FBUyxvQkFBVCxFQUErQixTQUFBO01BQzdCLFVBQUEsQ0FBVyxTQUFBO1FBQ1QsS0FBQSxDQUFNLEdBQU4sRUFBVyxRQUFYLENBQW9CLENBQUMsU0FBckIsQ0FBK0IsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsQ0FBQyxjQUFELENBQWhCLENBQS9CO2VBQ0EsZUFBQSxDQUFnQixTQUFBO2lCQUFHLG1CQUFBLENBQW9CLElBQXBCO1FBQUgsQ0FBaEI7TUFGUyxDQUFYO2FBSUEsRUFBQSxDQUFHLGtCQUFILEVBQXVCLFNBQUE7ZUFDckIsTUFBQSxDQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBdEIsQ0FBMkIsQ0FBQyxvQkFBNUIsQ0FBaUQsV0FBakQ7TUFEcUIsQ0FBdkI7SUFMNkIsQ0FBL0I7V0FRQSxRQUFBLENBQVMsc0JBQVQsRUFBaUMsU0FBQTtNQUMvQixVQUFBLENBQVcsU0FBQTtRQUNULEtBQUEsQ0FBTSxHQUFOLEVBQVcsUUFBWCxDQUFvQixDQUFDLFNBQXJCLENBQStCLE9BQU8sQ0FBQyxPQUFSLENBQWdCLENBQUMsY0FBRCxDQUFoQixDQUEvQjtlQUNBLGVBQUEsQ0FBZ0IsU0FBQTtpQkFBRyxtQkFBQSxDQUFvQixJQUFwQjtRQUFILENBQWhCO01BRlMsQ0FBWDthQUlBLEVBQUEsQ0FBRyxvQkFBSCxFQUF5QixTQUFBO2VBQ3ZCLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQXRCLENBQTJCLENBQUMsb0JBQTVCLENBQWlELFdBQWpEO01BRHVCLENBQXpCO0lBTCtCLENBQWpDO0VBcEI4QixDQUFoQztBQUpBIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vLi4vbGliL2dpdCdcbntyZXBvfSA9IHJlcXVpcmUgJy4uL2ZpeHR1cmVzJ1xuR2l0T3BlbkNoYW5nZWRGaWxlcyA9IHJlcXVpcmUgJy4uLy4uL2xpYi9tb2RlbHMvZ2l0LW9wZW4tY2hhbmdlZC1maWxlcydcblxuZGVzY3JpYmUgXCJHaXRPcGVuQ2hhbmdlZEZpbGVzXCIsIC0+XG4gIGJlZm9yZUVhY2ggLT5cbiAgICBzcHlPbihhdG9tLndvcmtzcGFjZSwgJ29wZW4nKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBmaWxlIGlzIG1vZGlmaWVkXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgc3B5T24oZ2l0LCAnc3RhdHVzJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSBbJyBNIGZpbGUxLnR4dCddXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0T3BlbkNoYW5nZWRGaWxlcyhyZXBvKVxuXG4gICAgaXQgXCJvcGVucyBjaGFuZ2VkIGZpbGVcIiwgLT5cbiAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcImZpbGUxLnR4dFwiKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBmaWxlIGlzIGFkZGVkXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgc3B5T24oZ2l0LCAnc3RhdHVzJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSBbJz8/IGZpbGUyLnR4dCddXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0T3BlbkNoYW5nZWRGaWxlcyhyZXBvKVxuXG4gICAgaXQgXCJvcGVucyBhZGRlZCBmaWxlXCIsIC0+XG4gICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2Uub3BlbikudG9IYXZlQmVlbkNhbGxlZFdpdGgoXCJmaWxlMi50eHRcIilcblxuICBkZXNjcmliZSBcIndoZW4gZmlsZSBpcyByZW5hbWVkXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgc3B5T24oZ2l0LCAnc3RhdHVzJykuYW5kUmV0dXJuIFByb21pc2UucmVzb2x2ZSBbJ1IgIGZpbGUzLnR4dCddXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gR2l0T3BlbkNoYW5nZWRGaWxlcyhyZXBvKVxuXG4gICAgaXQgXCJvcGVucyByZW5hbWVkIGZpbGVcIiwgLT5cbiAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5vcGVuKS50b0hhdmVCZWVuQ2FsbGVkV2l0aChcImZpbGUzLnR4dFwiKVxuIl19
