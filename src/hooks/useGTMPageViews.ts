import { useEffect } from "react";
import TagManager from "react-gtm-module";
import { useLocation } from "react-router-dom";

const useGTMPageView = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        if (!pathname.includes('admin')) {

            TagManager.dataLayer({
                dataLayer: {
                    event: 'page_view',
                    page_path: pathname
                }
            })
        }
    }, [pathname]);
}

export default useGTMPageView