/**
  Update Document Command
**/
UpdateCommand = function(collectionName, spec, document, options) {
  this.collectionName = collectionName;
  this.spec = spec;
  this.document = document;
  
  // Generate correct flags
  var db_upsert = options == null || options['db_upsert'] != null || options['db_upsert'] == false ? "0" : "1";
  var db_multi_update = options == null || options['db_multi_update'] != null || options['db_multi_update'] == false ? "0" : "1";
  // Flags
  this.flags = parseInt(db_multi_update + db_upsert, 2);
}

// Constants
UpdateCommand.DB_UPSERT = 0;
UpdateCommand.DB_MULTI_UPDATE = 1;

UpdateCommand.prototype = new BaseCommand();
UpdateCommand.prototype.getOpCode = function() {
  return BaseCommand.OP_UPDATE;
}

/*
struct {
    MsgHeader header;             // standard message header
    int32     ZERO;               // 0 - reserved for future use
    cstring   fullCollectionName; // "dbname.collectionname"
    int32     flags;              // bit vector. see below
    BSON      spec;               // the query to select the document
    BSON      document;           // the document data to update with or insert
}
*/
UpdateCommand.prototype.getCommand = function() {
  // Generate the command string
  var command_string = this.parser.fromInt(0) + this.parser.encode_utf8(this.collectionName) + this.parser.fromByte(0);
  return command_string + this.parser.fromInt(this.flags) + this.bson.serialize(this.spec) + this.bson.serialize(this.document);
}