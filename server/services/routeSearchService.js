const Route = require("../models/route");

/*
|--------------------------------------------------------------------------
| Helper: Get the position of a stop inside a route
|--------------------------------------------------------------------------
*/

const getStopIndex = (route, stopId) => {
    return route.stops.findIndex(
        (item) =>
            item.stop &&
            item.stop._id.toString() === stopId.toString()
    );
};

/*
|--------------------------------------------------------------------------
| Helper: Check whether a route can travel from A to B
|--------------------------------------------------------------------------
*/

const canTravelBetween = (
    route,
    fromStop,
    toStop
) => {
    const fromIndex = getStopIndex(
        route,
        fromStop
    );

    const toIndex = getStopIndex(
        route,
        toStop
    );

    return (
        fromIndex !== -1 &&
        toIndex !== -1 &&
        fromIndex < toIndex
    );
};

/*
|--------------------------------------------------------------------------
| Helper: Get stops between two points
|--------------------------------------------------------------------------
*/

const getJourneyStops = (
    route,
    fromStop,
    toStop
) => {
    const fromIndex = getStopIndex(
        route,
        fromStop
    );

    const toIndex = getStopIndex(
        route,
        toStop
    );

    if (
        fromIndex === -1 ||
        toIndex === -1 ||
        fromIndex > toIndex
    ) {
        return [];
    }

    return route.stops
        .slice(fromIndex, toIndex + 1)
        .map((item) => ({
            ...item.stop,
            travelTime: item.travelTime || 0
        }))
        .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| Helper: Calculate journey travel time
|--------------------------------------------------------------------------
|
| travelTime means:
|
| NIPA -> Hasan Square = 15
| Hasan Square -> Civic Centre = 10
|
| Therefore:
|
| NIPA -> Civic Centre = 15 + 10 = 25
|
| The first stop is NOT counted because it is
| the starting point of the journey.
|
|--------------------------------------------------------------------------
*/

const getJourneyTime = (stops) => {
    if (!stops || stops.length < 2) {
        return 0;
    }

    return stops
        .slice(1)
        .reduce(
            (total, stop) =>
                total + (Number(stop.travelTime) || 0),
            0
        );
};

/*
|--------------------------------------------------------------------------
| Load routes for a city
|--------------------------------------------------------------------------
*/

const getCityRoutes = async (cityId) => {
    return Route.find({
        city: cityId,
        isActive: true
    })
        .populate(
            "stops.stop",
            "name nameUrdu location landmarks"
        )
        .sort({
            routeNumber: 1
        })
        .lean();
};

/*
|--------------------------------------------------------------------------
| Direct Routes
|--------------------------------------------------------------------------
*/

const searchDirectRoutes = async (
    fromStop,
    toStop,
    cityId
) => {
    const routes = await getCityRoutes(cityId);

    const results = [];

    for (const route of routes) {
        if (
            !canTravelBetween(
                route,
                fromStop,
                toStop
            )
        ) {
            continue;
        }

        const journeyStops = getJourneyStops(
            route,
            fromStop,
            toStop
        );

        if (journeyStops.length < 2) {
            continue;
        }

        const travelTime =
            getJourneyTime(journeyStops);

        results.push({
            routeId: route._id,
            routeNumber: route.routeNumber,
            routeName: route.name,

            startPoint: route.startPoint,
            endPoint: route.endPoint,

            fromStop,
            toStop,

            stops: journeyStops,

            stopCount:
                journeyStops.length,

            travelTime
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Shorter journeys first
    |--------------------------------------------------------------------------
    */

    results.sort(
        (a, b) =>
            a.stopCount - b.stopCount
    );

    return results;
};

/*
|--------------------------------------------------------------------------
| One-Transfer Routes
|--------------------------------------------------------------------------
*/

const searchOneTransferRoutes = async (
    fromStop,
    toStop,
    cityId
) => {
    const routes = await getCityRoutes(cityId);

    const results = [];

    /*
    |--------------------------------------------------------------------------
    | Find every possible first route
    |--------------------------------------------------------------------------
    */

    for (const firstRoute of routes) {
        const fromIndex = getStopIndex(
            firstRoute,
            fromStop
        );

        if (fromIndex === -1) {
            continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Transfer stop must be after starting stop
        |--------------------------------------------------------------------------
        */

        const possibleTransferStops =
            firstRoute.stops
                .slice(fromIndex + 1)
                .filter(
                    (item) => item.stop
                );

        for (const transferItem of possibleTransferStops) {
            const transferStop =
                transferItem.stop;

            const transferStopId =
                transferStop._id.toString();

            /*
            |--------------------------------------------------------------------------
            | Don't transfer at destination
            |--------------------------------------------------------------------------
            */

            if (
                transferStopId ===
                toStop.toString()
            ) {
                continue;
            }

            /*
            |--------------------------------------------------------------------------
            | Find second route
            |--------------------------------------------------------------------------
            */

            for (const secondRoute of routes) {
                /*
                |--------------------------------------------------------------------------
                | Don't use the same route twice
                |--------------------------------------------------------------------------
                */

                if (
                    firstRoute._id.toString() ===
                    secondRoute._id.toString()
                ) {
                    continue;
                }

                if (
                    !canTravelBetween(
                        secondRoute,
                        transferStopId,
                        toStop
                    )
                ) {
                    continue;
                }

                const firstJourneyStops =
                    getJourneyStops(
                        firstRoute,
                        fromStop,
                        transferStopId
                    );

                const secondJourneyStops =
                    getJourneyStops(
                        secondRoute,
                        transferStopId,
                        toStop
                    );

                if (
                    firstJourneyStops.length < 2 ||
                    secondJourneyStops.length < 2
                ) {
                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Calculate travel time for each bus
                |--------------------------------------------------------------------------
                */

                const firstTravelTime =
                    getJourneyTime(
                        firstJourneyStops
                    );

                const secondTravelTime =
                    getJourneyTime(
                        secondJourneyStops
                    );

                const totalTravelTime =
                    firstTravelTime +
                    secondTravelTime;

                /*
                |--------------------------------------------------------------------------
                | Unique journey key
                |--------------------------------------------------------------------------
                */

                const journeyKey = [
                    firstRoute._id.toString(),
                    secondRoute._id.toString(),
                    transferStopId
                ].join("-");

                const alreadyExists =
                    results.some(
                        (result) =>
                            result.journeyKey ===
                            journeyKey
                    );

                if (alreadyExists) {
                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Create result
                |--------------------------------------------------------------------------
                */

                results.push({
                    journeyKey,

                    type: "one-transfer",

                    journey: [
                        {
                            routeId:
                                firstRoute._id,

                            routeNumber:
                                firstRoute.routeNumber,

                            routeName:
                                firstRoute.name,

                            startPoint:
                                firstRoute.startPoint,

                            endPoint:
                                firstRoute.endPoint,

                            stops:
                                firstJourneyStops,

                            travelTime:
                                firstTravelTime
                        },

                        {
                            routeId:
                                secondRoute._id,

                            routeNumber:
                                secondRoute.routeNumber,

                            routeName:
                                secondRoute.name,

                            startPoint:
                                secondRoute.startPoint,

                            endPoint:
                                secondRoute.endPoint,

                            stops:
                                secondJourneyStops,

                            travelTime:
                                secondTravelTime
                        }
                    ],

                    fromStop,

                    transferStop,

                    toStop,

                    totalStops:
                        firstJourneyStops.length +
                        secondJourneyStops.length -
                        1,

                    totalTravelTime
                });
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Remove internal helper property
    |--------------------------------------------------------------------------
    */

    const cleanResults = results.map(
        (result) => {
            const {
                journeyKey,
                ...cleanResult
            } = result;

            return cleanResult;
        }
    );

    /*
    |--------------------------------------------------------------------------
    | Shorter journeys first
    |--------------------------------------------------------------------------
    */

    cleanResults.sort(
        (a, b) =>
            a.totalStops -
            b.totalStops
    );

    return cleanResults;
};

/*
|--------------------------------------------------------------------------
| Exports
|--------------------------------------------------------------------------
*/

module.exports = {
    searchDirectRoutes,
    searchOneTransferRoutes
};