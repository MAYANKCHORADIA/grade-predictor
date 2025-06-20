document.getElementById('predictForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    fetch('/predict', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.getElementById('result').innerHTML = `<p style="color: red">${data.error}</p>`;
        } else {
            document.getElementById('result').innerHTML = `<h3>Your predicted grade is: ${data.grade}</h3>`;
        }
    })
    .catch(err => {
        document.getElementById('result').innerHTML = `<p style="color: red">Error occurred: ${err}</p>`;
    });
});


document.getElementById('tableForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    fetch('/table', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            document.getElementById('tableOutput').innerHTML = `<p style="color: red">${data.error}</p>`;
        } else {
            document.getElementById('tableOutput').innerHTML = data.table;
        }
    })
    .catch(err => {
        document.getElementById('tableOutput').innerHTML = `<p style="color: red">Error occurred: ${err}</p>`;
    });
});
