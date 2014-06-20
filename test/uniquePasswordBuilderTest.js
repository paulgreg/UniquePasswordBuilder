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

module('Under the hood');

test("scrypt generation", function() {
    // Given
    var scrypt = scrypt_module_factory();

    // When
    var hashedPassword = scrypt.crypto_scrypt(scrypt.encode_utf8("password"), scrypt.encode_utf8("http://www.google.com/"), 1024, 8, 1, 64)

    // Then
    deepEqual( hashedPassword.subarray(), new Uint8Array([150, 168, 201, 232, 17, 182, 150, 77, 43, 138, 240, 5, 167, 144, 209, 44, 167, 162, 175, 120, 6, 135, 20, 43, 243, 35, 171, 236, 51, 45, 61, 20, 248, 45, 226, 120, 244, 136, 105, 47, 154, 208, 89, 244, 223, 172, 87, 147, 64, 192, 141, 66, 244, 67, 255, 226, 122, 141, 38, 103, 86, 46, 17, 20]), "scrypt generation problem" );
});

test("makeHashHumanReadable", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'notrelevant.com'});

    // When
    var generatedPassword = upb.makeHashHumanReadable(new Uint8Array([150, 168, 201, 232, 17, 182, 150, 77, 43, 138, 240, 5, 167, 144, 209, 44, 167, 162, 175, 120, 6, 135, 20, 43, 243, 35, 171, 236, 51, 45, 61, 20, 248, 45, 226, 120, 244, 136, 105, 47, 154, 208, 89, 244, 223, 172, 87, 147, 64, 192, 141, 66, 244, 67, 255, 226, 122, 141, 38, 103, 86, 46, 17, 20]));

    // Then
    ok( generatedPassword, "(.K_xz491A]!5e[U", "makeHashHumanReadble transformation problem" );
});

var githubTlsDefaultPassword = "(1_.x#cs1N=UfqRc";

test("generateUniquePassword for https://github.com with 'default-password'", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'github.com'});

    // When
    var generatedPassword = upb.generateUniquePassword('default-password');

    // Then
    equal( generatedPassword, githubTlsDefaultPassword, "generateUniquePassword problem" );
});

var githubTlsDefaultPassword1Round = "xQfk+.suVGBZQx3u";

test("generateUniquePassword for https://github.com with 'default-password' for 1 round", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'github.com'}, 1);

    // When
    var generatedPassword = upb.generateUniquePassword('default-password');

    // Then
    equal( generatedPassword, githubTlsDefaultPassword1Round, "generateUniquePassword problem" );
    notEqual( githubTlsDefaultPassword, githubTlsDefaultPassword1Round, "same password than a single round" );
});

var githubDefaultPassword = "X6;V4C?-Aqlyr]R2";

test("generateUniquePassword for http://github.com with 'default-password'", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'http:',host:'github.com'});

    // When
    var generatedPassword = upb.generateUniquePassword('default-password');

    // Then
    equal( generatedPassword, githubDefaultPassword, "generateUniquePassword problem" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password without protocol");
});

var googleTlsDefaultPassword = "BV?%iJF7j$xx%xRr";

test("generateUniquePassword for https://www.google.com with 'default-password'", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'www.google.com'});

    // When
    var generatedPassword = upb.generateUniquePassword('default-password');

    // Then
    equal( generatedPassword, googleTlsDefaultPassword, "generateUniquePassword problem" );
    notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
});

var googleTlsDefaultPassword2 = ";1KsE=HI-Uw[61x&";

test("generateUniquePassword for https://www.google.com with 'default-password2'", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'www.google.com'});

    // When
    var generatedPassword = upb.generateUniquePassword('default-password2');

    // Then
    equal( generatedPassword, googleTlsDefaultPassword2, "generateUniquePassword problem" );
    notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
    notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
});

var googleTlsDefaultPasswordRounds512 = "jC.9NcRHXY=#rmX;";

test("generateUniquePassword for https://www.google.com with 'default-password' with 512 rounds", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'www.google.com'}, 512);

    // When
    var generatedPassword = upb.generateUniquePassword('default-password');

    // Then
    equal( generatedPassword, googleTlsDefaultPasswordRounds512, "generateUniquePassword problem" );
    notEqual( generatedPassword, googleTlsDefaultPassword2, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
    notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
});

var googleTlsDefaultPasswordRounds2048 = "q.xVYHbU!$6RWteO";

test("generateUniquePassword for https://www.google.com with 'default-password' with 2048 rounds", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'www.google.com'}, 2048);

    // When
    var generatedPassword = upb.generateUniquePassword('default-password');

    // Then
    equal( generatedPassword, googleTlsDefaultPasswordRounds2048, "generateUniquePassword problem" );
    notEqual( generatedPassword, googleTlsDefaultPasswordRounds512, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPassword2, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
    notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
});

module('Should add link action');

test("login normal case", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'domain.com'});
    initContext('#case-login');

    // When
    upb.insertGenerateActions();

    // Then
    equal( document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder').length, 1, "insertGenerateActions() didn’t add a link !" );
});

test("login case with invisible fields", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'domain.com'});
    initContext('#case-login-with-invisible-fields');

    // When
    upb.insertGenerateActions();

    // Then
    equal( document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder').length, 7, "insertGenerateActions() didn’t add links !" );
});


test("password creation case with 3 fields : old, new and confirmation", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'domain.com'});
    initContext('#case-creation-3-fields');

    // When
    upb.insertGenerateActions();

    // Then
    equal( document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder').length, 3, "insertGenerateActions() didn’t add a link !" );
});


module('Clicking on link should generate unique password and fill it with the current password');

test("login normal case", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'www.google.com'});
    initContext('#case-login');

    // When
    upb.insertGenerateActions();
    var field = document.querySelector('#testing-zone input[type=password]');
    field.value = "default-password";
    var link = document.querySelector('#testing-zone input[type=password] + a.uniquePasswordBuilder');
    fireEvent(link, 'click');

    // Then
    equal( field.value, googleTlsDefaultPassword, "Clicking on the link didn’t do anything");
});

var googleOldPassword = "!#[SM4rtyRPIbe2r";

test("password creation case with 3 fields : old, new and confirmation", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'www.google.com'});
    initContext('#case-creation-3-fields');

    // When
    upb.insertGenerateActions();
    var fields = document.querySelectorAll('#testing-zone input[type=password]');
    fields[0].value = "old-password";
    fields[1].value = "default-password";
    fields[2].value = "default-password";
    var links = document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder');
    fireEvent(links[0], 'click');
    fireEvent(links[1], 'click');
    fireEvent(links[2], 'click');

    // Then
    equal( fields[0].value, googleOldPassword, "Clicking on the link didn’t do anything");
    equal( fields[1].value, googleTlsDefaultPassword, "Clicking on the link didn’t do anything");
    equal( fields[2].value, googleTlsDefaultPassword, "Clicking on the link didn’t do anything");
    notEqual( googleOldPassword, googleTlsDefaultPassword, "same than old password");
});

