class TimeUtils {
    static timeToMinutes(timeString) {
      const parts = timeString.split(":");
      const hours = Number(parts[0]);
      const minutes = Number(parts[1]);
      return hours * 60 + minutes;
    }

    static dateToMinutes(date) {
      return date.getHours() * 60 + date.getMinutes();
    }

    static isInMonth(date, month) {
      return date.getMonth() + 1 === month;
    }

    static isBetween(date, fromTime, toTime) {
      const minutes = TimeUtils.dateToMinutes(date);
      return TimeUtils.timeToMinutes(fromTime) <= minutes && minutes <= TimeUtils.timeToMinutes(toTime);
    }

    static isWorkingTime(date) {
      return TimeUtils.isBetween(date, "09:00", "18:00");
    }
}

class User {
  constructor(lastName, firstName, age, education, goal, contactDate) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.age = age;
    this.education = education;
    this.goal = goal; 
    this.contactDate = new Date(contactDate); // дата і час звернення разом
  }

 
  getDateString() {
    return this.contactDate.toLocaleDateString("uk-UA");
  }

  
  getTimeString() {
    return this.contactDate.toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" });
  }


  toTableRow() {
    return {
      lastName: this.lastName,
      firstName: this.firstName,
      age: this.age,
      education: this.education,
      goal: this.goal,
      date: this.getDateString(),
      time: this.getTimeString(),
    };
  }

  // Клас користувача за метою і часом звернення
  getCategory() {
    const isWorkingTime = TimeUtils.isWorkingTime(this.contactDate);

    if (this.goal === "complaint" && isWorkingTime) {
      return "complaint-during-worktime";
    } else if (this.goal === "wish" && isWorkingTime) {
      return "wish-during-worktime";
    } else {
      return "other";
    }
  }


}


class UserList {
  constructor(users) {
    this.users = users;
  }

  print(users) {
    const rows = users.map((user) => user.toTableRow());
    console.table(rows);
  }

  getByMonthAndTime(month, fromTime, toTime) {
    return this.users.filter((user) => TimeUtils.isInMonth(user.contactDate, month) &&
                                      TimeUtils.isBetween(user.contactDate, fromTime, toTime));
  }

  getAverageAge() {
    let sum = 0;
    this.users.forEach((user) => {
      sum = sum + user.age;
    });
    return sum / this.users.length;
  }

  getUsersByAge(age) {
    return this.users.filter((user) => user.age === age);
  }

  printAverageAgeInfo() {
    const averageAge = this.getAverageAge();
    const roundedAge = Math.round(averageAge);
    console.log("Середній вік:", averageAge, ", після округлення:", roundedAge);

    const matchedUsers = this.getUsersByAge(roundedAge);

    if (matchedUsers.length === 0) {
      console.log("Користувачів з таким віком немає");
    } else {
      matchedUsers.forEach((user) => {
        console.log(user.lastName + " " + user.firstName + ": освіта: " + user.education);
      });
    }
  }

  classify() {
    const groups = {
      "complaint-during-worktime": [],
      "wish-during-worktime": [],
      "other": [],
    };

    this.users.forEach((user) => {
      const category = user.getCategory();
      groups[category].push(user);
    });

    return groups;
  }

  printClassification() {
    const groups = this.classify();

    for (const category in groups) {
      const users = groups[category];
      console.log(category + ": " + users.length);
      this.print(users);
    }
  }

  sortByAgeDesc() {
    const sortedUsers = [...this.users];
    sortedUsers.sort((a, b) => b.age - a.age);
    return sortedUsers;
  }

  sortByName() {
    const sortedUsers = [...this.users];
    sortedUsers.sort((a, b) => {
      const lastNameResult = a.lastName.localeCompare(b.lastName);
      if (lastNameResult !== 0) {
        return lastNameResult;
      }
      return a.firstName.localeCompare(b.firstName);
    });
    return sortedUsers;
  }
}


const userList = new UserList([
  new User("Smith", "John", 25, "Bachelor's degree", "complaint", "2026-03-05T10:15"),
  new User("Johnson", "Emily", 31, "Master's degree", "wish", "2026-03-12T14:40"),
  new User("Brown", "Michael", 45, "PhD", "complaint", "2026-03-20T19:30"),
  new User("Davis", "Sarah", 22, "Secondary education", "other", "2026-03-25T11:00"),
  new User("Wilson", "James", 52, "Bachelor's degree", "complaint", "2026-04-02T09:00"),
  new User("Smith", "Anna", 19, "Secondary education", "wish", "2026-04-15T18:00"),
  new User("Taylor", "Olivia", 28, "Master's degree", "wish", "2026-04-28T08:45"),
  new User("Anderson", "David", 34, "PhD", "complaint", "2026-05-03T13:20"),
  new User("Clark", "Sophia", 27, "Bachelor's degree", "other", "2026-05-10T16:05"),
  new User("Lewis", "Daniel", 23, "Vocational education", "wish", "2026-05-21T22:10"),
]);


console.log("Список користувачів:");
userList.print(userList.users);
console.log("\n1. Користувачі, які звернулись у березні з 10:00 до 15:00:");
userList.print(userList.getByMonthAndTime(3, "10:00", "15:00"));

console.log("\n2. Середній вік користувачів:");
userList.printAverageAgeInfo();

console.log("\n3. Поділ користувачів на класи:");
userList.printClassification();

console.log("\n4а. Користувачі у порядку спадання віку:");
userList.print(userList.sortByAgeDesc());

console.log("\n4б. Користувачі в алфавітному порядку:");
userList.print(userList.sortByName());
