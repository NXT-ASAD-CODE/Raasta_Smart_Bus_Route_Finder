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
const canTravelBetween = (route, fromStop, toStop) => {
    const fromIndex = getStopIndex(route, fromStop);
    const toIndex = getStopIndex(route, toStop);

    return (
        fromIndex !== -1 &&
        toIndex !== -1 &&
        fromIndex < toIndex
    );
};


/*
|--------------------------------------------------------------------------
| Helper: Get journey stops
|--------------------------------------------------------------------------
*/
const getJourneyStops = (route, fromStop, toStop) => {
    const fromIndex = getStopIndex(route, fromStop);
    const toIndex = getStopIndex(route, toStop);

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
| Helper: Calculate travel time between two stops
|--------------------------------------------------------------------------
|
| Example:
|
| NIPA -> Hasan Square = 15
| Hasan Square -> Civic Centre = 10
|
| Total = 25 minutes
|
|--------------------------------------------------------------------------
*/
const getTravelTime = (route, fromStop, toStop) => {
    const fromIndex = getStopIndex(route, fromStop);
    const toIndex = getStopIndex(route, toStop);

    if (
        fromIndex === -1 ||
        toIndex === -1 ||
        fromIndex >= toIndex
    ) {
        return 0;
    }

    let totalTime = 0;

    for (let i = fromIndex; i < toIndex; i++) {
        totalTime += Number(route.stops[i].travelTime || 0);
    }

    return totalTime;
};


/*
|--------------------------------------------------------------------------
| Load active routes for a city
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

        const travelTime = getTravelTime(
            route,
            fromStop,
            toStop
        );

        results.push({
            routeId: route._id,
            routeNumber: route.routeNumber,
            routeName: route.name,

            startPoint: route.startPoint,
            endPoint: route.endPoint,

            fromStop,
            toStop,

            stops: journeyStops,
            stopCount: journeyStops.length,

            travelTime,
            totalTravelTime: travelTime
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Shorter journeys first
    |--------------------------------------------------------------------------
    */
    results.sort(
        (a, b) =>
            a.travelTime - b.travelTime
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
        | Possible transfer stops
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
                | Don't use same route twice
                |--------------------------------------------------------------------------
                */
                if (
                    firstRoute._id.toString() ===
                    secondRoute._id.toString()
                ) {
                    continue;
                }


                /*
                |--------------------------------------------------------------------------
                | Check second route
                |--------------------------------------------------------------------------
                */
                if (
                    !canTravelBetween(
                        secondRoute,
                        transferStopId,
                        toStop
                    )
                ) {
                    continue;
                }


                /*
                |--------------------------------------------------------------------------
                | Get journey stops
                |--------------------------------------------------------------------------
                */
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
                | Calculate travel times
                |--------------------------------------------------------------------------
                */
                const firstTravelTime =
                    getTravelTime(
                        firstRoute,
                        fromStop,
                        transferStopId
                    );

                const secondTravelTime =
                    getTravelTime(
                        secondRoute,
                        transferStopId,
                        toStop
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
                | Create journey result
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

                    firstTravelTime,

                    secondTravelTime,

                    totalTravelTime,

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
    | Remove internal journey key
    |--------------------------------------------------------------------------
    */
    const cleanResults =
        results.map((result) => {

            const {
                journeyKey,
                ...cleanResult
            } = result;

            return cleanResult;
        });


    /*
    |--------------------------------------------------------------------------
    | Sort by total travel time
    |--------------------------------------------------------------------------
    */
    cleanResults.sort(
        (a, b) =>
            a.totalTravelTime -
            b.totalTravelTime
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