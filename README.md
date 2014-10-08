(Unofficial) Gigya RaaS Toolkit
==================

The following commands are available:
```
node export-policies
node export-schema
node export-screensets

node import-policies
node import-schema
node import-screensets

node copy-policies
node copy-schema
node copy-screensets
```

Export and import commands take the following parameters:
```
--apiKey YOUR_KEY_HERE
--secret YOUR_SECRET_HERE
--filename FILENAME_TO_EXPORT_TO
```

For example: ```node export-policies --apiKey 123 --secret 321 --filename policies.json```

Copy commands take the following parameters:
```
--fromApiKey SOURCE_KEY_HERE
--fromSecret SOURCE_SECRET_HERE
--toApiKey DESTINATION_KEY_HERE
--toSecret DESTINATION_SECRET_HERE
```

For example: ```node copy-screensets --fromApiKey 123 --fromSecret 321 --toApiKey 890 --toSecret 098```
