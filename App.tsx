import React, {useEffect, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';

import HomeTab from './Pages/Home';
import LoginScreen from './Pages/Login';
import SettingsScreen from './Pages/Setting';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

// const db = openDatabase({name: 'UserDatabase.db'});

const getDBConnection = async () => {
  return SQLite.openDatabase({name: 'password-data.db', location: 'default'});
};

const createTable = async (db: SQLiteDatabase) => {
  // create table if not exists
  const query = `CREATE TABLE IF NOT EXISTS users(
        value TEXT NOT NULL
    );`;

  await db.executeSql(query);
};

const getTodoItems = async (db: SQLiteDatabase) => {
  try {
    const todoItems: any[] = [];
    const results = await db.executeSql('SELECT rowid as id,value FROM users');
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        console.log(result.rows.item(index).id);
        console.log(result.rows.item(index).value);
        todoItems.push(result.rows.item(index));
      }
    });
    return todoItems;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get todoItems !!!');
  }
};

const saveTodoItems = async (db: SQLiteDatabase, todoItems: any) => {
  const insertQuery =
    'INSERT OR REPLACE INTO users(rowid, value) values' +
    todoItems.map(i => `(${i.id}, '${i.value}')`).join(',');

  return db.executeSql(insertQuery);
};

const deleteTodoItem = async (db: SQLiteDatabase, id: number) => {
  const deleteQuery = `DELETE from users where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

const deleteTable = async (db: SQLiteDatabase) => {
  const query = 'drop table users';

  await db.executeSql(query);
};

const App = () => {
  const Stack = createNativeStackNavigator();

  const loadDataCallback = useCallback(async () => {
    try {
      const initTodos = [
        {id: 0, value: 'go to shop'},
        {id: 1, value: 'eat at least a one healthy foods'},
        {id: 2, value: 'Do some exercises'},
      ];
      const db = await getDBConnection();
      await createTable(db);

      await saveTodoItems(db, initTodos);
      let storedTodoItems = await getTodoItems(db);
      await deleteTodoItem(db, 0);
      storedTodoItems = await getTodoItems(db);
      console.log(storedTodoItems);

      // if (storedTodoItems.length) {
      //   setTodos(storedTodoItems);
      // } else {
      //   await saveTodoItems(db, initTodos);
      //   setTodos(initTodos);
      // }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    loadDataCallback();
  }, [loadDataCallback]);

  // useEffect(() => {
  //   const db = getDBConnection();
  //   createTable(db);
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeTab} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
