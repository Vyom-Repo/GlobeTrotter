"""
Script to generate realistic mock data using Faker for cities, activities, users, and trips.
"""
from faker import Faker

fake = Faker()

def generate_mock_data():
    print("Generating mock data...")
    # Mock data generation logic using Faker
    users = [{"name": fake.name(), "email": fake.email()} for _ in range(5)]
    print(f"Generated {len(users)} sample users.")
    return users

if __name__ == "__main__":
    generate_mock_data()
