const Route = require("../models/route");

const searchDirectRoutes = async (fromStopId, toStopId) => {
    const routes = await Route.find({
        isActive: true,
        "stops.stop": {
            $all: [fromStopId, toStopId]
        }
    })
        .populate("city", "name slug")
        .populate("stops.stop", "name nameUrdu location");

    const results = [];

    for (const route of routes) {
        const fromIndex = route.stops.findIndex(
            (item) => item.stop._id.toString() === fromStopId
        );

        const toIndex = route.stops.findIndex(
            (item) => item.stop._id.toString() === toStopId
        );

        if (fromIndex === -1 || toIndex === -1) {
            continue;
        }

        // The bus must reach the starting stop before
        // reaching the destination stop.
        if (fromIndex < toIndex) {
            const journeyStops = route.stops.slice(
                fromIndex,
                toIndex + 1
            );

            results.push({
                routeId: route._id,
                routeName: route.name,
                routeNumber: route.routeNumber,
                startPoint: route.startPoint,
                endPoint: route.endPoint,
                stops: journeyStops
            });
        }
    }

    return results;
};

module.exports = {
    searchDirectRoutes
};