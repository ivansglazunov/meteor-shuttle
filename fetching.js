Shuttle.Fetching = new Mongo.Collection('shuttle:fetching');

Shuttle.Fetching.attachRefs();
Shuttle.Fetching.attachTree();
Shuttle.Fetching.attachSchema(Shuttle.insertedSchema);

if (Meteor.isServer) Shuttle.Rights.inheritTree(Shuttle.Fetching);
if (Meteor.isServer) Shuttle.Unused.inheritTree(Shuttle.Fetching);

Shuttle.Fetching.deny({
	insert: function(userId, _fetching) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var fetching = Shuttle.Fetching._transform(_fetching);
		
		var fetchings = Shuttle.Fetching.find(lodash.merge(
			fetching.source().Ref('_source'),
			fetching.target().Ref('_target'),
			{
				_inherit: { $exists: false },
				'_inserted.user.id': userId
			}
		));
		
		if (fetchings.count()) {
			throw new Meteor.Error('Duplication of links of this type is prohibited.');
		}

		if (Shuttle.can(Shuttle.Owning, fetching.source(), user)) { // User can own source.
			return false; // The owner can do anything.
		}

		throw new Meteor.Error('You are not permitted to insert fetching to '+JSON.stringify(fetching._target));
	},
	remove: function(userId, _fetching) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var fetching = Shuttle.Fetching._transform(_fetching);

		if (Shuttle.can(Shuttle.Owning, fetching.source(), user)) { // User can own source.
			return false; // a owner can do anything.
		}

		throw new Meteor.Error('You are not permitted to remove fetching '+JSON.stringify(fetching.Ref()));
	}
});

if (Meteor.isServer) {
	Meteor.users.after.insert(function(userId, _user) {
		var user = Meteor.users._transform(_user);
		Shuttle.Fetching.insert({
			_source: user.Ref(),
			_target: user.Ref()
		});
	});
}