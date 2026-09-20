const Route = require("../models/route");

const searchDirectRoutes = async (
    fromStopId,
    toStopId,
    cityId
) => {
    const routes = await Route.find({
        isActive: true,
        city: cityId,
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
const searchOneTransferRoutes = async (
    fromStopId,
    toStopId,
    cityId
) => {
    const routes = await Route.find({
        isActive: true,
        city: cityId
    })
        .populate("city", "name slug")
        .populate("stops.stop", "name nameUrdu location");

    const results = [];

    // Find routes that contain the starting stop
    const startingRoutes = routes.filter((route) =>
        route.stops.some(
            (item) =>
                item.stop &&
                item.stop._id &&
                item.stop._id.toString() === fromStopId
        )
    );

    // Find routes that contain the destination stop
    const destinationRoutes = routes.filter((route) =>
        route.stops.some(
            (item) =>
                item.stop &&
                item.stop._id &&
                item.stop._id.toString() === toStopId
        )
    );

    for (const firstRoute of startingRoutes) {
        const fromIndex = firstRoute.stops.findIndex(
            (item) =>
                item.stop &&
                item.stop._id &&
                item.stop._id.toString() === fromStopId
        );
        if (fromIndex === -1) {
            continue;
        }

        // Check every stop after the starting stop
        for (let i = fromIndex + 1; i < firstRoute.stops.length; i++) {
            const transferStop = firstRoute.stops[i].stop;

            // Find a second route containing the transfer stop
            // and destination
            for (const secondRoute of destinationRoutes) {
                if (firstRoute._id.toString() === secondRoute._id.toString()) {
                    continue;
                }

                const transferIndex = secondRoute.stops.findIndex(
                    (item) =>
                        item.stop &&
                        item.stop._id &&
                        item.stop._id.toString() ===
                        transferStop._id.toString()
                );

                const destinationIndex = secondRoute.stops.findIndex(
                    (item) =>
                        item.stop &&
                        item.stop._id &&
                        item.stop._id.toString() === toStopId
                );

                if (
                    transferIndex === -1 ||
                    destinationIndex === -1
                ) {
                    continue;
                }

                // The second bus must travel from
                // transfer stop -> destination
                if (transferIndex >= destinationIndex) {
                    continue;
                }

                const firstJourneyStops = firstRoute.stops.slice(
                    fromIndex,
                    i + 1
                );

                const secondJourneyStops = secondRoute.stops.slice(
                    transferIndex,
                    destinationIndex + 1
                );

                const formatStops = (journeyStops) => {
                    return journeyStops
                        .filter((item) => item.stop)
                        .map((item) => ({
                            id: item.stop._id,
                            name: item.stop.name,
                            nameUrdu: item.stop.nameUrdu,
                            sequence: item.sequence
                        }));
                };

                results.push({
                    type: "one-transfer",

                    transferStop: {
                        id: transferStop._id,
                        name: transferStop.name,
                        nameUrdu: transferStop.nameUrdu
                    },

                    journey: [
                        {
                            routeId: firstRoute._id,
                            routeName: firstRoute.name,
                            routeNumber: firstRoute.routeNumber,

                            from: firstJourneyStops[0]?.stop?.name,

                            to: firstJourneyStops[
                                firstJourneyStops.length - 1
                            ]?.stop?.name,

                            stops: formatStops(firstJourneyStops)
                        },

                        {
                            routeId: secondRoute._id,
                            routeName: secondRoute.name,
                            routeNumber: secondRoute.routeNumber,

                            from: secondJourneyStops[0]?.stop?.name,

                            to: secondJourneyStops[
                                secondJourneyStops.length - 1
                            ]?.stop?.name,

                            stops: formatStops(secondJourneyStops)
                        }
                    ]
                });
            }
        }
    }

    return results;
};
module.exports = {
    searchDirectRoutes,
    searchOneTransferRoutes
};