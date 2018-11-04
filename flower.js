

function createFlowerOfLife() {
    var ringSequence = [1, 6, 6, 6, 6, 6, 6]
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
            // console.log('yolo')
        }

        if(numLevels >= 7) {
            // console.log('yolo')
        }

        if(numLevels >= 8) {
            // console.log('yolo')
        }

        // console.log(circles)
        _.flatten(ringGroups).forEach((circle,j) => {
            circleData.circles.push({
                cx: circle.cx,
                cy: circle.cy,
                id: 'circle-' + j,
                angle: circle.angle,
                r: circleRadius,
                fill: 'none',
                stroke: 'red',
                strokeWidth: '2px'
            })
        })

        return circleData
    }




    var svg = d3.select("#graph")
        .append("svg")
        .attr("width", w)
        .attr("height", w);


    var data = generateCircleData(5);

    function render(data) {
        var circles = d3.select("svg")
            .append('g')
            .selectAll("circle")
            .data(data.circles)
            .enter()
            .append("circle")
            .attr("id", d => d.id)
            .attr("r", d => d.r)
            .attr("cx", d => d.cx)
            .attr("cy", d => d.cy)
            .attr("data-angle", d => d.angle)
            .attr("fill", d => d.fill)
            .attr("stroke", d => d.stroke)
            .attr("stroke-width", d => d.strokeWidth)

        circles
            .exit()
            .remove();
    }





    render(data);
}


createFlowerOfLife();
