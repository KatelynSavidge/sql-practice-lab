require('dotenv').config()
const Sequelize = require('sequelize')

let nextEmp = 5
let {CONNECTION_STRING} = process.env;

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    getUpcomingAppointments: (req, res) => {
        sequelize.query(`select a.appt_id, a.date, a.service_type, a.approved, a.completed, u.first_name, u.last_name 
        from cc_appointments a
        join cc_emp_appts ea on a.appt_id = ea.appt_id
        join cc_employees e on e.emp_id = ea.emp_id
        join cc_users u on e.user_id = u.user_id
        where a.approved = true and a.completed = false
        order by a.date desc;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },

    approveAppointment: (req, res) => {
        let {apptId} = req.body
    
        sequelize.query(`*****YOUR CODE HERE*****
        
        insert into cc_emp_appts (emp_id, appt_id)
        values (${nextEmp}, ${apptId}),
        (${nextEmp + 1}, ${apptId});
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0])
                nextEmp += 2
            })
            .catch(err => console.log(err))
    },

    getAllClients: (req,res) => {
        sequelize.query (`
            SELECT * 
            FROM cc_clients 
            JOIN cc_users 
            ON cc_clients.user_id = cc_users.user_id
        `)
        .then(dbRes => {
            res.status(200).send(dbRes[0])
        })
    },

    getPendingAppointments: (req,res) => {
        sequelize.query (`
            SELECT * 
            FROM cc_appointments
            WHERE cc_appointments.approved is false
            ORDER BY cc_appointments.date DESC;
        `)
        .then (dbRes => {
            res.status(200).send(dbRes[0])
        })
    }, 
    getPastAppointments: (req,res) => {
        sequelize.query (`
            SELECT 
                appt.appt_id, 
                appt.date,
                appt.service_type,
                appt.notes,

                u.first_name,
                u.last_name,
                   
            FROM cc_appointments appt,
            JOIN cc_users u on u.user_id = appt.user_id
            
            WHERE appt.approved is true,
            AND appt.completed is true,

            ORDER BY appt.date DESC;
        `)
        .then (dbRes => {
            res.status(200).send(dbRes[0])
        })
    }
}
