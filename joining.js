Shuttle.Joining = new Mongo.Collection('shuttle:joining');

Shuttle.Joining.attachRefs();
Shuttle.Joining.attachTree();

Shuttle.Joining.deny({
	insert: function(userId, _subject) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var subject = Shuttle.Joining._transform(_subject);

		if (Shuttle.can(Shuttle.Owning, subject.target(), user)) { // User can own target.
			return false; // The owner can do anything.
		}

		throw new Meteor.Error('You are not permitted to insert joining for '+JSON.stringify(subject._target));
	},
	remove: function(userId, _subject) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var subject = Shuttle.Joining._transform(_subject);

		if (Shuttle.can(Shuttle.Owning, subject.target(), user)) { // User can own target.
			return false; // The owner can do anything.
		}

		throw new Meteor.Error('You are not permitted to remove joining '+JSON.stringify(subject.Ref()));
	}
});