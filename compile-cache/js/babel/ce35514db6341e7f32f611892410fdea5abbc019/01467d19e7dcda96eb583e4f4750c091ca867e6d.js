Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.create = create;
var PADDING_CHARACTER = ' ';

exports.PADDING_CHARACTER = PADDING_CHARACTER;

function create(intention, length) {
  var tries = 0;
  var element = document.createElement('intention-inline');
  element.style.opacity = '0';
  element.textContent = PADDING_CHARACTER.repeat(length);
  function checkStyle() {
    if (++tries === 20) {
      return;
    }
    var styles = getComputedStyle(element);
    if (styles.lineHeight && styles.width !== 'auto') {
      element.style.opacity = '1';
      element.style.top = '-' + styles.lineHeight;
    } else requestAnimationFrame(checkStyle);
  }
  requestAnimationFrame(checkStyle);
  return element;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9pbnRlbnRpb25zL2xpYi9lbGVtZW50cy9oaWdobGlnaHQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlPLElBQU0saUJBQWlCLEdBQUcsR0FBRyxDQUFBOzs7O0FBRTdCLFNBQVMsTUFBTSxDQUFDLFNBQXdCLEVBQUUsTUFBYyxFQUFlO0FBQzVFLE1BQUksS0FBSyxHQUFHLENBQUMsQ0FBQTtBQUNiLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQTtBQUMxRCxTQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUE7QUFDM0IsU0FBTyxDQUFDLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUE7QUFDdEQsV0FBUyxVQUFVLEdBQUc7QUFDcEIsUUFBSSxFQUFFLEtBQUssS0FBSyxFQUFFLEVBQUU7QUFBRSxhQUFNO0tBQUU7QUFDOUIsUUFBTSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUE7QUFDeEMsUUFBSSxNQUFNLENBQUMsVUFBVSxJQUFJLE1BQU0sQ0FBQyxLQUFLLEtBQUssTUFBTSxFQUFFO0FBQ2hELGFBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQTtBQUMzQixhQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQTtLQUM1QyxNQUFNLHFCQUFxQixDQUFDLFVBQVUsQ0FBQyxDQUFBO0dBQ3pDO0FBQ0QsdUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDakMsU0FBTyxPQUFPLENBQUE7Q0FDZiIsImZpbGUiOiIvVXNlcnMvbHJhbWlyZXovLmF0b20vcGFja2FnZXMvaW50ZW50aW9ucy9saWIvZWxlbWVudHMvaGlnaGxpZ2h0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHR5cGUgeyBIaWdobGlnaHRJdGVtIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBQQURESU5HX0NIQVJBQ1RFUiA9ICfigIcnXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoaW50ZW50aW9uOiBIaWdobGlnaHRJdGVtLCBsZW5ndGg6IG51bWJlcik6IEhUTUxFbGVtZW50IHtcbiAgbGV0IHRyaWVzID0gMFxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW50ZW50aW9uLWlubGluZScpXG4gIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9ICcwJ1xuICBlbGVtZW50LnRleHRDb250ZW50ID0gUEFERElOR19DSEFSQUNURVIucmVwZWF0KGxlbmd0aClcbiAgZnVuY3Rpb24gY2hlY2tTdHlsZSgpIHtcbiAgICBpZiAoKyt0cmllcyA9PT0gMjApIHsgcmV0dXJuIH1cbiAgICBjb25zdCBzdHlsZXMgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpXG4gICAgaWYgKHN0eWxlcy5saW5lSGVpZ2h0ICYmIHN0eWxlcy53aWR0aCAhPT0gJ2F1dG8nKSB7XG4gICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAnMSdcbiAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gJy0nICsgc3R5bGVzLmxpbmVIZWlnaHRcbiAgICB9IGVsc2UgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoZWNrU3R5bGUpXG4gIH1cbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoZWNrU3R5bGUpXG4gIHJldHVybiBlbGVtZW50XG59XG4iXX0=