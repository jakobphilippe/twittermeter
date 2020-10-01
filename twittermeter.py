import tweepy
from textblob import TextBlob
import statistics
import mysql.connector

consumer_key = 'TWITTER CONSUMER KEY'
consumer_secret = 'TWITTER CONSUMER SECRET KEY'

access_token = 'TWITTER ACCESS TOKEN'
access_token_secret = 'ACCESS TOKEN SECRET'

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)

api = tweepy.API(auth, wait_on_rate_limit=True)

mydb = mysql.connector.connect(
  host="HOST",
  user="USERNAME",
  passwd="PASSWORD HERE",
  database="DATABASE HERE"
)

mycursor = mydb.cursor()

def FixString(s):
    return "".join((i if ord(i) < 10000 else '\ufffd' for i in s))

polarity = []
averagePolarity = []
trendCount = 0
firstTrend = ''
secondTrend = ''
thirdTrend = ''
fourthTrend = ''
fifthTrend = ''

trends = api.trends_place(23424977)
data = trends[0] 
trends = data['trends']
top_trending = [trend['name'] for trend in trends]
trendList = []

for trends in top_trending:
    trendList.append(trends)
    if trendCount == 11:
        break
    if trendCount == 0: 
        firstTrend = trends
    if trendCount == 1:
        secondTrend = trends
    if trendCount == 2:
        thirdTrend = trends
    if trendCount == 3:
        fourthTrend = trends
    if trendCount == 4:
        fifthTrend = trends
    trendCount += 1
    query = api.search(trends, lang='en')
    if len(polarity) != 0:
        polarityFinal = statistics.mean(polarity)
        averagePolarity.append(polarityFinal)
    for tweet in query:
        tweetFixed = FixString(tweet.text)
        analysis = TextBlob(tweetFixed)
        if analysis.sentiment.polarity != 0:
            polarity.append(analysis.sentiment.polarity)
        else:
            continue

polarityTrend = []

for i in range(0, 9):
    polarityTrend.append(trendList[i])
    polarityTrend.append(averagePolarity[i])
    
final = statistics.mean(averagePolarity)

sql = "INSERT INTO twittermeter (polarity, toptrending, secondtrending, thirdtrending, fourthtrending, fifthtrending) VALUES (%s, %s, %s, %s, %s, %s)"
val = (final, firstTrend, secondTrend, thirdTrend, fourthTrend, fifthTrend)
mycursor.execute(sql, val)

mydb.commit()

with open('TXT FILE TO STORE TOP TRENDING AND POLARITY DATABASE', 'a') as f:
    f.truncate(0)
    for data in polarityTrend:
        f.write(str(data) + "\n")
