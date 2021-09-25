// ESM Specific Stuff
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Fastify File
import fastify from "fastify";
import fastifyStatic from "fastify-static";
import fastifyCors from "fastify-cors";
import fastifyCookie from "fastify-cookie";

import "./env.js";
import { connectDB } from "./db.js";
import { registerUser } from "./account/registerUser.js";
import { authorizeUser } from "./account/authorize.js";
import { logUserIn } from "./account/logUserIn.js";
import { getUserFromCookies } from "./account/user.js";
import { logUserOut } from "./account/logUserOut.js";
import { addInternship } from "./internship/addInternship.js";
import { getInternship } from "./internship/getInternship.js";

const app = fastify();

async function startApp() {
  try {
    app.register(fastifyStatic, {
      root: path.join(__dirname, "public"),
    });
    app.register(fastifyCors, {
      origin: [/\.localhost:3000/, "http://localhost:3000"],
      credentials: true,
    });
    app.register(fastifyCookie, {
      secret: process.env.COOKIE_SIGNATURE,
    });

    app.post("/api/register", {}, async (request, reply) => {
      try {
        const res = await registerUser(
          request.body.name,
          request.body.email,
          request.body.password
        );

        if (res.registered) {
          reply.send({
            registered: true,
            text: res.message,
            color: "#32cd32",
            data: {
              name: request.body.name,
              email: request.body.email,
            },
          });
        }

        reply.send({
          registered: false,
          text: res.message,
          color: "#ff4040",

          data: {},
        });
      } catch (error) {
        console.error(error);
      }
    });

    app.post("/api/authorize", {}, async (request, reply) => {
      try {
        const { isAuthorized, userId, userName } = await authorizeUser(
          request.body.email,
          request.body.password
        );

        if (isAuthorized) {
          await logUserIn(userId, request, reply);
          reply.send({
            login: true,
            color: "#32cd32",
            text: "You Are Successfully logged In",
            data: {
              name: userName,
              email: request.body.email,
            },
          });
        }

        reply.send({
          login: false,
          color: "#ff4040",
          text: "Incorrect Email or Password",
          data: {},
        });
      } catch (error) {
        console.error(error);
      }
    });

    app.post("/api/add-internship", {}, async (request, reply) => {
      try {
        const data = request.body.data;
        const { added } = await addInternship(data);
        if (added) {
          reply.send({
            added,
            color: "#32cd32",
            text: "Internship Added Successfully",
          });
        }
        reply.send({
          added,
          color: "#ff4040",
          text: "Failed To Add Internship",
        });
      } catch (error) {
        console.error(error);
        reply.send({
          color: "#ff4040",
          text: "Failed To Add Internship",
        });
      }
    });

    app.post("/api/get-internship", {}, async (request, reply) => {
      try {
        const data = await getInternship();
        if (data.getData) {
          reply.send({
            getData: data.getData,
            result:data.result,
          });
        }
        reply.send({
          getData: data.getData,
        });
      } catch (error) {
        console.error(error);
        reply.send({
          getData: data.getData,
        });
      }
    });

    app.post("/api/logout", {}, async (request, reply) => {
      try {
        await logUserOut(request, reply);
        reply.send({
          logout: true,
        });
      } catch (error) {
        console.error(error);
        reply.send({
          logout: false,
        });
      }
    });

    app.get("/test", {}, async (request, reply) => {
      try {
        //varify user login
        const user = await getUserFromCookies(request, reply);
        if (user?.name) {
          reply.send({
            login: true,
            data: user,
          });
        } else {
          reply.send({
            login: false,
            data: "User LookUp Failed",
          });
        }
        reply.send({
          login: false,
          data: {},
        });
      } catch (error) {
        throw new Error(error);
        reply.send({
          login: false,
          data: {},
        });
      }
    });

    await app.listen(5000);
    console.log("🚀🚀");
  } catch (error) {
    console.error(error);
  }
}

connectDB().then(() => startApp());
