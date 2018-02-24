QUnit.module('scrypt algorithm');

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
    var algoParams = {
        algorithm: 'scrypt',
        locationSalt: 'https://github.com',
        difficulty: undefined,
        masterPassword: 'default-password',
        userSalt: undefined
    };
    // When
    UniquePasswordBuilder.generate(algoParams, function(generatedPassword) {
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
    var algoParams = {
        algorithm: 'scrypt',
        locationSalt: 'https://github.com',
        difficulty: 2,
        masterPassword: 'default-password',
        userSalt: 0
    };
    // When
    UniquePasswordBuilder.generate(algoParams, function(generatedPassword) {
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
    var algoParams = {
        algorithm: 'scrypt',
        locationSalt: 'http://github.com',
        difficulty: undefined,
        masterPassword: 'default-password',
        userSalt: 0
    };
    // When
    UniquePasswordBuilder.generate(algoParams, function(generatedPassword) {
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
    var algoParams = {
        algorithm: 'scrypt',
        locationSalt: 'https://www.google.com',
        difficulty: undefined,
        masterPassword: 'default-password',
        userSalt: 0
    };
    // When
    UniquePasswordBuilder.generate(algoParams, function(generatedPassword) {
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
    var algoParams = {
        algorithm: 'scrypt',
        locationSalt: 'https://www.google.com',
        difficulty: undefined,
        masterPassword: 'default-password2',
        userSalt: 0
    };
    // When
    UniquePasswordBuilder.generate(algoParams, function(generatedPassword) {
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
    var algoParams = {
        algorithm: 'scrypt',
        locationSalt: 'https://www.google.com',
        difficulty: 512,
        masterPassword: 'default-password',
        userSalt: 0
    };
    // When
    UniquePasswordBuilder.generate(algoParams, function(generatedPassword) {
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
    var algoParams = {
        algorithm: 'scrypt',
        locationSalt: 'https://www.google.com',
        difficulty: 2048,
        masterPassword: 'default-password',
        userSalt: 0
    };
    // When
     UniquePasswordBuilder.generate(algoParams, function(generatedPassword) {
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
    var algoParams = {
        algorithm: 'scrypt',
        locationSalt: 'https://www.google.com',
        difficulty: undefined,
        masterPassword: 'default-password',
        userSalt: 1
    };
    // When
     UniquePasswordBuilder.generate(algoParams, function(generatedPassword) {
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
    var algoParams = {
        algorithm: 'scrypt',
        locationSalt: 'https://www.google.com',
        difficulty: undefined,
        masterPassword: 'default-password',
        userSalt: 2
    };
    // When
    UniquePasswordBuilder.generate(algoParams, function(generatedPassword) {
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
    var algoParams = {
        algorithm: 'scrypt',
        locationSalt: 'https://www.google.com',
        difficulty: undefined,
        masterPassword: 'default-password',
        userSalt: 'something'
    };
    // When
    UniquePasswordBuilder.generate(algoParams, function(generatedPassword) {
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
            var algoParams = {
                algorithm: 'scrypt',
                locationSalt: 'https://www.google.com',
                difficulty: 13,
                masterPassword: 'default-password',
                userSalt: 'something'
            };
            // When
           UniquePasswordBuilder.generate(algoParams)
        },
        "should fail"
    );
});
