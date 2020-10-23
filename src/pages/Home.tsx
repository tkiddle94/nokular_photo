import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/react';
import React from 'react';
import { CompetitionCard } from '../components/CompetitionCard';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle >Compete</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
        <IonSegment>
          <IonSegmentButton value="live">
            <IonLabel>Live</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="upcoming">
            <IonLabel>Upcoming</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="past">
            <IonLabel>Past</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        <CompetitionCard
          title="General"
          imgSrc="assets/birds_2.jpg"
          subTitle="Open to all and every photo from your birdwatching"
          onCardClicked={() => console.log('card clicked')}></CompetitionCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
