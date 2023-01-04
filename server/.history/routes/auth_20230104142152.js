//Authentication related routes store here
import express from "express";
const router = express.Router();

router.get( "/users", ( req, res ) =>
{
  res.json( {
    data: "Wayne Yong Kevin Sara",
  } );

} );

export default RTCOutboundRtpStreamStats;