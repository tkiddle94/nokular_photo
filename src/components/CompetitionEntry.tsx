import React from 'react';
import { IonAlert, IonLoading, IonPage, IonLabel, IonInput, IonTextarea, IonButton, IonIcon, IonHeader, IonToolbar, IonThumbnail, IonTitle, IonContent } from '@ionic/react';
import { close, imageOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { storage, getQueriedDocuments, writeToCollection } from '../firebaseConfig'
import { ICompetitionEntry } from '../interfaces';
import uniqid from 'uniqid';
import './CompetitionEntry.scss';

interface ICompetitionEntryProps {
    userRef: string | undefined;
    competitionRef: string | undefined;
    startDate: string | undefined;
    close: any;
}

export class CompetitionEntry extends React.Component<ICompetitionEntryProps> {

    private image: any;
    private url: string;
    private fileButton: HTMLInputElement;
    private imageEl: HTMLImageElement;
    private reader = new FileReader();
    private titleIcon: HTMLIonIconElement;
    private descriptionIcon: HTMLIonIconElement;
    private title: string;
    private description: string;
    private isLoading: boolean = false;
    private userName: string;
    private errorMessage: string;
    private showSubmissionComplete: boolean = false;

    get isFormValid(): boolean {
        return this.image !== undefined && this.image !== null && this.title?.length > 0 && this.description?.length > 0;
    }

    componentDidMount() {
        if (this.props.userRef) {
            console.log('user data', this.props.userRef);
            getQueriedDocuments('users', 'id', this.props.userRef).then((userData) => {
                this.userName = userData[0].userName;
                console.log('user name', this.userName, userData)
            });
        }
    }

    onFileChanged(ev: any) {
        if (ev.target.files[0]) {
            this.image = ev.target.files[0];
            console.log('image', this.image);
            this.reader.onload = (e) => {
                if (typeof e.target?.result === 'string') {
                    this.imageEl.src = e.target?.result;
                }
            }

            this.reader.readAsDataURL(this.image);
            this.forceUpdate();
        }
    }

    onSelectImage() {
        this.fileButton.click();
    }

    saveNewEntry() {
        if (this.props.competitionRef && this.props.userRef) {
            const id = uniqid();
            const newEntry: ICompetitionEntry = {
                id,
                competitionRef: this.props.competitionRef,
                title: this.title,
                description: this.description,
                imgSrc: this.url,
                userName: this.userName,
                userRef: this.props.userRef
            }
            writeToCollection('competitionEntries', id, newEntry).then((ret) => {
                if (ret === true) {
                    this.isLoading = false;
                    this.showSubmissionComplete = true;
                    this.forceUpdate();
                } else if (ret) {
                    this.isLoading = false;
                    this.errorMessage = ret;
                    this.forceUpdate();
                }
            });
        }
    }

    onUploadImage() {
        this.isLoading = true;
        this.forceUpdate();
        const uploadTask = storage.ref(`images/${this.image.name}`).put(this.image);
        uploadTask.on('state_changed',
            (_snapshot) => {
            },
            (error) => {
                this.isLoading = false;
                this.errorMessage = error.message;
                this.forceUpdate();
            },
            () => {
                storage.ref('images').child(this.image.name).getDownloadURL().then((url) => {
                    this.url = url;
                    this.saveNewEntry();
                });
            });
    }

    onAttributeChanged(value: string, attr: string) {
        if (attr === 'title') {
            this.title = value;
            this.titleIcon.setAttribute('style', `display: ${value ? 'block' : 'none'};`);
        } else if (attr === 'description') {
            this.description = value;
            this.descriptionIcon.setAttribute('style', `display: ${value ? 'block' : 'none'};`);
        }
        this.forceUpdate();
    }

    renderImageUploader() {
        return <div className="image-uploader">
            <IonLabel>Image</IonLabel>
            {!this.image && <div className="no-image">
                <IonIcon size="large" icon={imageOutline} />
            </div>}
            <input ref={(el) => this.fileButton = el as HTMLInputElement} type="file" onChange={(ev) => this.onFileChanged(ev)} />
            <div className="preview-image-container">
                <img ref={(el) => this.imageEl = el as HTMLImageElement} />
            </div>
            <div className="button-row">
                <div className="button-container">
                    <IonButton onClick={() => this.onSelectImage()}>{this.image ? 'Change Image' : 'Select Image'}</IonButton>
                </div>
            </div>
        </div>;
    }

    render() {
        return <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonThumbnail class="centered" slot="start" onClick={() => this.props.close()}>
                        <IonIcon size="large" icon={close} />
                    </IonThumbnail>
                    <IonTitle>New Entry</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {this.renderImageUploader()}
                <div className="new-entry-form">
                    <div className="padding-container">
                        <IonLabel>Title</IonLabel>
                        <div className="row">
                            <IonInput placeholder="Enter here..." type="text" onIonChange={(ev) => this.onAttributeChanged(ev.detail.value as string, 'title')} />
                            <IonIcon className="hide" size="large" icon={checkmarkCircleOutline} ref={(el) => this.titleIcon = el as HTMLIonIconElement} />
                        </div>
                    </div>
                    <div className="padding-container">
                        <IonLabel>Description</IonLabel>
                        <div className="row">
                            <IonTextarea placeholder="Enter here..." onIonChange={(ev) => this.onAttributeChanged(ev.detail.value as string, 'description')} rows={3} />
                            <IonIcon className="hide" size="large" icon={checkmarkCircleOutline} ref={(el) => this.descriptionIcon = el as HTMLIonIconElement} />
                        </div>
                    </div>
                    <div className="button-container">
                        <IonButton disabled={!this.isFormValid} onClick={() => this.onUploadImage()}>Submit Entry</IonButton>
                    </div>
                </div>
                <IonLoading
                    isOpen={this.isLoading}
                    message={'Submitting your entry...'}
                    keyboardClose={true}
                />
                <IonAlert
                    isOpen={this.errorMessage?.length > 0}
                    onDidDismiss={() => this.errorMessage = ''}
                    header={'Error'}
                    message={this.errorMessage}
                    buttons={['Okay']}
                />
                <IonAlert
                    isOpen={this.showSubmissionComplete}
                    onDidDismiss={() => this.props.close()}
                    header={'Congratulations'}
                    message={`Your entry has been submitted, come back on ${this.props.startDate} to get voting!`}
                    buttons={['Okay']}
                />
            </IonContent>
        </IonPage>;
    }
}
