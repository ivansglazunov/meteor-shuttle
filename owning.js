Shuttle.Owning = new Mongo.Collection('shuttle:owning');

Shuttle.Owning.attachRefs();
Shuttle.Owning.attachTree();
Shuttle.Owning.attachSchema(Shuttle.insertedSchema);

if (Meteor.isServer) Shuttle.Rights.inheritTree(Shuttle.Owning);
if (Meteor.isServer) Shuttle.Unused.inheritTree(Shuttle.Owning);

Shuttle.Owning.deny({
	insert: function(userId, _owning) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var owning = Shuttle.Owning._transform(_owning);

		if (Shuttle.can(Shuttle.Owning, owning.target(), user)) { // User can own target.
			return false; // The owner can do anything.
		}

		throw new Meteor.Error('You are not permitted to insert owning '+JSON.stringify(owning.Ref()));
	},
	remove: function(userId, _owning) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var owning = Shuttle.Owning._transform(_owning);

		if (Shuttle.can(Shuttle.Owning, owning.target(), user)) { // User can own target.
			if (Shuttle.Owning.find(owning.source().Ref('_source')).count() > 1) { // Not last owning link.
				return false; // a owner can do anything.
			} else {
				throw new Meteor.Error('You can not remove last for source owning link.');
			}
		}

		throw new Meteor.Error('You are not permitted to remove owning '+JSON.stringify(owning.Ref()));
	}
});

if (Meteor.isServer) {
	Meteor.users.after.insert(function(userId, _user) {
		var user = Meteor.users._transform(_user);
		Shuttle.Owning.insert({
			_source: user.Ref(),
			_target: user.Ref()
		});
	});
}