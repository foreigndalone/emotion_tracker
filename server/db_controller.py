class DBController:
    def __init__(self, connection):
        self.connection = connection
        self.add_userInfo = "INSERT INTO users (user_name, user_age) VALUES (%s, %s);"
        self.get_userInfo = "SELECT user_name, user_age FROM users WHERE id = %s"
    
    def get(self, id):
        with self.connection.cursor() as cursor:
            input_values = (id,)
            cursor.execute(self.get_userInfo, input_values)
            userInfo = cursor.fetchall()
            return userInfo

    def add(self, name, age):
        with self.connection.cursor() as cursor:
            input_values = (name, age,)
            cursor.execute(self.add_userInfo, input_values)
            self.connection.commit()