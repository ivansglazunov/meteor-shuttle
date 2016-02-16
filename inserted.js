Shuttle.insertedSchema = new SimpleSchema({
	_inserted: {
		type: new SimpleSchema({
			user: {
				type: Refs.Schema,
				optional: true,
				autoValue: function() {
					if (this.isInsert && this.userId) {
						return Meteor.users.findOne(this.userId).Ref();
					}
				}
			},
			date: {
				type: Date,
				autoValue: function() {
					if (this.isInsert) return new Date();
				}
			}
		})
	}
});