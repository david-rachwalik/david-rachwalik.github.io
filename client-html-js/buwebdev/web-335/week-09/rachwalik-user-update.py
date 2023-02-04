"""
    Title: rachwalik-user-update.py
    Author: David Rachwalik
    Date: 2022/05/15
    Description: User services for WEB-335
"""

# import datetime
import pprint

from pymongo.mongo_client import MongoClient

client = MongoClient("localhost", 27017)
db = client["web335"]
employee_id = "0000008"

# update a user
db.users.update_one(
    {"employee_id": employee_id},
    {
        "$set": {
            "email": "drachwalik@my365.bellevue.edu"
        }
    }
)

# query user
findOneQuery = { "_id": 0, "email": 1, "employee_id": 1, "first_name": 1, "last_name": 1 }
pprint.pprint(db.users.find_one({"employee_id": employee_id}, findOneQuery))
