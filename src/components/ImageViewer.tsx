import React from 'react';
import { IonPage, IonIcon } from '@ionic/react';
import { close } from 'ionicons/icons';

import './ImageViewer.scss';

interface IImageViewerProps {
    imgSrc: string | undefined;
    close: any
}

export class ImageViewer extends React.Component<IImageViewerProps> {

    render() {
        return <IonPage className="dark-page">
            <IonIcon className="image-view-close" size="large" icon={close} onClick={() => this.props.close()} />
            <div className="full-size-image-container">
                <img src={this.props.imgSrc} />
            </div>
        </IonPage>;
    }
}
