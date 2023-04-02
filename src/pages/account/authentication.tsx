import { Auth0Client } from "@/utils/auth0.util";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo } from "react";

export default function Authentication() {
    const router = useRouter()
    const query = useMemo(() => {
        const queryString = router.asPath.split('#')[1] || '';
        let query: any = {};
        queryString?.split('&').forEach((keyAndVal: string) => {
          const data: string[] = keyAndVal.split('=');
          query[data[0]] = data[1];
        });
    
        if ((queryString && typeof query?.access_token === 'undefined') || !query) {
          router.push('/account/signin');
        } else {
          return query;
        }
      }, [router,]);


      const signInWithGoogle = useCallback(() => {
        Auth0Client.authorize({
          connection: 'google-oauth2',
          redirectUri: window.location.href + '?type=signin',
          responseType: 'token',
        });
      }, []);

      const signUpWithGoogle = useCallback(() => {
        Auth0Client.authorize({
          connection: 'google-oauth2',
          redirectUri: window.location.href + '?type=signup',
          responseType: 'token',
        });
      }, []);


      const auth0UserInfo = useCallback((access_token: string) => {
        return new Promise((resolve, rejects) => {
          Auth0Client.client.userInfo(access_token, function (err, user) {
            if (err) {
              // console.log(err);
              rejects(err);
            }
            if (user) {
              resolve(user);
            }
          });
        });
      }, []);

    useEffect(() => {
        if (query?.access_token) {
          auth0UserInfo(query?.access_token).then(data => {
            console.log(data)
            console.log(query)
            router.replace('/account/authentication')
          })
        }
      }, [query]);

    return (<>
        <main>
            <div className="flex flex-col ">
              <button onClick={signInWithGoogle} className="border ">
                  SIGN IN WITH GOOGLE 
              </button>

              <button onClick={signUpWithGoogle} className="border">
                  SIGN UP WITH GOOGLE 
              </button>
            </div>
        </main>
    </>)
}