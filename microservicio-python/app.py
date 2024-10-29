from flask import Flask, jsonif, request
from flask_mysqldb import MySQL

app = Flask(__name__)
mysql = MYSQL(app)