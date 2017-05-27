(function() {
  var $, MarkdownMindmapView, fs, path, temp, wrench;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  wrench = require('wrench');

  MarkdownMindmapView = require('../lib/markdown-mindmap-view');

  $ = require('atom-space-pen-views').$;

  describe("Markdown Mindmap package", function() {
    var expectPreviewInSplitPane, preview, ref, workspaceElement;
    ref = [], workspaceElement = ref[0], preview = ref[1];
    beforeEach(function() {
      var fixturesPath, tempPath;
      fixturesPath = path.join(__dirname, 'fixtures');
      tempPath = temp.mkdirSync('atom');
      wrench.copyDirSyncRecursive(fixturesPath, tempPath, {
        forceDelete: true
      });
      atom.project.setPaths([tempPath]);
      jasmine.useRealClock();
      workspaceElement = atom.views.getView(atom.workspace);
      jasmine.attachToDOM(workspaceElement);
      waitsForPromise(function() {
        return atom.packages.activatePackage("markdown-mindmap");
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('language-gfm');
      });
    });
    expectPreviewInSplitPane = function() {
      runs(function() {
        return expect(atom.workspace.getPanes()).toHaveLength(2);
      });
      waitsFor("Markdown Mindmap to be created", function() {
        return preview = atom.workspace.getPanes()[1].getActiveItem();
      });
      return runs(function() {
        expect(preview).toBeInstanceOf(MarkdownMindmapView);
        return expect(preview.getPath()).toBe(atom.workspace.getActivePaneItem().getPath());
      });
    };
    describe("when a preview has not been created for the file", function() {
      it("displays a Markdown Mindmap in a split pane", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          var editorPane;
          editorPane = atom.workspace.getPanes()[0];
          expect(editorPane.getItems()).toHaveLength(1);
          return expect(editorPane.isActive()).toBe(true);
        });
      });
      describe("when the editor's path does not exist", function() {
        return it("splits the current pane to the right with a Markdown Mindmap for the file", function() {
          waitsForPromise(function() {
            return atom.workspace.open("new.markdown");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
      describe("when the editor does not have a path", function() {
        return it("splits the current pane to the right with a Markdown Mindmap for the file", function() {
          waitsForPromise(function() {
            return atom.workspace.open("");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
      describe("when the path contains a space", function() {
        return it("renders the preview", function() {
          waitsForPromise(function() {
            return atom.workspace.open("subdir/file with space.md");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
      return describe("when the path contains accented characters", function() {
        return it("renders the preview", function() {
          waitsForPromise(function() {
            return atom.workspace.open("subdir/áccéntéd.md");
          });
          runs(function() {
            return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
          });
          return expectPreviewInSplitPane();
        });
      });
    });
    describe("when a preview has been created for the file", function() {
      beforeEach(function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        });
        return expectPreviewInSplitPane();
      });
      it("closes the existing preview when toggle is triggered a second time on the editor", function() {
        var editorPane, previewPane, ref1;
        atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        ref1 = atom.workspace.getPanes(), editorPane = ref1[0], previewPane = ref1[1];
        expect(editorPane.isActive()).toBe(true);
        return expect(previewPane.getActiveItem()).toBeUndefined();
      });
      it("closes the existing preview when toggle is triggered on it and it has focus", function() {
        var editorPane, previewPane, ref1;
        ref1 = atom.workspace.getPanes(), editorPane = ref1[0], previewPane = ref1[1];
        previewPane.activate();
        atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        return expect(previewPane.getActiveItem()).toBeUndefined();
      });
      describe("when the editor is modified", function() {
        it("re-renders the preview", function() {
          var markdownEditor;
          spyOn(preview, 'showLoading');
          markdownEditor = atom.workspace.getActiveTextEditor();
          markdownEditor.setText("Hey!");
          waitsFor(function() {
            return preview.text().indexOf("Hey!") >= 0;
          });
          return runs(function() {
            return expect(preview.showLoading).not.toHaveBeenCalled();
          });
        });
        it("invokes ::onDidChangeMarkdown listeners", function() {
          var listener, markdownEditor;
          markdownEditor = atom.workspace.getActiveTextEditor();
          preview.onDidChangeMarkdown(listener = jasmine.createSpy('didChangeMarkdownListener'));
          runs(function() {
            return markdownEditor.setText("Hey!");
          });
          return waitsFor("::onDidChangeMarkdown handler to be called", function() {
            return listener.callCount > 0;
          });
        });
        describe("when the preview is in the active pane but is not the active item", function() {
          return it("re-renders the preview but does not make it active", function() {
            var markdownEditor, previewPane;
            markdownEditor = atom.workspace.getActiveTextEditor();
            previewPane = atom.workspace.getPanes()[1];
            previewPane.activate();
            waitsForPromise(function() {
              return atom.workspace.open();
            });
            runs(function() {
              return markdownEditor.setText("Hey!");
            });
            waitsFor(function() {
              return preview.text().indexOf("Hey!") >= 0;
            });
            return runs(function() {
              expect(previewPane.isActive()).toBe(true);
              return expect(previewPane.getActiveItem()).not.toBe(preview);
            });
          });
        });
        describe("when the preview is not the active item and not in the active pane", function() {
          return it("re-renders the preview and makes it active", function() {
            var editorPane, markdownEditor, previewPane, ref1;
            markdownEditor = atom.workspace.getActiveTextEditor();
            ref1 = atom.workspace.getPanes(), editorPane = ref1[0], previewPane = ref1[1];
            previewPane.splitRight({
              copyActiveItem: true
            });
            previewPane.activate();
            waitsForPromise(function() {
              return atom.workspace.open();
            });
            runs(function() {
              editorPane.activate();
              return markdownEditor.setText("Hey!");
            });
            waitsFor(function() {
              return preview.text().indexOf("Hey!") >= 0;
            });
            return runs(function() {
              expect(editorPane.isActive()).toBe(true);
              return expect(previewPane.getActiveItem()).toBe(preview);
            });
          });
        });
        return describe("when the liveUpdate config is set to false", function() {
          return it("only re-renders the markdown when the editor is saved, not when the contents are modified", function() {
            var didStopChangingHandler;
            atom.config.set('markdown-mindmap.liveUpdate', false);
            didStopChangingHandler = jasmine.createSpy('didStopChangingHandler');
            atom.workspace.getActiveTextEditor().getBuffer().onDidStopChanging(didStopChangingHandler);
            atom.workspace.getActiveTextEditor().setText('ch ch changes');
            waitsFor(function() {
              return didStopChangingHandler.callCount > 0;
            });
            runs(function() {
              expect(preview.text()).not.toContain("ch ch changes");
              return atom.workspace.getActiveTextEditor().save();
            });
            return waitsFor(function() {
              return preview.text().indexOf("ch ch changes") >= 0;
            });
          });
        });
      });
      return describe("when a new grammar is loaded", function() {
        return it("re-renders the preview", function() {
          var grammarAdded;
          atom.workspace.getActiveTextEditor().setText("```javascript\nvar x = y;\n```");
          waitsFor("markdown to be rendered after its text changed", function() {
            return preview.find("atom-text-editor").data("grammar") === "text plain null-grammar";
          });
          grammarAdded = false;
          runs(function() {
            return atom.grammars.onDidAddGrammar(function() {
              return grammarAdded = true;
            });
          });
          waitsForPromise(function() {
            expect(atom.packages.isPackageActive('language-javascript')).toBe(false);
            return atom.packages.activatePackage('language-javascript');
          });
          waitsFor("grammar to be added", function() {
            return grammarAdded;
          });
          return waitsFor("markdown to be rendered after grammar was added", function() {
            return preview.find("atom-text-editor").data("grammar") !== "source js";
          });
        });
      });
    });
    describe("when the Markdown Mindmap view is requested by file URI", function() {
      return it("opens a preview editor and watches the file for changes", function() {
        waitsForPromise("atom.workspace.open promise to be resolved", function() {
          return atom.workspace.open("markdown-mindmap://" + (atom.project.getDirectories()[0].resolve('subdir/file.markdown')));
        });
        runs(function() {
          preview = atom.workspace.getActivePaneItem();
          expect(preview).toBeInstanceOf(MarkdownMindmapView);
          spyOn(preview, 'renderMarkdownText');
          return preview.file.emitter.emit('did-change');
        });
        return waitsFor("markdown to be re-rendered after file changed", function() {
          return preview.renderMarkdownText.callCount > 0;
        });
      });
    });
    describe("when the editor's grammar it not enabled for preview", function() {
      return it("does not open the Markdown Mindmap", function() {
        atom.config.set('markdown-mindmap.grammars', []);
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        return runs(function() {
          spyOn(atom.workspace, 'open').andCallThrough();
          atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
          return expect(atom.workspace.open).not.toHaveBeenCalled();
        });
      });
    });
    describe("when the editor's path changes on #win32 and #darwin", function() {
      return it("updates the preview's title", function() {
        var titleChangedCallback;
        titleChangedCallback = jasmine.createSpy('titleChangedCallback');
        waitsForPromise(function() {
          return atom.workspace.open("subdir/file.markdown");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        });
        expectPreviewInSplitPane();
        runs(function() {
          expect(preview.getTitle()).toBe('file.Markdown Mindmap');
          preview.onDidChangeTitle(titleChangedCallback);
          return fs.renameSync(atom.workspace.getActiveTextEditor().getPath(), path.join(path.dirname(atom.workspace.getActiveTextEditor().getPath()), 'file2.md'));
        });
        waitsFor(function() {
          return preview.getTitle() === "file2.md Mindmap";
        });
        return runs(function() {
          return expect(titleChangedCallback).toHaveBeenCalled();
        });
      });
    });
    describe("when the URI opened does not have a markdown-mindmap protocol", function() {
      return it("does not throw an error trying to decode the URI (regression)", function() {
        waitsForPromise(function() {
          return atom.workspace.open('%');
        });
        return runs(function() {
          return expect(atom.workspace.getActiveTextEditor()).toBeTruthy();
        });
      });
    });
    describe("when markdown-mindmap:copy-html is triggered", function() {
      it("copies the HTML to the clipboard", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        return runs(function() {
          atom.commands.dispatch(workspaceElement, 'markdown-mindmap:copy-html');
          expect(atom.clipboard.read()).toBe("<p><em>italic</em></p>\n<p><strong>bold</strong></p>\n<p>encoding \u2192 issue</p>");
          atom.workspace.getActiveTextEditor().setSelectedBufferRange([[0, 0], [1, 0]]);
          atom.commands.dispatch(workspaceElement, 'markdown-mindmap:copy-html');
          return expect(atom.clipboard.read()).toBe("<p><em>italic</em></p>");
        });
      });
      return describe("code block tokenization", function() {
        preview = null;
        beforeEach(function() {
          waitsForPromise(function() {
            return atom.packages.activatePackage('language-ruby');
          });
          waitsForPromise(function() {
            return atom.packages.activatePackage('markdown-mindmap');
          });
          waitsForPromise(function() {
            return atom.workspace.open("subdir/file.markdown");
          });
          return runs(function() {
            workspaceElement = atom.views.getView(atom.workspace);
            atom.commands.dispatch(workspaceElement, 'markdown-mindmap:copy-html');
            return preview = $('<div>').append(atom.clipboard.read());
          });
        });
        describe("when the code block's fence name has a matching grammar", function() {
          return it("tokenizes the code block with the grammar", function() {
            return expect(preview.find("pre span.entity.name.function.ruby")).toExist();
          });
        });
        describe("when the code block's fence name doesn't have a matching grammar", function() {
          return it("does not tokenize the code block", function() {
            return expect(preview.find("pre.lang-kombucha .line .null-grammar").children().length).toBe(2);
          });
        });
        describe("when the code block contains empty lines", function() {
          return it("doesn't remove the empty lines", function() {
            expect(preview.find("pre.lang-python").children().length).toBe(6);
            expect(preview.find("pre.lang-python div:nth-child(2)").text().trim()).toBe('');
            expect(preview.find("pre.lang-python div:nth-child(4)").text().trim()).toBe('');
            return expect(preview.find("pre.lang-python div:nth-child(5)").text().trim()).toBe('');
          });
        });
        return describe("when the code block is nested in a list", function() {
          return it("detects and styles the block", function() {
            return expect(preview.find("pre.lang-javascript")).toHaveClass('editor-colors');
          });
        });
      });
    });
    describe("sanitization", function() {
      it("removes script tags and attributes that commonly contain inline scripts", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/evil.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview[0].innerHTML).toBe("<p>hello</p>\n<p></p>\n<p>\n<img>\nworld</p>");
        });
      });
      return it("remove the first <!doctype> tag at the beginning of the file", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/doctype-tag.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview[0].innerHTML).toBe("<p>content\n&lt;!doctype html&gt;</p>");
        });
      });
    });
    describe("when the markdown contains an <html> tag", function() {
      return it("does not throw an exception", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/html-tag.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview[0].innerHTML).toBe("content");
        });
      });
    });
    describe("when the markdown contains a <pre> tag", function() {
      return it("does not throw an exception", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/pre-tag.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview.find('atom-text-editor')).toExist();
        });
      });
    });
    return describe("GitHub style Markdown Mindmap", function() {
      beforeEach(function() {
        return atom.config.set('markdown-mindmap.useGitHubStyle', false);
      });
      it("renders markdown using the default style when GitHub styling is disabled", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview.element.getAttribute('data-use-github-style')).toBeNull();
        });
      });
      it("renders markdown using the GitHub styling when enabled", function() {
        atom.config.set('markdown-mindmap.useGitHubStyle', true);
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          return expect(preview.element.getAttribute('data-use-github-style')).toBe('');
        });
      });
      return it("updates the rendering style immediately when the configuration is changed", function() {
        waitsForPromise(function() {
          return atom.workspace.open("subdir/simple.md");
        });
        runs(function() {
          return atom.commands.dispatch(workspaceElement, 'markdown-mindmap:toggle');
        });
        expectPreviewInSplitPane();
        return runs(function() {
          expect(preview.element.getAttribute('data-use-github-style')).toBeNull();
          atom.config.set('markdown-mindmap.useGitHubStyle', true);
          expect(preview.element.getAttribute('data-use-github-style')).not.toBeNull();
          atom.config.set('markdown-mindmap.useGitHubStyle', false);
          return expect(preview.element.getAttribute('data-use-github-style')).toBeNull();
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21hcmtkb3duLW1pbmRtYXAvc3BlYy9tYXJrZG93bi1taW5kbWFwLXNwZWMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxTQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0VBQ1QsbUJBQUEsR0FBc0IsT0FBQSxDQUFRLDhCQUFSOztFQUNyQixJQUFLLE9BQUEsQ0FBUSxzQkFBUjs7RUFFTixRQUFBLENBQVMsMEJBQVQsRUFBcUMsU0FBQTtBQUNuQyxRQUFBO0lBQUEsTUFBOEIsRUFBOUIsRUFBQyx5QkFBRCxFQUFtQjtJQUVuQixVQUFBLENBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFVBQXJCO01BQ2YsUUFBQSxHQUFXLElBQUksQ0FBQyxTQUFMLENBQWUsTUFBZjtNQUNYLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixZQUE1QixFQUEwQyxRQUExQyxFQUFvRDtRQUFBLFdBQUEsRUFBYSxJQUFiO09BQXBEO01BQ0EsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQXNCLENBQUMsUUFBRCxDQUF0QjtNQUVBLE9BQU8sQ0FBQyxZQUFSLENBQUE7TUFFQSxnQkFBQSxHQUFtQixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsSUFBSSxDQUFDLFNBQXhCO01BQ25CLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGdCQUFwQjtNQUVBLGVBQUEsQ0FBZ0IsU0FBQTtlQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixrQkFBOUI7TUFEYyxDQUFoQjthQUdBLGVBQUEsQ0FB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QyxRQUFsRSxDQUFBO1VBRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixFQUFtRCxLQUFuRDtpQkFDQSxNQUFBLENBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxZQUFoQixDQUE2Qix1QkFBN0IsQ0FBUCxDQUE2RCxDQUFDLFFBQTlELENBQUE7UUFQRyxDQUFMO01BTDhFLENBQWhGO0lBcEJ3QyxDQUExQztFQXhWbUMsQ0FBckM7QUFQQSIsInNvdXJjZXNDb250ZW50IjpbInBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xudGVtcCA9IHJlcXVpcmUgJ3RlbXAnXG53cmVuY2ggPSByZXF1aXJlICd3cmVuY2gnXG5NYXJrZG93bk1pbmRtYXBWaWV3ID0gcmVxdWlyZSAnLi4vbGliL21hcmtkb3duLW1pbmRtYXAtdmlldydcbnskfSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5kZXNjcmliZSBcIk1hcmtkb3duIE1pbmRtYXAgcGFja2FnZVwiLCAtPlxuICBbd29ya3NwYWNlRWxlbWVudCwgcHJldmlld10gPSBbXVxuXG4gIGJlZm9yZUVhY2ggLT5cbiAgICBmaXh0dXJlc1BhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZml4dHVyZXMnKVxuICAgIHRlbXBQYXRoID0gdGVtcC5ta2RpclN5bmMoJ2F0b20nKVxuICAgIHdyZW5jaC5jb3B5RGlyU3luY1JlY3Vyc2l2ZShmaXh0dXJlc1BhdGgsIHRlbXBQYXRoLCBmb3JjZURlbGV0ZTogdHJ1ZSlcbiAgICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3RlbXBQYXRoXSlcblxuICAgIGphc21pbmUudXNlUmVhbENsb2NrKClcblxuICAgIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpXG4gICAgamFzbWluZS5hdHRhY2hUb0RPTSh3b3Jrc3BhY2VFbGVtZW50KVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZShcIm1hcmtkb3duLW1pbmRtYXBcIilcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWdmbScpXG5cbiAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lID0gLT5cbiAgICBydW5zIC0+XG4gICAgICBleHBlY3QoYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKSkudG9IYXZlTGVuZ3RoIDJcblxuICAgIHdhaXRzRm9yIFwiTWFya2Rvd24gTWluZG1hcCB0byBiZSBjcmVhdGVkXCIsIC0+XG4gICAgICBwcmV2aWV3ID0gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZXMoKVsxXS5nZXRBY3RpdmVJdGVtKClcblxuICAgIHJ1bnMgLT5cbiAgICAgIGV4cGVjdChwcmV2aWV3KS50b0JlSW5zdGFuY2VPZihNYXJrZG93bk1pbmRtYXBWaWV3KVxuICAgICAgZXhwZWN0KHByZXZpZXcuZ2V0UGF0aCgpKS50b0JlIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkuZ2V0UGF0aCgpXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIGEgcHJldmlldyBoYXMgbm90IGJlZW4gY3JlYXRlZCBmb3IgdGhlIGZpbGVcIiwgLT5cbiAgICBpdCBcImRpc3BsYXlzIGEgTWFya2Rvd24gTWluZG1hcCBpbiBhIHNwbGl0IHBhbmVcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwic3ViZGlyL2ZpbGUubWFya2Rvd25cIilcbiAgICAgIHJ1bnMgLT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LCAnbWFya2Rvd24tbWluZG1hcDp0b2dnbGUnXG4gICAgICBleHBlY3RQcmV2aWV3SW5TcGxpdFBhbmUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIFtlZGl0b3JQYW5lXSA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClcbiAgICAgICAgZXhwZWN0KGVkaXRvclBhbmUuZ2V0SXRlbXMoKSkudG9IYXZlTGVuZ3RoIDFcbiAgICAgICAgZXhwZWN0KGVkaXRvclBhbmUuaXNBY3RpdmUoKSkudG9CZSB0cnVlXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGhlIGVkaXRvcidzIHBhdGggZG9lcyBub3QgZXhpc3RcIiwgLT5cbiAgICAgIGl0IFwic3BsaXRzIHRoZSBjdXJyZW50IHBhbmUgdG8gdGhlIHJpZ2h0IHdpdGggYSBNYXJrZG93biBNaW5kbWFwIGZvciB0aGUgZmlsZVwiLCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcIm5ldy5tYXJrZG93blwiKVxuICAgICAgICBydW5zIC0+IGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ21hcmtkb3duLW1pbmRtYXA6dG9nZ2xlJ1xuICAgICAgICBleHBlY3RQcmV2aWV3SW5TcGxpdFBhbmUoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBlZGl0b3IgZG9lcyBub3QgaGF2ZSBhIHBhdGhcIiwgLT5cbiAgICAgIGl0IFwic3BsaXRzIHRoZSBjdXJyZW50IHBhbmUgdG8gdGhlIHJpZ2h0IHdpdGggYSBNYXJrZG93biBNaW5kbWFwIGZvciB0aGUgZmlsZVwiLCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcIlwiKVxuICAgICAgICBydW5zIC0+IGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ21hcmtkb3duLW1pbmRtYXA6dG9nZ2xlJ1xuICAgICAgICBleHBlY3RQcmV2aWV3SW5TcGxpdFBhbmUoKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBwYXRoIGNvbnRhaW5zIGEgc3BhY2VcIiwgLT5cbiAgICAgIGl0IFwicmVuZGVycyB0aGUgcHJldmlld1wiLCAtPlxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcInN1YmRpci9maWxlIHdpdGggc3BhY2UubWRcIilcbiAgICAgICAgcnVucyAtPiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdtYXJrZG93bi1taW5kbWFwOnRvZ2dsZSdcbiAgICAgICAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lKClcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgcGF0aCBjb250YWlucyBhY2NlbnRlZCBjaGFyYWN0ZXJzXCIsIC0+XG4gICAgICBpdCBcInJlbmRlcnMgdGhlIHByZXZpZXdcIiwgLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXCJzdWJkaXIvw6FjY8OpbnTDqWQubWRcIilcbiAgICAgICAgcnVucyAtPiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdtYXJrZG93bi1taW5kbWFwOnRvZ2dsZSdcbiAgICAgICAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lKClcblxuICBkZXNjcmliZSBcIndoZW4gYSBwcmV2aWV3IGhhcyBiZWVuIGNyZWF0ZWQgZm9yIHRoZSBmaWxlXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXCJzdWJkaXIvZmlsZS5tYXJrZG93blwiKVxuICAgICAgcnVucyAtPiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdtYXJrZG93bi1taW5kbWFwOnRvZ2dsZSdcbiAgICAgIGV4cGVjdFByZXZpZXdJblNwbGl0UGFuZSgpXG5cbiAgICBpdCBcImNsb3NlcyB0aGUgZXhpc3RpbmcgcHJldmlldyB3aGVuIHRvZ2dsZSBpcyB0cmlnZ2VyZWQgYSBzZWNvbmQgdGltZSBvbiB0aGUgZWRpdG9yXCIsIC0+XG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdtYXJrZG93bi1taW5kbWFwOnRvZ2dsZSdcblxuICAgICAgW2VkaXRvclBhbmUsIHByZXZpZXdQYW5lXSA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClcbiAgICAgIGV4cGVjdChlZGl0b3JQYW5lLmlzQWN0aXZlKCkpLnRvQmUgdHJ1ZVxuICAgICAgZXhwZWN0KHByZXZpZXdQYW5lLmdldEFjdGl2ZUl0ZW0oKSkudG9CZVVuZGVmaW5lZCgpXG5cbiAgICBpdCBcImNsb3NlcyB0aGUgZXhpc3RpbmcgcHJldmlldyB3aGVuIHRvZ2dsZSBpcyB0cmlnZ2VyZWQgb24gaXQgYW5kIGl0IGhhcyBmb2N1c1wiLCAtPlxuICAgICAgW2VkaXRvclBhbmUsIHByZXZpZXdQYW5lXSA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClcbiAgICAgIHByZXZpZXdQYW5lLmFjdGl2YXRlKClcblxuICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LCAnbWFya2Rvd24tbWluZG1hcDp0b2dnbGUnXG4gICAgICBleHBlY3QocHJldmlld1BhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlVW5kZWZpbmVkKClcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgZWRpdG9yIGlzIG1vZGlmaWVkXCIsIC0+XG4gICAgICBpdCBcInJlLXJlbmRlcnMgdGhlIHByZXZpZXdcIiwgLT5cbiAgICAgICAgc3B5T24ocHJldmlldywgJ3Nob3dMb2FkaW5nJylcblxuICAgICAgICBtYXJrZG93bkVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgICBtYXJrZG93bkVkaXRvci5zZXRUZXh0IFwiSGV5IVwiXG5cbiAgICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgICBwcmV2aWV3LnRleHQoKS5pbmRleE9mKFwiSGV5IVwiKSA+PSAwXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChwcmV2aWV3LnNob3dMb2FkaW5nKS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpXG5cbiAgICAgIGl0IFwiaW52b2tlcyA6Om9uRGlkQ2hhbmdlTWFya2Rvd24gbGlzdGVuZXJzXCIsIC0+XG4gICAgICAgIG1hcmtkb3duRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgIHByZXZpZXcub25EaWRDaGFuZ2VNYXJrZG93bihsaXN0ZW5lciA9IGphc21pbmUuY3JlYXRlU3B5KCdkaWRDaGFuZ2VNYXJrZG93bkxpc3RlbmVyJykpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIG1hcmtkb3duRWRpdG9yLnNldFRleHQoXCJIZXkhXCIpXG5cbiAgICAgICAgd2FpdHNGb3IgXCI6Om9uRGlkQ2hhbmdlTWFya2Rvd24gaGFuZGxlciB0byBiZSBjYWxsZWRcIiwgLT5cbiAgICAgICAgICBsaXN0ZW5lci5jYWxsQ291bnQgPiAwXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgcHJldmlldyBpcyBpbiB0aGUgYWN0aXZlIHBhbmUgYnV0IGlzIG5vdCB0aGUgYWN0aXZlIGl0ZW1cIiwgLT5cbiAgICAgICAgaXQgXCJyZS1yZW5kZXJzIHRoZSBwcmV2aWV3IGJ1dCBkb2VzIG5vdCBtYWtlIGl0IGFjdGl2ZVwiLCAtPlxuICAgICAgICAgIG1hcmtkb3duRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgcHJldmlld1BhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lcygpWzFdXG4gICAgICAgICAgcHJldmlld1BhbmUuYWN0aXZhdGUoKVxuXG4gICAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKClcblxuICAgICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICAgIG1hcmtkb3duRWRpdG9yLnNldFRleHQoXCJIZXkhXCIpXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgcHJldmlldy50ZXh0KCkuaW5kZXhPZihcIkhleSFcIikgPj0gMFxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KHByZXZpZXdQYW5lLmlzQWN0aXZlKCkpLnRvQmUgdHJ1ZVxuICAgICAgICAgICAgZXhwZWN0KHByZXZpZXdQYW5lLmdldEFjdGl2ZUl0ZW0oKSkubm90LnRvQmUgcHJldmlld1xuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIHByZXZpZXcgaXMgbm90IHRoZSBhY3RpdmUgaXRlbSBhbmQgbm90IGluIHRoZSBhY3RpdmUgcGFuZVwiLCAtPlxuICAgICAgICBpdCBcInJlLXJlbmRlcnMgdGhlIHByZXZpZXcgYW5kIG1ha2VzIGl0IGFjdGl2ZVwiLCAtPlxuICAgICAgICAgIG1hcmtkb3duRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICAgICAgW2VkaXRvclBhbmUsIHByZXZpZXdQYW5lXSA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVzKClcbiAgICAgICAgICBwcmV2aWV3UGFuZS5zcGxpdFJpZ2h0KGNvcHlBY3RpdmVJdGVtOiB0cnVlKVxuICAgICAgICAgIHByZXZpZXdQYW5lLmFjdGl2YXRlKClcblxuICAgICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbigpXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBlZGl0b3JQYW5lLmFjdGl2YXRlKClcbiAgICAgICAgICAgIG1hcmtkb3duRWRpdG9yLnNldFRleHQoXCJIZXkhXCIpXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgcHJldmlldy50ZXh0KCkuaW5kZXhPZihcIkhleSFcIikgPj0gMFxuXG4gICAgICAgICAgcnVucyAtPlxuICAgICAgICAgICAgZXhwZWN0KGVkaXRvclBhbmUuaXNBY3RpdmUoKSkudG9CZSB0cnVlXG4gICAgICAgICAgICBleHBlY3QocHJldmlld1BhbmUuZ2V0QWN0aXZlSXRlbSgpKS50b0JlIHByZXZpZXdcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBsaXZlVXBkYXRlIGNvbmZpZyBpcyBzZXQgdG8gZmFsc2VcIiwgLT5cbiAgICAgICAgaXQgXCJvbmx5IHJlLXJlbmRlcnMgdGhlIG1hcmtkb3duIHdoZW4gdGhlIGVkaXRvciBpcyBzYXZlZCwgbm90IHdoZW4gdGhlIGNvbnRlbnRzIGFyZSBtb2RpZmllZFwiLCAtPlxuICAgICAgICAgIGF0b20uY29uZmlnLnNldCAnbWFya2Rvd24tbWluZG1hcC5saXZlVXBkYXRlJywgZmFsc2VcblxuICAgICAgICAgIGRpZFN0b3BDaGFuZ2luZ0hhbmRsZXIgPSBqYXNtaW5lLmNyZWF0ZVNweSgnZGlkU3RvcENoYW5naW5nSGFuZGxlcicpXG4gICAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldEJ1ZmZlcigpLm9uRGlkU3RvcENoYW5naW5nIGRpZFN0b3BDaGFuZ2luZ0hhbmRsZXJcbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuc2V0VGV4dCgnY2ggY2ggY2hhbmdlcycpXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgZGlkU3RvcENoYW5naW5nSGFuZGxlci5jYWxsQ291bnQgPiAwXG5cbiAgICAgICAgICBydW5zIC0+XG4gICAgICAgICAgICBleHBlY3QocHJldmlldy50ZXh0KCkpLm5vdC50b0NvbnRhaW4oXCJjaCBjaCBjaGFuZ2VzXCIpXG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuc2F2ZSgpXG5cbiAgICAgICAgICB3YWl0c0ZvciAtPlxuICAgICAgICAgICAgcHJldmlldy50ZXh0KCkuaW5kZXhPZihcImNoIGNoIGNoYW5nZXNcIikgPj0gMFxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIGEgbmV3IGdyYW1tYXIgaXMgbG9hZGVkXCIsIC0+XG4gICAgICBpdCBcInJlLXJlbmRlcnMgdGhlIHByZXZpZXdcIiwgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLnNldFRleHQgXCJcIlwiXG4gICAgICAgICAgYGBgamF2YXNjcmlwdFxuICAgICAgICAgIHZhciB4ID0geTtcbiAgICAgICAgICBgYGBcbiAgICAgICAgXCJcIlwiXG5cbiAgICAgICAgd2FpdHNGb3IgXCJtYXJrZG93biB0byBiZSByZW5kZXJlZCBhZnRlciBpdHMgdGV4dCBjaGFuZ2VkXCIsIC0+XG4gICAgICAgICAgcHJldmlldy5maW5kKFwiYXRvbS10ZXh0LWVkaXRvclwiKS5kYXRhKFwiZ3JhbW1hclwiKSBpcyBcInRleHQgcGxhaW4gbnVsbC1ncmFtbWFyXCJcblxuICAgICAgICBncmFtbWFyQWRkZWQgPSBmYWxzZVxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgYXRvbS5ncmFtbWFycy5vbkRpZEFkZEdyYW1tYXIgLT4gZ3JhbW1hckFkZGVkID0gdHJ1ZVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGV4cGVjdChhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUFjdGl2ZSgnbGFuZ3VhZ2UtamF2YXNjcmlwdCcpKS50b0JlIGZhbHNlXG4gICAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWphdmFzY3JpcHQnKVxuXG4gICAgICAgIHdhaXRzRm9yIFwiZ3JhbW1hciB0byBiZSBhZGRlZFwiLCAtPiBncmFtbWFyQWRkZWRcblxuICAgICAgICB3YWl0c0ZvciBcIm1hcmtkb3duIHRvIGJlIHJlbmRlcmVkIGFmdGVyIGdyYW1tYXIgd2FzIGFkZGVkXCIsIC0+XG4gICAgICAgICAgcHJldmlldy5maW5kKFwiYXRvbS10ZXh0LWVkaXRvclwiKS5kYXRhKFwiZ3JhbW1hclwiKSBpc250IFwic291cmNlIGpzXCJcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIE1hcmtkb3duIE1pbmRtYXAgdmlldyBpcyByZXF1ZXN0ZWQgYnkgZmlsZSBVUklcIiwgLT5cbiAgICBpdCBcIm9wZW5zIGEgcHJldmlldyBlZGl0b3IgYW5kIHdhdGNoZXMgdGhlIGZpbGUgZm9yIGNoYW5nZXNcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSBcImF0b20ud29ya3NwYWNlLm9wZW4gcHJvbWlzZSB0byBiZSByZXNvbHZlZFwiLCAtPlxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKFwibWFya2Rvd24tbWluZG1hcDovLyN7YXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMF0ucmVzb2x2ZSgnc3ViZGlyL2ZpbGUubWFya2Rvd24nKX1cIilcblxuICAgICAgcnVucyAtPlxuICAgICAgICBwcmV2aWV3ID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZUl0ZW0oKVxuICAgICAgICBleHBlY3QocHJldmlldykudG9CZUluc3RhbmNlT2YoTWFya2Rvd25NaW5kbWFwVmlldylcblxuICAgICAgICBzcHlPbihwcmV2aWV3LCAncmVuZGVyTWFya2Rvd25UZXh0JylcbiAgICAgICAgcHJldmlldy5maWxlLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZScpXG5cbiAgICAgIHdhaXRzRm9yIFwibWFya2Rvd24gdG8gYmUgcmUtcmVuZGVyZWQgYWZ0ZXIgZmlsZSBjaGFuZ2VkXCIsIC0+XG4gICAgICAgIHByZXZpZXcucmVuZGVyTWFya2Rvd25UZXh0LmNhbGxDb3VudCA+IDBcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIGVkaXRvcidzIGdyYW1tYXIgaXQgbm90IGVuYWJsZWQgZm9yIHByZXZpZXdcIiwgLT5cbiAgICBpdCBcImRvZXMgbm90IG9wZW4gdGhlIE1hcmtkb3duIE1pbmRtYXBcIiwgLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCgnbWFya2Rvd24tbWluZG1hcC5ncmFtbWFycycsIFtdKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihcInN1YmRpci9maWxlLm1hcmtkb3duXCIpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgc3B5T24oYXRvbS53b3Jrc3BhY2UsICdvcGVuJykuYW5kQ2FsbFRocm91Z2goKVxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdtYXJrZG93bi1taW5kbWFwOnRvZ2dsZSdcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLm9wZW4pLm5vdC50b0hhdmVCZWVuQ2FsbGVkKClcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIGVkaXRvcidzIHBhdGggY2hhbmdlcyBvbiAjd2luMzIgYW5kICNkYXJ3aW5cIiwgLT5cbiAgICBpdCBcInVwZGF0ZXMgdGhlIHByZXZpZXcncyB0aXRsZVwiLCAtPlxuICAgICAgdGl0bGVDaGFuZ2VkQ2FsbGJhY2sgPSBqYXNtaW5lLmNyZWF0ZVNweSgndGl0bGVDaGFuZ2VkQ2FsbGJhY2snKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcInN1YmRpci9maWxlLm1hcmtkb3duXCIpXG4gICAgICBydW5zIC0+IGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ21hcmtkb3duLW1pbmRtYXA6dG9nZ2xlJ1xuXG4gICAgICBleHBlY3RQcmV2aWV3SW5TcGxpdFBhbmUoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChwcmV2aWV3LmdldFRpdGxlKCkpLnRvQmUgJ2ZpbGUuTWFya2Rvd24gTWluZG1hcCdcbiAgICAgICAgcHJldmlldy5vbkRpZENoYW5nZVRpdGxlKHRpdGxlQ2hhbmdlZENhbGxiYWNrKVxuICAgICAgICBmcy5yZW5hbWVTeW5jKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRQYXRoKCksIHBhdGguam9pbihwYXRoLmRpcm5hbWUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKSksICdmaWxlMi5tZCcpKVxuXG4gICAgICB3YWl0c0ZvciAtPlxuICAgICAgICBwcmV2aWV3LmdldFRpdGxlKCkgaXMgXCJmaWxlMi5tZCBNaW5kbWFwXCJcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QodGl0bGVDaGFuZ2VkQ2FsbGJhY2spLnRvSGF2ZUJlZW5DYWxsZWQoKVxuXG4gIGRlc2NyaWJlIFwid2hlbiB0aGUgVVJJIG9wZW5lZCBkb2VzIG5vdCBoYXZlIGEgbWFya2Rvd24tbWluZG1hcCBwcm90b2NvbFwiLCAtPlxuICAgIGl0IFwiZG9lcyBub3QgdGhyb3cgYW4gZXJyb3IgdHJ5aW5nIHRvIGRlY29kZSB0aGUgVVJJIChyZWdyZXNzaW9uKVwiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oJyUnKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpLnRvQmVUcnV0aHkoKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBtYXJrZG93bi1taW5kbWFwOmNvcHktaHRtbCBpcyB0cmlnZ2VyZWRcIiwgLT5cbiAgICBpdCBcImNvcGllcyB0aGUgSFRNTCB0byB0aGUgY2xpcGJvYXJkXCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihcInN1YmRpci9zaW1wbGUubWRcIilcblxuICAgICAgcnVucyAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdtYXJrZG93bi1taW5kbWFwOmNvcHktaHRtbCdcbiAgICAgICAgZXhwZWN0KGF0b20uY2xpcGJvYXJkLnJlYWQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICA8cD48ZW0+aXRhbGljPC9lbT48L3A+XG4gICAgICAgICAgPHA+PHN0cm9uZz5ib2xkPC9zdHJvbmc+PC9wPlxuICAgICAgICAgIDxwPmVuY29kaW5nIFxcdTIxOTIgaXNzdWU8L3A+XG4gICAgICAgIFwiXCJcIlxuXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlIFtbMCwgMF0sIFsxLCAwXV1cbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LCAnbWFya2Rvd24tbWluZG1hcDpjb3B5LWh0bWwnXG4gICAgICAgIGV4cGVjdChhdG9tLmNsaXBib2FyZC5yZWFkKCkpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgPHA+PGVtPml0YWxpYzwvZW0+PC9wPlxuICAgICAgICBcIlwiXCJcblxuICAgIGRlc2NyaWJlIFwiY29kZSBibG9jayB0b2tlbml6YXRpb25cIiwgLT5cbiAgICAgIHByZXZpZXcgPSBudWxsXG5cbiAgICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLXJ1YnknKVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdtYXJrZG93bi1taW5kbWFwJylcblxuICAgICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKFwic3ViZGlyL2ZpbGUubWFya2Rvd25cIilcblxuICAgICAgICBydW5zIC0+XG4gICAgICAgICAgd29ya3NwYWNlRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdtYXJrZG93bi1taW5kbWFwOmNvcHktaHRtbCdcbiAgICAgICAgICBwcmV2aWV3ID0gJCgnPGRpdj4nKS5hcHBlbmQoYXRvbS5jbGlwYm9hcmQucmVhZCgpKVxuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIGNvZGUgYmxvY2sncyBmZW5jZSBuYW1lIGhhcyBhIG1hdGNoaW5nIGdyYW1tYXJcIiwgLT5cbiAgICAgICAgaXQgXCJ0b2tlbml6ZXMgdGhlIGNvZGUgYmxvY2sgd2l0aCB0aGUgZ3JhbW1hclwiLCAtPlxuICAgICAgICAgIGV4cGVjdChwcmV2aWV3LmZpbmQoXCJwcmUgc3Bhbi5lbnRpdHkubmFtZS5mdW5jdGlvbi5ydWJ5XCIpKS50b0V4aXN0KClcblxuICAgICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBjb2RlIGJsb2NrJ3MgZmVuY2UgbmFtZSBkb2Vzbid0IGhhdmUgYSBtYXRjaGluZyBncmFtbWFyXCIsIC0+XG4gICAgICAgIGl0IFwiZG9lcyBub3QgdG9rZW5pemUgdGhlIGNvZGUgYmxvY2tcIiwgLT5cbiAgICAgICAgICBleHBlY3QocHJldmlldy5maW5kKFwicHJlLmxhbmcta29tYnVjaGEgLmxpbmUgLm51bGwtZ3JhbW1hclwiKS5jaGlsZHJlbigpLmxlbmd0aCkudG9CZSAyXG5cbiAgICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgY29kZSBibG9jayBjb250YWlucyBlbXB0eSBsaW5lc1wiLCAtPlxuICAgICAgICBpdCBcImRvZXNuJ3QgcmVtb3ZlIHRoZSBlbXB0eSBsaW5lc1wiLCAtPlxuICAgICAgICAgIGV4cGVjdChwcmV2aWV3LmZpbmQoXCJwcmUubGFuZy1weXRob25cIikuY2hpbGRyZW4oKS5sZW5ndGgpLnRvQmUgNlxuICAgICAgICAgIGV4cGVjdChwcmV2aWV3LmZpbmQoXCJwcmUubGFuZy1weXRob24gZGl2Om50aC1jaGlsZCgyKVwiKS50ZXh0KCkudHJpbSgpKS50b0JlICcnXG4gICAgICAgICAgZXhwZWN0KHByZXZpZXcuZmluZChcInByZS5sYW5nLXB5dGhvbiBkaXY6bnRoLWNoaWxkKDQpXCIpLnRleHQoKS50cmltKCkpLnRvQmUgJydcbiAgICAgICAgICBleHBlY3QocHJldmlldy5maW5kKFwicHJlLmxhbmctcHl0aG9uIGRpdjpudGgtY2hpbGQoNSlcIikudGV4dCgpLnRyaW0oKSkudG9CZSAnJ1xuXG4gICAgICBkZXNjcmliZSBcIndoZW4gdGhlIGNvZGUgYmxvY2sgaXMgbmVzdGVkIGluIGEgbGlzdFwiLCAtPlxuICAgICAgICBpdCBcImRldGVjdHMgYW5kIHN0eWxlcyB0aGUgYmxvY2tcIiwgLT5cbiAgICAgICAgICBleHBlY3QocHJldmlldy5maW5kKFwicHJlLmxhbmctamF2YXNjcmlwdFwiKSkudG9IYXZlQ2xhc3MgJ2VkaXRvci1jb2xvcnMnXG5cbiAgZGVzY3JpYmUgXCJzYW5pdGl6YXRpb25cIiwgLT5cbiAgICBpdCBcInJlbW92ZXMgc2NyaXB0IHRhZ3MgYW5kIGF0dHJpYnV0ZXMgdGhhdCBjb21tb25seSBjb250YWluIGlubGluZSBzY3JpcHRzXCIsIC0+XG4gICAgICB3YWl0c0ZvclByb21pc2UgLT4gYXRvbS53b3Jrc3BhY2Uub3BlbihcInN1YmRpci9ldmlsLm1kXCIpXG4gICAgICBydW5zIC0+IGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ21hcmtkb3duLW1pbmRtYXA6dG9nZ2xlJ1xuICAgICAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QocHJldmlld1swXS5pbm5lckhUTUwpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgPHA+aGVsbG88L3A+XG4gICAgICAgICAgPHA+PC9wPlxuICAgICAgICAgIDxwPlxuICAgICAgICAgIDxpbWc+XG4gICAgICAgICAgd29ybGQ8L3A+XG4gICAgICAgIFwiXCJcIlxuXG4gICAgaXQgXCJyZW1vdmUgdGhlIGZpcnN0IDwhZG9jdHlwZT4gdGFnIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGZpbGVcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwic3ViZGlyL2RvY3R5cGUtdGFnLm1kXCIpXG4gICAgICBydW5zIC0+IGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ21hcmtkb3duLW1pbmRtYXA6dG9nZ2xlJ1xuICAgICAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QocHJldmlld1swXS5pbm5lckhUTUwpLnRvQmUgXCJcIlwiXG4gICAgICAgICAgPHA+Y29udGVudFxuICAgICAgICAgICZsdDshZG9jdHlwZSBodG1sJmd0OzwvcD5cbiAgICAgICAgXCJcIlwiXG5cbiAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBtYXJrZG93biBjb250YWlucyBhbiA8aHRtbD4gdGFnXCIsIC0+XG4gICAgaXQgXCJkb2VzIG5vdCB0aHJvdyBhbiBleGNlcHRpb25cIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwic3ViZGlyL2h0bWwtdGFnLm1kXCIpXG4gICAgICBydW5zIC0+IGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ21hcmtkb3duLW1pbmRtYXA6dG9nZ2xlJ1xuICAgICAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lKClcblxuICAgICAgcnVucyAtPiBleHBlY3QocHJldmlld1swXS5pbm5lckhUTUwpLnRvQmUgXCJjb250ZW50XCJcblxuICBkZXNjcmliZSBcIndoZW4gdGhlIG1hcmtkb3duIGNvbnRhaW5zIGEgPHByZT4gdGFnXCIsIC0+XG4gICAgaXQgXCJkb2VzIG5vdCB0aHJvdyBhbiBleGNlcHRpb25cIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwic3ViZGlyL3ByZS10YWcubWRcIilcbiAgICAgIHJ1bnMgLT4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaCB3b3Jrc3BhY2VFbGVtZW50LCAnbWFya2Rvd24tbWluZG1hcDp0b2dnbGUnXG4gICAgICBleHBlY3RQcmV2aWV3SW5TcGxpdFBhbmUoKVxuXG4gICAgICBydW5zIC0+IGV4cGVjdChwcmV2aWV3LmZpbmQoJ2F0b20tdGV4dC1lZGl0b3InKSkudG9FeGlzdCgpXG5cbiAgZGVzY3JpYmUgXCJHaXRIdWIgc3R5bGUgTWFya2Rvd24gTWluZG1hcFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIGF0b20uY29uZmlnLnNldCAnbWFya2Rvd24tbWluZG1hcC51c2VHaXRIdWJTdHlsZScsIGZhbHNlXG5cbiAgICBpdCBcInJlbmRlcnMgbWFya2Rvd24gdXNpbmcgdGhlIGRlZmF1bHQgc3R5bGUgd2hlbiBHaXRIdWIgc3R5bGluZyBpcyBkaXNhYmxlZFwiLCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+IGF0b20ud29ya3NwYWNlLm9wZW4oXCJzdWJkaXIvc2ltcGxlLm1kXCIpXG4gICAgICBydW5zIC0+IGF0b20uY29tbWFuZHMuZGlzcGF0Y2ggd29ya3NwYWNlRWxlbWVudCwgJ21hcmtkb3duLW1pbmRtYXA6dG9nZ2xlJ1xuICAgICAgZXhwZWN0UHJldmlld0luU3BsaXRQYW5lKClcblxuICAgICAgcnVucyAtPiBleHBlY3QocHJldmlldy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS11c2UtZ2l0aHViLXN0eWxlJykpLnRvQmVOdWxsKClcblxuICAgIGl0IFwicmVuZGVycyBtYXJrZG93biB1c2luZyB0aGUgR2l0SHViIHN0eWxpbmcgd2hlbiBlbmFibGVkXCIsIC0+XG4gICAgICBhdG9tLmNvbmZpZy5zZXQgJ21hcmtkb3duLW1pbmRtYXAudXNlR2l0SHViU3R5bGUnLCB0cnVlXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwic3ViZGlyL3NpbXBsZS5tZFwiKVxuICAgICAgcnVucyAtPiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdtYXJrZG93bi1taW5kbWFwOnRvZ2dsZSdcbiAgICAgIGV4cGVjdFByZXZpZXdJblNwbGl0UGFuZSgpXG5cbiAgICAgIHJ1bnMgLT4gZXhwZWN0KHByZXZpZXcuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXNlLWdpdGh1Yi1zdHlsZScpKS50b0JlICcnXG5cbiAgICBpdCBcInVwZGF0ZXMgdGhlIHJlbmRlcmluZyBzdHlsZSBpbW1lZGlhdGVseSB3aGVuIHRoZSBjb25maWd1cmF0aW9uIGlzIGNoYW5nZWRcIiwgLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPiBhdG9tLndvcmtzcGFjZS5vcGVuKFwic3ViZGlyL3NpbXBsZS5tZFwiKVxuICAgICAgcnVucyAtPiBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHdvcmtzcGFjZUVsZW1lbnQsICdtYXJrZG93bi1taW5kbWFwOnRvZ2dsZSdcbiAgICAgIGV4cGVjdFByZXZpZXdJblNwbGl0UGFuZSgpXG5cbiAgICAgIHJ1bnMgLT5cbiAgICAgICAgZXhwZWN0KHByZXZpZXcuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXNlLWdpdGh1Yi1zdHlsZScpKS50b0JlTnVsbCgpXG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0ICdtYXJrZG93bi1taW5kbWFwLnVzZUdpdEh1YlN0eWxlJywgdHJ1ZVxuICAgICAgICBleHBlY3QocHJldmlldy5lbGVtZW50LmdldEF0dHJpYnV0ZSgnZGF0YS11c2UtZ2l0aHViLXN0eWxlJykpLm5vdC50b0JlTnVsbCgpXG5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0ICdtYXJrZG93bi1taW5kbWFwLnVzZUdpdEh1YlN0eWxlJywgZmFsc2VcbiAgICAgICAgZXhwZWN0KHByZXZpZXcuZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXNlLWdpdGh1Yi1zdHlsZScpKS50b0JlTnVsbCgpXG4iXX0=
