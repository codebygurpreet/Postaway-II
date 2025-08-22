// import required packages
import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {

    // 1. read the token
    const token = req.headers['authorization']; 

    // 2. if no token , send error
    if(!token){
        return res.status(401).send("Unauthorized")
    }
    
    // 3. check if token is valid
    try{
        const payload =  jwt.verify(token,
            "x8T0Gv2zmfOgOAa2tCcvLOaaOPuI2roE"
        )
        req.userID = payload.userID;
        console.log(payload);
    }catch(err){
        // 4. return err
        console.log(err)
        return res.status(401).send("Unauthorized")
    }

    // 5. call next middleware
    next();
}
export default jwtAuth;