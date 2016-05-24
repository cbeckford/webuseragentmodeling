/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function step(stepNumber, action, targetType, withValue) {
    //self = this;
    //self.addLocator();
    return {
        stepNumber: ko.observable(stepNumber),
        action: ko.observable(action),
        targetType: ko.observable(targetType),
        withValue: ko.observable(withValue),
        locators: ko.observableArray([
            new locator("TARGET_LOCATOR","","", "ORDINAL_INSTANCE","EQUAL", "1")
        ]),        
        showLocators: ko.observable(false),
        remove: function () {
            webUserAgent.plannedSteps.remove(this);
        },
        addLocator: function () {
            self = this;
            self.locators.push(new locator("TARGET_LOCATOR","","", "ORDINAL_INSTANCE","EQUAL", "1"));
        }
    };        
}

function assertion(assertionNumber, sensor, amount, targetType, withValue) {
        return {
        assertionNumber: ko.observable(assertionNumber),
        sensor: ko.observable(sensor),
        amount: ko.observable(amount),
        targetType: ko.observable(targetType),
        withValue: ko.observable(withValue),
        locators: ko.observableArray([            
            new locator("TARGET_LOCATOR","","", "ORDINAL_INSTANCE","EQUAL", "1")            
        ]),        
        showLocators: ko.observable(false),
        remove: function () {
            webUserAgent.plannedSteps.remove(this);
        },
        addLocator: function () {
            self = this;
            self.locators.push(new locator("TARGET_LOCATOR","","", "ORDINAL_INSTANCE","EQUAL", "1"));
        }
    };        
}

var locator = function() {
    return locator(
            self.locatorType, self.locatorRelativePosition, self.locatorTargetType, self.locatorCriteria, self.locatorOperator, self.locatorValue);
};

var locator = function(locatorType, locatorRelativePosition, locatorTargetType, locatorCriteria, locatorOperator, locatorValue ) {
    self = this;
    self.locatorType = ko.observable(locatorType);
    self.locatorRelativePosition = ko.observable(locatorRelativePosition);
    self.locatorTargetType = ko.observable(locatorTargetType);
    self.locatorCriteria=ko.observable(locatorCriteria);
    self.locatorOperator = ko.observable(locatorOperator);
    self.locatorValue = ko.observable(locatorValue);
    self.defaultPosition = ko.observable('TARGET_LOCATOR');
    
    self.getDefaultPosition = ko.computed(function() {       
        if (self.locatorType()==="RELATIVE_LOCATOR") {
            return "BESIDE";
        }
        return "";        
    });
    
    self.getDefaultPosition.subscribe(function(newValue) {
        self.locatorRelativePosition(newValue);              
    });
};

function dataItem(dataKey, dataValue) {
    return {
        dataKey: ko.observable(dataKey),
        dataValue: ko.observable(dataValue),
        dataCaption : ko.observable(camelCaseToTitle(dataKey)),
        remove: function () {
            webUserAgent.userData.remove(this);
        }
    };
}

var webUserAgent = {
    belief: ko.observable("value having of a good vocabulary!"),
    application: ko.observable("Google Search Website"),
    intent: ko.observable("search for a word using the 'define:' prefix"),
    desire: ko.observable("to find the meaning of a word"),
    benefit: ko.observable("I can develop my vocabulary"),
    url: ko.observable("https://www.google.com"),
    feature: ko.observable("Word definition search with 'define:' prefix feature"),
    role: ko.observable("Visitor"),
    storyValid: ko.observable(false),
    showData: ko.observable(true),
    showSteps: ko.observable(true),
    showAssertions: ko.observable(true),
    showSimulation: ko.observable(true),
    showForms: ko.observable(true),
    keysPerSecond: ko.observable("4"),
    userData: ko.observableArray([
        new dataItem("firstName", "Anna"),
        new dataItem("middleName", "N."),
        new dataItem("lastName", "Smith"),
        new dataItem("email", "Anna.Smith@Example.Com"),
        new dataItem("gender", "Female"),
        new dataItem("userName", "ansmith01"),
        new dataItem("password", "p@SSword1"),
        new dataItem("spouseFirstName", "Phillip"),
        new dataItem("spouseLastName", "Smith"),
        new dataItem("startingURL", "https://www.google.com"),
        new dataItem("searchPhrase", "define: simulation"),
        new dataItem("assertionText1", "Simulation is the imitation of the operation of a real-world process or system over time.")
        
    ]),
    plannedSteps: ko.observableArray([
        new step("1", "GO_TO", "URL", "%{startingURL}%"),
        new step("2", "FILL", "TEXT_BOX", "%{searchPhrase}%")
    ]),
    plannedAssertions: ko.observableArray([
        new assertion("1", "SEE", "1", "TEXT", "%{assertionText1}%")
    ]),
    addData: function () {
        var dataKey = document.getElementById("newDataKey").value.toString();
        if (dataKey.trim()==="") { 
            document.getElementById("newDataKey").placeholder="variableName: This is a required field!";
            document.getElementById("newDataKey").setAttribute("style", "background-color: #610B21; color: yellow;");
            return;
        }
        var dataValue = document.getElementById("newDataValue").value.toString();
        document.getElementById("newDataKey").placeholder='variableName';
        document.getElementById("newDataKey").setAttribute("style", "background-color: white;");
        
        this.userData.push(new dataItem(dataKey, dataValue));
        document.getElementById("newDataKey").value = "";
        document.getElementById("newDataValue").value="";
    },
    addStep: function () {
        var nextStep = webUserAgent.plannedSteps().length+1;
        this.plannedSteps.push(new step(nextStep, document.getElementById("newAction").value, document.getElementById("newTarget").value, document.getElementById("newArguments").value));
        
    },
    addAssertion: function () {
        var nextAssertion = webUserAgent.plannedAssertions().length+1;
        this.plannedAssertions.push(new step(nextAssertion, document.getElementById("newSensor").value, document.getElementById("newAssertionAmount").value, document.getElementById("newAssertionTarget").value, document.getElementById("newAssertionArguments").value));
    },
    asJsonString: function () {
        var jsonString = '{ "webUserAgent" : ';
        jsonString = jsonString + ko.toJSON(this, null, 4);
        jsonString = jsonString + '}';
        return jsonString;
    },
    save: function () {        
        $.ajax({
            url: "http://localhost:8080/webuseragent/run", 
            type: "post",
            data: this.asJsonString(),
            contentType: "application/json",
            success: function (result) {
                alert(result.message);
            }
        });
    },
    showHtml: function () {        
        $.ajax({
            type: "post",
            url: 'http://localhost:8080/webuseragent/run',
            data: this.asJsonString(),
            dataType: 'jsonp',
            contentType: "text/html",
            crossDomain:'true',
            success: function (data) {
                $(".result").html(data);
            }
        });
    },
    showJson: function () {
        document.getElementById("web-user-json").value = this.asJsonString() ;
    },
    removeLocator: function () {
            console.log(this);
            this.plannedSteps.locators.remove(this);
        }
};

webUserAgent.fullName = ko.dependentObservable(function () {
    return " ";
}, webUserAgent);

webUserAgent.availableActions = ko.dependentObservable(function () {
    return ['CHECK', 'CLEAR', 'CLEAR_AND_ENTER', 'CLEAR_AND_FILL', 'CLEAR_FILL_AND_ENTER', 'CLICK', 'COPY', 'DOUBLE_CLICK', 'ENTER', 'FILL', 'FILL_AND_ENTER', 'GO_TO', 'HOLD', 'HOVER_OVER', 'LEFT_CLICK', 'LOOK_FOR', 'NONE', 'OPEN', 'PASTE', 'PRESS', 'RELEASE', 'RESET', 'RIGHT_CLICK', 'SCROLL', 'SELECT', 'SLIDE_DOWN', 'SLIDE_UP', 'SUBMIT', 'SWITCH_TOTYPE', 'UNCHECK', 'UNSELECT'];
}, webUserAgent);

webUserAgent.availableSensors = ko.dependentObservable(function () {
    return ['SEE', 'HEAR', 'FEEL'];
}, webUserAgent);

webUserAgent.availableTargets = ko.dependentObservable(function () {
    return ['BROWSER', 'BUTTON', 'COLUMN', 'DIALOG', 'DROPDOWN', 'FORM', 'FIELD', 'IMAGE', 'LINK', 'OBJECT', 'OPTION', 'PAGE', 'PARAGRAPH', 'ROW', 'TABLE', 'TEXT', 'TEXT_BLOCK', 'TEXT_BOX', 'TEXTBOX', 'URL', 'WINDOW',''];
}, webUserAgent);

locator.availableTypes = ko.dependentObservable(function () {
    return ['TARGET_LOCATOR', 'RELATIVE_LOCATOR'];
}, webUserAgent);

locator.availableCriteria = ko.dependentObservable(function () {
    return ['ORDINAL_INSTANCE', 'TEXT_VALUE', 'SIZE', 'COLOR', 'FONT', 'CAPTION', 'XPATH_FILTER'];    
}, webUserAgent);

locator.availableOperators = ko.dependentObservable(function () {
    return ['BEGINNING_WITH', 'CONTAINING', 'DIVISIBLE_BY', 'ENDING_WITH', 'EQUAL', 'GREATER_THAN', 'LESS_THAN', 'NONE', 'NOT_BEGINNING_WITH', 'NOT_CONTAINING', 'NOT_DIVISIBLE_BY', 'NOT_ENDING_WITH', 'NOT_EQUAL', 'NOT_TITLED', 'TITLE'];    
}, webUserAgent);

locator.availablePositions = ko.dependentObservable(function () {
    return ['','ABOVE', 'BELOW', 'BESIDE', 'DIRECTLY_ABOVE', 'DIRECTLY_BELOW', 'DIRECTLY_TO_THE_LEFT', 'DIRECTLY_TO_THE_RIGHT', 'IN_THE_SAME_COLUMN', 'IN_THE_SAME_ROW', 'NOT_BESIDE', 'OVER_LAPPING', 'TO_THE_LEFT', 'TO_THE_LEFT_AND_ABOVE', 'TO_THE_LEFT_AND_BELOW', 'TO_THE_RIGHT', 'TO_THE_RIGHT_AND_ABOVE', 'TO_THE_RIGHT_AND_BELOW'];
}, webUserAgent);

locator.defaultType = ko.dependentObservable(function () {
    return "TARGET_LOCATOR";
}, webUserAgent);

locator.defaultCriteria = ko.dependentObservable(function () {
    return "SEE";
}, webUserAgent);

locator.defaultOperator = ko.dependentObservable(function () {
    return "EQUAL";
}, webUserAgent);

locator.defaultToRelativePosition = ko.dependentObservable(function () {
    return "ORDINAL_INSTANCE";
}, webUserAgent);

webUserAgent.availableArguments = ko.computed(function() {
    var dataKeys = ko.utils.arrayMap(this.userData(), function(dataItem) {
        return "%{"+dataItem.dataKey()+"}%";
    });
    return dataKeys.sort();
}, webUserAgent);

webUserAgent.defaultAction = ko.dependentObservable(function () {
    return "GO_TO";
}, webUserAgent);

webUserAgent.defaultSensor = ko.dependentObservable(function () {
    return "SEE";
}, webUserAgent);

webUserAgent.defaultTarget = ko.dependentObservable(function () {
    return "URL";
}, webUserAgent);

webUserAgent.defaultArgument = ko.dependentObservable(function () {
    return "NONE";
    //return webUserAgent.userData(0).keys("dataKey").toString() ;
}, webUserAgent);

ko.applyBindings(webUserAgent);

function camelCaseToTitle(camelCase) {
    if (!camelCase) {
        return '';
    }

    var pascalCase = camelCase.charAt(0).toUpperCase() + camelCase.substr(1);
    return pascalCase
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
            .replace(/([a-z])([0-9])/gi, '$1 $2')
            .replace(/([0-9])([a-z])/gi, '$1 $2');
}

function resize_input(event) {
    event.target.size = event.target.size <= 100 ? ((event.target.value.length + 1)) : 100;
}


function clickSubmit() {
        //var div = document.getElementById('web-user-create-div');
        //if (div.style.display !== 'none') {
        //        div.style.display = 'none';
        //}
        //else {
        //        div.style.display = 'block';
        //}
        var div2 = document.getElementById('web-user-creating-div');
        if (div2.style.display !== 'none') {
                div2.style.display = 'none';
        }
        else {
                div2.style.display = 'block';
        }
};