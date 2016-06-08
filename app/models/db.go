package models

import(
	"gopkg.in/mgo.v2"
	"../config"
)

var(
    // MongoDB
    mongoConfig       = config.GetConfig("MongoConfig")
    MongoSession, err = mgo.Dial(mongoConfig)
    MongoDB           = MongoSession.DB(config.GetConfig("MongoDbName"))
)