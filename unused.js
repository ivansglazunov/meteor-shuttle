Shuttle.Unused = new Mongo.Collection('shuttle:unused');

Shuttle.Unused.attachRefs();
Shuttle.Unused.attachTree();

Shuttle.Unused.deny({
	insert: function(userId, _unused) {
		var unused = Shuttle.Unused._transform(_unused);
		if (
			Shuttle.Own.find(unused.source().Ref('_source')).count()
			||
			Shuttle.Unused.find(unused.source().Ref('_source')).count()
		) {
			return true;
		}
	},
	remove: function(userId, _unused) {
		var unused = Shuttle.Unused._transform(_unused);
		if (!Shuttle.Own.find(unused.source().Ref('_source')).count()) {
			return true;
		}
	}
});

if (Meteor.isServer) {
	// If own inserted then remove unused.
	Shuttle.Own.after.insert(function(userId, _own) {
		var own = Shuttle.Own._transform(_own);
		var unuseds = Shuttle.Unused.find(own.source().Ref('_source'));
		if (unuseds.count()) { // If unused exists
			unuseds.forEach(function(unused) {
				Shuttle.Unused.remove(unused._id);
			});
		}
	});
	// If own removed
	Shuttle.Own.after.remove(function(userId, _own) {
		var own = Shuttle.Own._transform(_own);
		var owns = Shuttle.Own.find(own.source().Ref('_source'));
		if (!owns.count()) { // If owns no exists
			Shuttle.Unused.insert({
				_source: own.source().Ref(),
				_target: userId ? Meteor.users.findOne(userId).Ref() : own.source().Ref()
			});
		}
	});
}

if (Meteor.isServer) {
	// Create unused after insertion of the documents in collection.
	Mongo.Collection.prototype.attachUnused = function () {
		var collection = this;
		collection.after.insert(function(userId, _document) {
			var document = collection._transform(_document);
			Shuttle.Unused.insert({
				_source: document.Ref(),
				_target: userId ? Meteor.users.findOne(userId).Ref() : document.Ref()
			});
		});
	};
}