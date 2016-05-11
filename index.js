var _ = require('lodash');

import {
  HTTPService
} from 'react-native-http';

import {
  AsyncStorage
} from 'react-native';


class LocaleService {
  constructor(urlString, defaultLocaleName, trailingPrefix) {
    this.defaultLocaleName = defaultLocaleName ||  'en';
    this.urlString = urlString;
    this.trailingPrefix = trailingPrefix ||  '';

    this.localeData = undefined;
    this.httpService = new HTTPService();

    this.localeDataStoragePrefix = 'localeService-locale-';
    this.selectedLocaleStorageKey = 'localeService-selected-locale';
    this.clearLocaleDataWithLocaleName();
  }

  _getLocaleDataStorageKeyWithLocaleName(localeName) {
    return `${this.localeDataStoragePrefix}${localeName}`;
  }

  _getUrlStringWithLocaleName(localeName) {
    return `${this.urlString}${localeName}${this.trailingPrefix}`;
  }

  async _fetchAndSetLocaleFromRemoteWithLocaleName(localeName) {
    var urlString = this._getUrlStringWithLocaleName(localeName);
    var storageKey = this._getLocaleDataStorageKeyWithLocaleName(localeName);
    var localeData = await this.httpService.get(urlString, undefined, {
      skipAuthorization: true
    })
    await AsyncStorage.setItem(storageKey, JSON.stringify(localeData));
    return localeData;
  }

  async setSelectedLocaleWithLocaleName(localeName) {
    await AsyncStorage.setItem(this.selectedLocaleStorageKey, localeName);
  }

  async setLocaleData() {
    if (!this.localeData) {
      var selectedLocale = await AsyncStorage.getItem(this.selectedLocaleStorageKey);
      var localeName = selectedLocale ? selectedLocale : this.defaultLocaleName;

      var localeDataStorageKey = this._getLocaleDataStorageKeyWithLocaleName(localeName);
      var stringifiedLocaleData = await AsyncStorage.getItem(localeDataStorageKey, () => this._fetchAndSetLocaleFromRemoteWithLocaleName(localeName));
      this.localeData = stringifiedLocaleData ? JSON.parse(stringifiedLocaleData) : undefined;

      if (!this.localeData) {
        this.localeData = await this._fetchAndSetLocaleFromRemoteWithLocaleName(localeName);
      }
    }
  }

  async clearLocaleDataWithLocaleName(localeName) {
    var selectedLocale = await AsyncStorage.getItem(this.selectedLocaleStorageKey);
    var localeName = selectedLocale ? selectedLocale : this.defaultLocaleName;
    var storageKey = this._getLocaleDataStorageKeyWithLocaleName(localeName);
    AsyncStorage.removeItem(storageKey);
  }

  getTranslationWithKey(key) {
    return this.localeData && this.localeData[key] ? this.localeData[key] : key;
  }
}

module.exports = LocaleService;
