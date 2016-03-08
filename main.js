(function () {
    var vid = document.querySelector('#video');

    var config = {
        0: {
            stuckProbability: 0.01
        },
        1: {
            stuckProbability: 0.05
        }
    };

    var videoMonitor = function (loopStepSize) {
        vid.play();

        var startTime = Date.now();
        var videoDuration;
        var flipping = false;
        var playIteration = 0;
        var currentTime = 0;

        var setUp = function () {
            videoDuration = vid.duration;

            vid.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
                playIteration++;
                console.log(playIteration);
            }, false);


        };

        var flipFrames = function (startTime, endTime, timeBetween, flipDuration, endCallback) {
            var beganAt = Date.now();
            var onStartFrame = true;


            var doTheFlippin = function () {
                if (Date.now() - beganAt > flipDuration) {
                    endCallback();
                    return;
                }

                if (onStartFrame) {
                    vid.currentTime = endTime;
                    onStartFrame = false;
                } else {
                    vid.currentTime = startTime;
                    onStartFrame = true;
                }

                setTimeout(doTheFlippin, 100)
            };

            doTheFlippin();
        };


        var mainAsyncLoop = function () {
            var probability = 0;

            // get config properties
            if (config.hasOwnProperty(playIteration)) {
                console.log(playIteration, config[playIteration]);
                probability = config[playIteration].stuckProbability;
            }

            // get percent through video
            //var position = vid.currentTime / videoDuration;
            //console.log(position);

            if (!flipping) {
                var randNum = Math.random();
                console.log(randNum, probability);
                if (randNum < probability) {
                    vid.pause();
                    flipping = true;
                    currentTime = vid.currentTime;

                    position = vid.currentTime / videoDuration;

                    // flip frames for a certain amount of time, then set
                    var flipBetween = [currentTime - 1, currentTime - 0.5];
                    var timeBetween = Math.random() * 50 + 50;
                    var timeToFlip = Math.random() * 900 + 100;
                    flipFrames(flipBetween[0], flipBetween[1], timeBetween, timeToFlip, function () {
                        flipping = false;
                        vid.play();
                    })
                } else {
                    console.log("skip flipportunity");
                }
            } else {
                console.log("continue playing");
            }

            setTimeout(mainAsyncLoop, loopStepSize);
        };

        var tearDown = function () {

        };

        setUp();
        mainAsyncLoop();
        tearDown();
    };

    var didStartPlaying = false;
    vid.oncanplaythrough = function () {
        if (!didStartPlaying) {
            didStartPlaying = true;
            videoMonitor(100);
        }
    };

})();