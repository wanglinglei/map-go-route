import json from "../../common/map.json";
Page({
  data: {
    scale: "11",
    json,
    polyline: [],
    showMap: false,
    pointArr: [],
    markers: [],
    centerMap: {
      latitude: 30.577363,
      longitude: 119.938067,
    },
    defaultCenterMap: {
      latitude: 30.577363,
      longitude: 119.938067,
    },
  },
  onLoad(query) {
    // 页面加载
    let linePointWKT = this.data.json.linePointWKT;
    let lineStr = linePointWKT.replace("LINESTRING(", "").replace(")", "");
    let lineArr = lineStr.split(",");
    const pointArr = lineArr.map((item) => {
      let point = item.split(" ");
      return {
        latitude: point[1],
        longitude: point[0],
      };
    });
    this.setData({
      pointArr,
      polyline: [
        {
          points: pointArr,
          color: "#ff33ccaa",
          width: 2,
          dottedLine: false,
        },
      ],
      showMap: true,
      markers: [
        {
          iconPath: "/pages/index/images/header.jpg",
          id: 10,
          latitude: pointArr[0].latitude,
          longitude: pointArr[1].longitude,
          width: 50,
          height: 50,
        },
      ],
    });
  },

  begin() {
    const { pointArr } = this.data;
    const waitRoutePoints = pointArr.slice(0, 400);
    let pointIndex = 1;
    this.setData({
      scale: "15",
      polyline: [
        ...this.data.polyline,
        {
          points: this.data.pointArr.slice(0, 1),
          color: "#FF0000DD",
          width: 4,
          dottedLine: false,
          zIndex: 10,
        },
      ],
    });
    let timer = setInterval(() => {
      if (pointIndex < waitRoutePoints.length) {
        const { points: routePoints } = this.data.polyline[1];
        this.setData({
          centerMap: {
            latitude: waitRoutePoints[pointIndex].latitude,
            longitude: waitRoutePoints[pointIndex].longitude,
          },
          "polyline[1].points": [
            ...routePoints,
            {
              latitude: waitRoutePoints[pointIndex].latitude,
              longitude: waitRoutePoints[pointIndex].longitude,
            },
          ],
          markers: [
            {
              iconPath: "/pages/index/images/header.jpg",
              id: 10,
              latitude: waitRoutePoints[pointIndex].latitude,
              longitude: waitRoutePoints[pointIndex].longitude,
              width: 50,
              height: 50,
            },
          ],
        });
        pointIndex++;
      } else {
        this.setData({
          scale: "11",
          centerMap: { ...this.data.defaultCenterMap },
        });
        clearInterval(timer);
      }
    }, 10);
  },
  onReady(e) {},
});
