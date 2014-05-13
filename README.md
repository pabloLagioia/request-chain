request-chain
=============

A library for executing requests one after the other

##Motivations
There may be times when you need to execute one request, wait for the response, execute another and so on.
Doing that with callback functions would turn out into a very difficult code to read.

In our particular case, we have many rest services for which we need to create integration tests. So to ensure there is nothing
in the database before running the test, we have to run an http delete and then http post, in that order.
A library that lets you queue up http requests and then execute them would solve this issue.

##Some examples?

```javascript

var requestChain = new RequestChain();

requestChain.delete("http://localhost:8081/employee")
            .post("http://localhost:8081/employee", employeeJSON)
            .get("http://localhost:8081/employee/", function(responseBody) {

                var employee = JSON.parse(responseBody);

                assertEquals(employee.name, "John");

            })
            .put("http://localhost:8081/employee/", employeeUpdateJSON)
            .go();
```

##Options

 * ```get(url, callback [, expectedStatusCode=200, goOnIfError=false])```
 * ```post(url, object, [, expectedStatusCode=201, goOnIfError=false])```
 * ```put(url, object, [, expectedStatusCode=201, goOnIfError=false])```
 * ```delete(url [, expectedStatusCode=200, goOnIfError=false])```
