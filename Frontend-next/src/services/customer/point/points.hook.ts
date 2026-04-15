import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getPointsSummary, getPointsHistory } from "@/src/services/customer/point/point.service";
import { useAuth } from "@/src/context/AuthContext";
import { authStorage } from "@/src/@core/utils/authStorage";

export const usePoints = () => {
    const { currentUser } = useAuth();
    const token = authStorage.getToken();

    const { data: summary, isLoading: isSummaryLoading } = useFetchSWR(
        (currentUser && token) ? "/points/summary" : null,
        () => getPointsSummary()
    );

    const { data: history, isLoading: isHistoryLoading } = useFetchSWR(
        (currentUser && token) ? "/points/history" : null,
        () => getPointsHistory()
    );

    return {
        summary: summary || { total_points: 0, current_tier: "Thành viên", next_tier: "Bạc", points_to_next_tier: 1000 },
        history: history || [],
        isLoading: isSummaryLoading || isHistoryLoading,
    };
};
