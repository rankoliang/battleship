# Battleship

This is a recreation of the classic Battleship board game. You can play a live version at https://rankoliang.github.io/battleship/

The major libraries and frameworks used in this app are:

- React
- Redux
- Jest

## Getting Started

Run `yarn install` to install all of the dependencies.

To start developing locally,

```
yarn start
```

to run the development server.

Run `yarn build` to create a production ready build.

## Rules

Users will place 5 different ships when the game starts. These include:

- Carrier: length 5
- Battleship: length 4
- Cruiser: length 3
- Submarine: length 3
- Destroyer: length 2

Afterwards, the player and the ai will take turns attacking each other's boards.
Players will be informed that a ship is hit or sunken. The first player to sink all ships wins.

There are 6 different variations of difficulties of ai in this game.

## Future Improvements

- The slices can be improved by further normalizing the data in the store, especially the board slice
  - This can be done potentially using the Redux-ORM or the Normalizr library
- A better ai using a probability density function can be implemented
- Add the ability to play against another player locally or on the web
