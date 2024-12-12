import firebaseApp from '@libs/firebase';
import { getMessaging, getToken } from 'firebase/messaging';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

function useFCMToken() {

    const [token, setToken] = useState("");
    const [premission, setPremission] = useState<NotificationPermission | null>()
    const { update } = useSession()

    useEffect(() => {
        async function get() {
            Notification.requestPermission().then(async res => {
                const messeging = getMessaging(firebaseApp)
                setPremission(res)
                try {
                    if (res == "granted") {
                        const token = await getToken(messeging, {
                            vapidKey: "BLs5QZuyUjEZ22H6fR23IY0Y6X-VBewnKxeMCh-IyiJ1gIvCLexEHbPakde5xpHXTKdi6GWwFJRXYY555I6FX84"
                        });
                        if (token) {
                            setToken(token)
                            console.log(token);
                            
                            update({ FcmToken: token })
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        }

        get()
    }, [])

    return {
        token,
        premission
    }

}

export default useFCMToken
