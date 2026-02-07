// Calculate hourly rate from worker's daily wage and work hours
export const calculateHourlyRate = (worker) => {
  const startParts = worker.workStartTime.split(':');
  const endParts = worker.workEndTime.split(':');
  const startMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]);
  const endMinutes = parseInt(endParts[0]) * 60 + parseInt(endParts[1]);
  const standardHours = (endMinutes - startMinutes) / 60;
  return standardHours > 0 ? worker.dailyWage / standardHours : 0;
};

// Calculate overtime pay (1x rate)
export const calculateOvertimePay = (worker, overtimeHours) => {
  const hourlyRate = calculateHourlyRate(worker);
  return overtimeHours * hourlyRate;
};

export const calculateWorkerMonthlySalary = (worker, attendanceRecords, holidays = [], pendingAdvances = []) => {
  const workerRecords = attendanceRecords.filter(r => r.workerId === worker.id);
  const presentDays = workerRecords.filter(r => r.status === 'present').length;
  const baseSalary = presentDays * worker.dailyWage;

  // Calculate overtime
  const totalOvertimeHours = workerRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
  const overtimePay = calculateOvertimePay(worker, totalOvertimeHours);

  // Calculate advance deduction
  const advanceDeduction = pendingAdvances.reduce((sum, adv) => sum + adv.amount, 0);

  const grossSalary = baseSalary + overtimePay;
  const netSalary = grossSalary - advanceDeduction;

  return {
    presentDays,
    baseSalary,
    overtimeHours: totalOvertimeHours,
    overtimePay,
    grossSalary,
    advanceDeduction,
    netSalary,
    totalSalary: netSalary, // For backward compatibility
  };
};

export const calculateMonthlyStats = (workers, attendanceRecords, holidays = [], year, month) => {
  const activeWorkers = workers.filter(w => w.status === 'active');

  let totalBaseSalary = 0;
  let totalOvertimePay = 0;
  let totalPresentDays = 0;
  let totalOvertimeHours = 0;

  activeWorkers.forEach(worker => {
    const result = calculateWorkerMonthlySalary(worker, attendanceRecords, holidays);
    totalPresentDays += result.presentDays;
    totalBaseSalary += result.baseSalary;
    totalOvertimePay += result.overtimePay;
    totalOvertimeHours += result.overtimeHours;
  });

  return {
    totalWorkers: activeWorkers.length,
    totalPresentDays,
    totalBaseSalary,
    totalOvertimePay,
    totalOvertimeHours,
    totalSalary: totalBaseSalary + totalOvertimePay,
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
  const totalOvertimeHours = dayRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);

  return { present, absent, leave, total: dayRecords.length, totalOvertimeHours };
};

export const getWorkerStats = (worker, attendanceRecords) => {
  const workerRecords = attendanceRecords.filter(r => r.workerId === worker.id);
  const present = workerRecords.filter(r => r.status === 'present').length;
  const absent = workerRecords.filter(r => r.status === 'absent').length;
  const leave = workerRecords.filter(r => r.status === 'leave').length;
  const totalOvertimeHours = workerRecords.reduce((sum, r) => sum + (r.overtimeHours || 0), 0);
  const overtimePay = calculateOvertimePay(worker, totalOvertimeHours);

  return {
    present,
    absent,
    leave,
    totalDays: workerRecords.length,
    overtimeHours: totalOvertimeHours,
    overtimePay,
    totalEarnings: (present * worker.dailyWage) + overtimePay,
    attendancePercentage: workerRecords.length > 0
      ? ((present / workerRecords.length) * 100).toFixed(1)
      : 0,
  };
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
