# React Native Locale Service
React Native Locale Service simplifies the usage of i18n for your react native application.

## Install package
``` npm install react-native-locale-service ```

### Props
| Name        | Type | Default |
| ------------- |-------------|-------------|
|urlString | String | N/A |
|defaultLocaleName | String | en |
| trailingPrefix | String | N/A |

### Methods
| Methods        | Args         
| ------------- |-------------|
|setSelectedLocaleWithLocaleName | None |
| setLocaleData | None |
| clearLocaleData     | None |
| clearSelectedLocaleName | None |
| getTranslationWithKey | None |


## Example of usage

#### index.*.js
``` javascript
var LocaleService = require('react-native-locale-service');
global_.localeService = new LocaleService(urlString="https://www.mysite.com/static/locale/locale-", defaultLocaleName="en", trailingPrefix=".json");

var MyChildComponent = require('./myChildComponent');

import React, {
  AppRegistry,
  Component,
  View,
} from 'react-native';

class myAwesomeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  async getLocale() {
    await TranslatorService.setLocaleData();
    this.setState({isLoading: false});
  }

  componentDidMount() {
    super.componentDidMount();
    this.getLocale();
  }

  render() {
      if (this.state.isLoading) return;
      return <MyChildComponent/>
  }
}

AppRegistry.registerComponent('myAwesomeApp', () => myAwesomeApp);
```

#### myChildComponent.js
``` javascript
import React, {
  Component,
  Text
} from 'react-native';

class MyChildComponent extends Component {
    render() {
        var label = localeService.getTranslationWithKey("this_is_my_awesome_locale_key");
        return (<Text>{label}</Text>);
    }
}

module.exports = MyChildComponent;

```
