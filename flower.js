const COLORS = ['purple', 'blue', 'green', 'red','orange']
// const COLORS = ['black']


function createFlowerOfLife() {
    var ringSequence = [1, 7, 19, 37, 61, 91, 127]
    var speed = 500;
    var circleRadius = 50;

    var w = window.innerWidth*0.65;
    var center = w / 2;

    var circleData = {
        numLevels: 1,
        circles: []
    };

    var extendCircles = function(circleArray, distanceToCenter) {
        return circleArray.map((circle) => {
            return {
                'cx': circle.cx + Math.sin(circle.angle) * (distanceToCenter),
                'cy': circle.cy + Math.cos(circle.angle) * (distanceToCenter),
                angle: circle.angle
            }
        })
    }

    var initialHexagonPattern = function() {
        return d3.range(0, 6, 1).map((i) => {
            var angle = i === 0 ? 0 : (i / 6) * Math.PI * 2;
            return {
                'cx': center + Math.sin(angle) * circleRadius,
                'cy': center + Math.cos(angle) * circleRadius,
                angle
            }
        })
    }

    var middlePointsArrayOfSet = function(circleSet) {
        return circleSet.map((circle, i) => {
            var nextCircle = circleSet[(i + 1) % circleSet.length]

            var cx = (circle.cx + nextCircle.cx) / 2;
            var cy = (circle.cy + nextCircle.cy) / 2;
            var angle = Math.atan2(cx - center, cy - center)

            return {cx, cy, angle}
        })
    }

    var twoMiddlePointsArrayOfSet = function(circleSet) {
        var firstArray = circleSet.map((circle, i) => {
            var nextCircle = circleSet[(i + 1) % circleSet.length]

            var cx = circle.cx * 1/3 + nextCircle.cx * 2/3;
            var cy = circle.cy * 1/3 + nextCircle.cy * 2/3;
            var angle = Math.atan2(cx - center, cy - center)

            return {cx, cy, angle}
        })

        var secondArray = circleSet.map((circle, i) => {
            var nextCircle = circleSet[(i + 1) % circleSet.length]

            var cx = circle.cx * 2/3 + nextCircle.cx * 1/3;
            var cy = circle.cy * 2/3 + nextCircle.cy * 1/3;
            var angle = Math.atan2(cx - center, cy - center)

            return {cx, cy, angle}
        })

        return [firstArray, secondArray]
    }

    var generateCircleData = function(numLevels) {
        circleData.numLevels = numLevels;

        var ringGroups = [];

        if(numLevels >= 1) {
            ringGroups.push([{cx: center, cy: center}])
        }
        if(numLevels >= 2) {
            ringGroups.push(initialHexagonPattern())
        }

        if(numLevels >= 3) {
            var extend = extendCircles(ringGroups[1], circleRadius);
            var middleOf = middlePointsArrayOfSet(extend);
            // console.log('middle', middleOf)
            ringGroups.push(_.flatten(_.unzip([extend, middleOf])))
        }

        if(numLevels >= 4) {
            var extend = extendCircles(ringGroups[1], circleRadius * 2);
            var middleTwoArrays = twoMiddlePointsArrayOfSet(extend);
            ringGroups.push(_.flatten(_.unzip([extend, middleTwoArrays[0], middleTwoArrays[1]])))
        }

        if(numLevels >= 5) {
            var extend = extendCircles(ringGroups[1], circleRadius * 3);
            var middlePoints = middlePointsArrayOfSet(extend);
            var mainPoints = _.flatten(_.unzip([extend, middlePoints]));
            var moreMiddlePoints = middlePointsArrayOfSet(mainPoints);
            ringGroups.push(_.flatten(_.unzip([mainPoints, moreMiddlePoints])))
        }

        if(numLevels >= 6) {
            // var extend = extendCircles(ringGroups[2], circleRadius * 3);
            // var middlePoints = middlePointsArrayOfSet(extend);
            // var mainPoints = _.flatten(_.unzip([extend, middlePoints]));
            // var moreMiddlePoints = middlePointsArrayOfSet(mainPoints);
            // var oneFourth = []
            // var threeFourths = []
            // moreMiddlePoints.forEach((point, i) => {
            //     if (i === 0 || i % 2 == 0) {
            //         oneFourth.push(point)
            //     } else {
            //         threeFourths.push(point)
            //     }
            // });
            // ringGroups.push(_.flatten(_.unzip([mainPoints, moreMiddlePoints])))
            // ringGroups.push(_.flatten(_.unzip([extend, oneFourth, middlePoints, threeFourths])))
            // ringGroups.push(_.flatten(_.unzip([extend])))
        }

        if(numLevels >= 7) {
            var extend = extendCircles(ringGroups[1], circleRadius * 5);
            // var middlePoints = middlePointsArrayOfSet(extend);
            // var mainPoints = _.flatten(_.unzip([extend, middlePoints]));
            // var moreMiddlePoints = middlePointsArrayOfSet(mainPoints);
            // var oneFourth = []
            // var threeFourths = []
            // moreMiddlePoints.forEach((point, i) => {
            //     if (i === 0 || i % 2 == 0) {
            //         oneFourth.push(point)
            //     } else {
            //         threeFourths.push(point)
            //     }
            // });
            // ringGroups.push(_.flatten(_.unzip([extend, oneFourth, middlePoints, threeFourths])))
            ringGroups.push(_.flatten(_.unzip([extend])))
        }

        if(numLevels >= 8) {
            // console.log('yolo')
        }

        // console.log(circles)
        var layer = 0;
        _.flatten(ringGroups).forEach((circle,j) => {
            if (j >= ringSequence[layer]) {
                layer++
            }

            circleData.circles.push({
                cx: circle.cx,
                cy: circle.cy,
                id: 'circle-' + j,
                angle: circle.angle,
                r: circleRadius,
                fill: COLORS[layer % COLORS.length],
                fillOpacity: 0.1,
                stroke: COLORS[layer % COLORS.length],
                strokeWidth: '1px'
            })
        })

        return circleData
    }




    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", w)
        .attr("height", w);


    var data = generateCircleData(6);

    function render(data) {
        var circles = d3.select("svg")
            .append('g')
            .selectAll("circle")
            .data(data.circles)
            .enter()
            .append("circle")
            .attr("id", d => d.id)
            .attr("cx", d => d.cx)
            .attr("cy", d => d.cy)
            .transition()
            .attr("r", d => d.r)
            .attr("fill", d => d.fill)
            .attr("fill-opacity", d => d.fillOpacity)
            .attr("stroke", d => d.stroke)
            .attr("stroke-width", d => d.strokeWidth)
            .duration(5000)

        // circles
            // .exit()
            // .remove();
    }





    render(data);
}


createFlowerOfLife();

