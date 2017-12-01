# kirbi-discord-antiraid module
A module for [Kirbi](https://github.com/richardson-media-house/kirbi) to monitor join rates to prevent attempts to raid the server.

## Requires

- [kirbi-discord](https://github.com/Richardson-Media-House/kirbi-discord).
- [kirbi-mongodb](https://github.com/Richardson-Media-House/kirbi-mongodb).


## Usage

- !antiraid <parameter> <new value> => ban user.

### Parameters

- channelId => Channel id for the notifications of antiraid.
- seconds => Time between joins to reset the count.
- limit => Amount of joins before reset to start retroactively preventing logins.
