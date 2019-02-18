
  
// подключение

  
const { mongoose } = require('./mongoose')

const Schema = mongoose.Schema

const customerSchema = new Schema({
  messenger_id: {
    type: String,
    required: true,
    unique: true
  },
  invitations: [String],
  favourites: {
    type: [String]
  },
  coordinates: {
    phone: String,
    latitude: Number,
    longitude: Number,
    date: String,
    sku: Number,
  },
  purchases: {
    product: String,
    price: String,
    phone: String,
    nps_index: String,

  }
}, { versionKey: false })

const Customer = mongoose.model('Customer', customerSchema)
module.exports = Customer


