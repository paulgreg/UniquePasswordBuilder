(function(upb) {

    var form = document.createElement("form");
    form.setAttribute('style', 'position:absolute;top:10px;right:10px;border:1px solid black;padding:10px 10px 8px 10px;background-color:white;font-size:12px;z-index:10000000;');
    //Salt
    var saltInput = document.createElement("input");
    saltInput.id = 'uniquePasswordBuilderSalt';
    saltInput.setAttribute('type', 'text');
    saltInput.setAttribute('style', 'border:1px solid black;');
    saltInput.value = window.uniquePasswordBuilderKeyIndex || window.salt
    var saltLabel = document.createElement("label");
    saltLabel.setAttribute("for", "uniquePasswordBuilderSalt");
    saltLabel.textContent = "Salt : "
    saltLabel.setAttribute('style', 'display:inline-block;');

    //Master password
    var passwordInput = document.createElement("input");
    passwordInput.id = 'uniquePasswordBuilderPassword';
    passwordInput.setAttribute('type', 'password');
    passwordInput.setAttribute('style', 'border:1px solid black;');
    var passwordLabel = document.createElement("label");
    passwordLabel.setAttribute("for", "uniquePasswordBuilderPassword");
    passwordLabel.textContent = "Master password : "
    passwordLabel.setAttribute('style', 'display:inline-block;margin-left:5px;');

    form.appendChild(saltLabel);
    form.appendChild(saltInput);
    form.appendChild(passwordLabel);
    form.appendChild(passwordInput);
    document.body.appendChild(form);

    var passwordEntered = function(e) {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        var algorithm = window.uniquePasswordBuilderAlgorithm || 'scrypt';
        var argon2AsmPath = window.argon2AsmPath;
        var noLog = window.noLog !== false;
        upb.generate(algorithm, window.location, window.uniquePasswordBuilderDifficulty || window.uniquePasswordBuilderRounds, passwordInput.value, saltInput.value, function(generatedPassword) {
            upb.insertGenerateActions(generatedPassword);
            passwordInput.remove();
            passwordLabel.remove();
            saltInput.remove();
            saltLabel.remove();
            form.remove();
        }, noLog, {argon2AsmPath: argon2AsmPath});
    }

    //Managing press on 'Enter' because the form is no more submited
    //due to the presence of 2 fields, now...
    passwordInput.addEventListener('keypress', function(event) {
        if (event.keyCode == 13) {
            passwordEntered(event);
        }
    });

})(window.UniquePasswordBuilder = window.UniquePasswordBuilder || {});
