import { useRef, useState } from "react";

type SWTMutationProps<SWTOutputType, SWTInputType> = {
  onSuccess: (res: SWTOutputType | null) => void;
  onError?: (error: any) => void;
  mutationFn: (input: SWTInputType) => Promise<SWTOutputType | null>;
};

const useSWTMutation = <SWTOutputType, SWTInputType = void>({
  mutationFn,
  onSuccess,
  onError,
}: SWTMutationProps<SWTOutputType, SWTInputType>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitLoading, setIsInitLoading] = useState<boolean>(false);
  const [input, setInput] = useState<SWTInputType | null>(null);
  const [output, setOutput] = useState<SWTOutputType | null>(null);
  const isLoaded = useRef<boolean>(false);

  const mutation = async (input: SWTInputType) => {
    setIsLoading(true);
    if (!isLoaded.current) setIsInitLoading(true);

    try {
      const response = await mutationFn(input);
      setOutput(response);
      setInput(input);
      if (onSuccess) onSuccess(response);
    } catch (error) {
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
      if (!isLoaded.current) {
        setIsInitLoading(false);
        isLoaded.current = true;
      }
    }
  };

  return {
    mutation,
    isLoading,
    isInitLoading,
    input,
    data: output,
  };
};

export default useSWTMutation;