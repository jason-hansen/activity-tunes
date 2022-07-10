import React, { useReducer, useEffect } from "react";
import AppleButton from "./AppleButton";

import SpotifyButton from "./SpotifyButton";
import StravaButton from "./StravaButton";
import UserContext from './UserContext'

const BASE_API_URL = 'http://localhost:8081';

const INITIAL_STATE = {
    athleteId: null,
    hasLoginError: false
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'stravaRequest': {
            window.location = 'https://www.strava.com/oauth/authorize?'
                + '&client_id=76589'
                + '&response_type=code'
                + '&approval_prompt=force'
                + '&scope=read,activity:read_all,activity:write'
                + '&state=asdf'
                + '&redirect_uri=' + BASE_API_URL + '/api/strava/auth';

            return {
                ...state
            }
        }
        case 'stravaResponse': {
            const { athleteId } = action.payload;
            console.log(action.payload);
            return {
                ...state,
                athleteId: athleteId
            }
        }
        case 'spotifyRequest': {
            window.location = 'https://accounts.spotify.com/authorize?'
            + '&client_id=7225d09dece944b7879335138c2d458b'
            + '&response_type=code'
            + '&scope=user-read-email+user-read-recently-played+playlist-modify-public+playlist-modify-private+playlist-read-collaborative'
            + '&state=' + state.athleteId
            + '&redirect_uri='+ BASE_API_URL + '/api/spotify/auth';

            return {
                ...state
            }
        }
        case 'spotifyResponse': {
            return {
                ...state
            }
        }

        default:
        throw new Error(`Invalid action type: ${action.type}`)
    }
}

const Buttons = () => {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE)

    const stravaClick = () => {
        dispatch({ type: 'stravaRequest' })
    }

    const spotifyClick = () => {
        dispatch({ type: 'spotifyRequest' })
    }

    const appleClick = () => {
        alert('Apple Music is not supported yet')
    }

    useEffect(() => {
        if (!state.athleteId) {
            const athleteId = (new URLSearchParams(window.location.search)).get("athlete_id");
            if (athleteId && athleteId != 'null') {
                dispatch({ type: 'stravaResponse', payload: { athleteId } });
            }
        }
    });

    const value = {
        athleteId: state.athleteId,
        stravaClick,
        spotifyClick,
        appleClick
    }

    return (
        <UserContext.Provider value={value}>
            <StravaButton></StravaButton>
            {state.athleteId && <SpotifyButton />}
            {state.athleteId && <AppleButton />}
        </UserContext.Provider>
    )
}

export default Buttons;