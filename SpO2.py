
from __future__ import print_function
from flask import Flask, render_template, url_for
import tempfile
# for storing the images
import numpy as np
import matplotlib
matplotlib.use('Qt4Agg')
from skimage import io, color, transform
import matplotlib.pyplot as plt, mpld3
import matplotlib.pylab as pylab
import csv
import math

app = Flask(__name__)

pylab.rcParams['font.size'] = 24


def square_diag_plot():
    pylab.rcParams['figure.figsize'] = (10, 10)
    return pylab.rcParams['figure.figsize']


def rectangular_Plot():
    pylab.rcParams['figure.figsize'] = (32.0 * 2/3, 24.0 * 2/5)
    return pylab.rcParams['figure.figsize']


def toSumInt(n):
    chars = list(filter(lambda c : c != ',', n))
    x = len(chars)
    return sum([int(c)*10**(x-i) for i, c in enumerate(chars)])


def rdcsvData(file):
    rows = []
    with open(file+'.csv', 'rt') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            rows.append(row)
    # eliminate empty rows:
    rows = rows[2:len(rows)-1]
    return rows

# readoing the fitbit data
rows = rdcsvData('sleep-data/0216')
rows += rdcsvData('sleep-data/0316')
rows += rdcsvData('sleep-data/0416')

sleep_rec_dates = [row[0] for row in rows]
asleepMinutes = [toSumInt(row[1]) for row in rows]
awakeMinutes = [toSumInt(row[2]) for row in rows]
numOfAwakenings = [toSumInt(row[3]) for row in rows]
timeInBed = [toSumInt(row[4]) for row in rows]

rows = rdcsvData('activities-data/0216')
rows += rdcsvData('activities-data/0316')
rows += rdcsvData('activities-data/0416')

activity_rec_dates = [row[0] for row in rows]
caloriesBurnt = [toSumInt(row[1]) for row in rows]
steps = [toSumInt(row[2]) for row in rows]
distance = [float(row[3]) for row in rows]
floors = [toSumInt(row[4]) for row in rows]
minutesSedentary = [toSumInt(row[5]) for row in rows]
minutesLightlyActive = [toSumInt(row[6]) for row in rows]
minutesFairlyActive = [toSumInt(row[7]) for row in rows]
minutesVeryActive = [toSumInt(row[8]) for row in rows]
activeCalories = [toSumInt(row[9]) for row in rows]



def getpts(f, lower, upper, d=500):
    x = []
    y = []
    for i in range(int(lower*d), int(upper*d)):
        x.append(i/d)
        y.append(f(i/d))
    return (x, y)

def nrmlize(data):
    m = max(data)
    return [float(i)/m for i in data]

def LSmatrix(data, p):
    xVals = []
    yVals = []
    for (x, y) in data:
        xVals.append([x**n for n in range(0, p+1)])
        yVals.append([y])
    y = np.matrix(yVals)
    X = np.matrix(xVals)
    XT = X.transpose()
    return ((XT*X)**(-1))*XT*y


# plots a scatter diagram with a best fit equation of degree n
def plotBestFit(ax, x1, x2, n, col='#00ff00'):
    data = zip(x1, x2)
    c = LSmatrix(data, n)
    f = lambda x : sum([c[i]*(x**i) for i in range(0,len(c))])[0, 0]
    (y1, y2) = getpts(f, min(x1), max(x1), 2)
    ax.plot(y1, y2)
    return c


@app.route('/')
def index():
    # print (nrmlize(asleepMinutes))
    return render_template('index.html')


@app.route('/sleepBehavior')
def sleepBehavior():
    rectangular_Plot()
    fig = plt.figure()
    ax = fig.add_subplot(111)
    instances = [i for i, r in enumerate(asleepMinutes)]
    ax.plot(instances, asleepMinutes, label='Minutes asleep.')
    ax.plot(instances, awakeMinutes, label='Minutes awake.')
    ax.plot(instances, timeInBed, label='Time in bed.')
    ax.set_xlabel('Date')
    ax.set_ylabel('Minutes')
    ax.legend(loc=1)
    # plt.show()
    f = tempfile.NamedTemporaryFile(dir='static/temp', suffix='.png', delete=False)
    # save the figure to the temporary file
    plt.savefig(f)
    f.close()  # close the file
    # get the file's name
    # (the template will need that)
    plotPng = f.name.split('/')[-1]

    return render_template('figures.html', plotPng=plotPng)


@app.route('/sleepMinutes')
def sleepMinutes():
    rectangular_Plot()
    fig = plt.figure()
    ax = fig.add_subplot(111)
    instances = [i for i, r in enumerate(asleepMinutes)]
    ax.plot(instances, nrmlize(steps), label='Steps')
    ax.plot(instances, nrmlize(asleepMinutes), label='Minutes Asleep')
    ax.set_xlabel('Date')
    # ax.set_ylabel('Minutes')
    ax.legend(loc=0)
    #plt.show()
    f = tempfile.NamedTemporaryFile(dir='static/temp', suffix='.png', delete=False)
    # save the figure to the temporary file
    plt.savefig(f)
    f.close()  # close the file
    # get the file's name
    # (the template will need that)
    plotPng = f.name.split('/')[-1]
    return render_template('figures.html', plotPng=plotPng)

asleepNorm = nrmlize(asleepMinutes)
@app.route('/sleepComparison')
def sleepComparison():
    # global asleepNorm
    global awakeNorm
    awakeNorm = nrmlize(awakeMinutes)
    rectangular_Plot()
    fig = plt.figure()
    ax = fig.add_subplot(111)
    ax.scatter(asleepNorm, awakeNorm)
    plotBestFit(ax, asleepNorm, awakeNorm, 1)
    ax.set_xlabel('Time Asleep')
    ax.set_ylabel('Time Awake')
    #plt.show()
    f = tempfile.NamedTemporaryFile(dir='static/temp', suffix='.png', delete=False)
    # save the figure to the temporary file
    plt.savefig(f)
    f.close()  # close the file
    # get the file's name
    # (the template will need that)
    plotPng = f.name.split('/')[-1]
    mean = (np.mean(asleepNorm), np.mean(awakeNorm))
    cov = np.cov([asleepNorm, awakeNorm])
    print(LSmatrix(zip(asleepNorm, awakeNorm), 1))
    return render_template('figures.html', plotPng=plotPng)


stepsNorm = nrmlize(steps)
distanceNorm = nrmlize(distance)
@app.route('/fitbitStepCount')
def fitbitStepCount():
    # global stepsNorm
    # global distanceNorm
    rectangular_Plot()
    fig = plt.figure()
    ax = fig.add_subplot(111)
    ax.scatter(distanceNorm, stepsNorm)
    plotBestFit(ax, distanceNorm, stepsNorm, 1)
    ax.set_xlabel('Distance')
    ax.set_ylabel('Steps')
    # plt.show()
    f = tempfile.NamedTemporaryFile(dir='static/temp', suffix='.png', delete=False)
    # save the figure to the temporary file
    plt.savefig(f)
    f.close()  # close the file
    # get the file's name
    # (the template will need that)
    plotPng = f.name.split('/')[-1]
    print(LSmatrix(zip(distanceNorm, stepsNorm), 1))
    mean = (np.mean(distanceNorm), np.mean(stepsNorm))
    cov = np.cov([distanceNorm, stepsNorm])
    print(mean)
    print(cov)
    return render_template('figures.html', plotPng=plotPng)


@app.route('/fitbitStepCal')
def fitbitStepCal():
    diff = [y - x for (x, y) in zip(distanceNorm, stepsNorm)]
    rectangular_Plot()
    fig = plt.figure()
    ax = fig.add_subplot(111)
    ax.scatter([i for i, x in enumerate(diff)], diff)
    ax.set_xlabel('Dates')
    ax.set_ylabel('Normalised Step Distance Difference')
    # plt.xlim(0, 1.1)
    # plt.ylim(0, 1.1)
    # plt.show()
    f = tempfile.NamedTemporaryFile(dir='static/temp', suffix='.png', delete=False)
    # save the figure to the temporary file
    plt.savefig(f)
    f.close()  # close the file
    # get the file's name
    # (the template will need that)
    plotPng = f.name.split('/')[-1]
    return render_template('figures.html', plotPng=plotPng)


@app.route('/sleepVsDayActivity')
def sleepVsDayActivity():
    rectangular_Plot()
    fig = plt.figure()
    ax = fig.add_subplot(111)
    ax.scatter(asleepNorm, stepsNorm)
    # plotBestFit(ax, asleepNorm, stepsNorm, 1)
    ax.set_xlabel('Time Asleep')
    ax.set_ylabel('Steps')
    # plt.show()
    f = tempfile.NamedTemporaryFile(dir='static/temp', suffix='.png', delete=False)
    # save the figure to the temporary file
    plt.savefig(f)
    print ("Saved the figure in to temp folder")
    f.close()  # close the file
    # get the file's name
    # (the template will need that)
    plotPng = f.name.split('/')[-1]
    return render_template('figures.html', plotPng=plotPng)


if __name__ == '__main__':
    app.run(debug=True)
