import React from 'react';
import { IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader, IonIcon, IonButton } from '@ionic/react';
import { ICompetitionMode } from '../interfaces';
import { checkmarkCircleOutline } from 'ionicons/icons';

import './CompetitionCard.scss';

interface ICompetitionCardProps {
    title: string;
    description: string;
    imgSrc: string;
    competitionMode: ICompetitionMode;
    isEntry: boolean;
    rank?: number;
    votes?: number;
    startDate?: string;
    endDate?: string;
    userName?: string;
    hasBeenVoted?: boolean;
    votingDisabled?: boolean;
    onCardClicked: any;
    onCardVoted?: any;
}

export class CompetitionCard extends React.Component<ICompetitionCardProps> {

    render() {
        return <IonCard class={`hydrated focus ${this.props.isEntry ? 'entry' : ''} ${this.props.hasBeenVoted ? 'voted' : ''}`} onClick={() => this.props.onCardClicked()}>
            <div className="image-container">
                <img src={this.props.imgSrc} />
            </div>
            <IonCardHeader>
                <IonCardTitle class="force-white">{`${this.props.rank ? `#${this.props.rank}: ` : ''}${this.props.title}`}</IonCardTitle>
            </IonCardHeader>
            {this.props.isEntry && this.props.competitionMode === ICompetitionMode.live && <IonButton
                onClick={(ev) => {
                    ev.stopPropagation();
                    if (!this.props.hasBeenVoted) {
                        this.props.onCardVoted();
                    }
                }}
                disabled={this.props.votingDisabled}
                className="vote-button"
                color="primary">
                {this.props.hasBeenVoted ?
                    <IonIcon size="large" icon={checkmarkCircleOutline} /> :
                    'Vote'
                }
            </IonButton>
            }
            <div className="subtitle-container">
                <IonCardSubtitle>{this.props.description}</IonCardSubtitle>
                {this.props.userName && <IonCardSubtitle>{`Submitted by: ${this.props.userName}${this.props.votes ? ` - ${this.props.votes} votes` : ''}`}</IonCardSubtitle>}
                {!this.props.isEntry && this.props.competitionMode === ICompetitionMode.live &&
                    <IonCardSubtitle class="stable">{`Voting ends on ${this.props.endDate} at 5pm`}</IonCardSubtitle>
                }
                {!this.props.isEntry && this.props.competitionMode === ICompetitionMode.upcoming &&
                    <IonCardSubtitle class="stable">{`Competition starts on ${this.props.startDate} at 9am get your entries in before!`}</IonCardSubtitle>
                }
                {!this.props.isEntry && this.props.competitionMode === ICompetitionMode.archived &&
                    <IonCardSubtitle class="stable">{`This competition ran from ${this.props.startDate} - ${this.props.endDate}`}</IonCardSubtitle>
                }
            </div>
        </IonCard>;
    }
}
