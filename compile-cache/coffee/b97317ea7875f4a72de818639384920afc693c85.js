(function() {
  var $$, CompositeDisposable, ExposeView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), View = ref.View, $$ = ref.$$;

  CompositeDisposable = require('atom').CompositeDisposable;

  module.exports = ExposeView = (function(superClass) {
    extend(ExposeView, superClass);

    ExposeView.content = function(title, color, pending) {
      var titleClass;
      titleClass = 'title icon-file-text';
      if (pending) {
        titleClass += ' pending';
      }
      return this.div({
        click: 'activateTab',
        "class": 'expose-tab'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'tab-header'
          }, function() {
            _this.div({
              "class": titleClass,
              'data-name': title
            }, title);
            return _this.div({
              click: 'closeTab',
              "class": 'close-icon icon-x'
            });
          });
          return _this.div({
            outlet: 'tabBody',
            "class": 'tab-body',
            style: "border-color: " + color
          });
        };
      })(this));
    };

    function ExposeView(item1, color1) {
      this.item = item1 != null ? item1 : {};
      this.color = color1 != null ? color1 : '#000';
      this.toggleActive = bind(this.toggleActive, this);
      this.refreshTab = bind(this.refreshTab, this);
      this.title = this.getItemTitle();
      this.pending = this.isItemPending();
      ExposeView.__super__.constructor.call(this, this.title, this.color, this.pending);
    }

    ExposeView.prototype.initialize = function() {
      this.disposables = new CompositeDisposable;
      this.handleEvents();
      return this.populateTabBody();
    };

    ExposeView.prototype.handleEvents = function() {
      this.on('click', '.icon-sync', this.refreshTab);
      this.disposables.add(atom.commands.add(this.element, {
        'expose:close-tab': (function(_this) {
          return function(e) {
            return _this.closeTab(e);
          };
        })(this)
      }));
      return this.disposables.add(atom.workspace.observeActivePaneItem(this.toggleActive));
    };

    ExposeView.prototype.destroy = function() {
      var ref1;
      this.remove();
      return (ref1 = this.disposables) != null ? ref1.dispose() : void 0;
    };

    ExposeView.prototype.populateTabBody = function() {
      if (this.drawImage()) {
        return;
      }
      if (this.drawMinimap()) {
        return;
      }
      return this.drawFallback();
    };

    ExposeView.prototype.drawFallback = function() {
      var iconClass, objectClass;
      objectClass = this.item.constructor.name;
      if (this.item.getIconName) {
        iconClass = 'icon-' + this.item.getIconName();
      }
      return this.tabBody.html($$(function() {
        return this.a({
          "class": iconClass || (function() {
            switch (objectClass) {
              case 'TextEditor':
                return 'icon-file-code';
              case 'ArchiveEditor':
                return 'icon-file-zip';
              default:
                return 'icon-file-text';
            }
          })()
        });
      }));
    };

    ExposeView.prototype.drawImage = function() {
      var filePath;
      if (this.item.constructor.name !== 'ImageEditor') {
        return;
      }
      filePath = this.item.file.path;
      return this.tabBody.html($$(function() {
        return this.img({
          src: filePath
        });
      }));
    };

    ExposeView.prototype.drawMinimap = function() {
      if (this.item.constructor.name !== 'TextEditor') {
        return;
      }
      if (!atom.packages.loadedPackages.minimap) {
        return;
      }
      return atom.packages.serviceHub.consume('minimap', '1.0.0', (function(_this) {
        return function(minimapAPI) {
          var minimap, minimapElement;
          if (minimapAPI.standAloneMinimapForEditor != null) {
            minimap = minimapAPI.standAloneMinimapForEditor(_this.item);
            minimapElement = atom.views.getView(minimap);
            minimapElement.style.cssText = 'width: 190px;\nheight: 130px;\nleft: 10px;\npointer-events: none;\nposition: absolute;';
            if (typeof minimap.setCharWidth === "function") {
              minimap.setCharWidth(2);
            }
            if (typeof minimap.setCharHeight === "function") {
              minimap.setCharHeight(4);
            }
            if (typeof minimap.setInterline === "function") {
              minimap.setInterline(2);
            }
            return _this.tabBody.html(minimapElement);
          } else {
            return _this.tabBody.html($$(function() {
              return this.a({
                "class": 'icon-sync'
              });
            }));
          }
        };
      })(this));
    };

    ExposeView.prototype.refreshTab = function(event) {
      event.stopPropagation();
      event.target.className += ' animate';
      atom.workspace.paneForItem(this.item).activateItem(this.item);
      return setTimeout(((function(_this) {
        return function() {
          return _this.populateTabBody();
        };
      })(this)), 1000);
    };

    ExposeView.prototype.activateTab = function() {
      var pane;
      pane = atom.workspace.paneForItem(this.item);
      pane.activate();
      return pane.activateItem(this.item);
    };

    ExposeView.prototype.toggleActive = function(item) {
      return this.toggleClass('active', item === this.item);
    };

    ExposeView.prototype.isActiveTab = function() {
      return atom.workspace.getActivePaneItem() === this.item;
    };

    ExposeView.prototype.closeTab = function(event) {
      if (event != null) {
        event.stopPropagation();
      }
      atom.workspace.paneForItem(this.item).destroyItem(this.item);
      return this.destroy();
    };

    ExposeView.prototype.getItemTitle = function() {
      var base, i, len, paneItem, ref1, title;
      if (!(title = typeof (base = this.item).getTitle === "function" ? base.getTitle() : void 0)) {
        return 'untitled';
      }
      ref1 = atom.workspace.getPaneItems();
      for (i = 0, len = ref1.length; i < len; i++) {
        paneItem = ref1[i];
        if (paneItem !== this.item) {
          if (paneItem.getTitle() === title && (this.item.getLongTitle != null)) {
            title = this.item.getLongTitle();
          }
        }
      }
      return title;
    };

    ExposeView.prototype.isItemPending = function() {
      var pane;
      if (!(pane = atom.workspace.paneForItem(this.item))) {
        return false;
      }
      if (pane.getPendingItem != null) {
        return pane.getPendingItem() === this.item;
      } else if (this.item.isPending != null) {
        return this.item.isPending();
      }
    };

    return ExposeView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xyYW1pcmV6Ly5hdG9tL3BhY2thZ2VzL2V4cG9zZS9saWIvZXhwb3NlLXRhYi12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTs7OztFQUFBLE1BQWEsT0FBQSxDQUFRLHNCQUFSLENBQWIsRUFBQyxlQUFELEVBQU87O0VBQ04sc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7SUFDSixVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsS0FBRCxFQUFRLEtBQVIsRUFBZSxPQUFmO0FBQ1IsVUFBQTtNQUFBLFVBQUEsR0FBYTtNQUNiLElBQTRCLE9BQTVCO1FBQUEsVUFBQSxJQUFjLFdBQWQ7O2FBRUEsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLEtBQUEsRUFBTyxhQUFQO1FBQXNCLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBN0I7T0FBTCxFQUFnRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7VUFDOUMsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sWUFBUDtXQUFMLEVBQTBCLFNBQUE7WUFDeEIsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sVUFBUDtjQUFtQixXQUFBLEVBQWEsS0FBaEM7YUFBTCxFQUE0QyxLQUE1QzttQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsS0FBQSxFQUFPLFVBQVA7Y0FBbUIsQ0FBQSxLQUFBLENBQUEsRUFBTyxtQkFBMUI7YUFBTDtVQUZ3QixDQUExQjtpQkFHQSxLQUFDLENBQUEsR0FBRCxDQUFLO1lBQUEsTUFBQSxFQUFRLFNBQVI7WUFBbUIsQ0FBQSxLQUFBLENBQUEsRUFBTyxVQUExQjtZQUFzQyxLQUFBLEVBQU8sZ0JBQUEsR0FBaUIsS0FBOUQ7V0FBTDtRQUo4QztNQUFBLENBQUEs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QTVCLENBQVAsQ0FBcEI7QUFBQSxlQUFPLE1BQVA7O01BQ0EsSUFBRywyQkFBSDtlQUNFLElBQUksQ0FBQyxjQUFMLENBQUEsQ0FBQSxLQUF5QixJQUFDLENBQUEsS0FENUI7T0FBQSxNQUVLLElBQUcsMkJBQUg7ZUFDSCxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBQSxFQURHOztJQUpROzs7O0tBNUdRO0FBSnpCIiwic291cmNlc0NvbnRlbnQiOlsie1ZpZXcsICQkfSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgRXhwb3NlVmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6ICh0aXRsZSwgY29sb3IsIHBlbmRpbmcpIC0+XG4gICAgdGl0bGVDbGFzcyA9ICd0aXRsZSBpY29uLWZpbGUtdGV4dCdcbiAgICB0aXRsZUNsYXNzICs9ICcgcGVuZGluZycgaWYgcGVuZGluZ1xuXG4gICAgQGRpdiBjbGljazogJ2FjdGl2YXRlVGFiJywgY2xhc3M6ICdleHBvc2UtdGFiJywgPT5cbiAgICAgIEBkaXYgY2xhc3M6ICd0YWItaGVhZGVyJywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogdGl0bGVDbGFzcywgJ2RhdGEtbmFtZSc6IHRpdGxlLCB0aXRsZVxuICAgICAgICBAZGl2IGNsaWNrOiAnY2xvc2VUYWInLCBjbGFzczogJ2Nsb3NlLWljb24gaWNvbi14J1xuICAgICAgQGRpdiBvdXRsZXQ6ICd0YWJCb2R5JywgY2xhc3M6ICd0YWItYm9keScsIHN0eWxlOiBcImJvcmRlci1jb2xvcjogI3tjb2xvcn1cIlxuXG4gIGNvbnN0cnVjdG9yOiAoQGl0ZW0gPSB7fSwgQGNvbG9yID0gJyMwMDAnKSAtPlxuICAgIEB0aXRsZSA9IEBnZXRJdGVtVGl0bGUoKVxuICAgIEBwZW5kaW5nID0gQGlzSXRlbVBlbmRpbmcoKVxuICAgIHN1cGVyKEB0aXRsZSwgQGNvbG9yLCBAcGVuZGluZylcblxuICBpbml0aWFsaXplOiAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGhhbmRsZUV2ZW50cygpXG4gICAgQHBvcHVsYXRlVGFiQm9keSgpXG5cbiAgaGFuZGxlRXZlbnRzOiAtPlxuICAgIEBvbiAnY2xpY2snLCAnLmljb24tc3luYycsIEByZWZyZXNoVGFiXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkIEBlbGVtZW50LFxuICAgICAgJ2V4cG9zZTpjbG9zZS10YWInOiAoZSkgPT4gQGNsb3NlVGFiKGUpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20ud29ya3NwYWNlLm9ic2VydmVBY3RpdmVQYW5lSXRlbSBAdG9nZ2xlQWN0aXZlXG5cbiAgZGVzdHJveTogLT5cbiAgICBAcmVtb3ZlKClcbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuXG4gIHBvcHVsYXRlVGFiQm9keTogLT5cbiAgICByZXR1cm4gaWYgQGRyYXdJbWFnZSgpXG4gICAgcmV0dXJuIGlmIEBkcmF3TWluaW1hcCgpXG4gICAgQGRyYXdGYWxsYmFjaygpXG5cbiAgZHJhd0ZhbGxiYWNrOiAtPlxuICAgIG9iamVjdENsYXNzID0gQGl0ZW0uY29uc3RydWN0b3IubmFtZVxuICAgIGljb25DbGFzcyA9ICdpY29uLScgKyBAaXRlbS5nZXRJY29uTmFtZSgpIGlmIEBpdGVtLmdldEljb25OYW1lXG4gICAgQHRhYkJvZHkuaHRtbCAkJCAtPlxuICAgICAgQGEgY2xhc3M6IGljb25DbGFzcyBvciBzd2l0Y2ggb2JqZWN0Q2xhc3NcbiAgICAgICAgd2hlbiAnVGV4dEVkaXRvcicgdGhlbiAnaWNvbi1maWxlLWNvZGUnXG4gICAgICAgIHdoZW4gJ0FyY2hpdmVFZGl0b3InIHRoZW4gJ2ljb24tZmlsZS16aXAnXG4gICAgICAgIGVsc2UgJ2ljb24tZmlsZS10ZXh0J1xuXG4gIGRyYXdJbWFnZTogLT5cbiAgICByZXR1cm4gdW5sZXNzIEBpdGVtLmNvbnN0cnVjdG9yLm5hbWUgaXMgJ0ltYWdlRWRpdG9yJ1xuICAgIGZpbGVQYXRoID0gQGl0ZW0uZmlsZS5wYXRoXG4gICAgQHRhYkJvZHkuaHRtbCAkJCAtPlxuICAgICAgQGltZyBzcmM6IGZpbGVQYXRoXG5cbiAgZHJhd01pbmltYXA6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAaXRlbS5jb25zdHJ1Y3Rvci5uYW1lIGlzICdUZXh0RWRpdG9yJ1xuICAgIHJldHVybiB1bmxlc3MgYXRvbS5wYWNrYWdlcy5sb2FkZWRQYWNrYWdlcy5taW5pbWFwXG5cbiAgICBhdG9tLnBhY2thZ2VzLnNlcnZpY2VIdWIuY29uc3VtZSAnbWluaW1hcCcsICcxLjAuMCcsIChtaW5pbWFwQVBJKSA9PlxuICAgICAgaWYgbWluaW1hcEFQSS5zdGFuZEFsb25lTWluaW1hcEZvckVkaXRvcj9cbiAgICAgICAgbWluaW1hcCA9IG1pbmltYXBBUEkuc3RhbmRBbG9uZU1pbmltYXBGb3JFZGl0b3IoQGl0ZW0pXG4gICAgICAgIG1pbmltYXBFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KG1pbmltYXApXG4gICAgICAgIG1pbmltYXBFbGVtZW50LnN0eWxlLmNzc1RleHQgPSAnJydcbiAgICAgICAgICB3aWR0aDogMTkwcHg7XG4gICAgICAgICAgaGVpZ2h0OiAxMzBweDtcbiAgICAgICAgICBsZWZ0OiAxMHB4O1xuICAgICAgICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgICAgJycnXG5cbiAgICAgICAgbWluaW1hcC5zZXRDaGFyV2lkdGg/KDIpXG4gICAgICAgIG1pbmltYXAuc2V0Q2hhckhlaWdodD8oNClcbiAgICAgICAgbWluaW1hcC5zZXRJbnRlcmxpbmU/KDIpXG5cbiAgICAgICAgQHRhYkJvZHkuaHRtbCBtaW5pbWFwRWxlbWVudFxuICAgICAgZWxzZVxuICAgICAgICBAdGFiQm9keS5odG1sICQkIC0+XG4gICAgICAgICAgQGEgY2xhc3M6ICdpY29uLXN5bmMnXG5cbiAgcmVmcmVzaFRhYjogKGV2ZW50KSA9PlxuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXG4gICAgZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSArPSAnIGFuaW1hdGUnXG4gICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQGl0ZW0pLmFjdGl2YXRlSXRlbShAaXRlbSlcbiAgICBzZXRUaW1lb3V0ICg9PiBAcG9wdWxhdGVUYWJCb2R5KCkpLCAxMDAwXG5cbiAgYWN0aXZhdGVUYWI6IC0+XG4gICAgcGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEBpdGVtKVxuICAgIHBhbmUuYWN0aXZhdGUoKVxuICAgIHBhbmUuYWN0aXZhdGVJdGVtKEBpdGVtKVxuXG4gIHRvZ2dsZUFjdGl2ZTogKGl0ZW0pID0+XG4gICAgQHRvZ2dsZUNsYXNzKCdhY3RpdmUnLCBpdGVtIGlzIEBpdGVtKVxuXG4gIGlzQWN0aXZlVGFiOiAtPlxuICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkgaXMgQGl0ZW1cblxuICBjbG9zZVRhYjogKGV2ZW50KSAtPlxuICAgIGV2ZW50Py5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKEBpdGVtKS5kZXN0cm95SXRlbShAaXRlbSlcbiAgICBAZGVzdHJveSgpXG5cbiAgZ2V0SXRlbVRpdGxlOiAtPlxuICAgIHJldHVybiAndW50aXRsZWQnIHVubGVzcyB0aXRsZSA9IEBpdGVtLmdldFRpdGxlPygpXG5cbiAgICBmb3IgcGFuZUl0ZW0gaW4gYXRvbS53b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKCkgd2hlbiBwYW5lSXRlbSBpc250IEBpdGVtXG4gICAgICBpZiBwYW5lSXRlbS5nZXRUaXRsZSgpIGlzIHRpdGxlIGFuZCBAaXRlbS5nZXRMb25nVGl0bGU/XG4gICAgICAgIHRpdGxlID0gQGl0ZW0uZ2V0TG9uZ1RpdGxlKClcbiAgICB0aXRsZVxuXG4gIGlzSXRlbVBlbmRpbmc6IC0+XG4gICAgcmV0dXJuIGZhbHNlIHVubGVzcyBwYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0oQGl0ZW0pXG4gICAgaWYgcGFuZS5nZXRQZW5kaW5nSXRlbT9cbiAgICAgIHBhbmUuZ2V0UGVuZGluZ0l0ZW0oKSBpcyBAaXRlbVxuICAgIGVsc2UgaWYgQGl0ZW0uaXNQZW5kaW5nP1xuICAgICAgQGl0ZW0uaXNQZW5kaW5nKClcbiJdfQ==
