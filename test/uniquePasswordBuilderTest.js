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

test("check scrypt generation against https://www.grc.com/sqrl/scrypt.htm first test case", function() {
    // Given
    var scrypt = scrypt_module_factory();

    // When
    var hashedPassword = scrypt.crypto_scrypt(scrypt.encode_utf8(""), scrypt.encode_utf8(""), 512, 256, 1, 32)

    // Then
    deepEqual( hashedPassword.subarray(), new Uint8Array([0xa8, 0xea, 0x62, 0xa6, 0xe1, 0xbf, 0xd2, 0x0e, 0x42, 0x75, 0x01, 0x15, 0x95, 0x30, 0x7a, 0xa3, 0x02, 0x64, 0x5c, 0x18, 0x01, 0x60, 0x0e, 0xf5, 0xcd, 0x79, 0xbf, 0x9d, 0x88, 0x4d, 0x91, 0x1c]), "scrypt generation problem" );
});

test("makeHashHumanReadable", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'notrelevant.com'});

    // When
    var generatedPassword = upb.makeHashHumanReadable(new Uint8Array([150, 168, 201, 232, 17, 182, 150, 77, 43, 138, 240, 5, 167, 144, 209, 44, 167, 162, 175, 120, 6, 135, 20, 43, 243, 35, 171, 236, 51, 45, 61, 20, 248, 45, 226, 120, 244, 136, 105, 47, 154, 208, 89, 244, 223, 172, 87, 147, 64, 192, 141, 66, 244, 67, 255, 226, 122, 141, 38, 103, 86, 46, 17, 20]));

    // Then
    ok( generatedPassword, "(.K_xz491A]!5e[U", "makeHashHumanReadble transformation problem" );
});

var githubTlsDefaultPassword = "T3%:(Rhxi)K99-_n";

test("generateUniquePassword for https://github.com with 'default-password'", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'github.com'});

    // When
    var generatedPassword = upb.generateUniquePassword('default-password');

    // Then
    equal( generatedPassword, githubTlsDefaultPassword, "generateUniquePassword problem" );
});

var githubTlsDefaultPassword1Round = "YzWUCD(6L]Y;37+s";

test("generateUniquePassword for https://github.com with 'default-password' for 1 round", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'github.com'}, 1);

    // When
    var generatedPassword = upb.generateUniquePassword('default-password');

    // Then
    equal( generatedPassword, githubTlsDefaultPassword1Round, "generateUniquePassword problem" );
    notEqual( githubTlsDefaultPassword, githubTlsDefaultPassword1Round, "same password than a single round" );
});

var githubDefaultPassword = "x80.%W&I4!9b1R+$";

test("generateUniquePassword for http://github.com with 'default-password'", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'http:',host:'github.com'});

    // When
    var generatedPassword = upb.generateUniquePassword('default-password');

    // Then
    equal( generatedPassword, githubDefaultPassword, "generateUniquePassword problem" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password without protocol");
});

var googleTlsDefaultPassword = "B!kjuovp)3ZKMToJ";

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

var googleTlsDefaultPassword2 = "prY3LZxVt#]Nz;8i";

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

var googleTlsDefaultPasswordRounds512 = "zK!C?WxCy)+aO-G$";

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

var googleTlsDefaultPasswordRounds2048 = "a[#VFS%JL&NUsJ3z";

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
    upb.insertGenerateActions("default-password");
    var link = document.querySelector('#testing-zone input[type=password] + a.uniquePasswordBuilder');
    fireEvent(link, 'click');

    // Then
    var field = document.querySelector('#testing-zone input[type=password]');
    equal( field.value, googleTlsDefaultPassword, "Clicking on the link didn’t do anything");
});

var googleOldPassword = "Q?zkT5ZTJ-dR-oAT";

test("password creation case with 3 fields : old, new and confirmation", function() {
    // Given
    var upb = new UniquePasswordBuilder({protocol:'https:',host:'www.google.com'});
    initContext('#case-creation-3-fields');

    // When
    upb.insertGenerateActions("old-password");
    var links = document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder');
    fireEvent(links[0], 'click');

    upb.insertGenerateActions("default-password");
    links = document.querySelectorAll('#testing-zone input[type=password] + a.uniquePasswordBuilder');
    fireEvent(links[1], 'click');
    fireEvent(links[2], 'click');

    // Then
    var fields = document.querySelectorAll('#testing-zone input[type=password]');
    equal( fields[0].value, googleOldPassword, "Clicking on the link didn’t do anything");
    equal( fields[1].value, googleTlsDefaultPassword, "Clicking on the link didn’t do anything");
    equal( fields[2].value, googleTlsDefaultPassword, "Clicking on the link didn’t do anything");
    notEqual( googleOldPassword, googleTlsDefaultPassword, "same than old password");
});

