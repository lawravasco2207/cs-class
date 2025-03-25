from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import psycopg2
from psycopg2 import pool
import pandas as pd
from io import BytesIO

app = Flask(__name__)
CORS(app)


# connectionstring: postgresql://yasmin_owner:npg_POQUWrE7Jl1V@ep-soft-art-a8a52vwt-pooler.eastus2.azure.neon.tech/comp?sslmode=require
# PostgreSQL connection pool
db_pool = pool.SimpleConnectionPool(
    1, 20,  # Min and max connections
    database="comp",
    user="yasmin_owner",  # Replace with your PostgreSQL username
    password="npg_POQUWrE7Jl1V",  # Replace with your PostgreSQL password
    host="ep-soft-art-a8a52vwt-pooler.eastus2.azure.neon.tech",
    port="5432"
)

# Initialize the students table
def init_db():
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                CREATE TABLE IF NOT EXISTS students (
                    id SERIAL PRIMARY KEY,
                    full_name VARCHAR(100) NOT NULL,
                    birth_info VARCHAR(10) NOT NULL,
                    phone_number VARCHAR(10) NOT NULL,
                    alt_phone_number VARCHAR(10),
                    location VARCHAR(100) NOT NULL,
                    class_schedule VARCHAR(50) NOT NULL,
                    CONSTRAINT unique_student UNIQUE (full_name, phone_number, birth_info)
                );
            """)
            conn.commit()
    finally:
        db_pool.putconn(conn)

# Routes
@app.route('/api/students', methods=['POST'])
def add_student():
    data = request.get_json()
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            # Check if student already exists
            cur.execute("""
                SELECT id FROM students 
                WHERE full_name = %s AND phone_number = %s AND birth_info = %s;
            """, (data['fullName'], data['phoneNumber'], data['birthInfo']))
            existing_student = cur.fetchone()

            if existing_student:
                return jsonify({'error': 'Student with this name, phone number, and birth date already exists'}), 409

            # Insert new student if no duplicate
            cur.execute("""
                INSERT INTO students (full_name, birth_info, phone_number, alt_phone_number, location, class_schedule)
                VALUES (%s, %s, %s, %s, %s, %s) RETURNING id;
            """, (
                data['fullName'],
                data['birthInfo'],
                data['phoneNumber'],
                data.get('altPhoneNumber', ''),
                data['location'],
                data['classSchedule']
            ))
            conn.commit()
            return jsonify({'message': 'Student added successfully'}), 201
    except psycopg2.IntegrityError as e:
        conn.rollback()
        return jsonify({'error': 'Database error: Duplicate entry prevented'}), 409
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db_pool.putconn(conn)

@app.route('/api/students', methods=['GET'])
def get_students():
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM students;")
            students = cur.fetchall()
            return jsonify([{
                'id': s[0],
                'fullName': s[1],
                'birthInfo': s[2],
                'phoneNumber': s[3],
                'altPhoneNumber': s[4],
                'location': s[5],
                'classSchedule': s[6]
            } for s in students])
    finally:
        db_pool.putconn(conn)

@app.route('/api/students/<int:id>', methods=['DELETE'])
def delete_student(id):
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM students WHERE id = %s;", (id,))
            if cur.rowcount == 0:
                return jsonify({'error': 'Student not found'}), 404
            conn.commit()
            return jsonify({'message': 'Student deleted successfully'})
    except Exception as e:
        conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db_pool.putconn(conn)

@app.route('/api/students/export', methods=['GET'])
def export_students():
    conn = db_pool.getconn()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT full_name, birth_info, phone_number, alt_phone_number, location, class_schedule FROM students;")
            students = cur.fetchall()
            data = [{
                'Full Name': s[0],
                'Birth Info': s[1],
                'Phone Number': s[2],
                'Alt Phone Number': s[3],
                'Location': s[4],
                'Class Schedule': s[5]
            } for s in students]
            
            df = pd.DataFrame(data)
            output = BytesIO()
            writer = pd.ExcelWriter(output, engine='xlsxwriter')
            df.to_excel(writer, index=False, sheet_name='Students')
            writer.close()
            output.seek(0)
            
            return send_file(output, download_name="students.xlsx", as_attachment=True)
    finally:
        db_pool.putconn(conn)

if __name__ == '__main__':
    init_db()  # Initialize the database on startup
    app.run(debug=True)