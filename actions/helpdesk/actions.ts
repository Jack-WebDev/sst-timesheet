// "use server";
// import db from "@/database/index";
// import { HelpDeskProps } from "@/types/helpDeskProps";


// export const createAPTicket = async (data:HelpDeskProps) => {
//     try {
//         const apID = await db.aP.create({
//             data: {
//                 property: data.property,
//                 contactPerson: data.contactPerson,
//                 contactNo: data.contactNo,
//             }
//         })

//         const helpDesk = await db.helpDesk.create({
//             data: {
//                 apId: apID.id,
//                 date: data.date,
//                 callDuration: data.callDuration,
//                 campus: data.campus,
//                 query: data.query,
//                 resolve: data.resolve,
//                 client: data.client,
//                 problem: data.problem,
//                 status: data.status,
//             }
//         })
        
//     } catch (error) {
//         console.error("Error creating AP ticket:", error);
//         throw error;
//     }

// }

