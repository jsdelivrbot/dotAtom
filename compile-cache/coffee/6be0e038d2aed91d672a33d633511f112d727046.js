(function() {
  var $, ConflictedEditor, GitOps, _, util;

  $ = require('space-pen').$;

  _ = require('underscore-plus');

  ConflictedEditor = require('../lib/conflicted-editor').ConflictedEditor;

  GitOps = require('../lib/git').GitOps;

  util = require('./util');

  describe('ConflictedEditor', function() {
    var cursors, detectDirty, editor, editorView, linesForMarker, m, pkg, ref, state;
    ref = [], editorView = ref[0], editor = ref[1], state = ref[2], m = ref[3], pkg = ref[4];
    cursors = function() {
      var c, i, len, ref1, results;
      ref1 = editor.getCursors();
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        c = ref1[i];
        results.push(c.getBufferPosition().toArray());
      }
      return results;
    };
    detectDirty = function() {
      var i, len, ref1, results, sv;
      ref1 = m.coveringViews;
      results = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        sv = ref1[i];
        if ('detectDirty' in sv) {
          results.push(sv.detectDirty());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    linesForMarker = function(marker) {
      var fromBuffer, fromScreen, i, len, ref1, result, row, toBuffer, toScreen;
      fromBuffer = marker.getTailBufferPosition();
      fromScreen = editor.screenPositionForBufferPosition(fromBuffer);
      toBuffer = marker.getHeadBufferPosition();
      toScreen = editor.screenPositionForBufferPosition(toBuffer);
      result = $();
      ref1 = _.range(fromScreen.row, toScreen.row);
      for (i = 0, len = ref1.length; i < len; i++) {
        row = ref1[i];
        result = result.add(editorView.component.lineNodeForScreenRow(row));
      }
      return result;
    };
    beforeEach(function() {
      return pkg = util.pkgEmitter();
    });
    afterEach(function() {
      pkg.dispose();
      return m != null ? m.cleanup() : void 0;
    });
    describe('with a merge conflict', function() {
      beforeEach(function() {
        return util.openPath("triple-2way-diff.txt", function(v) {
          editorView = v;
          editorView.getFirstVisibleScreenRow = function() {
            return 0;
          };
          editorView.getLastVisibleScreenRow = function() {
            return 999;
          };
          editor = editorView.getModel();
          state = {
            isRebase: false,
            relativize: function(filepath) {
              return filepath;
            },
            context: {
              isResolvedFile: function(filepath) {
                return Promise.resolve(false);
              }
            }
          };
          m = new ConflictedEditor(state, pkg, editor);
          return m.mark();
        });
      });
      it('attaches two SideViews and a NavigationView for each conflict', function() {
        expect($(editorView).find('.side').length).toBe(6);
        return expect($(editorView).find('.navigation').length).toBe(3);
      });
      it('locates the correct lines', function() {
        var lines;
        lines = linesForMarker(m.conflicts[1].ours.marker);
        return expect(lines.text()).toBe("My middle changes");
      });
      it('applies the "ours" class to our sides of conflicts', function() {
        var lines;
        lines = linesForMarker(m.conflicts[0].ours.marker);
        return expect(lines.hasClass('conflict-ours')).toBe(true);
      });
      it('applies the "theirs" class to their sides of conflicts', function() {
        var lines;
        lines = linesForMarker(m.conflicts[0].theirs.marker);
        return expect(lines.hasClass('conflict-theirs')).toBe(true);
      });
      it('applies the "dirty" class to modified sides', function() {
        var lines;
        editor.setCursorBufferPosition([14, 0]);
        editor.insertText("Make conflict 1 dirty");
        detectDirty();
        lines = linesForMarker(m.conflicts[1].ours.marker);
        expect(lines.hasClass('conflict-dirty')).toBe(true);
        return expect(lines.hasClass('conflict-ours')).toBe(false);
      });
      it('broadcasts the onDidResolveConflict event', function() {
        var event;
        event = null;
        pkg.onDidResolveConflict(function(e) {
          return event = e;
        });
        m.conflicts[2].theirs.resolve();
        expect(event.file).toBe(editor.getPath());
        expect(event.total).toBe(3);
        expect(event.resolved).toBe(1);
        return expect(event.source).toBe(m);
      });
      it('tracks the active conflict side', function() {
        editor.setCursorBufferPosition([11, 0]);
        expect(m.active()).toEqual([]);
        editor.setCursorBufferPosition([14, 5]);
        return expect(m.active()).toEqual([m.conflicts[1].ours]);
      });
      describe('with an active merge conflict', function() {
        var active;
        active = [][0];
        beforeEach(function() {
          editor.setCursorBufferPosition([14, 5]);
          return active = m.conflicts[1];
        });
        it('accepts the current side with merge-conflicts:accept-current', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-current');
          return expect(active.resolution).toBe(active.ours);
        });
        it("does nothing if you have cursors in both sides", function() {
          editor.addCursorAtBufferPosition([16, 2]);
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-current');
          return expect(active.resolution).toBeNull();
        });
        it('accepts "ours" on merge-conflicts:accept-ours', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-current');
          return expect(active.resolution).toBe(active.ours);
        });
        it('accepts "theirs" on merge-conflicts:accept-theirs', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:accept-theirs');
          return expect(active.resolution).toBe(active.theirs);
        });
        it('jumps to the next unresolved on merge-conflicts:next-unresolved', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:next-unresolved');
          return expect(cursors()).toEqual([[22, 0]]);
        });
        it('jumps to the previous unresolved on merge-conflicts:previous-unresolved', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:previous-unresolved');
          return expect(cursors()).toEqual([[5, 0]]);
        });
        it('reverts a dirty hunk on merge-conflicts:revert-current', function() {
          editor.insertText('this is a change');
          detectDirty();
          expect(active.ours.isDirty).toBe(true);
          atom.commands.dispatch(editorView, 'merge-conflicts:revert-current');
          detectDirty();
          return expect(active.ours.isDirty).toBe(false);
        });
        it('accepts ours-then-theirs on merge-conflicts:ours-then-theirs', function() {
          var t;
          atom.commands.dispatch(editorView, 'merge-conflicts:ours-then-theirs');
          expect(active.resolution).toBe(active.ours);
          t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
          return expect(t).toBe("My middle changes\nYour middle changes\n");
        });
        return it('accepts theirs-then-ours on merge-conflicts:theirs-then-ours', function() {
          var t;
          atom.commands.dispatch(editorView, 'merge-conflicts:theirs-then-ours');
          expect(active.resolution).toBe(active.theirs);
          t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
          return expect(t).toBe("Your middle changes\nMy middle changes\n");
        });
      });
      describe('without an active conflict', function() {
        beforeEach(function() {
          return editor.setCursorBufferPosition([11, 6]);
        });
        it('no-ops the resolution commands', function() {
          var c, e, i, len, ref1, results;
          ref1 = ['accept-current', 'accept-ours', 'accept-theirs', 'revert-current'];
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            e = ref1[i];
            atom.commands.dispatch(editorView, "merge-conflicts:" + e);
            expect(m.active()).toEqual([]);
            results.push((function() {
              var j, len1, ref2, results1;
              ref2 = m.conflicts;
              results1 = [];
              for (j = 0, len1 = ref2.length; j < len1; j++) {
                c = ref2[j];
                results1.push(expect(c.isResolved()).toBe(false));
              }
              return results1;
            })());
          }
          return results;
        });
        it('jumps to the next unresolved on merge-conflicts:next-unresolved', function() {
          expect(m.active()).toEqual([]);
          atom.commands.dispatch(editorView, 'merge-conflicts:next-unresolved');
          return expect(cursors()).toEqual([[14, 0]]);
        });
        return it('jumps to the previous unresolved on merge-conflicts:next-unresolved', function() {
          atom.commands.dispatch(editorView, 'merge-conflicts:previous-unresolved');
          return expect(cursors()).toEqual([[5, 0]]);
        });
      });
      describe('when the resolution is complete', function() {
        beforeEach(function() {
          var c, i, len, ref1, results;
          ref1 = m.conflicts;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            c = ref1[i];
            results.push(c.ours.resolve());
          }
          return results;
        });
        it('removes all of the CoveringViews', function() {
          expect($(editorView).find('.overlayer .side').length).toBe(0);
          return expect($(editorView).find('.overlayer .navigation').length).toBe(0);
        });
        return it('appends a ResolverView to the workspace', function() {
          var workspaceView;
          workspaceView = atom.views.getView(atom.workspace);
          return expect($(workspaceView).find('.resolver').length).toBe(1);
        });
      });
      return describe('when all resolutions are complete', function() {
        beforeEach(function() {
          var c, i, len, ref1;
          ref1 = m.conflicts;
          for (i = 0, len = ref1.length; i < len; i++) {
            c = ref1[i];
            c.theirs.resolve();
          }
          return pkg.didCompleteConflictResolution();
        });
        it('destroys all Conflict markers', function() {
          var c, i, len, marker, ref1, results;
          ref1 = m.conflicts;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            c = ref1[i];
            results.push((function() {
              var j, len1, ref2, results1;
              ref2 = c.markers();
              results1 = [];
              for (j = 0, len1 = ref2.length; j < len1; j++) {
                marker = ref2[j];
                results1.push(expect(marker.isDestroyed()).toBe(true));
              }
              return results1;
            })());
          }
          return results;
        });
        return it('removes the .conflicted class', function() {
          return expect($(editorView).hasClass('conflicted')).toBe(false);
        });
      });
    });
    return describe('with a rebase conflict', function() {
      var active;
      active = [][0];
      beforeEach(function() {
        return util.openPath("rebase-2way-diff.txt", function(v) {
          editorView = v;
          editorView.getFirstVisibleScreenRow = function() {
            return 0;
          };
          editorView.getLastVisibleScreenRow = function() {
            return 999;
          };
          editor = editorView.getModel();
          state = {
            isRebase: true,
            relativize: function(filepath) {
              return filepath;
            },
            context: {
              isResolvedFile: function() {
                return Promise.resolve(false);
              }
            }
          };
          m = new ConflictedEditor(state, pkg, editor);
          m.mark();
          editor.setCursorBufferPosition([3, 14]);
          return active = m.conflicts[0];
        });
      });
      it('accepts theirs-then-ours on merge-conflicts:theirs-then-ours', function() {
        var t;
        atom.commands.dispatch(editorView, 'merge-conflicts:theirs-then-ours');
        expect(active.resolution).toBe(active.theirs);
        t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
        return expect(t).toBe("These are your changes\nThese are my changes\n");
      });
      return it('accepts ours-then-theirs on merge-conflicts:ours-then-theirs', function() {
        var t;
        atom.commands.dispatch(editorView, 'merge-conflicts:ours-then-theirs');
        expect(active.resolution).toBe(active.ours);
        t = editor.getTextInBufferRange(active.resolution.marker.getBufferRange());
        return expect(t).toBe("These are my changes\nThese are your changes\n");
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21lcmdlLWNvbmZsaWN0cy9zcGVjL2NvbmZsaWN0ZWQtZWRpdG9yLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQyxJQUFLLE9BQUEsQ0FBUSxXQUFSOztFQUNOLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBRUgsbUJBQW9CLE9BQUEsQ0FBUSwwQkFBUjs7RUFDcEIsU0FBVSxPQUFBLENBQVEsWUFBUjs7RUFDWCxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBRVAsUUFBQSxDQUFTLGtCQUFULEVBQTZCLFNBQUE7QUFDM0IsUUFBQTtJQUFBLE1BQXNDLEVBQXRDLEVBQUMsbUJBQUQsRUFBYSxlQUFiLEVBQXFCLGNBQXJCLEVBQTRCLFVBQTVCLEVBQStCO0lBRS9CLE9BQUEsR0FBVSxTQUFBO0FBQUcsVUFBQTtBQUFBO0FBQUE7V0FBQSxzQ0FBQTs7cUJBQUEsQ0FBQyxDQUFDLGlCQUFGLENBQUEsQ0FBcUIsQ0FBQyxPQUF0QixDQUFBO0FBQUE7O0lBQUg7SUFFVixXQUFBLEdBQWMsU0FBQTtBQUNaLFVBQUE7QUFBQTtBQUFBO1dBQUEsc0NBQUE7O1FBQ0UsSUFBb0IsYUFBQSxJQUFpQixFQUFyQzt1QkFBQSxFQUFFLENBQUMsV0FBSCxDQUFBLEdBQUE7U0FBQSxNQUFBOytCQUFBOztBQURGOztJQURZO0lBSWQsY0FBQSxHQUFpQixTQUFDLE1BQUQ7QUFDZixVQUFBO01BQUEsVUFBQSxHQUFhLE1BQU0sQ0FBQyxxQkFBUCxDQUFBO01BQ2IsVUFBQSxHQUFhLE1BQU0sQ0FBQywrQkFBUCxDQUF1QyxVQUF2QztNQUNiLFFBQUEsR0FBVyxNQUFNLENBQUMscUJBQVAsQ0FBQTtNQUNYLFFBQUEsR0FBVyxNQUFNLENBQUMsK0JBQVAsQ0FBdUMsUUFBdkM7TUFFWCxNQUFBLEdBQVMsQ0FBQSxDQUFB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QSxDQUFPLE1BQU0sQ0FBQyxVQUFkLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsTUFBTSxDQUFDLElBQXRDO1FBQ0EsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUF6QixDQUFBLENBQTVCO2VBQ0osTUFBQSxDQUFPLENBQVAsQ0FBUyxDQUFDLElBQVYsQ0FBZSxnREFBZjtNQUppRSxDQUFuRTtJQTVCaUMsQ0FBbkM7RUEzTDJCLENBQTdCO0FBUEEiLCJzb3VyY2VzQ29udGVudCI6WyJ7JH0gPSByZXF1aXJlICdzcGFjZS1wZW4nXG5fID0gcmVxdWlyZSAndW5kZXJzY29yZS1wbHVzJ1xuXG57Q29uZmxpY3RlZEVkaXRvcn0gPSByZXF1aXJlICcuLi9saWIvY29uZmxpY3RlZC1lZGl0b3InXG57R2l0T3BzfSA9IHJlcXVpcmUgJy4uL2xpYi9naXQnXG51dGlsID0gcmVxdWlyZSAnLi91dGlsJ1xuXG5kZXNjcmliZSAnQ29uZmxpY3RlZEVkaXRvcicsIC0+XG4gIFtlZGl0b3JWaWV3LCBlZGl0b3IsIHN0YXRlLCBtLCBwa2ddID0gW11cblxuICBjdXJzb3JzID0gLT4gYy5nZXRCdWZmZXJQb3NpdGlvbigpLnRvQXJyYXkoKSBmb3IgYyBpbiBlZGl0b3IuZ2V0Q3Vyc29ycygpXG5cbiAgZGV0ZWN0RGlydHkgPSAtPlxuICAgIGZvciBzdiBpbiBtLmNvdmVyaW5nVmlld3NcbiAgICAgIHN2LmRldGVjdERpcnR5KCkgaWYgJ2RldGVjdERpcnR5JyBvZiBzdlxuXG4gIGxpbmVzRm9yTWFya2VyID0gKG1hcmtlcikgLT5cbiAgICBmcm9tQnVmZmVyID0gbWFya2VyLmdldFRhaWxCdWZmZXJQb3NpdGlvbigpXG4gICAgZnJvbVNjcmVlbiA9IGVkaXRvci5zY3JlZW5Qb3NpdGlvbkZvckJ1ZmZlclBvc2l0aW9uIGZyb21CdWZmZXJcbiAgICB0b0J1ZmZlciA9IG1hcmtlci5nZXRIZWFkQnVmZmVyUG9zaXRpb24oKVxuICAgIHRvU2NyZWVuID0gZWRpdG9yLnNjcmVlblBvc2l0aW9uRm9yQnVmZmVyUG9zaXRpb24gdG9CdWZmZXJcblxuICAgIHJlc3VsdCA9ICQoKVxuICAgIGZvciByb3cgaW4gXy5yYW5nZShmcm9tU2NyZWVuLnJvdywgdG9TY3JlZW4ucm93KVxuICAgICAgcmVzdWx0ID0gcmVzdWx0LmFkZCBlZGl0b3JWaWV3LmNvbXBvbmVudC5saW5lTm9kZUZvclNjcmVlblJvdyhyb3cpXG4gICAgcmVzdWx0XG5cbiAgYmVmb3JlRWFjaCAtPlxuICAgIHBrZyA9IHV0aWwucGtnRW1pdHRlcigpXG5cbiAgYWZ0ZXJFYWNoIC0+XG4gICAgcGtnLmRpc3Bvc2UoKVxuXG4gICAgbT8uY2xlYW51cCgpXG5cbiAgZGVzY3JpYmUgJ3dpdGggYSBtZXJnZSBjb25mbGljdCcsIC0+XG5cbiAgICBiZWZvcmVFYWNoIC0+XG4gICAgICB1dGlsLm9wZW5QYXRoIFwidHJpcGxlLTJ3YXktZGlmZi50eHRcIiwgKHYpIC0+XG4gICAgICAgIGVkaXRvclZpZXcgPSB2XG4gICAgICAgIGVkaXRvclZpZXcuZ2V0Rmlyc3RWaXNpYmxlU2NyZWVuUm93ID0gLT4gMFxuICAgICAgICBlZGl0b3JWaWV3LmdldExhc3RWaXNpYmxlU2NyZWVuUm93ID0gLT4gOTk5XG5cbiAgICAgICAgZWRpdG9yID0gZWRpdG9yVmlldy5nZXRNb2RlbCgpXG4gICAgICAgIHN0YXRlID1cbiAgICAgICAgICBpc1JlYmFzZTogZmFsc2VcbiAgICAgICAgICByZWxhdGl2aXplOiAoZmlsZXBhdGgpIC0+IGZpbGVwYXRoXG4gICAgICAgICAgY29udGV4dDpcbiAgICAgICAgICAgIGlzUmVzb2x2ZWRGaWxlOiAoZmlsZXBhdGgpIC0+IFByb21pc2UucmVzb2x2ZSBmYWxzZVxuXG4gICAgICAgIG0gPSBuZXcgQ29uZmxpY3RlZEVkaXRvcihzdGF0ZSwgcGtnLCBlZGl0b3IpXG4gICAgICAgIG0ubWFyaygpXG5cbiAgICBpdCAnYXR0YWNoZXMgdHdvIFNpZGVWaWV3cyBhbmQgYSBOYXZpZ2F0aW9uVmlldyBmb3IgZWFjaCBjb25mbGljdCcsIC0+XG4gICAgICBleHBlY3QoJChlZGl0b3JWaWV3KS5maW5kKCcuc2lkZScpLmxlbmd0aCkudG9CZSg2KVxuICAgICAgZXhwZWN0KCQoZWRpdG9yVmlldykuZmluZCgnLm5hdmlnYXRpb24nKS5sZW5ndGgpLnRvQmUoMylcblxuICAgIGl0ICdsb2NhdGVzIHRoZSBjb3JyZWN0IGxpbmVzJywgLT5cbiAgICAgIGxpbmVzID0gbGluZXNGb3JNYXJrZXIgbS5jb25mbGljdHNbMV0ub3Vycy5tYXJrZXJcbiAgICAgIGV4cGVjdChsaW5lcy50ZXh0KCkpLnRvQmUoXCJNeSBtaWRkbGUgY2hhbmdlc1wiKVxuXG4gICAgaXQgJ2FwcGxpZXMgdGhlIFwib3Vyc1wiIGNsYXNzIHRvIG91ciBzaWRlcyBvZiBjb25mbGljdHMnLCAtPlxuICAgICAgbGluZXMgPSBsaW5lc0Zvck1hcmtlciBtLmNvbmZsaWN0c1swXS5vdXJzLm1hcmtlclxuICAgICAgZXhwZWN0KGxpbmVzLmhhc0NsYXNzICdjb25mbGljdC1vdXJzJykudG9CZSh0cnVlKVxuXG4gICAgaXQgJ2FwcGxpZXMgdGhlIFwidGhlaXJzXCIgY2xhc3MgdG8gdGhlaXIgc2lkZXMgb2YgY29uZmxpY3RzJywgLT5cbiAgICAgIGxpbmVzID0gbGluZXNGb3JNYXJrZXIgbS5jb25mbGljdHNbMF0udGhlaXJzLm1hcmtlclxuICAgICAgZXhwZWN0KGxpbmVzLmhhc0NsYXNzICdjb25mbGljdC10aGVpcnMnKS50b0JlKHRydWUpXG5cbiAgICBpdCAnYXBwbGllcyB0aGUgXCJkaXJ0eVwiIGNsYXNzIHRvIG1vZGlmaWVkIHNpZGVzJywgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBbMTQsIDBdXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dCBcIk1ha2UgY29uZmxpY3QgMSBkaXJ0eVwiXG4gICAgICBkZXRlY3REaXJ0eSgpXG5cbiAgICAgIGxpbmVzID0gbGluZXNGb3JNYXJrZXIgbS5jb25mbGljdHNbMV0ub3Vycy5tYXJrZXJcbiAgICAgIGV4cGVjdChsaW5lcy5oYXNDbGFzcyAnY29uZmxpY3QtZGlydHknKS50b0JlKHRydWUpXG4gICAgICBleHBlY3QobGluZXMuaGFzQ2xhc3MgJ2NvbmZsaWN0LW91cnMnKS50b0JlKGZhbHNlKVxuXG4gICAgaXQgJ2Jyb2FkY2FzdHMgdGhlIG9uRGlkUmVzb2x2ZUNvbmZsaWN0IGV2ZW50JywgLT5cbiAgICAgIGV2ZW50ID0gbnVsbFxuICAgICAgcGtnLm9uRGlkUmVzb2x2ZUNvbmZsaWN0IChlKSAtPiBldmVudCA9IGVcbiAgICAgIG0uY29uZmxpY3RzWzJdLnRoZWlycy5yZXNvbHZlKClcblxuICAgICAgZXhwZWN0KGV2ZW50LmZpbGUpLnRvQmUoZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgIGV4cGVjdChldmVudC50b3RhbCkudG9CZSgzKVxuICAgICAgZXhwZWN0KGV2ZW50LnJlc29sdmVkKS50b0JlKDEpXG4gICAgICBleHBlY3QoZXZlbnQuc291cmNlKS50b0JlKG0pXG5cbiAgICBpdCAndHJhY2tzIHRoZSBhY3RpdmUgY29uZmxpY3Qgc2lkZScsIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gWzExLCAwXVxuICAgICAgZXhwZWN0KG0uYWN0aXZlKCkpLnRvRXF1YWwoW10pXG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gWzE0LCA1XVxuICAgICAgZXhwZWN0KG0uYWN0aXZlKCkpLnRvRXF1YWwoW20uY29uZmxpY3RzWzFdLm91cnNdKVxuXG4gICAgZGVzY3JpYmUgJ3dpdGggYW4gYWN0aXZlIG1lcmdlIGNvbmZsaWN0JywgLT5cbiAgICAgIFthY3RpdmVdID0gW11cblxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gWzE0LCA1XVxuICAgICAgICBhY3RpdmUgPSBtLmNvbmZsaWN0c1sxXVxuXG4gICAgICBpdCAnYWNjZXB0cyB0aGUgY3VycmVudCBzaWRlIHdpdGggbWVyZ2UtY29uZmxpY3RzOmFjY2VwdC1jdXJyZW50JywgLT5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBlZGl0b3JWaWV3LCAnbWVyZ2UtY29uZmxpY3RzOmFjY2VwdC1jdXJyZW50J1xuICAgICAgICBleHBlY3QoYWN0aXZlLnJlc29sdXRpb24pLnRvQmUoYWN0aXZlLm91cnMpXG5cbiAgICAgIGl0IFwiZG9lcyBub3RoaW5nIGlmIHlvdSBoYXZlIGN1cnNvcnMgaW4gYm90aCBzaWRlc1wiLCAtPlxuICAgICAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbiBbMTYsIDJdXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggZWRpdG9yVmlldywgJ21lcmdlLWNvbmZsaWN0czphY2NlcHQtY3VycmVudCdcbiAgICAgICAgZXhwZWN0KGFjdGl2ZS5yZXNvbHV0aW9uKS50b0JlTnVsbCgpXG5cbiAgICAgIGl0ICdhY2NlcHRzIFwib3Vyc1wiIG9uIG1lcmdlLWNvbmZsaWN0czphY2NlcHQtb3VycycsIC0+XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggZWRpdG9yVmlldywgJ21lcmdlLWNvbmZsaWN0czphY2NlcHQtY3VycmVudCdcbiAgICAgICAgZXhwZWN0KGFjdGl2ZS5yZXNvbHV0aW9uKS50b0JlKGFjdGl2ZS5vdXJzKVxuXG4gICAgICBpdCAnYWNjZXB0cyBcInRoZWlyc1wiIG9uIG1lcmdlLWNvbmZsaWN0czphY2NlcHQtdGhlaXJzJywgLT5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBlZGl0b3JWaWV3LCAnbWVyZ2UtY29uZmxpY3RzOmFjY2VwdC10aGVpcnMnXG4gICAgICAgIGV4cGVjdChhY3RpdmUucmVzb2x1dGlvbikudG9CZShhY3RpdmUudGhlaXJzKVxuXG4gICAgICBpdCAnanVtcHMgdG8gdGhlIG5leHQgdW5yZXNvbHZlZCBvbiBtZXJnZS1jb25mbGljdHM6bmV4dC11bnJlc29sdmVkJywgLT5cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBlZGl0b3JWaWV3LCAnbWVyZ2UtY29uZmxpY3RzOm5leHQtdW5yZXNvbHZlZCdcbiAgICAgICAgZXhwZWN0KGN1cnNvcnMoKSkudG9FcXVhbChbWzIyLCAwXV0pXG5cbiAgICAgIGl0ICdqdW1wcyB0byB0aGUgcHJldmlvdXMgdW5yZXNvbHZlZCBvbiBtZXJnZS1jb25mbGljdHM6cHJldmlvdXMtdW5yZXNvbHZlZCcsIC0+XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggZWRpdG9yVmlldywgJ21lcmdlLWNvbmZsaWN0czpwcmV2aW91cy11bnJlc29sdmVkJ1xuICAgICAgICBleHBlY3QoY3Vyc29ycygpKS50b0VxdWFsKFtbNSwgMF1dKVxuXG4gICAgICBpdCAncmV2ZXJ0cyBhIGRpcnR5IGh1bmsgb24gbWVyZ2UtY29uZmxpY3RzOnJldmVydC1jdXJyZW50JywgLT5cbiAgICAgICAgZWRpdG9yLmluc2VydFRleHQgJ3RoaXMgaXMgYSBjaGFuZ2UnXG4gICAgICAgIGRldGVjdERpcnR5KClcbiAgICAgICAgZXhwZWN0KGFjdGl2ZS5vdXJzLmlzRGlydHkpLnRvQmUodHJ1ZSlcblxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIGVkaXRvclZpZXcsICdtZXJnZS1jb25mbGljdHM6cmV2ZXJ0LWN1cnJlbnQnXG4gICAgICAgIGRldGVjdERpcnR5KClcbiAgICAgICAgZXhwZWN0KGFjdGl2ZS5vdXJzLmlzRGlydHkpLnRvQmUoZmFsc2UpXG5cbiAgICAgIGl0ICdhY2NlcHRzIG91cnMtdGhlbi10aGVpcnMgb24gbWVyZ2UtY29uZmxpY3RzOm91cnMtdGhlbi10aGVpcnMnLCAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIGVkaXRvclZpZXcsICdtZXJnZS1jb25mbGljdHM6b3Vycy10aGVuLXRoZWlycydcbiAgICAgICAgZXhwZWN0KGFjdGl2ZS5yZXNvbHV0aW9uKS50b0JlKGFjdGl2ZS5vdXJzKVxuICAgICAgICB0ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlIGFjdGl2ZS5yZXNvbHV0aW9uLm1hcmtlci5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICAgIGV4cGVjdCh0KS50b0JlKFwiTXkgbWlkZGxlIGNoYW5nZXNcXG5Zb3VyIG1pZGRsZSBjaGFuZ2VzXFxuXCIpXG5cbiAgICAgIGl0ICdhY2NlcHRzIHRoZWlycy10aGVuLW91cnMgb24gbWVyZ2UtY29uZmxpY3RzOnRoZWlycy10aGVuLW91cnMnLCAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIGVkaXRvclZpZXcsICdtZXJnZS1jb25mbGljdHM6dGhlaXJzLXRoZW4tb3VycydcbiAgICAgICAgZXhwZWN0KGFjdGl2ZS5yZXNvbHV0aW9uKS50b0JlKGFjdGl2ZS50aGVpcnMpXG4gICAgICAgIHQgPSBlZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UgYWN0aXZlLnJlc29sdXRpb24ubWFya2VyLmdldEJ1ZmZlclJhbmdlKClcbiAgICAgICAgZXhwZWN0KHQpLnRvQmUoXCJZb3VyIG1pZGRsZSBjaGFuZ2VzXFxuTXkgbWlkZGxlIGNoYW5nZXNcXG5cIilcblxuICAgIGRlc2NyaWJlICd3aXRob3V0IGFuIGFjdGl2ZSBjb25mbGljdCcsIC0+XG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFsxMSwgNl1cblxuICAgICAgaXQgJ25vLW9wcyB0aGUgcmVzb2x1dGlvbiBjb21tYW5kcycsIC0+XG4gICAgICAgIGZvciBlIGluIFsnYWNjZXB0LWN1cnJlbnQnLCAnYWNjZXB0LW91cnMnLCAnYWNjZXB0LXRoZWlycycsICdyZXZlcnQtY3VycmVudCddXG4gICAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBlZGl0b3JWaWV3LCBcIm1lcmdlLWNvbmZsaWN0czoje2V9XCJcbiAgICAgICAgICBleHBlY3QobS5hY3RpdmUoKSkudG9FcXVhbChbXSlcbiAgICAgICAgICBmb3IgYyBpbiBtLmNvbmZsaWN0c1xuICAgICAgICAgICAgZXhwZWN0KGMuaXNSZXNvbHZlZCgpKS50b0JlKGZhbHNlKVxuXG4gICAgICBpdCAnanVtcHMgdG8gdGhlIG5leHQgdW5yZXNvbHZlZCBvbiBtZXJnZS1jb25mbGljdHM6bmV4dC11bnJlc29sdmVkJywgLT5cbiAgICAgICAgZXhwZWN0KG0uYWN0aXZlKCkpLnRvRXF1YWwoW10pXG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggZWRpdG9yVmlldywgJ21lcmdlLWNvbmZsaWN0czpuZXh0LXVucmVzb2x2ZWQnXG4gICAgICAgIGV4cGVjdChjdXJzb3JzKCkpLnRvRXF1YWwoW1sxNCwgMF1dKVxuXG4gICAgICBpdCAnanVtcHMgdG8gdGhlIHByZXZpb3VzIHVucmVzb2x2ZWQgb24gbWVyZ2UtY29uZmxpY3RzOm5leHQtdW5yZXNvbHZlZCcsIC0+XG4gICAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggZWRpdG9yVmlldywgJ21lcmdlLWNvbmZsaWN0czpwcmV2aW91cy11bnJlc29sdmVkJ1xuICAgICAgICBleHBlY3QoY3Vyc29ycygpKS50b0VxdWFsKFtbNSwgMF1dKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gdGhlIHJlc29sdXRpb24gaXMgY29tcGxldGUnLCAtPlxuXG4gICAgICBiZWZvcmVFYWNoIC0+IGMub3Vycy5yZXNvbHZlKCkgZm9yIGMgaW4gbS5jb25mbGljdHNcblxuICAgICAgaXQgJ3JlbW92ZXMgYWxsIG9mIHRoZSBDb3ZlcmluZ1ZpZXdzJywgLT5cbiAgICAgICAgZXhwZWN0KCQoZWRpdG9yVmlldykuZmluZCgnLm92ZXJsYXllciAuc2lkZScpLmxlbmd0aCkudG9CZSgwKVxuICAgICAgICBleHBlY3QoJChlZGl0b3JWaWV3KS5maW5kKCcub3ZlcmxheWVyIC5uYXZpZ2F0aW9uJykubGVuZ3RoKS50b0JlKDApXG5cbiAgICAgIGl0ICdhcHBlbmRzIGEgUmVzb2x2ZXJWaWV3IHRvIHRoZSB3b3Jrc3BhY2UnLCAtPlxuICAgICAgICB3b3Jrc3BhY2VWaWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3IGF0b20ud29ya3NwYWNlXG4gICAgICAgIGV4cGVjdCgkKHdvcmtzcGFjZVZpZXcpLmZpbmQoJy5yZXNvbHZlcicpLmxlbmd0aCkudG9CZSgxKVxuXG4gICAgZGVzY3JpYmUgJ3doZW4gYWxsIHJlc29sdXRpb25zIGFyZSBjb21wbGV0ZScsIC0+XG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgYy50aGVpcnMucmVzb2x2ZSgpIGZvciBjIGluIG0uY29uZmxpY3RzXG4gICAgICAgIHBrZy5kaWRDb21wbGV0ZUNvbmZsaWN0UmVzb2x1dGlvbigpXG5cbiAgICAgIGl0ICdkZXN0cm95cyBhbGwgQ29uZmxpY3QgbWFya2VycycsIC0+XG4gICAgICAgIGZvciBjIGluIG0uY29uZmxpY3RzXG4gICAgICAgICAgZm9yIG1hcmtlciBpbiBjLm1hcmtlcnMoKVxuICAgICAgICAgICAgZXhwZWN0KG1hcmtlci5pc0Rlc3Ryb3llZCgpKS50b0JlKHRydWUpXG5cbiAgICAgIGl0ICdyZW1vdmVzIHRoZSAuY29uZmxpY3RlZCBjbGFzcycsIC0+XG4gICAgICAgIGV4cGVjdCgkKGVkaXRvclZpZXcpLmhhc0NsYXNzICdjb25mbGljdGVkJykudG9CZShmYWxzZSlcblxuICBkZXNjcmliZSAnd2l0aCBhIHJlYmFzZSBjb25mbGljdCcsIC0+XG4gICAgW2FjdGl2ZV0gPSBbXVxuXG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgdXRpbC5vcGVuUGF0aCBcInJlYmFzZS0yd2F5LWRpZmYudHh0XCIsICh2KSAtPlxuICAgICAgICBlZGl0b3JWaWV3ID0gdlxuICAgICAgICBlZGl0b3JWaWV3LmdldEZpcnN0VmlzaWJsZVNjcmVlblJvdyA9IC0+IDBcbiAgICAgICAgZWRpdG9yVmlldy5nZXRMYXN0VmlzaWJsZVNjcmVlblJvdyA9IC0+IDk5OVxuXG4gICAgICAgIGVkaXRvciA9IGVkaXRvclZpZXcuZ2V0TW9kZWwoKVxuICAgICAgICBzdGF0ZSA9XG4gICAgICAgICAgaXNSZWJhc2U6IHRydWVcbiAgICAgICAgICByZWxhdGl2aXplOiAoZmlsZXBhdGgpIC0+IGZpbGVwYXRoXG4gICAgICAgICAgY29udGV4dDpcbiAgICAgICAgICAgIGlzUmVzb2x2ZWRGaWxlOiAtPiBQcm9taXNlLnJlc29sdmUoZmFsc2UpXG5cbiAgICAgICAgbSA9IG5ldyBDb25mbGljdGVkRWRpdG9yKHN0YXRlLCBwa2csIGVkaXRvcilcbiAgICAgICAgbS5tYXJrKClcblxuICAgICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gWzMsIDE0XVxuICAgICAgICBhY3RpdmUgPSBtLmNvbmZsaWN0c1swXVxuXG4gICAgaXQgJ2FjY2VwdHMgdGhlaXJzLXRoZW4tb3VycyBvbiBtZXJnZS1jb25mbGljdHM6dGhlaXJzLXRoZW4tb3VycycsIC0+XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIGVkaXRvclZpZXcsICdtZXJnZS1jb25mbGljdHM6dGhlaXJzLXRoZW4tb3VycydcbiAgICAgIGV4cGVjdChhY3RpdmUucmVzb2x1dGlvbikudG9CZShhY3RpdmUudGhlaXJzKVxuICAgICAgdCA9IGVkaXRvci5nZXRUZXh0SW5CdWZmZXJSYW5nZSBhY3RpdmUucmVzb2x1dGlvbi5tYXJrZXIuZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgZXhwZWN0KHQpLnRvQmUoXCJUaGVzZSBhcmUgeW91ciBjaGFuZ2VzXFxuVGhlc2UgYXJlIG15IGNoYW5nZXNcXG5cIilcblxuICAgIGl0ICdhY2NlcHRzIG91cnMtdGhlbi10aGVpcnMgb24gbWVyZ2UtY29uZmxpY3RzOm91cnMtdGhlbi10aGVpcnMnLCAtPlxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBlZGl0b3JWaWV3LCAnbWVyZ2UtY29uZmxpY3RzOm91cnMtdGhlbi10aGVpcnMnXG4gICAgICBleHBlY3QoYWN0aXZlLnJlc29sdXRpb24pLnRvQmUoYWN0aXZlLm91cnMpXG4gICAgICB0ID0gZWRpdG9yLmdldFRleHRJbkJ1ZmZlclJhbmdlIGFjdGl2ZS5yZXNvbHV0aW9uLm1hcmtlci5nZXRCdWZmZXJSYW5nZSgpXG4gICAgICBleHBlY3QodCkudG9CZShcIlRoZXNlIGFyZSBteSBjaGFuZ2VzXFxuVGhlc2UgYXJlIHlvdXIgY2hhbmdlc1xcblwiKVxuIl19
