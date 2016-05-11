import {
  HTTPService
} from 'react-native-http';

import {
  AsyncStorage
} from 'react-native';


class LocaleService {
  /**
   * @param  {string} urlString         Url for where to find the locale data
   * @param  {string} defaultLocaleName Name of the default locale
   * @param  {string} trailingPrefix    Trailing prefix that gets added to the urlString
   */
  constructor(urlString, defaultLocaleName, trailingPrefix) {
    this.defaultLocaleName = defaultLocaleName ||  'en';
    this.urlString = urlString;
    this.trailingPrefix = trailingPrefix ||  '';

    this.localeData = undefined;
    this.httpService = new HTTPService();

    this.localeDataStoragePrefix = 'localeService-locale-';
    this.selectedLocaleNameStorageKey = 'localeService-selected-locale-name';
    this.clearLocaleData();
  }

  /**
   * Get the locale data storage key with locale name
   * @param  {string} localeName Name of the locale
   * @return {string}            Combined name from localeDataStoragePrefix and the given localeName
   */
  _getLocaleDataStorageKeyWithLocaleName(localeName) {
    return `${this.localeDataStoragePrefix}${localeName}`;
  }

  /**
   * Get the urlString with localeName and constructor parameters.
   * @param  {string} localeName Name of the locale
   * @return {string}            Remote url for the locale
   */
  _getUrlStringWithLocaleName(localeName) {
    return `${this.urlString}${localeName}${this.trailingPrefix}`;
  }

  /**
   * Fetch and set locale from remote
   * @param  {string} localeName Name of the locale
   * @return {object}            Object with key/values of locales.
   */
  async _fetchAndSetLocaleFromRemoteWithLocaleName(localeName) {
    var urlString = this._getUrlStringWithLocaleName(localeName);
    var storageKey = this._getLocaleDataStorageKeyWithLocaleName(localeName);
    var localeData = await this.httpService.get(urlString, undefined, {
      skipAuthorization: true
    })
    await AsyncStorage.setItem(storageKey, JSON.stringify(localeData));
    return localeData;
  }

  /**
   * Set selected localeName, eg: sv, en, dk
   * @param {string} localeName
   * @return {Promise} Returns AsyncStorage promise
   */
  async setSelectedLocaleWithLocaleName(localeName) {
    return AsyncStorage.setItem(this.selectedLocaleNameStorageKey, localeName);
  }

  /**
   * This is a combination of many Class functions.
   * setLocaleData processes the localeData.
   */
  async setLocaleData() {
    if (!this.localeData) {
      var selectedLocaleName = await AsyncStorage.getItem(this.selectedLocaleNameStorageKey);
      var localeName = selectedLocaleName ? selectedLocaleName : this.defaultLocaleName;

      this.currentLocaleName = localeName;

      var localeDataStorageKey = this._getLocaleDataStorageKeyWithLocaleName(localeName);
      var stringifiedLocaleData = await AsyncStorage.getItem(localeDataStorageKey, () => this._fetchAndSetLocaleFromRemoteWithLocaleName(localeName));
      this.localeData = stringifiedLocaleData ? JSON.parse(stringifiedLocaleData) : undefined;

      if (!this.localeData) {
        this.localeData = await this._fetchAndSetLocaleFromRemoteWithLocaleName(localeName);
      }
    }
  }

  /**
   * Clears locale data from AsyncStorage and Class this.localeData
   * @return {Promise} Returns AsyncStorage promise
   */
  async clearLocaleData() {
    var selectedLocaleName = await AsyncStorage.getItem(this.selectedLocaleNameStorageKey);
    var localeName = selectedLocaleName ? selectedLocaleName : this.defaultLocaleName;
    var storageKey = this._getLocaleDataStorageKeyWithLocaleName(localeName);
    this.localeData = undefined;
    return AsyncStorage.removeItem(storageKey);
  }

  /**
   * Clear the selected locale name from AsyncStorage
   * @return {Promise} Returns AsyncStorage promise
   */
  async clearSelectedLocaleName() {
    return AsyncStorage.removeItem(this.selectedLocaleNameStorageKey);
  }

  /**
   * Returns i18n for given key
   * @param  {string} key Locale key
   * @return {string}     i18n for given key
   */
  getTranslationWithKey(key) {
    return this.localeData && this.localeData[key] ? this.localeData[key] : key;
  }
}

module.exports = LocaleService;
