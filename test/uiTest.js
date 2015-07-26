var initContext = function(context) {
    var testingZone = document.querySelector('#testing-zone');
    testingZone.innerHTML = document.querySelector(context).innerHTML;
};

var fireEvent = function(element,event) {
    if (document.createEvent) {
        // dispatch for firefox + others
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true ); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    } else { // dispatch for IE
        var evt = document.createEventObject();
        return element.fireEvent('on'+event,evt);
    }
};


module('Should add link action');

test("login normal case", function() {
    // Given
    initContext('#case-login');

    // When
    UniquePasswordBuilder.insertGenerateActions('test');

    // Then
    equal( document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder').length, 1, "insertGenerateActions() didn’t add a link !" );
});

test("login case with invisible fields", function() {
    // Given
    initContext('#case-login-with-invisible-fields');

    // When
    UniquePasswordBuilder.insertGenerateActions('test');

    // Then
    equal( document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder').length, 7, "insertGenerateActions() didn’t add links !" );
});


test("password creation case with 3 fields : old, new and confirmation", function() {
    // Given
    initContext('#case-creation-3-fields');

    // When
    UniquePasswordBuilder.insertGenerateActions('test');

    // Then
    equal( document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder').length, 3, "insertGenerateActions() didn’t add a link !" );
});


module('Clicking on link should generate unique password and fill it with the current password');

test("login normal case", function() {
    // Given
    initContext('#case-login');
    var password = "abcdef"

    // When
    UniquePasswordBuilder.insertGenerateActions(password);
    var link = document.querySelector('#testing-zone input[type=password] + a.uniquePasswordBuilder');
    fireEvent(link, 'click');

    // Then
    var field = document.querySelector('#testing-zone input[type=password]');
    equal( field.value, password, "Clicking on the link didn’t do anything");
});

test("password creation case with 3 fields : old, new and confirmation", function() {
    // Given
    initContext('#case-creation-3-fields');
    var oldPassword = "abcdef";
    var newPassword = "qwerty";

    // When
    UniquePasswordBuilder.insertGenerateActions(oldPassword);
    var links = document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder');
    fireEvent(links[0], 'click');

    UniquePasswordBuilder.insertGenerateActions(newPassword);
    links = document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder');
    fireEvent(links[1], 'click');
    fireEvent(links[2], 'click');

    // Then
    var fields = document.querySelectorAll('#testing-zone input[type=password]');
    equal( fields[0].value, oldPassword, "Clicking on the link didn’t do anything");
    equal( fields[1].value, newPassword, "Clicking on the link didn’t do anything");
    equal( fields[2].value, newPassword, "Clicking on the link didn’t do anything");
    notEqual( oldPassword, newPassword, "same than old password");
});

