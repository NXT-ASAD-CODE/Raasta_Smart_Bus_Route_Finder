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
|
| A must appear before B in the route.
|
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
        .map((item) => item.stop)
        .filter(Boolean);
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

        results.push({
            route: {
                _id: route._id,
                name: route.name,
                routeNumber: route.routeNumber,
                startPoint: route.startPoint,
                endPoint: route.endPoint
            },

            fromStop,
            toStop,

            stops: journeyStops,

            stopCount: journeyStops.length
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Sort direct routes by number of stops
    |--------------------------------------------------------------------------
    |
    | A shorter journey appears first.
    |
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
        | The transfer stop must be AFTER the starting stop.
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
            | Don't transfer at the final destination.
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
            | Find a second route:
            |
            | transfer stop -> destination
            |--------------------------------------------------------------------------
            */

            for (const secondRoute of routes) {
                /*
                |--------------------------------------------------------------------------
                | Don't use the same route twice.
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
                | Create a unique key.
                |
                | This prevents the same:
                |
                | R-01 -> R-02 at Civic Centre
                |
                | journey from appearing more than once.
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

                results.push({
                    journeyKey,

                    type: "one-transfer",

                    firstRoute: {
                        _id: firstRoute._id,
                        name: firstRoute.name,
                        routeNumber:
                            firstRoute.routeNumber,
                        startPoint:
                            firstRoute.startPoint,
                        endPoint:
                            firstRoute.endPoint
                    },

                    secondRoute: {
                        _id: secondRoute._id,
                        name: secondRoute.name,
                        routeNumber:
                            secondRoute.routeNumber,
                        startPoint:
                            secondRoute.startPoint,
                        endPoint:
                            secondRoute.endPoint
                    },

                    fromStop,

                    transferStop,

                    toStop,

                    firstJourneyStops,

                    secondJourneyStops,

                    totalStops:
                        firstJourneyStops.length +
                        secondJourneyStops.length -
                        1
                });
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Remove internal helper property before sending response.
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
    | Shorter journeys first.
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