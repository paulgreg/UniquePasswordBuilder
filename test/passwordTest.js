var fireEvent = function (element, event) {
    if (document.createEvent) {
        // dispatch for firefox + others
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(event, true, true); // event type,bubbling,cancelable
        return !element.dispatchEvent(evt);
    } else {
        // dispatch for IE
        var evt = document.createEventObject();
        return element.fireEvent("on" + event, evt);
    }
};

QUnit.module("Password conformance checking");

QUnit.test("should not be empty", function (assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword("");

    // Then
    assert.equal(result.success, false);
    assert.equal(result.message, "Please type a strong password");
    assert.equal(result.error, false);
});

QUnit.test("should contains lower-case characters", function (assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword("E");

    // Then
    assert.equal(result.success, false);
    assert.equal(result.message, "Password needs lower-case characters");
    assert.equal(result.error, true);
});

QUnit.test("should contains upper-case characters", function (assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword("e");

    // Then
    assert.equal(result.success, false);
    assert.equal(result.message, "Password needs upper-case characters");
    assert.equal(result.error, true);
});

QUnit.test("should contains numerical characters", function (assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword("Ee");

    // Then
    assert.equal(result.success, false);
    assert.equal(result.message, "Password needs numerical characters");
    assert.equal(result.error, true);
});

QUnit.test("should contains at least 8 characters", function (assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword("Ee4");

    // Then
    assert.equal(result.success, false);
    assert.equal(result.message, "Password should be at least 8 characters");
    assert.equal(result.error, true);
});

QUnit.test("should be ok", function (assert) {
    // Given
    // When
    var result = UniquePasswordBuilder.verifyPassword("l2E456t8");

    // Then
    assert.equal(result.success, true);
    assert.equal(result.error, false);
});

QUnit.module("generate");

QUnit.test("should not allow empty master password", function (assert) {
    assert.throws(function () {
        // Given
        var algoParams = {
            algorithm: "scrypt",
            locationSalt: "https://github.com",
            difficulty: 2,
            masterPassword: undefined,
            userSalt: "",
        };
        // When
        UniquePasswordBuilder.generate(algoParams);
    }, "should fail");
});

QUnit.module("makeHashHumanReadable");

QUnit.test("should transform hex to string", function (assert) {
    // Given
    // When
    var generatedPassword = UniquePasswordBuilder.makeHashHumanReadable([
        150, 168, 201, 232, 17, 182, 150, 77, 43, 138, 240, 5, 167, 144, 209,
        44, 167, 162, 175, 120, 6, 135, 20, 43, 243, 35, 171, 236, 51, 45, 61,
        20, 248, 45, 226, 120, 244, 136, 105, 47, 154, 208, 89, 244, 223, 172,
        87, 147, 64, 192, 141, 66, 244, 67, 255, 226, 122, 141, 38, 103, 86, 46,
        17, 20,
    ]);

    // Then
    assert.ok(
        generatedPassword,
        "(.K_xz491A]!5e[U",
        "makeHashHumanReadble transformation problem"
    );
});

QUnit.module("getSaltOnLocation");

QUnit.test("should get protocol and host on standard URL", function (assert) {
    var r = UniquePasswordBuilder.getSaltOnLocation(
        "https://github.com/paulgreg/UniquePasswordBuilder"
    );
    assert.equal(r, "https://github.com");
});

QUnit.test("should return string that are not an URL", function (assert) {
    var r = UniquePasswordBuilder.getSaltOnLocation("someApp");
    assert.equal(r, "someApp");
});

QUnit.test("should return string for `about` pages", function (assert) {
    var r = UniquePasswordBuilder.getSaltOnLocation("about:debugging#addons");
    assert.equal(r, "about:debugging#addons"); // before #eef3ca9, it was about:debugging#addons//undefined (yes, it was bugged)
});
