import { Inngest } from "inngest";
import connectDB from './db';
import User from '../models/User';
// Create a client to send and receive events
export const inngest = new Inngest({ id: "quickcart-next" });


//save user data
export const syncUserCreation = inngest.createFunction(
    {
        id:'sync-user-from-clerk',

    },
    {
        event: 'clerk/user.created',
    },
    async ({ event }) => {
      try {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;
        const userData = {
          _id: id,
          email: email_addresses[0]?.email_address,
          name: `${first_name} ${last_name}`,
          imageUrl: image_url
        };
        await connectDB();
        await User.create(userData);
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error, handle gracefully
          // Optionally update the user instead
          await User.findOneAndUpdate({ _id: event.data.id }, userData);
        } else {
          console.error("Error creating user:", error);
          throw error;
        }
      }
    }

);

//update user data
export const syncUserUpdation = inngest.createFunction(
    {id:'update-user-from-clerk'},
    {event: 'clerk/user.updated'},
    async({event})=>{
        const {id,first_name, last_name, email_addresses,image_url} = event.data;
        const userData={
            _id:id,
            email:email_addresses[0].email_address,
            name:first_name +' '+ last_name,
            imageUrl:image_url
        }
        await connectDB();
        await User.findByIdAndUpdate(id,userData);
    }
)

//delete qser data
export const syncUserDeletion = inngest.createFunction(
    {id:'delete-user-with-clerk'},
    {event: 'clerk/user.deleted'},
    async({event})=>{
        const {id} = event.data;
        await connectDB();
        await User.findByIdAndDelete(id);
    }
)