import pandas as pd
from pymongo import MongoClient
from datetime import datetime
import numpy as np

# Konfigurasi MongoDB
MONGO_URI = 'mongodb://localhost:27017/'  # Ganti dengan URI MongoDB Anda
DATABASE_NAME = 'lms'       # Nama database Anda
SOURCE_COLLECTION_NAME = 'students'  # Nama koleksi sumber
TARGET_COLLECTION_NAME = 'class_assignments'  # Nama koleksi target

# Menyambung ke MongoDB
client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
source_collection = db[SOURCE_COLLECTION_NAME]
target_collection = db[TARGET_COLLECTION_NAME]

# Mengambil data siswa dari MongoDB
students = list(source_collection.find({}, {'_id': 1, 'name': 1, 'nis': 1, 'age': 1}))
data = pd.DataFrame(students)

# Menampilkan kolom yang ada di DataFrame
print("Kolom yang ada:", data.columns)

# Memeriksa data pertama untuk memastikan formatnya benar
print(data.head())

# Jumlah kelas yang diinginkan
num_classes = 4

# Menentukan batas maksimum siswa per kelas
max_students_per_class = len(data) // num_classes + 1  # Perhitungan batas, dengan pembulatan ke atas jika tidak bisa dibagi rata

# Mengurutkan data berdasarkan usia
data.sort_values('age', inplace=True)

# Menambahkan kolom kelas dengan label yang sesuai
data['class'] = np.nan

# Mengelompokkan siswa ke dalam kelas
class_labels = [f'x{i+1}' for i in range(num_classes)]
current_class = 0

for i in range(len(data)):
    data.at[i, 'class'] = class_labels[current_class]
    if (i + 1) % max_students_per_class == 0:
        current_class = (current_class + 1) % num_classes

# Menyimpan hasil pengelompokan ke CSV (opsional)
data.to_csv('students_with_classes.csv', index=False)
print("Data has been clustered and saved to 'students_with_classes.csv'")

# Menyimpan data ke koleksi target dengan informasi tambahan
for _, row in data.iterrows():
    target_collection.update_one(
        {'_id': row['_id']},  # Menggunakan ID sebagai kunci pencarian
        {
            '$set': {
                'name': row['name'],
                'nis': row['nis'],
                'class': row['class'],
                'registration_date': datetime.now()  # Tanggal dan waktu saat pendaftaran
            }
        },
        upsert=True
    )
print("Data has been updated in the MongoDB database.")
