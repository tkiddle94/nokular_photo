import React from 'react';
import { IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader } from '@ionic/react';
import './CompetitionCard.scss';

interface ICompetitionCardProps {
    title: string;
    subTitle: string;
    imgSrc: string;
    onCardClicked: any;
}

export class CompetitionCard extends React.Component<ICompetitionCardProps> {

    render() {
        return <IonCard class="focus" onClick={() => this.props.onCardClicked()}>
            <img src={this.props.imgSrc} />
            <IonCardHeader>
                <IonCardTitle class="force-white">{this.props.title}</IonCardTitle>
                <IonCardSubtitle class="force-white">{this.props.subTitle}</IonCardSubtitle>
            </IonCardHeader>
        </IonCard>;
    }
}
