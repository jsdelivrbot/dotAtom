(function() {
  var MarkdownMindmapView, fs, path, temp;

  path = require('path');

  fs = require('fs-plus');

  temp = require('temp');

  MarkdownMindmapView = require('../lib/markdown-mindmap-view');

  describe("MarkdownMindmapView", function() {
    var file, preview, ref, workspaceElement;
    ref = [], file = ref[0], preview = ref[1], workspaceElement = ref[2];
    beforeEach(function() {
      var filePath;
      filePath = atom.project.getDirectories()[0].resolve('subdir/file.markdown');
      preview = new MarkdownMindmapView({
        filePath: filePath
      });
      jasmine.attachToDOM(preview.element);
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-ruby');
      });
      waitsForPromise(function() {
        return atom.packages.activatePackage('language-javascript');
      });
      return waitsForPromise(function() {
        return atom.packages.activatePackage('markdown-mindmap');
      });
    });
    afterEach(function() {
      return preview.destroy();
    });
    describe("::constructor", function() {
      it("shows a loading spinner and renders the markdown", function() {
        preview.showLoading();
        expect(preview.find('.markdown-spinner')).toExist();
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        return runs(function() {
          return expect(preview.find(".emoji")).toExist();
        });
      });
      return it("shows an error message when there is an error", function() {
        preview.showError("Not a real file");
        return expect(preview.text()).toContain("Failed");
      });
    });
    describe("serialization", function() {
      var newPreview;
      newPreview = null;
      afterEach(function() {
        return newPreview.destroy();
      });
      it("recreates the file when serialized/deserialized", function() {
        newPreview = atom.deserializers.deserialize(preview.serialize());
        jasmine.attachToDOM(newPreview.element);
        return expect(newPreview.getPath()).toBe(preview.getPath());
      });
      return it("serializes the editor id when opened for an editor", function() {
        preview.destroy();
        waitsForPromise(function() {
          return atom.workspace.open('new.markdown');
        });
        return runs(function() {
          preview = new MarkdownMindmapView({
            editorId: atom.workspace.getActiveTextEditor().id
          });
          jasmine.attachToDOM(preview.element);
          expect(preview.getPath()).toBe(atom.workspace.getActiveTextEditor().getPath());
          newPreview = atom.deserializers.deserialize(preview.serialize());
          jasmine.attachToDOM(newPreview.element);
          return expect(newPreview.getPath()).toBe(preview.getPath());
        });
      });
    });
    describe("code block conversion to atom-text-editor tags", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return preview.renderMarkdown();
        });
      });
      it("removes line decorations on rendered code blocks", function() {
        var decorations, editor;
        editor = preview.find("atom-text-editor[data-grammar='text plain null-grammar']");
        decorations = editor[0].getModel().getDecorations({
          "class": 'cursor-line',
          type: 'line'
        });
        return expect(decorations.length).toBe(0);
      });
      describe("when the code block's fence name has a matching grammar", function() {
        return it("assigns the grammar on the atom-text-editor", function() {
          var jsEditor, rubyEditor;
          rubyEditor = preview.find("atom-text-editor[data-grammar='source ruby']");
          expect(rubyEditor).toExist();
          expect(rubyEditor[0].getModel().getText()).toBe("def func\n  x = 1\nend");
          jsEditor = preview.find("atom-text-editor[data-grammar='source js']");
          expect(jsEditor).toExist();
          return expect(jsEditor[0].getModel().getText()).toBe("if a === 3 {\nb = 5\n}");
        });
      });
      return describe("when the code block's fence name doesn't have a matching grammar", function() {
        return it("does not assign a specific grammar", function() {
          var plainEditor;
          plainEditor = preview.find("atom-text-editor[data-grammar='text plain null-grammar']");
          expect(plainEditor).toExist();
          return expect(plainEditor[0].getModel().getText()).toBe("function f(x) {\n  return x++;\n}");
        });
      });
    });
    describe("image resolving", function() {
      beforeEach(function() {
        return waitsForPromise(function() {
          return preview.renderMarkdown();
        });
      });
      describe("when the image uses a relative path", function() {
        return it("resolves to a path relative to the file", function() {
          var image;
          image = preview.find("img[alt=Image1]");
          return expect(image.attr('src')).toBe(atom.project.getDirectories()[0].resolve('subdir/image1.png'));
        });
      });
      describe("when the image uses an absolute path that does not exist", function() {
        return it("resolves to a path relative to the project root", function() {
          var image;
          image = preview.find("img[alt=Image2]");
          return expect(image.attr('src')).toBe(atom.project.getDirectories()[0].resolve('tmp/image2.png'));
        });
      });
      describe("when the image uses an absolute path that exists", function() {
        return it("doesn't change the URL", function() {
          var filePath;
          preview.destroy();
          filePath = path.join(temp.mkdirSync('atom'), 'foo.md');
          fs.writeFileSync(filePath, "![absolute](" + filePath + ")");
          preview = new MarkdownMindmapView({
            filePath: filePath
          });
          jasmine.attachToDOM(preview.element);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            return expect(preview.find("img[alt=absolute]").attr('src')).toBe(filePath);
          });
        });
      });
      return describe("when the image uses a web URL", function() {
        return it("doesn't change the URL", function() {
          var image;
          image = preview.find("img[alt=Image3]");
          return expect(image.attr('src')).toBe('http://github.com/image3.png');
        });
      });
    });
    describe("gfm newlines", function() {
      describe("when gfm newlines are not enabled", function() {
        return it("creates a single paragraph with <br>", function() {
          atom.config.set('markdown-mindmap.breakOnSingleNewline', false);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            return expect(preview.find("p:last-child br").length).toBe(0);
          });
        });
      });
      return describe("when gfm newlines are enabled", function() {
        return it("creates a single paragraph with no <br>", function() {
          atom.config.set('markdown-mindmap.breakOnSingleNewline', true);
          waitsForPromise(function() {
            return preview.renderMarkdown();
          });
          return runs(function() {
            return expect(preview.find("p:last-child br").length).toBe(1);
          });
        });
      });
    });
    describe("when core:save-as is triggered", function() {
      beforeEach(function() {
        var filePath;
        preview.destroy();
        filePath = atom.project.getDirectories()[0].resolve('subdir/code-block.md');
        preview = new MarkdownMindmapView({
          filePath: filePath
        });
        return jasmine.attachToDOM(preview.element);
      });
      it("saves the rendered HTML and opens it", function() {
        var atomTextEditorStyles, createRule, expectedFilePath, expectedOutput, markdownMindmapStyles, outputPath;
        outputPath = temp.path({
          suffix: '.html'
        });
        expectedFilePath = atom.project.getDirectories()[0].resolve('saved-html.html');
        expectedOutput = fs.readFileSync(expectedFilePath).toString();
        createRule = function(selector, css) {
          return {
            selectorText: selector,
            cssText: selector + " " + css
          };
        };
        markdownMindmapStyles = [
          {
            rules: [createRule(".markdown-mindmap", "{ color: orange; }")]
          }, {
            rules: [createRule(".not-included", "{ color: green; }"), createRule(".markdown-mindmap :host", "{ color: purple; }")]
          }
        ];
        atomTextEditorStyles = ["atom-text-editor .line { color: brown; }\natom-text-editor .number { color: cyan; }", "atom-text-editor :host .something { color: black; }", "atom-text-editor .hr { background: url(atom://markdown-mindmap/assets/hr.png); }"];
        expect(fs.isFileSync(outputPath)).toBe(false);
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        runs(function() {
          spyOn(atom, 'showSaveDialogSync').andReturn(outputPath);
          spyOn(preview, 'getDocumentStyleSheets').andReturn(markdownMindmapStyles);
          spyOn(preview, 'getTextEditorStyles').andReturn(atomTextEditorStyles);
          return atom.commands.dispatch(preview.element, 'core:save-as');
        });
        waitsFor(function() {
          var ref1;
          return fs.existsSync(outputPath) && ((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0) === fs.realpathSync(outputPath);
        });
        return runs(function() {
          expect(fs.isFileSync(outputPath)).toBe(true);
          return expect(atom.workspace.getActiveTextEditor().getText()).toBe(expectedOutput);
        });
      });
      return describe("text editor style extraction", function() {
        var extractedStyles, textEditorStyle, unrelatedStyle;
        extractedStyles = [][0];
        textEditorStyle = ".editor-style .extraction-test { color: blue; }";
        unrelatedStyle = ".something else { color: red; }";
        beforeEach(function() {
          atom.styles.addStyleSheet(textEditorStyle, {
            context: 'atom-text-editor'
          });
          atom.styles.addStyleSheet(unrelatedStyle, {
            context: 'unrelated-context'
          });
          return extractedStyles = preview.getTextEditorStyles();
        });
        it("returns an array containing atom-text-editor css style strings", function() {
          return expect(extractedStyles.indexOf(textEditorStyle)).toBeGreaterThan(-1);
        });
        return it("does not return other styles", function() {
          return expect(extractedStyles.indexOf(unrelatedStyle)).toBe(-1);
        });
      });
    });
    return describe("when core:copy is triggered", function() {
      return it("writes the rendered HTML to the clipboard", function() {
        var filePath;
        preview.destroy();
        preview.element.remove();
        filePath = atom.project.getDirectories()[0].resolve('subdir/code-block.md');
        preview = new MarkdownMindmapView({
          filePath: filePath
        });
        jasmine.attachToDOM(preview.element);
        waitsForPromise(function() {
          return preview.renderMarkdown();
        });
        runs(function() {
          return atom.commands.dispatch(preview.element, 'core:copy');
        });
        waitsFor(function() {
          return atom.clipboard.read() !== "initial clipboard content";
        });
        return runs(function() {
          return expect(atom.clipboard.read()).toBe("<h1 id=\"code-block\">Code Block</h1>\n<pre class=\"editor-colors lang-javascript\"><div class=\"line\"><span class=\"source js\"><span class=\"keyword control js\"><span>if</span></span><span>&nbsp;a&nbsp;</span><span class=\"keyword operator js\"><span>===</span></span><span>&nbsp;</span><span class=\"constant numeric js\"><span>3</span></span><span>&nbsp;</span><span class=\"meta brace curly js\"><span>{</span></span></span></div><div class=\"line\"><span class=\"source js\"><span>&nbsp;&nbsp;b&nbsp;</span><span class=\"keyword operator js\"><span>=</span></span><span>&nbsp;</span><span class=\"constant numeric js\"><span>5</span></span></span></div><div class=\"line\"><span class=\"source js\"><span class=\"meta brace curly js\"><span>}</span></span></span></div></pre>\n<p>encoding \u2192 issue</p>");
        });
      });
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21hcmtkb3duLW1pbmRtYXAvc3BlYy9tYXJrZG93bi1taW5kbWFwLXZpZXctc3BlYy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSw4QkFBUjs7RUFFdEIsUUFBQSxDQUFTLHFCQUFULEVBQWdDLFNBQUE7QUFDOUIsUUFBQTtJQUFBLE1BQW9DLEVBQXBDLEVBQUMsYUFBRCxFQUFPLGdCQUFQLEVBQWdCO0lBRWhCLFVBQUEsQ0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBQSxDQUE4QixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWpDLENBQXlDLHNCQUF6QztNQUNYLE9BQUEsR0FBYyxJQUFBLG1CQUFBLENBQW9CO1FBQUMsVUFBQSxRQUFEO09BQXBCO01BQ2QsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsT0FBTyxDQUFDLE9BQTVCO01BRUEsZUFBQSxDQUFnQixTQUFBO2VBQ2QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGVBQTlCO01BRGMsQ0FBaEI7TUFHQSxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIscUJBQTlCO01BRGMsQ0FBaEI7YUFHQSxlQUFBLENBQWdCLFNBQUE7ZUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsa0JBQTlCO01BRGMsQ0FBaEI7SUFYUyxDQUFYO0lBY0EsU0FBQSxDQUFVLFNBQUE7YUFDUixPQUFPLENBQUMsT0FBUixDQUFBO0lBRFEsQ0FBVjtJQUdBLFFBQUEsQ0FBUyxlQUFULEVBQTBCLFNBQUE7TUFDeEIsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUE7UUFDckQsT0FBTyxDQUFDLFdBQVIsQ0FBQTtRQUNBLE1BQUEsQ0FBTyxPQUFPLENBQUMsSUFBUixDQUFhLG1CQUFiLENBQVAsQ0FBeUMsQ0FBQyxPQUExQyxDQUFBO1FBRUEsZUFBQSxDQUFnQixTQUFBO2lCQUNkLE9BQU8sQ0FBQyxjQUFSLENBQUE7UUFEYyxDQUFoQjtlQUdBLElBQUEsQ0FBSyxTQUFBO2lCQUNILE1BQUEsQ0FBTyxPQUFPLENBQUMsSUFBUixDQUFhLFFBQWIsQ0FBUCxDQUE4QixDQUFDLE9BQS9CLENBQUE7UUFERyxDQUFMO01BUHFELENBQXZEO2FBVUEsRUFBQSxDQUFHLCtDQUFILEVBQW9ELFNBQUE7UUFDbEQsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsaUJBQWxCO2VBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxJQUFSLENBQUEsQ0FBUCxDQUFzQixDQUFDLFNBQXZCLENBQWlDLFFBQWpDO01BRmtELENBQXBEO0lBWHdCLENBQTFCO0lBZUEsUUFBQSxDQUFTLGVBQVQsRUFBMEIsU0FBQTtBQUN4QixVQUFBO01BQUEsVUFBQSxHQUFhO01BRWIsU0FBQSxDQUFVLFNBQUE7ZUFDUixVQUFVLENBQUMsT0FBWCxDQUFBO01BRFEsQ0FBVjtNQUdBLEVBQUEsQ0FBRyxpREFBSCxFQUFzRCxTQUFBO1FBQ3BELFVBQUEsR0FBYSxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQW5CLENBQStCLE9BQU8sQ0FBQyxTQUFSLENBQUEsQ0FBL0I7UUFDYixPQUFPLENBQUMsV0FBUixDQUFvQixVQUFVLENBQUMsT0FBL0I7ZUFDQSxNQUFBLENBQU8sVUFBVSxDQUFDLE9BQVgsQ0FBQSxDQUFQLENBQTRCLENBQUMsSUFBN0IsQ0FBa0MsT0FBTyxDQUFDLE9BQVIsQ0FBQSxDQUFsQztNQUhvRCxDQUF0RDthQUtBLEVBQUEsQ0FBRyxvREFBSCxFQUF5RCxTQUFBO1FBQ3ZELE9BQU8sQ0FBQyxPQUFSLENBQUE7UUFFQSxlQUFBLENBQWdCLFNBQUE7aUJBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGNBQXBCO1FBRGMsQ0FBaEI7ZUFHQSxJQUFBLENBQUssU0FBQTtVQUNILE9BQUEsR0FBYyxJQUFBLG1CQUFBLENBQW9CO1lBQUMsUUFBQSxFQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLEVBQWhEO1dBQXBCO1VBRWQsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsT0FBTyxDQUFDLE9BQTVCO1VBQ0EsTUFBQSxDQUFPLE9BQU8sQ0FBQyxPQUFSLENBQUEsQ0FBUCxDQUF5QixDQUFDLElBQTFCLENBQStCLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFvQyxDQUFDLE9BQXJDLENBQUEsQ0FBL0I7VUFFQSxVQUFBLEdBQWEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFuQixDQUErQixPQUFPLENBQUMsU0FBUixDQUFBLENBQS9CO1VBQ2IsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsVUFBVSxDQUFDLE9BQS9CO2lCQUNBLE1BQUEsQ0FBTyxVQUFVLENBQUMsT0FBWCxDQUFBLENBQVAsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxPQUFPLENBQUMsT0FBUixDQUFBLENBQWxDO1FBUkcsQ0FBTDtNQU51RCxDQUF6RDtJQVh3QixDQUExQjtJQTJCQSxRQUFBLENBQVMsZ0RBQVQsRUFBMkQsU0FBQTtNQUN6RCxVQUFBLENBQVcsU0FBQTtlQUNULGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxPQUFPLENBQUMsY0FBUixDQUFBO1FBRGMsQ0FBaEI7TUFEUyxDQUFYO01BSUEsRUFBQSxDQUFHLGtEQUFILEVBQXVELFNBQUE7QUFDckQsWUFBQTtRQUFBLE1BQUEsR0FBUyxPQUFPLENBQUMsSUFBUixDQUFhLDBEQUFiO1FBQ1QsV0FBQSxHQUFjLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQyxRQUFWLENBQUEsQ0FBb0IsQ0FBQyxjQUFyQixDQUFvQztVQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sYUFBUDtVQUFzQixJQUFBLEVBQU0sTUFBNUI7U0FBcEM7ZUFDZCxNQUFBLENBQU8sV0FBVyxDQUFDLE1BQW5CLENBQTBCLENBQUMsSUFBM0IsQ0FBZ0MsQ0FBaEM7TUFIcUQsQ0FBdkQ7TUFLQSxRQUFBLENBQVMseURBQVQsRUFBb0UsU0FBQTtlQUNsRSxFQUFBLENBQUcsNkNBQUgsRUFBa0QsU0FBQTtBQUNoRCxjQUFBO1VBQUEsVUFBQSxHQUFhLE9BQU8sQ0FBQyxJQUFSLENBQWEsOENBQWI7VUFDYixNQUFBLENBQU8sVUFBUCxDQUFrQixDQUFDLE9BQW5CLENBQUE7VUFDQSxNQUFBLENBQU8sVUFBVyxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQWQsQ0FBQSxDQUF3QixDQUFDLE9BQXpCLENBQUEsQ0FBUCxDQUEwQyxDQUFDLElBQTNDLENBQWdELHdCQUFoRDtVQU9BLFFBQUEsR0FBVyxPQUFPLENBQUMsSUFBUixDQUFhLDRDQUFiO1VBQ1gsTUFBQSxDQUFPLFFBQVAsQ0FBZ0IsQ0FBQyxPQUFqQixDQUFBO2lCQUNBLE1BQUEsQ0FBTyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsT0FBdkIsQ0FBQSxDQUFQLENBQXdDLENBQUMsSUFBekMsQ0FBOEMsd0JBQTlDO1FBWmdELENBQWxEO01BRGtFLENBQXBFO2FBbUJBLFFBQUEsQ0FBUyxrRUFBVCxFQUE2RSxTQUFBO2VBQzNFLEVBQUEsQ0FBRyxvQ0FBSCxFQUF5QyxTQUFBO0FBQ3ZDLGNBQUE7VUFBQSxXQUFBLEdBQWMsT0FBTyxDQUFDLElBQVIsQ0FBYSwwREFBYjtVQUNkLE1BQUEsQ0FBTyxXQUFQLENBQW1CLENBQUMsT0FBcEIsQ0FBQTtpQkFDQSxNQUFBLENBQU8sV0FBWSxDQUFBLENBQUEsQ0FBRSxDQUFDLFFBQWYsQ0FBQSxDQUF5QixDQUFDLE9BQTFCLENBQUEsQ0FBUCxDQUEyQyxDQUFDLElBQTVDLENBQWlELG1DQUFqRDtRQUh1QyxDQUF6QztNQUQyRSxDQUE3RTtJQTdCeUQsQ0FBM0Q7SUF1Q0EsUUFBQSxDQUFTLGlCQUFULEVBQTRCLFNBQUE7TUFDMUIsVUFBQSxDQUFXLFNBQUE7ZUFDVCxlQUFBLENBQWdCLFNBQUE7aUJBQ2QsT0FBTyxDQUFDLGNBQVIsQ0FBQTtRQURjLENBQWhCO01BRFMsQ0FBWDtNQUlBLFFBQUEsQ0FBUyxxQ0FBVCxFQUFnRCxTQUFBO2VBQzlDLEVBQUEsQ0FBRyx5Q0FBSCxFQUE4QyxTQUFBO0FBQzVDLGNBQUE7VUFBQSxLQUFBLEdBQVEsT0FBTyxDQUFDLElBQVIsQ0FBYSxpQkFBYjtpQkFDUixNQUFBLENBQU8sS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFYLENBQVAsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBQSxDQUE4QixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWpDLENBQXlDLG1CQUF6QyxDQUEvQjtRQUY0QyxDQUE5QztNQUQ4QyxDQUFoRDtNQUtBLFFBQUEsQ0FBUywwREFBVCxFQUFxRSxTQUFBO2VBQ25FLEVBQUEsQ0FBRyxpREFBSCxFQUFzRCxTQUFBO0FBQ3BELGNBQUE7VUFBQSxLQUFBLEdBQVEsT0FBTyxDQUFDLElBQVIsQ0FBYSxpQkFBYjtpQkFDUixNQUFBLENBQU8sS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFYLENBQVAsQ0FBeUIsQ0FBQyxJQUExQixDQUErQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBQSxDQUE4QixDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQWpDLENBQXlDLGdCQUF6QyxDQUEvQjtRQUZvRCxDQUF0RDtNQURtRSxDQUFyRTtNQUtBLFFBQUEsQ0FBUyxrREFBVCxFQUE2RCxTQUFBO2VBQzNELEVBQUEsQ0FBRyx3QkFBSCxFQUE2QixTQUFBO0FBQzNCLGNBQUE7VUFBQSxPQUFPLENBQUMsT0FBUixDQUFBO1VBRUEsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLFNBQUwsQ0FBZSxNQUFmLENBQVYsRUFBa0MsUUFBbEM7VUFDWCxFQUFFLENBQUMsYUFBSCxDQUFpQixRQUFqQixFQUEyQixjQUFBLEdBQWUsUUFBZixHQUF3QixHQUFuRDtVQUNBLE9BQUEsR0FBYyxJQUFBLG1CQUFBLENBQW9CO1lBQUMsVUFBQSxRQUFEO1dBQXBCO1VBQ2QsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsT0FBTyxDQUFDLE9BQTVCO1VBRUEsZUFBQSxDQUFnQixTQUFBO21CQUNkLE9BQU8sQ0FBQyxjQUFSLENBQUE7VUFEYyxDQUFoQjtpQkFHQSxJQUFBLENBQUssU0FBQTttQkFDSCxNQUFBLENBQU8sT0FBTyxDQUFDLElBQVIsQ0FBYSxtQkFBYixDQUFpQyxDQUFDLElBQWxDLENBQXVDLEtBQXZDLENBQVAsQ0FBcUQsQ0FBQyxJQUF0RCxDQUEyRCxRQUEzRDtVQURHLENBQUw7UUFYMkIsQ0FBN0I7TUFEMkQsQ0FBN0Q7YUFlQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQTtlQUN4QyxFQUFBLENBQUcsd0JBQUgsRUFBNkIsU0FBQTtBQUMzQixjQUFBO1VBQUEsS0FBQSxHQUFRLE9BQU8sQ0FBQyxJQUFSLENBQWEsaUJBQWI7aUJBQ1IsTUFBQSxDQUFPLEtBQUssQ0FBQyxJQUFOLENBQVcsS0FBWCxDQUFQLENBQXlCLENBQUMsSUFBMUIsQ0FBK0IsOEJBQS9CO1FBRjJCLENBQTdCO01BRHdDLENBQTFDO0lBOUIwQixDQUE1QjtJQW1DQSxRQUFBLENBQVMsY0FBVCxFQUF5QixTQUFBO01BQ3ZCLFFBQUEsQ0FBUyxtQ0FBVCxFQUE4QyxTQUFBO2VBQzVDLEVBQUEsQ0FBRyxzQ0FBSCxFQUEyQyxTQUFBO1VBQ3pDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1Q0FBaEIsRUFBeUQsS0FBekQ7VUFFQSxlQUFBLENBQWdCLFNBQUE7bUJBQ2QsT0FBTyxDQUFDLGNBQVIsQ0FBQTtVQURjLENBQWhCO2lCQUdBLElBQUEsQ0FBSyxTQUFBO21CQUNILE1BQUEsQ0FBTyxPQUFPLENBQUMsSUFBUixDQUFhLGlCQUFiLENBQStCLENBQUMsTUFBdkMsQ0FBOEMsQ0FBQyxJQUEvQyxDQUFvRCxDQUFwRDtVQURHLENBQUw7UUFOeUMsQ0FBM0M7TUFENEMsQ0FBOUM7YUFVQSxRQUFBLENBQVMsK0JBQVQsRUFBMEMsU0FBQTtlQUN4QyxFQUFBLENBQUcseUNBQUgsRUFBOEMsU0FBQTtVQUM1QyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUNBQWhCLEVBQXlELElBQXpEO1VBRUEsZUFBQSxDQUFnQixTQUFBO21CQUNkLE9BQU8sQ0FBQyxjQUFSLENBQUE7VUFEYyxDQUFoQjtpQkFHQSxJQUFBLENBQUssU0FBQTttQkFDSCxNQUFBLENBQU8sT0FBTyxDQUFDLElBQVIsQ0FBYSxpQkFBYixDQUErQixDQUFDLE1BQXZDLENBQThDLENBQUMsSUFBL0MsQ0FBb0QsQ0FBcEQ7VUFERyxDQUFMO1FBTjRDLENBQTlDO01BRHdDLENBQTFDO0lBWHVCLENBQXpCO0lBcUJBLFFBQUEsQ0FBUyxnQ0FBVCxFQUEyQyxTQUFBO01BQ3pDLFVBQUEsQ0FBVyxTQUFBO0FBQ1QsWUFBQTtRQUFBLE9BQU8sQ0FBQyxPQUFSLENBQUE7UUFDQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQUEsQ0FBOEIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFqQyxDQUF5QyxzQkFBekM7UUFDWCxPQUFBLEdBQWMsSUFBQSxtQkFBQSxDQUFvQjtVQUFDLFVBQUEsUUFBRDtTQUFwQjtlQUNkLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQU8sQ0FBQyxPQUE1QjtNQUpTLENBQVg7TUFNQSxFQUFBLENBQUcsc0NBQUgsRUFBMkMsU0FBQTtBQUN6QyxZQUFBO1FBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxJQUFMLENBQVU7VUFBQSxNQUFBLEVBQVEsT0FBUjtTQUFWO1FBQ2IsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQUEsQ0FBOEIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFqQyxDQUF5QyxpQkFBekM7UUFDbkIsY0FBQSxHQUFpQixFQUFFLENBQUMsWUFBSCxDQUFnQixnQkFBaEIsQ0FBaUMsQ0FBQyxRQUFsQyxDQUFBO1FBRWpCLFVBQUEsR0FBYSxTQUFDLFFBQUQsRUFBVyxHQUFYO0FBQ1gsaUJBQU87WUFDTCxZQUFBLEVBQWMsUUFEVDtZQUVMLE9BQUEsRUFBWSxRQUFELEdBQVUsR0FBVixHQUFhLEdBRm5COztRQURJO1FBTWIscUJBQUEsR0FBd0I7VUFDdEI7WUFDRSxLQUFBLEVBQU8sQ0FDTCxVQUFBLENBQVcsbUJBQVgsRUFBZ0Msb0JBQWhDLENBREssQ0FEVDtXQURzQixFQUtuQjtZQUNELEtBQUEsRUFBTyxDQUNMLFVBQUEsQ0FBVyxlQUFYLEVBQTRCLG1CQUE1QixDQURLLEVBRUwsVUFBQSxDQUFXLHlCQUFYLEVBQXNDLG9CQUF0QyxDQUZLLENBRE47V0FMbUI7O1FBYXhCLG9CQUFBLEdBQXVCLENBQ3JCLHFGQURxQixFQUVyQixxREFGcUIsRUFHckIsa0ZBSHFCO1FBTXZCLE1BQUEsQ0FBTyxFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLEtBQXZDO1FBRUEsZUFBQSxDQUFnQixTQUFBO2lCQUNkLE9BQU8sQ0FBQyxjQUFSLENBQUE7UUFEYyxDQUFoQjtRQUdBLElBQUEsQ0FBSyxTQUFBO1VBQ0gsS0FBQSxDQUFNLElBQU4sRUFBWSxvQkFBWixDQUFpQyxDQUFDLFNBQWxDLENBQTRDLFVBQTVDO1VBQ0EsS0FBQSxDQUFNLE9BQU4sRUFBZSx3QkFBZixDQUF3QyxDQUFDLFNBQXpDLENBQW1ELHFCQUFuRDtVQUNBLEtBQUEsQ0FBTSxPQUFOLEVBQWUscUJBQWYsQ0FBcUMsQ0FBQyxTQUF0QyxDQUFnRCxvQkFBaEQ7aUJBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFkLENBQXVCLE9BQU8sQ0FBQyxPQUEvQixFQUF3QyxjQUF4QztRQUpHLENBQUw7UUFNQSxRQUFBLENBQVMsU0FBQTtBQUNQLGNBQUE7aUJBQUEsRUFBRSxDQUFDLFVBQUgsQ0FBYyxVQUFkLENBQUEsaUVBQWtFLENBQUUsT0FBdEMsQ0FBQSxXQUFBLEtBQW1ELEVBQUUsQ0FBQyxZQUFILENBQWdCLFVBQWhCO1FBRDFFLENBQVQ7ZUFHQSxJQUFBLENBQUssU0FBQTtVQUNILE1BQUEsQ0FBTyxFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQsQ0FBUCxDQUFpQyxDQUFDLElBQWxDLENBQXVDLElBQXZDO2lCQUNBLE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUEsQ0FBb0MsQ0FBQyxPQUFyQyxDQUFBLENBQVAsQ0FBc0QsQ0FBQyxJQUF2RCxDQUE0RCxjQUE1RDtRQUZHLENBQUw7TUE1Q3lDLENBQTNDO2FBZ0RBLFFBQUEsQ0FBUyw4QkFBVCxFQUF5QyxTQUFBO0FBRXZDLFlBQUE7UUFBQyxrQkFBbUI7UUFFcEIsZUFBQSxHQUFrQjtRQUNsQixjQUFBLEdBQWtCO1FBRWxCLFVBQUEsQ0FBVyxTQUFBO1VBQ1QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFaLENBQTBCLGVBQTFCLEVBQ0U7WUFBQSxPQUFBLEVBQVMsa0JBQVQ7V0FERjtVQUdBLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBWixDQUEwQixjQUExQixFQUNFO1lBQUEsT0FBQSxFQUFTLG1CQUFUO1dBREY7aUJBR0EsZUFBQSxHQUFrQixPQUFPLENBQUMsbUJBQVIsQ0FBQTtRQVBULENBQVg7UUFTQSxFQUFBLENBQUcsZ0VBQUgsRUFBcUUsU0FBQTtpQkFDbkUsTUFBQSxDQUFPLGVBQWUsQ0FBQyxPQUFoQixDQUF3QixlQUF4QixDQUFQLENBQWdELENBQUMsZUFBakQsQ0FBaUUsQ0FBQyxDQUFsRTtRQURtRSxDQUFyRTtlQUdBLEVBQUEsQ0FBRyw4QkFBSCxFQUFtQyxTQUFBO2lCQUNqQyxNQUFBLENBQU8sZUFBZSxDQUFDLE9BQWhCLENBQXdCLGNBQXhCLENBQVAsQ0FBK0MsQ0FBQyxJQUFoRCxDQUFxRCxDQUFDLENBQXREO1FBRGlDLENBQW5DO01BbkJ1QyxDQUF6QztJQXZEeUMsQ0FBM0M7V0E2RUEsUUFBQSxDQUFTLDZCQUFULEVBQXdDLFNBQUE7YUFDdEMsRUFBQSxDQUFHLDJDQUFILEVBQWdELFNBQUE7QUFDOUMsWUFBQTtRQUFBLE9BQU8sQ0FBQyxPQUFSLENBQUE7UUFDQSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQWhCLENBQUE7UUFFQSxRQUFBLEdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQUEsQ0FBOEIsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFqQyxDQUF5QyxzQkFBekM7UUFDWCxPQUFBLEdBQWMsSUFBQSxtQkFBQSxDQUFvQjtVQUFDLFVBQUEsUUFBRDtTQUFwQjtRQUNkLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQU8sQ0FBQyxPQUE1QjtRQUVBLGVBQUEsQ0FBZ0IsU0FBQTtpQkFDZCxPQUFPLENBQUMsY0FBUixDQUFBO1FBRGMsQ0FBaEI7UUFHQSxJQUFBLENBQUssU0FBQTtpQkFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsT0FBTyxDQUFDLE9BQS9CLEVBQXdDLFdBQXhDO1FBREcsQ0FBTDtRQUdBLFFBQUEsQ0FBUyxTQUFBO2lCQUNQLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFBLENBQUEsS0FBMkI7UUFEcEIsQ0FBVDtlQUdBLElBQUEsQ0FBSyxTQUFBO2lCQUNILE1BQUEsQ0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBQSxDQUFQLENBQTZCLENBQUMsSUFBOUIsQ0FBbUMsK3lCQUFuQztRQURHLENBQUw7TUFqQjhDLENBQWhEO0lBRHNDLENBQXhDO0VBMU84QixDQUFoQztBQUxBIiwic291cmNlc0NvbnRlbnQiOlsicGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG50ZW1wID0gcmVxdWlyZSAndGVtcCdcbk1hcmtkb3duTWluZG1hcFZpZXcgPSByZXF1aXJlICcuLi9saWIvbWFya2Rvd24tbWluZG1hcC12aWV3J1xuXG5kZXNjcmliZSBcIk1hcmtkb3duTWluZG1hcFZpZXdcIiwgLT5cbiAgW2ZpbGUsIHByZXZpZXcsIHdvcmtzcGFjZUVsZW1lbnRdID0gW11cblxuICBiZWZvcmVFYWNoIC0+XG4gICAgZmlsZVBhdGggPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKVswXS5yZXNvbHZlKCdzdWJkaXIvZmlsZS5tYXJrZG93bicpXG4gICAgcHJldmlldyA9IG5ldyBNYXJrZG93bk1pbmRtYXBWaWV3KHtmaWxlUGF0aH0pXG4gICAgamFzbWluZS5hdHRhY2hUb0RPTShwcmV2aWV3LmVsZW1lbnQpXG5cbiAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKCdsYW5ndWFnZS1ydWJ5JylcblxuICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgYXRvbS5wYWNrYWdlcy5hY3RpdmF0ZVBhY2thZ2UoJ2xhbmd1YWdlLWphdmFzY3JpcHQnKVxuXG4gICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICBhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgnbWFya2Rvd24tbWluZG1hcCcpXG5cbiAgYWZ0ZXJFYWNoIC0+XG4gICAgcHJldmlldy5kZXN0cm95KClcblxuICBkZXNjcmliZSBcIjo6Y29uc3RydWN0b3JcIiwgLT5cbiAgICBpdCBcInNob3dzIGEgbG9hZGluZyBzcGlubmVyIGFuZCByZW5kZXJzIHRoZSBtYXJrZG93blwiLCAtPlxuICAgICAgcHJldmlldy5zaG93TG9hZGluZygpXG4gICAgICBleHBlY3QocHJldmlldy5maW5kKCcubWFya2Rvd24tc3Bpbm5lcicpKS50b0V4aXN0KClcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHByZXZpZXcucmVuZGVyTWFya2Rvd24oKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChwcmV2aWV3LmZpbmQoXCIuZW1vamlcIikpLnRvRXhpc3QoKVxuXG4gICAgaXQgXCJzaG93cyBhbiBlcnJvciBtZXNzYWdlIHdoZW4gdGhlcmUgaXMgYW4gZXJyb3JcIiwgLT5cbiAgICAgIHByZXZpZXcuc2hvd0Vycm9yKFwiTm90IGEgcmVhbCBmaWxlXCIpXG4gICAgICBleHBlY3QocHJldmlldy50ZXh0KCkpLnRvQ29udGFpbiBcIkZhaWxlZFwiXG5cbiAgZGVzY3JpYmUgXCJzZXJpYWxpemF0aW9uXCIsIC0+XG4gICAgbmV3UHJldmlldyA9IG51bGxcblxuICAgIGFmdGVyRWFjaCAtPlxuICAgICAgbmV3UHJldmlldy5kZXN0cm95KClcblxuICAgIGl0IFwicmVjcmVhdGVzIHRoZSBmaWxlIHdoZW4gc2VyaWFsaXplZC9kZXNlcmlhbGl6ZWRcIiwgLT5cbiAgICAgIG5ld1ByZXZpZXcgPSBhdG9tLmRlc2VyaWFsaXplcnMuZGVzZXJpYWxpemUocHJldmlldy5zZXJpYWxpemUoKSlcbiAgICAgIGphc21pbmUuYXR0YWNoVG9ET00obmV3UHJldmlldy5lbGVtZW50KVxuICAgICAgZXhwZWN0KG5ld1ByZXZpZXcuZ2V0UGF0aCgpKS50b0JlIHByZXZpZXcuZ2V0UGF0aCgpXG5cbiAgICBpdCBcInNlcmlhbGl6ZXMgdGhlIGVkaXRvciBpZCB3aGVuIG9wZW5lZCBmb3IgYW4gZWRpdG9yXCIsIC0+XG4gICAgICBwcmV2aWV3LmRlc3Ryb3koKVxuXG4gICAgICB3YWl0c0ZvclByb21pc2UgLT5cbiAgICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbignbmV3Lm1hcmtkb3duJylcblxuICAgICAgcnVucyAtPlxuICAgICAgICBwcmV2aWV3ID0gbmV3IE1hcmtkb3duTWluZG1hcFZpZXcoe2VkaXRvcklkOiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkuaWR9KVxuXG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00ocHJldmlldy5lbGVtZW50KVxuICAgICAgICBleHBlY3QocHJldmlldy5nZXRQYXRoKCkpLnRvQmUgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFBhdGgoKVxuXG4gICAgICAgIG5ld1ByZXZpZXcgPSBhdG9tLmRlc2VyaWFsaXplcnMuZGVzZXJpYWxpemUocHJldmlldy5zZXJpYWxpemUoKSlcbiAgICAgICAgamFzbWluZS5hdHRhY2hUb0RPTShuZXdQcmV2aWV3LmVsZW1lbnQpXG4gICAgICAgIGV4cGVjdChuZXdQcmV2aWV3LmdldFBhdGgoKSkudG9CZSBwcmV2aWV3LmdldFBhdGgoKVxuXG4gIGRlc2NyaWJlIFwiY29kZSBibG9jayBjb252ZXJzaW9uIHRvIGF0b20tdGV4dC1lZGl0b3IgdGFnc1wiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBwcmV2aWV3LnJlbmRlck1hcmtkb3duKClcblxuICAgIGl0IFwicmVtb3ZlcyBsaW5lIGRlY29yYXRpb25zIG9uIHJlbmRlcmVkIGNvZGUgYmxvY2tzXCIsIC0+XG4gICAgICBlZGl0b3IgPSBwcmV2aWV3LmZpbmQoXCJhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcj0ndGV4dCBwbGFpbiBudWxsLWdyYW1tYXInXVwiKVxuICAgICAgZGVjb3JhdGlvbnMgPSBlZGl0b3JbMF0uZ2V0TW9kZWwoKS5nZXREZWNvcmF0aW9ucyhjbGFzczogJ2N1cnNvci1saW5lJywgdHlwZTogJ2xpbmUnKVxuICAgICAgZXhwZWN0KGRlY29yYXRpb25zLmxlbmd0aCkudG9CZSAwXG5cbiAgICBkZXNjcmliZSBcIndoZW4gdGhlIGNvZGUgYmxvY2sncyBmZW5jZSBuYW1lIGhhcyBhIG1hdGNoaW5nIGdyYW1tYXJcIiwgLT5cbiAgICAgIGl0IFwiYXNzaWducyB0aGUgZ3JhbW1hciBvbiB0aGUgYXRvbS10ZXh0LWVkaXRvclwiLCAtPlxuICAgICAgICBydWJ5RWRpdG9yID0gcHJldmlldy5maW5kKFwiYXRvbS10ZXh0LWVkaXRvcltkYXRhLWdyYW1tYXI9J3NvdXJjZSBydWJ5J11cIilcbiAgICAgICAgZXhwZWN0KHJ1YnlFZGl0b3IpLnRvRXhpc3QoKVxuICAgICAgICBleHBlY3QocnVieUVkaXRvclswXS5nZXRNb2RlbCgpLmdldFRleHQoKSkudG9CZSBcIlwiXCJcbiAgICAgICAgICBkZWYgZnVuY1xuICAgICAgICAgICAgeCA9IDFcbiAgICAgICAgICBlbmRcbiAgICAgICAgXCJcIlwiXG5cbiAgICAgICAgIyBuZXN0ZWQgaW4gYSBsaXN0IGl0ZW1cbiAgICAgICAganNFZGl0b3IgPSBwcmV2aWV3LmZpbmQoXCJhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcj0nc291cmNlIGpzJ11cIilcbiAgICAgICAgZXhwZWN0KGpzRWRpdG9yKS50b0V4aXN0KClcbiAgICAgICAgZXhwZWN0KGpzRWRpdG9yWzBdLmdldE1vZGVsKCkuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIGlmIGEgPT09IDMge1xuICAgICAgICAgIGIgPSA1XG4gICAgICAgICAgfVxuICAgICAgICBcIlwiXCJcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgY29kZSBibG9jaydzIGZlbmNlIG5hbWUgZG9lc24ndCBoYXZlIGEgbWF0Y2hpbmcgZ3JhbW1hclwiLCAtPlxuICAgICAgaXQgXCJkb2VzIG5vdCBhc3NpZ24gYSBzcGVjaWZpYyBncmFtbWFyXCIsIC0+XG4gICAgICAgIHBsYWluRWRpdG9yID0gcHJldmlldy5maW5kKFwiYXRvbS10ZXh0LWVkaXRvcltkYXRhLWdyYW1tYXI9J3RleHQgcGxhaW4gbnVsbC1ncmFtbWFyJ11cIilcbiAgICAgICAgZXhwZWN0KHBsYWluRWRpdG9yKS50b0V4aXN0KClcbiAgICAgICAgZXhwZWN0KHBsYWluRWRpdG9yWzBdLmdldE1vZGVsKCkuZ2V0VGV4dCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgIGZ1bmN0aW9uIGYoeCkge1xuICAgICAgICAgICAgcmV0dXJuIHgrKztcbiAgICAgICAgICB9XG4gICAgICAgIFwiXCJcIlxuXG4gIGRlc2NyaWJlIFwiaW1hZ2UgcmVzb2x2aW5nXCIsIC0+XG4gICAgYmVmb3JlRWFjaCAtPlxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHByZXZpZXcucmVuZGVyTWFya2Rvd24oKVxuXG4gICAgZGVzY3JpYmUgXCJ3aGVuIHRoZSBpbWFnZSB1c2VzIGEgcmVsYXRpdmUgcGF0aFwiLCAtPlxuICAgICAgaXQgXCJyZXNvbHZlcyB0byBhIHBhdGggcmVsYXRpdmUgdG8gdGhlIGZpbGVcIiwgLT5cbiAgICAgICAgaW1hZ2UgPSBwcmV2aWV3LmZpbmQoXCJpbWdbYWx0PUltYWdlMV1cIilcbiAgICAgICAgZXhwZWN0KGltYWdlLmF0dHIoJ3NyYycpKS50b0JlIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJ3N1YmRpci9pbWFnZTEucG5nJylcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgaW1hZ2UgdXNlcyBhbiBhYnNvbHV0ZSBwYXRoIHRoYXQgZG9lcyBub3QgZXhpc3RcIiwgLT5cbiAgICAgIGl0IFwicmVzb2x2ZXMgdG8gYSBwYXRoIHJlbGF0aXZlIHRvIHRoZSBwcm9qZWN0IHJvb3RcIiwgLT5cbiAgICAgICAgaW1hZ2UgPSBwcmV2aWV3LmZpbmQoXCJpbWdbYWx0PUltYWdlMl1cIilcbiAgICAgICAgZXhwZWN0KGltYWdlLmF0dHIoJ3NyYycpKS50b0JlIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJ3RtcC9pbWFnZTIucG5nJylcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgaW1hZ2UgdXNlcyBhbiBhYnNvbHV0ZSBwYXRoIHRoYXQgZXhpc3RzXCIsIC0+XG4gICAgICBpdCBcImRvZXNuJ3QgY2hhbmdlIHRoZSBVUkxcIiwgLT5cbiAgICAgICAgcHJldmlldy5kZXN0cm95KClcblxuICAgICAgICBmaWxlUGF0aCA9IHBhdGguam9pbih0ZW1wLm1rZGlyU3luYygnYXRvbScpLCAnZm9vLm1kJylcbiAgICAgICAgZnMud3JpdGVGaWxlU3luYyhmaWxlUGF0aCwgXCIhW2Fic29sdXRlXSgje2ZpbGVQYXRofSlcIilcbiAgICAgICAgcHJldmlldyA9IG5ldyBNYXJrZG93bk1pbmRtYXBWaWV3KHtmaWxlUGF0aH0pXG4gICAgICAgIGphc21pbmUuYXR0YWNoVG9ET00ocHJldmlldy5lbGVtZW50KVxuXG4gICAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICAgIHByZXZpZXcucmVuZGVyTWFya2Rvd24oKVxuXG4gICAgICAgIHJ1bnMgLT5cbiAgICAgICAgICBleHBlY3QocHJldmlldy5maW5kKFwiaW1nW2FsdD1hYnNvbHV0ZV1cIikuYXR0cignc3JjJykpLnRvQmUgZmlsZVBhdGhcblxuICAgIGRlc2NyaWJlIFwid2hlbiB0aGUgaW1hZ2UgdXNlcyBhIHdlYiBVUkxcIiwgLT5cbiAgICAgIGl0IFwiZG9lc24ndCBjaGFuZ2UgdGhlIFVSTFwiLCAtPlxuICAgICAgICBpbWFnZSA9IHByZXZpZXcuZmluZChcImltZ1thbHQ9SW1hZ2UzXVwiKVxuICAgICAgICBleHBlY3QoaW1hZ2UuYXR0cignc3JjJykpLnRvQmUgJ2h0dHA6Ly9naXRodWIuY29tL2ltYWdlMy5wbmcnXG5cbiAgZGVzY3JpYmUgXCJnZm0gbmV3bGluZXNcIiwgLT5cbiAgICBkZXNjcmliZSBcIndoZW4gZ2ZtIG5ld2xpbmVzIGFyZSBub3QgZW5hYmxlZFwiLCAtPlxuICAgICAgaXQgXCJjcmVhdGVzIGEgc2luZ2xlIHBhcmFncmFwaCB3aXRoIDxicj5cIiwgLT5cbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCdtYXJrZG93bi1taW5kbWFwLmJyZWFrT25TaW5nbGVOZXdsaW5lJywgZmFsc2UpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgcHJldmlldy5yZW5kZXJNYXJrZG93bigpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChwcmV2aWV3LmZpbmQoXCJwOmxhc3QtY2hpbGQgYnJcIikubGVuZ3RoKS50b0JlIDBcblxuICAgIGRlc2NyaWJlIFwid2hlbiBnZm0gbmV3bGluZXMgYXJlIGVuYWJsZWRcIiwgLT5cbiAgICAgIGl0IFwiY3JlYXRlcyBhIHNpbmdsZSBwYXJhZ3JhcGggd2l0aCBubyA8YnI+XCIsIC0+XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgnbWFya2Rvd24tbWluZG1hcC5icmVha09uU2luZ2xlTmV3bGluZScsIHRydWUpXG5cbiAgICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgICAgcHJldmlldy5yZW5kZXJNYXJrZG93bigpXG5cbiAgICAgICAgcnVucyAtPlxuICAgICAgICAgIGV4cGVjdChwcmV2aWV3LmZpbmQoXCJwOmxhc3QtY2hpbGQgYnJcIikubGVuZ3RoKS50b0JlIDFcblxuICBkZXNjcmliZSBcIndoZW4gY29yZTpzYXZlLWFzIGlzIHRyaWdnZXJlZFwiLCAtPlxuICAgIGJlZm9yZUVhY2ggLT5cbiAgICAgIHByZXZpZXcuZGVzdHJveSgpXG4gICAgICBmaWxlUGF0aCA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJ3N1YmRpci9jb2RlLWJsb2NrLm1kJylcbiAgICAgIHByZXZpZXcgPSBuZXcgTWFya2Rvd25NaW5kbWFwVmlldyh7ZmlsZVBhdGh9KVxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTShwcmV2aWV3LmVsZW1lbnQpXG5cbiAgICBpdCBcInNhdmVzIHRoZSByZW5kZXJlZCBIVE1MIGFuZCBvcGVucyBpdFwiLCAtPlxuICAgICAgb3V0cHV0UGF0aCA9IHRlbXAucGF0aChzdWZmaXg6ICcuaHRtbCcpXG4gICAgICBleHBlY3RlZEZpbGVQYXRoID0gYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClbMF0ucmVzb2x2ZSgnc2F2ZWQtaHRtbC5odG1sJylcbiAgICAgIGV4cGVjdGVkT3V0cHV0ID0gZnMucmVhZEZpbGVTeW5jKGV4cGVjdGVkRmlsZVBhdGgpLnRvU3RyaW5nKClcblxuICAgICAgY3JlYXRlUnVsZSA9IChzZWxlY3RvciwgY3NzKSAtPlxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNlbGVjdG9yVGV4dDogc2VsZWN0b3JcbiAgICAgICAgICBjc3NUZXh0OiBcIiN7c2VsZWN0b3J9ICN7Y3NzfVwiXG4gICAgICAgIH1cblxuICAgICAgbWFya2Rvd25NaW5kbWFwU3R5bGVzID0gW1xuICAgICAgICB7XG4gICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgIGNyZWF0ZVJ1bGUgXCIubWFya2Rvd24tbWluZG1hcFwiLCBcInsgY29sb3I6IG9yYW5nZTsgfVwiXG4gICAgICAgICAgXVxuICAgICAgICB9LCB7XG4gICAgICAgICAgcnVsZXM6IFtcbiAgICAgICAgICAgIGNyZWF0ZVJ1bGUgXCIubm90LWluY2x1ZGVkXCIsIFwieyBjb2xvcjogZ3JlZW47IH1cIlxuICAgICAgICAgICAgY3JlYXRlUnVsZSBcIi5tYXJrZG93bi1taW5kbWFwIDpob3N0XCIsIFwieyBjb2xvcjogcHVycGxlOyB9XCJcbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cblxuICAgICAgYXRvbVRleHRFZGl0b3JTdHlsZXMgPSBbXG4gICAgICAgIFwiYXRvbS10ZXh0LWVkaXRvciAubGluZSB7IGNvbG9yOiBicm93bjsgfVxcbmF0b20tdGV4dC1lZGl0b3IgLm51bWJlciB7IGNvbG9yOiBjeWFuOyB9XCJcbiAgICAgICAgXCJhdG9tLXRleHQtZWRpdG9yIDpob3N0IC5zb21ldGhpbmcgeyBjb2xvcjogYmxhY2s7IH1cIlxuICAgICAgICBcImF0b20tdGV4dC1lZGl0b3IgLmhyIHsgYmFja2dyb3VuZDogdXJsKGF0b206Ly9tYXJrZG93bi1taW5kbWFwL2Fzc2V0cy9oci5wbmcpOyB9XCJcbiAgICAgIF1cblxuICAgICAgZXhwZWN0KGZzLmlzRmlsZVN5bmMob3V0cHV0UGF0aCkpLnRvQmUgZmFsc2VcblxuICAgICAgd2FpdHNGb3JQcm9taXNlIC0+XG4gICAgICAgIHByZXZpZXcucmVuZGVyTWFya2Rvd24oKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIHNweU9uKGF0b20sICdzaG93U2F2ZURpYWxvZ1N5bmMnKS5hbmRSZXR1cm4ob3V0cHV0UGF0aClcbiAgICAgICAgc3B5T24ocHJldmlldywgJ2dldERvY3VtZW50U3R5bGVTaGVldHMnKS5hbmRSZXR1cm4obWFya2Rvd25NaW5kbWFwU3R5bGVzKVxuICAgICAgICBzcHlPbihwcmV2aWV3LCAnZ2V0VGV4dEVkaXRvclN0eWxlcycpLmFuZFJldHVybihhdG9tVGV4dEVkaXRvclN0eWxlcylcbiAgICAgICAgYXRvbS5jb21tYW5kcy5kaXNwYXRjaCBwcmV2aWV3LmVsZW1lbnQsICdjb3JlOnNhdmUtYXMnXG5cbiAgICAgIHdhaXRzRm9yIC0+XG4gICAgICAgIGZzLmV4aXN0c1N5bmMob3V0cHV0UGF0aCkgYW5kIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpIGlzIGZzLnJlYWxwYXRoU3luYyhvdXRwdXRQYXRoKVxuXG4gICAgICBydW5zIC0+XG4gICAgICAgIGV4cGVjdChmcy5pc0ZpbGVTeW5jKG91dHB1dFBhdGgpKS50b0JlIHRydWVcbiAgICAgICAgZXhwZWN0KGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRUZXh0KCkpLnRvQmUgZXhwZWN0ZWRPdXRwdXRcblxuICAgIGRlc2NyaWJlIFwidGV4dCBlZGl0b3Igc3R5bGUgZXh0cmFjdGlvblwiLCAtPlxuXG4gICAgICBbZXh0cmFjdGVkU3R5bGVzXSA9IFtdXG5cbiAgICAgIHRleHRFZGl0b3JTdHlsZSA9IFwiLmVkaXRvci1zdHlsZSAuZXh0cmFjdGlvbi10ZXN0IHsgY29sb3I6IGJsdWU7IH1cIlxuICAgICAgdW5yZWxhdGVkU3R5bGUgID0gXCIuc29tZXRoaW5nIGVsc2UgeyBjb2xvcjogcmVkOyB9XCJcblxuICAgICAgYmVmb3JlRWFjaCAtPlxuICAgICAgICBhdG9tLnN0eWxlcy5hZGRTdHlsZVNoZWV0IHRleHRFZGl0b3JTdHlsZSxcbiAgICAgICAgICBjb250ZXh0OiAnYXRvbS10ZXh0LWVkaXRvcidcblxuICAgICAgICBhdG9tLnN0eWxlcy5hZGRTdHlsZVNoZWV0IHVucmVsYXRlZFN0eWxlLFxuICAgICAgICAgIGNvbnRleHQ6ICd1bnJlbGF0ZWQtY29udGV4dCdcblxuICAgICAgICBleHRyYWN0ZWRTdHlsZXMgPSBwcmV2aWV3LmdldFRleHRFZGl0b3JTdHlsZXMoKVxuXG4gICAgICBpdCBcInJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyBhdG9tLXRleHQtZWRpdG9yIGNzcyBzdHlsZSBzdHJpbmdzXCIsIC0+XG4gICAgICAgIGV4cGVjdChleHRyYWN0ZWRTdHlsZXMuaW5kZXhPZih0ZXh0RWRpdG9yU3R5bGUpKS50b0JlR3JlYXRlclRoYW4oLTEpXG5cbiAgICAgIGl0IFwiZG9lcyBub3QgcmV0dXJuIG90aGVyIHN0eWxlc1wiLCAtPlxuICAgICAgICBleHBlY3QoZXh0cmFjdGVkU3R5bGVzLmluZGV4T2YodW5yZWxhdGVkU3R5bGUpKS50b0JlKC0xKVxuXG4gIGRlc2NyaWJlIFwid2hlbiBjb3JlOmNvcHkgaXMgdHJpZ2dlcmVkXCIsIC0+XG4gICAgaXQgXCJ3cml0ZXMgdGhlIHJlbmRlcmVkIEhUTUwgdG8gdGhlIGNsaXBib2FyZFwiLCAtPlxuICAgICAgcHJldmlldy5kZXN0cm95KClcbiAgICAgIHByZXZpZXcuZWxlbWVudC5yZW1vdmUoKVxuXG4gICAgICBmaWxlUGF0aCA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpWzBdLnJlc29sdmUoJ3N1YmRpci9jb2RlLWJsb2NrLm1kJylcbiAgICAgIHByZXZpZXcgPSBuZXcgTWFya2Rvd25NaW5kbWFwVmlldyh7ZmlsZVBhdGh9KVxuICAgICAgamFzbWluZS5hdHRhY2hUb0RPTShwcmV2aWV3LmVsZW1lbnQpXG5cbiAgICAgIHdhaXRzRm9yUHJvbWlzZSAtPlxuICAgICAgICBwcmV2aWV3LnJlbmRlck1hcmtkb3duKClcblxuICAgICAgcnVucyAtPlxuICAgICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoIHByZXZpZXcuZWxlbWVudCwgJ2NvcmU6Y29weSdcblxuICAgICAgd2FpdHNGb3IgLT5cbiAgICAgICAgYXRvbS5jbGlwYm9hcmQucmVhZCgpIGlzbnQgXCJpbml0aWFsIGNsaXBib2FyZCBjb250ZW50XCJcblxuICAgICAgcnVucyAtPlxuICAgICAgICBleHBlY3QoYXRvbS5jbGlwYm9hcmQucmVhZCgpKS50b0JlIFwiXCJcIlxuICAgICAgICAgPGgxIGlkPVwiY29kZS1ibG9ja1wiPkNvZGUgQmxvY2s8L2gxPlxuICAgICAgICAgPHByZSBjbGFzcz1cImVkaXRvci1jb2xvcnMgbGFuZy1qYXZhc2NyaXB0XCI+PGRpdiBjbGFzcz1cImxpbmVcIj48c3BhbiBjbGFzcz1cInNvdXJjZSBqc1wiPjxzcGFuIGNsYXNzPVwia2V5d29yZCBjb250cm9sIGpzXCI+PHNwYW4+aWY8L3NwYW4+PC9zcGFuPjxzcGFuPiZuYnNwO2EmbmJzcDs8L3NwYW4+PHNwYW4gY2xhc3M9XCJrZXl3b3JkIG9wZXJhdG9yIGpzXCI+PHNwYW4+PT09PC9zcGFuPjwvc3Bhbj48c3Bhbj4mbmJzcDs8L3NwYW4+PHNwYW4gY2xhc3M9XCJjb25zdGFudCBudW1lcmljIGpzXCI+PHNwYW4+Mzwvc3Bhbj48L3NwYW4+PHNwYW4+Jm5ic3A7PC9zcGFuPjxzcGFuIGNsYXNzPVwibWV0YSBicmFjZSBjdXJseSBqc1wiPjxzcGFuPns8L3NwYW4+PC9zcGFuPjwvc3Bhbj48L2Rpdj48ZGl2IGNsYXNzPVwibGluZVwiPjxzcGFuIGNsYXNzPVwic291cmNlIGpzXCI+PHNwYW4+Jm5ic3A7Jm5ic3A7YiZuYnNwOzwvc3Bhbj48c3BhbiBjbGFzcz1cImtleXdvcmQgb3BlcmF0b3IganNcIj48c3Bhbj49PC9zcGFuPjwvc3Bhbj48c3Bhbj4mbmJzcDs8L3NwYW4+PHNwYW4gY2xhc3M9XCJjb25zdGFudCBudW1lcmljIGpzXCI+PHNwYW4+NTwvc3Bhbj48L3NwYW4+PC9zcGFuPjwvZGl2PjxkaXYgY2xhc3M9XCJsaW5lXCI+PHNwYW4gY2xhc3M9XCJzb3VyY2UganNcIj48c3BhbiBjbGFzcz1cIm1ldGEgYnJhY2UgY3VybHkganNcIj48c3Bhbj59PC9zcGFuPjwvc3Bhbj48L3NwYW4+PC9kaXY+PC9wcmU+XG4gICAgICAgICA8cD5lbmNvZGluZyBcXHUyMTkyIGlzc3VlPC9wPlxuICAgICAgICBcIlwiXCJcbiJdfQ==
