QUnit.module("argon2 algorithm");

QUnit.test(
    "check argon2 generation against https://github.com/P-H-C/phc-winner-argon2 first test case",
    function (assert) {
        var done = assert.async();
        // Given
        // When
        argon2
            .hash({
                pass: "password",
                salt: "somesalt",
                time: 2, // the number of iterations
                mem: 65536, // used memory, in KiB
                hashLen: 24, // desired hash length
                parallelism: 4, // desired parallelism (will be computed in parallel only for PNaCl)
                type: argon2.ArgonType.Argon2i, // or argon2.ArgonType.Argon2d
                distPath: "../node_modules/argon2-browser/dist",
            })
            .then(function (argon2Result) {
                // Then
                console.log(
                    "[Test] Argon2 results",
                    argon2Result.hash,
                    argon2Result.hashHex,
                    argon2Result.encoded
                );
                assert.equal(
                    argon2Result.hashHex,
                    "45d7ac72e76f242b20b77b9bf9bf9d5915894e669a24e6c6"
                );
                assert.equal(
                    argon2Result.encoded,
                    "$argon2i$v=19$m=65536,t=2,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG"
                );
                var hashArray = Array.from(argon2Result.hash.entries()).map(
                    (e) => e[1]
                );
                assert.deepEqual(
                    hashArray,
                    [
                        0x45, 0xd7, 0xac, 0x72, 0xe7, 0x6f, 0x24, 0x2b, 0x20,
                        0xb7, 0x7b, 0x9b, 0xf9, 0xbf, 0x9d, 0x59, 0x15, 0x89,
                        0x4e, 0x66, 0x9a, 0x24, 0xe6, 0xc6,
                    ],
                    "argon2 generation problem"
                );
                done();
            });
    }
);

var githubTlsDefaultPasswordArgon2 = "k)C7G3!Sfi-xLH(Z";

QUnit.test(
    "generate for https://github.com with 'default-password'",
    function (assert) {
        var done = assert.async();
        // Given
        var algoParams = {
            algorithm: "argon2",
            locationSalt: "https://github.com",
            difficulty: undefined,
            masterPassword: "default-password",
            userSalt: undefined,
            argon2AsmPath: "../node_modules/argon2-browser/dist",
        };
        // When
        UniquePasswordBuilder.generate(
            algoParams,
            function (generatedPassword) {
                // Then
                assert.equal(
                    generatedPassword,
                    githubTlsDefaultPasswordArgon2,
                    "generate problem"
                );
                assert.equal(
                    generatedPassword.length,
                    16,
                    "generate length problem"
                );
                done();
            },
            undefined
        );
    }
);

var githubTlsDefaultPassword1RoundArgon2 = "wWgcR#Tw6%dY!:9A";

QUnit.test(
    "generate for https://github.com with 'default-password' for 2 round",
    function (assert) {
        var done = assert.async();
        // Given
        var algoParams = {
            algorithm: "argon2",
            locationSalt: "https://github.com",
            difficulty: 2,
            masterPassword: "default-password",
            userSalt: 0,
            argon2AsmPath: "../node_modules/argon2-browser/dist",
        };
        // When
        UniquePasswordBuilder.generate(
            algoParams,
            function (generatedPassword) {
                // Then
                assert.equal(
                    generatedPassword,
                    githubTlsDefaultPassword1RoundArgon2,
                    "generate problem"
                );
                assert.notEqual(
                    githubTlsDefaultPasswordArgon2,
                    githubTlsDefaultPassword1RoundArgon2,
                    "same password than a single round"
                );
                done();
            },
            undefined
        );
    }
);

var githubDefaultPasswordArgon2 = "YFklD_W!aUF#[S,m";

QUnit.test(
    "generate for http://github.com with 'default-password'",
    function (assert) {
        var done = assert.async();
        // Given
        var algoParams = {
            algorithm: "argon2",
            locationSalt: "http://github.com",
            difficulty: undefined,
            masterPassword: "default-password",
            userSalt: 0,
            argon2AsmPath: "../node_modules/argon2-browser/dist",
        };
        // When
        UniquePasswordBuilder.generate(
            algoParams,
            function (generatedPassword) {
                // Then
                assert.equal(
                    generatedPassword,
                    githubDefaultPasswordArgon2,
                    "generate problem"
                );
                assert.notEqual(
                    generatedPassword,
                    githubTlsDefaultPasswordArgon2,
                    "same password without protocol"
                );
                done();
            },
            undefined
        );
    }
);

var googleTlsDefaultPasswordArgon2 = "G..P)tCuVT;-$D]w";

QUnit.test(
    "generate for https://www.google.com with 'default-password'",
    function (assert) {
        var done = assert.async();
        // Given
        var algoParams = {
            algorithm: "argon2",
            locationSalt: "https://www.google.com",
            difficulty: undefined,
            masterPassword: "default-password",
            userSalt: 0,
            argon2AsmPath: "../node_modules/argon2-browser/dist",
        };
        // When
        UniquePasswordBuilder.generate(
            algoParams,
            function (generatedPassword) {
                // Then
                assert.equal(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2,
                    "generate problem"
                );
                assert.notEqual(
                    generatedPassword,
                    githubDefaultPasswordArgon2,
                    "same password than github"
                );
                assert.notEqual(
                    generatedPassword,
                    githubTlsDefaultPasswordArgon2,
                    "same password than github"
                );
                done();
            },
            undefined
        );
    }
);

var googleTlsDefaultPassword2Argon2 = "D23k0ge-zTS!o7ug";

QUnit.test(
    "generate for https://www.google.com with 'default-password2'",
    function (assert) {
        var done = assert.async();
        // Given
        var algoParams = {
            algorithm: "argon2",
            locationSalt: "https://www.google.com",
            difficulty: undefined,
            masterPassword: "default-password2",
            userSalt: 0,
            argon2AsmPath: "../node_modules/argon2-browser/dist",
        };
        // When
        UniquePasswordBuilder.generate(
            algoParams,
            function (generatedPassword) {
                // Then
                assert.equal(
                    generatedPassword,
                    googleTlsDefaultPassword2Argon2,
                    "generate problem"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    githubDefaultPasswordArgon2,
                    "same password than github"
                );
                assert.notEqual(
                    generatedPassword,
                    githubTlsDefaultPasswordArgon2,
                    "same password than github"
                );
                done();
            },
            undefined
        );
    }
);

var googleTlsDefaultPasswordArgon2Difficulty15 = "qFEI2U6EV!&:Ye:t";

QUnit.test(
    "generate for https://www.google.com with 'default-password' with 15 rounds",
    function (assert) {
        var done = assert.async();
        // Given
        var algoParams = {
            algorithm: "argon2",
            locationSalt: "https://www.google.com",
            difficulty: 15,
            masterPassword: "default-password",
            userSalt: 0,
            argon2AsmPath: "../node_modules/argon2-browser/dist",
        };
        // When
        UniquePasswordBuilder.generate(
            algoParams,
            function (generatedPassword) {
                // Then
                assert.equal(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2Difficulty15,
                    "generate problem"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPassword2Argon2,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    githubDefaultPasswordArgon2,
                    "same password than github"
                );
                assert.notEqual(
                    generatedPassword,
                    githubTlsDefaultPasswordArgon2,
                    "same password than github"
                );
                done();
            },
            undefined
        );
    }
);

var googleTlsDefaultPasswordArgon2Difficulty20 = "ZXbOyr&_kU($+jUf";

QUnit.test(
    "generate for https://www.google.com with 'default-password' with 20 rounds",
    function (assert) {
        var done = assert.async();
        // Given
        var algoParams = {
            algorithm: "argon2",
            locationSalt: "https://www.google.com",
            difficulty: 20,
            masterPassword: "default-password",
            userSalt: 0,
            argon2AsmPath: "../node_modules/argon2-browser/dist",
        };
        // When
        UniquePasswordBuilder.generate(
            algoParams,
            function (generatedPassword) {
                // Then
                assert.equal(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2Difficulty20,
                    "generate problem"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2Difficulty15,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPassword2Argon2,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    githubDefaultPasswordArgon2,
                    "same password than github"
                );
                assert.notEqual(
                    generatedPassword,
                    githubTlsDefaultPasswordArgon2,
                    "same password than github"
                );
                done();
            },
            undefined
        );
    }
);

var googleTlsDefaultPasswordArgon2OldKeyIndex1 = "XN6NkzaKD9LHSkr8";

QUnit.test(
    "generate for https://www.google.com with 'default-password' with keyIndex 1",
    function (assert) {
        var done = assert.async();
        // Given
        var algoParams = {
            algorithm: "argon2",
            locationSalt: "https://www.google.com",
            difficulty: undefined,
            masterPassword: "default-password",
            userSalt: 1,
            argon2AsmPath: "../node_modules/argon2-browser/dist",
        };
        // When
        UniquePasswordBuilder.generate(
            algoParams,
            function (generatedPassword) {
                // Then
                assert.equal(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2OldKeyIndex1,
                    "generate problem"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2Difficulty15,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPassword2Argon2,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2Difficulty20,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    githubDefaultPasswordArgon2,
                    "same password than github"
                );
                assert.notEqual(
                    generatedPassword,
                    githubTlsDefaultPasswordArgon2,
                    "same password than github"
                );
                done();
            },
            undefined
        );
    }
);

var googleTlsDefaultPasswordArgon2OldKeyIndex2 = "W:]rdccUEH:Ynvox";

QUnit.test(
    "generate for https://www.google.com with 'default-password' with keyIndex 2",
    function (assert) {
        var done = assert.async();
        // Given
        var algoParams = {
            algorithm: "argon2",
            locationSalt: "https://www.google.com",
            difficulty: undefined,
            masterPassword: "default-password",
            userSalt: 2,
            argon2AsmPath: "../node_modules/argon2-browser/dist",
        };
        // When
        UniquePasswordBuilder.generate(
            algoParams,
            function (generatedPassword) {
                // Then
                assert.equal(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2OldKeyIndex2,
                    "generate problem"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2Difficulty15,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPassword2Argon2,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2Difficulty20,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2OldKeyIndex1,
                    "same password than google"
                );
                assert.notEqual(
                    generatedPassword,
                    githubDefaultPasswordArgon2,
                    "same password than github"
                );
                assert.notEqual(
                    generatedPassword,
                    githubTlsDefaultPasswordArgon2,
                    "same password than github"
                );
                done();
            },
            undefined
        );
    }
);

var googleTlsDefaultPasswordArgon2UserSaltSomething = "9L(d9nP$;H=df!Of";

QUnit.test(
    "generate for https://www.google.com with 'default-password' with userSalt something",
    function (assert) {
        var done = assert.async();
        // Given
        var algoParams = {
            algorithm: "argon2",
            locationSalt: "https://www.google.com",
            difficulty: undefined,
            masterPassword: "default-password",
            userSalt: "something",
            argon2AsmPath: "../node_modules/argon2-browser/dist",
        };
        // When
        UniquePasswordBuilder.generate(
            algoParams,
            function (generatedPassword) {
                // Then
                assert.equal(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2UserSaltSomething,
                    "generate problem"
                );
                assert.notEqual(
                    generatedPassword,
                    googleTlsDefaultPasswordArgon2OldKeyIndex1,
                    "same password than google"
                );
                done();
            },
            undefined
        );
    }
);
