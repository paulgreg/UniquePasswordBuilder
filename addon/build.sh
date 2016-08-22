if [ -f uniquepasswordbuilder.zip ]; then
    rm uniquepasswordbuilder.zip
fi;
zip -r uniquepasswordbuilder.zip *
echo "Remember to remove clipboardWrite permissions for Firefox !";
