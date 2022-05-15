"""
    Title: rachwalik-user-service.py
    Author: David Rachwalik
    Date: 2022/05/15
    Description: User services for WEB-335
"""

import datetime
import pprint

from pymongo.mongo_client import MongoClient

client = MongoClient('localhost', 27017)
db = client.web335
employee_id = "0000008"

# create user
user = {
    "first_name": "Claude",
    "last_name": "Debussy",
    "email": "cdebussy@me.com",
    "employee_id": employee_id,
    "date_created": datetime.datetime.utcnow()
}
user_id = db.users.insert_one(user).inserted_id

# output the auto-generated user_id
print(user_id)

# query user
pprint.pprint(db.users.find_one({"employee_id": employee_id}))
