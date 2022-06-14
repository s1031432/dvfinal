from pandas_datareader import data as pdr
import pandas as pd
from flask import Flask
from flask_cors import CORS
import yfinance as yf
from datetime import datetime
import json, time
app = Flask(__name__)
CORS(app)
yf.pdr_override() # <== that's all it takes :-)


@app.route("/<stocknumber>")
def stock(stocknumber):
    # download dataframe
    data = pdr.get_data_yahoo(stocknumber, start="2012-01-01", end=datetime.now().strftime('%Y-%m-%d'))
    data = data.drop("Adj Close", axis=1)
    data = data.round(3)
    data.reset_index(inplace=True)
    data['Date'] = data['Date'].dt.strftime('%d-%b-%y')
    # print(data)
    return str(data.to_csv())

@app.route("/<stocknumber>/<startDate>/<endDate>")
def add(stocknumber, startDate, endDate):
    data = pdr.get_data_yahoo(stocknumber, start=startDate, end=endDate)
    data = data.drop("Adj Close", axis=1)
    data = data.round(3)
    data.reset_index(inplace=True)
    data['Date'] = data['Date'].dt.strftime('%d-%b-%y')
    return str(data.to_csv())

@app.route("/<stocknumber>/<startDate>/<endDate>/<money>")
def result(stocknumber, startDate, endDate, money):
    # download dataframe
    # startDate, endDate = startDate.replace("/", "-"), endDate.replace("/", "-")
    data = pdr.get_data_yahoo(stocknumber, start=startDate, end=endDate)
    data = data.drop("Adj Close", axis=1)
    data = data.round(3)
    data.reset_index(inplace=True)
    data['Date'] = data['Date'].dt.strftime('%d-%b-%y')
    profitList = [1.0000]
    totalProfitList = [1.0000]
    moneyList = [money]
    income = [0]
    for i in range(1, len(data)):
        profitList.append( float("{:.8f}".format(data.iloc[i]["Close"]/data.iloc[i-1]["Close"]) ) )
        totalProfitList.append( "{:.8f}".format(float(data.iloc[i]["Close"]/data.iloc[0]["Close"])) )
        moneyList.append( "{:.8f}".format( float(moneyList[len(moneyList)-1])*float( profitList[i] ) ) )
        income.append("{:.8f}".format( float(moneyList[i]) - float(moneyList[i-1]) ) )
    data["profit"] = profitList
    data["totalProfit"] = totalProfitList
    data["money"] = moneyList
    data["income"] = income
    print(data)
    return str(data.to_csv())
app.run()