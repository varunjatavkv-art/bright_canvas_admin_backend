import {onRequest} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2";
import app from "../server.js"; 

setGlobalOptions({maxInstances: 10});

export const api = onRequest(
{
 timeoutSeconds: 60,
 maxInstances: 5,
 region: "us-central1",
 memory: "128MiB"
}, 
app
);