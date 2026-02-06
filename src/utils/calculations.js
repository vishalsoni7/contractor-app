export const calculateWorkerMonthlySalary = (worker, attendanceRecords, holidays = []) => {
  const presentDays = attendanceRecords.filter(
    record => record.workerId === worker.id && record.status === 'present'
  ).length;

  return {
    presentDays,
    totalSalary: presentDays * worker.dailyWage,
  };
};

export const calculateMonthlyStats = (workers, attendanceRecords, holidays = [], year, month) => {
  const activeWorkers = workers.filter(w => w.status === 'active');

  let totalSalary = 0;
  let totalPresentDays = 0;

  activeWorkers.forEach(worker => {
    const { presentDays, totalSalary: workerSalary } = calculateWorkerMonthlySalary(
      worker,
      attendanceRecords,
      holidays
    );
    totalPresentDays += presentDays;
    totalSalary += workerSalary;
  });

  return {
    totalWorkers: activeWorkers.length,
    totalPresentDays,
    totalSalary,
    averageDailyAttendance: activeWorkers.length > 0
      ? (totalPresentDays / activeWorkers.length).toFixed(1)
      : 0,
  };
};

export const getDailyAttendanceStats = (attendanceRecords, date) => {
  const dayRecords = attendanceRecords.filter(r => r.date === date);
  const present = dayRecords.filter(r => r.status === 'present').length;
  const absent = dayRecords.filter(r => r.status === 'absent').length;
  const leave = dayRecords.filter(r => r.status === 'leave').length;

  return { present, absent, leave, total: dayRecords.length };
};

export const getWorkerStats = (worker, attendanceRecords) => {
  const workerRecords = attendanceRecords.filter(r => r.workerId === worker.id);
  const present = workerRecords.filter(r => r.status === 'present').length;
  const absent = workerRecords.filter(r => r.status === 'absent').length;
  const leave = workerRecords.filter(r => r.status === 'leave').length;

  return {
    present,
    absent,
    leave,
    totalDays: workerRecords.length,
    totalEarnings: present * worker.dailyWage,
    attendancePercentage: workerRecords.length > 0
      ? ((present / workerRecords.length) * 100).toFixed(1)
      : 0,
  };
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
