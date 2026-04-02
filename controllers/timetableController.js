const getTimetable = (req, res) => {
  const timetable = [
    {
      id: 1,
      busName: "Bus 101",
      route: "Colombo - Negombo",
      departureTime: "08:00 AM",
      arrivalTime: "09:30 AM"
    },
    {
      id: 2,
      busName: "Bus 202",
      route: "Negombo - Colombo",
      departureTime: "10:00 AM",
      arrivalTime: "11:30 AM"
    }
  ];

  res.status(200).json({
    success: true,
    data: timetable
  });
};

module.exports = {
  getTimetable
};