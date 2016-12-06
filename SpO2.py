
from __future__ import print_function
from flask import Flask, render_template, url_for
# for python 2 compatibility #
import tempfile
#                            #
import numpy as np
import matplotlib
matplotlib.use('Qt4Agg')
from skimage import io, color, transform
import matplotlib.pyplot as plt, mpld3
from mpl_toolkits.mplot3d import Axes3D

# %matplotlib inline
# notebook
from matplotlib.colors import ListedColormap
import matplotlib.pylab as pylab
import csv
import math

app = Flask(__name__)

pylab.rcParams['font.size'] = 24


def squarePlot():
    pylab.rcParams['figure.figsize'] = (10, 10)
    return pylab.rcParams['figure.figsize']


def rectPlot():
    pylab.rcParams['figure.figsize'] = (32.0 * 2/3, 24.0 * 2/5)
    return pylab.rcParams['figure.figsize']


def toInt(n):
    chars = list(filter(lambda c : c != ',', n))
    x = len(chars)
    return sum([int(c)*10**(x-i) for i, c in enumerate(chars)])


def readData(file):
    rows = []
    with open(file+'.csv', 'rt') as csvfile:
        reader = csv.reader(csvfile)
        for row in reader:
            rows.append(row)

    # filter out non-data rows:
    rows = rows[2:len(rows)-1]
    return rows

rows = readData('sleep-data/0216')
rows += readData('sleep-data/0316')
rows += readData('sleep-data/0416')

sleepDates         = [row[0] for row in rows]
minutesAsleep      = [toInt(row[1]) for row in rows]
minutesAwake       = [toInt(row[2]) for row in rows]
numberOfAwakenings = [toInt(row[3]) for row in rows]
timeInBed          = [toInt(row[4]) for row in rows]

rows = readData('activities-data/0216')
rows += readData('activities-data/0316')
rows += readData('activities-data/0416')

activityDates        = [row[0] for row in rows]
caloriesBurned       = [toInt(row[1]) for row in rows]
steps                = [toInt(row[2]) for row in rows]
distance             = [float(row[3]) for row in rows]
floors               = [toInt(row[4]) for row in rows]
minutesSedentary     = [toInt(row[5]) for row in rows]
minutesLightlyActive = [toInt(row[6]) for row in rows]
minutesFairlyActive  = [toInt(row[7]) for row in rows]
minutesVeryActive    = [toInt(row[8]) for row in rows]
activeCalories       = [toInt(row[9]) for row in rows]



def normalise(data):
    m = max(data)
    return [float(i)/m for i in data]

def LSM(data, p):
    xVals = []
    yVals = []
    for (x, y) in data:
        xVals.append([x**n for n in range(0, p+1)])
        yVals.append([y])

    y = np.matrix(yVals)
    X = np.matrix(xVals)
    XT = X.transpose()
    return ((XT*X)**(-1))*XT*y

def evalEqn(f, lower, upper, d=500):
    x = []
    y = []
    for i in range(int(lower*d), int(upper*d)):
        x.append(i/d)
        y.append(f(i/d))
    return (x, y)

# plots a scatter diagram with a best fit equation of degree n
def plotBestFit(ax, x1, x2, n, col='#00ff00'):
    data = zip(x1, x2)
    c = LSM(data, n)
    f = lambda x : sum([c[i]*(x**i) for i in range(0,len(c))])[0, 0]
    (y1, y2) = evalEqn(f, min(x1), max(x1), 2)
    ax.plot(y1, y2)
    return c


@app.route('/')
def index():
    # print (normalise(minutesAsleep))
    return render_template('index.html')


@app.route('/sleepBehavior')
def sleepBehavior():
    rectPlot()
    fig = plt.figure()
    ax = fig.add_subplot(111)
    instances = [i for i, r in enumerate(minutesAsleep)]
    ax.plot(instances, minutesAsleep, label='Minutes asleep.')
    ax.plot(instances, minutesAwake, label='Minutes awake.')
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
    rectPlot()
    fig = plt.figure()
    ax = fig.add_subplot(111)
    instances = [i for i, r in enumerate(minutesAsleep)]
    ax.plot(instances, normalise(steps), label='Steps')
    ax.plot(instances, normalise(minutesAsleep), label='Minutes Asleep')
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

asleepNorm = normalise(minutesAsleep)
@app.route('/sleepComparison')
def sleepComparison():
    # global asleepNorm
    global awakeNorm
    awakeNorm = normalise(minutesAwake)
    rectPlot()
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
    print(LSM(zip(asleepNorm, awakeNorm), 1))
    return render_template('figures.html', plotPng=plotPng)


stepsNorm = normalise(steps)
@app.route('/fitbitStepCount')
def fitbitStepCount():
    # global stepsNorm
    global distanceNorm
    distanceNorm = normalise(distance)

    rectPlot()
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
    print(LSM(zip(distanceNorm, stepsNorm), 1))
    mean = (np.mean(distanceNorm), np.mean(stepsNorm))
    cov = np.cov([distanceNorm, stepsNorm])
    print(mean)
    print(cov)
    return render_template('figures.html', plotPng=plotPng)


@app.route('/fitbitStepCal')
def fitbitStepCal():
    diff = [y - x for (x, y) in zip(distanceNorm, stepsNorm)]
    rectPlot()
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
    rectPlot()
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
    app.debug=True
    app.run()
