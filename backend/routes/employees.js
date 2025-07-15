const express = require('express')
const router = express.Router()
const Employee = require('../models/User') // adjust path as needed

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find()
    res.json(employees)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error fetching employees' })
  }
})

module.exports = router
