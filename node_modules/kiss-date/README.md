# kiss-date

[![GitHub stars](https://img.shields.io/github/stars/clayrisser/kiss-date.svg?style=social&label=Stars)](https://github.com/clayrisser/kiss-date)

> keep it simple stupid date library

Please ★ this repo if you found it useful ★ ★ ★

I created kiss-date to provide a simple way to manipulate dates and timezones using simple math. The date is
stored as a tuple (array) containing a unix timestamp and timezone offset in seconds. Adjusting the timezone is as
simple as adding the unix timezone with the timezone offset `dateArray[0] + dateArray[1]`.

## Features

- supports timezone manipulation

## Installation

```sh
npm install --save kiss-date
```

## Dependencies

- [NodeJS](https://nodejs.org)

## Usage

```ts
import KissDate from 'kiss-date';
const date = new KissDate(new Date(), '-06:00');
console.log(date.dateArray); // [1610926376, -21600]
date.changeTimezone('+00:00');
console.log(date.dateArray); // [1610926376, 0]
```

## Support

Submit an [issue](https://github.com/clayrisser/kiss-date/issues/new)

## Screenshots

[Contribute](https://github.com/clayrisser/kiss-date/blob/master/CONTRIBUTING.md) a screenshot

## Contributing

Review the [guidelines for contributing](https://github.com/clayrisser/kiss-date/blob/master/CONTRIBUTING.md)

## License

[MIT License](https://github.com/clayrisser/kiss-date/blob/master/LICENSE)

[Clay Risser](https://clayrisser.com) © 2021

## Changelog

Review the [changelog](https://github.com/clayrisser/kiss-date/blob/master/CHANGELOG.md)

## Credits

- [Clay Risser](https://clayrisser.com) - Author

## Support on Liberapay

A ridiculous amount of coffee ☕ ☕ ☕ was consumed in the process of building this project.

[Add some fuel](https://liberapay.com/clayrisser/donate) if you'd like to keep me going!

[![Liberapay receiving](https://img.shields.io/liberapay/receives/clayrisser.svg?style=flat-square)](https://liberapay.com/clayrisser/donate)
[![Liberapay patrons](https://img.shields.io/liberapay/patrons/clayrisser.svg?style=flat-square)](https://liberapay.com/clayrisser/donate)
