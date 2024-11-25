require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // Use 'pg' library for PostgreSQL
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Create a pool for PostgreSQL connection
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: { rejectUnauthorized: false } // Adjust as needed for your setup
});

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
	 	 	 	
// The function will send queries to the database.
app.post('/executeQuery', (req, res) => {
    const { query } = req.body; // Extract the SQL query from the request body

    if (!query) {
        return res.status(400).send('Query is required');
    }

    // Execute the SQL query using the pool.query method
    pool.query(query)
        .then(() => {
            res.send('Query executed successfully');
        })
        .catch(error => {
            res.status(500).send('Error executing query');
            console.error(error);
        });
});

// Endpoint to get order history data
app.get('/api/OrderHistory', (req, res) => {
    let orders = [];
    pool
        .query('SELECT * FROM DailyTransactions ORDER BY date DESC LIMIT 500;')
        .then(query_res => {
            console.log(query_res.rowCount);
            for (let i = 0; i < query_res.rowCount; i++) {
                orders.push(query_res.rows[i]);
            }
            const data = { "orders": orders }; // Pass the orders data to the template
            console.log(orders); // Log orders for debugging
            res.json(data);
        })
        .catch(error => {
            console.error('Error fetching order history data:', error);
            res.status(500).send('Error fetching order history data');
        });
});

// Endpoint to get employee data
app.get('/api/EmployeeInfo', async (req, res) => {
    let employees = [];
    pool
        .query('SELECT * FROM EmployeeData ORDER BY employeerole DESC, name;')
        .then(query_res => {
            console.log(query_res.rowCount);
            for (let i = 0; i < query_res.rowCount; i++) {
                employees.push(query_res.rows[i]);
            }
            const data = { "employees": employees }; // Pass the orders data to the template
            console.log(employees); // Log orders for debugging
            res.json(data); 
        })
        .catch(error => {
            console.error('Error fetching employee data:', error);
            res.status(500).send('Error fetching employee data');
        });
});

// Endpoint to get cashier
app.get('/api/Cashier', async (req, res) => {
    let menu_items = [];
    pool
        .query('SELECT * FROM prices;')
        .then(query_res => {
            console.log(query_res.rowCount);
            for (let i = 0; i < query_res.rowCount; i++) {
                menu_items.push(query_res.rows[i]);
            }
            const data = { "menu items": menu_items }; // Pass the orders data to the template
            console.log(menu_items); // Log orders for debugging
            res.json(data); 
        })
        .catch(error => {
            console.error('Error fetching order history data:', error);
            res.status(500).send('Error fetching order history data');
        });
});

// Endpoint to get prices data
app.get('/api/Prices', async (req, res) => {
    let prices = [];
    pool
        .query('SELECT * FROM prices;')
        .then(query_res => {
            console.log(query_res.rowCount);
            for (let i = 0; i < query_res.rowCount; i++) {
                prices.push(query_res.rows[i]);
            }
            const data = { "prices": prices }; // Pass the prices data to the template
            console.log(prices); // Log prices data for debugging
            res.json(data); 
        })
        .catch(error => {
            console.error('Error fetching prices data:', error);
            res.status(500).send('Error fetching prices data');
        });
})

// Endpoint to get menumatch data
app.get('/api/MenuMatch', async (req, res) => {
    let menuMatch = [];
    pool
        .query('SELECT * FROM menumatch;')
        .then(query_res => {
            console.log(query_res.rowCount);
            for (let i = 0; i < query_res.rowCount; i++) {
                menuMatch.push(query_res.rows[i]);
            }
            const data = { "menuMatch": menuMatch }; // Pass the menumatch data to the template
            console.log(menuMatch); // Log menumatch for debugging
            res.json(data); 
        })
        .catch(error => {
            console.error('Error fetching menu match data:', error);
            res.status(500).send('Error fetching menu match data');
        });
})

// Endpoint to get customerinformation data
app.get('/api/CustomerInformation', async (req, res) => {
    let customerInformation = [];
    pool
        .query('SELECT * FROM customerinformation;')
        .then(query_res => {
            console.log(query_res.rowCount);
            for (let i = 0; i < query_res.rowCount; i++) {
                customerInformation.push(query_res.rows[i]);
            }
            const data = { "customerInformation": customerInformation }; // Pass the customerInformation data to the template
            console.log(customerInformation); // Log customerInformation data for debugging
            res.json(data); 
        })
        .catch(error => {
            console.error('Error fetching customerInformation data:', error);
            res.status(500).send('Error fetching customerInformation data');
        });
})

// Endpoint to get general trends data
app.get('/api/GeneralTrends', async (req, res) => {
    try {
        // Fetch daily summaries
        const dailySumData = await pool.query(
            "SELECT * FROM statistics ORDER BY date DESC;"
        );

        // Fetch peak days with `special_event` cast to integer
        const peakDaysData = await pool.query(
            "SELECT date, total_sales, total_customers, average_time_between_orders_minutes, CAST(special_event AS INTEGER) AS special_event FROM statistics WHERE CAST(special_event AS INTEGER) = 1 ORDER BY date DESC;"
        );

        // Fetch total income
        const totalIncomeResult = await pool.query("SELECT SUM(total_sales) AS result FROM statistics;");
        const totalIncome = totalIncomeResult.rows[0].result ? parseFloat(totalIncomeResult.rows[0].result).toFixed(2) : '0.00';

        // Fetch total customers
        const totalCustomersResult = await pool.query("SELECT SUM(total_customers) AS result FROM statistics;");
        const totalCustomers = totalCustomersResult.rows[0].result ? parseInt(totalCustomersResult.rows[0].result) : 0;

        // Fetch average customers per day
        const averageCustomersResult = await pool.query("SELECT AVG(total_customers) AS result FROM statistics;");
        const averageCustomers = averageCustomersResult.rows[0].result ? parseFloat(averageCustomersResult.rows[0].result).toFixed(2) : '0.00';

        // Fetch total sales per customer
        const totalSalesPerCustomerResult = await pool.query("SELECT AVG(total_sales) / AVG(total_customers) AS result FROM statistics;");
        const totalSalesPerCustomer = totalSalesPerCustomerResult.rows[0].result ? parseFloat(totalSalesPerCustomerResult.rows[0].result).toFixed(2) : '0.00';

        // Fetch date with the shortest time between orders
        const dateShortestTimeBetweenOrdersResult = await pool.query("SELECT date FROM statistics ORDER BY average_time_between_orders_minutes LIMIT 1;");
        const dateShortestTimeBetweenOrders = dateShortestTimeBetweenOrdersResult.rows[0]?.date || 'N/A';

        // Fetch date with the longest time between orders
        const dateLongestTimeBetweenOrdersResult = await pool.query("SELECT date FROM statistics ORDER BY average_time_between_orders_minutes DESC LIMIT 1;");
        const dateLongestTimeBetweenOrders = dateLongestTimeBetweenOrdersResult.rows[0]?.date || 'N/A';

        // Fetch date with the most sales
        const dateMostSalesResult = await pool.query("SELECT date FROM statistics ORDER BY total_sales DESC LIMIT 1;");
        const dateMostSales = dateMostSalesResult.rows[0]?.date || 'N/A';

        // Fetch date with the most customers
        const dateMostCustomersResult = await pool.query("SELECT date FROM statistics ORDER BY total_customers DESC LIMIT 1;");
        const dateMostCustomers = dateMostCustomersResult.rows[0]?.date || 'N/A';

        res.json({
            dailySum: dailySumData.rows || [],
            peakDays: peakDaysData.rows || [],
            stats: {
                totalIncome,
                totalCustomers,
                averageCustomers,
                totalSalesPerCustomer,
                dateShortestTimeBetweenOrders,
                dateLongestTimeBetweenOrders,
                dateMostSales,
                dateMostCustomers
            }
        });
    } catch (error) {
        console.error('Error fetching general trends data:', error);
        res.status(500).send('Error fetching general trends data');
    }
});

// Endpoint to get inventory data
app.get('/api/InventoryData', async (req, res) => {
    let inventory = [];
    pool
        .query('SELECT * FROM Inventory ORDER BY productname;')
        .then(query_res => {
            console.log(query_res.rowCount);
            for (let i = 0; i < query_res.rowCount; i++) {
                inventory.push(query_res.rows[i]);
            }
            const data = { "inventory": inventory }; // Pass the orders data to the template
            console.log(inventory); // Log orders for debugging
            res.json(data); 
        })
        .catch(error => {
            console.error('Error fetching inventory data:', error);
            res.status(500).send('Error fetching inventory data');
        });
});

app.get('/api/XReport', async (req, res) => {
    let xreports = [];
    let totals = { cash: 0, credit: 0, debit: 0, dining_dollars: 0 };

    try {
        const currentDate = '09-10-2024'; // Replace with dynamic date if needed
        const currentHour = new Date().getHours(); // Get current hour (0-23)

        // Fetch hourly sales data up to the current hour
        const hourlyResult = await pool.query(
            "SELECT DATE_TRUNC('hour', time) AS hour, SUM(order_cost) AS total_sales FROM dailytransactions WHERE date = '" + currentDate + "' AND EXTRACT(HOUR FROM time) <= " + currentHour + " GROUP BY DATE_TRUNC('hour', time) ORDER BY hour;"
        );
        xreports = hourlyResult.rows;

        // Fetch total sales for specific payment methods up to the current hour
        const totalsResult = await pool.query(
            "SELECT SUM(CASE WHEN payment_method = 'Cash' THEN order_cost ELSE 0 END) AS cash, SUM(CASE WHEN payment_method = 'Credit' THEN order_cost ELSE 0 END) AS credit, SUM(CASE WHEN payment_method = 'Debit' THEN order_cost ELSE 0 END) AS debit, SUM(CASE WHEN payment_method = 'Dining Dollars' THEN order_cost ELSE 0 END) AS dining_dollars FROM dailytransactions WHERE date = '" + currentDate + "' AND EXTRACT(HOUR FROM time) <= " + currentHour + ";"
            
        );

        // Populate totals object with the query result
        if (totalsResult.rows.length > 0) {
            totals = {
                cash: totalsResult.rows[0].cash || 0,
                credit: totalsResult.rows[0].credit || 0,
                debit: totalsResult.rows[0].debit || 0,
                dining_dollars: totalsResult.rows[0].dining_dollars || 0,
            };
        }

        const data = { xreports, totals }; // Return both hourly data and totals
        res.json(data);
    } catch (error) {
        console.error('Error fetching xreport data:', error);
        res.status(500).send('Error fetching xreport data');
    }
});

app.get('/api/ZReport', async (req, res) => {
    let zreports = [];
    let totals = { cash: 0, credit: 0, debit: 0, dining_dollars: 0, total_sales: 0, total_transactions: 0};

    try {
        // Fetch hourly sales data
        const hourlyResult = await pool.query(
            "SELECT DATE_TRUNC('hour', time) AS hour, SUM(order_cost) AS total_sales FROM dailytransactions WHERE date = '09-10-2024' GROUP BY DATE_TRUNC('hour', time) ORDER BY hour;"
        );
        zreports = hourlyResult.rows;

        // Fetch total sales for specific payment methods
        const totalsResult = await pool.query(
            `SELECT
                SUM(order_cost) AS total_sales,
                COUNT(*) AS total_transactions,
                SUM(CASE WHEN payment_method = 'Cash' THEN order_cost ELSE 0 END) AS cash,
                SUM(CASE WHEN payment_method = 'Credit' THEN order_cost ELSE 0 END) AS credit,
                SUM(CASE WHEN payment_method = 'Debit' THEN order_cost ELSE 0 END) AS debit,
                SUM(CASE WHEN payment_method = 'Dining Dollars' THEN order_cost ELSE 0 END) AS dining_dollars
            FROM dailytransactions
            WHERE date = '09-10-2024';`
        );

        // Populate totals object with the query result
        if (totalsResult.rows.length > 0) {
            totals = {
                total_sales: totalsResult.rows[0].total_sales || 0,
                total_transactions: totalsResult.rows[0].total_transactions || 0,
                cash: totalsResult.rows[0].cash || 0,
                credit: totalsResult.rows[0].credit || 0,
                debit: totalsResult.rows[0].debit || 0,
                dining_dollars: totalsResult.rows[0].dining_dollars || 0,
            };
        }

        const data = { zreports, totals }; // Return both hourly data and totals
        res.json(data);
    } catch (error) {
        console.error('Error fetching zreport data:', error);
        res.status(500).send('Error fetching zreport data');
    }
});

// The code will handle the cloud translation API
app.post('/api/translate', async (req, res) => {
    try {
        let translation = await axios.post(`https://translation.googleapis.com/language/translate/v2?key=${process.env.API_KEY}&q=${req.body.text}&target=${req.body.language}`);

        res.json(translation.data.data.translations);
    }
    catch (error) {
        console.log('Error translating text:', error);
    }
});

// Endpoint to get product usage data
app.get('/api/ProductUsage', async (req, res) => {

    const {startDate, endDate, startTime, endTime} = req.query;

    // Validate input parameters
    if (!startDate || !endDate || !startTime || !endTime) {
        console.error("Missing or invalid parameters");
        return res.status(400).json({ error: "Missing or invalid parameters"});
    }

    try {
        //Fetch all transactions within the date and time range
        const transactionQuery = "SELECT lists_of_items FROM dailytransactions WHERE (date > $1 OR (date = $1 AND time >= $2)) AND (date < $3 OR (date = $3 AND time <= $4))";
        const transactionResult = await pool.query(transactionQuery, [startDate, startTime, endDate, endTime]);
        
        //Get all unique menu items
        const allMenuItems = transactionResult.rows
            .flatMap(row => row.lists_of_items.split(',').map(item => item.trim()))
            .filter((item, index, self) => self.indexOf(item) === index);

        //If there are no menu items then inventory usage is empty
        if (allMenuItems.length === 0) {
            return res.json({ inventoryUsage: {} });
        }

        //Fetch all menuMatch data in one query
        const menuMatchQuery = "SELECT menuitem, inventoryitems FROM menumatch WHERE menuitem = ANY($1::text[])";
        const menuMatchResult = await pool.query(menuMatchQuery, [allMenuItems]);

        //Create a map for menu items to inventory items
        const menuMatchMap = {};
        menuMatchResult.rows.forEach(row => {
            menuMatchMap[row.menuitem] = row.inventoryitems.split(',').map(inv => inv.trim());
        });

        //Process inventory items and increment quantity count
        const productUsage = {};
        transactionResult.rows.forEach(row => {
            const items = row.lists_of_items.split(',').map(item => item.trim());

            items.forEach(item => {
                const inventoryItems = menuMatchMap[item] || [];
                inventoryItems.forEach(inventoryItem => {
                    if (!productUsage[inventoryItem]) {
                        productUsage[inventoryItem] = 0;
                    }
                    productUsage[inventoryItem] += 1;
                });
            });
        });


        res.json({ inventoryUsage: productUsage });
    } catch (error) {
        console.error("Error processing product usage data:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
