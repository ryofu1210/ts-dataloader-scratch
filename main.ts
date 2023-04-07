import { DataLoader } from "./dataloader";

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

const batchGetUsers = async (userIds: number[]): Promise<User[]> => {
  console.log("call batchGetUsers()");
  // ユーザーIDに基づいてユーザー情報を取得
  return userIds.map((userId) => users.find((user) => user.id === userId)!);
};

const userLoader = new DataLoader<number, User>(batchGetUsers);

async function main() {
  console.log("--- main() ---");
  // DataLoaderを使ってデータを取得
  const [user1, user2, user3] = await Promise.all([
    userLoader.load(1),
    userLoader.load(2),
    userLoader.load(3),
  ]);

  console.log(user1); // { id: 1, name: "Alice" }
  console.log(user2); // { id: 2, name: "Bob" }
  console.log(user3); // { id: 3, name: "Charlie" }

  console.log("--- end ---");
}

main();
