(function() {
  var GitCherryPick, repo;

  repo = require('../fixtures').repo;

  GitCherryPick = require('../../lib/models/git-cherry-pick');

  describe("GitCherryPick", function() {
    it("gets heads from the repo's references", function() {
      spyOn(repo, 'getReferences').andCallThrough();
      GitCherryPick(repo);
      return expect(repo.getReferences).toHaveBeenCalled();
    });
    return it("calls replace on each head with to remove 'refs/heads/'", function() {
      var head;
      head = repo.getReferences().heads[0];
      GitCherryPick(repo);
      return expect(head.replace).toHaveBeenCalledWith('refs/heads/', '');
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2dpdC1wbHVzL3NwZWMvbW9kZWxzL2dpdC1jaGVycnktcGljay1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsT0FBUSxPQUFBLENBQVEsYUFBUjs7RUFDVCxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxrQ0FBUjs7RUFFaEIsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQTtJQUN4QixFQUFBLENBQUcsdUNBQUgsRUFBNEMsU0FBQTtNQUMxQyxLQUFBLENBQU0sSUFBTixFQUFZLGVBQVosQ0FBNEIsQ0FBQyxjQUE3QixDQUFBO01BQ0EsYUFBQSxDQUFjLElBQWQ7YUFDQSxNQUFBLENBQU8sSUFBSSxDQUFDLGFBQVosQ0FBMEIsQ0FBQyxnQkFBM0IsQ0FBQTtJQUgwQyxDQUE1QztXQUtBLEVBQUEsQ0FBRyx5REFBSCxFQUE4RCxTQUFBO0FBQzVELFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLGFBQUwsQ0FBQSxDQUFvQixDQUFDLEtBQU0sQ0FBQSxDQUFBO01BQ2xDLGFBQUEsQ0FBYyxJQUFkO2FBQ0EsTUFBQSxDQUFPLElBQUksQ0FBQyxPQUFaLENBQW9CLENBQUMsb0JBQXJCLENBQTBDLGFBQTFDLEVBQXlELEVBQXpEO0lBSDRELENBQTlEO0VBTndCLENBQTFCO0FBSEEiLCJzb3VyY2VzQ29udGVudCI6WyJ7cmVwb30gPSByZXF1aXJlICcuLi9maXh0dXJlcydcbkdpdENoZXJyeVBpY2sgPSByZXF1aXJlICcuLi8uLi9saWIvbW9kZWxzL2dpdC1jaGVycnktcGljaydcblxuZGVzY3JpYmUgXCJHaXRDaGVycnlQaWNrXCIsIC0+XG4gIGl0IFwiZ2V0cyBoZWFkcyBmcm9tIHRoZSByZXBvJ3MgcmVmZXJlbmNlc1wiLCAtPlxuICAgIHNweU9uKHJlcG8sICdnZXRSZWZlcmVuY2VzJykuYW5kQ2FsbFRocm91Z2goKVxuICAgIEdpdENoZXJyeVBpY2sgcmVwb1xuICAgIGV4cGVjdChyZXBvLmdldFJlZmVyZW5jZXMpLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGl0IFwiY2FsbHMgcmVwbGFjZSBvbiBlYWNoIGhlYWQgd2l0aCB0byByZW1vdmUgJ3JlZnMvaGVhZHMvJ1wiLCAtPlxuICAgIGhlYWQgPSByZXBvLmdldFJlZmVyZW5jZXMoKS5oZWFkc1swXVxuICAgIEdpdENoZXJyeVBpY2sgcmVwb1xuICAgIGV4cGVjdChoZWFkLnJlcGxhY2UpLnRvSGF2ZUJlZW5DYWxsZWRXaXRoICdyZWZzL2hlYWRzLycsICcnXG4iXX0=
