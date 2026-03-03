import { useEffect } from "react";
const useMyTitle = (title) => {
    useEffect(() => {
        document.title = title;
    }, [title]);
}
export default useMyTitle