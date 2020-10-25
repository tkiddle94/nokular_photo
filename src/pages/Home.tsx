import { IonContent, IonThumbnail, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel, IonModal } from '@ionic/react';
import React, { useState } from 'react';
import { CompetitionCard } from '../components/CompetitionCard';
import { CompetitionDetail } from '../components/CompetitionDetail'
import './Home.scss';
import { getQueriedDocuments, logout, getUid } from '../firebaseConfig';
import { ICompetition, ICompetitionMode } from '../interfaces';
import { useHistory } from "react-router-dom";
import { CompetitionEntry } from '../components/CompetitionEntry';

const Home: React.FC = () => {

  const [competitions, setCompetitions] = useState<ICompetition[] | undefined>(undefined);
  const [competitionMode, setCompetitionMode] = useState<string | undefined>('live');
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [selectedCompetition, setSelectedCompetition] = useState<ICompetition | undefined>(undefined);
  const history = useHistory();

  React.useEffect(() => {
    loadCompetitions();
    loadUserData();
  }, []);

  React.useEffect(() => {
    loadCompetitions();
  }, [competitionMode]);

  function loadUserData() {
    getUid().then((ret) => {
      if (ret) {
        setUserId(ret);
      }
    })
  }
  function getCompetitionMode(competition: ICompetition | undefined): ICompetitionMode {
    if (competition?.live) {
      return ICompetitionMode.live;
    } else if (competition?.upcoming) {
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
    const hasBeenCompleted = competition?.entrantRefs?.includes(userId || '')
    return <CompetitionCard
      key={competition.id}
      title={competition.title}
      imgSrc={competition.imgSrc}
      description={competition.description}
      competitionMode={getCompetitionMode(competition)}
      startDate={competition.startDate}
      endDate={competition.endDate}
      hasBeenCompleted={hasBeenCompleted}
      isEntry={false}
      onCardClicked={() => {
        if (!hasBeenCompleted || competitionMode !== ICompetitionMode.upcoming) {
          setSelectedCompetition(competition)
        }
      }} />;
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
      </IonContent>
      <IonModal
        isOpen={selectedCompetition !== undefined && !selectedCompetition.upcoming}
        swipeToClose={true}
      >
        <CompetitionDetail
          title={selectedCompetition?.title || ''}
          competitionRef={selectedCompetition?.id || ''}
          competitionMode={getCompetitionMode(selectedCompetition)}
          currentUserRef={userId}
          close={() => setSelectedCompetition(undefined)}
        />
      </IonModal>
      <IonModal
        isOpen={selectedCompetition !== undefined && selectedCompetition.upcoming}
        swipeToClose={true}
      >
        <CompetitionEntry
          userRef={userId}
          selectedCompetition={selectedCompetition}
          close={() => {
            setSelectedCompetition(undefined);
            loadCompetitions();
          }}
        />
      </IonModal>
    </IonPage>
  );
};

export default Home;
