import { useAppSelector } from "./useAppRedux";

const useUserData = () => {
  const userData = useAppSelector((state) => state.userData);

  if (userData === undefined) return { empty: true };
  return userData;
};

export default useUserData;
