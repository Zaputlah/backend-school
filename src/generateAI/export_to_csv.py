import pandas as pd
from pymongo import MongoClient

# Koneksi ke MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['your_database_name']
collection = db['students']

# Mengambil data dari MongoDB dengan kolom tambahan
data = list(collection.find({}, {'_id': 0, 'name': 1, 'age': 1, 'academic_score': 1}))

# Mengubah data ke DataFrame
df = pd.DataFrame(data)

# Menyimpan DataFrame ke CSV
df.to_csv('students_data.csv', index=False)

print("Data has been exported to 'students_data.csv'")
