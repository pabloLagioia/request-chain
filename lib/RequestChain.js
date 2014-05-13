var request = require("request");

function RequestChain() {
    this.calls = [];
}
RequestChain.prototype._delete = function(url, expectedStatusCode, goOn) {
    var self = this;
    expectedStatusCode = expectedStatusCode || 200;
    request.del(url, function(err, res, body) {
        console.log("run delete");
        if (!goOn) {
            if (err)
            {
                throw err;
            }
            if (res.statusCode != expectedStatusCode)
            {
                throw new Error("Expecting " + expectedStatusCode + " but got " + res.statusCode);
            }
        }
        self.go();
    });
};
RequestChain.prototype._post = function(url, object, expectedStatusCode, goOn) {
    var self = this;
    expectedStatusCode = expectedStatusCode || 201;
    request.post(url, {form: object}, function(err, res, body) {
        console.log("run post");
        if (!goOn) {
            if (err)
            {
                throw err;
            }
            if (res.statusCode != expectedStatusCode)
            {
                throw new Error("Expecting " + expectedStatusCode + " but got " + res.statusCode);
            }
        }
        self.go();
    });
};
RequestChain.prototype._put = function(url, object, expectedStatusCode, goOn) {
    var self = this;
    expectedStatusCode = expectedStatusCode || 201;
    request.put(url, {form: object}, function(err, res, body) {
        if (!goOn) {
            if (err)
            {
                throw err;
            }
            if (res.statusCode != expectedStatusCode)
            {
                throw new Error("Expecting " + expectedStatusCode + " but got " + res.statusCode);
            }
        }
        self.go();
    });
};
RequestChain.prototype._get = function(url, callback, expectedStatusCode, goOn) {
    var self = this;
    expectedStatusCode = expectedStatusCode || 200;
    request.get(url, function(err, res, body) {
        if (!goOn) {
            if (err)
            {
                throw err;
            }
            if (res.statusCode != expectedStatusCode)
            {
                throw new Error("Expecting " + expectedStatusCode + " but got " + res.statusCode);
            }
        }
        callback();
        self.go();
    });
};
RequestChain.prototype.delete = function(url, expectedStatusCode, goOn) {
    console.log("add delete");
    this.calls.push({method: "_delete", args: [url, expectedStatusCode, goOn]});
    return this;
};
RequestChain.prototype.post = function(url, object, expectedStatusCode, goOn) {
    console.log("add post");
    this.calls.push({method: "_post", args: [url, object, expectedStatusCode, goOn]});
    return this;
};
RequestChain.prototype.put = function(url, object, expectedStatusCode, goOn) {
    this.calls.push({method: "_put", arg: [url, object, expectedStatusCode, goOn]});
    return this;
};
RequestChain.prototype.get = function(url, callback, expectedStatusCode, goOn) {
    this.calls.push({method: "_get", args: [url, callback, expectedStatusCode, goOn]});
    return this;
};
RequestChain.prototype.go = function() {
    var m = this.calls.shift();
    if ( m ) {
        this[m.method].apply(this, m.args);
    }
};

module.exports = RequestChain;