import React from 'react';
import { IonButton } from '@ionic/react';
import './ImageUploader.scss';
import { storage } from '../firebaseConfig'

export class ImageUploader extends React.Component {

    private image: any;
    private url: string;

    onFileChanged(ev: any) {
        if (ev.target.files[0]) {
            this.image = ev.target.files[0];
        }
    }

    onUploadImage() {
        const uploadTask = storage.ref(`images/${this.image.name}`).put(this.image);
        uploadTask.on('state_changed',
            (snapshot) => {
                //progress fn
            },
            (error) => {
                //error funtion
                console.log('erroror', error);
            },
            () => {
                //complete function
                storage.ref('images').child(this.image.name).getDownloadURL().then((url) => {
                    console.log('url', url);
                    this.url = url;
                });
            });
    }

    render() {
        return <div>
            <input type="file" onChange={(ev) => this.onFileChanged(ev)} />
            <IonButton onClick={() => this.onUploadImage()}>Upload</IonButton>
        </div>;
    }
}
