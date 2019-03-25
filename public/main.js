const form = document.getElementById('vote-form');

//form event
form.addEventListener('submit', e => {
  const choice = document.querySelector('input[name=os]:checked').value;
  const data = { os: choice };

  fetch('http://localhost:3000/poll', {
    method: 'post',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

  e.preventDefault();
});

fetch('http://localhost:3000/poll')
  .then(res => res.json())
  .then(data => {
    const votes = data.votes;
    const totalVotes = votes.length;
    // count the vote points - accumelator/currentValue
    const voteCounts = votes.reduce(
      (acc, vote) => (
        (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc
      ),
      {}
    );

    let dataPoints = [
      { label: 'React', y: voteCounts.React },
      { label: 'Angular', y: voteCounts.Angular },
      { label: 'Vue', y: voteCounts.Vue },
      { label: 'Meteor', y: voteCounts.Meteor }
    ];

    const charContainer = document.querySelector('#chartContainer');

    if (charContainer) {
      const chart = new CanvasJS.Chart('chartContainer', {
        animationsEnabled: true,
        theme: 'theme1',
        title: {
          text: 'Turn Up Results'
        },
        data: [
          {
            type: 'column',
            dataPoints: dataPoints
          }
        ]
      });
      chart.render();

      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true;

      var pusher = new Pusher('ed0e7d30722b39bd2721', {
        cluster: 'ap2',
        encrypted: true
      });

      var channel = pusher.subscribe('os-poll');
      channel.bind('os-vote', function(data) {
        dataPoints = dataPoints.map(x => {
          if (x.label == data.os) {
            x.y += data.points;
            return x;
          } else {
            return x;
          }
        });
        chart.render();
      });
    }
  });
