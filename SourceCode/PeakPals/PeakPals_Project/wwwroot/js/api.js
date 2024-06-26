import { toggleLoadingSpinner } from "/js/ui.js";
import { displayErrorMessage } from "/js/ui.js";

export async function fetchAreas(query, loadingSpinner, validationWarning)
{
    const url = `/api/locations/search/${query}`
    console.log(url);

    const TIMEOUT = 12000;
    const timeoutPromise = new Promise((resolve, reject) => 
    {
        setTimeout(() => 
        {
            reject(new Error("Request timed out"));
        }, TIMEOUT);

    });

    let response;
    try {
        response = await Promise.race([fetch(url), timeoutPromise]);
    }
    catch (error) {
        console.error(error);
        displayErrorMessage("Request timed out. Please try again.", validationWarning);
        toggleLoadingSpinner(loadingSpinner);
        return;
    }
    
    console.log(response);
    const result = await response.json();
    console.log(result);
    const areas = result.areas;
    console.log(areas);

    if (areas === null || areas.length === 0) {
        displayErrorMessage("No results found.", validationWarning, loadingSpinner);
        return;
    }

    return areas;
}

export async function fetchClimbs(query, loadingSpinner, validationWarning)
{
    const url = `/api/locations/search/climbs/${query}`
    console.log(url);

    const TIMEOUT = 12000;
    const timeoutPromise = new Promise((resolve, reject) => 
    {
        setTimeout(() => 
        {
            reject(new Error("Request timed out"));
        }, TIMEOUT);

    });

    let response;
    try {
        response = await Promise.race([fetch(url), timeoutPromise]);
    }
    catch (error) {
        console.error(error);
        displayErrorMessage("Request timed out. Please try again.", validationWarning);
        toggleLoadingSpinner(loadingSpinner);
        return;
    }
    
    console.log(response);
    const result = await response.json();
    console.log(result);
    const areas = result.areas;
    console.log(areas);

    if (areas === null || areas.length === 0) {
        displayErrorMessage("No results found.", validationWarning, loadingSpinner);
        return;
    }

    const allClimbs = areas.flatMap(area => area.climbs);
    const matchingClimbs = allClimbs.filter(climb => climb.name.includes(query));
    console.log(matchingClimbs);

    let climbs = matchingClimbs.slice(0, 12);

    // make an api to get full climb data for each climb
    climbs = await fetchClimbData(climbs);

    return climbs;
}


export async function fetchAreaAncestors(ancestors)
{
    if (ancestors === null || ancestors.length === 0)
    {
        return [];
    }

    const ancestorsPromises = ancestors.map(async ancestor => { 
        const id = ancestor;
        const url = `/api/locations/search/area/ancestors/${id}`;
        const response = await fetch(url);
        const result = await response.json();
        return result;
    });

    const ancestorsAreas = await Promise.all(ancestorsPromises);
    console.log(ancestorsAreas);
    
    return ancestorsAreas;
}

export async function fetchClimbData(climbs)
{
    if (climbs === null || climbs.length === 0)
    {
        return [];
    }

    const climbsPromise = climbs.map(async climb => {
        const id = climb.uuid;
        const url = `/api/locations/climb/${id}`;
        const response = await fetch(url);
        const result = await response.json(); 
        console.log(result);
        return result.climb
    });
    const updatedClimbs = await Promise.all(climbsPromise);
    console.log(climbs);
    return updatedClimbs;
}