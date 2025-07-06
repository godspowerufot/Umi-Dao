"use client";
import { useEffect, useState } from "react";
import {
  getAccount,
  getFunction,
  publicClient,
  walletClient,
} from "../../config";

export default function Home() {
  const [message, setMessage] = useState("");
  const [$message, set$Message] = useState("");

  const fetchMessage = async () => {
    const { to, data } = await getFunction("message");
    const response = await publicClient().call({ to, data });

    if (!response.data) throw Error("No data found");
    if (typeof response.data == "string")
      throw Error("Data is not an array of bytes");
    const message = response.data;
    setMessage(message);
  };

  const sendMessage = async (message) => {
    const { to, data } = await getFunction("sendMessage");
    const hash = await walletClient().sendTransaction({
      account: await getAccount()?.address,
      to,
      data,
      value: message,
    });
    await publicClient().waitForTransactionReceipt({ hash });
    fetchMessage();
  };

  useEffect(() => {
    fetchMessage();
  }, []);

  return (
    <div className="text-center">
      <h1 className="px-2">Message: {message}</h1>
      <input
        type="text"
        onChange={(e) => set$Message(e.target.value)}
        value={$message}
      />
      <button
        className="bg-blue-200 rounded px-5 py-2.5"
        type="button"
        onClick={async () => {
          await sendMessage("hi");
        }}
      >
        Send Message
      </button>
    </div>
  );
}
