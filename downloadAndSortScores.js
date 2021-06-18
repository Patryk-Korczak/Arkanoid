fetch('http://uczelnia.secdev.pl/Testing/Download_Scores',{ method: 'GET' })
    .then(response=> response.json())
        .then(data => {
            this.topScores = data;
            this.sortedTopScores = [];
            for(let i = 0; i < this.topScores.length; i++) {
                this.sortedTopScores.push(JSON.parse(this.topScores[i].scores));
            }

        });