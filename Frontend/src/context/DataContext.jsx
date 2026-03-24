import { createContext, useContext, useState } from "react";

const DataContext = createContext(null);

export const DataProvider = ({ children  }) => {
  const [file, setFile] = useState(null);

  const setFileData = (uploadedFile) => {
    setFile(uploadedFile);
  };

  return (
    <DataContext.Provider value={{ setFileData, file }}>
      {children }
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
