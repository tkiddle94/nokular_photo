export interface ICompetition {
    id: string,
    imgSrc: string,
    title: string,
    description: string,
    live: boolean,
    upcoming: boolean,
    archived: boolean,
    startDate?: string,
    endDate?: string
}

export interface ICompetitionEntry {
    id: string,
    competitionRef: string,
    userRef: string,
    imgSrc: string,
    title: string,
    description: string,
    votes: number
}

export enum ICompetitionMode {
    live = 'live',
    upcoming = 'upcoming',
    archived = 'archived',
    completed = 'completed'
}