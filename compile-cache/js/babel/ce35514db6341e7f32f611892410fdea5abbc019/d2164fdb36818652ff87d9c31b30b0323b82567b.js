Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _atom = require('atom');

var _csscomb = require('csscomb');

var _csscomb2 = _interopRequireDefault(_csscomb);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

exports['default'] = {
    config: {
        projectConfigs: {
            title: 'Use project config',
            description: 'Relative to the project directory. Example: `.csscomb.json` or `configs/.csscomb.json`. Leave blank if you want to use the following setting',
            'default': '',
            type: 'string'
        },
        commonConfigs: {
            title: 'Use common config',
            description: 'Put here a full path to your config. Example: `/Users/jchouse/propjects/.csscomb.json`. Leave blank if you want to use the following setting',
            'default': '',
            type: 'string'
        },
        readyMadeConfigs: {
            title: 'Ready made configs',
            description: 'Used when you do not specify a project or common file. The details below.',
            type: 'string',
            'default': 'yandex',
            'enum': ['yandex', 'csscomb', 'zen']
        }
    },

    getSettingsConfig: function getSettingsConfig() {
        var cssCombPackage = atom.packages.getLoadedPackage('atom-css-comb'),
            error,
            optionsFilePath,
            projectConfigs = atom.config.get('atom-css-comb.projectConfigs'),
            projectPath = atom.project.getPaths()[0],
            commonConfigs = atom.config.get('atom-css-comb.commonConfigs'),
            readyMadeConfigs = atom.config.get('atom-css-comb.readyMadeConfigs');

        if (projectConfigs) {
            optionsFilePath = _path2['default'].join(projectPath, projectConfigs);
            try {
                return require(optionsFilePath);
            } catch (error) {
                return error;
            }
        } else if (commonConfigs) {
            try {
                return require(commonConfigs);
            } catch (error) {
                return error;
            }
        } else {
            return readyMadeConfigs || 'yandex';
        }
    },

    activate: function activate(state) {
        var _this = this;

        this.subscriptions = new _atom.CompositeDisposable();

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'css-comb:comb': function cssCombComb() {
                return _this.comb();
            }
        }));
    },

    combFile: function combFile(comb, syntax) {
        try {
            var text = this._getText(),
                combed = comb.processString(text, { syntax: syntax });

            atom.workspace.getActivePaneItem().setText(combed);
        } catch (error) {
            atom.notifications.addError(error.message);
        }
    },

    combText: function combText(comb, text) {
        var combed,
            syntax = this._getSytax(),
            activePane = atom.workspace.getActivePaneItem();

        try {
            combed = comb.processString(text, { syntax: syntax });

            activePane.setTextInBufferRange(activePane.getSelectedBufferRange(), combed);
        } catch (error) {
            atom.notifications.addError(error.message);
        }
    },

    _getSytax: function _getSytax() {
        var syntax = atom.workspace.getActiveTextEditor().getGrammar().name.toLowerCase();

        if (['css', 'less', 'sass', 'scss'].indexOf(syntax) !== -1) {
            return syntax;
        } else if (syntax === 'html') {
            return 'css';
        } else {
            return new Error();
        }
    },

    _getSelectedText: function _getSelectedText() {
        return atom.workspace.getActiveTextEditor().getSelectedText();
    },

    _getText: function _getText() {
        return atom.workspace.getActiveTextEditor().getText();
    },

    comb: function comb() {
        var comb,
            config = this.getSettingsConfig(),
            selectedText = this._getSelectedText(),
            syntax = this._getSytax();

        if (config instanceof Error) {
            return atom.notifications.addError(config.message);
        } else if (syntax instanceof Error) {
            return atom.notifications.addError('Not supported syntax');
        } else {
            comb = new _csscomb2['default'](config);

            if (selectedText !== '') {
                this.combText(comb, selectedText, syntax);
            } else {
                var _name = atom.workspace.getActiveTextEditor().getGrammar().name;
                if (syntax === 'css' && _name === 'HTML') {
                    atom.notifications.addError('Please select the text for combing.');
                    return;
                }
                this.combFile(comb, syntax);
            }
        }
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9scmFtaXJlei8uYXRvbS9wYWNrYWdlcy9hdG9tLWNzcy1jb21iL2xpYi9jc3MtY29tYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7b0JBRWtDLE1BQU07O3VCQUN2QixTQUFTOzs7O29CQUNULE1BQU07Ozs7QUFKdkIsV0FBVyxDQUFDOztxQkFNRztBQUNYLFVBQU0sRUFBRTtBQUNKLHNCQUFjLEVBQUU7QUFDWixpQkFBSyxFQUFFLG9CQUFvQjtBQUMzQix1QkFBVyxFQUFFLDhJQUE4STtBQUMzSix1QkFBUyxFQUFFO0FBQ1gsZ0JBQUksRUFBRSxRQUFRO1NBQ2pCO0FBQ0QscUJBQWEsRUFBRTtBQUNYLGlCQUFLLEVBQUUsbUJBQW1CO0FBQzFCLHVCQUFXLEVBQUUsOElBQThJO0FBQzNKLHVCQUFTLEVBQUU7QUFDWCxnQkFBSSxFQUFFLFFBQVE7U0FDakI7QUFDRCx3QkFBZ0IsRUFBRTtBQUNkLGlCQUFLLEVBQUUsb0JBQW9CO0FBQzNCLHVCQUFXLEVBQUUsMkVBQTJFO0FBQ3hGLGdCQUFJLEVBQUUsUUFBUTtBQUNkLHVCQUFTLFFBQVE7QUFDakIsb0JBQU0sQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQztTQUNyQztLQUNKOztBQUVELHFCQUFpQixFQUFDLDZCQUFHO0FBQ2pCLFlBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsZUFBZSxDQUFDO1lBQ2hFLEtBQUs7WUFDTCxlQUFlO1lBQ2YsY0FBYyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDO1lBQ2hFLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4QyxhQUFhLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUM7WUFDOUQsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENB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L3BhY2thZ2VzL2F0b20tY3NzLWNvbWIvbGliL2Nzcy1jb21iLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgQ29tYiBmcm9tICdjc3Njb21iJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgY29uZmlnOiB7XG4gICAgICAgIHByb2plY3RDb25maWdzOiB7XG4gICAgICAgICAgICB0aXRsZTogJ1VzZSBwcm9qZWN0IGNvbmZpZycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1JlbGF0aXZlIHRvIHRoZSBwcm9qZWN0IGRpcmVjdG9yeS4gRXhhbXBsZTogYC5jc3Njb21iLmpzb25gIG9yIGBjb25maWdzLy5jc3Njb21iLmpzb25gLiBMZWF2ZSBibGFuayBpZiB5b3Ugd2FudCB0byB1c2UgdGhlIGZvbGxvd2luZyBzZXR0aW5nJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgY29tbW9uQ29uZmlnczoge1xuICAgICAgICAgICAgdGl0bGU6ICdVc2UgY29tbW9uIGNvbmZpZycsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJ1B1dCBoZXJlIGEgZnVsbCBwYXRoIHRvIHlvdXIgY29uZmlnLiBFeGFtcGxlOiBgL1VzZXJzL2pjaG91c2UvcHJvcGplY3RzLy5jc3Njb21iLmpzb25gLiBMZWF2ZSBibGFuayBpZiB5b3Ugd2FudCB0byB1c2UgdGhlIGZvbGxvd2luZyBzZXR0aW5nJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgICAgfSxcbiAgICAgICAgcmVhZHlNYWRlQ29uZmlnczoge1xuICAgICAgICAgICAgdGl0bGU6ICdSZWFkeSBtYWRlIGNvbmZpZ3MnLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdVc2VkIHdoZW4geW91IGRvIG5vdCBzcGVjaWZ5IGEgcHJvamVjdCBvciBjb21tb24gZmlsZS4gVGhlIGRldGFpbHMgYmVsb3cuJyxcbiAgICAgICAgICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgICAgICAgICAgZGVmYXVsdDogJ3lhbmRleCcsXG4gICAgICAgICAgICBlbnVtOiBbJ3lhbmRleCcsICdjc3Njb21iJywgJ3plbiddXG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgZ2V0U2V0dGluZ3NDb25maWcgKCkge1xuICAgICAgICB2YXIgY3NzQ29tYlBhY2thZ2UgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ2F0b20tY3NzLWNvbWInKSxcbiAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgb3B0aW9uc0ZpbGVQYXRoLFxuICAgICAgICAgICAgcHJvamVjdENvbmZpZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY3NzLWNvbWIucHJvamVjdENvbmZpZ3MnKSxcbiAgICAgICAgICAgIHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sXG4gICAgICAgICAgICBjb21tb25Db25maWdzID0gYXRvbS5jb25maWcuZ2V0KCdhdG9tLWNzcy1jb21iLmNvbW1vbkNvbmZpZ3MnKSxcbiAgICAgICAgICAgIHJlYWR5TWFkZUNvbmZpZ3MgPSBhdG9tLmNvbmZpZy5nZXQoJ2F0b20tY3NzLWNvbWIucmVhZHlNYWRlQ29uZmlncycpO1xuXG4gICAgICAgIGlmIChwcm9qZWN0Q29uZmlncykge1xuICAgICAgICAgICAgb3B0aW9uc0ZpbGVQYXRoID0gcGF0aC5qb2luKHByb2plY3RQYXRoLCBwcm9qZWN0Q29uZmlncyk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1aXJlKG9wdGlvbnNGaWxlUGF0aCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBlcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChjb21tb25Db25maWdzKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZXF1aXJlKGNvbW1vbkNvbmZpZ3MpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gcmVhZHlNYWRlQ29uZmlncyB8fCAneWFuZGV4JztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBhY3RpdmF0ZSAoc3RhdGUpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICAgICAnY3NzLWNvbWI6Y29tYic6ICgpID0+IHRoaXMuY29tYigpXG4gICAgICAgIH0pKTtcbiAgICB9LFxuXG4gICAgY29tYkZpbGUgKGNvbWIsIHN5bnRheCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHRleHQgPSB0aGlzLl9nZXRUZXh0KCksXG4gICAgICAgICAgICAgICAgY29tYmVkID0gY29tYi5wcm9jZXNzU3RyaW5nKHRleHQsIHtzeW50YXg6IHN5bnRheH0pO1xuXG4gICAgICAgICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpLnNldFRleHQoY29tYmVkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBjb21iVGV4dCAoY29tYiwgdGV4dCkge1xuICAgICAgICB2YXIgY29tYmVkLFxuICAgICAgICAgICAgc3ludGF4ID0gdGhpcy5fZ2V0U3l0YXgoKSxcbiAgICAgICAgICAgIGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb21iZWQgPSBjb21iLnByb2Nlc3NTdHJpbmcodGV4dCwge3N5bnRheDogc3ludGF4fSk7XG5cbiAgICAgICAgICAgIGFjdGl2ZVBhbmUuc2V0VGV4dEluQnVmZmVyUmFuZ2UoYWN0aXZlUGFuZS5nZXRTZWxlY3RlZEJ1ZmZlclJhbmdlKCksIGNvbWJlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoZXJyb3IubWVzc2FnZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2dldFN5dGF4ICgpIHtcbiAgICAgICAgdmFyIHN5bnRheCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRHcmFtbWFyKCkubmFtZS50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgIGlmIChbJ2NzcycsICdsZXNzJywgJ3Nhc3MnLCAnc2NzcyddLmluZGV4T2Yoc3ludGF4KSAhPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiBzeW50YXg7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ludGF4ID09PSAnaHRtbCcpIHtcbiAgICAgICAgICAgIHJldHVybiAnY3NzJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZ2V0U2VsZWN0ZWRUZXh0ICgpIHtcbiAgICAgICAgcmV0dXJuIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKS5nZXRTZWxlY3RlZFRleHQoKTtcbiAgICB9LFxuXG4gICAgX2dldFRleHQgKCkge1xuICAgICAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldFRleHQoKTtcbiAgICB9LFxuXG4gICAgY29tYiAoKSB7XG4gICAgICAgIHZhciBjb21iLFxuICAgICAgICAgICAgY29uZmlnID0gdGhpcy5nZXRTZXR0aW5nc0NvbmZpZygpLFxuICAgICAgICAgICAgc2VsZWN0ZWRUZXh0ID0gdGhpcy5fZ2V0U2VsZWN0ZWRUZXh0KCksXG4gICAgICAgICAgICBzeW50YXggPSB0aGlzLl9nZXRTeXRheCgpO1xuXG4gICAgICAgIGlmIChjb25maWcgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgICAgcmV0dXJuIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihjb25maWcubWVzc2FnZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ludGF4IGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ05vdCBzdXBwb3J0ZWQgc3ludGF4Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb21iID0gbmV3IENvbWIoY29uZmlnKTtcblxuICAgICAgICAgICAgaWYgKHNlbGVjdGVkVGV4dCAhPT0gJycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbWJUZXh0KGNvbWIsIHNlbGVjdGVkVGV4dCwgc3ludGF4KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IF9uYW1lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpLmdldEdyYW1tYXIoKS5uYW1lO1xuICAgICAgICAgICAgICAgIGlmIChzeW50YXggPT09ICdjc3MnICYmIF9uYW1lID09PSAnSFRNTCcpIHtcbiAgICAgICAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdQbGVhc2Ugc2VsZWN0IHRoZSB0ZXh0IGZvciBjb21iaW5nLicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY29tYkZpbGUoY29tYiwgc3ludGF4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iXX0=