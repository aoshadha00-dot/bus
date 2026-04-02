const getTimetable = (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      {
        id: 1,
        busName: "Bus 101",
        route: "Colombo - Negombo",
        departureTime: "08:00 AM",
        arrivalTime: "09:30 AM"
      }
    ]
  });
};

module.exports = { getTimetable };