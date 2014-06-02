var request = require("request");

function RequestChain() {
    this.calls = [];
    this.mappings = {};
}
RequestChain.prototype._delete = function(url, expectedStatusCode, goOn) {
    var self = this;
    expectedStatusCode = expectedStatusCode || 200;
    request.del(url, function(err, res, body) {
        if (!goOn) {
            if (err)
            {
                throw err;
            }
            if (res.statusCode != expectedStatusCode)
            {
                throw new Error("DELETE: " + url + ". Expecting " + expectedStatusCode + " but got " + res.statusCode);
            }
        }
        self.go();
    });
};
RequestChain.prototype._post = function(url, object, expectedStatusCode, goOn) {
    var self = this;
    expectedStatusCode = expectedStatusCode || 201;
    request.post(url, {form: object}, function(err, res, body) {
        if (!goOn) {
            if (err)
            {
                throw err;
            }
            if (res.statusCode != expectedStatusCode)
            {
                throw new Error("POST: " + url + ". Expecting " + expectedStatusCode + " but got " + res.statusCode);
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
                throw new Error("PUT: " + url + ". Expecting " + expectedStatusCode + " but got " + res.statusCode);
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
                throw new Error("GET: " + url + ". Expecting " + expectedStatusCode + " but got " + res.statusCode);
            }
        }
        if ( callback ) {
            callback(body);
        }
        self.go();
    });
};
RequestChain.prototype.delete = function(url, expectedStatusCode, goOn) {
    this.calls.push({method: "_delete", args: [this.urlTemplate(url), expectedStatusCode, goOn]});
    return this;
};
RequestChain.prototype.post = function(url, object, expectedStatusCode, goOn) {
    this.calls.push({method: "_post", args: [this.urlTemplate(url), object, expectedStatusCode, goOn]});
    return this;
};
RequestChain.prototype.put = function(url, object, expectedStatusCode, goOn) {
    this.calls.push({method: "_put", args: [this.urlTemplate(url), object, expectedStatusCode, goOn]});
    return this;
};
RequestChain.prototype.get = function(url, callback, expectedStatusCode, goOn) {
    this.calls.push({method: "_get", args: [this.urlTemplate(url), callback, expectedStatusCode, goOn]});
    return this;
};
RequestChain.prototype.go = function() {
    var m = this.calls.shift();
    if ( m ) {
        this[m.method].apply(this, m.args);
    }
};
RequestChain.prototype.map = function(data) {
    for ( var i in data ) {
        this.mappings[i] = data[i];
    }
};
RequestChain.prototype.urlTemplate = function(url) {
    var data = this.mappings;
    return url.replace(/\{(\w*)\}/g, function(m, key) {
        return data.hasOwnProperty(key) ? data[key] : "";
    });
};
module.exports = RequestChain;