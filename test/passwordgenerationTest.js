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
    // When
    var generatedPassword = UniquePasswordBuilder.makeHashHumanReadable(new Uint8Array([150, 168, 201, 232, 17, 182, 150, 77, 43, 138, 240, 5, 167, 144, 209, 44, 167, 162, 175, 120, 6, 135, 20, 43, 243, 35, 171, 236, 51, 45, 61, 20, 248, 45, 226, 120, 244, 136, 105, 47, 154, 208, 89, 244, 223, 172, 87, 147, 64, 192, 141, 66, 244, 67, 255, 226, 122, 141, 38, 103, 86, 46, 17, 20]));

    // Then
    ok( generatedPassword, "(.K_xz491A]!5e[U", "makeHashHumanReadble transformation problem" );
});

var githubTlsDefaultPassword = "T3%:(Rhxi)K99-_n";

test("generate for https://github.com with 'default-password'", function() {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.generate({protocol:'https:',host:'github.com'}, undefined, 'default-password');

    // Then
    equal( generatedPassword, githubTlsDefaultPassword, "generate problem" );
    equal( generatedPassword.length, 16, "generate length problem" );
});

var githubTlsDefaultPassword1Round = "YzWUCD(6L]Y;37+s";

test("generate for https://github.com with 'default-password' for 1 round", function() {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.generate({protocol:'https:',host:'github.com'}, 1, 'default-password');

    // Then
    equal( generatedPassword, githubTlsDefaultPassword1Round, "generate problem" );
    notEqual( githubTlsDefaultPassword, githubTlsDefaultPassword1Round, "same password than a single round" );
});

var githubDefaultPassword = "x80.%W&I4!9b1R+$";

test("generate for http://github.com with 'default-password'", function() {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.generate({protocol:'http:',host:'github.com'}, undefined, 'default-password');

    // Then
    equal( generatedPassword, githubDefaultPassword, "generate problem" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password without protocol");
});

var googleTlsDefaultPassword = "B!kjuovp)3ZKMToJ";

test("generate for https://www.google.com with 'default-password'", function() {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.generate({protocol:'https:',host:'www.google.com'}, undefined, 'default-password');

    // Then
    equal( generatedPassword, googleTlsDefaultPassword, "generate problem" );
    notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
});

var googleTlsDefaultPassword2 = "prY3LZxVt#]Nz;8i";

test("generate for https://www.google.com with 'default-password2'", function() {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.generate({protocol:'https:',host:'www.google.com'}, undefined, 'default-password2');

    // Then
    equal( generatedPassword, googleTlsDefaultPassword2, "generate problem" );
    notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
    notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
});

var googleTlsDefaultPasswordRounds512 = "zK!C?WxCy)+aO-G$";

test("generate for https://www.google.com with 'default-password' with 512 rounds", function() {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.generate({protocol:'https:',host:'www.google.com'}, 512, 'default-password');

    // Then
    equal( generatedPassword, googleTlsDefaultPasswordRounds512, "generate problem" );
    notEqual( generatedPassword, googleTlsDefaultPassword2, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
    notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
});

var googleTlsDefaultPasswordRounds2048 = "a[#VFS%JL&NUsJ3z";

test("generate for https://www.google.com with 'default-password' with 2048 rounds", function() {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.generate({protocol:'https:',host:'www.google.com'}, 2048, 'default-password');

    // Then
    equal( generatedPassword, googleTlsDefaultPasswordRounds2048, "generate problem" );
    notEqual( generatedPassword, googleTlsDefaultPasswordRounds512, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPassword2, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
    notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
});

var googleTlsDefaultPasswordKeyIndex1 = "4eRW_X;ggO#R_0HL";

test("generate for https://www.google.com with 'default-password' with keyIndex 1", function() {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.generate({protocol:'https:',host:'www.google.com'}, undefined, 'default-password', 1);

    // Then
    equal( generatedPassword, googleTlsDefaultPasswordKeyIndex1, "generate problem" );
    notEqual( generatedPassword, googleTlsDefaultPasswordRounds512, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPassword2, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPasswordRounds2048, "same password than google");
    notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
});

var googleTlsDefaultPasswordKeyIndex2 = "86j4qEK&&OV-qQ,c";

test("generate for https://www.google.com with 'default-password' with keyIndex 2", function() {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.generate({protocol:'https:',host:'www.google.com'}, undefined, 'default-password', 2);

    // Then
    equal( generatedPassword, googleTlsDefaultPasswordKeyIndex2, "generate problem" );
    notEqual( generatedPassword, googleTlsDefaultPasswordRounds512, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPassword2, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
    notEqual( generatedPassword, googleTlsDefaultPasswordRounds2048, "same password than google");
    notEqual( generatedPassword, googleTlsDefaultPasswordKeyIndex1, "same password than google");
    notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
    notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
});

test("rounds should be a power of two", function() {
    throws(
        function() {
            // Given
            // When
           UniquePasswordBuilder.generate({protocol:'https:',host:'github.com'}, 13, 'default-password')
        },
        "should fail"
    );
});

test("master password should not be empty", function() {
    throws(
        function() {
            // Given
            // When
           UniquePasswordBuilder.generate({protocol:'https:',host:'github.com'}, undefined, '')
        },
        "should fail"
    );
});
