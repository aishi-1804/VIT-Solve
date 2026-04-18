import React, { createContext, useState } from 'react';

export const DoubtContext = createContext();

export const DoubtProvider = ({ children }) => {
  const currentUser = {
    name: 'Aishi',
    email: 'aishi.adhikari@vitstudent.ac.in',
  };

  const [doubts, setDoubts] = useState([
    {
      id: '1',
      // NOW USING FULL COURSE NAME
      course: 'CSE2011 - Data Structures and Algorithms', 
      title: 'How does Merge Sort actually work?',
      description: 'I am confused about the recursion steps.',
      author: 'aishi.adhikari@vitstudent.ac.in', 
      date: new Date('2025-12-12T09:00:00').toISOString(),
      isSolved: false,
    },
    {
      id: '2',
      course: 'PHY1001 - Engineering Physics',
      title: 'Thermodynamics Entropy',
      description: 'Why does entropy always increase?',
      author: 'rahul@vitstudent.ac.in',
      date: new Date('2025-12-10T14:00:00').toISOString(),
      isSolved: true,
    },
    {
      id: '3',
      course: 'MAT2001 - Linear Algebra',
      title: 'Eigenvalues calculation',
      description: 'I keep getting the determinant wrong.',
      author: 'rohit@vitstudent.ac.in',
      date: new Date('2025-12-14T10:00:00').toISOString(),
      isSolved: false,
    }
  ]);

  const addDoubt = (newDoubt) => {
    setDoubts((prev) => [newDoubt, ...prev]);
  };

  const toggleDoubtStatus = (id) => {
    setDoubts(prev => prev.map(d => 
      d.id === id ? { ...d, isSolved: !d.isSolved } : d
    ));
  };

  return (
    <DoubtContext.Provider value={{ doubts, currentUser, addDoubt, toggleDoubtStatus }}>
      {children}
    </DoubtContext.Provider>
  );
};
