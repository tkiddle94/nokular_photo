import React from 'react';
import { IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader } from '@ionic/react';
import { ICompetitionMode } from '../interfaces';
import './CompetitionCard.scss';

interface ICompetitionCardProps {
    title: string;
    description: string;
    imgSrc: string;
    competitionMode: ICompetitionMode;
    startDate?: string;
    endDate?: string;
    onCardClicked: any;
}

export class CompetitionCard extends React.Component<ICompetitionCardProps> {

    render() {
        return <IonCard class="focus" onClick={() => this.props.onCardClicked()}>
            <img src={this.props.imgSrc} />
            <IonCardHeader>
                <IonCardTitle class="force-white">{this.props.title}</IonCardTitle>
                <IonCardSubtitle class="force-white">{this.props.description}</IonCardSubtitle>
                {this.props.competitionMode === ICompetitionMode.live &&
                    <IonCardSubtitle class="force-white">{`Voting ends on ${this.props.endDate} at 5pm`}</IonCardSubtitle>
                }
                {this.props.competitionMode === ICompetitionMode.upcoming &&
                    <IonCardSubtitle class="force-white">{`Competition starts on ${this.props.startDate} at 9am get your entries in before!`}</IonCardSubtitle>
                }
                {this.props.competitionMode === ICompetitionMode.archived &&
                    <IonCardSubtitle class="force-white">{`This competition ran from ${this.props.startDate} - ${this.props.endDate}`}</IonCardSubtitle>
                }
            </IonCardHeader>
        </IonCard>;
    }
}
