(function() {
  var MarkdownListsView;

  module.exports = MarkdownListsView = (function() {
    function MarkdownListsView(serializeState) {
      var message;
      this.element = document.createElement('div');
      this.element.classList.add('markdown-lists');
      message = document.createElement('div');
      message.textContent = "The MarkdownLists package is Alive! It's ALIVE!";
      message.classList.add('message');
      this.element.appendChild(message);
    }

    MarkdownListsView.prototype.serialize = function() {};

    MarkdownListsView.prototype.destroy = function() {
      return this.element.remove();
    };

    MarkdownListsView.prototype.getElement = function() {
      return this.element;
    };

    return MarkdownListsView;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL21hcmtkb3duLWxpc3RzL2xpYi9tYXJrZG93bi1saXN0cy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtJQUNTLDJCQUFDLGNBQUQ7QUFFWCxVQUFBO01BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNYLElBQUMsQ0FBQSxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQW5CLENBQXVCLGdCQUF2QjtNQUdBLE9BQUEsR0FBVSxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QjtNQUNWLE9BQU8sQ0FBQyxXQUFSLEdBQXNCO01BQ3RCLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBbEIsQ0FBc0IsU0FBdEI7TUFDQSxJQUFDLENBQUEsT0FBTyxDQUFDLFdBQVQsQ0FBcUIsT0FBckI7SUFUVzs7Z0NBWWIsU0FBQSxHQUFXLFNBQUEsR0FBQTs7Z0NBR1gsT0FBQSxHQUFTLFNBQUE7YUFDUCxJQUFDLENBQUEsT0FBTyxDQUFDLE1BQVQsQ0FBQTtJQURPOztnQ0FHVCxVQUFBLEdBQVksU0FBQTthQUNWLElBQUMsQ0FBQTtJQURTOzs7OztBQXBCZCIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE1hcmtkb3duTGlzdHNWaWV3XG4gIGNvbnN0cnVjdG9yOiAoc2VyaWFsaXplU3RhdGUpIC0+XG4gICAgIyBDcmVhdGUgcm9vdCBlbGVtZW50XG4gICAgQGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIEBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ21hcmtkb3duLWxpc3RzJylcblxuICAgICMgQ3JlYXRlIG1lc3NhZ2UgZWxlbWVudFxuICAgIG1lc3NhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuICAgIG1lc3NhZ2UudGV4dENvbnRlbnQgPSBcIlRoZSBNYXJrZG93bkxpc3RzIHBhY2thZ2UgaXMgQWxpdmUhIEl0J3MgQUxJVkUhXCJcbiAgICBtZXNzYWdlLmNsYXNzTGlzdC5hZGQoJ21lc3NhZ2UnKVxuICAgIEBlbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2UpXG5cbiAgIyBSZXR1cm5zIGFuIG9iamVjdCB0aGF0IGNhbiBiZSByZXRyaWV2ZWQgd2hlbiBwYWNrYWdlIGlzIGFjdGl2YXRlZFxuICBzZXJpYWxpemU6IC0+XG5cbiAgIyBUZWFyIGRvd24gYW55IHN0YXRlIGFuZCBkZXRhY2hcbiAgZGVzdHJveTogLT5cbiAgICBAZWxlbWVudC5yZW1vdmUoKVxuXG4gIGdldEVsZW1lbnQ6IC0+XG4gICAgQGVsZW1lbnRcbiJdfQ==
