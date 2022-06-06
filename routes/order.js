const Order = require("../models/OrderModel");
const Razorpay = require("razorpay");

const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
	const newOrder = new Order(req.body);

	try {
		const savedOrder = await newOrder.save();
		res.status(200).json(savedOrder);
		console.log("order saved suucessfully")
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE
router.put("/:id", async (req, res) => {
	try {
		const updatedOrder = await Order.findByIdAndUpdate(
			(updatedOrder.isPaid = true),
			(updatedOrder.paidAt = Date.now()),
			(updatedOrder.paymentResult = {
				id: req.body.id,
				status: req.body.status,
				update_time: req.body.created_at,
				// email_address: req.body.payer.email_address,
			}),
			console.log(updatedOrder),

			console.log("order found 3")

		);
		console.log("order reset")
		res.status(200).json(updatedOrder);
	} catch (err) {
		console.log("order reset error")

		res.status(500).json(err);
	}
});

//DELETE
router.delete("/:id", async (req, res) => {
	try {
		await Order.findByIdAndDelete(req.params.id);
		res.status(200).json("Order has been deleted...");
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET USER ORDERS
router.get("/:id", async (req, res) => {
	try {
		const id = req.params.id;
		console.log(id);
		const orders = await Order.findById(id);
		console.log(orders);
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json(err);
	}
});

// //GET ALL

router.get("/", async (req, res) => {
	try {
		const orders = await Order.find();
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.put("/:id/pay", async (req, res) => {
	let paymentId;
	let email_address;
	let cardId;
	try {
		const instance = new Razorpay({
			key_id: process.env.KEY_ID,
			key_secret: process.env.KEY_SECRET,
		});

		const order = await Order.findByIdAndUpdate(req.params.id);
		console.log("id")
		console.log(req.params.id);
		const orderID = (order.paymentResult.id);
		console.log("order id form payment result ");
		console.log(orderID)
		const payment = await instance.orders.fetchPayments(orderID, (error, order) => {
			if (error) {
				console.log(error);
				console.log("no order payments");
			}
			else {
				console.log("payment found");
				paymentId = (order.items[0].id);
				email_address = (order.items[0].email);
				cardId = (order.items[0].card_id);
			}
		});
			(order.paymentResult.status = 'paid'),
			(order.paymentResult.paymentId = paymentId),
			(order.paymentResult.email_address = email_address),
			(order.paymentResult.cardId = cardId),
			(order.isPaid = true),
			(order.paidAt = Date.now());
		const updateOrder = await order.save();
		console.log(updateOrder);
		res.status(200).json({ data: updateOrder });
	} catch (error) {
		res.status(404);
		console.log(error)
		throw new Error("Order Not Found");
	}
});
	
////Advanced MongoDB Functions
// GET MONTHLY INCOME

router.get("/income", async (req, res) => {
	const productId = req.query.pid;
	const date = new Date();
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

	try {
		const income = await Order.aggregate([
			{
				$match: {
					createdAt: { $gte: previousMonth },
					...(productId && {
						products: { $elemMatch: { productId } },
					}),
				},
			},
			{
				$project: {
					month: { $month: "$createdAt" },
					sales: "$amount",
				},
			},
			{
				$group: {
					_id: "$month",
					total: { $sum: "$sales" },
				},
			},
		]);
		res.status(200).json(income);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
