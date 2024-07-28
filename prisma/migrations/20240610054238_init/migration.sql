-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "Name" TEXT,
    "Surname" TEXT,
    "Email" TEXT,
    "IdNumber" TEXT,
    "MobileNumber" TEXT,
    "Address" TEXT,
    "City" TEXT,
    "ZipCode" TEXT,
    "Province" TEXT,
    "DateOfBirth" TEXT,
    "MaritalStatus" TEXT,
    "Gender" TEXT,
    "Nationality" TEXT,
    "EmployeeType" TEXT,
    "NDTEmail" TEXT,
    "Password" TEXT,
    "departmentId" TEXT,
    "departmentName" TEXT,
    "Role" TEXT DEFAULT 'Employee',
    "Position" TEXT,
    "StartDate" TEXT,
    "OfficeLocation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "Project_Name" TEXT NOT NULL,
    "Project_Manager" TEXT NOT NULL,
    "Client_Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Department_Id" TEXT,
    "assignedMembers" TEXT[],

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "Department_Name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL,
    "taskPerformed" TEXT NOT NULL,
    "taskStatus" TEXT NOT NULL,
    "tableRowId" TEXT NOT NULL,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableDetails" (
    "id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "weeklyPeriod" TEXT NOT NULL,
    "projectManager" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "Approval_Status" TEXT NOT NULL,
    "comments" TEXT,
    "userId" TEXT,

    CONSTRAINT "TableDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableRow" (
    "id" TEXT NOT NULL,
    "weekday" TEXT NOT NULL,
    "typeOfDay" TEXT NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "totalMinutes" DOUBLE PRECISION NOT NULL,
    "comment" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tableDetailsId" TEXT NOT NULL,

    CONSTRAINT "TableRow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_IdNumber_key" ON "User"("IdNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_MobileNumber_key" ON "User"("MobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_NDTEmail_key" ON "User"("NDTEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Project_Project_Name_key" ON "Project"("Project_Name");

-- CreateIndex
CREATE UNIQUE INDEX "Department_Department_Name_key" ON "Department"("Department_Name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_Department_Id_fkey" FOREIGN KEY ("Department_Id") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_tableRowId_fkey" FOREIGN KEY ("tableRowId") REFERENCES "TableRow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableDetails" ADD CONSTRAINT "TableDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableRow" ADD CONSTRAINT "TableRow_tableDetailsId_fkey" FOREIGN KEY ("tableDetailsId") REFERENCES "TableDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableRow" ADD CONSTRAINT "TableRow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
