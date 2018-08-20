if [[ ${KEYSTORE_DOWNLOAD_URL} ]] then
        curl -L -o KEYSTORE_FILE_NAME ${KEYSTORE_DOWNLOAD_URL} else
        echo "No keystore Environment variable found"
fi
