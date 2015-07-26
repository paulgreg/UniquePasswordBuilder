(function(upb) {

    upb.addLinkAction = function(link, passwordInput, generatedPassword) {
        var generateHandler = function(evt) {
            passwordInput.value = generatedPassword;
            var e = evt || window.event;
            e.cancelBubble = true;
            if (e.stopPropagation) e.stopPropagation();
        }.bind(this);
        if (link.addEventListener)
            link.addEventListener('click', generateHandler, false);
        else if (link.attachEvent)
            link.attachEvent('onclick', generateHandler);
    };

    upb.insertGenerateActions = function(generatedPassword) {
        // cleanup : remove previous link
        var allPreviousLinks = document.querySelectorAll('a.uniquePasswordBuilder');
        for(var i = 0; i < allPreviousLinks.length; i++) {
            var previousLink = allPreviousLinks[i];
            if (previousLink.parentNode) {
                previousLink.parentNode.removeChild(previousLink);
            }
        }

        var allPasswordInputs = document.querySelectorAll('input[type=password]');
        for(var i = 0; i < allPasswordInputs.length; i++) {
            var passwordInput = allPasswordInputs[i];
            link = document.createElement("a");
            link.setAttribute('class', 'uniquePasswordBuilder');
            link.setAttribute('style', 'padding:5px;cursor:pointer;');
            link.appendChild(document.createTextNode("generate password"));
            upb.addLinkAction(link, passwordInput, generatedPassword);
            passwordInput.parentNode.insertBefore(link, passwordInput.nextSibling);
        }
    };


})(window.UniquePasswordBuilder = window.UniquePasswordBuilder || {});
