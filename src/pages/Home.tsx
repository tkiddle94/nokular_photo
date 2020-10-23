import { IonContent, IonThumbnail, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonModal } from '@ionic/react';
import React, { useState } from 'react';
import { CompetitionCard } from '../components/CompetitionCard';
import { ImageUploader } from '../components/ImageUploader';
import { CompetitionDetail } from '../components/CompetitionDetail'
import './Home.scss';
import uniqid from 'uniqid';
import { getQueriedDocuments, logout } from '../firebaseConfig';
import { ICompetition, ICompetitionMode } from '../interfaces';
import { useHistory } from "react-router-dom";

const Home: React.FC = () => {

  const [competitions, setCompetitions] = useState<ICompetition[] | undefined>(undefined);
  const [competitionMode, setCompetitionMode] = useState<string | undefined>('live');
  const [showCompetitionDetail, setShowCompetitionDetail] = useState<string | undefined>(undefined);
  const history = useHistory();

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
      getQueriedDocuments('competitions', competitionMode, true).then((competitionData) => {
        if (competitionData?.length > 0) {
          setCompetitions(competitionData as ICompetition[]);
        }
      });
    }
  }

  function logOut() {
    logout().then((ret) => {
      if (ret === true) {
        history.push('/login')
      } else {
        //TODO LOGOUT ERROR;
      }
    });
  }

  function renderCompetitionCards(competition: ICompetition) {
    return <CompetitionCard
      key={competition.id}
      title={competition.title}
      imgSrc={competition.imgSrc}
      description={competition.description}
      competitionMode={getCompetitionMode(competition)}
      startDate={competition.startDate}
      endDate={competition.endDate}
      onCardClicked={() => setShowCompetitionDetail(competition.id)} />;
  }

  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle >Compete</IonTitle>
          <IonThumbnail slot="end" onClick={() => logOut()}>
            Log out
          </IonThumbnail>
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
      <IonModal
        isOpen={showCompetitionDetail !== undefined}
        swipeToClose={true}
      >
        <CompetitionDetail
          title={'Competition'}
          competitionRef={showCompetitionDetail ? showCompetitionDetail : ''}
          close={() => setShowCompetitionDetail(undefined)}
        />
      </IonModal>
    </IonPage>
  );
};

export default Home;
