const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        console.log(req.body);
        const { username, password, email, firstname, lastname } = req.body;

        // Check if user already exists
        if(!username || !password) return res.status(400).json({msg: 'Username and Password required'});
        let user = await User.findOne({username: username});
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({ username: username, password:password, email:email, firstname:firstname, lastname:lastname, servers:[] });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user to database
        await user.save();

        res.json({ msg: 'User registered successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    try{
        const {username, password} = req.body;

        let user = await User.findOne({username: username});

        if(!user) return res.status(404).json({message: 'No User Found'});

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) return res.status(404).json({message: 'Invalid Credentials'});

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch(err) {
        res.status(500).send('server error');
    }
}