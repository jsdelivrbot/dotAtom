(function() {
  "use strict";
  var MathJaxHelper, UpdatePreview, WrappedDomTree, prepareCodeBlocksForAtomEditors, renderer;

  WrappedDomTree = require('./wrapped-dom-tree');

  MathJaxHelper = require('./mathjax-helper');

  renderer = require('./renderer');

  module.exports = UpdatePreview = (function() {
    function UpdatePreview(dom) {
      this.tree = new WrappedDomTree(dom, true);
      this.domFragment = document.createDocumentFragment();
    }

    UpdatePreview.prototype.update = function(domFragment, renderLaTeX) {
      var elm, firstTime, j, len, newDom, newTree, r, ref;
      prepareCodeBlocksForAtomEditors(domFragment);
      if (domFragment.isEqualNode(this.domFragment)) {
        return;
      }
      firstTime = this.domFragment.childElementCount === 0;
      this.domFragment = domFragment.cloneNode(true);
      newDom = document.createElement("div");
      newDom.className = "update-preview";
      newDom.appendChild(domFragment);
      newTree = new WrappedDomTree(newDom);
      r = this.tree.diffTo(newTree);
      newTree.removeSelf();
      if (firstTime) {
        r.possibleReplace = null;
        r.last = null;
      }
      if (renderLaTeX) {
        r.inserted = r.inserted.map(function(elm) {
          while (elm && !elm.innerHTML) {
            elm = elm.parentElement;
          }
          return elm;
        });
        r.inserted = r.inserted.filter(function(elm) {
          return !!elm;
        });
        MathJaxHelper.mathProcessor(r.inserted);
      }
      if (!(atom.config.get('markdown-preview-plus.enablePandoc') && atom.config.get('markdown-preview-plus.useNativePandocCodeStyles'))) {
        ref = r.inserted;
        for (j = 0, len = ref.length; j < len; j++) {
          elm = ref[j];
          if (elm instanceof Element) {
            renderer.convertCodeBlocksToAtomEditors(elm);
          }
        }
      }
      this.updateOrderedListsStart();
      return r;
    };

    UpdatePreview.prototype.updateOrderedListsStart = function() {
      var i, j, parsedOLs, parsedStart, previewOLs, previewStart, ref;
      previewOLs = this.tree.shownTree.dom.querySelectorAll('ol');
      parsedOLs = this.domFragment.querySelectorAll('ol');
      for (i = j = 0, ref = parsedOLs.length - 1; j <= ref; i = j += 1) {
        previewStart = previewOLs[i].getAttribute('start');
        parsedStart = parsedOLs[i].getAttribute('start');
        if (previewStart === parsedStart) {
          continue;
        } else if (parsedStart != null) {
          previewOLs[i].setAttribute('start', parsedStart);
        } else {
          previewOLs[i].removeAttribute('start');
        }
      }
    };

    return UpdatePreview;

  })();

  prepareCodeBlocksForAtomEditors = function(domFragment) {
    var j, len, preElement, preWrapper, ref;
    ref = domFragment.querySelectorAll('pre');
    for (j = 0, len = ref.length; j < len; j++) {
      preElement = ref[j];
      preWrapper = document.createElement('span');
      preWrapper.className = 'atom-text-editor';
      preElement.parentNode.insertBefore(preWrapper, preElement);
      preWrapper.appendChild(preElement);
    }
    return domFragment;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21hcmtkb3duLXByZXZpZXctcGx1cy9saWIvdXBkYXRlLXByZXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXNCQTtFQUFBO0FBQUEsTUFBQTs7RUFFQSxjQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUjs7RUFDbEIsYUFBQSxHQUFrQixPQUFBLENBQVEsa0JBQVI7O0VBQ2xCLFFBQUEsR0FBa0IsT0FBQSxDQUFRLFlBQVI7O0VBRWxCLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0lBR1IsdUJBQUMsR0FBRDtNQUNYLElBQUMsQ0FBQSxJQUFELEdBQW9CLElBQUEsY0FBQSxDQUFlLEdBQWYsRUFBb0IsSUFBcEI7TUFDcEIsSUFBQyxDQUFBLFdBQUQsR0FBZ0IsUUFBUSxDQUFDLHNCQUFULENBQUE7SUFGTDs7NEJBSWIsTUFBQSxHQUFRLFNBQUMsV0FBRCxFQUFjLFdBQWQ7QUFDTixVQUFBO01BQUEsK0JBQUEsQ0FBZ0MsV0FBaEM7TUFFQSxJQUFHLFdBQVcsQ0FBQyxXQUFaLENBQXdCLElBQUMsQ0FBQSxXQUF6QixDQUFIO0FBQ0UsZUFERjs7TUFHQSxTQUFBLEdBQWdCLElBQUMsQ0FBQSxXQUFXLENBQUMsaUJBQWIsS0FBa0M7TUFDbEQsSUFBQyxDQUFBLFdBQUQsR0FBZ0IsV0FBVyxDQUFDLFNBQVosQ0FBc0IsSUFBdEI7TUFFaEIsTUFBQSxHQUFvQixRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNwQixNQUFNLENBQUMsU0FBUCxHQUFvQjtNQUNwQixNQUFNLENBQUMsV0FBUCxDQUFtQixXQUFuQjtNQUNBLE9BQUEsR0FBd0IsSUFBQSxjQUFBLENBQWUsTUFBZjtNQUV4QixDQUFBLEdBQUksSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLENBQWEsT0FBYjtNQUNKLE9BQU8sQ0FBQyxVQUFSLENBQUE7TUFFQSxJQUFHLFNBQUg7UUFDRSxDQUFDLENBQUMsZUFBRixHQUFvQjtRQUNwQixDQUFDLENBQUMsSUFBRixHQUFvQixLQUZ0Qjs7TUFJQSxJQUFHLFdBQUg7UUFDRSxDQUFDLENBQUMsUUFBRixHQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBWCxDQUFlLFNBQUMsR0FBRDtBQUMxQixpQkFBTSxHQUFBLElBQVEsQ0FBSSxHQUFHLENBQUMsU0FBdEI7WUFDRSxHQUFBLEdBQU0sR0FBRyxDQUFDO1VBRFo7aUJBRUE7UUFIMEIsQ0FBZjtRQUliLENBQUMsQ0FBQyxRQUFGLEdBQWEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFYLENBQWtCLFNBQUMsR0FBRDtpQkFDN0IsQ0FBQyxDQUFDO1FBRDJCLENBQWxCO1FBRWIsYUFBYSxDQUFDLGFBQWQsQ0FBNEIsQ0FBQyxDQUFDLFFBQTlCLEVBUEY7O01BU0EsSUFBQSxDQUFBLENBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9DQUFoQixDQUFBLElBQ0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlEQUFoQixDQURSLENBQUE7QUFFRTtBQUFBLGFBQUEscUNBQUE7O1VBQ0UsSUFBRyxHQUFBLFlBQWUsT0FBbEI7WUFDRSxRQUFRLENBQUMsOEJBQVQsQ0FBd0MsR0FBeEMsRUFERjs7QUFERixTQUZGOztNQU1BLElBQUMsQ0FBQSx1QkFBRCxDQUFBO0FBRUEsYUFBTztJQXRDRDs7NEJBd0NSLHVCQUFBLEdBQXlCLFNBQUE7QUFDdkIsVUFBQTtNQUFBLFVBQUEsR0FBYSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsZ0JBQXBCLENBQXFDLElBQXJDO01BQ2IsU0FBQSxHQUFhLElBQUMsQ0FBQSxXQUFXLENBQUMsZ0JBQWIsQ0FBOEIsSUFBOUI7QUFFYixXQUFTLDJEQUFUO1FBQ0UsWUFBQSxHQUFnQixVQUFXLENBQUEsQ0FBQSxDQUFFLENBQUMsWUFBZCxDQUEyQixPQUEzQjtRQUNoQixXQUFBLEdBQWdCLFNBQVUsQ0FBQSxDQUFBLENBQUUsQ0FBQyxZQUFiLENBQTBCLE9BQTFCO1FBRWhCLElBQUcsWUFBQSxLQUFnQixXQUFuQjtBQUNFLG1CQURGO1NBQUEsTUFFSyxJQUFHLG1CQUFIO1VBQ0gsVUFBVyxDQUFBLENBQUEsQ0FBRSxDQUFDLFlBQWQsQ0FBMkIsT0FBM0IsRUFBb0MsV0FBcEMsRUFERztTQUFBLE1BQUE7VUFHSCxVQUFXLENBQUEsQ0FBQSxDQUFFLENBQUMsZUFBZCxDQUE4QixPQUE5QixFQUhHOztBQU5QO0lBSnVCOzs7Ozs7RUFpQjNCLCtCQUFBLEdBQWtDLFNBQUMsV0FBRDtBQUNoQyxRQUFBO0FBQUE7QUFBQSxTQUFBLHFDQUFBOztNQUNFLFVBQUEsR0FBYSxRQUFRLENBQUMsYUFBVCxDQUF1QixNQUF2QjtNQUNiLFVBQVUsQ0FBQyxTQUFYLEdBQXVCO01BQ3ZCLFVBQVUsQ0FBQyxVQUFVLENBQUMsWUFBdEIsQ0FBbUMsVUFBbkMsRUFBK0MsVUFBL0M7TUFDQSxVQUFVLENBQUMsV0FBWCxDQUF1QixVQUF2QjtBQUpGO1dBS0E7RUFOZ0M7QUF0RWxDIiwic291cmNlc0NvbnRlbnQiOlsiIyBUaGlzIGZpbGUgaW5jb3Jwb3JhdGVzIGNvZGUgZnJvbSBbbWFya21vbl0oaHR0cHM6Ly9naXRodWIuY29tL3l5amhhby9tYXJrbW9uKVxuIyBjb3ZlcmVkIGJ5IHRoZSBmb2xsb3dpbmcgdGVybXM6XG4jXG4jIENvcHlyaWdodCAoYykgMjAxNCwgWWFvIFl1amlhbiwgaHR0cDovL3lqeWFvLmNvbVxuI1xuIyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4jIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiMgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xuIyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4jIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuIyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuI1xuIyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuIyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiNcbiMgVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuIyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiMgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4jIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiMgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiMgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuIyBUSEUgU09GVFdBUkUuXG5cInVzZSBzdHJpY3RcIlxuXG5XcmFwcGVkRG9tVHJlZSAgPSByZXF1aXJlICcuL3dyYXBwZWQtZG9tLXRyZWUnXG5NYXRoSmF4SGVscGVyICAgPSByZXF1aXJlICcuL21hdGhqYXgtaGVscGVyJ1xucmVuZGVyZXIgICAgICAgID0gcmVxdWlyZSAnLi9yZW5kZXJlcidcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBVcGRhdGVQcmV2aWV3XG4gICMgQHBhcmFtIGRvbSBBIERPTSBlbGVtZW50IG9iamVjdFxuICAjICAgIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9lbGVtZW50XG4gIGNvbnN0cnVjdG9yOiAoZG9tKSAtPlxuICAgIEB0cmVlICAgICAgICAgPSBuZXcgV3JhcHBlZERvbVRyZWUgZG9tLCB0cnVlXG4gICAgQGRvbUZyYWdtZW50ICA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKVxuXG4gIHVwZGF0ZTogKGRvbUZyYWdtZW50LCByZW5kZXJMYVRlWCkgLT5cbiAgICBwcmVwYXJlQ29kZUJsb2Nrc0ZvckF0b21FZGl0b3JzKGRvbUZyYWdtZW50KVxuXG4gICAgaWYgZG9tRnJhZ21lbnQuaXNFcXVhbE5vZGUoQGRvbUZyYWdtZW50KVxuICAgICAgcmV0dXJuXG5cbiAgICBmaXJzdFRpbWUgICAgID0gQGRvbUZyYWdtZW50LmNoaWxkRWxlbWVudENvdW50IGlzIDBcbiAgICBAZG9tRnJhZ21lbnQgID0gZG9tRnJhZ21lbnQuY2xvbmVOb2RlKHRydWUpXG5cbiAgICBuZXdEb20gICAgICAgICAgICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgXCJkaXZcIlxuICAgIG5ld0RvbS5jbGFzc05hbWUgID0gXCJ1cGRhdGUtcHJldmlld1wiXG4gICAgbmV3RG9tLmFwcGVuZENoaWxkIGRvbUZyYWdtZW50XG4gICAgbmV3VHJlZSAgICAgICAgICAgPSBuZXcgV3JhcHBlZERvbVRyZWUgbmV3RG9tXG5cbiAgICByID0gQHRyZWUuZGlmZlRvIG5ld1RyZWVcbiAgICBuZXdUcmVlLnJlbW92ZVNlbGYoKVxuXG4gICAgaWYgZmlyc3RUaW1lXG4gICAgICByLnBvc3NpYmxlUmVwbGFjZSA9IG51bGxcbiAgICAgIHIubGFzdCAgICAgICAgICAgID0gbnVsbFxuXG4gICAgaWYgcmVuZGVyTGFUZVhcbiAgICAgIHIuaW5zZXJ0ZWQgPSByLmluc2VydGVkLm1hcCAoZWxtKSAtPlxuICAgICAgICB3aGlsZSBlbG0gYW5kIG5vdCBlbG0uaW5uZXJIVE1MXG4gICAgICAgICAgZWxtID0gZWxtLnBhcmVudEVsZW1lbnRcbiAgICAgICAgZWxtXG4gICAgICByLmluc2VydGVkID0gci5pbnNlcnRlZC5maWx0ZXIgKGVsbSkgLT5cbiAgICAgICAgISFlbG1cbiAgICAgIE1hdGhKYXhIZWxwZXIubWF0aFByb2Nlc3NvciByLmluc2VydGVkXG5cbiAgICB1bmxlc3MgYXRvbS5jb25maWcuZ2V0KCdtYXJrZG93bi1wcmV2aWV3LXBsdXMuZW5hYmxlUGFuZG9jJykgXFxcbiAgICAgICAgYW5kIGF0b20uY29uZmlnLmdldCgnbWFya2Rvd24tcHJldmlldy1wbHVzLnVzZU5hdGl2ZVBhbmRvY0NvZGVTdHlsZXMnKVxuICAgICAgZm9yIGVsbSBpbiByLmluc2VydGVkXG4gICAgICAgIGlmIGVsbSBpbnN0YW5jZW9mIEVsZW1lbnRcbiAgICAgICAgICByZW5kZXJlci5jb252ZXJ0Q29kZUJsb2Nrc1RvQXRvbUVkaXRvcnMgZWxtXG5cbiAgICBAdXBkYXRlT3JkZXJlZExpc3RzU3RhcnQoKVxuXG4gICAgcmV0dXJuIHJcblxuICB1cGRhdGVPcmRlcmVkTGlzdHNTdGFydDogLT5cbiAgICBwcmV2aWV3T0xzID0gQHRyZWUuc2hvd25UcmVlLmRvbS5xdWVyeVNlbGVjdG9yQWxsKCdvbCcpXG4gICAgcGFyc2VkT0xzICA9IEBkb21GcmFnbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdvbCcpXG5cbiAgICBmb3IgaSBpbiBbMC4uKHBhcnNlZE9Mcy5sZW5ndGgtMSldIGJ5IDFcbiAgICAgIHByZXZpZXdTdGFydCAgPSBwcmV2aWV3T0xzW2ldLmdldEF0dHJpYnV0ZSAnc3RhcnQnXG4gICAgICBwYXJzZWRTdGFydCAgID0gcGFyc2VkT0xzW2ldLmdldEF0dHJpYnV0ZSAnc3RhcnQnXG5cbiAgICAgIGlmIHByZXZpZXdTdGFydCBpcyBwYXJzZWRTdGFydFxuICAgICAgICBjb250aW51ZVxuICAgICAgZWxzZSBpZiBwYXJzZWRTdGFydD9cbiAgICAgICAgcHJldmlld09Mc1tpXS5zZXRBdHRyaWJ1dGUgJ3N0YXJ0JywgcGFyc2VkU3RhcnRcbiAgICAgIGVsc2VcbiAgICAgICAgcHJldmlld09Mc1tpXS5yZW1vdmVBdHRyaWJ1dGUgJ3N0YXJ0J1xuXG4gICAgcmV0dXJuXG5cbnByZXBhcmVDb2RlQmxvY2tzRm9yQXRvbUVkaXRvcnMgPSAoZG9tRnJhZ21lbnQpIC0+XG4gIGZvciBwcmVFbGVtZW50IGluIGRvbUZyYWdtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ3ByZScpXG4gICAgcHJlV3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKVxuICAgIHByZVdyYXBwZXIuY2xhc3NOYW1lID0gJ2F0b20tdGV4dC1lZGl0b3InXG4gICAgcHJlRWxlbWVudC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwcmVXcmFwcGVyLCBwcmVFbGVtZW50KVxuICAgIHByZVdyYXBwZXIuYXBwZW5kQ2hpbGQocHJlRWxlbWVudClcbiAgZG9tRnJhZ21lbnRcbiJdfQ==
