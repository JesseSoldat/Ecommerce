http://localhost:5601/
http://localhost:9200

https://github.com/avadhpatel/mongoosastic
download zip here and add this folder to NPM modules because there is a bug with Elastic Search 6 not supporting String type


If you are using Elasticsearch 6.x then this is due to incompatibility issue of converting 'string' types to 'text' by default.

Take a look at this post on ES Strings are Dead... where at the end they wrote the following:

...That said, you should still look into upgrading them since we plan on removing this backward compatibility layer when we release Elasticsearch 6.0.

I've submitted a pull request to mongoosastic github repo to fix this and another bunch of incompatibility issues with this library. If you are still looking to use this library, you can add my clone repo with the fix until they fix the issues upstream.

Github repo with the fix is https://github.com/avadhpatel/mongoosastic

