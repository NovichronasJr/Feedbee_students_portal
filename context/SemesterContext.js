import { createContext, useContext, useState } from "react";

const SemesterContext = createContext();

export function SemesterProvider({ children }) {
  const [selectedSemester, setSelectedSemester] = useState({});

  return (
    <SemesterContext.Provider value={{ selectedSemester, setSelectedSemester }}>
      {children}
    </SemesterContext.Provider>
  );
}

export function useSemester() {
  return useContext(SemesterContext);
}