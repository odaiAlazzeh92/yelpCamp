const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp')
    console.log('data connected')
};
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 450; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30)+10;
        const camp = new Campground({
            author: '631eeb9675def9cd1138213d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [ { 
                url : "https://res.cloudinary.com/da1ej2g0k/image/upload/v1663173762/YelpCamp/bdhzpqeqnwhw6gsyf7mg.jpg",
                filename : "YelpCamp/bdhzpqeqnwhw6gsyf7mg"
                },
                { url : "https://res.cloudinary.com/da1ej2g0k/image/upload/v1663173762/YelpCamp/fhd5zg6c3l8sgbyiwqbf.jpg",
                filename : "YelpCamp/fhd5zg6c3l8sgbyiwqbf"
                },
                { url : "https://res.cloudinary.com/da1ej2g0k/image/upload/v1663173763/YelpCamp/tfqtmh7ecq3fn6nyg5mn.jpg",
                filename : "YelpCamp/tfqtmh7ecq3fn6nyg5mn" 
                } ],
            description: '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat, ipsam voluptatibus vero delectus eum laudantium alias, pariatur possimus quo impedit et perspiciatis necessitatibus quaerat commodi debitis nesciunt ratione? Consectetur, beatae?',
            price,
            geometry : {
                type : "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ] }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})