import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import React, { useState } from 'react';
import { CompetitionCard } from '../components/CompetitionCard';
import { ImageUploader } from '../components/ImageUploader';
import './Home.scss';
import uniqid from 'uniqid';
import { getQueriedDocuments } from '../firebaseConfig';
import { ICompetition, ICompetitionMode } from '../interfaces';
const Home: React.FC = () => {

  const [competitions, setCompetitions] = useState<ICompetition[] | undefined>(undefined);
  const [competitionMode, setCompetitionMode] = useState<string | undefined>('live');

  React.useEffect(() => {
    console.log('uniq:', uniqid());
    loadCompetitions();
  }, [])

  React.useEffect(() => {
    loadCompetitions();
  }, [competitionMode])

  function getCompetitionMode(competition: ICompetition): ICompetitionMode {
    if (competition.live) {
      return ICompetitionMode.live;
    } else if (competition.upcoming) {
      return ICompetitionMode.upcoming;
    } else {
      return ICompetitionMode.archived;
    }
  }
  function loadCompetitions() {
    if (competitionMode) {
      getQueriedDocuments('competitions', competitionMode).then((competitionData) => {
        if (competitionData?.length > 0) {
          setCompetitions(competitionData as ICompetition[]);
        }
      });
    }
  }

  function renderCompetitionCards(competition: ICompetition) {
    return <CompetitionCard
      title={competition.title}
      imgSrc={competition.imgSrc}
      description={competition.description}
      competitionMode={getCompetitionMode(competition)}
      startDate={competition.startDate}
      endDate={competition.endDate}
      onCardClicked={() => console.log('card clicked')}></CompetitionCard>
  }
  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle >Compete</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
        <IonSegment value={competitionMode} onIonChange={(ev) => setCompetitionMode(ev.detail.value)}>
          <IonSegmentButton value="live">
            <IonLabel>Live</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="upcoming">
            <IonLabel>Upcoming</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="archived">
            <IonLabel>Past</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {competitions?.map((competition) => renderCompetitionCards(competition))}
        <ImageUploader></ImageUploader>
      </IonContent>
    </IonPage>
  );
};

export default Home;
