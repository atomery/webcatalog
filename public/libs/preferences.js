const path = require('path');
const semver = require('semver');
const settings = require('electron-settings');
const { app, nativeTheme, ipcMain } = require('electron');

const sendToAllWindows = require('./send-to-all-windows');

// scope
const v = '2018';

const getDefaultInstallationPath = () => {
  if (process.platform === 'darwin') {
    return path.join('~', 'Applications', 'WebCatalog Apps');
  }
  if (process.platform === 'linux') {
    return '~/.webcatalog';
  }
  if (process.platform === 'win32') {
    return path.join(app.getPath('home'), 'WebCatalog Apps');
  }
  throw Error('Unsupported platform');
};

const defaultPreferences = {
  allowPrerelease: Boolean(semver.prerelease(app.getVersion())),
  attachToMenubar: false,
  createDesktopShortcut: true,
  createStartMenuShortcut: true,
  defaultHome: 'home',
  hideEnginePrompt: true,
  hideMenuBar: false,
  installationPath: getDefaultInstallationPath(),
  preferredEngine: 'electron',
  proxyBypassRules: '',
  proxyPacScript: '',
  proxyRules: '',
  proxyType: 'none',
  registered: false,
  requireAdmin: false,
  sortInstalledAppBy: 'last-updated',
  themeSource: 'system',
  useHardwareAcceleration: true,
};

let cachedPreferences = null;

const initCachedPreferences = () => {
  cachedPreferences = { ...defaultPreferences, ...settings.get(`preferences.${v}`) };
};

const getPreferences = () => {
  // store in memory to boost performance
  if (cachedPreferences == null) {
    initCachedPreferences();
  }
  return cachedPreferences;
};

const setPreference = (name, value) => {
  sendToAllWindows('set-preference', name, value);
  cachedPreferences[name] = value;
  Promise.resolve().then(() => settings.set(`preferences.${v}.${name}`, value));

  if (name === 'registered' && value === true) {
    ipcMain.emit('request-get-installed-apps');
  }

  if (name === 'themeSource') {
    nativeTheme.themeSource = value;
  }
};

const getPreference = (name) => {
  // ensure compatiblity with old version
  if (process.platform === 'darwin' && (name === 'installationPath' || name === 'requireAdmin')) {
    // old pref, home or root
    if (settings.get('preferences.2018.installLocation') === 'root') {
      settings.delete('preferences.2018.installLocation');

      setPreference('installationPath', '/Applications/WebCatalog Apps');
      setPreference('requireAdmin', true);

      if (name === 'installationPath') {
        return '/Applications/WebCatalog Apps';
      }
      return true;
    }
  }

  // store in memory to boost performance
  if (cachedPreferences == null) {
    initCachedPreferences();
  }
  return cachedPreferences[name];
};

const resetPreferences = () => {
  cachedPreferences = null;
  settings.deleteAll();

  const preferences = getPreferences();
  Object.keys(preferences).forEach((name) => {
    sendToAllWindows('set-preference', name, preferences[name]);
  });
};

module.exports = {
  getPreference,
  getPreferences,
  resetPreferences,
  setPreference,
};
