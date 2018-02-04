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

QUnit.module('Password checking');

QUnit.test("should not be empty", function(assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword('');

    // Then
    assert.equal( result.success, false);
    assert.equal( result.message, 'Please type a strong password');
    assert.equal( result.error, false);
});

QUnit.test("should contains lower-case characters", function(assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword('E');

    // Then
    assert.equal( result.success, false);
    assert.equal( result.message, 'Password needs lower-case characters');
    assert.equal( result.error, true);
});

QUnit.test("should contains upper-case characters", function(assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword('e');

    // Then
    assert.equal( result.success, false);
    assert.equal( result.message, 'Password needs upper-case characters');
    assert.equal( result.error, true);
});

QUnit.test("should contains numerical characters", function(assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword('Ee');

    // Then
    assert.equal( result.success, false);
    assert.equal( result.message, 'Password needs numerical characters');
    assert.equal( result.error, true);
});

QUnit.test("should contains at least 8 characters", function(assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword('Ee4');

    // Then
    assert.equal( result.success, false);
    assert.equal( result.message, 'Password should be at least 8 characters');
    assert.equal( result.error, true);
});


QUnit.test("should be ok", function(assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword('l2E456t8');

    // Then
    assert.equal( result.success, true);
    assert.equal( result.error, false);
});

QUnit.module('Under the hood');

QUnit.test("makeHashHumanReadable", function(assert) {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.makeHashHumanReadable([150, 168, 201, 232, 17, 182, 150, 77, 43, 138, 240, 5, 167, 144, 209, 44, 167, 162, 175, 120, 6, 135, 20, 43, 243, 35, 171, 236, 51, 45, 61, 20, 248, 45, 226, 120, 244, 136, 105, 47, 154, 208, 89, 244, 223, 172, 87, 147, 64, 192, 141, 66, 244, 67, 255, 226, 122, 141, 38, 103, 86, 46, 17, 20]);

    // Then
    assert.ok( generatedPassword, "(.K_xz491A]!5e[U", "makeHashHumanReadble transformation problem" );
});

QUnit.test("master password should not be empty", function(assert) {
    throws(
        function() {
            // Given
            // When
           UniquePasswordBuilder.generate('scrypt', {protocol:'https:',host:'github.com'}, undefined, '')
        },
        "should fail"
    );
});

QUnit.module('Under the hood ("scrypt" hash algorithm)');

QUnit.test("check scrypt generation against https://www.grc.com/sqrl/scrypt.htm first test case", function(assert) {
    var done = assert.async();
   // Given
   // When
   scrypt("", "", 9, 256, 32, function(result) {
       // Then
       deepEqual( result, [0xa8, 0xea, 0x62, 0xa6, 0xe1, 0xbf, 0xd2, 0x0e, 0x42, 0x75, 0x01, 0x15, 0x95, 0x30, 0x7a, 0xa3, 0x02, 0x64, 0x5c, 0x18, 0x01, 0x60, 0x0e, 0xf5, 0xcd, 0x79, 0xbf, 0x9d, 0x88, 0x4d, 0x91, 0x1c], "scrypt generation problem" );
       done();
   })

});

var githubTlsDefaultPassword = "70hm7XFowvMz#PZY";

QUnit.test("generate for https://github.com with 'default-password'", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('scrypt', 'https://github.com', undefined, 'default-password', undefined, function(generatedPassword) {
        // Then
        equal( generatedPassword, githubTlsDefaultPassword, "generate problem" );
        equal( generatedPassword.length, 16, "generate length problem" );
        done();
    });

});

var githubTlsDefaultPassword1Round = "9cHMZ&H_B6fwvj4K";

QUnit.test("generate for https://github.com with 'default-password' for 2 round", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('scrypt', 'https://github.com', 2, 'default-password', 0, function(generatedPassword) {
        // Then
        equal( generatedPassword, githubTlsDefaultPassword1Round, "generate problem" );
        notEqual( githubTlsDefaultPassword, githubTlsDefaultPassword1Round, "same password than a single round" );
        done();
    });

});

var githubDefaultPassword = "fe$$XA1Lcfb_f973";

QUnit.test("generate for http://github.com with 'default-password'", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('scrypt', 'http://github.com', undefined, 'default-password', 0, function(generatedPassword) {
        // Then
        equal( generatedPassword, githubDefaultPassword, "generate problem" );
        notEqual( generatedPassword, githubTlsDefaultPassword, "same password without protocol");
        done();
    });

});

var googleTlsDefaultPassword = "1LL0nBM&;VF=fdga";

QUnit.test("generate for https://www.google.com with 'default-password'", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('scrypt', 'https://www.google.com', undefined, 'default-password', 0, function(generatedPassword) {
        // Then
        equal( generatedPassword, googleTlsDefaultPassword, "generate problem" );
        notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
        notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
        done();
    });
});

var googleTlsDefaultPassword2 = "%U(xBW_SFxb]XbG.";

QUnit.test("generate for https://www.google.com with 'default-password2'", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('scrypt', 'https://www.google.com', undefined, 'default-password2', 0, function(generatedPassword) {
        // Then
        equal( generatedPassword, googleTlsDefaultPassword2, "generate problem" );
        notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
        notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
        notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
        done();
    });

});

var googleTlsDefaultPasswordDifficulty512 = "zK!C?WxCy)+aO-G$";

QUnit.test("generate for https://www.google.com with 'default-password' with 512 rounds", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('scrypt', 'https://www.google.com', 512, 'default-password', 0, function(generatedPassword) {
        // Then
        equal( generatedPassword, googleTlsDefaultPasswordDifficulty512, "generate problem" );
        notEqual( generatedPassword, googleTlsDefaultPassword2, "same password than google" );
        notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
        notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
        notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
        done();
    });

});

var googleTlsDefaultPasswordDifficulty2048 = "a[#VFS%JL&NUsJ3z";

QUnit.test("generate for https://www.google.com with 'default-password' with 2048 rounds", function(assert) {
     var done = assert.async();
    // Given
    // When
     UniquePasswordBuilder.generate('scrypt', 'https://www.google.com', 2048, 'default-password', 0, function(generatedPassword) {
         // Then
         equal( generatedPassword, googleTlsDefaultPasswordDifficulty2048, "generate problem" );
         notEqual( generatedPassword, googleTlsDefaultPasswordDifficulty512, "same password than google" );
         notEqual( generatedPassword, googleTlsDefaultPassword2, "same password than google" );
         notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
         notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
         notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
         done();
     });

});

var googleTlsDefaultPasswordOldKeyIndex1 = "$L?j4rP2KNVqMZes";

QUnit.test("generate for https://www.google.com with 'default-password' with keyIndex 1", function(assert) {
     var done = assert.async();
    // Given
    // When
     UniquePasswordBuilder.generate('scrypt', 'https://www.google.com', undefined, 'default-password', 1, function(generatedPassword) {
         // Then
         equal( generatedPassword, googleTlsDefaultPasswordOldKeyIndex1, "generate problem" );
         notEqual( generatedPassword, googleTlsDefaultPasswordDifficulty512, "same password than google" );
         notEqual( generatedPassword, googleTlsDefaultPassword2, "same password than google" );
         notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
         notEqual( generatedPassword, googleTlsDefaultPasswordDifficulty2048, "same password than google");
         notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
         notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
         done();
     });
});

var googleTlsDefaultPasswordOldKeyIndex2 = "&JOyZ:iv4,t.Xts:";

QUnit.test("generate for https://www.google.com with 'default-password' with keyIndex 2", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('scrypt', 'https://www.google.com', undefined, 'default-password', 2, function(generatedPassword) {
        // Then
        equal( generatedPassword, googleTlsDefaultPasswordOldKeyIndex2, "generate problem" );
        notEqual( generatedPassword, googleTlsDefaultPasswordDifficulty512, "same password than google" );
        notEqual( generatedPassword, googleTlsDefaultPassword2, "same password than google" );
        notEqual( generatedPassword, googleTlsDefaultPassword, "same password than google" );
        notEqual( generatedPassword, googleTlsDefaultPasswordDifficulty2048, "same password than google");
        notEqual( generatedPassword, googleTlsDefaultPasswordOldKeyIndex1, "same password than google");
        notEqual( generatedPassword, githubDefaultPassword, "same password than github" );
        notEqual( generatedPassword, githubTlsDefaultPassword, "same password than github");
        done();
    });

});

var googleTlsDefaultPasswordUserSaltSomething= "#9SmwDDRUe$GwJx#";

QUnit.test("generate for https://www.google.com with 'default-password' with userSalt something", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('scrypt', 'https://www.google.com', undefined, 'default-password', 'something', function(generatedPassword) {
        // Then
        equal( generatedPassword, googleTlsDefaultPasswordUserSaltSomething, "generate problem" );
        notEqual( generatedPassword, googleTlsDefaultPasswordOldKeyIndex1, "same password than google" );
        done();
    });

});

QUnit.test("rounds should be a power of two", function(assert) {
    throws(
        function() {
            // Given
            // When
           UniquePasswordBuilder.generate('scrypt', 'https://github.com', 13, 'default-password')
        },
        "should fail"
    );
});

QUnit.module('Under the hood ("argon2" hash algorithm)');

QUnit.test("check argon2 generation against https://github.com/P-H-C/phc-winner-argon2 first test case", function(assert) {
    var done = assert.async();
    // Given
    // When
    argon2.hash({
        pass: 'password' ,
        salt: 'somesalt',
        time: 2, // the number of iterations
        mem: 65536, // used memory, in KiB
        hashLen: 24, // desired hash length
        parallelism: 4, // desired parallelism (will be computed in parallel only for PNaCl)
        type: argon2.ArgonType.Argon2i, // or argon2.ArgonType.Argon2d
        distPath:  '../node_modules/argon2-browser/dist'
    }).then(function (argon2Result) {
        // Then
        console.log('[Test] Argon2 results', argon2Result.hash, argon2Result.hashHex, argon2Result.encoded);
        var toto = argon2Result.hash;
        equal(argon2Result.hashHex, '45d7ac72e76f242b20b77b9bf9bf9d5915894e669a24e6c6');
        equal(argon2Result.encoded,'$argon2i$v=19$m=65536,t=2,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG');
        var hashArray = Array.from(argon2Result.hash.entries()).map(e => e[1])
        deepEqual(hashArray, [
            0x45, 0xD7, 0xAC, 0x72, 0xE7, 0x6F, 0x24, 0x2B, 0x20, 0xB7, 0x7B, 0x9B,
            0xF9, 0xBF, 0x9D, 0x59, 0x15, 0x89, 0x4E, 0x66, 0x9A, 0x24, 0xE6, 0xC6,
            ], "argon2 generation problem" );
       done();
   })
});

var githubTlsDefaultPasswordArgon2 = "k)C7G3!Sfi-xLH(Z";

QUnit.test("generate for https://github.com with 'default-password'", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('argon2', 'https://github.com', undefined, 'default-password', undefined, function(generatedPassword) {
        // Then
        equal( generatedPassword, githubTlsDefaultPasswordArgon2, "generate problem" );
        equal( generatedPassword.length, 16, "generate length problem" );
        done();
    }, undefined, { argon2AsmPath: '../node_modules/argon2-browser/dist'});

});


var githubTlsDefaultPassword1RoundArgon2 = "wWgcR#Tw6%dY!:9A";

QUnit.test("generate for https://github.com with 'default-password' for 2 round", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('argon2', 'https://github.com', 2, 'default-password', 0, function(generatedPassword) {
        // Then
        equal( generatedPassword, githubTlsDefaultPassword1RoundArgon2, "generate problem" );
        notEqual( githubTlsDefaultPasswordArgon2, githubTlsDefaultPassword1RoundArgon2, "same password than a single round" );
        done();
    }, undefined, { argon2AsmPath: '../node_modules/argon2-browser/dist'});

});

var githubDefaultPasswordArgon2 = "xz.%C1H9K8G6,YPq";

QUnit.test("generate for http://github.com with 'default-password'", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('argon2', {protocol:'http:',host:'github.com'}, undefined, 'default-password', 0, function(generatedPassword) {
        // Then
        equal( generatedPassword, githubDefaultPasswordArgon2, "generate problem" );
        notEqual( generatedPassword, githubTlsDefaultPasswordArgon2, "same password without protocol");
        done();
    }, undefined, { argon2AsmPath: '../node_modules/argon2-browser/dist'});

});

var googleTlsDefaultPasswordArgon2 = "G..P)tCuVT;-$D]w";

QUnit.test("generate for https://www.google.com with 'default-password'", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('argon2', 'https://www.google.com', undefined, 'default-password', 0, function(generatedPassword) {
        // Then
        equal( generatedPassword, googleTlsDefaultPasswordArgon2, "generate problem" );
        notEqual( generatedPassword, githubDefaultPasswordArgon2, "same password than github" );
        notEqual( generatedPassword, githubTlsDefaultPasswordArgon2, "same password than github");
        done();
    }, undefined, { argon2AsmPath: '../node_modules/argon2-browser/dist'});
});

var googleTlsDefaultPassword2Argon2 = "D23k0ge-zTS!o7ug";

QUnit.test("generate for https://www.google.com with 'default-password2'", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('argon2', 'https://www.google.com', undefined, 'default-password2', 0, function(generatedPassword) {
        // Then
        equal( generatedPassword, googleTlsDefaultPassword2Argon2, "generate problem" );
        notEqual( generatedPassword, googleTlsDefaultPasswordArgon2, "same password than google" );
        notEqual( generatedPassword, githubDefaultPasswordArgon2, "same password than github" );
        notEqual( generatedPassword, githubTlsDefaultPasswordArgon2, "same password than github");
        done();
    }, undefined, { argon2AsmPath: '../node_modules/argon2-browser/dist'});

});

var googleTlsDefaultPasswordArgon2Difficulty100 = "qFEI2U6EV!&:Ye:t";

QUnit.test("generate for https://www.google.com with 'default-password' with 15 rounds", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('argon2', 'https://www.google.com', 15, 'default-password', 0, function(generatedPassword) {
        // Then
        equal( generatedPassword, googleTlsDefaultPasswordArgon2Difficulty100, "generate problem" );
        notEqual( generatedPassword, googleTlsDefaultPassword2Argon2, "same password than google" );
        notEqual( generatedPassword, googleTlsDefaultPasswordArgon2, "same password than google" );
        notEqual( generatedPassword, githubDefaultPasswordArgon2, "same password than github" );
        notEqual( generatedPassword, githubTlsDefaultPasswordArgon2, "same password than github");
        done();
    }, undefined, { argon2AsmPath: '../node_modules/argon2-browser/dist'});
});

var googleTlsDefaultPasswordArgon2Difficulty200 = "ZXbOyr&_kU($+jUf";

QUnit.test("generate for https://www.google.com with 'default-password' with 20 rounds", function(assert) {
     var done = assert.async();
    // Given
    // When
     UniquePasswordBuilder.generate('argon2', 'https://www.google.com', 20, 'default-password', 0, function(generatedPassword) {
         // Then
         equal( generatedPassword, googleTlsDefaultPasswordArgon2Difficulty200, "generate problem" );
         notEqual( generatedPassword, googleTlsDefaultPasswordArgon2Difficulty100, "same password than google" );
         notEqual( generatedPassword, googleTlsDefaultPassword2Argon2, "same password than google" );
         notEqual( generatedPassword, googleTlsDefaultPasswordArgon2, "same password than google" );
         notEqual( generatedPassword, githubDefaultPasswordArgon2, "same password than github" );
         notEqual( generatedPassword, githubTlsDefaultPasswordArgon2, "same password than github");
         done();
     }, undefined, { argon2AsmPath: '../node_modules/argon2-browser/dist'});
});

var googleTlsDefaultPasswordArgon2OldKeyIndex1 = "XN6NkzaKD9LHSkr8";

QUnit.test("generate for https://www.google.com with 'default-password' with keyIndex 1", function(assert) {
     var done = assert.async();
    // Given
    // When
     UniquePasswordBuilder.generate('argon2', 'https://www.google.com', undefined, 'default-password', 1, function(generatedPassword) {
         // Then
         equal( generatedPassword, googleTlsDefaultPasswordArgon2OldKeyIndex1, "generate problem" );
         notEqual( generatedPassword, googleTlsDefaultPasswordArgon2Difficulty100, "same password than google" );
         notEqual( generatedPassword, googleTlsDefaultPassword2Argon2, "same password than google" );
         notEqual( generatedPassword, googleTlsDefaultPasswordArgon2, "same password than google" );
         notEqual( generatedPassword, googleTlsDefaultPasswordArgon2Difficulty200, "same password than google");
         notEqual( generatedPassword, githubDefaultPasswordArgon2, "same password than github" );
         notEqual( generatedPassword, githubTlsDefaultPasswordArgon2, "same password than github");
         done();
     }, undefined, { argon2AsmPath: '../node_modules/argon2-browser/dist'});
});

var googleTlsDefaultPasswordArgon2OldKeyIndex2 = "W:]rdccUEH:Ynvox";

QUnit.test("generate for https://www.google.com with 'default-password' with keyIndex 2", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('argon2', 'https://www.google.com', undefined, 'default-password', 2, function(generatedPassword) {
        // Then
        equal( generatedPassword, googleTlsDefaultPasswordArgon2OldKeyIndex2, "generate problem" );
        notEqual( generatedPassword, googleTlsDefaultPasswordArgon2Difficulty100, "same password than google" );
        notEqual( generatedPassword, googleTlsDefaultPassword2Argon2, "same password than google" );
        notEqual( generatedPassword, googleTlsDefaultPasswordArgon2, "same password than google" );
        notEqual( generatedPassword, googleTlsDefaultPasswordArgon2Difficulty200, "same password than google");
        notEqual( generatedPassword, googleTlsDefaultPasswordArgon2OldKeyIndex1, "same password than google");
        notEqual( generatedPassword, githubDefaultPasswordArgon2, "same password than github" );
        notEqual( generatedPassword, githubTlsDefaultPasswordArgon2, "same password than github");
        done();
    }, undefined, { argon2AsmPath: '../node_modules/argon2-browser/dist'});

});

var googleTlsDefaultPasswordArgon2UserSaltSomething= "9L(d9nP$;H=df!Of";

QUnit.test("generate for https://www.google.com with 'default-password' with userSalt something", function(assert) {
     var done = assert.async();
    // Given
    // When
    UniquePasswordBuilder.generate('argon2', 'https://www.google.com', undefined, 'default-password', 'something', function(generatedPassword) {
        // Then
        equal( generatedPassword, googleTlsDefaultPasswordArgon2UserSaltSomething, "generate problem" );
        notEqual( generatedPassword, googleTlsDefaultPasswordArgon2OldKeyIndex1, "same password than google" );
        done();
    }, undefined, { argon2AsmPath: '../node_modules/argon2-browser/dist'});

});

QUnit.module('getSaltOnLocation');

QUnit.test("should get protocol and host on standard URL", function(assert) {
    var r = UniquePasswordBuilder.getSaltOnLocation('https://github.com/paulgreg/UniquePasswordBuilder')
    equal(r, 'https://github.com')
});

QUnit.test("should return string that are not an URL", function(assert) {
    var r = UniquePasswordBuilder.getSaltOnLocation('someApp')
    equal(r, 'someApp')
});

QUnit.test("should return string for `about` pages", function(assert) {
    var r = UniquePasswordBuilder.getSaltOnLocation('about:debugging#addons')
    equal(r, 'about:debugging#addons') // before #eef3ca9, it was about:debugging#addons//undefined (yes, it was bugged)
});

