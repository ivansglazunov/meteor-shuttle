Shuttle.Subjects = new Mongo.Collection('shuttle:subjects');

Shuttle.Subjects.attachRefs();
Shuttle.Subjects.attachTree();

if (Meteor.isServer) Shuttle.Subjects.inheritTree(Shuttle.Subjects);

Shuttle.Subjects.deny({
	insert: function(userId, _subject) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var subject = Shuttle.Subjects._transform(_subject);

		if (Shuttle.can(Shuttle.Owning, subject.source(), user)) { // User can own source.
			if (Shuttle.can(Shuttle.Owning, subject.target(), user)) { // User can own target.
				return false; // The owner can do anything.
			} else if (Shuttle.can(Shuttle.Joining, subject.target(), user)) { // User can joining to target.
				return false;
			}
		} else if (Shuttle.can(Shuttle.Owning, subject.target(), user)) { // User can own target.
			return false; // The owner can do anything.
		}

		throw new Meteor.Error('You are not permitted to join '+JSON.stringify(subject._target));
	},
	remove: function(userId, _subject) {
		if (!userId) throw new Meteor.Error('Shuttle only for subjects');
		var user = Meteor.users.findOne(userId);
		var subject = Shuttle.Subjects._transform(_subject);

		if (Shuttle.can(Shuttle.Owning, subject.source(), user)) { // User can own source.
			if (Shuttle.can(Shuttle.Owning, subject.target(), user)) { // User can own target.
				return false; // The owner can do anything.
			} else if (Shuttle.can(Shuttle.Joining, subject.target(), user)) { // User can joining to target.
				return false;
			}
		} else if (Shuttle.can(Shuttle.Owning, subject.target(), user)) { // User can own target.
			return false; // The owner can do anything.
		}

		throw new Meteor.Error('You are not permitted to remove '+JSON.stringify(subject.Ref()));
	}
});