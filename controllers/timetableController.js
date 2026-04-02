const getTimetable = (req, res) => {
  const data = [
    {
      id: 1,
      bus: "Bus 101",
      route: "Colombo - Negombo",
      time: "08:00 AM"
    }
  ];

  res.json(data);
};

module.exports = {
  getTimetable
};