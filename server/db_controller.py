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
        self.delete_reflection = """
            DELETE FROM reflections WHERE id = %s AND user_id = %s;
        """

        self.add_reminder = """
            INSERT INTO reminders (user_id, timestamp)
            VALUES (%s, %s);
        """

        self.delete_reminder = """
            DELETE FROM reminders WHERE user_id = %s AND timestamp = %s;
        """

        self.delete_all_reminders = """
            DELETE FROM reminders WHERE user_id = %s;
        """

        self.get_user_reminders = """
            SELECT timestamp FROM reminders WHERE user_id = %s;
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
            cursor.execute(self.add_reflection, (user_id, mood, text,))
            self.connection.commit()
            return self.get_reflections_db(user_id)

    def get_reflections_db(self, user_id):
        with self.connection.cursor() as cursor:
            cursor.execute(self.get_reflections, (user_id,))
            rows = cursor.fetchall()
            reflections = []
            for row in rows:
                reflections.append({
                    "id": row[0],
                    "userText": row[1],
                    "userMood": row[2],
                    "dateOfReflection": str(row[3])
                })
            return reflections
        

    def delete_reflection_db(self, id, user_id):
        with self.connection.cursor() as cursor:
            cursor.execute(self.delete_reflection, (id, user_id,))
            self.connection.commit()
            return self.get_reflections_db(user_id)
        
    
    def add_reminder_db(self, user_id, reminder):
        with self.connection.cursor() as cursor:
            input_values = (user_id, reminder, )
            cursor.execute(self.add_reminder, input_values)
            self.connection.commit()
            return self.get_reminders_db(user_id)
    
    def get_reminders_db(self, user_id):
        with self.connection.cursor() as cursor:
            cursor.execute(self.get_user_reminders, (user_id,))
            reminders = cursor.fetchall()
            reminders = [reminder[0].strftime('%H:%M') for reminder in reminders]
            return reminders
    
    def delete_reminder_db(self, user_id, reminder):
        with self.connection.cursor() as cursor:
            input_values = (user_id, reminder,)
            cursor.execute(self.delete_reminder, input_values)
            self.connection.commit()
            return self.get_reminders_db(user_id)
    
    def delete_all_reminders_db(self, user_id):
        with self.connection.cursor() as cursor:
            cursor.execute(self.delete_all_reminders, (user_id, ))
            self.connection.commit()    