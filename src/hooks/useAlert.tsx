import { IAlertProps } from "@/components/Alert";
import { setAlert } from "@/store/reducers/componentsReducers";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "./useAppSelector";



const useAlert = () => {
    const dispatch = useDispatch()
    const alert: IAlertProps | null = useAppSelector(store => store.componentsReducers?.alert)

    const execute = (alertInfo: IAlertProps) => {
        dispatch(setAlert(alertInfo))
    }

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                dispatch(setAlert(null))
            }, alert?.interval || 5000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [alert])

    return {
        execute
    }
};

export default useAlert;
