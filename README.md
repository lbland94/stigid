# iweb-dev-server

A middleware function to make web development easier.

## Usage:

In your build tool of choice, get a reference to either a [connect](https://www.npmjs.com/package/connect) or [express](https://www.npmjs.com/package/express) instance (probably via a build hook). Then:

```
import { iwebDevServer } from 'iweb-dev-server';

...

iwebDevServer(<connect or express>);
```
