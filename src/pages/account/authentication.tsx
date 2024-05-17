import HeroBg from '@/assets/images/base_img_white_bg_red_bar.png';
import Button from '@/components/Button';
import Divider from '@/components/Divider';
import Input from '@/components/Input';
import OTPInput from '@/components/Input/OTPInput';
import LoadingScreen from '@/components/Loader/LoadingScreen';
import Logo from '@/components/Logo';
import useAlert from '@/hooks/useAlert';
import {
  useCreateCustomerMutation,
  useLoginCustomerMutation,
} from '@/store/api/customerApi';
import { Auth0Client } from '@/utils/auth0.util';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { AiFillGoogleCircle, AiFillGooglePlusCircle } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';
import { bake_cookie } from 'sfcookies';
export default function Authentication() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [createCustomer, createCustomerState] = useCreateCustomerMutation();
  const [loginCustomer, loginCustomerStatus] = useLoginCustomerMutation();
  const [isOTP, setIsOTP] = useState('')
  const [inputOTP, setInputOTP] = useState('')
  const [loginToken, setLoginToken] = useState('')

  const [loginPayload, setLoginPayload] = useState({
    email: '',
    password: ''
  })

  const { execute } = useAlert()

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
  }, [router]);

  const signInWithGoogle = useCallback(() => {
    setIsLoading(true);
    localStorage.setItem('authType', 'signin');
    Auth0Client.authorize({
      connection: 'google-oauth2',
      redirectUri: window.location.href,
      responseType: 'token',
    });
  }, []);

  const signUpWithGoogle = useCallback(() => {
    setIsLoading(true);
    localStorage.setItem('authType', 'signup');
    Auth0Client.authorize({
      connection: 'google-oauth2',
      redirectUri: window.location.href,
      responseType: 'token',
    });
  }, []);

  const auth0UserInfo = useCallback((access_token: string) => {
    return new Promise((resolve, rejects) => {
      Auth0Client.client.userInfo(access_token, function (err, user) {
        if (err) {
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
      setIsLoading(true);
      const authType = localStorage.getItem('authType');
      if (authType === 'signup') {
        auth0UserInfo(query?.access_token).then((data: any) => {
          createCustomer({
            email: data.email,
            fname: data.given_name,
            lname: data.family_name,
            profileImage: data.picture,
          }).then(({ isSuccess, error }: any) => {
            if (isSuccess) {
              loginCustomer({ email: data.email }).then(
                ({ data, isSuccess, error }: any) => {
                  if (isSuccess) {
                    bake_cookie('token', data.data.token);
                    router.replace('/customer');
                  } else {
                    setIsLoading(false);
                    router.replace('/account/authentication');
                  }
                }
              );
            } else {
              setIsLoading(false);
              router.replace('/account/authentication');
            }
          });
        });
      } else {
        auth0UserInfo(query?.access_token).then((data: any) => {
          loginCustomer({ email: data.email }).then(
            ({ data, error }: any) => {
              if (data?.message === 'success') {
                bake_cookie('token', data.data.token);
                router.replace('/customer');
              } else {
                setIsLoading(false);
                alert(error?.data.message);
                router.replace('/account/authentication');
              }
            }
          );
        });
      }
    }
  }, [query]);

  // Function to handle input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginPayload({ ...loginPayload, [name]: value });
  };


  const handleLoginSubmit = async (e: any) => {
    e.preventDefault()

    loginCustomer({ email: loginPayload.email, password: loginPayload?.password }).then(
      ({ data, error }: any) => {
        if (data?.message === 'success') {
          setIsOTP(data.data.otp)
          setLoginToken(data.data.token)
          // bake_cookie('token', data.data.token);
          // router.replace('/customer');
        } else {
          setIsLoading(false);
          alert(error?.data.message);
          router.replace('/account/authentication');
        }
      }
    );
  }

  return (
    <>
      <main className="flex justify-center items-center min-h-[100vh]">
        <div className="absolute w-full h-[50vh] top-0 left-0 z-0">
          <Image
            src={
              HeroBg
            }
            fill
            alt="autosmart"
          />
        </div>
        {isLoading ? (
          <LoadingScreen
            message=""
            className="fixed top-0 h-screen z-50"
            transparent
          />
        ) : (
          <div className="flex flex-col border bg-white rounded min-w-[400px] p-5 gap-2 z-[1] shadow-lg">
            <div>
              <Logo className="w-full h-[100px]" />
            </div>
            <div className="flex gap-2 flex-col">
              {
                isOTP ? <>
                  <OTPInput length={6} onChange={(otp) => {
                    setInputOTP(otp)
                  }} />
                  <Button title="Submit" onClick={() => {
                    if (String(isOTP) === inputOTP) {
                      bake_cookie('token', loginToken);
                      router.replace('/customer');
                    } else {
                      execute({
                        message: 'Invalid code, please try again.',
                        title: 'Invalid OTP',
                        type: 'error'
                      })
                    }
                  }} buttonClass="bg-blue-900 text-white p-3 w-[100%]" />
                </> : <form className='flex flex-col gap-4' onSubmit={handleLoginSubmit}>
                  <Input onChange={handleInputChange} name="email" type="email" className="font-Jost text-blue-900" label="Email" required />
                  <Input onChange={handleInputChange} name="password" type="password" className="font-Jost text-blue-900" label="Password" required />
                  <Button title="Submit" buttonType="submit" buttonClass="bg-blue-900 text-white p-3 w-[100%]" />
                </form>
              }
              <hr />

              <Button
                icon={<AiFillGoogleCircle size={30} />}
                onClick={signInWithGoogle}
                title="SIGN IN WITH GOOGLE"
                buttonClass="border bg-green-700 text-green-100 py-3 "
              />
              <Divider label='Or' />
              <Button
                icon={<AiFillGooglePlusCircle size={30} />}
                onClick={signUpWithGoogle}
                title="SIGN UP WITH GOOGLE"
                buttonClass="border bg-green-700 text-green-100 py-3"
              />

              <Button
                icon={<FaUserCircle size={30} />}
                onClick={() => {
                  router.push('/customer/register')
                }}
                title="SIGN UP FORM"
                buttonClass="border bg-green-700 text-green-100 py-3"
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
}
