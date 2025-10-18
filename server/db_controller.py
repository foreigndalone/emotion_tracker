class DBController:
    def __init__(self, connection):
        self.connection = connection
        # PERSONAL DATA
        self.add_userInfo = "INSERT INTO users (user_name, user_age, user_password) VALUES (%s, %s, %s);"
        self.get_userInfo = "SELECT user_name, user_age, user_password FROM users WHERE id = %s;"
        
        # USERNAME HANDLER
        self.userNameHandler = "SELECT user_name FROM users WHERE user_name = %s;"
        self.userIdHandler = "SELECT id FROM users WHERE user_name = %s;"

        self.userPasswordHadler = "SELECT id, user_password FROM users WHERE user_name = %s;"

        # REFLECTIONS
        self.add_reflection = """
            INSERT INTO reflections (user_id, mood, text)
            VALUES (%s, %s, %s);
        """
        self.get_reflections = """
            SELECT id, text, mood, date_time
            FROM reflections
            WHERE user_id = %s
            ORDER BY date_time DESC;
        """

        #ADD / GET PERSONAL DATA 
    def add(self, name, age, password):
        with self.connection.cursor() as cursor:
            input_values = (name, age, password,)
            cursor.execute(self.userNameHandler, (name,))
            userName = cursor.fetchall()
            if len(userName)== 0:
                cursor.execute(self.add_userInfo, input_values)
                cursor.execute(self.userIdHandler, (name,))
                userId = cursor.fetchone()
                self.connection.commit()
                return userId
            else:
                return False

    def get(self, id):
        with self.connection.cursor() as cursor:
            input_values = (id,)
            cursor.execute(self.get_userInfo, input_values)
            userInfo = cursor.fetchall()
            return userInfo


# PASSWORD HANDLER
    def password_handler_db(self, name, password):
        with self.connection.cursor() as cursor:
            print(name, password)
            cursor.execute(self.userPasswordHadler, (name,))
            row = cursor.fetchone()  # берем одну строку
            if row:
                user_id, db_password = row
                if db_password == password:
                    return user_id
                else:
                    return False
            else:
                return False

    
    
        #ADD / GET REFLECTION
    def add_reflection_db(self, user_id, mood, text):
        with self.connection.cursor() as cursor:
            cursor.execute(self.add_reflection, (user_id, mood, text))
            self.connection.commit()
            print(user_id, mood, text)

    def get_reflections_db(self, user_id):
        with self.connection.cursor() as cursor:
            cursor.execute(self.get_reflections, (user_id,))
            return cursor.fetchall()