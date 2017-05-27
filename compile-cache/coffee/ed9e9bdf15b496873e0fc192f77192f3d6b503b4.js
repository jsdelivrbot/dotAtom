(function() {
  var RefView, SelectListView,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  SelectListView = require('atom-space-pen-views').SelectListView;

  module.exports = RefView = (function(superClass) {
    extend(RefView, superClass);

    function RefView() {
      return RefView.__super__.constructor.apply(this, arguments);
    }

    RefView.prototype.initialize = function(bibtex) {
      RefView.__super__.initialize.call(this);
      this.addClass('reference-search');
      this.setItems(bibtex);
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: false
        });
      }
      this.resultTemplate = atom.config.get("autocomplete-bibtex.resultTemplate");
      return atom.config.observe("autocomplete-bibtex.resultTemplate", (function(_this) {
        return function(resultTemplate) {
          return _this.resultTemplate = resultTemplate;
        };
      })(this));
    };

    RefView.prototype.show = function() {
      this.panel.show();
      return this.focusFilterEditor();
    };

    RefView.prototype.toggle = function() {
      if (this.panel.isVisible()) {
        return this.panel.hide();
      } else {
        this.panel.show();
        return this.focusFilterEditor();
      }
    };

    RefView.prototype.viewForItem = function(item) {
      var typeClass;
      if (item.entryTags && item.entryTags.title && item.entryTags.author) {
        typeClass = "icon-mortar-board";
        if (item.entryTags.journal) {
          typeClass = "icon-file-text";
        } else if (item.entryTags.booktitle) {
          typeClass = "icon-repo";
        }
        return "<li><table>\n<tr>\n  <td>\n    <div class=\"icon-space\">\n      <i class=\"icon " + typeClass + "\"></i>\n    </div>\n  </td>\n  <td>\n  <div>\n    <span>" + item.entryTags.prettyAuthors + "</span>\n    <span class='citeKey'><em>[" + item.citationKey + "]</em></span>\n    <br>\n    <p class=\"secondary-line\">" + item.entryTags.prettyTitle + "</p>\n  </div>\n  </td>\n</tr>\n</table>\n\n</li>";
      } else {
        return "";
      }
    };

    RefView.prototype.confirmed = function(item) {
      var citekey, editor;
      editor = atom.workspace.getActiveTextEditor();
      citekey = this.resultTemplate.replace('[key]', item.citationKey);
      editor.insertText(citekey);
      return this.panel.hide();
    };

    RefView.prototype.cancel = function() {
      RefView.__super__.cancel.apply(this, arguments);
      if (this.panel.isVisible()) {
        return this.panel.hide();
      }
    };

    RefView.prototype.getFilterKey = function() {
      return 'fuzzyLabel';
    };

    return RefView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2F1dG9jb21wbGV0ZS1iaWJ0ZXgvbGliL3JlZi12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQTtBQUFBLE1BQUEsdUJBQUE7SUFBQTs7O0VBQUMsaUJBQWtCLE9BQUEsQ0FBUSxzQkFBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztzQkFDSixVQUFBLEdBQVksU0FBQyxNQUFEO01BQ1Ysc0NBQUE7TUFFQSxJQUFDLENBQUEsUUFBRCxDQUFVLGtCQUFWO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxNQUFWOztRQUNBLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1VBQVksT0FBQSxFQUFTLEtBQXJCO1NBQTdCOztNQUVWLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixvQ0FBaEI7YUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLG9DQUFwQixFQUEwRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsY0FBRDtpQkFDeEQsS0FBQyxDQUFBLGNBQUQsR0FBa0I7UUFEc0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFEO0lBUlU7O3NCQVdaLElBQUEsR0FBTSxTQUFBO01BQ0osSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQUZJOztzQkFJTixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQyxTQUFQLENBQUEsQ0FBSDtlQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBLEVBREY7T0FBQSxNQUFBO1FBR0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7ZUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUpGOztJQURNOztzQkFPUixXQUFBLEdBQWEsU0FBQyxJQUFEO0FBR1gsVUFBQTtNQUFBLElBQUcsSUFBSSxDQUFDLFNBQUwsSUFBbUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFsQyxJQUE0QyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQTlEO1FBRUUsU0FBQSxHQUFZO1FBQ1osSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQWxCO1VBQ0UsU0FBQSxHQUFZLGlCQURkO1NBQUEsTUFFSyxJQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBbEI7VUFDSCxTQUFBLEdBQVksWUFEVDs7QUFJTCxlQUFPLG1GQUFBLEdBSWdCLFNBSmhCLEdBSTBCLDJEQUoxQixHQVNLLElBQUksQ0FBQyxTQUFTLENBQUMsYUFUcEIsR0FTa0MsMENBVGxDLEdBVTBCLElBQUksQ0FBQyxXQVYvQixHQVUyQywyREFWM0MsR0FZeUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQVp4QyxHQVlvRCxvREFyQjdEO09BQUEsTUFBQTtBQTZCRSxlQUFPLEdBN0JUOztJQUhXOztzQkF3Q2IsU0FBQSxHQUFXLFNBQUMsSUFBRDtBQUVULFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO01BQ1QsT0FBQSxHQUFVLElBQUMsQ0FBQSxjQUFjLENBQUMsT0FBaEIsQ0FBd0IsT0FBeEIsRUFBaUMsSUFBSSxDQUFDLFdBQXRDO01BQ1YsTUFBTSxDQUFDLFVBQVAsQ0FBa0IsT0FBbEI7YUFDQSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTtJQUxTOztzQkFPWCxNQUFBLEdBQVEsU0FBQTtNQUNOLHFDQUFBLFNBQUE7TUFDQSxJQUFHLElBQUMsQ0FBQSxLQUFLLENBQUMsU0FBUCxDQUFBLENBQUg7ZUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQSxFQURGOztJQUZNOztzQkFLUixZQUFBLEdBQWMsU0FBQTthQUNaO0lBRFk7Ozs7S0EzRU07QUFIdEIiLCJzb3VyY2VzQ29udGVudCI6WyJcbiMge1ZpZXd9ID0gcmVxdWlyZSAnc3BhY2UtcGVuJ1xue1NlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSZWZWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgaW5pdGlhbGl6ZTogKGJpYnRleCktPlxuICAgIHN1cGVyKClcbiAgICAjIEBhZGRDbGFzcygnb3ZlcmxheSBmcm9tLXRvcCcpXG4gICAgQGFkZENsYXNzKCdyZWZlcmVuY2Utc2VhcmNoJylcbiAgICBAc2V0SXRlbXMoYmlidGV4KVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMsIHZpc2libGU6IGZhbHNlKVxuICAgICMgQHBhbmVsLnNob3coKVxuICAgIEByZXN1bHRUZW1wbGF0ZSA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1iaWJ0ZXgucmVzdWx0VGVtcGxhdGVcIlxuICAgIGF0b20uY29uZmlnLm9ic2VydmUgXCJhdXRvY29tcGxldGUtYmlidGV4LnJlc3VsdFRlbXBsYXRlXCIsIChyZXN1bHRUZW1wbGF0ZSkgPT5cbiAgICAgIEByZXN1bHRUZW1wbGF0ZSA9IHJlc3VsdFRlbXBsYXRlXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQHBhbmVsLmlzVmlzaWJsZSgpXG4gICAgICBAcGFuZWwuaGlkZSgpXG4gICAgZWxzZVxuICAgICAgQHBhbmVsLnNob3coKVxuICAgICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICB2aWV3Rm9ySXRlbTogKGl0ZW0pLT5cbiAgICAjIGNvbnNvbGUubG9nIGl0ZW1cblxuICAgIGlmIGl0ZW0uZW50cnlUYWdzIGFuZCBpdGVtLmVudHJ5VGFncy50aXRsZSBhbmQgaXRlbS5lbnRyeVRhZ3MuYXV0aG9yXG5cbiAgICAgIHR5cGVDbGFzcyA9IFwiaWNvbi1tb3J0YXItYm9hcmRcIlxuICAgICAgaWYgaXRlbS5lbnRyeVRhZ3Muam91cm5hbFxuICAgICAgICB0eXBlQ2xhc3MgPSBcImljb24tZmlsZS10ZXh0XCJcbiAgICAgIGVsc2UgaWYgaXRlbS5lbnRyeVRhZ3MuYm9va3RpdGxlXG4gICAgICAgIHR5cGVDbGFzcyA9IFwiaWNvbi1yZXBvXCJcblxuXG4gICAgICByZXR1cm4gXCJcIlwiPGxpPjx0YWJsZT5cbiAgICAgIDx0cj5cbiAgICAgICAgPHRkPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJpY29uLXNwYWNlXCI+XG4gICAgICAgICAgICA8aSBjbGFzcz1cImljb24gI3t0eXBlQ2xhc3N9XCI+PC9pPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L3RkPlxuICAgICAgICA8dGQ+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPHNwYW4+I3tpdGVtLmVudHJ5VGFncy5wcmV0dHlBdXRob3JzfTwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz0nY2l0ZUtleSc+PGVtPlsje2l0ZW0uY2l0YXRpb25LZXl9XTwvZW0+PC9zcGFuPlxuICAgICAgICAgIDxicj5cbiAgICAgICAgICA8cCBjbGFzcz1cInNlY29uZGFyeS1saW5lXCI+I3tpdGVtLmVudHJ5VGFncy5wcmV0dHlUaXRsZX08L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8L3RkPlxuICAgICAgPC90cj5cbiAgICAgIDwvdGFibGU+XG5cbiAgICAgIDwvbGk+XCJcIlwiXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIFwiXCJcbiMgPGRpdiBjbGFzcz1cImVudHJ5XCI+XG4jICAgPHNwYW4+I3tpdGVtLmVudHJ5VGFncy5wcmV0dHlBdXRob3JzfTwvc3Bhbj5cbiMgICA8c3BhbiBjbGFzcz0nY2l0ZUtleSc+I3tpdGVtLmNpdGF0aW9uS2V5fTwvc3Bhbj5cbiMgICA8YnI+XG4jICAgPHNwYW4+I3tpdGVtLmVudHJ5VGFncy5wcmV0dHlUaXRsZX08L3NwYW4+XG4jIDwvZGl2PlxuIyA8L2Rpdj5cbiAgY29uZmlybWVkOiAoaXRlbSktPlxuICAgICNpbnNlcnQgcmVmIGF0IGN1cnNvclxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGNpdGVrZXkgPSBAcmVzdWx0VGVtcGxhdGUucmVwbGFjZSgnW2tleV0nLCBpdGVtLmNpdGF0aW9uS2V5KVxuICAgIGVkaXRvci5pbnNlcnRUZXh0KGNpdGVrZXkpXG4gICAgQHBhbmVsLmhpZGUoKVxuXG4gIGNhbmNlbDogLT5cbiAgICBzdXBlclxuICAgIGlmIEBwYW5lbC5pc1Zpc2libGUoKVxuICAgICAgQHBhbmVsLmhpZGUoKVxuXG4gIGdldEZpbHRlcktleTogLT5cbiAgICAnZnV6enlMYWJlbCdcblxuIyBhdXRob3I6IEBwcmV0dGlmeU5hbWUoYXV0aG9yLCB5ZXMpLFxuIyBrZXk6IGNpdGF0aW9uLmNpdGF0aW9uS2V5LFxuIyBsYWJlbDogXCIje2NpdGF0aW9uLmVudHJ5VGFncy5wcmV0dHlUaXRsZX0gXFxcbiMgICBieSAje2NpdGF0aW9uLmVudHJ5VGFncy5wcmV0dHlBdXRob3JzfVwiXG4jIH1cbiJdfQ==
