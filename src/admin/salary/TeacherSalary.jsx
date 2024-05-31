function TeacherSalary() {
    return (
        <div className="">

            <div className="relative  shadow-md sm:rounded-lg mt-6 w-[900px] overflow-x-scroll">
                <table className=" text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="text-center">
                                Name
                            </th>
                            <th scope="col" className="text-center p-6">
                                Age
                            </th>
                            <th scope="col" className="text-center p-6">
                                Email
                            </th>
                            <th scope="col" className="text-center p-6">
                                Phone
                            </th>
                            <th scope="col" className="text-center p-6">
                                House Name
                            </th>
                            <th scope="col" className="text-center p-6">
                                Place
                            </th>
                            <th scope="col" className="text-center p-6">
                                City
                            </th>
                            <th scope="col" className="text-center p-6">
                                State
                            </th>
                            <th scope="col" className="text-center p-6">
                                Qualification
                            </th>
                            <th scope="col" className="text-center p-6">
                                Photo
                            </th>
                            <th scope="col" className="text-center p-6">
                                Edit
                            </th>
                            <th scope="col" className="text-center p-6">
                                Remove
                            </th>

                        </tr>
                    </thead>
                  
                </table>
            </div>

        </div>
    )
}

export default TeacherSalary
