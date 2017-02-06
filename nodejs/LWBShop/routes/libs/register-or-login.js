var mongoose = require('mongoose');

module.exports = function() {
    var ClientSchema = new mongoose.Schema({
        accountName: String,
        phoneNumber: String,
        email: String,
        password: String
    });

    ClientSchema.statics.findAccountName = function(accountName, callback) {
        return this.findOne({ "accountName": accountName }, callback);
    };

    ClientSchema.statics.findPhoneNumber = function(phoneNumber, callback) {
        return this.findOne({ "phoneNumber": phoneNumber }, callback);
    };

    ClientSchema.statics.findEmail = function(email, callback) {
        return this.findOne({ "email": email }, callback);
    };

    ClientSchema.statics.updatePassword = function(phoneNumber, password, callback) {
        return this.update({ "phoneNumber": phoneNumber }, { $set: { "password": password } }, callback);
    };

    ClientSchema.statics.userIsExist = function(accountName, phoneNumber, email, callback) {
        var self = this;
        self.findOne({ "accountName": accountName }, function(err, result) {
            if (err) {
                callback(err, false);
            } else if (result) {
                callback(null, true, result);
            } else {
                self.findOne({ "phoneNumber": phoneNumber }, function(err, result) {
                    if (err) {
                        callback(err, false);
                    } else if (result) {
                        callback(null, true, result);
                    } else {
                        self.findOne({ "email": email }, function(err, result) {
                            if (err) {
                                callback(err, false);
                            } else if (result) {
                                callback(null, true, result);
                            } else {
                                callback(null, false);
                            }
                        });
                    }
                });
            }
        });
    }

    return mongoose.model('users', ClientSchema, 'users');
};