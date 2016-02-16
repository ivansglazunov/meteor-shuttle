# Shuttle

```js
meteor add ivansglazunov:shuttle
```

Theory trees in the atmosphere.

## Documentation

Full documentation will be soon...

* Basic tree of user groups - `Shuttle.Subjects`.
* Carrying tree of rights without reference to specific rights - `Shuttle.Rights`.
* Tree full ownership of the inherited in `Shuttle.Rights` - `Shuttle.Owning`.
* Tree gives the right to view documents `Shuttle.Fetching`.Tree
* Tree gives the right to become part of the subject `Shuttle.Joining`.
* `Shuttle.Unused` is the tree in which to add any document automatically is not linked `Shuttle.Rights` tree.
* `Shuttle.insertedSchema` The scheme which can be added to any collection for automatic login time and user when creating.