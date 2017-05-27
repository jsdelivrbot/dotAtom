(function() {
  var GitOps, ResolverView, util;

  ResolverView = require('../../lib/view/resolver-view').ResolverView;

  GitOps = require('../../lib/git').GitOps;

  util = require('../util');

  describe('ResolverView', function() {
    var fakeEditor, pkg, ref, state, view;
    ref = [], view = ref[0], fakeEditor = ref[1], pkg = ref[2];
    state = {
      context: {
        isResolvedFile: function() {
          return Promise.resolve(false);
        },
        resolveFile: function() {},
        resolveText: "Stage"
      },
      relativize: function(filepath) {
        return filepath.slice("/fake/gitroot/".length);
      }
    };
    beforeEach(function() {
      pkg = util.pkgEmitter();
      fakeEditor = {
        isModified: function() {
          return true;
        },
        getURI: function() {
          return '/fake/gitroot/lib/file1.txt';
        },
        save: function() {},
        onDidSave: function() {}
      };
      return view = new ResolverView(fakeEditor, state, pkg);
    });
    it('begins needing both saving and staging', function() {
      waitsForPromise(function() {
        return view.refresh();
      });
      return runs(function() {
        return expect(view.actionText.text()).toBe('Save and stage');
      });
    });
    it('shows if the file only needs staged', function() {
      fakeEditor.isModified = function() {
        return false;
      };
      waitsForPromise(function() {
        return view.refresh();
      });
      return runs(function() {
        return expect(view.actionText.text()).toBe('Stage');
      });
    });
    return it('saves and stages the file', function() {
      var p;
      p = null;
      state.context.resolveFile = function(filepath) {
        p = filepath;
        return Promise.resolve();
      };
      spyOn(fakeEditor, 'save');
      waitsForPromise(function() {
        return view.resolve();
      });
      return runs(function() {
        expect(fakeEditor.save).toHaveBeenCalled();
        return expect(p).toBe('lib/file1.txt');
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9zcGVjL3ZpZXcvcmVzb2x2ZXItdmlldy1zcGVjLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsZUFBZ0IsT0FBQSxDQUFRLDhCQUFSOztFQUVoQixTQUFVLE9BQUEsQ0FBUSxlQUFSOztFQUNYLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUjs7RUFFUCxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBO0FBQ3ZCLFFBQUE7SUFBQSxNQUEwQixFQUExQixFQUFDLGFBQUQsRUFBTyxtQkFBUCxFQUFtQjtJQUVuQixLQUFBLEdBQ0U7TUFBQSxPQUFBLEVBQ0U7UUFBQSxjQUFBLEVBQWdCLFNBQUE7aUJBQUcsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsS0FBaEI7UUFBSCxDQUFoQjtRQUNBLFdBQUEsRUFBYSxTQUFBLEdBQUEsQ0FEYjtRQUVBLFdBQUEsRUFBYSxPQUZiO09BREY7TUFJQSxVQUFBLEVBQVksU0FBQyxRQUFEO2VBQWMsUUFBUztNQUF2QixDQUpaOztJQU1GLFVBQUEsQ0FBVyxTQUFBO01BQ1QsR0FBQSxHQUFNLElBQUksQ0FBQyxVQUFMLENBQUE7TUFDTixVQUFBLEdBQWE7UUFDWCxVQUFBLEVBQVksU0FBQTtpQkFBRztRQUFILENBREQ7UUFFWCxNQUFBLEVBQVEsU0FBQTtpQkFBRztRQUFILENBRkc7UUFHWCxJQUFBLEVBQU0sU0FBQSxHQUFBLENBSEs7UUFJWCxTQUFBLEVBQVcsU0FBQSxHQUFBLENBSkE7O2FBT2IsSUFBQSxHQUFXLElBQUEsWUFBQSxDQUFhLFVBQWIsRUFBeUIsS0FBekIsRUFBZ0MsR0FBaEM7SUFURixDQUFYO0lBV0EsRUFBQSxDQUFHLHdDQUFILEVBQTZDLFNBQUE7TUFDM0MsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBQTtNQUFILENBQWhCO2FBQ0EsSUFBQSxDQUFLLFNBQUE7ZUFBRyxNQUFBLENBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFoQixDQUFBLENBQVAsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxnQkFBcEM7TUFBSCxDQUFMO0lBRjJDLENBQTdDO0lBSUEsRUFBQSxDQUFHLHFDQUFILEVBQTBDLFNBQUE7TUFDeEMsVUFBVSxDQUFDLFVBQVgsR0FBd0IsU0FBQTtlQUFHO01BQUg7TUFDeEIsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBQTtNQUFILENBQWhCO2FBQ0EsSUFBQSxDQUFLLFNBQUE7ZUFBRyxNQUFBLENBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFoQixDQUFBLENBQVAsQ0FBOEIsQ0FBQyxJQUEvQixDQUFvQyxPQUFwQztNQUFILENBQUw7SUFId0MsQ0FBMUM7V0FLQSxFQUFBLENBQUcsMkJBQUgsRUFBZ0MsU0FBQTtBQUM5QixVQUFBO01BQUEsQ0FBQSxHQUFJO01BQ0osS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFkLEdBQTRCLFNBQUMsUUFBRDtRQUMxQixDQUFBLEdBQUk7ZUFDSixPQUFPLENBQUMsT0FBUixDQUFBO01BRjBCO01BSTVCLEtBQUEsQ0FBTSxVQUFOLEVBQWtCLE1BQWxCO01BRUEsZUFBQSxDQUFnQixTQUFBO2VBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBQTtNQUFILENBQWhCO2FBRUEsSUFBQSxDQUFLLFNBQUE7UUFDSCxNQUFBLENBQU8sVUFBVSxDQUFDLElBQWxCLENBQXVCLENBQUMsZ0JBQXhCLENBQUE7ZUFDQSxNQUFBLENBQU8sQ0FBUCxDQUFTLENBQUMsSUFBVixDQUFlLGVBQWY7TUFGRyxDQUFMO0lBVjhCLENBQWhDO0VBOUJ1QixDQUF6QjtBQUxBIiwic291cmNlc0NvbnRlbnQiOlsie1Jlc29sdmVyVmlld30gPSByZXF1aXJlICcuLi8uLi9saWIvdmlldy9yZXNvbHZlci12aWV3J1xuXG57R2l0T3BzfSA9IHJlcXVpcmUgJy4uLy4uL2xpYi9naXQnXG51dGlsID0gcmVxdWlyZSAnLi4vdXRpbCdcblxuZGVzY3JpYmUgJ1Jlc29sdmVyVmlldycsIC0+XG4gIFt2aWV3LCBmYWtlRWRpdG9yLCBwa2ddID0gW11cblxuICBzdGF0ZSA9XG4gICAgY29udGV4dDpcbiAgICAgIGlzUmVzb2x2ZWRGaWxlOiAtPiBQcm9taXNlLnJlc29sdmUgZmFsc2VcbiAgICAgIHJlc29sdmVGaWxlOiAtPlxuICAgICAgcmVzb2x2ZVRleHQ6IFwiU3RhZ2VcIlxuICAgIHJlbGF0aXZpemU6IChmaWxlcGF0aCkgLT4gZmlsZXBhdGhbXCIvZmFrZS9naXRyb290L1wiLmxlbmd0aC4uXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBwa2cgPSB1dGlsLnBrZ0VtaXR0ZXIoKVxuICAgIGZha2VFZGl0b3IgPSB7XG4gICAgICBpc01vZGlmaWVkOiAtPiB0cnVlXG4gICAgICBnZXRVUkk6IC0+ICcvZmFrZS9naXRyb290L2xpYi9maWxlMS50eHQnXG4gICAgICBzYXZlOiAtPlxuICAgICAgb25EaWRTYXZlOiAtPlxuICAgIH1cblxuICAgIHZpZXcgPSBuZXcgUmVzb2x2ZXJWaWV3KGZha2VFZGl0b3IsIHN0YXRlLCBwa2cpXG5cbiAgaXQgJ2JlZ2lucyBuZWVkaW5nIGJvdGggc2F2aW5nIGFuZCBzdGFnaW5nJywgLT5cbiAgICB3YWl0c0ZvclByb21pc2UgLT4gdmlldy5yZWZyZXNoKClcbiAgICBydW5zIC0+IGV4cGVjdCh2aWV3LmFjdGlvblRleHQudGV4dCgpKS50b0JlKCdTYXZlIGFuZCBzdGFnZScpXG5cbiAgaXQgJ3Nob3dzIGlmIHRoZSBmaWxlIG9ubHkgbmVlZHMgc3RhZ2VkJywgLT5cbiAgICBmYWtlRWRpdG9yLmlzTW9kaWZpZWQgPSAtPiBmYWxzZVxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPiB2aWV3LnJlZnJlc2goKVxuICAgIHJ1bnMgLT4gZXhwZWN0KHZpZXcuYWN0aW9uVGV4dC50ZXh0KCkpLnRvQmUoJ1N0YWdlJylcblxuICBpdCAnc2F2ZXMgYW5kIHN0YWdlcyB0aGUgZmlsZScsIC0+XG4gICAgcCA9IG51bGxcbiAgICBzdGF0ZS5jb250ZXh0LnJlc29sdmVGaWxlID0gKGZpbGVwYXRoKSAtPlxuICAgICAgcCA9IGZpbGVwYXRoXG4gICAgICBQcm9taXNlLnJlc29sdmUoKVxuXG4gICAgc3B5T24oZmFrZUVkaXRvciwgJ3NhdmUnKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+IHZpZXcucmVzb2x2ZSgpXG5cbiAgICBydW5zIC0+XG4gICAgICBleHBlY3QoZmFrZUVkaXRvci5zYXZlKS50b0hhdmVCZWVuQ2FsbGVkKClcbiAgICAgIGV4cGVjdChwKS50b0JlKCdsaWIvZmlsZTEudHh0JylcbiJdfQ==
