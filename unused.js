Shuttle.Unused = new Mongo.Collection('shuttle:unused');

Shuttle.Unused.attachRefs();
Shuttle.Unused.attachTree();
Shuttle.Unused.attachSchema(Shuttle.insertedSchema);

Shuttle.Unused.deny({
	insert: function(userId, _unused) {
		return true;
	},
	remove: function(userId, _unused) {
		return true;
	}
});

if (Meteor.isServer) {
	// If right inserted then remove unused.
	Shuttle.Rights.after.insert(function(userId, _right) {
		var right = Shuttle.Rights._transform(_right);
		var unuseds = Shuttle.Unused.find(right.source().Ref('_source'));
		if (unuseds.count()) { // If unused exists
			unuseds.forEach(function(unused) {
				Shuttle.Unused.remove(unused._id);
			});
		}
	});
	// If right removed
	Shuttle.Rights.after.remove(function(userId, _right) {
		var right = Shuttle.Rights._transform(_right);
		var rights = Shuttle.Rights.find(right.source().Ref('_source'));
		if (!rights.count()) { // If rights no exists
			Shuttle.Unused.insert({
				_source: right.source().Ref(),
				_target: userId ? Meteor.users.findOne(userId).Ref() : right.source().Ref()
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