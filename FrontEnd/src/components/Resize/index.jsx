import { useEffect } from "react";
export default function Resize() {
    useEffect(() => {
        const handleResize = () => {

            if (window.innerWidth <= 800) {
                console.log("dat kich thuoc <= 800px!");
            }
        }
        window.addEventListener("resize", handleResize);
        console.log("da add event resize!");

        return () => {
            window.removeEventListener("resize", handleResize);
            console.log("da remove event resize");
        }
    },
        []
    );
    return (
        <>
            <h3>resize cua so nho hon 800px de xem console</h3>
        </>
    )
}