import React, { useState } from 'react';
import { IonModal, IonContent, IonPage, IonInput, IonButton, IonToast } from '@ionic/react';
import './Login.scss';
import { loginUser, isUserLoggedIn } from '../firebaseConfig';
import { useHistory } from "react-router-dom";
import { RegisterUser } from '../components/RegisterUser';

const Login: React.FC = () => {
    let emailInput: HTMLIonInputElement;
    let passwordInput: HTMLIonInputElement;
    let loginButton: HTMLIonButtonElement;
    let errorMessage: string = 'Wrong email or password please try again.';
    const [showToast, setShowToast] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();

    React.useEffect(() => {
        isUserLoggedIn().then((ret) => {
            if (ret) {
                history.push('/homePage');
            } 
        });
        setTimeout(() => {
            isUserLoggedIn().then((ret) => {
                if (ret) {
                    history.push('/homePage');
                } 
            });
        }, 1000);
    }, [])

    function onLogin() {
        const email = emailInput.value;
        const password = passwordInput.value;
        loginUser(email as string, password as string).then((ret) => {
            if (ret === 'accepted') {
                history.push('/homePage');
            } else {
                setShowToast(true);
            }
        });
    }

    function validateLoginButton() {
        const email = emailInput.value as string;
        const password = passwordInput.value as string;
        const isDisabled = !(email && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) && password?.length > 5);
        loginButton.disabled = isDisabled;
        loginButton.color = isDisabled ? 'secondary' : 'primary';

    }

    function newUserRegistered() {
        history.push('/homePage');
    }

    return (
        <IonPage>
            <IonContent>
                <div className="outer-form">
                    <div className="header-container">
                        <img src="assets/nokular_logo.svg"/>
                    </div>
                    <div className="login-form">
                        <div className="padding-container-login">
                            <IonInput ref={(el) => emailInput = el as HTMLIonInputElement} placeholder="Email" type="email" onIonChange={() => validateLoginButton()} />
                        </div>
                        <div className="padding-container-login">
                            <IonInput ref={(el) => passwordInput = el as HTMLIonInputElement} placeholder="Password" type="password" onIonChange={() => validateLoginButton()} />
                        </div>
                        <div className="padding-container-login">
                            <IonButton expand="full" shape="round" onClick={() => onLogin()} disabled={true} color="secondary" ref={(el) => loginButton = el as HTMLIonButtonElement}>
                                Login
                            </IonButton>
                        </div>
                    </div>
                    <IonButton expand="full" fill="clear" color="tertiary" onClick={() => setShowModal(true)}>
                        Don't have an account? Register here
                </IonButton>
                </div>
                <IonModal
                    isOpen={showModal}
                    swipeToClose={true}
                    onDidDismiss={() => setShowModal(false)}
                >
                    <RegisterUser
                        onUserRegistered={() => newUserRegistered()}
                        close={() => setShowModal(false)}
                    />
                </IonModal>
                <IonToast
                    // ref={(el) => toastElement = el as HTMLIonToastElement}
                    position="top"
                    color="secondary"
                    isOpen={showToast}
                    message={errorMessage}
                    onDidDismiss={() => setShowToast(false)}
                    duration={2000}
                />
            </IonContent>
        </IonPage>
    );
};

export default Login;
