export interface ICompetition {
    id: string;
    imgSrc: string;
    title: string;
    description: string;
    live: boolean;
    upcoming: boolean;
    archived: boolean;
    startDate?: string;
    endDate?: string;
    entrantRefs?: string[];
}

export interface ICompetitionEntry {
    id: string;
    competitionRef: string;
    userRef: string;
    userName: string;
    imgSrc: string;
    title: string;
    description: string;
    voterRefs?: string[];
}

export enum ICompetitionMode {
    live = 'live',
    upcoming = 'upcoming',
    archived = 'archived',
    completed = 'completed'
}