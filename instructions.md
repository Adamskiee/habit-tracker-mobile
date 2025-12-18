## 📱 Project: **Habit Tracker Mobile App**

A habit tracker covers almost everything you need to understand React Native fundamentals and prepares you for real apps.

---

A mobile app where users can:

* Add daily habits
* Mark habits as completed
* View streaks or completion history
* Persist data locally on the device

---

## 🧠 Concepts 

### 1️⃣ Core React Native Basics

**Features**

* Habit list screen
* Add habit form

**Concepts**

* `View`, `Text`, `TextInput`, `Pressable`
* Flexbox layout
* Props & state (`useState`)
* Lists (`FlatList`)
* Basic styling

---

### 2️⃣ Navigation

**Features**

* Home screen (habit list)
* Add Habit screen
* Habit details screen

**Concepts**

* `@react-navigation/native`
* Stack navigation
* Passing params between screens

---

### 3️⃣ State Management

**Features**

* Toggle habit completion
* Update streaks

**Concepts**

* Lifting state up
* `useContext` (simple global state)
* Immutable state updates

---

### 4️⃣ Local Storage

**Features**

* Save habits even after closing the app

**Concepts**

* `AsyncStorage`
* Loading data on app startup
* Handling async logic with `useEffect`

---

### 5️⃣ UI & UX Improvements

**Features**

* Progress indicator
* Empty state UI
* Completion animations

**Concepts**

* Conditional rendering
* Basic animations (`Animated` or `LayoutAnimation`)
* Platform differences (iOS vs Android)

---

## 🗂 Suggested Folder Structure

```txt
src/
 ├── components/
 │   ├── HabitItem.js
 │   └── AddHabitModal.js
 ├── screens/
 │   ├── HomeScreen.js
 │   ├── AddHabitScreen.js
 │   └── HabitDetailScreen.js
 ├── context/
 │   └── HabitsContext.js
 ├── utils/
 │   └── storage.js
 └── App.js
```

---

## 🛠 Tech Stack

* **Expo** (recommended for beginners)
* **React Native**
* **React Navigation**
* **AsyncStorage**

---

## 🧪 Stretch Features 

* Dark mode 🌙
* Push notifications (habit reminders)
* Calendar view
* Cloud sync (Firebase)
* Charts (victory-native or react-native-svg)

---

## 🚀 Step-by-Step Learning Path

1. Render a static habit list
2. Add new habits (no persistence)
3. Toggle completion
4. Add navigation
5. Save data locally
6. Polish UI & UX