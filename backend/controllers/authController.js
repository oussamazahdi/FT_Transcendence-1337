import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
/*
    request object :
        request.body → POST/PUT data
        request.params → URL parameters (/user/:id)
        request.query → Query strings (?name=kamal)
        request.headers → HTTP headers
        request.method → GET, POST, etc.
        request.url → l'URL path
    Reply object :
        reply.send(data) → bach t-sender response
        reply.code(200) → bach t-setter status code
        reply.header('key', 'value') → bach tzid headers
        reply.status(404).send() → alternative syntax
        reply.type('application/json') → content-type
*/

function generateToken(userId, Username)
{
    const payload = {
        userId: userId,
        username: Username
    };
    return jwt.sign(payload, process.env.JWT_SECRET);
}

async function checkLogin(request, reply)
{
    const { email, password } = request.body;
    const db = request.server.db;
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (error, user) => {
            if (error)
            {
                reply.code(400).send(error.message);
                return resolve();
            }
            if (!user)
            {
                reply.code(401).send({error: "User Not Found, Please Try to signup"});
                return resolve();
            }
            console.log(generateToken(user.id, user.username));
            bcrypt.compare(password, user.password, (error, result) => {
                if (error)
                    reply.code(400).send(error.message);
                if (result)
                {
                    reply.code(200).send({success: true, user: {
                        id: user.id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        username: user.username,
                        email: user.email,
                    }})
                    resolve();
                }
                else
                {
                    reply.code(401).send({error: "wrong password"})
                    return reject();
                }
            })
        });

    })
}


async function registerNewUser(request, reply)
{
    const { firstname, lastname, username, email, password } = request.body;
    const db = request.server.db;
    let cryptedPass = await bcrypt.hash(password, 12);
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO users (firstname, lastname, username, email, password) VALUES (?, ?, ?, ?, ?)`, [firstname, lastname, username, email, cryptedPass], (error) => {
            if (error)
                return reply.code(400).send(error.message);
            else
                return reply.code(201).send("success: " + this.lastID);
        })
    });
}

export { checkLogin, registerNewUser };