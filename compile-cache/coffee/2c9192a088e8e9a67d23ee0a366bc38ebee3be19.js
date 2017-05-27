(function() {
  var RebaseListView, git, repo;

  git = require('../../lib/git');

  repo = require('../fixtures').repo;

  RebaseListView = require('../../lib/views/rebase-list-view');

  describe("RebaseListView", function() {
    beforeEach(function() {
      this.view = new RebaseListView(repo, "branch1\nbranch2");
      return spyOn(git, 'cmd').andCallFake(function() {
        return Promise.reject('blah');
      });
    });
    it("displays a list of branches", function() {
      return expect(this.view.items.length).toBe(2);
    });
    return it("rebases onto the selected branch", function() {
      this.view.confirmSelection();
      this.view.rebase('branch1');
      return expect(git.cmd).toHaveBeenCalledWith(['rebase', 'branch1'], {
        cwd: repo.getWorkingDirectory()
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvdmlld3MvcmViYXNlLWxpc3Qtdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxlQUFSOztFQUNMLE9BQVEsT0FBQSxDQUFRLGFBQVI7O0VBQ1QsY0FBQSxHQUFpQixPQUFBLENBQVEsa0NBQVI7O0VBRWpCLFFBQUEsQ0FBUyxnQkFBVCxFQUEyQixTQUFBO0lBQ3pCLFVBQUEsQ0FBVyxTQUFBO01BQ1QsSUFBQyxDQUFBLElBQUQsR0FBWSxJQUFBLGNBQUEsQ0FBZSxJQUFmLEVBQXFCLGtCQUFyQjthQUNaLEtBQUEsQ0FBTSxHQUFOLEVBQVcsS0FBWCxDQUFpQixDQUFDLFdBQWxCLENBQThCLFNBQUE7ZUFDNUIsT0FBTyxDQUFDLE1BQVIsQ0FBZSxNQUFmO01BRDRCLENBQTlCO0lBRlMsQ0FBWDtJQUtBLEVBQUEsQ0FBRyw2QkFBSCxFQUFrQyxTQUFBO2FBQ2hDLE1BQUEsQ0FBTyxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFuQixDQUEwQixDQUFDLElBQTNCLENBQWdDLENBQWhDO0lBRGdDLENBQWxDO1dBR0EsRUFBQSxDQUFHLGtDQUFILEVBQXVDLFNBQUE7TUFDckMsSUFBQyxDQUFBLElBQUksQ0FBQyxnQkFBTixDQUFBO01BQ0EsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsU0FBYjthQUNBLE1BQUEsQ0FBTyxHQUFHLENBQUMsR0FBWCxDQUFlLENBQUMsb0JBQWhCLENBQXFDLENBQUMsUUFBRCxFQUFXLFNBQVgsQ0FBckMsRUFBNEQ7UUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtPQUE1RDtJQUhxQyxDQUF2QztFQVR5QixDQUEzQjtBQUpBIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vLi4vbGliL2dpdCdcbntyZXBvfSA9IHJlcXVpcmUgJy4uL2ZpeHR1cmVzJ1xuUmViYXNlTGlzdFZpZXcgPSByZXF1aXJlICcuLi8uLi9saWIvdmlld3MvcmViYXNlLWxpc3QtdmlldydcblxuZGVzY3JpYmUgXCJSZWJhc2VMaXN0Vmlld1wiLCAtPlxuICBiZWZvcmVFYWNoIC0+XG4gICAgQHZpZXcgPSBuZXcgUmViYXNlTGlzdFZpZXcocmVwbywgXCJicmFuY2gxXFxuYnJhbmNoMlwiKVxuICAgIHNweU9uKGdpdCwgJ2NtZCcpLmFuZENhbGxGYWtlIC0+XG4gICAgICBQcm9taXNlLnJlamVjdCAnYmxhaCdcblxuICBpdCBcImRpc3BsYXlzIGEgbGlzdCBvZiBicmFuY2hlc1wiLCAtPlxuICAgIGV4cGVjdChAdmlldy5pdGVtcy5sZW5ndGgpLnRvQmUgMlxuXG4gIGl0IFwicmViYXNlcyBvbnRvIHRoZSBzZWxlY3RlZCBicmFuY2hcIiwgLT5cbiAgICBAdmlldy5jb25maXJtU2VsZWN0aW9uKClcbiAgICBAdmlldy5yZWJhc2UgJ2JyYW5jaDEnXG4gICAgZXhwZWN0KGdpdC5jbWQpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoIFsncmViYXNlJywgJ2JyYW5jaDEnXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuIl19
