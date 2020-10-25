import React from 'react';
import { IonAlert, IonPage, IonHeader, IonToolbar, IonThumbnail, IonIcon, IonTitle, IonContent, IonModal } from '@ionic/react';
import { close } from 'ionicons/icons';
import { getQueriedDocuments, writeToCollection } from '../firebaseConfig';
import { ICompetitionEntry, ICompetitionMode } from '../interfaces';
import { CompetitionCard } from './CompetitionCard';
import './CompetitionDetail.scss';
import { ImageViewer } from './ImageViewer';

interface ICompetitionDetailProps {
    title: string;
    competitionRef: string;
    currentUserRef: string | undefined;
    competitionMode: ICompetitionMode;
    close: any;
}

export class CompetitionDetail extends React.Component<ICompetitionDetailProps> {

    private competitionEntries: ICompetitionEntry[];
    private showImage: string | undefined;
    private showVoteAlert: ICompetitionEntry | undefined = undefined;
    private entryVotedFor: string | undefined = undefined;

    componentDidMount() {
        this.loadCompetitionEntries();
    }

    setShowImage(imgSrc: string | undefined) {
        this.showImage = imgSrc;
        this.forceUpdate();
    }

    setShowVoteAlert(competition: ICompetitionEntry | undefined) {
        this.showVoteAlert = competition;
        this.forceUpdate();
    }

    loadCompetitionEntries() {
        getQueriedDocuments('competitionEntries', 'competitionRef', this.props.competitionRef).then((competitionEntries) => {
            if (competitionEntries?.length > 0) {
                if (this.props.competitionMode === ICompetitionMode.archived) {
                    this.competitionEntries = competitionEntries.sort(function (a: ICompetitionEntry, b: ICompetitionEntry) {
                        let aVotes = a.voterRefs?.length || 0;
                        let bVotes = b.voterRefs?.length || 0;
                        return bVotes - aVotes;
                    });
                } else {
                    this.competitionEntries = competitionEntries;
                }
                if (this.props.competitionMode === ICompetitionMode.live && this.props.currentUserRef) {
                    const userRef = this.props.currentUserRef || '';
                    this.entryVotedFor = this.competitionEntries?.find((entry) => entry.voterRefs?.includes(userRef))?.id;
                }
                this.forceUpdate();
            }
        });
    }

    onEntryVoted(selectedEntryToVote: ICompetitionEntry | undefined) {
        if (selectedEntryToVote && this.props.currentUserRef) {
            let voterRefs = selectedEntryToVote?.voterRefs ? selectedEntryToVote.voterRefs : [];
            selectedEntryToVote.voterRefs = [this.props.currentUserRef, ...voterRefs];
            console.log('on entry voted', voterRefs, selectedEntryToVote);
            writeToCollection('competitionEntries', selectedEntryToVote.id, selectedEntryToVote).then((ret) => {
                if (ret === true) {
                    this.loadCompetitionEntries();
                }
            });
        }
    }

    renderCompetitionCards(competition: ICompetitionEntry, rank: number) {
        return <CompetitionCard
            key={competition.id}
            title={competition.title}
            imgSrc={competition.imgSrc}
            description={competition.description}
            userName={competition.userName}
            votes={this.props.competitionMode === ICompetitionMode.archived ? competition.voterRefs?.length : undefined}
            rank={this.props.competitionMode === ICompetitionMode.archived ? rank : undefined}
            isEntry={true}
            hasBeenCompleted={this.entryVotedFor !== undefined && competition.id === this.entryVotedFor}
            votingDisabled={this.entryVotedFor !== undefined && competition.id !== this.entryVotedFor}
            competitionMode={this.props.competitionMode}
            onCardClicked={() => this.setShowImage(competition.imgSrc)}
            onCardVoted={() => this.setShowVoteAlert(competition)}
        />
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
                {this.competitionEntries?.map((entry, index) => this.renderCompetitionCards(entry, index + 1))}
            </IonContent>
            <IonModal
                isOpen={this.showImage !== undefined}
                swipeToClose={true}
            >
                <ImageViewer
                    imgSrc={this.showImage}
                    close={() => this.setShowImage(undefined)}
                />
            </IonModal>
            <IonAlert
                isOpen={this.showVoteAlert !== undefined}
                onDidDismiss={() => this.setShowVoteAlert(undefined)}
                cssClass='my-custom-class'
                header={'Confirm vote'}
                message={`You only get one vote per competition! Are you happy with ${this.showVoteAlert?.title}?`}
                buttons={[
                    {
                        text: 'Cancel',
                        role: 'cancel',
                        handler: () => this.setShowVoteAlert(undefined)
                    },
                    {
                        text: 'Vote',
                        cssClass: 'primary',
                        handler: () => this.onEntryVoted(this.showVoteAlert)
                    }
                ]}
            />
        </IonPage>;
    }
}
