export default ({ config }) => {
  return {
    ...config,
    extra: {
      // La valeur spécifique n'est pas importante ici, car elle sera remplacée par eas.json
      expoPublicApiUrl: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: "4a0169e8-08f7-4ccd-8fa0-7caebafe64b6"
      }
    },
  };
};