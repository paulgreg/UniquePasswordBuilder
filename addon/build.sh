if [ -f uniquepasswordbuilder.zip ]; then
    rm uniquepasswordbuilder.zip
fi;
zip --exclude build.sh -r uniquepasswordbuilder.zip *
