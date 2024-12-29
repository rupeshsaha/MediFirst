import React, { useContext, useEffect, useState } from "react";
import { convertDateToLocal } from "../lib/ConvertDateToLocal";
import { convertTimeToLocal } from "../lib/ConvertTimeToLocal";
import { Link } from "react-router-dom";
import { StoreContext } from "../store/StoreContext";
import Paginate from "../components/Paginate";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  const { loggedInUserType, currPage, setTotalPages } =
    useContext(StoreContext);

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/transaction?page=${currPage}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.status === 200) {
          setTransactions(data.transactions);
          setTotalPages(data.totalPages);
        } else {
          alert(`${data.message}`);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    if (loggedInUserType) {
      getTransactions();
    }
  }, [loggedInUserType, currPage]);

  return (
    <div className="bg-[#e0ebfd7d] w-full p-4 md:p-8">
      {transactions?.length > 0 ? (
        <>
          <div className="text-xl md:text-3xl font-bold mb-4 md:mb-8">
            Your Transactions
          </div>

          {/* Header Row */}
          <div className="hidden md:grid grid-cols-5 font-semibold text-lg mb-4">
            <div>
              {loggedInUserType === "Patient"
                ? "Doctor"
                : loggedInUserType === "Doctor"
                ? "Patient"
                : "N/A"}
            </div>
            <div>Payment Time</div>
            <div>Amount</div>
            <div>Transaction Id</div>
            <div>Payment Status</div>
          </div>

          {/* Transaction Cards */}
          <div className="flex flex-col gap-4">
            {transactions.map((transaction) => (
              <div
                key={transaction._id}
                className="bg-white rounded-md shadow-md text-gray-800 p-4 md:grid md:grid-cols-5 flex flex-col gap-2 md:gap-4"
              >
                {/* Doctor/Patient Name */}
                <div>
                  <span className="font-medium md:hidden">Name: </span>
                  {loggedInUserType === "Doctor"
                    ? transaction?.patientId?.name
                    : loggedInUserType === "Patient"
                    ? transaction?.doctorId?.name
                    : "N/A"}
                </div>

                {/* Payment Time */}
                <div>
                  <span className="font-medium md:hidden">Payment Time: </span>
                  {`${convertDateToLocal(
                    transaction.createdAt
                  )} ${convertTimeToLocal(transaction.createdAt)}`}
                </div>

                <div>
                  <span className="font-medium md:hidden">Amount: </span>₹{" "}
                  {transaction.amount}
                </div>

                {/* Transaction Id */}
                <div>
                  <span className="font-medium md:hidden">
                    Transaction Id:{" "}
                  </span>
                  {transaction._id}
                </div>

                {/* Payment Status */}
                <div
                  className={`${
                    transaction.paymentStatus === "Pending"
                      ? "text-yellow-600"
                      : "text-green-500"
                  } flex items-center justify-between gap-2`}
                >
                  <div>
                    <span className="font-medium md:hidden">Payment: </span>
                    {transaction.status}
                  </div>

                  {transaction.paymentStatus === "Pending" &&
                    loggedInUserType === "Patient" && (
                      <Link
                        to={`/pay-fees?transactionId=${encodeURIComponent(
                          transaction._id
                        )}`}
                      >
                        <div className="bg-blue-500 rounded-md px-2 py-1 text-white text-center text-sm hover:bg-blue-700 duration-300">
                          Pay Now
                        </div>
                      </Link>
                    )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          <Paginate />
        </>
      ) : (
        <div className="text-center text-gray-600 mt-8">
          You do not have any transactions.
        </div>
      )}
    </div>
  );
};

export default Transactions;
