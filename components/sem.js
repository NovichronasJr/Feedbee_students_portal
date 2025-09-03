'use client';

import { useEffect } from 'react';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useSemester } from '../context/SemesterContext';  // Import context

const semesters = [
  { value: "1", label: "Semester 1" },
  { value: "2", label: "Semester 2" },
  { value: "3", label: "Semester 3" },
  { value: "4", label: "Semester 4" },
  { value: "5", label: "Semester 5" },
  { value: "6", label: "Semester 6" },
  { value: "7", label: "Semester 7" },
  { value: "8", label: "Semester 8" }
  
];

export default function Sem() {
  const { selectedSemester, setSelectedSemester } = useSemester(); // Use context

  useEffect(() => {
    if (!selectedSemester.value) {
      setSelectedSemester({value:"undefined",label:"select semester"}); // Default selection
    }
  }, [selectedSemester.value]);

  // Handle selection change and update context
  const handleSelectionChange = (semester) => {
    setSelectedSemester(semester);
  };

  return (
    <Listbox value={selectedSemester} onChange={handleSelectionChange}>
      <label>Enter Semester</label>
      <div className="relative mt-2">
        <ListboxButton className="grid w-full cursor-pointer grid-cols-1 rounded-md bg-zinc-800 py-2 pr-2 pl-3 text-left text-white outline-1 outline-gray-700 focus:outline-2 focus:outline-indigo-500 sm:text-sm">
          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
            <span className="block truncate">{selectedSemester.label}</span>
          </span>
          <ChevronUpDownIcon
            aria-hidden="true"
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-300 sm:size-4"
          />
        </ListboxButton>

        <ListboxOptions
          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-zinc-900 py-1 text-base ring-1 shadow-lg ring-white/10 focus:outline-none sm:text-sm"
        >
          {semesters.map((sem) => (
            <ListboxOption
              key={sem.value}
              value={sem}
              className="group relative cursor-pointer py-2 pr-9 pl-3 text-white select-none focus:bg-indigo-700 focus:text-white"
            >
              <div className="flex items-center">
                <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">{sem.label}</span>
              </div>

              {selectedSemester.value === sem.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-400 group-focus:text-white">
                  <CheckIcon aria-hidden="true" className="size-5" />
                </span>
              )}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
}
