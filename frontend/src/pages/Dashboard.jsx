function Dashboard() {
  return (
    <div className="p-6">

      {/* Header */}
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>

      {/* Billing Options */}
      <div className="grid grid-cols-3 gap-4 mt-6">

        <a 
          href="/billing-history" 
          className="p-4 bg-blue-600 text-white rounded shadow text-center"
        >
          Billing History
        </a>

        <a 
          href="/billing-pending" 
          className="p-4 bg-yellow-600 text-white rounded shadow text-center"
        >
          Pending Bills
        </a>

        <a 
          href="/pos" 
          className="p-4 bg-green-600 text-white rounded shadow text-center"
        >
          Go to POS
        </a>

      </div>

    </div>
  );
}

export default Dashboard;
