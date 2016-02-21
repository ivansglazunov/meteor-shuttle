if (Meteor.isClient) {
	Template.registerHelper('Shuttle', function() { return Shuttle; });
	Template.registerHelper('Meteor', function() { return Meteor; });
}

Shuttle.History = History;

if (Meteor.isServer) {
	if (!Meteor.users.findOne('guest'))
		Meteor.users.insert({ _id: 'guest' });
		
	if (!Meteor.users.findOne('user'))
		Meteor.users.insert({ _id: 'user' });
		
	if (!Meteor.users.findOne('registred'))
		Meteor.users.insert({ _id: 'registred' });
		
	Meteor.users.after.insert(function(userId, _user) {
		var user = Meteor.users._transform(_user);
		Shuttle.Merged.addLink(user, Meteor.users.findOne('user'));
		Shuttle.Merged.addLink(user, Meteor.users.findOne('guest'));
	});
	Accounts.onLogin(function(login) {
		if (login.user && login.type == 'resume') {
			var user = Meteor.users._transform(login.user);
			var subject = Shuttle.Merged.findOne(lodash.merge(
				Meteor.users.findOne('guest').Ref('_target'), user.Ref('_source')
			));
			if (subject) Shuttle.Merged.remove(subject._id);
			var subject = Shuttle.Merged.findOne(lodash.merge(
				Meteor.users.findOne('registred').Ref('_target'), user.Ref('_source')
			));
			if (!subject) Shuttle.Merged.addLink(user, Meteor.users.findOne('registred'));
		}
	});
	Meteor.users.after.insert(function(userId, _user) {
		var user = Meteor.users._transform(_user);
		Shuttle.Fetching.addLink(user, user);
	});
}

Shuttle.groups = Meteor.users.find({ $or: [
    { _id: 'guest' },
    { _id: 'registred' },
    { _id: 'user' }
] });