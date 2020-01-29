// This is a temporary file for tests.
// TODO(mskwon1): Remove this file after queries are implemented & used.

// Sample schedule list for test.
const SAMPLE_SCHEDULES = [
  {
    id: 1,
    startTime:'January 15th 09:00',
    endTime:'Januray 15th 12:00',
    address: '31 El Camino',
  },
  {
    id: 2,
    startTime:'January 15th 13:00',
    endTime:'Januray 15th 15:00',
    address: '31 El Camino',
  },
  {
    id: 3,
    startTime:'January 15th 16:00',
    endTime:'Januray 15th 18:00',
    address: '31 El Camino',
  },
]

module.exports = {
  // Sample events list for test.
  SAMPLE_EVENTS : [
    {
      id:1,
      title: 'Summary of Human History',
      bookTitle: 'Sapiens',
      bookAuthor: 'Yuval Harari',
      thumbnailUrl: 'sapiens.png',
      schedule: SAMPLE_SCHEDULES,
      reviews: {
        title: 'Sapiens is best',
        content: 'actually its not'
      }
    },
    {
      id:2,
      title: 'Nothing of Human History',
      bookTitle: 'Sapiens',
      bookAuthor: 'Yuval Harari',
      thumbnailUrl: 'sapiens.png',
      schedule: SAMPLE_SCHEDULES,
      reviews: undefined
    }
  ]
}