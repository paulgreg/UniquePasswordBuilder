QUnit.module('argon2 algorithm');

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

