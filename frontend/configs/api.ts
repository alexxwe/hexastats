export const backend = 'https://hexastats-flask.vercel.app/?players='

export const servers = ['euw', 'lan', 'las', 'na', 'kr', 'eune', 'tr', 'oce', 'ru', 'jp', 'br']

const endpoints = {
    summoner: 'summoner/v4/summoners/by-name/',
    championRotations: 'v3/champion-rotations',
    // TODO: endpoints generados por la IA, no se si funcinoan xD
    // match: 'match/',
    // matchlist: 'match/by-puuid/',
    // league: 'league/',
    // leaguePositions: 'league/positions/by-summoner/',
    // leagueEntries: 'league/entries/by-summoner/',
    // leagueEntriesByQueue: 'league/entries/by-queue/',
}

export const riot: {
    apiKey: string
    baseUrl: string
    endpoints: {
        summoner: string
        championRotations: string
    }
} = {
    apiKey: process.env.API_KEY,
    baseUrl: 'https://euw1.api.riotgames.com/lol/',
    endpoints: new Proxy(endpoints, {
        get: (target, prop) => riot.baseUrl + target[prop],
        set: () => {
            console.error('Cannot modify riot config')

            return true
        }
    }),
}
