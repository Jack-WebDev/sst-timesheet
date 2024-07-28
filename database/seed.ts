// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();
// async function main() {
// 	await prisma.user.createMany({
// 		data: [
// 			{
// 				Name: "Bob",
// 				Surname: "",
// 				Email: "bob@prisma.io",
// 				Department: "I.T",
// 				Role: "Employee",
// 				Status: "Full-Time",
// 			},
// 			{
// 				Name: "Bobo",
// 				Surname: "",
// 				Email: "bob@prisma.io",
// 				Department: "I.T",
// 				Role: "Employee",
// 				Status: "Full-Time",
// 			},
// 			{
// 				Name: "Yewande",
// 				Surname: "",
// 				Email: "yewande@prisma.io",
// 				Department: "I.T",
// 				Role: "Employee",
// 				Status: "Full-Time",
// 			},
// 			{
// 				Name: "Angelique",
// 				Surname: "",
// 				Email: "angelique@prisma.io",
// 				Department: "I.T",
// 				Role: "Employee",
// 				Status: "Full-Time",
// 			},
// 		],
// 		skipDuplicates: true,
// 	});

// 	await prisma.project.createMany({
// 		data: [
// 			{
// 				id: "1",
// 				Project_Name: "Website Redesign",
// 				Department_Id: "1",
// 			},
// 			{
// 				id: "2",
// 				Project_Name: "Social Media Campaign",
// 				Department_Id: "2",
// 			},
// 			{
// 				id: "3",
// 				Project_Name: "Employee Training Program",
// 				Department_Id: "3",
// 			},
// 			{
// 				id: "4",
// 				Project_Name: "Mobile App Development",
// 				Department_Id: "1",
// 			},
// 			{
// 				id: "5",
// 				Project_Name: "Product Launch",
// 				Department_Id: "2",
// 			},
// 			{
// 				id: "6",
// 				Project_Name: "Recruitment Drive",
// 				Department_Id: "3",
// 			},
// 		],
//         skipDuplicates: true,
// 	});

// }
// main()
// 	.then(async () => {
// 		await prisma.$disconnect();
// 	})
// 	.catch(async (e) => {
// 		console.error(e);
// 		await prisma.$disconnect();
// 		process.exit(1);
// 	});
