const pool = require("../config/db");

exports.createOrder = async (req, res) => {
  try {
    const { table_number, total_amount, notes, items } = req.body;

    if (!table_number || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Table number and items are required",
      });
    }

    const orderNumber = `ORD-${Date.now()}`;

    const orderResult = await pool.query(
      `INSERT INTO orders (order_number, table_number, total_amount, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [orderNumber, table_number, total_amount, notes || null]
    );
    exports.getKitchenOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM orders
      WHERE status IN ('pending', 'preparing', 'ready')
      ORDER BY created_at ASC
    `);

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

    const order = orderResult.rows[0];

    for (const item of items) {
      await pool.query(
        `INSERT INTO order_items (order_id, item_name, quantity, price, subtotal)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, item.item_name, item.quantity, item.price, item.subtotal]
      );
    }

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        orders.*,
        COALESCE(
          json_agg(order_items.*) 
          FILTER (WHERE order_items.id IS NOT NULL),
          '[]'
        ) AS items
      FROM orders
      LEFT JOIN order_items ON orders.id = order_items.order_id
      GROUP BY orders.id
      ORDER BY orders.created_at DESC
    `);

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["pending", "preparing", "ready", "served", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const result = await pool.query(
      `UPDATE orders
        SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getKitchenOrders = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM orders
      WHERE status IN ('pending', 'preparing', 'ready')
      ORDER BY created_at ASC
    `);

    res.json({
      success: true,
      orders: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};