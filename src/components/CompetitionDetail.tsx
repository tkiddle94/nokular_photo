import React from 'react';
import { IonPage, IonHeader, IonToolbar, IonThumbnail, IonIcon, IonTitle, IonContent } from '@ionic/react';
import { close } from 'ionicons/icons';
import { getQueriedDocuments } from '../firebaseConfig';
import { ICompetitionEntry, ICompetitionMode } from '../interfaces';
import { CompetitionCard } from './CompetitionCard';
import './CompetitionDetail.scss';

interface ICompetitionDetailProps {
    title: string;
    competitionRef: string;
    close: any;
}

export class CompetitionDetail extends React.Component<ICompetitionDetailProps> {

    private competitionEntries: ICompetitionEntry[];

    componentDidMount() {
        this.loadCompetitionEntries();
    }

    loadCompetitionEntries() {
        console.log('competition entries?', this.props.competitionRef);
        getQueriedDocuments('competitionEntries', 'competitionRef', this.props.competitionRef).then((competitionEntries) => {
            console.log('competition entries?', competitionEntries);
            if (competitionEntries?.length > 0) {
                this.competitionEntries = competitionEntries;
                this.forceUpdate();
            }
        });
    }

    renderCompetitionCards(competition: ICompetitionEntry) {
        return <CompetitionCard
            key={competition.id}
            title={competition.title}
            imgSrc={competition.imgSrc}
            description={competition.description}
            competitionMode={ICompetitionMode.completed}
            onCardClicked={() => console.log('card clicked')}></CompetitionCard>
    }

    render() {
        return <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonThumbnail class="centered" slot="start" onClick={() => this.props.close()}>
                        <IonIcon size="large" icon={close} />
                    </IonThumbnail>
                    <IonTitle>{this.props.title}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {this.competitionEntries?.map((entry) => this.renderCompetitionCards(entry))}
            </IonContent>
        </IonPage>;
    }
}
