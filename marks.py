from flask import Flask, request, render_template, jsonify
import pandas as pd

app = Flask(__name__)

def calculate_grade(marks, mean, std_dev):
    return (marks - mean) / std_dev

def determine_grade(z):
    if z > 1.5:
        return 10
    elif 1 < z <= 1.5:
        return 9
    elif 0.5 < z <= 1:
        return 8
    elif 0 < z <= 0.5:
        return 7
    elif -0.5 < z <= 0:
        return 6
    elif -1 < z <= -0.5:
        return 5
    elif -1.5 < z <= -1:
        return 4
    else:
        return 0

@app.route('/')
def home():
    return render_template('home.html')


@app.route('/predict', methods=['POST'])
def predict():
    marks = int(request.form.get('marks'))
    raw_data = request.form.get('rawInput')
    uploaded_file = request.files.get('file')

    try:
        if uploaded_file:
            if uploaded_file.filename.endswith('.csv'):
                df = pd.read_csv(uploaded_file)
            else:
                df = pd.read_excel(uploaded_file)
        elif raw_data:
            marks_list = [int(m.strip()) for m in raw_data.split(',') if m.strip().isdigit()]
            df = pd.DataFrame({'marks': marks_list})
        else:
            return jsonify({'error': 'No marks data provided'}), 400
    except Exception as e:
        return jsonify({'error': f'Data processing error: {str(e)}'}), 400

    if 'marks' not in df.columns:
        return jsonify({'error': "'marks' column not found"}), 400

    mean = df['marks'].mean()
    std_dev = df['marks'].std()

    z_score = calculate_grade(marks, mean, std_dev)
    grade = determine_grade(z_score)

    return jsonify({'grade': grade})


@app.route('/table', methods=['POST'])
def table():
    raw_data = request.form.get('rawInput')
    uploaded_file = request.files.get('file')

    try:
        if uploaded_file:
            if uploaded_file.filename.endswith('.csv'):
                df = pd.read_csv(uploaded_file)
            else:
                df = pd.read_excel(uploaded_file)
        elif raw_data:
            marks_list = [int(m.strip()) for m in raw_data.split(',') if m.strip().isdigit()]
            df = pd.DataFrame({'marks': marks_list})
        else:
            return jsonify({'error': 'No data provided'}), 400
    except Exception as e:
        return jsonify({'error': f'Error reading marks: {str(e)}'}), 400

    if 'marks' not in df.columns:
        return jsonify({'error': "'marks' column not found"}), 400

    mean = df['marks'].mean()
    std_dev = df['marks'].std()

    grade_ranges = [
        (10, 1.5, float('inf')),
        (9, 1, 1.5),
        (8, 0.5, 1),
        (7, 0, 0.5),
        (6, -0.5, 0),
        (5, -1, -0.5),
        (4, -1.5, -1),
        (0, float('-inf'), -1.5),
    ]

    table_html = """
    <table border="1" style="margin: 30px auto; border-collapse: collapse; color: white;">
        <tr><th>Grade</th><th>Marks Range</th><th>No. of Students</th></tr>
    """
    for grade, low, high in grade_ranges:
        count = ((df['marks'] - mean) / std_dev).between(low, high, inclusive="right").sum()
        marks_start = mean + low * std_dev if low != float('-inf') else None
        marks_end = mean + high * std_dev if high != float('inf') else None

        if marks_start is not None and marks_end is not None:
            range_text = f"{marks_start:.2f} - {marks_end:.2f}"
        elif marks_start is None:
            range_text = f"< {marks_end:.2f}"
        else:
            range_text = f"> {marks_start:.2f}"

        table_html += f"<tr><td>{grade}</td><td>{range_text}</td><td>{count}</td></tr>"
    table_html += "</table>"

    return jsonify({'table': table_html})


if __name__ == '__main__':
    app.run(debug=True)
