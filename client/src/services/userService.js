import { CURRENT_USER } from '../GqlQueries';

export default (useQuery, useEffect, setUser) => {
  const { loading: userLoading, error: userError, data: userData } = useQuery(CURRENT_USER);

  useEffect(() => {
    if (!userLoading) {
      if (userError !== undefined) {
        // eslint-disable-next-line no-console
        console.log('error:', userError);
      } else {
        setUser(userData.currentUser);
      }
    }
  }, [userLoading, setUser, userError]); // eslint-disable-line
};
