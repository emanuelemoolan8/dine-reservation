import axios from "axios";
import { setHours, setMinutes, format } from "date-fns";

const BASE_URL = "http://localhost:3000/api/v1";

async function createUserOrSkip(name: string, email: string) {
  try {
    const response = await axios.post(`${BASE_URL}/users`, { name, email });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      const existingUser = await axios.get(`${BASE_URL}/users?email=${email}`);
      return existingUser.data;
    } else {
      console.error(`Error creating user: ${error.message}`);
      if (error.response) {
        console.error(`Response data: ${JSON.stringify(error.response.data)}`);
        console.error(`Status: ${error.response.status}`);
      }
    }
  }
}

async function createReservation(
  userId: number,
  tableNumber: number,
  reservationTime: string,
  numberOfSeats: number
) {
  try {
    const response = await axios.post(`${BASE_URL}/reservations`, {
      userId,
      tableNumber,
      numberOfSeats,
      reservationTime,
    });
    console.info(
      `Reservation created: User ID ${userId}, Table ${tableNumber}, Time ${format(
        reservationTime,
        "HH:mm"
      )}, Seats ${numberOfSeats}`
    );
    return response.data;
  } catch (error: any) {
    console.error(`Error creating reservation: ${error.message}`);
    if (error.response) {
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
      console.error(`Status: ${error.response.status}`);
    }
  }
}

function getRandomTimeBetween(startTime: Date, endTime: Date): Date {
  const startMillis = startTime.getTime();
  const endMillis = endTime.getTime();
  const randomMillis =
    Math.floor(Math.random() * (endMillis - startMillis)) + startMillis;
  return new Date(randomMillis);
}

async function automateReservations() {
  const users = [
    { name: "John Doe", email: "john@example.com" },
    { name: "Jane Doe", email: "jane@example.com" },
    { name: "Alice Smith", email: "alice@example.com" },
    { name: "Bob Brown", email: "bob@example.com" },
  ];

  const createdUsers = (
    await Promise.all(
      users.map((user) => createUserOrSkip(user.name, user.email))
    )
  ).flat();

  const startTime = setHours(setMinutes(new Date(), 0), 19);
  const endTime = setHours(setMinutes(new Date(), 0), 24);
  const tableCount = 5;
  const seatsPerTable = 4;

  for (const user of createdUsers) {
    if (user) {
      const reservationTime = getRandomTimeBetween(
        startTime,
        endTime
      ).toLocaleTimeString();
      const randomTable = Math.floor(Math.random() * tableCount) + 1;

      await createReservation(
        user.id,
        randomTable,
        reservationTime,
        seatsPerTable
      );
    }
  }

  console.info("Automation completed.");
}

automateReservations().catch((e) => {
  console.error("Automation failed with error: ", e);
  process.exit(1);
});
